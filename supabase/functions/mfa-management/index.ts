declare const Deno: any;
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.87.1';
import * as speakeasy from 'https://esm.sh/speakeasy@2.0.0';
import QRCode from 'https://esm.sh/qrcode@1.5.3';
import { getCorsHeaders } from '../shared/corsConfig.ts';
import {
  getClientIp,
  logSqlInjectionEvent,
  scanPayloadForSqlInjection,
} from '../shared/sqlInjectionDetection.ts';
import { enforceUserEndpointHourlyLimit } from '../shared/userEndpointRateLimit.ts';

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'));
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const body = await req.json();
    const clientIp = getClientIp(req);
    const sqli = scanPayloadForSqlInjection(body);
    if (sqli.blocking) {
      await logSqlInjectionEvent({
        ip: clientIp,
        userId: user.id,
        endpoint: '/mfa-management',
        result: sqli,
        blocked: true,
      });
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (sqli.hit) {
      await logSqlInjectionEvent({
        ip: clientIp,
        userId: user.id,
        endpoint: '/mfa-management',
        result: sqli,
        blocked: false,
      });
    }

    const rl = await enforceUserEndpointHourlyLimit(
      userClient,
      user.id,
      '/mfa-management',
      60
    );
    if (!rl.allowed) {
      return new Response(JSON.stringify({ error: 'MFA rate limit exceeded' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, userId, token } = body;
    const targetUserId = userId ?? user.id;
    if (targetUserId !== user.id) {
      throw new Error('Forbidden: userId mismatch');
    }

    const serviceClient = createClient(supabaseUrl, serviceKey);

    let response;

    switch (action) {
      case 'setup':
        response = await setupMFA(serviceClient, targetUserId);
        break;
      case 'verify':
        response = await verifyMFA(serviceClient, targetUserId, token);
        break;
      case 'regenerate_backup_codes':
        response = await regenerateBackupCodes(serviceClient, targetUserId);
        break;
      default:
        throw new Error('Invalid action');
    }

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function setupMFA(supabaseClient: any, userId: string) {
  // Generate secret
  const secret = speakeasy.generateSecret({
    name: `Vottery (${userId.substring(0, 8)})`,
    length: 32,
  });

  // Generate QR code
  const qrCode = await QRCode.toDataURL(secret.otpauth_url);

  // Generate backup codes
  const backupCodes = Array.from({ length: 10 }, () =>
    Math.random().toString(36).substring(2, 10).toUpperCase()
  );

  // Store in database (not enabled yet)
  await supabaseClient.from('mfa_secrets').upsert({
    user_id: userId,
    secret: secret.base32,
    backup_codes: backupCodes,
    enabled: false,
  });

  return {
    secret: secret.base32,
    qrCode,
    backupCodes,
  };
}

async function verifyMFA(supabaseClient: any, userId: string, token: string) {
  // Get user's MFA secret
  const { data: mfaData, error } = await supabaseClient
    .from('mfa_secrets')
    .select('secret, backup_codes, enabled')
    .eq('user_id', userId)
    .single();

  if (error || !mfaData) {
    throw new Error('MFA not set up');
  }

  // Check if it's a backup code
  if (mfaData.backup_codes?.includes(token)) {
    // Remove used backup code
    const updatedCodes = mfaData.backup_codes.filter((code: string) => code !== token);
    await supabaseClient
      .from('mfa_secrets')
      .update({ backup_codes: updatedCodes })
      .eq('user_id', userId);

    return { valid: true, method: 'backup_code' };
  }

  // Verify TOTP token
  const verified = speakeasy.totp.verify({
    secret: mfaData.secret,
    encoding: 'base32',
    token,
    window: 2, // Allow 2 time steps before/after
  });

  if (verified && !mfaData.enabled) {
    // First successful verification - enable MFA
    await supabaseClient
      .from('mfa_secrets')
      .update({ enabled: true, last_used_at: new Date().toISOString() })
      .eq('user_id', userId);
  } else if (verified) {
    // Update last used timestamp
    await supabaseClient
      .from('mfa_secrets')
      .update({ last_used_at: new Date().toISOString() })
      .eq('user_id', userId);
  }

  return { valid: verified, method: 'totp' };
}

async function regenerateBackupCodes(supabaseClient: any, userId: string) {
  // Generate new backup codes
  const backupCodes = Array.from({ length: 10 }, () =>
    Math.random().toString(36).substring(2, 10).toUpperCase()
  );

  // Update in database
  await supabaseClient
    .from('mfa_secrets')
    .update({ backup_codes: backupCodes })
    .eq('user_id', userId);

  return { backupCodes };
}