import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
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
    const cronSecret = Deno.env.get('CRON_SECRET');
    if (cronSecret) {
      const auth = req.headers.get('Authorization');
      if (auth !== `Bearer ${cronSecret}`) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all active creators
    const { data: creators, error: creatorsError } = await supabase
      .from('user_profiles')
      .select('id, full_name, email, phone_number')
      .eq('is_creator', true)
      .eq('is_active', true)
      .limit(200);

    if (creatorsError) throw creatorsError;

    const results = [];
    const CHURN_THRESHOLD = 70;

    for (const creator of creators || []) {
      try {
        // Get engagement data
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

        // Call Claude AI for churn prediction
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
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 200,
            messages: [{ role: 'user', content: prompt }]
          })
        });

        const claudeResult = await claudeResponse.json();
        const content = claudeResult?.content?.[0]?.text || '{}';
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const prediction = jsonMatch ? JSON.parse(jsonMatch[0]) : { churnRiskScore: 30, riskLevel: 'low', urgency: 'monitor' };

        const predictedAt = new Date().toISOString();

        await supabase.from('creator_churn_predictions').upsert({
          creator_id: creator.id,
          churn_risk_score: prediction.churnRiskScore,
          risk_level: prediction.riskLevel,
          prediction_window: '7-14 days',
          urgency: prediction.urgency,
          predicted_at: predictedAt
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
            feature_payload: { urgency: prediction.urgency, source: 'creator-churn-prediction-cron' },
            predicted_at: predictedAt
          });
        } catch (mlErr) {
          console.warn('ml_predictions upsert skipped', mlErr);
        }

        // Trigger retention if risk >= threshold
        if (prediction.churnRiskScore >= CHURN_THRESHOLD) {
          await supabase.from('creator_retention_campaigns').insert({
            creator_id: creator.id,
            churn_risk_score: prediction.churnRiskScore,
            campaign_type: 'automated_daily_cron',
            channels: ['sms', 'email'],
            status: 'triggered',
            triggered_at: new Date().toISOString()
          });
        }

        results.push({ creatorId: creator.id, churnRiskScore: prediction.churnRiskScore, riskLevel: prediction.riskLevel });
      } catch (creatorError) {
        console.error(`Error processing creator ${creator.id}:`, creatorError);
      }
    }

    // Log cron execution
    await supabase.from('platform_logs').insert({
      log_type: 'cron_execution',
      message: `Daily churn prediction completed: ${results.length} creators analyzed`,
      metadata: {
        totalCreators: results.length,
        highRisk: results.filter(r => r.churnRiskScore >= 70).length,
        executedAt: new Date().toISOString()
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        analyzed: results.length,
        highRisk: results.filter(r => r.churnRiskScore >= 70).length,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Churn prediction cron error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
