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

export const financialTrackingService = {
  async getFinancialOverview(timeRange = '30d') {
    try {
      const { data, error } = await supabase
        ?.from('financial_tracking')
        ?.select('*')
        ?.eq('time_period', timeRange)
        ?.order('recorded_at', { ascending: false });

      if (error) throw error;

      const overview = {
        totalRevenue: 0,
        totalPrizePools: 0,
        totalParticipationFees: 0,
        totalAdvertiserSpending: 0,
        averageROI: 0,
        activeZones: 8
      };

      data?.forEach(record => {
        if (record?.metric_type === 'prize_pool') overview.totalPrizePools += parseFloat(record?.amount || 0);
        if (record?.metric_type === 'participation_fee') overview.totalParticipationFees += parseFloat(record?.amount || 0);
        if (record?.metric_type === 'advertiser_spending') overview.totalAdvertiserSpending += parseFloat(record?.amount || 0);
      });

      overview.totalRevenue = overview?.totalParticipationFees + overview?.totalAdvertiserSpending;
      const roiRecords = data?.filter(r => r?.roi_percentage > 0);
      overview.averageROI = roiRecords?.length > 0
        ? roiRecords?.reduce((sum, r) => sum + parseFloat(r?.roi_percentage || 0), 0) / roiRecords?.length
        : 0;

      return { data: overview, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getZonePerformance(timeRange = '30d') {
    try {
      const { data, error } = await supabase
        ?.from('zone_performance_metrics')
        ?.select('*')
        ?.eq('time_period', timeRange)
        ?.order('zone', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getFinancialForecasts(zone = null) {
    try {
      let query = supabase
        ?.from('financial_forecasts')
        ?.select('*')
        ?.gte('valid_until', new Date()?.toISOString())
        ?.order('created_at', { ascending: false });

      if (zone) {
        query = query?.eq('zone', zone);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getFinancialTrends(zone, metricType, timeRange = '30d') {
    try {
      const { data, error } = await supabase
        ?.from('financial_tracking')
        ?.select('*')
        ?.eq('zone', zone)
        ?.eq('metric_type', metricType)
        ?.eq('time_period', timeRange)
        ?.order('recorded_at', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async createFinancialRecord(recordData) {
    try {
      const { data, error } = await supabase
        ?.from('financial_tracking')
        ?.insert(toSnakeCase(recordData))
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async updateZonePerformance(zone, updates) {
    try {
      const { data, error } = await supabase
        ?.from('zone_performance_metrics')
        ?.update(toSnakeCase(updates))
        ?.eq('zone', zone)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getOptimizationRecommendations() {
    try {
      const { data, error } = await supabase
        ?.from('financial_forecasts')
        ?.select('zone, forecast_type, optimization_recommendations, confidence_level')
        ?.gte('valid_until', new Date()?.toISOString())
        ?.order('confidence_level', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};