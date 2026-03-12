import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-api-key, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type Action = 'scale' | 'pause_elections' | 'circuit_breaker' | 'rollback' | 'full';

serve(async (req) => {
  if (req?.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req?.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const supabaseUrl = Deno?.env?.get('SUPABASE_URL') ?? '';
    const serviceRoleKey = Deno?.env?.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const authHeader = req?.headers?.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'super_admin'].includes(profile?.role ?? '')) {
      return new Response(JSON.stringify({ error: 'Admin role required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req?.json().catch(() => ({}));
    const action: Action = body?.action ?? 'full';
    const simulatedUsers = body?.simulatedUsers ?? 0;
    const reason = body?.reason ?? 'Load test threshold exceeded';

    const results: Record<string, unknown> = {
      triggered: true,
      action,
      simulatedUsers,
      reason,
      timestamp: new Date().toISOString(),
      steps: [],
    };

    if (action === 'scale' || action === 'full') {
      if (simulatedUsers >= 500000) {
        await supabase.from('system_alerts').insert({
          alert_type: 'load_scaling',
          severity: 'high',
          message: `Scale Supabase connections: ${simulatedUsers} simulated users`,
          details: { action, simulatedUsers, reason },
          created_at: new Date().toISOString(),
        });
        (results.steps as string[]).push('scale_triggered');
      }
    }

    if (action === 'pause_elections' || action === 'full') {
      const { data: elections } = await supabase
        .from('elections')
        .select('id, title')
        .eq('status', 'active')
        .limit(50);

      if (elections?.length) {
        for (const e of elections) {
          await supabase
            .from('elections')
            .update({ status: 'paused', updated_at: new Date().toISOString() })
            .eq('id', e.id);
        }
        (results.steps as string[]).push(`paused_${elections.length}_elections`);
      }
    }

    if (action === 'circuit_breaker' || action === 'full') {
      await supabase.from('system_alerts').insert({
        alert_type: 'circuit_breaker',
        severity: 'critical',
        message: 'Circuit breakers activated from load testing',
        details: { action, reason },
        created_at: new Date().toISOString(),
      });
      (results.steps as string[]).push('circuit_breaker_activated');
    }

    if (action === 'rollback') {
      const { data: paused } = await supabase
        .from('elections')
        .select('id')
        .eq('status', 'paused');

      if (paused?.length) {
        for (const e of paused) {
          await supabase
            .from('elections')
            .update({ status: 'active', updated_at: new Date().toISOString() })
            .eq('id', e.id);
        }
        (results.steps as string[]).push(`rollback_${paused.length}_elections`);
      }
    }

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err?.message ?? 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
