import { supabase } from '../lib/supabase';
import { trackEvent } from '../hooks/useGoogleAnalytics';

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAYS = [1000, 3000, 5000]; // Progressive delays in ms

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

export const errorRecoveryService = {
  // Log error to database
  async logError(errorData) {
    try {
      const { data, error } = await supabase
        ?.from('error_logs')
        ?.insert([toSnakeCase({
          errorType: errorData?.errorType || 'unknown',
          errorMessage: errorData?.errorMessage,
          errorStack: errorData?.errorStack,
          componentName: errorData?.componentName,
          screenName: errorData?.screenName,
          userId: errorData?.userId,
          userAgent: navigator?.userAgent,
          url: window?.location?.href,
          retryAttempts: errorData?.retryAttempts || 0,
          recovered: errorData?.recovered || false,
          metadata: errorData?.metadata || {},
          createdAt: new Date()?.toISOString()
        })])
        ?.select()
        ?.single();

      // Track error in Google Analytics
      if (typeof window?.gtag !== 'undefined') {
        trackEvent('error_occurred', {
          error_type: errorData?.errorType,
          component_name: errorData?.componentName,
          screen_name: errorData?.screenName,
          recovered: errorData?.recovered
        });
      }

      return { data: toCamelCase(data), error };
    } catch (err) {
      console.error('Failed to log error:', err);
      return { data: null, error: err };
    }
  },

  // Retry function with exponential backoff
  async retryOperation(operation, context = {}) {
    let lastError = null;
    
    for (let attempt = 0; attempt < MAX_RETRY_ATTEMPTS; attempt++) {
      try {
        const result = await operation();
        
        // Log successful retry
        if (attempt > 0) {
          await this.logError({
            errorType: 'retry_success',
            errorMessage: `Operation succeeded after ${attempt} retries`,
            componentName: context?.componentName,
            screenName: context?.screenName,
            userId: context?.userId,
            retryAttempts: attempt,
            recovered: true,
            metadata: { context }
          });

          // Track successful retry
          if (typeof window?.gtag !== 'undefined') {
            trackEvent('error_recovered', {
              retry_attempts: attempt,
              component_name: context?.componentName,
              screen_name: context?.screenName
            });
          }
        }
        
        return { data: result, error: null, recovered: attempt > 0 };
      } catch (error) {
        lastError = error;
        
        // Don't retry on certain error types
        if (this.isNonRetryableError(error)) {
          break;
        }
        
        // Wait before retrying
        if (attempt < MAX_RETRY_ATTEMPTS - 1) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAYS[attempt]));
        }
      }
    }
    
    // Log failed retry attempts
    await this.logError({
      errorType: 'retry_failed',
      errorMessage: lastError?.message || 'Operation failed after all retries',
      errorStack: lastError?.stack,
      componentName: context?.componentName,
      screenName: context?.screenName,
      userId: context?.userId,
      retryAttempts: MAX_RETRY_ATTEMPTS,
      recovered: false,
      metadata: { context, lastError: lastError?.toString() }
    });
    
    return { data: null, error: lastError, recovered: false };
  },

  // Check if error should not be retried
  isNonRetryableError(error) {
    const nonRetryablePatterns = [
      'authentication',
      'authorization',
      'permission denied',
      'invalid token',
      '401',
      '403',
      '404',
      'not found'
    ];
    
    const errorMessage = error?.message?.toLowerCase() || '';
    return nonRetryablePatterns?.some(pattern => errorMessage?.includes(pattern));
  },

  // Get error statistics
  async getErrorStatistics(timeRange = '24h') {
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

      const { data, error } = await supabase
        ?.from('error_logs')
        ?.select('*')
        ?.gte('created_at', startDate?.toISOString())
        ?.order('created_at', { ascending: false });

      if (error) throw error;

      const errors = toCamelCase(data) || [];

      // Calculate statistics
      const totalErrors = errors?.length;
      const recoveredErrors = errors?.filter(e => e?.recovered)?.length;
      const failedErrors = totalErrors - recoveredErrors;
      const recoveryRate = totalErrors > 0 ? (recoveredErrors / totalErrors) * 100 : 0;

      // Group by error type
      const errorsByType = {};
      errors?.forEach(error => {
        const type = error?.errorType || 'unknown';
        if (!errorsByType?.[type]) {
          errorsByType[type] = { count: 0, recovered: 0, failed: 0 };
        }
        errorsByType[type].count++;
        if (error?.recovered) {
          errorsByType[type].recovered++;
        } else {
          errorsByType[type].failed++;
        }
      });

      // Group by screen
      const errorsByScreen = {};
      errors?.forEach(error => {
        const screen = error?.screenName || 'unknown';
        if (!errorsByScreen?.[screen]) {
          errorsByScreen[screen] = { count: 0, recovered: 0, failed: 0 };
        }
        errorsByScreen[screen].count++;
        if (error?.recovered) {
          errorsByScreen[screen].recovered++;
        } else {
          errorsByScreen[screen].failed++;
        }
      });

      // Group by component
      const errorsByComponent = {};
      errors?.forEach(error => {
        const component = error?.componentName || 'unknown';
        if (!errorsByComponent?.[component]) {
          errorsByComponent[component] = { count: 0, recovered: 0, failed: 0 };
        }
        errorsByComponent[component].count++;
        if (error?.recovered) {
          errorsByComponent[component].recovered++;
        } else {
          errorsByComponent[component].failed++;
        }
      });

      // Calculate average retry attempts
      const totalRetries = errors?.reduce((sum, e) => sum + (e?.retryAttempts || 0), 0);
      const averageRetries = totalErrors > 0 ? (totalRetries / totalErrors)?.toFixed(2) : 0;

      // Get recent critical errors (unrecovered)
      const criticalErrors = errors
        ?.filter(e => !e?.recovered)
        ?.slice(0, 10);

      return {
        data: {
          overview: {
            totalErrors,
            recoveredErrors,
            failedErrors,
            recoveryRate: recoveryRate?.toFixed(2),
            averageRetries
          },
          errorsByType,
          errorsByScreen,
          errorsByComponent,
          criticalErrors,
          recentErrors: errors?.slice(0, 20)
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get error trends over time
  async getErrorTrends(days = 7) {
    try {
      const now = new Date();
      const startDate = new Date();
      startDate?.setDate(now?.getDate() - days);

      const { data, error } = await supabase
        ?.from('error_logs')
        ?.select('created_at, error_type, recovered')
        ?.gte('created_at', startDate?.toISOString())
        ?.order('created_at', { ascending: true });

      if (error) throw error;

      const errors = toCamelCase(data) || [];

      // Group by day
      const trendsByDay = {};
      errors?.forEach(error => {
        const day = new Date(error?.createdAt)?.toISOString()?.split('T')?.[0];
        if (!trendsByDay?.[day]) {
          trendsByDay[day] = { total: 0, recovered: 0, failed: 0 };
        }
        trendsByDay[day].total++;
        if (error?.recovered) {
          trendsByDay[day].recovered++;
        } else {
          trendsByDay[day].failed++;
        }
      });

      // Convert to array format
      const trends = Object.entries(trendsByDay)?.map(([date, stats]) => ({
        date,
        ...stats,
        recoveryRate: stats?.total > 0 ? ((stats?.recovered / stats?.total) * 100)?.toFixed(2) : 0
      }));

      return { data: trends, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Clear old error logs (cleanup)
  async clearOldErrors(daysToKeep = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate?.setDate(cutoffDate?.getDate() - daysToKeep);

      const { data, error } = await supabase
        ?.from('error_logs')
        ?.delete()
        ?.lt('created_at', cutoffDate?.toISOString());

      return { data, error };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};