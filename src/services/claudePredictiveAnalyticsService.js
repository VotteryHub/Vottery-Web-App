import claude from '../lib/claude';
import { supabase } from '../lib/supabase';

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toCamelCase);
  return Object.keys(obj)?.reduce((acc, key) => {
    const camelKey = key?.replace(/_([a-z])/g, (_, letter) => letter?.toUpperCase());
    acc[camelKey] = toCamelCase(obj?.[key]);
    return acc;
  }, {});
};

const toSnakeCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toSnakeCase);
  return Object.keys(obj)?.reduce((acc, key) => {
    const snakeKey = key?.replace(/[A-Z]/g, letter => `_${letter?.toLowerCase()}`);
    acc[snakeKey] = toSnakeCase(obj?.[key]);
    return acc;
  }, {});
};

function getErrorMessage(statusCode, errorData) {
  if (statusCode === 401) {
    return { isInternal: true, message: 'Invalid API key or authentication failed. Please check your Anthropic API key.' };
  } else if (statusCode === 403) {
    return { isInternal: true, message: 'Permission denied. Your API key does not have access to the specified resource.' };
  } else if (statusCode === 404) {
    return { isInternal: true, message: 'Resource not found. The requested endpoint or model may not exist.' };
  } else if (statusCode === 429) {
    return { isInternal: true, message: 'Rate limit exceeded. You are sending requests too quickly. Please wait a moment and try again.' };
  } else if (statusCode === 500) {
    return { isInternal: true, message: 'Anthropic service error. An unexpected error occurred on their servers. Please try again later.' };
  } else if (statusCode === 529) {
    return { isInternal: true, message: 'Anthropic service is temporarily overloaded. Please try again in a few moments.' };
  } else {
    return { isInternal: false, message: errorData?.error?.message || 'An unexpected error occurred. Please try again.' };
  }
}

