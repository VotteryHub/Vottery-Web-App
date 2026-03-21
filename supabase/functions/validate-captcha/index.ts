import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { getCorsHeaders } from '../shared/corsConfig.ts';
import { validateIPForSensitiveOperation } from '../shared/ipGeolocation.ts';
import {
  getClientIp,
  logSqlInjectionEvent,
  scanPayloadForSqlInjection,
} from '../shared/sqlInjectionDetection.ts';

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'));
  if (req?.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req?.json();
    const { token } = body || {};
    const clientIp = getClientIp(req);

    const sqli = scanPayloadForSqlInjection(body);
    if (sqli.blocking) {
      await logSqlInjectionEvent({
        ip: clientIp,
        userId: null,
        endpoint: '/validate-captcha',
        result: sqli,
        blocked: true,
      });
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid request' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (sqli.hit) {
      await logSqlInjectionEvent({
        ip: clientIp,
        userId: null,
        endpoint: '/validate-captcha',
        result: sqli,
        blocked: false,
      });
    }

    const geoOk = await validateIPForSensitiveOperation(clientIp);
    if (!geoOk) {
      return new Response(
        JSON.stringify({ success: false, error: 'Request blocked for compliance reasons' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!token) {
      throw new Error('CAPTCHA token is required');
    }

    const hcaptchaSecret = Deno?.env?.get('HCAPTCHA_SECRET_KEY');
    if (!hcaptchaSecret) {
      throw new Error('hCaptcha secret key not configured');
    }

    // Verify token with hCaptcha
    const verifyResponse = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${hcaptchaSecret}&response=${token}`,
    });

    const verifyData = await verifyResponse?.json();

    return new Response(
      JSON.stringify({
        success: verifyData.success,
        challenge_ts: verifyData.challenge_ts,
        hostname: verifyData.hostname,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});