declare const Deno: any;
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.87.1';
import * as speakeasy from 'https://esm.sh/speakeasy@2.0.0';
import QRCode from 'https://esm.sh/qrcode@1.5.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { action, userId, token } = await req.json();

    let response;

    switch (action) {
      case 'setup':
        response = await setupMFA(supabaseClient, userId);
        break;
      case 'verify':
        response = await verifyMFA(supabaseClient, userId, token);
        break;
      case 'regenerate_backup_codes':
        response = await regenerateBackupCodes(supabaseClient, userId);
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