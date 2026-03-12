import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { connectionPoolService } from '../../services/connectionPoolService';
import {
  Activity, Database, Zap, AlertTriangle, CheckCircle, RefreshCw,
  Clock, TrendingUp, TrendingDown, Server, BarChart2, Wifi
} from 'lucide-react';
import Icon from '../../components/AppIcon';


const REFRESH_INTERVAL = 30000; // 30 seconds
const SLOW_QUERY_ALERT_THRESHOLD = 10; // per hour
const INDEX_HIT_RATE_THRESHOLD = 95; // percent
const POOL_UTILIZATION_THRESHOLD = 80; // percent

function MetricCard({ title, value, unit, status, icon: Icon, trend, description }) {
  const statusColors = {
    good: 'border-green-500/30 bg-green-500/5',
    warning: 'border-yellow-500/30 bg-yellow-500/5',
    critical: 'border-red-500/30 bg-red-500/5',
    neutral: 'border-white/10 bg-white/5',
  };
  const statusTextColors = {
    good: 'text-green-400',
    warning: 'text-yellow-400',
    critical: 'text-red-400',
    neutral: 'text-blue-400',
  };

  return (
    <div className={`rounded-xl border p-5 ${statusColors?.[status] || statusColors?.neutral}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg bg-white/10`}>
            <Icon size={18} className={statusTextColors?.[status] || 'text-blue-400'} />
          </div>
          <span className="text-sm text-gray-400 font-medium">{title}</span>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{Math.abs(trend)?.toFixed(1)}%</span>
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-3xl font-bold ${statusTextColors?.[status] || 'text-white'}`}>
          {value ?? '—'}
        </span>
        {unit && <span className="text-sm text-gray-500">{unit}</span>}
      </div>
      {description && <p className="text-xs text-gray-500 mt-2">{description}</p>}
    </div>
  );
}

function AlertBanner({ alerts }) {
  if (!alerts?.length) return null;
  return (
    <div className="space-y-2 mb-6">
      {alerts?.map((alert, i) => (
        <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${
          alert?.severity === 'critical' ?'bg-red-500/10 border-red-500/30 text-red-300' :'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
        }`}>
          <AlertTriangle size={16} />
          <span className="text-sm">{alert?.message}</span>
          <span className="ml-auto text-xs opacity-60">{alert?.time}</span>
        </div>
      ))}
    </div>
  );
}

