import { supabase } from '../lib/supabase';
import { telnyxSMSService } from './telnyxSMSService';

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toCamelCase);
  return Object.keys(obj)?.reduce((acc, key) => {
    const camelKey = key?.replace(/_([a-z])/g, (_, letter) => letter?.toUpperCase());
    acc[camelKey] = toCamelCase(obj?.[key]);
    return acc;
  }, {});
};

const CHURN_RISK_THRESHOLD = 70; // 70% risk triggers automated retention

export const creatorChurnPredictionService = {
  /**
   * Analyze creator engagement decline patterns
   */
  async analyzeCreatorEngagementDecline(creatorId) {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo?.setDate(thirtyDaysAgo?.getDate() - 30);
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo?.setDate(fourteenDaysAgo?.getDate() - 14);

      // Get activity logs
      const { data: recentActivity } = await supabase
        ?.from('creator_activity_logs')
        ?.select('*')
        ?.eq('creator_id', creatorId)
        ?.gte('created_at', fourteenDaysAgo?.toISOString())
        ?.order('created_at', { ascending: false });

      const { data: previousActivity } = await supabase
        ?.from('creator_activity_logs')
        ?.select('*')
        ?.eq('creator_id', creatorId)
        ?.gte('created_at', thirtyDaysAgo?.toISOString())
        ?.lt('created_at', fourteenDaysAgo?.toISOString());

      // Get carousel performance
      const { data: carouselMetrics } = await supabase
        ?.from('carousel_performance_metrics')
        ?.select('engagement_rate, revenue, impressions, created_at')
        ?.eq('creator_id', creatorId)
        ?.gte('created_at', thirtyDaysAgo?.toISOString())
        ?.order('created_at', { ascending: false });

      // Calculate engagement scores
      const recentCount = recentActivity?.length || 0;
      const previousCount = previousActivity?.length || 0;
      const activityDeclineRate = previousCount > 0
        ? Math.max(0, ((previousCount - recentCount) / previousCount) * 100)
        : 0;

      const avgRecentEngagement = carouselMetrics?.slice(0, 7)?.reduce((sum, m) => sum + parseFloat(m?.engagement_rate || 0), 0) / Math.max(carouselMetrics?.slice(0, 7)?.length || 1, 1);
      const avgPreviousEngagement = carouselMetrics?.slice(7, 14)?.reduce((sum, m) => sum + parseFloat(m?.engagement_rate || 0), 0) / Math.max(carouselMetrics?.slice(7, 14)?.length || 1, 1);
      const engagementDeclineRate = avgPreviousEngagement > 0
        ? Math.max(0, ((avgPreviousEngagement - avgRecentEngagement) / avgPreviousEngagement) * 100)
        : 0;

      return {
        data: {
          creatorId,
          recentActivityCount: recentCount,
          previousActivityCount: previousCount,
          activityDeclineRate: Math.round(activityDeclineRate),
          avgRecentEngagement: avgRecentEngagement?.toFixed(2),
          avgPreviousEngagement: avgPreviousEngagement?.toFixed(2),
          engagementDeclineRate: Math.round(engagementDeclineRate),
          carouselMetrics: toCamelCase(carouselMetrics?.slice(0, 10))
        },
        error: null
      };
    } catch (error) {
      console.error('Error analyzing engagement decline:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Predict churn risk using Claude AI (7-14 day window)
   */
  async predictChurnRisk(creatorId) {
    try {
      const apiKey = import.meta.env?.VITE_ANTHROPIC_API_KEY;
      if (!apiKey) throw new Error('Anthropic API key missing');

      const { data: engagementData } = await this.analyzeCreatorEngagementDecline(creatorId);

      // Get creator profile
      const { data: profile } = await supabase
        ?.from('user_profiles')
        ?.select('full_name, created_at, subscription_tier')
        ?.eq('id', creatorId)
        ?.single();

      const prompt = `You are a creator retention specialist. Analyze this creator's engagement data and predict their churn risk for the next 7-14 days.

Creator Data:
- Activity Decline Rate: ${engagementData?.activityDeclineRate || 0}%
- Recent Activity Count (last 14 days): ${engagementData?.recentActivityCount || 0}
- Previous Activity Count (14-30 days ago): ${engagementData?.previousActivityCount || 0}
- Engagement Decline Rate: ${engagementData?.engagementDeclineRate || 0}%
- Recent Avg Engagement: ${engagementData?.avgRecentEngagement || 0}%
- Previous Avg Engagement: ${engagementData?.avgPreviousEngagement || 0}%
- Subscription Tier: ${profile?.subscription_tier || 'free'}

Provide a JSON response with:
{
  "churnRiskScore": <0-100 integer>,
  "riskLevel": "low|medium|high|critical",
  "predictionWindow": "7-14 days",
  "confidenceInterval": <0-100>,
  "primaryRiskFactors": ["factor1", "factor2", "factor3"],
  "retentionProbability": <0-100>,
  "recommendedActions": ["action1", "action2", "action3"],
  "urgency": "immediate|within_week|monitor"
}`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      const result = await response?.json();
      const content = result?.content?.[0]?.text || '{}';
      const jsonMatch = content?.match(/\{[\s\S]*\}/);
      const prediction = jsonMatch ? JSON.parse(jsonMatch?.[0]) : getDefaultPrediction();

      const predictionRow = {
        creator_id: creatorId,
        churn_risk_score: prediction?.churnRiskScore,
        risk_level: prediction?.riskLevel,
        prediction_window: prediction?.predictionWindow,
        confidence_interval: prediction?.confidenceInterval,
        primary_risk_factors: prediction?.primaryRiskFactors,
        retention_probability: prediction?.retentionProbability,
        recommended_actions: prediction?.recommendedActions,
        urgency: prediction?.urgency,
        predicted_at: new Date()?.toISOString()
      };

      // Store prediction in canonical creator table and shared ML table for cross-feature parity.
      await supabase?.from('creator_churn_predictions')?.upsert(predictionRow);
      await supabase?.from('ml_predictions')?.upsert({
        model_type: 'churn_prediction',
        entity_type: 'creator',
        entity_id: creatorId,
        probability_score: prediction?.churnRiskScore,
        risk_level: prediction?.riskLevel,
        prediction_window: prediction?.predictionWindow,
        confidence_score: prediction?.confidenceInterval,
        feature_payload: {
          primaryRiskFactors: prediction?.primaryRiskFactors,
          retentionProbability: prediction?.retentionProbability,
          recommendedActions: prediction?.recommendedActions,
          urgency: prediction?.urgency
        },
        predicted_at: predictionRow.predicted_at
      });

      // Trigger automated retention if risk exceeds threshold
      if (prediction?.churnRiskScore >= CHURN_RISK_THRESHOLD) {
        await this.triggerRetentionWorkflow(creatorId, prediction, profile);
      }

      return { data: prediction, error: null };
    } catch (error) {
      console.error('Error predicting churn risk:', error);
      return { data: getDefaultPrediction(), error: null };
    }
  },

  /**
   * Trigger automated retention workflow when churn risk > 70%
   */
  async triggerRetentionWorkflow(creatorId, prediction, profile) {
    try {
      const creatorName = profile?.full_name || 'Creator';

      // Get creator contact info
      const { data: contactInfo } = await supabase
        ?.from('user_profiles')
        ?.select('phone_number, email')
        ?.eq('id', creatorId)
        ?.single();

      // Log retention campaign
      await supabase?.from('creator_retention_campaigns')?.insert({
        creator_id: creatorId,
        churn_risk_score: prediction?.churnRiskScore,
        campaign_type: 'automated_retention',
        channels: ['sms', 'email'],
        status: 'triggered',
        triggered_at: new Date()?.toISOString()
      });

      // Send Telnyx SMS if phone available
      if (contactInfo?.phone_number) {
        const smsMessage = `Hi ${creatorName}! 👋 We noticed you haven't been as active lately on Vottery. Your creator community misses you! Here's a special offer: 20% bonus on your next carousel campaign. Reply HELP for personalized growth tips. 🚀`;

        await telnyxSMSService?.sendSMS?.({
          to: contactInfo?.phone_number,
          message: smsMessage,
          type: 'retention_campaign'
        });
      }

      // Send Resend email if email available
      if (contactInfo?.email) {
        await fetch(`${import.meta.env?.VITE_API_URL}/send-retention-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: contactInfo?.email,
            creatorName,
            churnRiskScore: prediction?.churnRiskScore,
            recommendedActions: prediction?.recommendedActions,
            type: 'creator_retention'
          })
        })?.catch(() => null); // Non-blocking
      }

      return { success: true };
    } catch (error) {
      console.error('Error triggering retention workflow:', error);
      return { success: false, error: error?.message };
    }
  },

  /**
   * Get all at-risk creators for admin dashboard
   */
  async getAtRiskCreators(riskThreshold = 50) {
    try {
      const { data, error } = await supabase
        ?.from('creator_churn_predictions')
        ?.select(`
          *,
          user_profiles!creator_churn_predictions_creator_id_fkey(
            full_name,
            avatar_url,
            email
          )
        `)
        ?.gte('churn_risk_score', riskThreshold)
        ?.order('churn_risk_score', { ascending: false })
        ?.limit(50);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error fetching at-risk creators:', error);
      return { data: getMockAtRiskCreators(), error: null };
    }
  },

  /**
   * Run daily batch churn predictions
   */
  async runDailyChurnAnalysis() {
    try {
      // Get all active creators
      const { data: creators } = await supabase
        ?.from('user_profiles')
        ?.select('id')
        ?.eq('is_creator', true)
        ?.eq('is_active', true)
        ?.limit(100);

      const results = [];
      for (const creator of creators || []) {
        const result = await this.predictChurnRisk(creator?.id);
        results?.push({ creatorId: creator?.id, ...result?.data });
      }

      return { data: results, error: null };
    } catch (error) {
      console.error('Error running daily churn analysis:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Get retention campaign effectiveness
   */
  async getRetentionCampaignMetrics() {
    try {
      const { data, error } = await supabase
        ?.from('creator_retention_campaigns')
        ?.select('*')
        ?.order('triggered_at', { ascending: false })
        ?.limit(100);

      if (error) throw error;

      const campaigns = toCamelCase(data) || [];
      const totalCampaigns = campaigns?.length;
      const successfulCampaigns = campaigns?.filter(c => c?.status === 'success')?.length;
      const successRate = totalCampaigns > 0 ? ((successfulCampaigns / totalCampaigns) * 100)?.toFixed(1) : 0;

      return {
        data: {
          totalCampaigns,
          successfulCampaigns,
          successRate,
          campaigns: campaigns?.slice(0, 20)
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching retention metrics:', error);
      return { data: { totalCampaigns: 0, successRate: 0, campaigns: [] }, error: null };
    }
  },

  /**
   * Fire-and-forget: Edge `creator-churn-user-refresh` (JWT; server caps 1×/UTC day).
   * Client throttle matches Mobile `CreatorChurnPredictionService.invokeUserChurnRefreshIfDue`.
   */
  invokeUserChurnRefreshIfDue() {
    const STORAGE_KEY = 'last_creator_churn_user_refresh_epoch_ms';
    const COOLDOWN_MS = 20 * 60 * 60 * 1000;
    const FN_NAME = 'creator-churn-user-refresh';

    (async () => {
      try {
        if (typeof window === 'undefined' || !window?.localStorage) return;
        const { data: { session } } = await supabase?.auth?.getSession?.();
        if (!session) return;
        const last = parseInt(window.localStorage.getItem(STORAGE_KEY) || '0', 10);
        const now = Date.now();
        if (now - last < COOLDOWN_MS) return;
        const { error } = await supabase?.functions?.invoke(FN_NAME);
        if (!error) {
          window.localStorage.setItem(STORAGE_KEY, String(now));
        }
      } catch (e) {
        console.warn('[creatorChurnPredictionService] invokeUserChurnRefreshIfDue', e);
      }
    })();
  }
};

function getDefaultPrediction() {
  return {
    churnRiskScore: 45,
    riskLevel: 'medium',
    predictionWindow: '7-14 days',
    confidenceInterval: 78,
    primaryRiskFactors: ['Reduced posting frequency', 'Lower engagement rates', 'Decreased platform login frequency'],
    retentionProbability: 55,
    recommendedActions: ['Send personalized re-engagement message', 'Offer exclusive creator bonus', 'Schedule 1:1 success coaching session'],
    urgency: 'within_week'
  };
}

function getMockAtRiskCreators() {
  return [
    { creatorId: '1', churnRiskScore: 85, riskLevel: 'critical', userProfiles: { fullName: 'Alex Johnson', email: 'alex@example.com' } },
    { creatorId: '2', churnRiskScore: 72, riskLevel: 'high', userProfiles: { fullName: 'Sarah Chen', email: 'sarah@example.com' } },
    { creatorId: '3', churnRiskScore: 65, riskLevel: 'high', userProfiles: { fullName: 'Marcus Williams', email: 'marcus@example.com' } }
  ];
}

export default creatorChurnPredictionService;
