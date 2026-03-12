// @ts-ignore: Deno is available in Deno runtime
const Deno = globalThis.Deno;

// Telnyx primary, Twilio fallback
const TELNYX_API_KEY = Deno?.env?.get('TELNYX_API_KEY');
const TELNYX_FROM_NUMBER = Deno?.env?.get('TELNYX_FROM_NUMBER');
const TWILIO_ACCOUNT_SID = Deno?.env?.get('TWILIO_ACCOUNT_SID');
const TWILIO_AUTH_TOKEN = Deno?.env?.get('TWILIO_AUTH_TOKEN');
const TWILIO_PHONE_NUMBER = Deno?.env?.get('TWILIO_PHONE_NUMBER');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*'
};

async function sendViaTelnyx(to: string, message: string): Promise<{ success: boolean; provider: string; sid?: string; error?: string }> {
  if (!TELNYX_API_KEY || !TELNYX_FROM_NUMBER) {
    return { success: false, provider: 'telnyx', error: 'TELNYX_API_KEY or TELNYX_FROM_NUMBER not configured' };
  }
  const res = await fetch('https://api.telnyx.com/v2/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TELNYX_API_KEY}`
    },
    body: JSON.stringify({
      from: TELNYX_FROM_NUMBER,
      to: to,
      text: message
    })
  });
  const data = await res?.json?.();
  if (!res?.ok) {
    console.error('Telnyx API error:', data);
    return { success: false, provider: 'telnyx', error: data?.errors?.[0]?.detail || data?.message || 'Telnyx send failed' };
  }
  return { success: true, provider: 'telnyx', sid: data?.data?.id };
}

async function sendViaTwilio(to: string, message: string): Promise<{ success: boolean; provider: string; sid?: string; error?: string }> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    return { success: false, provider: 'twilio', error: 'Twilio env not configured' };
  }
  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  const credentials = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
  const formData = new URLSearchParams({
    To: to,
    From: TWILIO_PHONE_NUMBER,
    Body: message
  });
  const res = await fetch(twilioUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData
  });
  const data = await res?.json?.();
  if (!res?.ok) {
    console.error('Twilio API error:', data);
    return { success: false, provider: 'twilio', error: data?.message || 'Twilio send failed' };
  }
  return { success: true, provider: 'twilio', sid: data?.sid };
}

Deno?.serve(async (req) => {
  if (req?.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, message, alertId, severity } = await req?.json?.();

    if (!to || !message) {
      return new Response(JSON.stringify({
        error: 'Missing required fields: to, message'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Try Telnyx first (primary), then Twilio (fallback)
    let result = await sendViaTelnyx(to, message);
    if (!result.success && result.error) {
      console.warn('Telnyx failed, trying Twilio fallback:', result.error);
      result = await sendViaTwilio(to, message);
    }

    if (!result.success) {
      return new Response(JSON.stringify({
        error: 'Failed to send SMS',
        details: result.error,
        provider: result.provider
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      messageSid: result.sid,
      provider: result.provider,
      alertId: alertId,
      severity: severity
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error?.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
