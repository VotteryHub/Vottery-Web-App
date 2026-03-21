/**
 * Authenticated, per-creator churn refresh (max once per UTC day per user).
 * Mobile/Web can invoke after login so creators get fresh scores without calling the full cron.
 * Full batch remains creator-churn-prediction-cron (protect with CRON_SECRET).
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCorsHeaders } from '../shared/corsConfig.ts';
import { checkWebhookIdempotency } from '../shared/webhookSecurity.ts';

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

serve(async (req) => {
  let corsHeaders = getCorsHeaders(req.headers.get('origin'));
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
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')!;

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

    const { count, error: electionErr } = await supabase
      .from('elections')
      .select('id', { count: 'exact', head: true })
      .eq('created_by', user.id);

    if (electionErr) throw electionErr;
    if (!count || count < 1) {
      return new Response(
        JSON.stringify({ error: 'Churn refresh is available to users who have created elections.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const dayBucket = Math.floor(Date.now() / 86400000);
    const firstOfDay = await checkWebhookIdempotency(
      `creator-churn-user-refresh:${user.id}`,
      dayBucket
    );
    if (!firstOfDay) {
      return new Response(
        JSON.stringify({ success: true, skipped: true, message: 'Already refreshed today' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const creator = { id: user.id };
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recentActivity } = await supabase
      .from('creator_activity_logs')
      .select('id')
      .eq('creator_id', creator.id)
      .gte('created_at', fourteenDaysAgo.toISOString());

    const { data: previousActivity } = await supabase
      .from('creator_activity_logs')
      .select('id')
      .eq('creator_id', creator.id)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .lt('created_at', fourteenDaysAgo.toISOString());

    const recentCount = recentActivity?.length || 0;
    const previousCount = previousActivity?.length || 0;
    const activityDecline = previousCount > 0
      ? ((previousCount - recentCount) / previousCount) * 100
      : 0;

    const prompt = `Predict churn risk for creator with:
- Activity decline: ${activityDecline.toFixed(1)}%
- Recent actions (14d): ${recentCount}
- Previous actions (14-30d): ${previousCount}

Respond with JSON only: {"churnRiskScore": <0-100>, "riskLevel": "low|medium|high|critical", "urgency": "immediate|within_week|monitor"}`;

    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const claudeResult = await claudeResponse.json();
    const content = claudeResult?.content?.[0]?.text || '{}';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const prediction = jsonMatch
      ? JSON.parse(jsonMatch[0])
      : { churnRiskScore: 30, riskLevel: 'low', urgency: 'monitor' };

    const predictedAt = new Date().toISOString();
    const CHURN_THRESHOLD = 70;

    await supabase.from('creator_churn_predictions').upsert({
      creator_id: creator.id,
      churn_risk_score: prediction.churnRiskScore,
      risk_level: prediction.riskLevel,
      prediction_window: '7-14 days',
      urgency: prediction.urgency,
      predicted_at: predictedAt,
    });

    try {
      await supabase.from('ml_predictions').upsert({
        model_type: 'churn_prediction',
        entity_type: 'creator',
        entity_id: creator.id,
        probability_score: prediction.churnRiskScore,
        risk_level: prediction.riskLevel,
        prediction_window: '7-14 days',
        confidence_score: null,
        feature_payload: { urgency: prediction.urgency, source: 'creator-churn-user-refresh' },
        predicted_at: predictedAt,
      });
    } catch (mlErr) {
      console.warn('ml_predictions upsert skipped', mlErr);
    }

    if (prediction.churnRiskScore >= CHURN_THRESHOLD) {
      await supabase.from('creator_retention_campaigns').insert({
        creator_id: creator.id,
        churn_risk_score: prediction.churnRiskScore,
        campaign_type: 'user_requested_refresh',
        channels: ['sms', 'email'],
        status: 'triggered',
        triggered_at: predictedAt,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        churnRiskScore: prediction.churnRiskScore,
        riskLevel: prediction.riskLevel,
        urgency: prediction.urgency,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('creator-churn-user-refresh error:', error);
    corsHeaders = getCorsHeaders(req.headers.get('origin'));
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