export const claudePredictiveAnalyticsService = {
  async generateRevenueForecast(timeframe = 30) {
    try {
      const revenueData = await this.gatherRevenueData(timeframe * 2);
      const campaignData = await this.gatherCampaignData(timeframe * 2);
      const userMetrics = await this.gatherUserMetrics(timeframe * 2);

      const prompt = `You are an expert business intelligence analyst. Analyze the following platform data and generate a comprehensive revenue forecast for the next ${timeframe} days.

Revenue Data (last ${timeframe * 2} days):
${JSON.stringify(revenueData, null, 2)}

Campaign Performance:
${JSON.stringify(campaignData, null, 2)}

User Metrics:
${JSON.stringify(userMetrics, null, 2)}

Provide a detailed forecast including:
1. Projected daily revenue for the next ${timeframe} days
2. Expected revenue range (min, max, most likely)
3. Key revenue drivers and risk factors
4. Confidence level for the forecast
5. Recommended actions to maximize revenue

Format your response as JSON with keys: dailyProjections (array with date, revenue, confidence), summary (object with totalProjected, minExpected, maxExpected, confidenceLevel), drivers (array), risks (array), recommendations (array)`;

      const message = await claude?.messages?.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }]
      });

      const forecast = JSON.parse(message?.content?.[0]?.text || '{}');

      await this.storeForecastResult({
        type: 'revenue_forecast',
        timeframe,
        forecast,
        generatedAt: new Date()?.toISOString()
      });

      return { data: forecast, error: null };
    } catch (error) {
      if (error?.status) {
        const errorInfo = getErrorMessage(error?.status, error);
        const finalError = new Error(errorInfo.message);
        finalError.statusCode = error?.status;
        if (!errorInfo?.isInternal) {
          console.error('Claude API error:', finalError);
        }
        return { data: null, error: { message: finalError?.message } };
      }
      console.error('Revenue forecast error:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async predictUserChurn() {
    try {
      const userActivity = await this.gatherUserActivityData();
      const engagementMetrics = await this.gatherEngagementMetrics();
      const subscriptionData = await this.gatherSubscriptionData();

      const prompt = `You are an expert in user retention and churn prediction. Analyze the following user behavior data and predict which user segments are at risk of churning.

User Activity Patterns:
${JSON.stringify(userActivity, null, 2)}

Engagement Metrics:
${JSON.stringify(engagementMetrics, null, 2)}

Subscription Data:
${JSON.stringify(subscriptionData, null, 2)}

Provide:
1. Churn risk score by user segment (0-100)
2. Key indicators of churn risk
3. Predicted churn rate for next 30 days
4. High-risk user characteristics
5. Retention strategies to reduce churn

Format as JSON with keys: segmentRisks (array with segment, riskScore, userCount, churnProbability), indicators (array), predictedChurnRate (number), highRiskProfile (object), retentionStrategies (array)`;

      const message = await claude?.messages?.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }]
      });

      const churnPrediction = JSON.parse(message?.content?.[0]?.text || '{}');

      await this.storeForecastResult({
        type: 'churn_prediction',
        prediction: churnPrediction,
        generatedAt: new Date()?.toISOString()
      });

      return { data: churnPrediction, error: null };
    } catch (error) {
      if (error?.status) {
        const errorInfo = getErrorMessage(error?.status, error);
        const finalError = new Error(errorInfo.message);
        finalError.statusCode = error?.status;
        if (!errorInfo?.isInternal) {
          console.error('Claude API error:', finalError);
        }
        return { data: null, error: { message: finalError?.message } };
      }
      console.error('Churn prediction error:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async generateCampaignOptimizations() {
    try {
      const campaigns = await this.gatherActiveCampaigns();
      const performanceMetrics = await this.gatherCampaignPerformance();
      const audienceData = await this.gatherAudienceInsights();

      const prompt = `You are an expert in campaign optimization and marketing analytics. Analyze the following campaign data and provide actionable optimization recommendations.

Active Campaigns:
${JSON.stringify(campaigns, null, 2)}

Performance Metrics:
${JSON.stringify(performanceMetrics, null, 2)}

Audience Insights:
${JSON.stringify(audienceData, null, 2)}

Provide:
1. Campaign-specific optimization recommendations
2. Budget reallocation suggestions
3. Targeting improvements
4. Creative optimization ideas
5. Expected impact of each recommendation

Format as JSON with keys: campaignOptimizations (array with campaignId, campaignName, recommendations array, expectedImpact), budgetReallocations (array), targetingImprovements (array), creativeOptimizations (array), priorityActions (array)`;

      const message = await claude?.messages?.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }]
      });

      const optimizations = JSON.parse(message?.content?.[0]?.text || '{}');

      await this.storeForecastResult({
        type: 'campaign_optimization',
        optimizations,
        generatedAt: new Date()?.toISOString()
      });

      return { data: optimizations, error: null };
    } catch (error) {
      if (error?.status) {
        const errorInfo = getErrorMessage(error?.status, error);
        const finalError = new Error(errorInfo.message);
        finalError.statusCode = error?.status;
        if (!errorInfo?.isInternal) {
          console.error('Claude API error:', finalError);
        }
        return { data: null, error: { message: finalError?.message } };
      }
      console.error('Campaign optimization error:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async correlateAnomalies() {
    try {
      const performanceAnomalies = await this.detectPerformanceAnomalies();
      const revenueAnomalies = await this.detectRevenueAnomalies();
      const userBehaviorAnomalies = await this.detectUserBehaviorAnomalies();
      const systemMetrics = await this.gatherSystemMetrics();

      const prompt = `You are an expert in anomaly detection and root cause analysis. Analyze the following anomalies detected across different platform metrics and identify correlations and root causes.

Performance Anomalies:
${JSON.stringify(performanceAnomalies, null, 2)}

Revenue Anomalies:
${JSON.stringify(revenueAnomalies, null, 2)}

User Behavior Anomalies:
${JSON.stringify(userBehaviorAnomalies, null, 2)}

System Metrics:
${JSON.stringify(systemMetrics, null, 2)}

Provide:
1. Correlated anomaly clusters
2. Root cause analysis for each cluster
3. Impact assessment (severity, affected users, revenue impact)
4. Recommended remediation actions
5. Preventive measures

Format as JSON with keys: anomalyClusters (array with id, anomalies array, correlation, rootCause, severity), impactAssessment (object), remediationActions (array with priority, action, expectedOutcome), preventiveMeasures (array)`;

      const message = await claude?.messages?.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }]
      });

      const correlation = JSON.parse(message?.content?.[0]?.text || '{}');

      await this.storeForecastResult({
        type: 'anomaly_correlation',
        correlation,
        generatedAt: new Date()?.toISOString()
      });

      return { data: correlation, error: null };
    } catch (error) {
      if (error?.status) {
        const errorInfo = getErrorMessage(error?.status, error);
        const finalError = new Error(errorInfo.message);
        finalError.statusCode = error?.status;
        if (!errorInfo?.isInternal) {
          console.error('Claude API error:', finalError);
        }
        return { data: null, error: { message: finalError?.message } };
      }
      console.error('Anomaly correlation error:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async generateBusinessIntelligenceReport() {
    try {
      const revenueForecast = await this.generateRevenueForecast(30);
      const churnPrediction = await this.predictUserChurn();
      const campaignOptimizations = await this.generateCampaignOptimizations();
      const anomalyCorrelation = await this.correlateAnomalies();

      const prompt = `You are a senior business intelligence analyst. Synthesize the following predictive analytics into a comprehensive executive summary.

Revenue Forecast:
${JSON.stringify(revenueForecast?.data, null, 2)}

Churn Prediction:
${JSON.stringify(churnPrediction?.data, null, 2)}

Campaign Optimizations:
${JSON.stringify(campaignOptimizations?.data, null, 2)}

Anomaly Correlation:
${JSON.stringify(anomalyCorrelation?.data, null, 2)}

Provide:
1. Executive summary (3-5 key insights)
2. Strategic priorities (top 5 actions)
3. Risk assessment
4. Opportunity analysis
5. 30-day action plan

Format as JSON with keys: executiveSummary (string), keyInsights (array), strategicPriorities (array with priority, action, impact, effort), riskAssessment (object with risks array, mitigation array), opportunities (array), actionPlan (array with week, actions array)`;

      const message = await claude?.messages?.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }]
      });

      const report = JSON.parse(message?.content?.[0]?.text || '{}');

      await this.storeForecastResult({
        type: 'bi_report',
        report,
        generatedAt: new Date()?.toISOString()
      });

      return { data: report, error: null };
    } catch (error) {
      if (error?.status) {
        const errorInfo = getErrorMessage(error?.status, error);
        const finalError = new Error(errorInfo.message);
        finalError.statusCode = error?.status;
        if (!errorInfo?.isInternal) {
          console.error('Claude API error:', finalError);
        }
        return { data: null, error: { message: finalError?.message } };
      }
      console.error('BI report generation error:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async gatherRevenueData(days = 60) {
    try {
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)?.toISOString();

      const { data: financialTracking } = await supabase
        ?.from('financial_tracking')
        ?.select('*')
        ?.gte('recorded_at', startDate)
        ?.order('recorded_at', { ascending: true });

      const { data: transactions } = await supabase
        ?.from('transactions')
        ?.select('*')
        ?.gte('created_at', startDate)
        ?.order('created_at', { ascending: true });

      const dailyRevenue = {};
      financialTracking?.forEach(record => {
        const date = record?.recorded_at?.split('T')?.[0];
        if (!dailyRevenue?.[date]) {
          dailyRevenue[date] = {
            date,
            totalRevenue: 0,
            adRevenue: 0,
            participationFees: 0,
            subscriptions: 0,
            transactionCount: 0
          };
        }
        dailyRevenue[date].totalRevenue += parseFloat(record?.total_revenue || 0);
        dailyRevenue[date].adRevenue += parseFloat(record?.ad_revenue || 0);
        dailyRevenue[date].participationFees += parseFloat(record?.participation_fees || 0);
      });

      transactions?.forEach(tx => {
        const date = tx?.created_at?.split('T')?.[0];
        if (dailyRevenue?.[date]) {
          dailyRevenue[date].transactionCount++;
          if (tx?.transaction_type === 'subscription') {
            dailyRevenue[date].subscriptions += parseFloat(tx?.amount || 0);
          }
        }
      });

      return Object.values(dailyRevenue);
    } catch (error) {
      console.error('Error gathering revenue data:', error);
      return [];
    }
  },

  async gatherCampaignData(days = 60) {
    try {
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)?.toISOString();

      const { data: campaigns } = await supabase
        ?.from('advertiser_campaigns')
        ?.select(`
          *,
          elections:elections(vote_count, status)
        `)
        ?.gte('created_at', startDate)
        ?.order('created_at', { ascending: false });

      return campaigns?.map(c => ({
        id: c?.id,
        name: c?.campaign_name,
        budget: c?.budget,
        spent: c?.spent_amount,
        impressions: c?.impressions,
        clicks: c?.clicks,
        conversions: c?.conversions,
        status: c?.status,
        electionVotes: c?.elections?.reduce((sum, e) => sum + (e?.vote_count || 0), 0) || 0
      })) || [];
    } catch (error) {
      console.error('Error gathering campaign data:', error);
      return [];
    }
  },

  async gatherUserMetrics(days = 60) {
    try {
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)?.toISOString();

      const { data: profiles, count: totalUsers } = await supabase
        ?.from('user_profiles')
        ?.select('*', { count: 'exact' })
        ?.gte('created_at', startDate);

      const { data: votes } = await supabase
        ?.from('votes')
        ?.select('user_id, created_at')
        ?.gte('created_at', startDate);

      const { data: subscriptions } = await supabase
        ?.from('subscriptions')
        ?.select('*')
        ?.eq('status', 'active');

      const activeUsers = new Set(votes?.map(v => v?.user_id))?.size || 0;
      const engagementRate = totalUsers > 0 ? (activeUsers / totalUsers * 100)?.toFixed(2) : 0;

      return {
        totalUsers,
        activeUsers,
        engagementRate: parseFloat(engagementRate),
        newUsers: profiles?.length || 0,
        subscribers: subscriptions?.length || 0,
        averageVotesPerUser: activeUsers > 0 ? (votes?.length / activeUsers)?.toFixed(2) : 0
      };
    } catch (error) {
      console.error('Error gathering user metrics:', error);
      return {};
    }
  },

  async gatherUserActivityData() {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)?.toISOString();

      const { data: votes } = await supabase
        ?.from('votes')
        ?.select('user_id, created_at')
        ?.gte('created_at', thirtyDaysAgo);

      const { data: posts } = await supabase
        ?.from('posts')
        ?.select('user_id, created_at')
        ?.gte('created_at', thirtyDaysAgo);

      const { data: comments } = await supabase
        ?.from('comments')
        ?.select('user_id, created_at')
        ?.gte('created_at', thirtyDaysAgo);

      const userActivity = {};

      [...(votes || []), ...(posts || []), ...(comments || [])]?.forEach(activity => {
        const userId = activity?.user_id;
        if (!userActivity?.[userId]) {
          userActivity[userId] = { userId, votes: 0, posts: 0, comments: 0, lastActive: activity?.created_at };
        }
        if (votes?.some(v => v?.user_id === userId)) userActivity[userId].votes++;
        if (posts?.some(p => p?.user_id === userId)) userActivity[userId].posts++;
        if (comments?.some(c => c?.user_id === userId)) userActivity[userId].comments++;
        if (new Date(activity?.created_at) > new Date(userActivity[userId].lastActive)) {
          userActivity[userId].lastActive = activity?.created_at;
        }
      });

      return Object.values(userActivity)?.slice(0, 1000);
    } catch (error) {
      console.error('Error gathering user activity:', error);
      return [];
    }
  },

  async gatherEngagementMetrics() {
    try {
      const { data: analytics } = await supabase
        ?.from('user_analytics')
        ?.select('*')
        ?.order('created_at', { ascending: false })
        ?.limit(1000);

      return analytics?.map(a => ({
        userId: a?.user_id,
        votingFrequency: a?.voting_frequency,
        engagementScore: a?.engagement_score,
        retentionRisk: a?.retention_risk,
        lastActive: a?.last_active_at
      })) || [];
    } catch (error) {
      console.error('Error gathering engagement metrics:', error);
      return [];
    }
  },

  async gatherSubscriptionData() {
    try {
      const { data: subscriptions } = await supabase
        ?.from('subscriptions')
        ?.select('*')
        ?.order('created_at', { ascending: false });

      return subscriptions?.map(s => ({
        userId: s?.user_id,
        plan: s?.plan_name,
        status: s?.status,
        startDate: s?.start_date,
        renewalDate: s?.current_period_end,
        canceledAt: s?.canceled_at,
        mrr: s?.mrr
      })) || [];
    } catch (error) {
      console.error('Error gathering subscription data:', error);
      return [];
    }
  },

  async gatherActiveCampaigns() {
    try {
      const { data: campaigns } = await supabase
        ?.from('advertiser_campaigns')
        ?.select('*')
        ?.eq('status', 'active')
        ?.order('created_at', { ascending: false });

      return campaigns?.map(c => ({
        id: c?.id,
        name: c?.campaign_name,
        budget: c?.budget,
        spent: c?.spent_amount,
        impressions: c?.impressions,
        clicks: c?.clicks,
        conversions: c?.conversions,
        ctr: c?.clicks > 0 ? ((c?.clicks / c?.impressions) * 100)?.toFixed(2) : 0,
        cpc: c?.clicks > 0 ? (c?.spent_amount / c?.clicks)?.toFixed(2) : 0,
        conversionRate: c?.clicks > 0 ? ((c?.conversions / c?.clicks) * 100)?.toFixed(2) : 0
      })) || [];
    } catch (error) {
      console.error('Error gathering active campaigns:', error);
      return [];
    }
  },

  async gatherCampaignPerformance() {
    try {
      const { data: performance } = await supabase
        ?.from('campaign_performance_metrics')
        ?.select('*')
        ?.order('recorded_at', { ascending: false })
        ?.limit(500);

      return performance?.map(p => ({
        campaignId: p?.campaign_id,
        date: p?.recorded_at,
        impressions: p?.impressions,
        clicks: p?.clicks,
        conversions: p?.conversions,
        revenue: p?.revenue,
        roi: p?.roi
      })) || [];
    } catch (error) {
      console.error('Error gathering campaign performance:', error);
      return [];
    }
  },

  async gatherAudienceInsights() {
    try {
      const { data: profiles } = await supabase
        ?.from('user_profiles')
        ?.select('zone, age_verified, role')
        ?.limit(5000);

      const zoneDistribution = {};
      const roleDistribution = {};
      let verifiedUsers = 0;

      profiles?.forEach(p => {
        zoneDistribution[p?.zone] = (zoneDistribution?.[p?.zone] || 0) + 1;
        roleDistribution[p?.role] = (roleDistribution?.[p?.role] || 0) + 1;
        if (p?.age_verified) verifiedUsers++;
      });

      return {
        totalProfiles: profiles?.length || 0,
        zoneDistribution,
        roleDistribution,
        verificationRate: profiles?.length > 0 ? ((verifiedUsers / profiles?.length) * 100)?.toFixed(2) : 0
      };
    } catch (error) {
      console.error('Error gathering audience insights:', error);
      return {};
    }
  },

  async detectPerformanceAnomalies() {
    try {
      const { data: metrics } = await supabase
        ?.from('performance_metrics')
        ?.select('*')
        ?.order('recorded_at', { ascending: false })
        ?.limit(1000);

      const anomalies = [];
      const avgResponseTime = metrics?.reduce((sum, m) => sum + (m?.avg_response_time || 0), 0) / (metrics?.length || 1);
      const avgErrorRate = metrics?.reduce((sum, m) => sum + (m?.error_rate || 0), 0) / (metrics?.length || 1);

      metrics?.forEach(m => {
        if (m?.avg_response_time > avgResponseTime * 2) {
          anomalies?.push({
            type: 'high_response_time',
            timestamp: m?.recorded_at,
            value: m?.avg_response_time,
            threshold: avgResponseTime * 2,
            severity: 'high'
          });
        }
        if (m?.error_rate > avgErrorRate * 3) {
          anomalies?.push({
            type: 'high_error_rate',
            timestamp: m?.recorded_at,
            value: m?.error_rate,
            threshold: avgErrorRate * 3,
            severity: 'critical'
          });
        }
      });

      return anomalies?.slice(0, 50);
    } catch (error) {
      console.error('Error detecting performance anomalies:', error);
      return [];
    }
  },

  async detectRevenueAnomalies() {
    try {
      const { data: revenue } = await supabase
        ?.from('financial_tracking')
        ?.select('*')
        ?.order('recorded_at', { ascending: false })
        ?.limit(90);

      const anomalies = [];
      const avgRevenue = revenue?.reduce((sum, r) => sum + parseFloat(r?.total_revenue || 0), 0) / (revenue?.length || 1);

      revenue?.forEach(r => {
        const dailyRevenue = parseFloat(r?.total_revenue || 0);
        if (dailyRevenue < avgRevenue * 0.5) {
          anomalies?.push({
            type: 'revenue_drop',
            timestamp: r?.recorded_at,
            value: dailyRevenue,
            threshold: avgRevenue * 0.5,
            severity: 'high'
          });
        }
        if (dailyRevenue > avgRevenue * 2) {
          anomalies?.push({
            type: 'revenue_spike',
            timestamp: r?.recorded_at,
            value: dailyRevenue,
            threshold: avgRevenue * 2,
            severity: 'medium'
          });
        }
      });

      return anomalies?.slice(0, 30);
    } catch (error) {
      console.error('Error detecting revenue anomalies:', error);
      return [];
    }
  },

  async detectUserBehaviorAnomalies() {
    try {
      const { data: activity } = await supabase
        ?.from('user_activity_logs')
        ?.select('*')
        ?.order('created_at', { ascending: false })
        ?.limit(5000);

      const anomalies = [];
      const userActivityCount = {};

      activity?.forEach(a => {
        userActivityCount[a?.user_id] = (userActivityCount?.[a?.user_id] || 0) + 1;
      });

      const avgActivity = Object.values(userActivityCount)?.reduce((sum, count) => sum + count, 0) / (Object.keys(userActivityCount)?.length || 1);

      Object.entries(userActivityCount)?.forEach(([userId, count]) => {
        if (count > avgActivity * 5) {
          anomalies?.push({
            type: 'unusual_activity',
            userId,
            value: count,
            threshold: avgActivity * 5,
            severity: 'medium'
          });
        }
      });

      return anomalies?.slice(0, 50);
    } catch (error) {
      console.error('Error detecting user behavior anomalies:', error);
      return [];
    }
  },

  async gatherSystemMetrics() {
    try {
      const { data: metrics } = await supabase
        ?.from('performance_metrics')
        ?.select('*')
        ?.order('recorded_at', { ascending: false })
        ?.limit(100);

      const latest = metrics?.[0] || {};

      return {
        avgResponseTime: latest?.avg_response_time || 0,
        errorRate: latest?.error_rate || 0,
        throughput: latest?.throughput || 0,
        activeConnections: latest?.active_connections || 0,
        cpuUsage: latest?.cpu_usage || 0,
        memoryUsage: latest?.memory_usage || 0
      };
    } catch (error) {
      console.error('Error gathering system metrics:', error);
      return {};
    }
  },

  async storeForecastResult(result) {
    try {
      const { error } = await supabase
        ?.from('claude_predictive_analytics')
        ?.insert(toSnakeCase(result));

      if (error) throw error;
    } catch (error) {
      console.error('Error storing forecast result:', error);
    }
  },

  async getStoredForecasts(type = null, limit = 10) {
    try {
      let query = supabase
        ?.from('claude_predictive_analytics')
        ?.select('*')
        ?.order('generated_at', { ascending: false })
        ?.limit(limit);

      if (type) {
        query = query?.eq('type', type);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error retrieving stored forecasts:', error);
      return { data: null, error: { message: error?.message } };
    }
  }
};

export default claudePredictiveAnalyticsService;
