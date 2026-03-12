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
    const snakeKey = key?.replace(/[A-Z]/g, (letter) => `_${letter?.toLowerCase()}`);
    acc[snakeKey] = toSnakeCase(obj?.[key]);
    return acc;
  }, {});
};

export const apiRateLimitingService = {
  // Get all API rate limits
  async getAllRateLimits() {
    try {
      const { data, error } = await supabase
        ?.from('api_rate_limits')
        ?.select('*')
        ?.order('endpoint', { ascending: true });

      if (error) throw error;

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: [], error: { message: error?.message } };
    }
  },

  // Get rate limit for specific endpoint
  async getRateLimitByEndpoint(endpoint, method) {
    try {
      const { data, error } = await supabase
        ?.from('api_rate_limits')
        ?.select('*')
        ?.eq('endpoint', endpoint)
        ?.eq('method', method)
        ?.single();

      if (error && error?.code !== 'PGRST116') throw error;

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Update rate limit configuration
  async updateRateLimit(id, updates) {
    try {
      const { data, error } = await supabase
        ?.from('api_rate_limits')
        ?.update(toSnakeCase({
          ...updates,
          updatedAt: new Date()?.toISOString()
        }))
        ?.eq('id', id)
        ?.select()
        ?.single();

      if (error) throw error;

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get real-time quota monitoring data
  async getQuotaMonitoring(timeRange = '1h') {
    try {
      const now = new Date();
      let startDate = new Date();

      switch (timeRange) {
        case '1h':
          startDate?.setHours(now?.getHours() - 1);
          break;
        case '6h':
          startDate?.setHours(now?.getHours() - 6);
          break;
        case '24h':
          startDate?.setHours(now?.getHours() - 24);
          break;
        default:
          startDate?.setHours(now?.getHours() - 1);
      }

      const { data, error } = await supabase
        ?.from('api_quota_monitoring')
        ?.select('*')
        ?.gte('timestamp', startDate?.toISOString())
        ?.order('timestamp', { ascending: false });

      if (error) throw error;

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: [], error: { message: error?.message } };
    }
  },

  // Log quota monitoring snapshot
  async logQuotaSnapshot(monitoringData) {
    try {
      const { data, error } = await supabase
        ?.from('api_quota_monitoring')
        ?.insert(toSnakeCase(monitoringData))
        ?.select()
        ?.single();

      if (error) throw error;

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get rate limit violations
  async getViolations(timeRange = '24h') {
    try {
      const now = new Date();
      let startDate = new Date();

      switch (timeRange) {
        case '1h':
          startDate?.setHours(now?.getHours() - 1);
          break;
        case '24h':
          startDate?.setHours(now?.getHours() - 24);
          break;
        case '7d':
          startDate?.setDate(now?.getDate() - 7);
          break;
        default:
          startDate?.setHours(now?.getHours() - 24);
      }

      const { data, error } = await supabase
        ?.from('api_rate_limit_violations')
        ?.select('*')
        ?.gte('created_at', startDate?.toISOString())
        ?.order('created_at', { ascending: false });

      if (error) throw error;

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: [], error: { message: error?.message } };
    }
  },

  // Log rate limit violation
  async logViolation(violationData) {
    try {
      const { data, error } = await supabase
        ?.from('api_rate_limit_violations')
        ?.insert(toSnakeCase(violationData))
        ?.select()
        ?.single();

      if (error) throw error;

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Calculate real-time metrics
  async calculateMetrics() {
    try {
      const [rateLimitsResult, violationsResult, quotaResult] = await Promise.all([
        this.getAllRateLimits(),
        this.getViolations('24h'),
        this.getQuotaMonitoring('1h')
      ]);

      const rateLimits = rateLimitsResult?.data || [];
      const violations = violationsResult?.data || [];
      const quotaData = quotaResult?.data || [];

      // Calculate aggregate metrics
      const totalEndpoints = rateLimits?.length;
      const throttledEndpoints = rateLimits?.filter(r => r?.throttleEnabled)?.length;
      const totalViolations = violations?.length;
      const blockedRequests = violations?.filter(v => v?.blocked)?.length;

      // Calculate average quota utilization
      const avgQuotaUtilization = quotaData?.length > 0
        ? quotaData?.reduce((sum, q) => sum + (q?.quotaUtilizationPercent || 0), 0) / quotaData?.length
        : 0;

      // Detect abuse patterns
      const abuseDetected = violations?.filter(v => v?.severity === 'high')?.length > 0;

      // Predictive scaling indicators
      const highUtilizationEndpoints = rateLimits?.filter(r => {
        const utilization = (r?.currentMinuteCount / r?.quotaPerMinute) * 100;
        return utilization > 80;
      });

      return {
        data: {
          totalEndpoints,
          throttledEndpoints,
          totalViolations,
          blockedRequests,
          avgQuotaUtilization: avgQuotaUtilization?.toFixed(2),
          abuseDetected,
          highUtilizationEndpoints: highUtilizationEndpoints?.length,
          predictiveScalingNeeded: highUtilizationEndpoints?.length > 0,
          lastUpdated: new Date()?.toISOString()
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Enable/disable throttling for endpoint
  async toggleThrottling(id, enabled) {
    try {
      const { data, error } = await supabase
        ?.from('api_rate_limits')
        ?.update({ throttle_enabled: enabled })
        ?.eq('id', id)
        ?.select()
        ?.single();

      if (error) throw error;

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get endpoint performance trends
  async getEndpointTrends(endpoint, method, timeRange = '24h') {
    try {
      const now = new Date();
      let startDate = new Date();

      switch (timeRange) {
        case '1h':
          startDate?.setHours(now?.getHours() - 1);
          break;
        case '24h':
          startDate?.setHours(now?.getHours() - 24);
          break;
        case '7d':
          startDate?.setDate(now?.getDate() - 7);
          break;
        default:
          startDate?.setHours(now?.getHours() - 24);
      }

      const { data, error } = await supabase
        ?.from('api_quota_monitoring')
        ?.select('*')
        ?.eq('endpoint', endpoint)
        ?.eq('method', method)
        ?.gte('timestamp', startDate?.toISOString())
        ?.order('timestamp', { ascending: true });

      if (error) throw error;

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: [], error: { message: error?.message } };
    }
  }
};