import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { parseTicketsVerify } from '../shared/lotteryValidation.ts';
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // JWT Auth: require Authorization header with Bearer token
    const authHeader = req.headers.get('authorization');
    const apiKey = req.headers.get('x-api-key');

    let authenticatedUserId: string | null = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError || !user) {
        return new Response(JSON.stringify({ error: 'Invalid or expired JWT token' }), {
          status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      authenticatedUserId = user.id;
    } else if (apiKey) {
      // API key auth for server-to-server calls
      const validApiKey = Deno.env.get('VOTTERY_API_KEY');
      if (validApiKey && apiKey !== validApiKey) {
        return new Response(JSON.stringify({ error: 'Invalid API key' }), {
          status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    } else {
      return new Response(JSON.stringify({ error: 'Unauthorized: provide Bearer token or x-api-key' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    let voteId: string | null = null;
    let electionId: string | null = null;

    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      const parsed = parseTicketsVerify(body);
      if (!parsed.success) {
        return new Response(JSON.stringify({ error: parsed.error, key: parsed.key }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      voteId = parsed.data.vote_id;
      electionId = parsed.data.election_id ?? null;
    } else {
      const url = new URL(req.url);
      voteId = url.searchParams.get('vote_id');
      electionId = url.searchParams.get('election_id');
      const parsed = parseTicketsVerify({ vote_id: voteId || '', election_id: electionId || undefined });
      if (!parsed.success) {
        return new Response(JSON.stringify({ error: parsed.error, key: parsed.key }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Query vote record
    let query = supabase
      .from('votes')
      .select('id, election_id, user_id, created_at, blockchain_hash, is_counted, receipt_hash')
      .eq('id', voteId);
    if (electionId) query = query.eq('election_id', electionId);

    const { data: vote, error } = await query.single();

    if (error || !vote) {
      return new Response(JSON.stringify({
        verified: false,
        vote_id: voteId,
        message: 'Vote not found',
        timestamp: new Date().toISOString()
      }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const hashValid = !!(vote.blockchain_hash || vote.receipt_hash);

    // Log audit entry
    await supabase.from('cryptographic_audit_logs').insert({
      election_id: vote.election_id,
      action: 'ticket_verify',
      actor_id: authenticatedUserId || vote.user_id,
      details: { vote_id: voteId, hash_valid: hashValid, verified_by: authenticatedUserId },
      created_at: new Date().toISOString()
    }).select().single().catch(() => null);

    return new Response(JSON.stringify({
      verified: true,
      vote_id: vote.id,
      election_id: vote.election_id,
      is_counted: vote.is_counted ?? true,
      hash_valid: hashValid,
      blockchain_hash: vote.blockchain_hash,
      receipt_hash: vote.receipt_hash,
      created_at: vote.created_at,
      timestamp: new Date().toISOString()
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
