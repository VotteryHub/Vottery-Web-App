import React, { useState, useEffect } from 'react';
import { RefreshCw, Database, Zap, Clock, CheckCircle } from 'lucide-react';
import subscriptionPoolingService from '../../../services/subscriptionPoolingService';

const BackgroundRefreshPanel = () => {
  const [poolStats, setPoolStats] = useState({ totalChannels: 0, maxAllowed: 20, channels: [] });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const update = () => setPoolStats(subscriptionPoolingService?.getStats());
    update();
    const interval = setInterval(update, 5000);
    return () => clearInterval(interval);
  }, []);

  const strategies = [
    {
      title: 'Stale-While-Revalidate',
      description: 'Serve cached data immediately, fetch fresh in background',
      status: 'active',
      icon: RefreshCw,
      color: 'text-green-400'
    },
    {
      title: 'IndexedDB Persistence',
      description: 'L2 cache survives page refreshes and browser restarts',
      status: 'active',
      icon: Database,
      color: 'text-blue-400'
    },
    {
      title: 'Cache Warming',
      description: 'Prefetch critical analytics data on app load',
      status: 'active',
      icon: Zap,
      color: 'text-yellow-400'
    },
    {
      title: 'TTL-Based Expiry',
      description: 'Automatic expiry per data type (1-10 min)',
      status: 'active',
      icon: Clock,
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <div className="flex items-center gap-3 mb-5">
        <RefreshCw className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-bold text-white">Background Refresh & Strategies</h2>
      </div>
      {/* Strategy cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {strategies?.map((s, i) => (
          <div key={i} className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <s.icon className={`w-4 h-4 ${s?.color}`} />
                <span className="text-white text-sm font-medium">{s?.title}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="text-xs text-green-400">Active</span>
              </div>
            </div>
            <p className="text-gray-400 text-xs">{s?.description}</p>
          </div>
        ))}
      </div>
      {/* Subscription pool stats */}
      <div className="bg-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-white">Subscription Pool Status</p>
          <span className="text-xs text-gray-400">{poolStats?.totalChannels}/{poolStats?.maxAllowed} channels</span>
        </div>
        <div className="bg-gray-700 rounded-full h-2 mb-3">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
            style={{ width: `${(poolStats?.totalChannels / poolStats?.maxAllowed) * 100}%` }}
          />
        </div>
        {poolStats?.channels?.length > 0 ? (
          <div className="space-y-2">
            {poolStats?.channels?.map((ch, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span className="text-gray-300">{ch?.key}</span>
                </div>
                <span className="text-gray-500">{ch?.subscribers} sub(s) • {ch?.age}s old</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-xs">No active subscriptions</p>
        )}
      </div>
    </div>
  );
};

export default BackgroundRefreshPanel;
