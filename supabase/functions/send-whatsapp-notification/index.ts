import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { getCorsHeaders } from "../shared/corsConfig.ts";

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get("origin"));
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { to, message, channel = "whatsapp", smsProviderStrategy } = await req.json();
    if (!to || !message) {
      return new Response(JSON.stringify({ error: "Missing to/message" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // WhatsApp channel currently uses Twilio. This does NOT change SMS routing policy:
    // SMS remains Telnyx primary with Twilio fallback.
    if (channel !== "whatsapp") {
      return new Response(
        JSON.stringify({
          error: "Unsupported channel for this function",
          channel,
          expected: "whatsapp",
          smsProviderStrategy: smsProviderStrategy || "telnyx_primary_twilio_fallback",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const fromWhatsApp = Deno.env.get("TWILIO_WHATSAPP_FROM");

    if (!accountSid || !authToken || !fromWhatsApp) {
      return new Response(
        JSON.stringify({ error: "Twilio WhatsApp env vars are missing" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = new URLSearchParams({
      From: `whatsapp:${fromWhatsApp}`,
      To: `whatsapp:${to}`,
      Body: message,
    });

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const auth = btoa(`${accountSid}:${authToken}`);
    const twilioResp = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const payload = await twilioResp.json();
    if (!twilioResp.ok) {
      return new Response(JSON.stringify({ error: "Twilio send failed", details: payload }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, sid: payload.sid }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

