import { supabase } from '../lib/supabase';
import { analytics } from '../hooks/useGoogleAnalytics';

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

export const advertiserCampaignService = {
  async getCampaignMetrics(campaignId, timeRange = '24h') {
    try {
      const now = new Date();
      let startDate = new Date();
      
      switch(timeRange) {
        case '1h':
          startDate?.setHours(now?.getHours() - 1);
          break;
        case '24h':
          startDate?.setDate(now?.getDate() - 1);
          break;
        case '7d':
          startDate?.setDate(now?.getDate() - 7);
          break;
        case '30d':
          startDate?.setDate(now?.getDate() - 30);
          break;
        default:
          startDate?.setDate(now?.getDate() - 1);
      }

      const { data, error } = await supabase
        ?.from('advertiser_campaign_metrics')
        ?.select('*')
        ?.eq('campaign_id', campaignId)
        ?.gte('timestamp', startDate?.toISOString())
        ?.order('timestamp', { ascending: false });

      if (error) throw error;

      const aggregatedMetrics = this.aggregateMetrics(data);

      return { data: toCamelCase(aggregatedMetrics), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getAdvertiserDashboard(advertiserId, timeRange = '24h') {
    try {
      const now = new Date();
      let startDate = new Date();
      
      switch(timeRange) {
        case '24h':
          startDate?.setDate(now?.getDate() - 1);
          break;
        case '7d':
          startDate?.setDate(now?.getDate() - 7);
          break;
        case '30d':
          startDate?.setDate(now?.getDate() - 30);
          break;
        default:
          startDate?.setDate(now?.getDate() - 1);
      }

      const { data, error } = await supabase
        ?.from('advertiser_campaign_metrics')
        ?.select('*')
        ?.eq('advertiser_id', advertiserId)
        ?.gte('timestamp', startDate?.toISOString())
        ?.order('timestamp', { ascending: false });

      if (error) throw error;

      const dashboard = {
        overview: this.calculateOverview(data),
        performanceByMetric: this.groupByMetricType(data),
        zonePerformance: this.aggregateZonePerformance(data),
        demographicInsights: this.aggregateDemographicData(data),
        optimizationRecommendations: this.extractRecommendations(data),
        trends: this.calculateTrends(data)
      };

      analytics?.trackEvent('advertiser_dashboard_viewed', {
        advertiser_id: advertiserId,
        time_range: timeRange
      });

      return { data: toCamelCase(dashboard), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  aggregateMetrics(metricsData) {
    const aggregated = {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      totalSpend: 0,
      averageCTR: 0,
      averageCPC: 0,
      averageROI: 0
    };

    metricsData?.forEach(metric => {
      const value = parseFloat(metric?.metric_value) || 0;
      
      switch(metric?.metric_type) {
        case 'impressions':
          aggregated.impressions += value;
          break;
        case 'clicks':
          aggregated.clicks += value;
          break;
        case 'conversions':
          aggregated.conversions += value;
          break;
        case 'roi':
          aggregated.totalROI = (aggregated?.totalROI || 0) + value;
          break;
      }
    });

    if (aggregated?.impressions > 0) {
      aggregated.averageCTR = ((aggregated?.clicks / aggregated?.impressions) * 100)?.toFixed(2);
    }

    return aggregated;
  },

  calculateOverview(metricsData) {
    const impressions = metricsData?.filter(m => m?.metric_type === 'impressions')?.reduce((sum, m) => sum + parseFloat(m?.metric_value || 0), 0);
    const clicks = metricsData?.filter(m => m?.metric_type === 'clicks')?.reduce((sum, m) => sum + parseFloat(m?.metric_value || 0), 0);
    const conversions = metricsData?.filter(m => m?.metric_type === 'conversions')?.reduce((sum, m) => sum + parseFloat(m?.metric_value || 0), 0);
    const roiMetrics = metricsData?.filter(m => m?.metric_type === 'roi');
    const avgROI = roiMetrics?.length > 0 ? roiMetrics?.reduce((sum, m) => sum + parseFloat(m?.metric_value || 0), 0) / roiMetrics?.length : 0;

    return {
      totalImpressions: impressions,
      totalClicks: clicks,
      totalConversions: conversions,
      averageCTR: impressions > 0 ? ((clicks / impressions) * 100)?.toFixed(2) : 0,
      averageROI: avgROI?.toFixed(2),
      conversionRate: clicks > 0 ? ((conversions / clicks) * 100)?.toFixed(2) : 0
    };
  },

  groupByMetricType(metricsData) {
    const grouped = {};
    metricsData?.forEach(metric => {
      const type = metric?.metric_type;
      if (!grouped?.[type]) {
        grouped[type] = [];
      }
      grouped?.[type]?.push({
        value: parseFloat(metric?.metric_value),
        timestamp: metric?.timestamp
      });
    });
    return grouped;
  },

  aggregateZonePerformance(metricsData) {
    const zoneData = {};
    metricsData?.forEach(metric => {
      const breakdown = metric?.zone_breakdown || {};
      Object.keys(breakdown)?.forEach(zone => {
        if (!zoneData?.[zone]) {
          zoneData[zone] = { impressions: 0, clicks: 0, conversions: 0 };
        }
        if (metric?.metric_type === 'impressions') {
          zoneData[zone].impressions += breakdown?.[zone] || 0;
        } else if (metric?.metric_type === 'clicks') {
          zoneData[zone].clicks += breakdown?.[zone] || 0;
        } else if (metric?.metric_type === 'conversions') {
          zoneData[zone].conversions += breakdown?.[zone] || 0;
        }
      });
    });
    return zoneData;
  },

  aggregateDemographicData(metricsData) {
    const demographics = {};
    metricsData?.forEach(metric => {
      const breakdown = metric?.demographic_breakdown || {};
      Object.keys(breakdown)?.forEach(demo => {
        if (!demographics?.[demo]) {
          demographics[demo] = 0;
        }
        demographics[demo] += breakdown?.[demo] || 0;
      });
    });
    return demographics;
  },

  extractRecommendations(metricsData) {
    const recommendations = [];
    metricsData?.forEach(metric => {
      const recs = metric?.optimization_recommendations || [];
      recs?.forEach(rec => {
        if (!recommendations?.find(r => r?.title === rec?.title)) {
          recommendations?.push(rec);
        }
      });
    });
    return recommendations?.slice(0, 5);
  },

  calculateTrends(metricsData) {
    const trends = {};
    const metricTypes = ['impressions', 'clicks', 'conversions', 'roi'];
    
    metricTypes?.forEach(type => {
      const typeData = metricsData?.filter(m => m?.metric_type === type)?.sort((a, b) => 
        new Date(a?.timestamp) - new Date(b?.timestamp)
      );
      
      if (typeData?.length >= 2) {
        const firstValue = parseFloat(typeData?.[0]?.metric_value || 0);
        const lastValue = parseFloat(typeData?.[typeData?.length - 1]?.metric_value || 0);
        const change = firstValue > 0 ? ((lastValue - firstValue) / firstValue * 100)?.toFixed(2) : 0;
        
        trends[type] = {
          trend: change > 0 ? 'increasing' : change < 0 ? 'decreasing' : 'stable',
          changePercentage: change
        };
      }
    });
    
    return trends;
  },

  async recordMetric(metricData) {
    try {
      const { data, error } = await supabase
        ?.from('advertiser_campaign_metrics')
        ?.insert(toSnakeCase(metricData))
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  subscribeToMetrics(campaignId, callback) {
    const channel = supabase
      ?.channel(`campaign_metrics_${campaignId}`)
      ?.on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'advertiser_campaign_metrics',
        filter: `campaign_id=eq.${campaignId}`
      }, (payload) => {
        callback(toCamelCase(payload?.new));
      })
      ?.subscribe();

    return channel;
  },

  unsubscribeFromMetrics(channel) {
    if (channel) {
      supabase?.removeChannel(channel);
    }
  }
};