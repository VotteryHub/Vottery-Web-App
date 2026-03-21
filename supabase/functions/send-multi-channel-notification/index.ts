import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { getCorsHeaders } from "../shared/corsConfig.ts";

/// <reference lib="deno.ns" />

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get("origin"));
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders
    });
  }

  try {
    const { recipients, subject, htmlContent, incidentId, severity } = await req.json();

    if (!recipients || recipients.length === 0) {
      return new Response(JSON.stringify({ error: 'No recipients provided' }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }

    const RESEND_API_KEY = Deno.env.get('VITE_RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('Resend API key not configured');
    }

    const emailPromises = recipients.map(async (recipient: any) => {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev',
          to: recipient.email,
          subject: subject || `Incident Notification - ${severity || 'Medium'} Severity`,
          html: htmlContent
        })
      });

      const data = await response.json();
      return {
        recipient: recipient.email,
        messageId: data.id,
        status: response.ok ? 'sent' : 'failed',
        error: response.ok ? null : data.message
      };
    });

    const results = await Promise.all(emailPromises);

    return new Response(JSON.stringify({
      success: true,
      incidentId,
      results,
      totalSent: results.filter(r => r.status === 'sent').length,
      totalFailed: results.filter(r => r.status === 'failed').length
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
});