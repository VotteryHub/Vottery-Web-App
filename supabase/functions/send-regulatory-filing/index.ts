import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { getCorsHeaders } from "../shared/corsConfig.ts";

declare const Deno: any;

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get("origin"));
  if (req?.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders
    });
  }

  try {
    const { filingData, recipientEmail, jurisdiction, logId } = await req?.json();

    const resendApiKey = Deno?.env?.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }

    const emailSubject = `Regulatory Filing: ${filingData?.filing_type?.replace('_', ' ')?.toUpperCase()} - ${jurisdiction}`;
    const emailBody = `
      <h2>Regulatory Filing Submission</h2>
      <p><strong>Filing Type:</strong> ${filingData?.filing_type?.replace('_', ' ')}</p>
      <p><strong>Jurisdiction:</strong> ${jurisdiction}</p>
      <p><strong>Regulatory Authority:</strong> ${filingData?.regulatory_authority}</p>
      <p><strong>Filing Reference:</strong> ${filingData?.filing_reference || 'N/A'}</p>
      <p><strong>Submission Date:</strong> ${new Date()?.toISOString()}</p>
      <hr>
      <h3>Filing Details</h3>
      <pre>${JSON.stringify(filingData?.filing_data, null, 2)}</pre>
      <hr>
      <p><em>This is an automated regulatory submission from Vottery Compliance System.</em></p>
      <p><em>Log ID: ${logId}</em></p>
    `;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: [recipientEmail],
        subject: emailSubject,
        html: emailBody
      })
    });

    if (!resendResponse?.ok) {
      const errorData = await resendResponse?.json();
      throw new Error(`Resend API error: ${errorData?.message || 'Unknown error'}`);
    }

    const resendData = await resendResponse?.json();

    return new Response(JSON.stringify({
      success: true,
      messageId: resendData?.id,
      recipient: recipientEmail,
      jurisdiction: jurisdiction,
      timestamp: new Date().toISOString()
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