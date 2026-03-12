import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Zap, Shield, RefreshCw, CheckCircle, XCircle, Clock, Database, Settings, Play, Square, RotateCcw } from 'lucide-react';
import { supabase } from '../../lib/supabase';

// Subscription Pool Manager - shared singleton
const subscriptionPool = {
  instances: new Map(),
  metrics: { created: 0, reused: 0, cleaned: 0, errors: 0 },

  getOrCreate(key, factory) {
    if (this.instances?.has(key)) {
      this.metrics.reused++;
      return this.instances?.get(key);
    }
    const instance = factory();
    this.instances?.set(key, instance);
    this.metrics.created++;
    return instance;
  },

  cleanup(key) {
    if (this.instances?.has(key)) {
      const sub = this.instances?.get(key);
      try { sub?.unsubscribe?.(); } catch (e) {}
      this.instances?.delete(key);
      this.metrics.cleaned++;
    }
  },

  cleanupAll() {
    this.instances?.forEach((sub, key) => this.cleanup(key));
  },

  getStats() {
    return {
      active: this.instances?.size,
      ...this.metrics,
      poolKeys: Array.from(this.instances?.keys())
    };
  }
};

const POOL_CONFIGS = [
  {
    id: 'creator-growth',
    name: 'Creator Growth Analytics',
    table: 'creator_activity_logs',
    route: '/creator-growth-analytics-dashboard',
    color: 'blue',
    icon: '📈',
    event: 'UPDATE'
  },
  {
    id: 'churn-prediction',
    name: 'Churn Prediction Intelligence',
    table: 'creator_churn_predictions',
    route: '/creator-churn-prediction-intelligence-center',
    color: 'orange',
    icon: '🔮',
    event: 'INSERT'
  },
  {
    id: 'revenue-intelligence',
    name: 'Revenue Intelligence',
    table: 'revenue_streams',
    route: '/unified-revenue-intelligence-dashboard',
    color: 'green',
    icon: '💰',
    event: 'UPDATE'
  }
];

const BACKOFF_CONFIG = { base: 1000, max: 30000, multiplier: 2 };

const getBackoffDelay = (attempt) =>
  Math.min(BACKOFF_CONFIG?.base * Math.pow(BACKOFF_CONFIG?.multiplier, attempt), BACKOFF_CONFIG?.max);

const StatusBadge = ({ status }) => {
  const map = {
    connected: { color: 'text-green-400 bg-green-900/30 border-green-700', icon: <CheckCircle size={12} />, label: 'Connected' },
    connecting: { color: 'text-yellow-400 bg-yellow-900/30 border-yellow-700', icon: <Clock size={12} />, label: 'Connecting' },
    error: { color: 'text-red-400 bg-red-900/30 border-red-700', icon: <XCircle size={12} />, label: 'Error' },
    idle: { color: 'text-gray-400 bg-gray-800 border-gray-700', icon: <Activity size={12} />, label: 'Idle' }
  };
  const s = map?.[status] || map?.idle;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${s?.color}`}>
      {s?.icon}{s?.label}
    </span>
  );
};

const MetricCard = ({ label, value, sub, color = 'blue', icon }) => (
  <div className={`bg-gray-900 border border-gray-800 rounded-xl p-4`}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-gray-400 text-xs">{label}</span>
      <span className="text-lg">{icon}</span>
    </div>
    <p className={`text-2xl font-bold text-${color}-400`}>{value}</p>
    {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
  </div>
);

const PoolCard = ({ config, status, events, retryCount, onManualCleanup, onReconnect }) => {
  const colorMap = { blue: 'border-blue-800 bg-blue-900/10', orange: 'border-orange-800 bg-orange-900/10', green: 'border-green-800 bg-green-900/10' };
  return (
    <div className={`rounded-xl border p-5 ${colorMap?.[config?.color]}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{config?.icon}</span>
          <div>
            <p className="text-white font-semibold text-sm">{config?.name}</p>
            <p className="text-gray-500 text-xs font-mono">{config?.table}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-gray-900/60 rounded-lg p-2 text-center">
          <p className="text-white font-bold text-lg">{events}</p>
          <p className="text-gray-500 text-xs">Events</p>
        </div>
        <div className="bg-gray-900/60 rounded-lg p-2 text-center">
          <p className="text-yellow-400 font-bold text-lg">{retryCount}</p>
          <p className="text-gray-500 text-xs">Retries</p>
        </div>
        <div className="bg-gray-900/60 rounded-lg p-2 text-center">
          <p className="text-blue-400 font-bold text-lg">{getBackoffDelay(retryCount) / 1000}s</p>
          <p className="text-gray-500 text-xs">Backoff</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onReconnect(config?.id)}
          className="flex-1 flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 rounded-lg transition-colors"
        >
          <RefreshCw size={12} /> Reconnect
        </button>
        <button
          onClick={() => onManualCleanup(config?.id)}
          className="flex-1 flex items-center justify-center gap-1 bg-red-900/40 hover:bg-red-900/60 text-red-400 text-xs py-1.5 rounded-lg border border-red-800 transition-colors"
        >
          <Square size={12} /> Cleanup
        </button>
      </div>
    </div>
  );
};

