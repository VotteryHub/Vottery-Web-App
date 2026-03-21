import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCorsHeaders } from '../shared/corsConfig.ts';
import { checkWebhookIdempotency } from '../shared/webhookSecurity.ts';
import {
  getClientIp,
  logSqlInjectionEvent,
  scanPayloadForSqlInjection,
} from '../shared/sqlInjectionDetection.ts';

// Deno global type declaration for environments where Deno is not implicitly available
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

const TELNYX_API_KEY = Deno.env.get('TELNYX_API_KEY');
const TELNYX_PHONE_NUMBER = Deno.env.get('TELNYX_PHONE_NUMBER');
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const DISCORD_WEBHOOK_URL = Deno.env.get('VITE_DISCORD_WEBHOOK_URL');

interface PredictionRecord {
  id: string;
  user_id: string;
  election_id: string;
  predictions: Record<string, number>;
  brier_score?: number;
  status: 'active' | 'resolved' | 'locked';
  created_at: string;
  updated_at?: string;
}

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: PredictionRecord;
  old_record?: PredictionRecord;
  schema: string;
}

async function sendTelnyxSMS(to: string, message: string): Promise<void> {
  if (!TELNYX_API_KEY || !TELNYX_PHONE_NUMBER) return;
  try {
    await fetch('https://api.telnyx.com/v2/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TELNYX_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: TELNYX_PHONE_NUMBER,
        to,
        text: message,
      }),
    });
  } catch (err) {
    console.error('Telnyx SMS error:', err);
  }
}

async function sendResendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!RESEND_API_KEY) return;
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Vottery <notifications@vottery.com>',
        to: [to],
        subject,
        html,
      }),
    });
  } catch (err) {
    console.error('Resend email error:', err);
  }
}

async function sendDiscordNotification(message: string, title: string): Promise<void> {
  if (!DISCORD_WEBHOOK_URL || DISCORD_WEBHOOK_URL === 'your-discord-webhook-url-here') return;
  try {
    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title,
          description: message,
          color: 0x6366f1,
          timestamp: new Date().toISOString(),
        }],
      }),
    });
  } catch (err) {
    console.error('Discord webhook error:', err);
  }
}

async function getUserPreferences(supabase: ReturnType<typeof createClient>, userId: string) {
  const { data } = await supabase
    .from('user_preferences')
    .select('notification_settings, phone_number, email')
    .eq('user_id', userId)
    .single();
  return data;
}

async function getElectionDetails(supabase: ReturnType<typeof createClient>, electionId: string) {
  const { data } = await supabase
    .from('elections')
    .select('title, end_date, status')
    .eq('id', electionId)
    .single();
  return data;
}

async function getLeaderboardRank(supabase: ReturnType<typeof createClient>, userId: string, electionId: string): Promise<number> {
  const { data } = await supabase
    .from('election_predictions')
    .select('user_id, brier_score')
    .eq('election_id', electionId)
    .not('brier_score', 'is', null)
    .order('brier_score', { ascending: true });

  if (!data) return -1;
  const rank = data.findIndex(r => r.user_id === userId) + 1;
  return rank;
}

serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'));
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload: WebhookPayload = await req.json();
    const clientIp = getClientIp(req);
    const sqli = scanPayloadForSqlInjection(payload as unknown);
    if (sqli.blocking) {
      await logSqlInjectionEvent({
        ip: clientIp,
        userId: null,
        endpoint: '/prediction-pool-notifications',
        result: sqli,
        blocked: true,
      });
      return new Response(JSON.stringify({ error: 'Invalid payload' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (sqli.hit) {
      await logSqlInjectionEvent({
        ip: clientIp,
        userId: null,
        endpoint: '/prediction-pool-notifications',
        result: sqli,
        blocked: false,
      });
    }

    const { type, record, old_record } = payload;

    if (!record?.user_id || !record?.election_id || !record?.id) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const idemTs = record.updated_at || record.created_at || Math.floor(Date.now() / 1000);
    const idemOk = await checkWebhookIdempotency(
      `prediction-pool:${type}:${record.id}`,
      typeof idemTs === 'string' ? Math.floor(new Date(idemTs).getTime() / 1000) : Number(idemTs)
    );
    if (!idemOk) {
      return new Response(
        JSON.stringify({ success: true, duplicate: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const [userPrefs, election] = await Promise.all([
      getUserPreferences(supabase, record.user_id),
      getElectionDetails(supabase, record.election_id),
    ]);

    const notifSettings = userPrefs?.notification_settings || {};
    const userPhone = userPrefs?.phone_number;
    const userEmail = userPrefs?.email;

    // ── INSERT: New prediction created ──
    if (type === 'INSERT') {
      const message = `🎯 Prediction locked in for "${election?.title || 'Election'}"! Your prediction is active. Good luck!`;

      if (notifSettings?.prediction_confirmations !== false) {
        if (userPhone) await sendTelnyxSMS(userPhone, message);
        if (userEmail) {
          await sendResendEmail(
            userEmail,
            `Prediction Confirmed: ${election?.title}`,
            `<p>${message}</p><p>Track your prediction at <a href="https://vottery5399.builtwithrocket.new/election-prediction-pools-interface">Vottery Prediction Pools</a></p>`
          );
        }
      }

      // Check lock-in countdowns if election end_date is set
      if (election?.end_date) {
        const endDate = new Date(election.end_date);
        const now = new Date();
        const hoursUntilEnd = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60);

        let countdownMsg = '';
        if (hoursUntilEnd <= 0.25) countdownMsg = `⏰ FINAL 15 MINUTES to update your prediction for "${election.title}"!`;
        else if (hoursUntilEnd <= 1) countdownMsg = `⏰ 1 hour left to update your prediction for "${election.title}"!`;
        else if (hoursUntilEnd <= 24) countdownMsg = `⏰ 24 hours left to update your prediction for "${election.title}"!`;

        if (countdownMsg && notifSettings?.prediction_countdowns !== false) {
          if (userPhone) await sendTelnyxSMS(userPhone, countdownMsg);
        }
      }

      // Pool creation notification (Discord)
      await sendDiscordNotification(
        `New prediction submitted for pool: **${election?.title}** by user ${record.user_id.slice(0, 8)}...`,
        '🎯 New Prediction Pool Activity'
      );
    }

    // ── UPDATE: Prediction resolved or status changed ──
    if (type === 'UPDATE') {
      // Resolution event
      if (record.status === 'resolved' && old_record?.status !== 'resolved') {
        const rank = await getLeaderboardRank(supabase, record.user_id, record.election_id);
        const accuracy = record.brier_score !== undefined
          ? `${Math.round((1 - record.brier_score) * 100)}%`
          : 'N/A';

        const resolutionMsg = `🏆 Pool resolved: "${election?.title}"! Your accuracy: ${accuracy}. Rank: #${rank > 0 ? rank : 'N/A'}. Check your VP rewards!`;

        if (notifSettings?.pool_resolutions !== false) {
          if (userPhone) await sendTelnyxSMS(userPhone, resolutionMsg);
          if (userEmail) {
            await sendResendEmail(
              userEmail,
              `Pool Resolved: ${election?.title} — Your Results`,
              `<h2>Pool Resolved!</h2><p>${resolutionMsg}</p><p><a href="https://vottery5399.builtwithrocket.new/election-prediction-pools-interface">View Full Results</a></p>`
            );
          }
        }

        await sendDiscordNotification(
          `Pool **${election?.title}** has been resolved. Winner accuracy: ${accuracy}`,
          '✅ Prediction Pool Resolved'
        );
      }

      // Leaderboard rank change notification
      if (record.brier_score !== undefined && old_record?.brier_score !== record.brier_score) {
        const newRank = await getLeaderboardRank(supabase, record.user_id, record.election_id);
        if (newRank > 0 && newRank <= 10 && notifSettings?.leaderboard_changes !== false) {
          const rankMsg = `📊 You're now ranked #${newRank} in the "${election?.title}" prediction pool!`;
          if (userPhone) await sendTelnyxSMS(userPhone, rankMsg);
        }
      }
    }

    // Store notification in DB
    await supabase.from('notifications').insert({
      user_id: record.user_id,
      type: type === 'INSERT' ? 'prediction_created' : 'prediction_updated',
      title: type === 'INSERT' ? 'Prediction Confirmed' : 'Prediction Updated',
      message: `Your prediction for "${election?.title}" has been ${type === 'INSERT' ? 'confirmed' : 'updated'}.`,
      metadata: { election_id: record.election_id, prediction_id: record.id },
      read: false,
    }).catch(() => {}); // Non-critical

    return new Response(
      JSON.stringify({ success: true, processed: type, election: election?.title }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('prediction-pool-notifications error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
