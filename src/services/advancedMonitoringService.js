import { supabase } from '../lib/supabase';
import { analytics } from '../hooks/useGoogleAnalytics';
import perplexityClient from '../lib/perplexity';
import { unifiedIncidentResponseService } from './unifiedIncidentResponseService';

function getErrorMessage(error) {
  if (!error?.response && error?.message?.includes('API key')) {
    return { isInternal: true, message: 'There\'s an issue with your Perplexity API key.' };
  }

  if (!error?.response?.status) {
    return { isInternal: false, message: error?.message || 'An unexpected error occurred' };
  }

  const status = error?.response?.status;

  if (status === 401) {
    return { isInternal: true, message: 'There\'s an issue with your Perplexity API key.' };
  } else if (status === 403) {
    return { isInternal: true, message: 'Your API key does not have permission to use the specified resource.' };
  } else if (status === 404) {
    return { isInternal: true, message: 'The requested resource was not found.' };
  } else if (status === 429) {
    return { isInternal: true, message: 'Your account has hit a rate limit.' };
  } else if (status >= 500) {
    return { isInternal: true, message: 'An unexpected error has occurred.' };
  } else {
    return { isInternal: false, message: error?.response?.data?.error?.message || `HTTP error! status: ${status}` };
  }
}

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toCamelCase);

  return Object.keys(obj)?.reduce((acc, key) => {
    const camelKey = key?.replace(/_([a-z])/g, (_, letter) => letter?.toUpperCase());
    acc[camelKey] = toCamelCase(obj?.[key]);
    return acc;
  }, {});
};

