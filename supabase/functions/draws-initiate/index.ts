import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { parseDrawsInitiate } from '../shared/lotteryValidation.ts';
import { getCorsHeaders } from '../shared/corsConfig.ts';

declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
};

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'));
  if (req?.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req?.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const supabaseUrl = Deno?.env?.get('SUPABASE_URL') ?? '';
    const serviceRoleKey = Deno?.env?.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // STRICT JWT Auth: require Authorization Bearer token
    const authHeader = req?.headers?.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Bearer token required' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid or expired JWT token' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // ADMIN-ONLY: Check user_profiles.role via RLS check
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: 'User profile not found' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const adminRoles = ['admin', 'super_admin'];
    if (!adminRoles.includes(profile.role)) {
      return new Response(JSON.stringify({
        error: 'Forbidden: admin role required to initiate draws',
        user_role: profile.role,
        required_roles: adminRoles
      }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const body = await req?.json().catch(() => ({}));
    const parsed = parseDrawsInitiate(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error, key: parsed.key }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    const { election_id, draw_type = 'random', num_winners = 1 } = parsed.data;

    // Verify election exists
    const { data: election, error: electionError } = await supabase
      .from('elections')
      .select('id, title, status, creator_id')
      .eq('id', election_id)
      .single();

    if (electionError || !election) {
      return new Response(JSON.stringify({ error: 'Election not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get eligible votes
    const { data: votes, error: votesError } = await supabase
      .from('votes')
      .select('id, user_id, created_at')
      .eq('election_id', election_id);

    if (votesError || !votes || votes.length === 0) {
      return new Response(JSON.stringify({ error: 'No eligible votes found for draw' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Cryptographically random winner selection - ordered 1st, 2nd, 3rd... for slot machine sequential reveal
    const shuffled = [...votes].sort(() => Math.random() - 0.5);
    const winners = shuffled.slice(0, Math.min(num_winners, votes.length)).map((w, i) => ({
      ...w,
      winner_position: i + 1, // 1st, 2nd, 3rd... for slot machine ordered reveal
    }));

    const drawId = crypto.randomUUID();
    const drawTimestamp = new Date().toISOString();

    // Log to audit trail
    await supabase.from('cryptographic_audit_logs').insert({
      election_id,
      action: 'draw_initiated',
      actor_id: user.id,
      details: { draw_id: drawId, num_winners, total_eligible: votes.length, draw_type, admin_role: profile.role },
      created_at: drawTimestamp
    }).select().single().catch(() => null);

    // Dispatch webhook via webhook-dispatcher with retry logic
    const webhookPayload = {
      event: 'draw_completed',
      election_id,
      draw_id: drawId,
      timestamp: drawTimestamp,
      winners: winners.map(w => w.user_id), // backward compat
      winner_details: winners.map(w => ({ user_id: w.user_id, position: w.winner_position })), // ordered 1st, 2nd, 3rd...
      total_eligible: votes.length,
      initiated_by: user.id
    };

    // Call webhook-dispatcher edge function (handles retry with exponential backoff)
    const supabaseFunctionsUrl = `${supabaseUrl}/functions/v1/webhook-dispatcher`;
    fetch(supabaseFunctionsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`
      },
      body: JSON.stringify({
        event: 'draw_completed',
        election_id,
        payload: webhookPayload
      })
    }).catch(() => null); // fire-and-forget

    return new Response(JSON.stringify({
      success: true,
      draw_id: drawId,
      election_id,
      draw_type,
      total_eligible: votes.length,
      num_winners,
      winners: winners.map(w => ({
        vote_id: w.id,
        user_id: w.user_id,
        winner_position: w.winner_position, // 1st, 2nd, 3rd... for slot machine sequential reveal
      })),
      initiated_by: user.id,
      admin_role: profile.role,
      timestamp: drawTimestamp
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
