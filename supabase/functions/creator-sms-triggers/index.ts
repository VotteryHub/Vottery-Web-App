/**
 * Creator SMS Triggers (cron or manual).
 * Sends Twilio/Telnyx SMS for:
 * - Earnings milestones (milestone_achievements where is_achieved=true, celebration_sent=false)
 * Optionally invoke from app when partnership request or content optimization is created.
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCorsHeaders } from '../shared/corsConfig.ts';

declare const Deno: { env: { get(key: string): string | undefined } };

async function sendSms(supabaseUrl: string, serviceKey: string, to: string, message: string) {
  const res = await fetch(`${supabaseUrl}/functions/v1/send-sms-alert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${serviceKey}`,
    },
    body: JSON.stringify({ to, message, severity: 'info' }),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'));
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const appUrl = Deno.env.get('VITE_APP_URL') || 'https://vottery.com';

    const supabase = createClient(supabaseUrl, serviceKey);

    // 1. Milestone achievements: send SMS and mark celebration_sent
    const { data: milestones, error: milestonesError } = await supabase
      .from('milestone_achievements')
      .select('id, creator_id, milestone_type, milestone_name, milestone_description, target_value, achieved_value, reward_amount')
      .eq('is_achieved', true)
      .eq('celebration_sent', false)
      .limit(50);

    if (milestonesError) throw milestonesError;

    let sent = 0;
    for (const m of milestones || []) {
      const { data: creator } = await supabase
        .from('user_profiles')
        .select('phone_number, full_name')
        .eq('id', m.creator_id)
        .single();

      const phone = creator?.phone_number?.trim();
      if (!phone || !/^\+?[\d\s-]{10,}$/.test(phone)) continue;

      const name = creator?.full_name || 'Creator';
      const amount = m.reward_amount ?? m.achieved_value ?? m.target_value ?? 0;
      const message = `🎉 ${name}, you hit a new milestone: ${m.milestone_name}. ${amount ? `Value: $${Number(amount).toLocaleString()}. ` : ''}View: ${appUrl}/creator-earnings`;

      const { ok } = await sendSms(supabaseUrl, serviceKey, phone, message);
      if (ok) {
        await supabase
          .from('milestone_achievements')
          .update({ celebration_sent: true })
          .eq('id', m.id);
        sent++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        milestonesProcessed: (milestones || []).length,
        smsSent: sent,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('creator-sms-triggers error:', error);
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
