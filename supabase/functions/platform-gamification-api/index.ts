import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.87.1';
import { getCorsHeaders } from '../shared/corsConfig.ts';

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function validateApiKey(req: Request): boolean {
  const apiKey = req.headers.get('x-api-key') || req.headers.get('authorization')?.replace('Bearer ', '');
  const validKey = Deno.env.get('PLATFORM_GAMIFICATION_API_KEY');
  return !!validKey && !!apiKey && apiKey === validKey;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'));
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (!validateApiKey(req)) {
    return jsonResponse({ error: 'Unauthorized. Valid x-api-key or Authorization header required.' }, 401);
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const url = new URL(req.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const baseIdx = pathParts.indexOf('platform-gamification-api');
  const parts = baseIdx >= 0 ? pathParts.slice(baseIdx + 1) : pathParts;

  try {
    if (parts[0] === 'campaigns') {
      const campaignId = parts[1];

      if (req.method === 'GET' && !campaignId) {
        const { data, error } = await supabase
          .from('platform_gamification_campaigns')
          .select('*')
          .eq('is_enabled', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return jsonResponse({ campaigns: data });
      }

      if (req.method === 'GET' && campaignId) {
        const { data: campaign, error: campErr } = await supabase
          .from('platform_gamification_campaigns')
          .select('*')
          .eq('id', campaignId)
          .single();

        if (campErr || !campaign) {
          return jsonResponse({ error: 'Campaign not found' }, 404);
        }

        const { data: rules } = await supabase
          .from('gamification_allocation_rules')
          .select('*')
          .eq('campaign_id', campaignId)
          .eq('is_active', true)
          .order('priority_order');

        return jsonResponse({ ...campaign, allocation_rules: rules || [] });
      }

      if (req.method === 'POST' && !campaignId) {
        const body = await req.json();
        const { data, error } = await supabase
          .from('platform_gamification_campaigns')
          .insert(body)
          .select()
          .single();

        if (error) throw error;
        return jsonResponse(data, 201);
      }

      if (req.method === 'PUT' && campaignId) {
        const body = await req.json();
        const { data, error } = await supabase
          .from('platform_gamification_campaigns')
          .update({ ...body, updated_at: new Date().toISOString() })
          .eq('id', campaignId)
          .select()
          .single();

        if (error) throw error;
        return jsonResponse(data);
      }
    }

    if (parts[0] === 'campaigns' && parts[2] === 'allocation-rules' && parts[1]) {
      const campaignId = parts[1];
      if (req.method === 'PUT') {
        const body = await req.json();
        const rules = Array.isArray(body) ? body : body?.rules || [body];
        const results = [];
        for (const rule of rules) {
          const { data, error } = await supabase
            .from('gamification_allocation_rules')
            .upsert({ ...rule, campaign_id: campaignId, updated_at: new Date().toISOString() }, { onConflict: 'id' })
            .select()
            .single();
          if (!error) results.push(data);
        }
        return jsonResponse({ allocation_rules: results });
      }
    }

    if (parts[0] === 'winners' && parts[1]) {
      const campaignId = parts[1];
      if (req.method === 'GET') {
        const { data, error } = await supabase
          .from('platform_gamification_winners')
          .select('*')
          .eq('campaign_id', campaignId)
          .order('winner_selected_at', { ascending: false });

        if (error) throw error;
        return jsonResponse({ winners: data });
      }
    }

    return jsonResponse({ error: 'Not found', path: url.pathname }, 404);
  } catch (err) {
    console.error('Platform Gamification API error:', err);
    return jsonResponse({ error: err?.message || 'Internal server error' }, 500);
  }
});
