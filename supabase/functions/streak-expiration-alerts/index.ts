import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCorsHeaders } from '../shared/corsConfig.ts';

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'));
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const nowIso = new Date().toISOString();

    const { data: dueReminders, error: dueError } = await supabase
      .from('user_streak_reminders')
      .select('id, user_id, reminder_type, scheduled_for')
      .eq('status', 'scheduled')
      .lte('scheduled_for', nowIso)
      .order('scheduled_for', { ascending: true })
      .limit(500);

    if (dueError) {
      throw dueError;
    }

    if (!dueReminders?.length) {
      return new Response(
        JSON.stringify({ processed: 0, sent: 0, failed: 0, message: 'No due streak reminders' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    let sent = 0;
    let failed = 0;

    for (const reminder of dueReminders) {
      const title = reminder.reminder_type === 'streak_expiry_24h'
        ? 'Your voting streak expires in 24 hours'
        : 'Your voting streak expires in 1 hour';
      const body = reminder.reminder_type === 'streak_expiry_24h'
        ? 'Vote now to protect your streak and keep earning rewards.'
        : 'Final reminder: cast a vote now to preserve your streak.';

      const { error: inAppError } = await supabase
        .from('notifications')
        .insert({
          user_id: reminder.user_id,
          title,
          message: body,
          type: 'streak_reminder',
          data: { reminderType: reminder.reminder_type, source: 'streak-expiration-alerts' },
          is_read: false,
        });

      if (inAppError) {
        failed += 1;
        await supabase.from('notification_delivery_logs').insert({
          user_id: reminder.user_id,
          category: 'streak_expiration',
          channel: 'in_app',
          entity_id: String(reminder.id),
          status: 'failed',
          error_message: inAppError.message,
          metadata: { reminderType: reminder.reminder_type },
        });
        await supabase
          .from('user_streak_reminders')
          .update({ status: 'failed' })
          .eq('id', reminder.id);
        continue;
      }

      await supabase.from('notification_delivery_logs').insert({
        user_id: reminder.user_id,
        category: 'streak_expiration',
        channel: 'in_app',
        entity_id: String(reminder.id),
        status: 'sent',
        metadata: { reminderType: reminder.reminder_type },
        sent_at: new Date().toISOString(),
      });

      // Optional SMS delivery hook. Keep best-effort so in-app delivery is not blocked.
      try {
        const smsRes = await supabase.functions.invoke('send-stakeholder-sms', {
          body: {
            recipients: [{ userId: reminder.user_id }],
            message: body,
            type: 'streak_expiration',
          },
        });
        await supabase.from('notification_delivery_logs').insert({
          user_id: reminder.user_id,
          category: 'streak_expiration',
          channel: 'sms',
          entity_id: String(reminder.id),
          status: smsRes?.error ? 'failed' : 'sent',
          error_message: smsRes?.error?.message ?? null,
          metadata: { reminderType: reminder.reminder_type },
          sent_at: smsRes?.error ? null : new Date().toISOString(),
        });
      } catch {
        await supabase.from('notification_delivery_logs').insert({
          user_id: reminder.user_id,
          category: 'streak_expiration',
          channel: 'sms',
          entity_id: String(reminder.id),
          status: 'failed',
          error_message: 'SMS provider invocation failed',
          metadata: { reminderType: reminder.reminder_type },
        });
      }

      const { error: markSentError } = await supabase
        .from('user_streak_reminders')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .eq('id', reminder.id);

      if (markSentError) {
        failed += 1;
      } else {
        sent += 1;
      }
    }

    return new Response(
      JSON.stringify({ processed: dueReminders.length, sent, failed }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
