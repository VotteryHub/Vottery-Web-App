/**
 * Records IP/country on login and flags rapid country changes (geo velocity).
 * Invoke from Web/Mobile after INITIAL_SESSION / SIGNED_IN (throttled client-side).
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCorsHeaders } from '../shared/corsConfig.ts';
import { getClientIp } from '../shared/sqlInjectionDetection.ts';

declare const Deno: {
  env: { get(key: string): string | undefined };
};

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'));
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, serviceKey);
    const ip = getClientIp(req);
    const ua = req.headers.get('user-agent') ?? null;

    let countryIso: string | null = null;
    let region: string | null = null;
    try {
      if (ip && ip !== 'unknown') {
        const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
        if (geoRes.ok) {
          const geo = await geoRes.json();
          countryIso = geo.country_code ?? null;
          region = geo.region ?? null;
        }
      }
    } catch (e) {
      console.warn('Geo lookup failed', e);
    }

    await supabase.from('user_geo_login_events').insert({
      user_id: user.id,
      ip_address: ip,
      country_iso: countryIso,
      region,
      user_agent: ua,
    });

    const { data: recent } = await supabase
      .from('user_geo_login_events')
      .select('country_iso, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3);

    if (recent && recent.length >= 2) {
      const newest = recent[0] as { country_iso?: string; created_at?: string };
      const prev = recent[1] as { country_iso?: string; created_at?: string };
      const c1 = newest.country_iso;
      const c2 = prev.country_iso;
      if (c1 && c2 && c1 !== c2) {
        const t1 = new Date(newest.created_at ?? 0).getTime();
        const t2 = new Date(prev.created_at ?? 0).getTime();
        const hours = Math.abs(t1 - t2) / (1000 * 60 * 60);
        if (hours < 6) {
          await supabase.from('security_events').insert({
            event_type: 'geo_velocity_anomaly',
            severity: 'medium',
            user_id: user.id,
            ip_address: ip,
            country: c1,
            region,
            reason: `Country changed from ${c2} to ${c1} within ${hours.toFixed(2)}h`,
            request_data: { previous_country: c2, current_country: c1 },
            blocked: false,
          });
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, country_iso: countryIso }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('record-login-geo error:', error);
    const c = getCorsHeaders(req.headers.get('origin'));
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...c, 'Content-Type': 'application/json' } }
    );
  }
});
