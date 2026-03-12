import React from 'react';
import { Activity, Wifi, WifiOff, RefreshCw } from 'lucide-react';

const SubscriptionHealthPanel = ({ subscriptions = [], loading = false }) => {
  const activeCount = subscriptions?.filter(s => s?.status === 'active')?.length;
  const totalCount = subscriptions?.length;
  const healthPercent = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;

  const getStatusColor = (status) => {
    if (status === 'active') return 'text-green-400';
    if (status === 'connecting') return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusBg = (status) => {
    if (status === 'active') return 'bg-green-500/20 border-green-500/30';
    if (status === 'connecting') return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-500/20 rounded-lg">
          <Activity className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">Subscription Health</h3>
          <p className="text-gray-400 text-sm">Real-time Supabase subscription status</p>
        </div>
        {loading && <RefreshCw className="w-4 h-4 text-gray-400 animate-spin ml-auto" />}
      </div>

      <div className="flex items-center justify-between mb-6 p-4 bg-gray-700/50 rounded-xl">
        <div>
          <p className="text-gray-400 text-sm">Active Subscriptions</p>
          <p className="text-white text-3xl font-bold">{activeCount}<span className="text-gray-400 text-lg">/{totalCount}</span></p>
        </div>
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#374151" strokeWidth="3" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={healthPercent >= 80 ? '#10b981' : healthPercent >= 50 ? '#f59e0b' : '#ef4444'} strokeWidth="3" strokeDasharray={`${healthPercent}, 100`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-sm font-bold">{healthPercent}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {subscriptions?.map((sub, i) => (
          <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${getStatusBg(sub?.status)}`}>
            <div className="flex items-center gap-3">
              {sub?.status === 'active' ? <Wifi className="w-4 h-4 text-green-400" /> : <WifiOff className="w-4 h-4 text-red-400" />}
              <div>
                <p className="text-white text-sm font-medium">{sub?.table || sub?.channel || 'Unknown'}</p>
                <p className="text-gray-400 text-xs">{sub?.description || 'Real-time subscription'}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-xs font-medium capitalize ${getStatusColor(sub?.status)}`}>{sub?.status || 'unknown'}</span>
              {sub?.latency && <p className="text-gray-500 text-xs">{sub?.latency}ms</p>}
            </div>
          </div>
        ))}

        {subscriptions?.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <WifiOff className="w-10 h-10 mb-2 opacity-50" />
            <p className="text-sm">No active subscriptions detected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionHealthPanel;
