import { supabase } from '../lib/supabase';
import { connectionPoolLimits } from './supabasePoolConfig';

const MAX_CONNECTIONS = connectionPoolLimits?.maxConnections;

/**
 * Connection Pool Monitoring Service
 * Tracks active connections, idle connections, wait times, and pool utilization
 */
export const connectionPoolService = {
  _metrics: {
    totalAcquired: 0,
    totalReleased: 0,
    totalTimeouts: 0,
    totalErrors: 0,
    acquisitionTimes: [],
    waitTimes: [],
  },

  /**
   * Query pg_stat_activity for active connection data
   */
  async getConnectionStats() {
    try {
      const { data, error } = await supabase?.rpc('get_connection_pool_stats')?.maybeSingle();

      if (error || !data) {
        // Fallback: query pg_stat_database directly
        const { data: dbStats, error: dbError } = await supabase?.from('pg_stat_database')?.select('numbackends, xact_commit, xact_rollback, blks_read, blks_hit, tup_returned, tup_fetched')?.eq('datname', 'postgres')?.maybeSingle();

        if (dbError) throw dbError;

        const activeConnections = dbStats?.numbackends || 0;
        const utilization = (activeConnections / MAX_CONNECTIONS) * 100;

        return {
          data: {
            activeConnections,
            idleConnections: Math.max(0, MAX_CONNECTIONS - activeConnections),
            waitingConnections: 0,
            totalConnections: activeConnections,
            maxConnections: MAX_CONNECTIONS,
            utilizationPercent: Math.min(100, utilization)?.toFixed(1),
            cacheHitRate: dbStats?.blks_hit
              ? ((dbStats?.blks_hit / (dbStats?.blks_hit + dbStats?.blks_read)) * 100)?.toFixed(2)
              : null,
            timestamp: new Date()?.toISOString(),
          },
          error: null,
        };
      }

      return { data, error: null };
    } catch (error) {
      return { data: this._getFallbackStats(), error: { message: error?.message } };
    }
  },

  /**
   * Get slow queries from pg_stat_statements
   */
  async getSlowQueries(thresholdMs = 1000) {
    try {
      const { data, error } = await supabase?.rpc('get_slow_queries', {
        threshold_ms: thresholdMs,
        limit_count: 20,
      });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: { message: error?.message } };
    }
  },

  /**
   * Get index hit rate from pg_statio_user_tables
   */
  async getIndexHitRate() {
    try {
      const { data, error } = await supabase?.rpc('get_index_hit_rate')?.maybeSingle();

      if (error) throw error;

      return {
        data: {
          indexHitRate: data?.index_hit_rate || null,
          tableHitRate: data?.table_hit_rate || null,
          timestamp: new Date()?.toISOString(),
        },
        error: null,
      };
    } catch (error) {
      return { data: { indexHitRate: null, tableHitRate: null }, error: { message: error?.message } };
    }
  },

  /**
   * Track connection acquisition time
   */
  trackAcquisition(durationMs) {
    this._metrics.totalAcquired++;
    this._metrics?.acquisitionTimes?.push(durationMs);
    // Keep only last 100 measurements
    if (this._metrics?.acquisitionTimes?.length > 100) {
      this._metrics?.acquisitionTimes?.shift();
    }
    this._sendToDatadog('connection.acquisition_time', durationMs);
  },

  /**
   * Track connection timeout
   */
  trackTimeout(errorMessage) {
    this._metrics.totalTimeouts++;
    this._sendToDatadog('connection.timeout', 1, { error: errorMessage });
  },

  /**
   * Track connection error
   */
  trackError(errorCode, errorMessage) {
    this._metrics.totalErrors++;
    this._sendToDatadog('connection.error', 1, { code: errorCode, message: errorMessage });
  },

  /**
   * Get average acquisition time
   */
  getAvgAcquisitionTime() {
    const times = this._metrics?.acquisitionTimes;
    if (!times?.length) return 0;
    return (times?.reduce((sum, t) => sum + t, 0) / times?.length)?.toFixed(2);
  },

  /**
   * Send metric to Datadog APM (browser RUM custom metric)
   */
  _sendToDatadog(metricName, value, tags = {}) {
    try {
      if (typeof window !== 'undefined' && window.DD_RUM) {
        window.DD_RUM?.addAction(metricName, {
          value,
          ...tags,
          service: import.meta.env?.VITE_DATADOG_SERVICE || 'vottery',
          env: import.meta.env?.VITE_DATADOG_ENV || 'production',
        });
      }
    } catch {
      // Silently fail if Datadog not available
    }
  },

  /**
   * Send pool health metrics to Datadog
   */
  async sendPoolHealthToDatadog(stats) {
    const utilization = parseFloat(stats?.utilizationPercent || 0);
    this._sendToDatadog('db.pool.utilization', utilization);
    this._sendToDatadog('db.pool.active_connections', stats?.activeConnections || 0);
    this._sendToDatadog('db.pool.idle_connections', stats?.idleConnections || 0);
    this._sendToDatadog('db.pool.waiting_connections', stats?.waitingConnections || 0);

    if (stats?.cacheHitRate) {
      this._sendToDatadog('db.cache_hit_rate', parseFloat(stats?.cacheHitRate));
    }

    // Alert if pool utilization exceeds 80%
    if (utilization > connectionPoolLimits?.warningThreshold * 100) {
      this._sendToDatadog('db.pool.high_utilization_alert', 1, {
        utilization,
        threshold: connectionPoolLimits?.warningThreshold * 100,
      });
    }
  },

  _getFallbackStats() {
    return {
      activeConnections: 0,
      idleConnections: MAX_CONNECTIONS,
      waitingConnections: 0,
      totalConnections: 0,
      maxConnections: MAX_CONNECTIONS,
      utilizationPercent: '0.0',
      cacheHitRate: null,
      timestamp: new Date()?.toISOString(),
    };
  },
};

export default connectionPoolService;
