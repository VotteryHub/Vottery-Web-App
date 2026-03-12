/**
 * Blockchain query API - stub for audit/blockchain-query
 * Returns cryptographic audit logs (simulated blockchain data)
 * When real blockchain is integrated, this will query the chain
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-api-key, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

serve(async (req) => {
  if (req?.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno?.env?.get('SUPABASE_URL') ?? '';
    const serviceRoleKey = Deno?.env?.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const authHeader = req?.headers?.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Bearer token required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const electionId = url?.searchParams?.get('election_id');
    const voteId = url?.searchParams?.get('vote_id');
    const action = url?.searchParams?.get('action') ?? 'audit_logs';

    if (action === 'audit_logs') {
      let query = supabase
        .from('cryptographic_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (electionId) query = query.eq('election_id', electionId);

      const { data: logs, error } = await query;
      if (error) throw error;

      return new Response(
        JSON.stringify({
          network: 'simulated',
          networkName: 'Ethereum Mainnet (Simulated)',
          data: logs,
          message: 'Audit logs from cryptographic_audit_logs. Real blockchain integration pending.',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'bulletin_board' && electionId) {
      const { data: votes, error } = await supabase
        .from('votes')
        .select('id, vote_hash, blockchain_hash, created_at')
        .eq('election_id', electionId)
        .order('created_at', { ascending: false })
        .limit(500);

      if (error) throw error;

      return new Response(
        JSON.stringify({
          electionId,
          entries: (votes || []).map((v) => ({
            voteId: v?.id,
            voteHash: v?.vote_hash,
            blockchainHash: v?.blockchain_hash,
            timestamp: v?.created_at,
          })),
          network: 'simulated',
          message: 'Public bulletin board of vote hashes for verification. Real blockchain integration pending.',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'verify_vote' && voteId) {
      const { data: vote, error } = await supabase
        .from('votes')
        .select('id, vote_hash, blockchain_hash, election_id, created_at')
        .eq('id', voteId)
        .single();

      if (error || !vote) {
        return new Response(
          JSON.stringify({ error: 'Vote not found', verified: false }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          verified: !!(vote?.vote_hash || vote?.blockchain_hash),
          voteId: vote?.id,
          hasHash: !!vote?.vote_hash,
          hasBlockchainHash: !!vote?.blockchain_hash,
          network: 'simulated',
          message: 'Vote hash verification. Real blockchain verification pending.',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action. Use action=audit_logs, action=bulletin_board&election_id=..., or action=verify_vote&vote_id=...' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err?.message ?? 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
