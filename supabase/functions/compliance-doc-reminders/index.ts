/**
 * Compliance doc expiration reminders (cron).
 * Finds creator_compliance_documents expiring in 30/15/7 days or expired,
 * creates document_renewal_reminders and sets reminder_sent_at so reminders are sent once per bucket.
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

declare const Deno: { env: { get(key: string): string | undefined } };

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const now = new Date();
    const in30 = new Date(now);
    in30.setDate(in30.getDate() + 30);
    const in15 = new Date(now);
    in15.setDate(in15.getDate() + 15);
    const in7 = new Date(now);
    in7.setDate(in7.getDate() + 7);

    const { data: docs, error } = await supabase
      .from('creator_compliance_documents')
      .select('id, creator_id, document_type, document_name, expiration_date, reminder_sent_at')
      .in('status', ['pending', 'approved'])
      .not('expiration_date', 'is', null)
      .lte('expiration_date', in30.toISOString().slice(0, 10));

    if (error) throw error;

    let created = 0;
    for (const doc of docs || []) {
      const exp = doc.expiration_date ? new Date(doc.expiration_date) : null;
      if (!exp) continue;
      const daysLeft = Math.ceil((exp.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
      let reminderType: string;
      if (daysLeft <= 0) reminderType = 'expired';
      else if (daysLeft <= 7) reminderType = '7_days';
      else if (daysLeft <= 15) reminderType = '15_days';
      else reminderType = '30_days';

      const { data: existing } = await supabase
        .from('document_renewal_reminders')
        .select('id')
        .eq('document_id', doc.id)
        .eq('reminder_type', reminderType)
        .limit(1)
        .single();

      if (existing) continue;

      const scheduledFor = new Date(now);
      scheduledFor.setMinutes(scheduledFor.getMinutes() + 1);

      const { error: insErr } = await supabase.from('document_renewal_reminders').insert({
        document_id: doc.id,
        creator_id: doc.creator_id,
        reminder_type: reminderType,
        scheduled_for: scheduledFor.toISOString(),
        delivery_method: 'in_app',
        status: 'scheduled',
      });
      if (!insErr) created++;
    }

    return new Response(
      JSON.stringify({
        success: true,
        documentsChecked: docs?.length ?? 0,
        remindersCreated: created,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('compliance-doc-reminders error:', error);
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
