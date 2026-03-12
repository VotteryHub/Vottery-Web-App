/**
 * Participatory Ads budget alert: notify Slack/Discord when a sponsored election
 * reaches 90% of budget. Run via cron (e.g. every 15 min) or manually.
 * Env: SLACK_WEBHOOK_URL and/or DISCORD_WEBHOOK_URL (optional).
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

declare const Deno: { env: { get(key: string): string | undefined } };

const BUDGET_THRESHOLD = 0.9; // 90%

async function postSlack(webhookUrl: string, text: string, color: string) {
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      attachments: [{ fallback: text, color, title: 'Participatory Ads Budget Alert', text }],
    }),
  });
  return res.ok;
}

async function postDiscord(webhookUrl: string, text: string) {
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: `**Participatory Ads Budget Alert**\n${text}` }),
  });
  return res.ok;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const slackUrl = Deno.env.get('SLACK_WEBHOOK_URL') || '';
    const discordUrl = Deno.env.get('DISCORD_WEBHOOK_URL') || '';

    const supabase = createClient(supabaseUrl, serviceKey);

    // Sponsored elections (and vottery_ads if you use it) where spend >= 90% of budget
    const { data: rows, error } = await supabase
      .from('sponsored_elections')
      .select('id, election_id, brand_id, budget_total, budget_spent, status, created_at')
      .eq('status', 'active')
      .gt('budget_total', 0);

    if (error) throw error;

    const now = new Date();
    const alerts: { id: string; title: string; ratio: number; budget_total: number; budget_spent: number }[] = [];

    for (const row of rows || []) {
      const total = Number(row.budget_total) || 0;
      const spent = Number(row.budget_spent) || 0;
      if (total <= 0) continue;
      const ratio = spent / total;
      if (ratio >= BUDGET_THRESHOLD) {
        const { data: election } = await supabase
          .from('elections')
          .select('title')
          .eq('id', row.election_id)
          .single();
        alerts.push({
          id: row.id,
          title: election?.title || row.election_id || row.id,
          ratio,
          budget_total: total,
          budget_spent: spent,
        });
      }
    }

    let sent = 0;
    if (alerts.length > 0 && (slackUrl || discordUrl)) {
      const text = alerts
        .map(
          (a) =>
            `• "${a.title}" at ${(a.ratio * 100).toFixed(0)}% budget ($${a.budget_spent.toFixed(2)} / $${a.budget_total.toFixed(2)})`
        )
        .join('\n');
      const fullText = `The following sponsored election(s) are at or above ${BUDGET_THRESHOLD * 100}% budget:\n${text}`;
      if (slackUrl) {
        const ok = await postSlack(slackUrl, fullText, '#e8a010');
        if (ok) sent++;
      }
      if (discordUrl) {
        const ok = await postDiscord(discordUrl, fullText);
        if (ok) sent++;
      }

      // Mark alert_sent_at so we don't spam (optional column)
      for (const a of alerts) {
        await supabase
          .from('sponsored_elections')
          .update({ alert_sent_at: now.toISOString() })
          .eq('id', a.id);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        checked: rows?.length ?? 0,
        lowBudgetCount: alerts.length,
        alertsSent: sent,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('participatory-ads-budget-alert error:', error);
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