export const advancedMonitoringService = {
  async getBehavioralAnalytics(timeRange = '24h') {
    try {
      const now = new Date();
      let startDate = new Date();
      
      switch(timeRange) {
        case '24h':
          startDate?.setHours(now?.getHours() - 24);
          break;
        case '7d':
          startDate?.setDate(now?.getDate() - 7);
          break;
        case '30d':
          startDate?.setDate(now?.getDate() - 30);
          break;
        default:
          startDate?.setHours(now?.getHours() - 24);
      }

      const [fraudData, paymentData, campaignData] = await Promise.all([
        supabase
          ?.from('alert_effectiveness')
          ?.select('*')
          ?.gte('created_at', startDate?.toISOString()),
        supabase
          ?.from('wallet_transactions')
          ?.select('*')
          ?.gte('created_at', startDate?.toISOString()),
        supabase
          ?.from('advertiser_campaign_metrics')
          ?.select('*')
          ?.gte('timestamp', startDate?.toISOString())
      ]);

      const fraudMetrics = this.calculateFraudMetrics(fraudData?.data || []);
      const paymentMetrics = this.calculatePaymentMetrics(paymentData?.data || []);
      const campaignMetrics = this.calculateCampaignMetrics(campaignData?.data || []);

      analytics?.trackEvent('behavioral_analytics_viewed', {
        time_range: timeRange,
        fraud_detection_rate: fraudMetrics?.detectionRate,
        payment_success_rate: paymentMetrics?.successRate
      });

      return {
        data: {
          fraudMetrics,
          paymentMetrics,
          campaignMetrics,
          timeRange
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  calculateFraudMetrics(fraudData) {
    const totalAlerts = fraudData?.length || 0;
    const truePositives = fraudData?.reduce((sum, item) => sum + (item?.true_positives || 0), 0);
    const falsePositives = fraudData?.reduce((sum, item) => sum + (item?.false_positives || 0), 0);
    const falseNegatives = fraudData?.reduce((sum, item) => sum + (item?.false_negatives || 0), 0);
    
    const precision = truePositives > 0 ? (truePositives / (truePositives + falsePositives)) * 100 : 0;
    const recall = truePositives > 0 ? (truePositives / (truePositives + falseNegatives)) * 100 : 0;
    const detectionRate = totalAlerts > 0 ? (truePositives / totalAlerts) * 100 : 0;

    return {
      totalAlerts,
      truePositives,
      falsePositives,
      falseNegatives,
      precision: precision?.toFixed(2),
      recall: recall?.toFixed(2),
      detectionRate: detectionRate?.toFixed(2)
    };
  },

  calculatePaymentMetrics(paymentData) {
    const totalTransactions = paymentData?.length || 0;
    const successfulTransactions = paymentData?.filter(t => t?.status === 'completed')?.length || 0;
    const failedTransactions = paymentData?.filter(t => t?.status === 'failed')?.length || 0;
    const totalAmount = paymentData?.reduce((sum, t) => sum + parseFloat(t?.amount || 0), 0);
    const avgTransactionValue = totalTransactions > 0 ? totalAmount / totalTransactions : 0;
    const successRate = totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0;

    return {
      totalTransactions,
      successfulTransactions,
      failedTransactions,
      totalAmount: totalAmount?.toFixed(2),
      avgTransactionValue: avgTransactionValue?.toFixed(2),
      successRate: successRate?.toFixed(2)
    };
  },

  calculateCampaignMetrics(campaignData) {
    const totalCampaigns = new Set(campaignData?.map(c => c?.campaign_id))?.size || 0;
    const totalImpressions = campaignData?.filter(c => c?.metric_type === 'impressions')
      ?.reduce((sum, c) => sum + parseFloat(c?.metric_value || 0), 0);
    const totalClicks = campaignData?.filter(c => c?.metric_type === 'clicks')
      ?.reduce((sum, c) => sum + parseFloat(c?.metric_value || 0), 0);
    const totalConversions = campaignData?.filter(c => c?.metric_type === 'conversions')
      ?.reduce((sum, c) => sum + parseFloat(c?.metric_value || 0), 0);
    const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

    return {
      totalCampaigns,
      totalImpressions,
      totalClicks,
      totalConversions,
      avgCTR: avgCTR?.toFixed(2),
      conversionRate: conversionRate?.toFixed(2)
    };
  },

  async getPerplexityBehavioralInsights(analyticsData) {
    try {
      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-reasoning-pro',
        messages: [
          {
            role: 'system',
            content: 'You are an advanced behavioral analytics specialist using DeepSeek R1-powered reasoning. Analyze platform behavioral patterns, identify anomalies, predict trends, and provide actionable optimization recommendations with chain-of-thought reasoning.'
          },
          {
            role: 'user',
            content: `Analyze platform behavioral analytics data: ${JSON.stringify(analyticsData)}. Provide: 1) Behavioral anomalies detected, 2) Fraud pattern insights, 3) Payment flow bottlenecks, 4) Campaign attribution optimization, 5) Predictive trend forecasting, 6) Actionable recommendations. Return JSON with: anomalies (array), fraudPatterns (array), paymentBottlenecks (array), campaignOptimizations (array), predictiveTrends (object), recommendations (array), reasoning (string with chain-of-thought analysis).`
          }
        ],
        temperature: 0.2,
        searchRecencyFilter: 'week',
        returnRelatedQuestions: true
      });

      const content = response?.choices?.[0]?.message?.content;
      let insights;

      try {
        insights = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          insights = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse behavioral insights response');
        }
      }

      return {
        data: {
          ...insights,
          searchResults: response?.search_results || [],
          relatedQuestions: response?.related_questions || []
        },
        error: null
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error in behavioral insights:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async getZoneCrossAnalysis() {
    try {
      const { data: zoneData } = await supabase
        ?.from('zone_performance_metrics')
        ?.select('*')
        ?.order('last_updated', { ascending: false })
        ?.limit(8);

      if (!zoneData || zoneData?.length === 0) {
        return { data: { zones: [], crossAnalysis: null }, error: null };
      }

      const crossAnalysis = {
        topPerformingZone: zoneData?.reduce((max, zone) => 
          (zone?.average_roi > (max?.average_roi || 0)) ? zone : max, zoneData?.[0]
        ),
        lowestPerformingZone: zoneData?.reduce((min, zone) => 
          (zone?.average_roi < (min?.average_roi || Infinity)) ? zone : min, zoneData?.[0]
        ),
        totalRevenue: zoneData?.reduce((sum, zone) => 
          sum + parseFloat(zone?.total_advertiser_spending || 0), 0
        ),
        avgROI: zoneData?.reduce((sum, zone) => 
          sum + parseFloat(zone?.average_roi || 0), 0
        ) / zoneData?.length
      };

      return {
        data: {
          zones: toCamelCase(zoneData),
          crossAnalysis: toCamelCase(crossAnalysis)
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async trackCustomEvent(eventData) {
    try {
      analytics?.trackEvent(eventData?.eventName, eventData?.properties || {});
      return { data: { tracked: true }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Enhanced Incident Response Analytics: active incidents (delegates to unified incident service)
   */
  async getActiveIncidents(filters = {}) {
    try {
      return await unifiedIncidentResponseService?.getActiveIncidents(filters);
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Incident correlation with feature deployments: links monitoring alerts to feature implementation timeline
   */
  async getIncidentCorrelationData(options = {}) {
    try {
      const { timeRange = '24h' } = options;
      const now = new Date();
      let start = new Date();
      if (timeRange === '1h') start.setHours(now.getHours() - 1);
      else if (timeRange === '6h') start.setHours(now.getHours() - 6);
      else if (timeRange === '24h') start.setHours(now.getHours() - 24);
      else if (timeRange === '7d') start.setDate(now.getDate() - 7);
      else if (timeRange === '30d') start.setDate(now.getDate() - 30);
      else start.setHours(now.getHours() - 24);
      const startIso = start?.toISOString();

      const [incidentsRes, implementedRes] = await Promise.all([
        supabase
          ?.from('incident_response_workflows')
          ?.select('id, incident_type, status, threat_level, detected_at, resolved_at, automated_actions_taken')
          ?.gte('detected_at', startIso)
          ?.order('detected_at', { ascending: false }),
        supabase
          ?.from('feature_requests')
          ?.select('id, title, status, implementation_date, category')
          ?.eq('status', 'implemented')
          ?.not('implementation_date', 'is', null)
          ?.gte('implementation_date', startIso)
          ?.order('implementation_date', { ascending: false })
      ]);

      const incidents = incidentsRes?.data || [];
      const implementations = implementedRes?.data || [];

      const correlation = {
        timeRange,
        incidentCount: incidents?.length,
        implementationCount: implementations?.length,
        incidents: toCamelCase(incidents),
        featureDeployments: toCamelCase(implementations),
        healthImpactScore: incidents?.length === 0 ? 100 : Math.max(0, 100 - (incidents?.length * 5) - (incidents?.filter(i => i?.threat_level === 'critical')?.length * 15)),
        correlatedPairs: []
      };

      implementations?.forEach(impl => {
        const implDate = impl?.implementation_date ? new Date(impl?.implementation_date)?.getTime() : 0;
        const nearby = incidents?.filter(inc => {
          const incDate = new Date(inc?.detected_at)?.getTime();
          const diffHours = Math.abs(incDate - implDate) / (1000 * 60 * 60);
          return diffHours <= 48;
        });
        if (nearby?.length > 0) {
          correlation.correlatedPairs?.push({
            featureRequestId: impl?.id,
            featureTitle: impl?.title,
            implementationDate: impl?.implementation_date,
            incidentIds: nearby?.map(i => i?.id),
            incidentCount: nearby?.length
          });
        }
      });

      analytics?.trackEvent('incident_correlation_viewed', { time_range: timeRange, incident_count: incidents?.length });
      return { data: correlation, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};