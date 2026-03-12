declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-api-key, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// 5-attempt exponential backoff: 1s, 2s, 4s, 8s, 16s
const MAX_RETRIES = 5;
const RETRY_DELAYS_MS = [1000, 2000, 4000, 8000, 16000];

interface DispatchResult {
  success: boolean;
  status?: number;
  error?: string;
  attempts: number;
  final_delay_ms?: number;
}

async function dispatchWithExponentialBackoff(
  url: string,
  payload: object,
  attempt = 0
): Promise<DispatchResult> {
  try {
    // Validate URL protocol
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { success: false, error: 'Invalid URL protocol', attempts: attempt + 1 };
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Vottery-Event': (payload as any).event ?? 'unknown',
        'X-Vottery-Attempt': String(attempt + 1),
        'X-Vottery-Timestamp': new Date().toISOString()
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000)
    });

    if (res.ok) {
      return { success: true, status: res.status, attempts: attempt + 1 };
    }

    // Retry on 5xx server errors
    if (res.status >= 500 && attempt < MAX_RETRIES - 1) {
      const delay = RETRY_DELAYS_MS[attempt];
      await new Promise(r => setTimeout(r, delay));
      return dispatchWithExponentialBackoff(url, payload, attempt + 1);
    }

    return { success: false, status: res.status, error: `HTTP ${res.status}`, attempts: attempt + 1 };

  } catch (err) {
    if (attempt < MAX_RETRIES - 1) {
      const delay = RETRY_DELAYS_MS[attempt];
      await new Promise(r => setTimeout(r, delay));
      return dispatchWithExponentialBackoff(url, payload, attempt + 1);
    }
    return {
      success: false,
      error: (err as any).message,
      attempts: attempt + 1,
      final_delay_ms: RETRY_DELAYS_MS[Math.min(attempt, RETRY_DELAYS_MS.length - 1)]
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
    const { event, election_id, payload: eventPayload } = body;

    const validEvents = ['draw_completed', 'vote_cast'];
    if (!event || !validEvents.includes(event)) {
      return new Response(JSON.stringify({ error: `Invalid event. Must be one of: ${validEvents.join(', ')}` }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Fetch registered webhooks for this event from webhook_config table
    const { data: webhooks, error: whError } = await supabase
      .from('webhook_config')
      .select('id, url, events, is_active, name')
      .contains('events', [event])
      .eq('is_active', true);

    if (whError || !webhooks || webhooks.length === 0) {
      return new Response(JSON.stringify({
        dispatched: 0,
        message: 'No active webhooks registered for this event',
        event,
        timestamp: new Date().toISOString()
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const dispatchPayload = {
      event,
      election_id: election_id ?? null,
      timestamp: new Date().toISOString(),
      ...eventPayload
    };

    // Dispatch to all registered webhooks with 5-attempt exponential backoff
    const results = await Promise.all(
      webhooks.map(async (wh) => {
        const startTime = Date.now();
        const result = await dispatchWithExponentialBackoff(wh.url, dispatchPayload);
        const durationMs = Date.now() - startTime;

        // Track dispatch status in webhook_config table
        await supabase
          .from('webhook_config')
          .update({
            last_triggered_at: new Date().toISOString(),
            last_status: result.success ? 'success' : 'failed',
            failure_count: result.success ? 0 : (wh as any).failure_count + 1
          })
          .eq('id', wh.id)
          .catch(() => null);

        // Log dispatch result in webhook_delivery_logs
        await supabase.from('webhook_delivery_logs').insert({
          webhook_id: wh.id,
          event,
          election_id: election_id ?? null,
          success: result.success,
          status_code: result.status ?? null,
          error_message: result.error ?? null,
          attempts: result.attempts,
          duration_ms: durationMs,
          dispatched_at: new Date().toISOString()
        }).select().single().catch(() => null);

        return {
          webhook_id: wh.id,
          webhook_name: wh.name ?? wh.url,
          url: wh.url,
          success: result.success,
          status: result.status,
          error: result.error,
          attempts: result.attempts,
          duration_ms: durationMs
        };
      })
    );

    const successCount = results.filter(r => r.success).length;

    return new Response(JSON.stringify({
      dispatched: successCount,
      total: webhooks.length,
      failed: webhooks.length - successCount,
      max_retries: MAX_RETRIES,
      retry_delays_ms: RETRY_DELAYS_MS,
      results,
      event,
      timestamp: new Date().toISOString()
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (err) {
    return new Response(JSON.stringify({ error: (err as any).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
