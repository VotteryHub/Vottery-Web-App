import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

serve(async (req) => {
  if (req?.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { token } = await req?.json();

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