// Creator prize compliance: flag gamified elections that ended 14+ days ago
// and are not yet in creator_prize_compliance_flags (for admin review / red-flag).
// Invoke via cron (e.g. daily) or manually.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

const GRACE_DAYS = 14;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - GRACE_DAYS);
    const cutoffIso = cutoff.toISOString();

    // Gamified elections that ended at least GRACE_DAYS ago (end_date + end_time)
    const { data: elections, error: electionsError } = await supabase
      .from('elections')
      .select('id, created_by, end_date, end_time, title')
      .eq('is_gamified', true)
      .not('created_by', 'is', null);

    if (electionsError) {
      return new Response(
        JSON.stringify({ error: electionsError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build end timestamp: end_date + end_time (default 23:59)
    const endedElections = (elections || []).filter((e) => {
      const endDate = e.end_date;
      if (!endDate) return false;
      const endTime = e.end_time || '23:59';
      const endStr = `${endDate}T${endTime}:00.000Z`;
      const endTs = new Date(endStr);
      return endTs.getTime() <= cutoff.getTime();
    });

    // Already flagged election IDs
    const { data: existing } = await supabase
      .from('creator_prize_compliance_flags')
      .select('election_id');
    const flaggedIds = new Set((existing || []).map((r) => r.election_id));

    const toFlag = endedElections.filter((e) => !flaggedIds.has(e.id));
    const inserted: string[] = [];

    for (const e of toFlag) {
      const { error: insertErr } = await supabase
        .from('creator_prize_compliance_flags')
        .insert({
          user_id: e.created_by,
          election_id: e.id,
          flag_type: 'unpaid_prize',
          notes: `Auto-flagged: gamified election ended ${GRACE_DAYS}+ days ago; prize compliance not yet resolved.`,
        });
      if (!insertErr) inserted.push(e.id);
    }

    // Red-flag/blacklist: set prize_compliance_red_flagged_at for users with 3+ unpaid_prize flags
    const { data: flagCounts } = await supabase
      .from('creator_prize_compliance_flags')
      .select('user_id')
      .eq('flag_type', 'unpaid_prize');
    const countByUser: Record<string, number> = {};
    for (const row of flagCounts || []) {
      const uid = row.user_id as string;
      countByUser[uid] = (countByUser[uid] || 0) + 1;
    }
    const RED_FLAG_THRESHOLD = 3;
    for (const [userId, count] of Object.entries(countByUser)) {
      if (count >= RED_FLAG_THRESHOLD) {
        await supabase
          .from('user_profiles')
          .update({
            prize_compliance_red_flagged_at: new Date().toISOString(),
            prize_compliance_red_flag_count: count,
          })
          .eq('id', userId);
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        checked: (elections || []).length,
        endedAfterGrace: endedElections.length,
        alreadyFlagged: flaggedIds.size,
        newlyFlagged: inserted.length,
        electionIds: inserted,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
