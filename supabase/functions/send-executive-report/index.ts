import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

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
    const { reportId, reportType, title, reportData, recipients, stakeholderGroupId } = await req?.json();

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

    const resendApiKey = (globalThis as any)?.Deno?.env?.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const emailSubject = `Executive Report: ${title}`;
    const emailHtml = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #4F46E5; color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .report-section { background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
            .metric-card { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #4F46E5; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Executive Report</h1>
            <p>${reportType?.replace(/_/g, ' ')?.toUpperCase()}</p>
          </div>
          <div class="content">
            <h2>${title}</h2>
            <p>Report generated on: ${new Date()?.toLocaleString()}</p>
            
            <div class="report-section">
              <h3>Report Summary</h3>
              <p>This executive report provides comprehensive insights into platform performance, financial metrics, and strategic recommendations.</p>
            </div>

            <div class="metrics">
              <div class="metric-card">
                <h4>Total Revenue</h4>
                <p style="font-size: 24px; font-weight: bold; color: #4F46E5;">₹${reportData?.total_revenue?.toLocaleString() || 'N/A'}</p>
              </div>
              <div class="metric-card">
                <h4>Total Participants</h4>
                <p style="font-size: 24px; font-weight: bold; color: #4F46E5;">${reportData?.total_participants?.toLocaleString() || 'N/A'}</p>
              </div>
              <div class="metric-card">
                <h4>Average ROI</h4>
                <p style="font-size: 24px; font-weight: bold; color: #4F46E5;">${reportData?.average_roi || 'N/A'}%</p>
              </div>
              <div class="metric-card">
                <h4>Growth Rate</h4>
                <p style="font-size: 24px; font-weight: bold; color: #059669;">+${reportData?.growth_rate || 'N/A'}%</p>
              </div>
            </div>

            <div class="report-section">
              <h3>Key Insights</h3>
              <ul>
                <li>Top performing zone: ${reportData?.top_zone?.replace('_', ' ')?.toUpperCase() || 'N/A'}</li>
                <li>Platform showing strong growth trajectory</li>
                <li>Stakeholder engagement remains high</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <p>This is an automated executive report from Vottery Platform.</p>
            <p>For questions or concerns, please contact your platform administrator.</p>
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
        
        emailResults?.push({
          recipient: recipient?.email,
          status: emailResponse?.ok ? 'sent' : 'failed',
          messageId: emailData?.id,
          error: emailResponse?.ok ? null : emailData?.message
        });
      } catch (error) {
        emailResults?.push({
          recipient: recipient?.email,
          status: 'failed',
          error: error?.message
        });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      reportId,
      stakeholderGroupId,
      deliveryResults: emailResults,
      totalSent: emailResults?.filter(r => r?.status === 'sent')?.length,
      totalFailed: emailResults?.filter(r => r?.status === 'failed')?.length
    }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error?.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
});