/// <reference lib="deno.ns" />
/// <reference types="npm:@types/deno" />

declare const Deno: any;
import { getCorsHeaders } from '../shared/corsConfig.ts';

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER');

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'));
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    const { recipients, message, incidentId, severity, escalationLevel } = await req.json();

    if (!recipients || recipients.length === 0 || !message) {
      return new Response(JSON.stringify({
        error: 'Missing required fields: recipients, message'
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const credentials = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);

    const smsPromises = recipients.map(async (recipient: any) => {
      const phoneNumber = recipient.phone || recipient;
      const formData = new URLSearchParams({
        To: phoneNumber,
        From: TWILIO_PHONE_NUMBER || '',
        Body: `[${severity?.toUpperCase() || 'ALERT'}] ${message}\n\nIncident ID: ${incidentId || 'N/A'}\nEscalation: ${escalationLevel || 'Standard'}`
      });

      const response = await fetch(twilioUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      });

      const data = await response.json();

      return {
        recipient: phoneNumber,
        messageSid: data.sid,
        status: response.ok ? 'sent' : 'failed',
        error: response.ok ? null : data.message
      };
    });

    const results = await Promise.all(smsPromises);

    return new Response(JSON.stringify({
      success: true,
      incidentId,
      results,
      totalSent: results.filter(r => r.status === 'sent').length,
      totalFailed: results.filter(r => r.status === 'failed').length
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error: any) {
    console.error('Error sending SMS:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});