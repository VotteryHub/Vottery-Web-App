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

export const apiPerformanceService = {
  async monitorAPIPerformance(timeRange = '1h') {
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

      const { data: apiLogs, error } = await supabase
        ?.from('api_request_logs')
        ?.select('*')
        ?.gte('created_at', startDate?.toISOString())
        ?.order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate performance metrics
      const metrics = this.calculatePerformanceMetrics(apiLogs);

      // Detect bottlenecks
      const bottlenecks = this.detectBottlenecks(apiLogs);

      // Generate caching recommendations
      const cachingRecommendations = this.generateCachingRecommendations(apiLogs, bottlenecks);

      return {
        data: {
          metrics,
          bottlenecks,
          cachingRecommendations,
          totalRequests: apiLogs?.length,
          timeRange,
          analyzedAt: new Date()?.toISOString()
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  calculatePerformanceMetrics(apiLogs) {
    if (!apiLogs || apiLogs?.length === 0) {
      return {
        avgResponseTime: 0,
        p50ResponseTime: 0,
        p95ResponseTime: 0,
        p99ResponseTime: 0,
        errorRate: 0,
        requestsPerMinute: 0
      };
    }

    // Calculate average response time
    const responseTimes = apiLogs?.map(log => log?.response_time || 0)?.sort((a, b) => a - b);
    const avgResponseTime = responseTimes?.reduce((sum, time) => sum + time, 0) / responseTimes?.length;

    // Calculate percentiles
    const p50Index = Math.floor(responseTimes?.length * 0.5);
    const p95Index = Math.floor(responseTimes?.length * 0.95);
    const p99Index = Math.floor(responseTimes?.length * 0.99);

    const p50ResponseTime = responseTimes?.[p50Index] || 0;
    const p95ResponseTime = responseTimes?.[p95Index] || 0;
    const p99ResponseTime = responseTimes?.[p99Index] || 0;

    // Calculate error rate
    const errorCount = apiLogs?.filter(log => log?.status_code >= 400)?.length;
    const errorRate = (errorCount / apiLogs?.length) * 100;

    // Calculate requests per minute
    const timeSpan = (new Date(apiLogs?.[0]?.created_at)?.getTime() - new Date(apiLogs?.[apiLogs?.length - 1]?.created_at)?.getTime()) / 1000 / 60;
    const requestsPerMinute = apiLogs?.length / (timeSpan || 1);

    return {
      avgResponseTime: avgResponseTime?.toFixed(2),
      p50ResponseTime: p50ResponseTime?.toFixed(2),
      p95ResponseTime: p95ResponseTime?.toFixed(2),
      p99ResponseTime: p99ResponseTime?.toFixed(2),
      errorRate: errorRate?.toFixed(2),
      requestsPerMinute: requestsPerMinute?.toFixed(2)
    };
  },

  detectBottlenecks(apiLogs) {
    const bottlenecks = [];
    const endpointStats = {};

    // Group by endpoint
    apiLogs?.forEach(log => {
      const endpoint = log?.endpoint;
      if (!endpointStats?.[endpoint]) {
        endpointStats[endpoint] = {
          endpoint,
          requests: [],
          totalRequests: 0,
          avgResponseTime: 0,
          maxResponseTime: 0,
          errorCount: 0
        };
      }

      endpointStats?.[endpoint]?.requests?.push(log);
      endpointStats[endpoint].totalRequests++;
      endpointStats[endpoint].maxResponseTime = Math.max(
        endpointStats?.[endpoint]?.maxResponseTime,
        log?.response_time || 0
      );

      if (log?.status_code >= 400) {
        endpointStats[endpoint].errorCount++;
      }
    });

    // Calculate averages and identify bottlenecks
    Object.values(endpointStats)?.forEach(stats => {
      const responseTimes = stats?.requests?.map(r => r?.response_time || 0);
      stats.avgResponseTime = responseTimes?.reduce((sum, time) => sum + time, 0) / responseTimes?.length;

      // Identify as bottleneck if:
      // 1. Average response time > 2000ms
      // 2. Max response time > 5000ms
      // 3. Error rate > 5%
      const errorRate = (stats?.errorCount / stats?.totalRequests) * 100;

      if (stats?.avgResponseTime > 2000 || stats?.maxResponseTime > 5000 || errorRate > 5) {
        bottlenecks?.push({
          endpoint: stats?.endpoint,
          severity: this.calculateBottleneckSeverity(stats?.avgResponseTime, stats?.maxResponseTime, errorRate),
          avgResponseTime: stats?.avgResponseTime?.toFixed(2),
          maxResponseTime: stats?.maxResponseTime?.toFixed(2),
          errorRate: errorRate?.toFixed(2),
          totalRequests: stats?.totalRequests,
          issues: this.identifyBottleneckIssues(stats?.avgResponseTime, stats?.maxResponseTime, errorRate)
        });
      }
    });

    // Sort by severity
    bottlenecks?.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder?.[a?.severity] - severityOrder?.[b?.severity];
    });

    return bottlenecks;
  },

  calculateBottleneckSeverity(avgResponseTime, maxResponseTime, errorRate) {
    if (maxResponseTime > 10000 || errorRate > 15) return 'critical';
    if (avgResponseTime > 5000 || maxResponseTime > 7500 || errorRate > 10) return 'high';
    if (avgResponseTime > 3000 || maxResponseTime > 5000 || errorRate > 5) return 'medium';
    return 'low';
  },

  identifyBottleneckIssues(avgResponseTime, maxResponseTime, errorRate) {
    const issues = [];

    if (avgResponseTime > 2000) {
      issues?.push('High average response time');
    }

    if (maxResponseTime > 5000) {
      issues?.push('Extremely slow requests detected');
    }

    if (errorRate > 5) {
      issues?.push('High error rate');
    }

    return issues;
  },

  generateCachingRecommendations(apiLogs, bottlenecks) {
    const recommendations = [];

    // Analyze high-volume endpoints
    const endpointCounts = {};
    apiLogs?.forEach(log => {
      const endpoint = log?.endpoint;
      endpointCounts[endpoint] = (endpointCounts?.[endpoint] || 0) + 1;
    });

    // Recommend caching for high-volume endpoints
    Object.entries(endpointCounts)?.forEach(([endpoint, count]) => {
      if (count > 100) {
        const bottleneck = bottlenecks?.find(b => b?.endpoint === endpoint);
        const priority = bottleneck ? 'high' : 'medium';

        recommendations?.push({
          endpoint,
          strategy: 'redis_cache',
          priority,
          reason: `High request volume (${count} requests). Caching can reduce database load.`,
          estimatedImprovement: this.estimateCachingImprovement(count, bottleneck),
          implementation: {
            ttl: this.recommendCacheTTL(endpoint),
            invalidation: 'time-based',
            keyPattern: `cache:${endpoint}:*`
          }
        });
      }
    });

    // Recommend CDN caching for static content
    const staticEndpoints = apiLogs?.filter(log => 
      log?.endpoint?.includes('/static/') || 
      log?.endpoint?.includes('/assets/') ||
      log?.endpoint?.includes('/images/')
    );

    if (staticEndpoints?.length > 50) {
      recommendations?.push({
        endpoint: 'static_content',
        strategy: 'cdn_cache',
        priority: 'high',
        reason: `${staticEndpoints?.length} static content requests. CDN caching recommended.`,
        estimatedImprovement: '80-90% response time reduction',
        implementation: {
          ttl: 86400, // 24 hours
          invalidation: 'version-based',
          provider: 'cloudflare_or_aws_cloudfront'
        }
      });
    }

    // Recommend database query optimization for slow endpoints
    bottlenecks?.forEach(bottleneck => {
      if (bottleneck?.avgResponseTime > 3000) {
        recommendations?.push({
          endpoint: bottleneck?.endpoint,
          strategy: 'query_optimization',
          priority: 'critical',
          reason: `Slow database queries detected (avg: ${bottleneck?.avgResponseTime}ms)`,
          estimatedImprovement: '50-70% response time reduction',
          implementation: {
            actions: [
              'Add database indexes',
              'Optimize SQL queries',
              'Implement query result caching',
              'Consider read replicas for high-volume operations'
            ]
          }
        });
      }
    });

    return recommendations;
  },

  estimateCachingImprovement(requestCount, bottleneck) {
    if (bottleneck) {
      return `${Math.min(90, 50 + (requestCount / 10))}% response time reduction`;
    }
    return `${Math.min(70, 30 + (requestCount / 20))}% database load reduction`;
  },

  recommendCacheTTL(endpoint) {
    // Recommend TTL based on endpoint type
    if (endpoint?.includes('/elections/')) return 300; // 5 minutes
    if (endpoint?.includes('/users/')) return 600; // 10 minutes
    if (endpoint?.includes('/analytics/')) return 1800; // 30 minutes
    if (endpoint?.includes('/static/')) return 86400; // 24 hours
    return 300; // Default 5 minutes
  },

  async getRealTimeMetrics() {
    try {
      // Get metrics from last 5 minutes
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)?.toISOString();

      const { data: recentLogs, error } = await supabase
        ?.from('api_request_logs')
        ?.select('*')
        ?.gte('created_at', fiveMinutesAgo)
        ?.order('created_at', { ascending: false });

      if (error) throw error;

      const metrics = this.calculatePerformanceMetrics(recentLogs);

      return {
        data: {
          ...metrics,
          totalRequests: recentLogs?.length,
          timeWindow: '5m',
          timestamp: new Date()?.toISOString()
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async logAPIRequest(requestData) {
    try {
      const { error } = await supabase
        ?.from('api_request_logs')
        ?.insert(toSnakeCase(requestData));

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error logging API request:', error);
      return { success: false, error: error?.message };
    }
  }
};
