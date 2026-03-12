import { trackEvent } from '../hooks/useGoogleAnalytics';
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

export const performanceMonitoringService = {
  // Track screen load time
  trackScreenLoad: (screenName, loadTime, metadata = {}) => {
    if (typeof window?.gtag !== 'undefined') {
      trackEvent('screen_load', {
        screen_name: screenName,
        load_time_ms: loadTime,
        page_path: window?.location?.pathname,
        ...metadata
      });
    }

    // Also log to database for analytics
    performanceMonitoringService?.logPerformanceMetric({
      metricType: 'screen_load',
      screenName,
      value: loadTime,
      metadata
    });
  },

  // Track user interaction patterns
  trackInteraction: (interactionType, targetElement, metadata = {}) => {
    const interactionTime = Date.now();
    
    if (typeof window?.gtag !== 'undefined') {
      trackEvent('user_interaction', {
        interaction_type: interactionType,
        target_element: targetElement,
        screen_name: window?.location?.pathname,
        timestamp: interactionTime,
        ...metadata
      });
    }

    performanceMonitoringService?.logPerformanceMetric({
      metricType: 'user_interaction',
      screenName: window?.location?.pathname,
      value: interactionTime,
      metadata: {
        interactionType,
        targetElement,
        ...metadata
      }
    });
  },

  // Track feature adoption
  trackFeatureAdoption: (featureName, adoptionStatus, metadata = {}) => {
    if (typeof window?.gtag !== 'undefined') {
      trackEvent('feature_adoption', {
        feature_name: featureName,
        adoption_status: adoptionStatus,
        screen_name: window?.location?.pathname,
        ...metadata
      });
    }

    performanceMonitoringService?.logPerformanceMetric({
      metricType: 'feature_adoption',
      screenName: window?.location?.pathname,
      value: adoptionStatus === 'adopted' ? 1 : 0,
      metadata: {
        featureName,
        adoptionStatus,
        ...metadata
      }
    });
  },

  // Track conversion funnels
  trackConversionFunnel: (funnelName, step, completed = false, metadata = {}) => {
    if (typeof window?.gtag !== 'undefined') {
      trackEvent('conversion_funnel', {
        funnel_name: funnelName,
        funnel_step: step,
        completed: completed,
        screen_name: window?.location?.pathname,
        ...metadata
      });
    }

    performanceMonitoringService?.logPerformanceMetric({
      metricType: 'conversion_funnel',
      screenName: window?.location?.pathname,
      value: completed ? 1 : 0,
      metadata: {
        funnelName,
        step,
        completed,
        ...metadata
      }
    });
  },

  // Track API performance
  trackAPIPerformance: (endpoint, duration, status, metadata = {}) => {
    if (typeof window?.gtag !== 'undefined') {
      trackEvent('api_performance', {
        endpoint: endpoint,
        duration_ms: duration,
        status: status,
        ...metadata
      });
    }

    performanceMonitoringService?.logPerformanceMetric({
      metricType: 'api_performance',
      screenName: window?.location?.pathname,
      value: duration,
      metadata: {
        endpoint,
        status,
        ...metadata
      }
    });
  },

  // Track Core Web Vitals
  trackWebVitals: (metric) => {
    if (typeof window?.gtag !== 'undefined') {
      trackEvent('web_vitals', {
        metric_name: metric?.name,
        metric_value: metric?.value,
        metric_rating: metric?.rating,
        metric_delta: metric?.delta,
        metric_id: metric?.id
      });
    }

    performanceMonitoringService?.logPerformanceMetric({
      metricType: 'web_vitals',
      screenName: window?.location?.pathname,
      value: metric?.value,
      metadata: {
        name: metric?.name,
        rating: metric?.rating,
        delta: metric?.delta,
        id: metric?.id
      }
    });
  },

  // Log performance metric to database
  async logPerformanceMetric(metricData) {
    try {
      const { data: userData } = await supabase?.auth?.getUser();
      const userId = userData?.user?.id;

      const { data, error } = await supabase
        ?.from('performance_metrics')
        ?.insert([toSnakeCase({
          metricType: metricData?.metricType,
          screenName: metricData?.screenName,
          value: metricData?.value,
          userId: userId || null,
          userAgent: navigator?.userAgent,
          metadata: metricData?.metadata || {},
          createdAt: new Date()?.toISOString()
        })])
        ?.select()
        ?.single();

      return { data: toCamelCase(data), error };
    } catch (error) {
      console.error('Failed to log performance metric:', error);
      return { data: null, error };
    }
  },

  // Get performance analytics
  async getPerformanceAnalytics(timeRange = '24h', screenName = null) {
    try {
      const now = new Date();
      let startDate = new Date();
      
      switch(timeRange) {
        case '1h':
          startDate?.setHours(now?.getHours() - 1);
          break;
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

      let query = supabase
        ?.from('performance_metrics')
        ?.select('*')
        ?.gte('created_at', startDate?.toISOString())
        ?.order('created_at', { ascending: false });

      if (screenName) {
        query = query?.eq('screen_name', screenName);
      }

      const { data, error } = await query;

      if (error) throw error;

      const metrics = toCamelCase(data) || [];

      // Calculate statistics by metric type
      const metricsByType = {};
      metrics?.forEach(metric => {
        const type = metric?.metricType;
        if (!metricsByType?.[type]) {
          metricsByType[type] = {
            count: 0,
            totalValue: 0,
            avgValue: 0,
            minValue: Infinity,
            maxValue: -Infinity,
            values: []
          };
        }
        metricsByType[type].count++;
        metricsByType[type].totalValue += metric?.value || 0;
        metricsByType[type].minValue = Math.min(metricsByType?.[type]?.minValue, metric?.value || 0);
        metricsByType[type].maxValue = Math.max(metricsByType?.[type]?.maxValue, metric?.value || 0);
        metricsByType?.[type]?.values?.push(metric?.value || 0);
      });

      // Calculate averages and percentiles
      Object.keys(metricsByType)?.forEach(type => {
        const stats = metricsByType?.[type];
        stats.avgValue = stats?.count > 0 ? stats?.totalValue / stats?.count : 0;
        
        // Calculate p50, p75, p95, p99
        const sorted = stats?.values?.sort((a, b) => a - b);
        stats.p50 = sorted?.[Math.floor(sorted?.length * 0.5)] || 0;
        stats.p75 = sorted?.[Math.floor(sorted?.length * 0.75)] || 0;
        stats.p95 = sorted?.[Math.floor(sorted?.length * 0.95)] || 0;
        stats.p99 = sorted?.[Math.floor(sorted?.length * 0.99)] || 0;
        
        delete stats?.values; // Remove raw values to reduce payload
      });

      // Calculate screen-level statistics
      const screenStats = {};
      metrics?.forEach(metric => {
        const screen = metric?.screenName || 'unknown';
        if (!screenStats?.[screen]) {
          screenStats[screen] = {
            totalMetrics: 0,
            avgLoadTime: 0,
            loadTimeCount: 0,
            interactionCount: 0
          };
        }
        screenStats[screen].totalMetrics++;
        
        if (metric?.metricType === 'screen_load') {
          screenStats[screen].avgLoadTime += metric?.value || 0;
          screenStats[screen].loadTimeCount++;
        }
        
        if (metric?.metricType === 'user_interaction') {
          screenStats[screen].interactionCount++;
        }
      });

      // Calculate averages for screens
      Object.keys(screenStats)?.forEach(screen => {
        const stats = screenStats?.[screen];
        if (stats?.loadTimeCount > 0) {
          stats.avgLoadTime = (stats?.avgLoadTime / stats?.loadTimeCount)?.toFixed(2);
        }
      });

      // Identify bottleneck screens (slowest load times)
      const bottleneckScreens = Object.entries(screenStats)
        ?.filter(([_, stats]) => stats?.loadTimeCount > 0)
        ?.sort(([_, a], [__, b]) => parseFloat(b?.avgLoadTime) - parseFloat(a?.avgLoadTime))
        ?.slice(0, 10)
        ?.map(([screen, stats]) => ({
          screenName: screen,
          avgLoadTime: stats?.avgLoadTime,
          totalMetrics: stats?.totalMetrics,
          interactionCount: stats?.interactionCount
        }));

      return {
        data: {
          overview: {
            totalMetrics: metrics?.length,
            timeRange,
            screenName: screenName || 'all'
          },
          metricsByType,
          screenStats,
          bottleneckScreens,
          recentMetrics: metrics?.slice(0, 50)
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get conversion funnel analytics
  async getConversionFunnelAnalytics(funnelName, timeRange = '7d') {
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
          startDate?.setDate(now?.getDate() - 7);
      }

      const { data, error } = await supabase
        ?.from('performance_metrics')
        ?.select('*')
        ?.eq('metric_type', 'conversion_funnel')
        ?.gte('created_at', startDate?.toISOString())
        ?.order('created_at', { ascending: true });

      if (error) throw error;

      const metrics = toCamelCase(data) || [];
      const funnelMetrics = metrics?.filter(m => 
        m?.metadata?.funnelName === funnelName
      );

      // Calculate funnel steps
      const stepStats = {};
      funnelMetrics?.forEach(metric => {
        const step = metric?.metadata?.step;
        if (!stepStats?.[step]) {
          stepStats[step] = {
            total: 0,
            completed: 0,
            conversionRate: 0
          };
        }
        stepStats[step].total++;
        if (metric?.metadata?.completed) {
          stepStats[step].completed++;
        }
      });

      // Calculate conversion rates
      Object.keys(stepStats)?.forEach(step => {
        const stats = stepStats?.[step];
        stats.conversionRate = stats?.total > 0 
          ? ((stats?.completed / stats?.total) * 100)?.toFixed(2)
          : 0;
      });

      return {
        data: {
          funnelName,
          timeRange,
          stepStats,
          totalEntries: funnelMetrics?.length
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get feature adoption rates
  async getFeatureAdoptionRates(timeRange = '30d') {
    try {
      const now = new Date();
      let startDate = new Date();
      
      switch(timeRange) {
        case '7d':
          startDate?.setDate(now?.getDate() - 7);
          break;
        case '30d':
          startDate?.setDate(now?.getDate() - 30);
          break;
        case '90d':
          startDate?.setDate(now?.getDate() - 90);
          break;
        default:
          startDate?.setDate(now?.getDate() - 30);
      }

      const { data, error } = await supabase
        ?.from('performance_metrics')
        ?.select('*')
        ?.eq('metric_type', 'feature_adoption')
        ?.gte('created_at', startDate?.toISOString())
        ?.order('created_at', { ascending: false });

      if (error) throw error;

      const metrics = toCamelCase(data) || [];

      // Calculate adoption rates by feature
      const featureStats = {};
      metrics?.forEach(metric => {
        const feature = metric?.metadata?.featureName;
        if (!featureStats?.[feature]) {
          featureStats[feature] = {
            total: 0,
            adopted: 0,
            adoptionRate: 0
          };
        }
        featureStats[feature].total++;
        if (metric?.metadata?.adoptionStatus === 'adopted') {
          featureStats[feature].adopted++;
        }
      });

      // Calculate adoption rates
      Object.keys(featureStats)?.forEach(feature => {
        const stats = featureStats?.[feature];
        stats.adoptionRate = stats?.total > 0 
          ? ((stats?.adopted / stats?.total) * 100)?.toFixed(2)
          : 0;
      });

      // Sort by adoption rate
      const sortedFeatures = Object.entries(featureStats)
        ?.sort(([_, a], [__, b]) => parseFloat(b?.adoptionRate) - parseFloat(a?.adoptionRate))
        ?.map(([feature, stats]) => ({
          featureName: feature,
          ...stats
        }));

      return {
        data: {
          timeRange,
          featureStats: sortedFeatures,
          totalFeatures: sortedFeatures?.length
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};