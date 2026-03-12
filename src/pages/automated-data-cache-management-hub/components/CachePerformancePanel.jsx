import React, { useState, useEffect, useCallback } from 'react';
import { Activity, TrendingUp, Zap, RefreshCw } from 'lucide-react';
import analyticsCacheService from '../../../services/analyticsCacheService';
import { useRealtimeMonitoring } from '../../../hooks/useRealtimeMonitoring';

const CachePerformancePanel = () => {
  const [metrics, setMetrics] = useState({
    hits: 0, misses: 0, staleServed: 0, backgroundRefreshes: 0,
    hitRate: 0, staleRate: 0, memoryCacheSize: 0, pendingFetches: 0
  });
  const [storageInfo, setStorageInfo] = useState({ usedMB: 0, quotaMB: 0, usagePercent: 0 });
  const [pulse, setPulse] = useState(false);

  const refresh = useCallback(async () => {
    const m = analyticsCacheService?.getMetrics();
    const s = await analyticsCacheService?.getStorageInfo();
    setMetrics(m);
    setStorageInfo(s);
    setPulse(p => !p);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useRealtimeMonitoring({
    tables: 'system_alerts',
    onRefresh: refresh,
    enabled: true,
  });

  const statCards = [
    { label: 'Cache Hit Rate', value: `${metrics?.hitRate}%`, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Stale Served', value: `${metrics?.staleRate}%`, icon: Activity, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Memory Entries', value: metrics?.memoryCacheSize, icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'BG Refreshes', value: metrics?.backgroundRefreshes, icon: RefreshCw, color: 'text-purple-400', bg: 'bg-purple-500/10' }
  ];

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-green-400" />
          <h2 className="text-lg font-bold text-white">Cache Performance Monitor</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${pulse ? 'bg-green-400' : 'bg-green-600'} transition-colors`} />
          <span className="text-xs text-gray-400">Live • Realtime</span>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards?.map((card, i) => (
          <div key={i} className={`${card?.bg} rounded-xl p-4 border border-gray-800`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">{card?.label}</span>
              <card.icon className={`w-4 h-4 ${card?.color}`} />
            </div>
            <p className={`text-2xl font-bold ${card?.color}`}>{card?.value}</p>
          </div>
        ))}
      </div>
      {/* Hit/Miss breakdown */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Cache Hit/Miss Ratio</span>
          <span className="text-xs text-gray-500">{metrics?.hits + metrics?.misses + metrics?.staleServed} total requests</span>
        </div>
        <div className="flex h-3 rounded-full overflow-hidden bg-gray-800">
          {metrics?.hits + metrics?.misses + metrics?.staleServed > 0 && (
            <>
              <div className="bg-green-500 transition-all" style={{ width: `${metrics?.hitRate}%` }} title={`Hits: ${metrics?.hits}`} />
              <div className="bg-yellow-500 transition-all" style={{ width: `${metrics?.staleRate}%` }} title={`Stale: ${metrics?.staleServed}`} />
              <div className="bg-red-500 transition-all" style={{ width: `${100 - metrics?.hitRate - metrics?.staleRate}%` }} title={`Misses: ${metrics?.misses}`} />
            </>
          )}
        </div>
        <div className="flex gap-4 mt-2">
          <span className="text-xs text-green-400">● Hits ({metrics?.hits})</span>
          <span className="text-xs text-yellow-400">● Stale ({metrics?.staleServed})</span>
          <span className="text-xs text-red-400">● Misses ({metrics?.misses})</span>
        </div>
      </div>
      {/* Storage utilization */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">IndexedDB Storage</span>
          <span className="text-xs text-gray-500">{storageInfo?.usedMB} MB / {storageInfo?.quotaMB} MB</span>
        </div>
        <div className="bg-gray-800 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              storageInfo?.usagePercent > 80 ? 'bg-red-500' :
              storageInfo?.usagePercent > 60 ? 'bg-yellow-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(100, storageInfo?.usagePercent)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">{storageInfo?.usagePercent}% utilized</p>
      </div>
    </div>
  );
};

export default CachePerformancePanel;