function SlowQueriesTable({ queries }) {
  if (!queries?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-500">
        <CheckCircle size={32} className="text-green-400 mb-2" />
        <p className="text-sm">No slow queries detected</p>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-2 px-3 text-gray-400 font-medium">Query</th>
            <th className="text-right py-2 px-3 text-gray-400 font-medium">Avg Time</th>
            <th className="text-right py-2 px-3 text-gray-400 font-medium">Calls</th>
            <th className="text-right py-2 px-3 text-gray-400 font-medium">Total Time</th>
          </tr>
        </thead>
        <tbody>
          {queries?.slice(0, 10)?.map((q, i) => (
            <tr key={i} className="border-b border-white/5 hover:bg-white/5">
              <td className="py-2 px-3 text-gray-300 max-w-xs">
                <span className="truncate block" title={q?.query}>
                  {(q?.query || '')?.substring(0, 80)}{(q?.query || '')?.length > 80 ? '...' : ''}
                </span>
              </td>
              <td className="py-2 px-3 text-right">
                <span className={`font-mono ${
                  (q?.mean_exec_time || 0) > 5000 ? 'text-red-400' :
                  (q?.mean_exec_time || 0) > 1000 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {((q?.mean_exec_time || 0) / 1000)?.toFixed(2)}s
                </span>
              </td>
              <td className="py-2 px-3 text-right text-gray-400 font-mono">{q?.calls?.toLocaleString()}</td>
              <td className="py-2 px-3 text-right text-gray-400 font-mono">
                {((q?.total_exec_time || 0) / 1000)?.toFixed(1)}s
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function QueryPerformanceMonitoringDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [slowQueries, setSlowQueries] = useState([]);
  const [connectionStats, setConnectionStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const intervalRef = useRef(null);

  const generateAlerts = useCallback((data) => {
    const newAlerts = [];
    const now = new Date()?.toLocaleTimeString();

    if (data?.slowQueryCount >= SLOW_QUERY_ALERT_THRESHOLD) {
      newAlerts?.push({
        severity: 'critical',
        message: `Slow query count (${data?.slowQueryCount}) exceeds threshold of ${SLOW_QUERY_ALERT_THRESHOLD} per hour`,
        time: now,
      });
    }
    if (data?.indexHitRate !== null && data?.indexHitRate < INDEX_HIT_RATE_THRESHOLD) {
      newAlerts?.push({
        severity: 'warning',
        message: `Index hit rate (${data?.indexHitRate?.toFixed(1)}%) is below target of ${INDEX_HIT_RATE_THRESHOLD}%`,
        time: now,
      });
    }
    if (data?.poolUtilization > POOL_UTILIZATION_THRESHOLD) {
      newAlerts?.push({
        severity: data?.poolUtilization > 90 ? 'critical' : 'warning',
        message: `Connection pool utilization (${data?.poolUtilization?.toFixed(1)}%) exceeds ${POOL_UTILIZATION_THRESHOLD}% threshold`,
        time: now,
      });
    }
    return newAlerts;
  }, []);

  const fetchMetrics = useCallback(async () => {
    setRefreshing(true);
    try {
      // Fetch connection stats
      const { data: connData } = await connectionPoolService?.getConnectionStats();

      // Fetch index hit rate via pg_statio_user_tables
      const { data: idxData, error: idxError } = await supabase?.rpc('get_index_hit_rate')?.maybeSingle();

      // Fetch slow queries count from pg_stat_statements
      const { data: slowData } = await supabase?.rpc('get_slow_queries', {
        threshold_ms: 1000,
        limit_count: 50,
      });

      const slowQueryList = slowData || [];
      const indexHitRate = idxData?.index_hit_rate
        ? parseFloat(idxData?.index_hit_rate)
        : null;

      const poolUtilization = connData
        ? parseFloat(connData?.utilizationPercent)
        : 0;

      const metricsData = {
        slowQueryCount: slowQueryList?.length,
        indexHitRate,
        poolUtilization,
        activeConnections: connData?.activeConnections || 0,
        idleConnections: connData?.idleConnections || 0,
        maxConnections: connData?.maxConnections || 20,
        cacheHitRate: connData?.cacheHitRate ? parseFloat(connData?.cacheHitRate) : null,
      };

      setMetrics(metricsData);
      setSlowQueries(slowQueryList);
      setConnectionStats(connData);
      setAlerts(generateAlerts(metricsData));
      setLastRefresh(new Date());

      // Send to Datadog
      if (connData) {
        await connectionPoolService?.sendPoolHealthToDatadog(connData);
      }
    } catch (err) {
      console.error('[QueryPerformanceDashboard] Error fetching metrics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [generateAlerts]);

  useEffect(() => {
    fetchMetrics();
    intervalRef.current = setInterval(fetchMetrics, REFRESH_INTERVAL);
    return () => clearInterval(intervalRef?.current);
  }, [fetchMetrics]);

  const getIndexHitStatus = (rate) => {
    if (rate === null) return 'neutral';
    if (rate >= 95) return 'good';
    if (rate >= 85) return 'warning';
    return 'critical';
  };

  const getPoolStatus = (util) => {
    if (util <= 60) return 'good';
    if (util <= 80) return 'warning';
    return 'critical';
  };

  const getSlowQueryStatus = (count) => {
    if (count === 0) return 'good';
    if (count < SLOW_QUERY_ALERT_THRESHOLD) return 'warning';
    return 'critical';
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Activity size={24} className="text-blue-400" />
              </div>
              Query Performance Monitoring
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              Real-time tracking of slow queries, index hit rates, and connection pool utilization
            </p>
          </div>
          <div className="flex items-center gap-3">
            {lastRefresh && (
              <span className="text-xs text-gray-500">
                Last updated: {lastRefresh?.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={fetchMetrics}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Auto-refresh indicator */}
        <div className="flex items-center gap-2 mb-6 text-xs text-gray-500">
          <Wifi size={12} className="text-green-400" />
          <span>Auto-refreshing every 30 seconds</span>
          <span className="mx-2">•</span>
          <span>Alerts: Slow queries &gt;{SLOW_QUERY_ALERT_THRESHOLD}/hr | Index hit &lt;{INDEX_HIT_RATE_THRESHOLD}% | Pool &gt;{POOL_UTILIZATION_THRESHOLD}%</span>
        </div>

        {/* Alerts */}
        <AlertBanner alerts={alerts} />

        {/* Metric Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)]?.map((_, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-5 animate-pulse">
                <div className="h-4 bg-white/10 rounded mb-3 w-2/3" />
                <div className="h-8 bg-white/10 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard
              title="Slow Queries (>1s)"
              value={metrics?.slowQueryCount ?? '—'}
              unit="queries"
              status={getSlowQueryStatus(metrics?.slowQueryCount || 0)}
              icon={Clock}
              description={`Alert threshold: ${SLOW_QUERY_ALERT_THRESHOLD} per hour`}
            />
            <MetricCard
              title="Index Hit Rate"
              value={metrics?.indexHitRate !== null ? metrics?.indexHitRate?.toFixed(1) : '—'}
              unit="%"
              status={getIndexHitStatus(metrics?.indexHitRate)}
              icon={Zap}
              description={`Target: ≥${INDEX_HIT_RATE_THRESHOLD}% | Formula: idx_blks_hit / (idx_blks_hit + idx_blks_read)`}
            />
            <MetricCard
              title="Pool Utilization"
              value={metrics?.poolUtilization?.toFixed(1) ?? '—'}
              unit="%"
              status={getPoolStatus(metrics?.poolUtilization || 0)}
              icon={Server}
              description={`${metrics?.activeConnections || 0} active / ${metrics?.maxConnections || 20} max connections`}
            />
            <MetricCard
              title="Cache Hit Rate"
              value={metrics?.cacheHitRate !== null ? metrics?.cacheHitRate?.toFixed(1) : '—'}
              unit="%"
              status={metrics?.cacheHitRate >= 95 ? 'good' : metrics?.cacheHitRate >= 80 ? 'warning' : 'neutral'}
              icon={Database}
              description="Buffer cache hit rate from pg_stat_database"
            />
          </div>
        )}

        {/* Connection Pool Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Server size={18} className="text-blue-400" />
              Connection Pool Status
            </h2>
            {connectionStats ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Active Connections</span>
                  <span className="font-mono text-white">{connectionStats?.activeConnections}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Idle Connections</span>
                  <span className="font-mono text-white">{connectionStats?.idleConnections}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Max Connections (PgBouncer)</span>
                  <span className="font-mono text-white">{connectionStats?.maxConnections}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Pool Mode</span>
                  <span className="font-mono text-blue-400">Session</span>
                </div>
                {/* Utilization Bar */}
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Pool Utilization</span>
                    <span>{connectionStats?.utilizationPercent}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        parseFloat(connectionStats?.utilizationPercent) > 80
                          ? 'bg-red-500'
                          : parseFloat(connectionStats?.utilizationPercent) > 60
                          ? 'bg-yellow-500' :'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(100, parseFloat(connectionStats?.utilizationPercent))}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-sm text-center py-6">Loading connection data...</div>
            )}
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart2 size={18} className="text-purple-400" />
              PgBouncer Configuration
            </h2>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Pool Mode', value: 'Session', color: 'text-blue-400' },
                { label: 'Pool Size', value: '20 connections', color: 'text-green-400' },
                { label: 'Default Pool Size', value: '10 connections', color: 'text-green-400' },
                { label: 'Max Client Connections', value: '100', color: 'text-yellow-400' },
                { label: 'Reserve Pool Size', value: '5 connections', color: 'text-gray-400' },
                { label: 'Server Idle Timeout', value: '600s', color: 'text-gray-400' },
                { label: 'Query Wait Timeout', value: '120s', color: 'text-gray-400' },
                { label: 'Retry Attempts', value: '3 (exponential backoff)', color: 'text-orange-400' },
              ]?.map((item, i) => (
                <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-gray-400">{item?.label}</span>
                  <span className={`font-mono ${item?.color}`}>{item?.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slow Queries Table */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock size={18} className="text-orange-400" />
            Slow Queries (from pg_stat_statements)
            {slowQueries?.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                {slowQueries?.length} found
              </span>
            )}
          </h2>
          <SlowQueriesTable queries={slowQueries} />
        </div>
      </div>
    </div>
  );
}
