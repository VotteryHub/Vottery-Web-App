declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

serve(async (req) => {
  // CORS preflight
  if (req?.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "*"
      }
    });
  }

  try {
    const { reportId, reportType, recipients, data, subject, htmlContent } = await req?.json();

    // Validate required fields
    if (!reportId || !recipients || !Array.isArray(recipients) || recipients?.length === 0) {
      return new Response(JSON.stringify({
        error: "Missing required fields: reportId, recipients"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // Get Resend API key from environment
    const resendApiKey = Deno?.env?.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    // Prepare email content
    const emailSubject = subject || `${reportType} Report - ${new Date()?.toLocaleDateString()}`;
    const emailHtml = htmlContent || `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .data-section { background: #f5f5f5; padding: 15px; margin: 15px 0; border-radius: 8px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Scheduled Report</h1>
          </div>
          <div class="content">
            <h2>${reportType?.replace(/_/g, ' ')?.toUpperCase()}</h2>
            <p>Report generated on: ${new Date()?.toLocaleString()}</p>
            <div class="data-section">
              <pre>${JSON.stringify(data, null, 2)}</pre>
            </div>
          </div>
          <div class="footer">
            <p>This is an automated report from your platform.</p>
          </div>
        </body>
      </html>
    `;

    // Send emails to all recipients
    const emailResults = [];
    for (const recipient of recipients) {
      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: "onboarding@resend.dev",
            to: recipient?.email,
            subject: emailSubject,
            html: emailHtml
          })
        });

        const emailData = await emailResponse?.json();
        
        if (emailResponse?.ok) {
          emailResults?.push({
            recipient: recipient?.email,
            status: "sent",
            messageId: emailData?.id
          });
        } else {
          emailResults?.push({
            recipient: recipient?.email,
            status: "failed",
            error: emailData?.message || "Unknown error"
          });
        }
      } catch (error) {
        emailResults?.push({
          recipient: recipient?.email,
          status: "failed",
          error: error?.message
        });
      }
    }

    // Check if all emails sent successfully
    const allSent = emailResults?.every(r => r?.status === "sent");
    const someFailed = emailResults?.some(r => r?.status === "failed");

    return new Response(JSON.stringify({
      success: allSent,
      reportId,
      emailResults,
      summary: {
        total: recipients.length,
        sent: emailResults.filter(r => r.status === "sent").length,
        failed: emailResults.filter(r => r.status === "failed").length
      },
      message: allSent ? "All emails sent successfully" : someFailed ? "Some emails failed to send" : "All emails failed"
    }), {
      status: allSent ? 200 : 207,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
});