const ReconnectionLogPanel = ({ log }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
    <h3 className="text-white font-bold mb-4 flex items-center gap-2"><RotateCcw size={16} className="text-blue-400" /> Reconnection Log</h3>
    <div className="space-y-2 max-h-48 overflow-y-auto">
      {log?.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">No reconnection events yet</p>
      ) : (
        log?.slice(-10)?.reverse()?.map((entry, i) => (
          <div key={i} className="flex items-center gap-3 bg-gray-800/50 rounded-lg px-3 py-2">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${entry?.success ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-gray-400 text-xs font-mono flex-shrink-0">{entry?.time}</span>
            <span className="text-gray-300 text-xs">{entry?.message}</span>
            <span className="ml-auto text-gray-500 text-xs">attempt #{entry?.attempt}</span>
          </div>
        ))
      )}
    </div>
  </div>
);

const MemoryLeakPanel = ({ stats }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
    <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Shield size={16} className="text-green-400" /> Memory Leak Prevention</h3>
    <div className="space-y-3">
      <div className="flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-3">
        <span className="text-gray-400 text-sm">Active Subscriptions</span>
        <span className={`font-bold text-lg ${stats?.active > 5 ? 'text-red-400' : 'text-green-400'}`}>{stats?.active}</span>
      </div>
      <div className="flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-3">
        <span className="text-gray-400 text-sm">Total Created</span>
        <span className="text-blue-400 font-bold text-lg">{stats?.created}</span>
      </div>
      <div className="flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-3">
        <span className="text-gray-400 text-sm">Reused (Pooled)</span>
        <span className="text-purple-400 font-bold text-lg">{stats?.reused}</span>
      </div>
      <div className="flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-3">
        <span className="text-gray-400 text-sm">Cleaned Up</span>
        <span className="text-orange-400 font-bold text-lg">{stats?.cleaned}</span>
      </div>
      <div className="flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-3">
        <span className="text-gray-400 text-sm">Pool Efficiency</span>
        <span className="text-green-400 font-bold text-lg">
          {stats?.created > 0 ? Math.round((stats?.reused / (stats?.created + stats?.reused)) * 100) : 0}%
        </span>
      </div>
    </div>
  </div>
);

