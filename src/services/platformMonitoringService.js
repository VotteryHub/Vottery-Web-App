import { supabase } from '../lib/supabase';
import { analytics } from '../hooks/useGoogleAnalytics';
import { perplexityThreatService } from './perplexityThreatService';

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

export const platformMonitoringService = {
  // Fraud Detection Effectiveness Tracking
  async getFraudDetectionEffectiveness(timeRange = '24h') {
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

      const { data, error } = await supabase
        ?.from('alert_effectiveness')
        ?.select('*')
        ?.gte('created_at', startDate?.toISOString())
        ?.order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate aggregate metrics
      const totalAlerts = data?.length || 0;
      const truePositives = data?.reduce((sum, item) => sum + (item?.true_positives || 0), 0);
      const falsePositives = data?.reduce((sum, item) => sum + (item?.false_positives || 0), 0);
      const falseNegatives = data?.reduce((sum, item) => sum + (item?.false_negatives || 0), 0);
      const avgResponseTime = data?.reduce((sum, item) => sum + (item?.avg_response_time_minutes || 0), 0) / (totalAlerts || 1);
      const avgEffectiveness = data?.reduce((sum, item) => sum + (item?.effectiveness_score || 0), 0) / (totalAlerts || 1);

      const precision = truePositives > 0 ? (truePositives / (truePositives + falsePositives)) * 100 : 0;
      const recall = truePositives > 0 ? (truePositives / (truePositives + falseNegatives)) * 100 : 0;

      // Track custom event
      analytics?.trackEvent('fraud_effectiveness_viewed', {
        total_alerts: totalAlerts,
        true_positives: truePositives,
        false_positives: falsePositives,
        precision: precision?.toFixed(2),
        time_range: timeRange
      });

      return {
        data: {
          totalAlerts,
          truePositives,
          falsePositives,
          falseNegatives,
          precision: precision?.toFixed(2),
          recall: recall?.toFixed(2),
          avgResponseTime: avgResponseTime?.toFixed(2),
          avgEffectiveness: avgEffectiveness?.toFixed(2),
          details: toCamelCase(data)
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Perplexity AI Enhanced Anomaly Detection
  async getPerplexityAnomalyAnalysis(anomalyData) {
    try {
      const result = await perplexityThreatService?.analyzeAnomalyCorrelation(anomalyData);
      
      if (result?.data) {
        analytics?.trackEvent('perplexity_anomaly_analysis', {
          correlation_score: result?.data?.correlationScore,
          platforms_affected: result?.data?.platformsAffected?.length,
          attack_coordination: result?.data?.attackCoordination
        });
      }

      return result;
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Perplexity AI Fraud Pattern Detection
  async getPerplexityFraudPatterns(transactionData) {
    try {
      const result = await perplexityThreatService?.detectFraudPatterns(transactionData);
      
      if (result?.data) {
        analytics?.trackEvent('perplexity_fraud_patterns_detected', {
          risk_score: result?.data?.riskScore,
          patterns_found: result?.data?.fraudPatterns?.length,
          confidence: result?.data?.confidence
        });
      }

      return result;
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Payment Flow Optimization Tracking
  async getPaymentFlowMetrics(timeRange = '24h') {
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

      const { data, error } = await supabase
        ?.from('wallet_transactions')
        ?.select('*')
        ?.gte('created_at', startDate?.toISOString())
        ?.order('created_at', { ascending: false });

      if (error) throw error;

      // Analyze payment flow stages
      const totalTransactions = data?.length || 0;
      const successfulTransactions = data?.filter(t => t?.status === 'completed')?.length || 0;
      const failedTransactions = data?.filter(t => t?.status === 'failed')?.length || 0;
      const pendingTransactions = data?.filter(t => t?.status === 'pending')?.length || 0;
      
      const successRate = totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0;
      const failureRate = totalTransactions > 0 ? (failedTransactions / totalTransactions) * 100 : 0;

      // Calculate revenue by zone (using metadata if available)
      const zoneBreakdown = {};
      data?.forEach(transaction => {
        const zone = transaction?.metadata?.zone || 'unknown';
        if (!zoneBreakdown?.[zone]) {
          zoneBreakdown[zone] = { count: 0, revenue: 0, success: 0, failed: 0 };
        }
        zoneBreakdown[zone].count++;
        zoneBreakdown[zone].revenue += parseFloat(transaction?.amount) || 0;
        if (transaction?.status === 'completed') zoneBreakdown[zone].success++;
        if (transaction?.status === 'failed') zoneBreakdown[zone].failed++;
      });

      // Identify bottlenecks
      const bottlenecks = [];
      Object.entries(zoneBreakdown)?.forEach(([zone, metrics]) => {
        const zoneFailureRate = metrics?.count > 0 ? (metrics?.failed / metrics?.count) * 100 : 0;
        if (zoneFailureRate > 10) {
          bottlenecks?.push({
            zone,
            failureRate: zoneFailureRate?.toFixed(2),
            failedCount: metrics?.failed,
            recommendation: `Investigate payment processing issues in Zone ${zone}`
          });
        }
      });

      // Track custom event
      analytics?.trackEvent('payment_flow_analyzed', {
        total_transactions: totalTransactions,
        success_rate: successRate?.toFixed(2),
        failure_rate: failureRate?.toFixed(2),
        bottlenecks_found: bottlenecks?.length,
        time_range: timeRange
      });

      return {
        data: {
          totalTransactions,
          successfulTransactions,
          failedTransactions,
          pendingTransactions,
          successRate: successRate?.toFixed(2),
          failureRate: failureRate?.toFixed(2),
          zoneBreakdown,
          bottlenecks,
          transactions: toCamelCase(data)
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Campaign Performance Attribution
  async getCampaignAttribution(timeRange = '24h') {
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

      // Get posts as proxy for campaign content
      const { data: posts, error: postsError } = await supabase
        ?.from('posts')
        ?.select('*')
        ?.gte('created_at', startDate?.toISOString());

      if (postsError) throw postsError;

      // Get user profiles for segment analysis
      const { data: profiles, error: profilesError } = await supabase
        ?.from('user_profiles')
        ?.select('id, role, stats')
        ?.gte('created_at', startDate?.toISOString());

      if (profilesError) throw profilesError;

      // Segment analysis
      const segmentPerformance = {
        voter: { count: 0, engagement: 0, conversions: 0 },
        advertiser: { count: 0, engagement: 0, conversions: 0 },
        admin: { count: 0, engagement: 0, conversions: 0 }
      };

      profiles?.forEach(profile => {
        const role = profile?.role || 'voter';
        if (segmentPerformance?.[role]) {
          segmentPerformance[role].count++;
          segmentPerformance[role].engagement += profile?.stats?.total_votes || 0;
          segmentPerformance[role].conversions += profile?.stats?.elections_participated || 0;
        }
      });

      // Calculate ROI by segment
      const segmentROI = {};
      Object.entries(segmentPerformance)?.forEach(([segment, metrics]) => {
        const avgEngagement = metrics?.count > 0 ? metrics?.engagement / metrics?.count : 0;
        const conversionRate = metrics?.engagement > 0 ? (metrics?.conversions / metrics?.engagement) * 100 : 0;
        segmentROI[segment] = {
          users: metrics?.count,
          avgEngagement: avgEngagement?.toFixed(2),
          conversionRate: conversionRate?.toFixed(2),
          totalConversions: metrics?.conversions
        };
      });

      // Track custom event
      analytics?.trackEvent('campaign_attribution_analyzed', {
        total_campaigns: posts?.length || 0,
        total_users: profiles?.length || 0,
        segments_analyzed: Object.keys(segmentROI)?.length,
        time_range: timeRange
      });

      return {
        data: {
          totalCampaigns: posts?.length || 0,
          totalUsers: profiles?.length || 0,
          segmentPerformance: segmentROI,
          topPerformingSegment: Object.entries(segmentROI)
            ?.sort((a, b) => parseFloat(b?.[1]?.conversionRate) - parseFloat(a?.[1]?.conversionRate))?.[0]?.[0] || 'N/A'
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Custom Event Tracking Configuration
  async trackCustomEvent(eventConfig) {
    try {
      const { eventName, eventType, parameters, threshold } = eventConfig;

      // Track the custom event
      analytics?.trackEvent(eventName, {
        event_type: eventType,
        ...parameters,
        threshold: threshold,
        timestamp: new Date()?.toISOString()
      });

      // Store event configuration for future reference
      const eventData = {
        event_name: eventName,
        event_type: eventType,
        parameters: parameters,
        threshold: threshold,
        tracked_at: new Date()?.toISOString()
      };

      return { data: eventData, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Predictive Analytics for Fraud Patterns
  async getPredictiveFraudAnalytics() {
    try {
      const { data, error } = await supabase
        ?.from('system_alerts')
        ?.select('*')
        ?.eq('category', 'fraud_detection')
        ?.order('created_at', { ascending: false })
        ?.limit(100);

      if (error) throw error;

      // Analyze patterns
      const hourlyDistribution = {};
      const severityDistribution = { low: 0, medium: 0, high: 0, critical: 0 };

      data?.forEach(alert => {
        const hour = new Date(alert?.created_at)?.getHours();
        hourlyDistribution[hour] = (hourlyDistribution?.[hour] || 0) + 1;
        severityDistribution[alert?.severity] = (severityDistribution?.[alert?.severity] || 0) + 1;
      });

      // Identify peak fraud hours
      const peakHours = Object.entries(hourlyDistribution)
        ?.sort((a, b) => b?.[1] - a?.[1])
        ?.slice(0, 3)
        ?.map(([hour, count]) => ({ hour: parseInt(hour), count }));

      return {
        data: {
          totalFraudAlerts: data?.length || 0,
          hourlyDistribution,
          severityDistribution,
          peakHours,
          prediction: 'Increased fraud activity expected during peak hours',
          recommendation: 'Increase monitoring during identified peak hours'
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};