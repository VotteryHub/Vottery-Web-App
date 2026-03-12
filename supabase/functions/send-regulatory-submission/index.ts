import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

declare const Deno: any;

serve(async (req) => {
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
    const { submissionId, filingId, jurisdiction, regulatoryAuthority, recipients, subject, htmlContent, attachmentUrls } = await req?.json();

    if (!submissionId || !recipients || !Array.isArray(recipients) || recipients?.length === 0) {
      return new Response(JSON.stringify({
        error: "Missing required fields: submissionId, recipients"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // Add this line - Declare Deno for edge function environment
    // @ts-ignore - Deno is available in Deno runtime
    const resendApiKey = Deno?.env?.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const emailSubject = subject || `Regulatory Filing Submission - ${jurisdiction} - ${new Date()?.toLocaleDateString()}`;
    const emailHtml = htmlContent || `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .info-section { background: #f5f5f5; padding: 15px; margin: 15px 0; border-radius: 8px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .label { font-weight: bold; color: #4F46E5; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Regulatory Filing Submission</h1>
          </div>
          <div class="content">
            <p>Dear ${regulatoryAuthority},</p>
            <p>Please find the regulatory filing submission details below:</p>
            <div class="info-section">
              <p><span class="label">Filing ID:</span> ${filingId}</p>
              <p><span class="label">Jurisdiction:</span> ${jurisdiction}</p>
              <p><span class="label">Regulatory Authority:</span> ${regulatoryAuthority}</p>
              <p><span class="label">Submission Date:</span> ${new Date()?.toLocaleString()}</p>
            </div>
            ${attachmentUrls && attachmentUrls?.length > 0 ? `
              <div class="info-section">
                <p class="label">Attached Documents:</p>
                <ul>
                  ${attachmentUrls?.map(url => `<li><a href="${url}">${url?.split('/')?.pop()}</a></li>`)?.join('')}
                </ul>
              </div>
            ` : ''}
            <p>This submission has been automatically generated and distributed through our compliance management system.</p>
            <p>For any questions or clarifications, please contact our compliance team.</p>
          </div>
          <div class="footer">
            <p>This is an automated regulatory submission from Vottery Platform.</p>
            <p>Submission ID: ${submissionId}</p>
          </div>
        </body>
      </html>
    `;

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

    const allSent = emailResults?.every(r => r?.status === "sent");
    const someFailed = emailResults?.some(r => r?.status === "failed");

    return new Response(JSON.stringify({
      success: allSent,
      submissionId,
      messageId: emailResults.find(r => r.status === "sent")?.messageId,
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