const RealTimeSubscriptionOptimizationCenter = () => {
  const navigate = useNavigate();
  const activeSubsRef = useRef(new Map());
  const retryTimersRef = useRef(new Map());
  const [poolStats, setPoolStats] = useState({ active: 0, created: 0, reused: 0, cleaned: 0, errors: 0, poolKeys: [] });
  const [connectionStatuses, setConnectionStatuses] = useState({});
  const [eventCounts, setEventCounts] = useState({});
  const [retryCounts, setRetryCounts] = useState({});
  const [reconnectionLog, setReconnectionLog] = useState([]);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isPooling, setIsPooling] = useState(false);

  const logReconnection = useCallback((id, attempt, success, message) => {
    setReconnectionLog(prev => [...prev, {
      time: new Date()?.toLocaleTimeString(),
      id,
      attempt,
      success,
      message
    }]);
  }, []);

  const connectSubscription = useCallback((config, attempt = 0) => {
    setConnectionStatuses(prev => ({ ...prev, [config?.id]: 'connecting' }));

    try {
      const channel = supabase?.channel(`pool-${config?.id}-${Date.now()}`)?.on('postgres_changes', { event: config?.event, schema: 'public', table: config?.table }, (payload) => {
          setEventCounts(prev => ({ ...prev, [config?.id]: (prev?.[config?.id] || 0) + 1 }));
        })?.subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setConnectionStatuses(prev => ({ ...prev, [config?.id]: 'connected' }));
            setRetryCounts(prev => ({ ...prev, [config?.id]: 0 }));
            logReconnection(config?.id, attempt, true, `${config?.name} connected successfully`);
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            setConnectionStatuses(prev => ({ ...prev, [config?.id]: 'error' }));
            subscriptionPool.metrics.errors++;
            const delay = getBackoffDelay(attempt);
            logReconnection(config?.id, attempt, false, `${config?.name} failed, retrying in ${delay/1000}s`);
            const timer = setTimeout(() => {
              setRetryCounts(prev => ({ ...prev, [config?.id]: attempt + 1 }));
              connectSubscription(config, attempt + 1);
            }, delay);
            retryTimersRef?.current?.set(config?.id, timer);
          }
        });

      activeSubsRef?.current?.set(config?.id, channel);
      subscriptionPool?.instances?.set(config?.id, channel);
      subscriptionPool.metrics.created++;
      setPoolStats(subscriptionPool?.getStats());
    } catch (err) {
      setConnectionStatuses(prev => ({ ...prev, [config?.id]: 'error' }));
    }
  }, [logReconnection]);

  const startPooling = useCallback(() => {
    setIsPooling(true);
    POOL_CONFIGS?.forEach(config => {
      if (!activeSubsRef?.current?.has(config?.id)) {
        connectSubscription(config);
      } else {
        subscriptionPool.metrics.reused++;
        setConnectionStatuses(prev => ({ ...prev, [config?.id]: 'connected' }));
      }
    });
    setPoolStats(subscriptionPool?.getStats());
  }, [connectSubscription]);

  const handleManualCleanup = useCallback((id) => {
    const sub = activeSubsRef?.current?.get(id);
    if (sub) {
      supabase?.removeChannel(sub);
      activeSubsRef?.current?.delete(id);
    }
    subscriptionPool?.cleanup(id);
    const timer = retryTimersRef?.current?.get(id);
    if (timer) { clearTimeout(timer); retryTimersRef?.current?.delete(id); }
    setConnectionStatuses(prev => ({ ...prev, [id]: 'idle' }));
    setPoolStats(subscriptionPool?.getStats());
    logReconnection(id, 0, true, `Manual cleanup for ${id}`);
  }, [logReconnection]);

  const handleReconnect = useCallback((id) => {
    handleManualCleanup(id);
    const config = POOL_CONFIGS?.find(c => c?.id === id);
    if (config) setTimeout(() => connectSubscription(config), 500);
  }, [handleManualCleanup, connectSubscription]);

  const handleCleanupAll = useCallback(() => {
    POOL_CONFIGS?.forEach(c => handleManualCleanup(c?.id));
    setIsPooling(false);
  }, [handleManualCleanup]);

  // Auto-refresh stats every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPoolStats(subscriptionPool?.getStats());
      setLastRefresh(new Date());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      activeSubsRef?.current?.forEach((sub) => {
        try { supabase?.removeChannel(sub); } catch (e) {}
      });
      retryTimersRef?.current?.forEach(timer => clearTimeout(timer));
    };
  }, []);

  const totalEvents = Object.values(eventCounts)?.reduce((a, b) => a + b, 0);
  const connectedCount = Object.values(connectionStatuses)?.filter(s => s === 'connected')?.length;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-3">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white text-sm">← Back</button>
            <span className="text-gray-600">|</span>
            <span className="text-gray-300 text-sm">Real-Time Subscription Optimization</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <Clock size={12} />
            <span>Last refresh: {lastRefresh?.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Zap className="text-yellow-400" size={32} />
              Real-Time Subscription Optimization Center
            </h1>
            <p className="text-gray-400 mt-1">Supabase subscription pooling with shared instances, automatic cleanup, and exponential backoff reconnection</p>
          </div>
          <div className="flex gap-3">
            {!isPooling ? (
              <button
                onClick={startPooling}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Play size={14} /> Start Pooling
              </button>
            ) : (
              <button
                onClick={handleCleanupAll}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Square size={14} /> Stop All
              </button>
            )}
            <button
              onClick={() => { setPoolStats(subscriptionPool?.getStats()); setLastRefresh(new Date()); }}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MetricCard label="Active Pools" value={poolStats?.active} sub="shared instances" color="blue" icon="🔗" />
          <MetricCard label="Connected" value={connectedCount} sub={`of ${POOL_CONFIGS?.length} dashboards`} color="green" icon="✅" />
          <MetricCard label="Total Events" value={totalEvents} sub="received across pools" color="purple" icon="⚡" />
          <MetricCard label="Pool Efficiency" value={`${poolStats?.created > 0 ? Math.round((poolStats?.reused / (poolStats?.created + poolStats?.reused + 1)) * 100) : 0}%`} sub="connection reuse rate" color="yellow" icon="♻️" />
        </div>

        {/* Pool Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Database size={20} className="text-blue-400" /> Subscription Pool Engine
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {POOL_CONFIGS?.map(config => (
              <PoolCard
                key={config?.id}
                config={config}
                status={connectionStatuses?.[config?.id] || 'idle'}
                events={eventCounts?.[config?.id] || 0}
                retryCount={retryCounts?.[config?.id] || 0}
                onManualCleanup={handleManualCleanup}
                onReconnect={handleReconnect}
              />
            ))}
          </div>
        </div>

        {/* Bottom panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <MemoryLeakPanel stats={poolStats} />
          <ReconnectionLogPanel log={reconnectionLog} />
        </div>

        {/* Connection Health */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Activity size={16} className="text-purple-400" /> Connection Health Scoring
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {POOL_CONFIGS?.map(config => {
              const status = connectionStatuses?.[config?.id] || 'idle';
              const retries = retryCounts?.[config?.id] || 0;
              const score = status === 'connected' ? Math.max(100 - retries * 10, 60) : status === 'connecting' ? 50 : status === 'error' ? 20 : 0;
              return (
                <div key={config?.id} className="bg-gray-800/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">{config?.name}</span>
                    <span className={`font-bold text-lg ${score >= 80 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{score}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-500 text-xs">Health Score</span>
                    <StatusBadge status={status} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* useRef / useEffect Pattern Info */}
        <div className="mt-6 bg-blue-900/20 border border-blue-800 rounded-xl p-5">
          <h3 className="text-blue-300 font-bold mb-3 flex items-center gap-2">
            <Settings size={16} /> React useRef + useEffect Cleanup Pattern
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-900/60 rounded-lg p-3">
              <p className="text-blue-400 font-semibold mb-1">useRef Tracking</p>
              <p className="text-gray-400">Active subscriptions stored in <code className="text-yellow-300">activeSubsRef.current</code> Map — persists across renders without triggering re-renders</p>
            </div>
            <div className="bg-gray-900/60 rounded-lg p-3">
              <p className="text-green-400 font-semibold mb-1">useEffect Cleanup</p>
              <p className="text-gray-400">Return function in useEffect calls <code className="text-yellow-300">supabase.removeChannel()</code> on all active subscriptions when component unmounts</p>
            </div>
            <div className="bg-gray-900/60 rounded-lg p-3">
              <p className="text-purple-400 font-semibold mb-1">Exponential Backoff</p>
              <p className="text-gray-400">Failed connections retry with delays: 1s → 2s → 4s → 8s → 16s → 30s max, preventing server overload</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeSubscriptionOptimizationCenter;
