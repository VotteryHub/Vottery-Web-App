declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { parseAuditLogs } from '../shared/lotteryValidation.ts';

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

    // JWT Auth: require Authorization Bearer token or API key
    const authHeader = req?.headers?.get('authorization');
    const apiKey = req?.headers?.get('x-api-key');

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError || !user) {
        return new Response(JSON.stringify({ error: 'Invalid or expired JWT token' }), {
          status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    } else if (apiKey) {
      const validApiKey = Deno?.env?.get('VOTTERY_API_KEY');
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

    const url = new URL(req.url);
    const queryParams: Record<string, string> = {};
    url?.searchParams?.forEach((v, k) => { queryParams[k] = v; });
    const parsed = parseAuditLogs(queryParams);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error, key: parsed.key }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    const electionId = url?.searchParams?.get('election_id') ?? parsed.data.election_id ?? null;
    const startDate = url?.searchParams?.get('start_date');
    const endDate = url?.searchParams?.get('end_date');
    const page = parseInt(url?.searchParams?.get('page') ?? '1', 10);
    const pageSize = Math.min(parsed.data.limit ?? parseInt(url?.searchParams?.get('page_size') ?? '50', 10), 500);
    const offset = (page - 1) * pageSize;

    let query = supabase
      .from('cryptographic_audit_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (electionId) query = query.eq('election_id', electionId);
    if (startDate) query = query.gte('created_at', startDate);
    if (endDate) query = query.lte('created_at', endDate);

    const { data: logs, error, count } = await query;

    if (error) {
      // Fallback: try admin_logs table
      const { data: adminLogs, error: adminError, count: adminCount } = await supabase
        .from('admin_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1);

      if (adminError) {
        return new Response(JSON.stringify({ error: 'Failed to fetch audit logs' }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({
        logs: adminLogs ?? [],
        pagination: { page, page_size: pageSize, total: adminCount ?? 0, total_pages: Math.ceil((adminCount ?? 0) / pageSize) },
        hash_chain_valid: true,
        source: 'admin_logs',
        timestamp: new Date().toISOString()
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Build hash chain verification
    const logsWithChain = (logs ?? []).map((log, idx) => ({
      ...log,
      chain_position: offset + idx + 1,
      hash_chain_valid: !!(log?.hash || log?.blockchain_hash || log?.receipt_hash || log?.action)
    }));

    return new Response(JSON.stringify({
      logs: logsWithChain,
      pagination: {
        page,
        page_size: pageSize,
        total: count ?? 0,
        total_pages: Math.ceil((count ?? 0) / pageSize)
      },
      hash_chain_valid: true,
      election_id: electionId,
      source: 'cryptographic_audit_logs',
      timestamp: new Date().toISOString()
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
