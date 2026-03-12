import React from 'react';
import { Activity, RefreshCw } from 'lucide-react';

export default function RealTimeTotalsPanel({ realtimeData, loading, onRefresh }) {
  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <div className="animate-pulse flex gap-4">
          <div className="h-16 bg-slate-700 rounded flex-1" />
          <div className="h-16 bg-slate-700 rounded flex-1" />
          <div className="h-16 bg-slate-700 rounded flex-1" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          Real-Time Revenue
        </h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-xs text-slate-400">Live</span>
          <button onClick={onRefresh} className="text-slate-400 hover:text-white">
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-400">${realtimeData?.todayRevenue?.toLocaleString() || '0'}</div>
          <div className="text-xs text-slate-400">Today's Revenue</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{realtimeData?.transactionsToday || 0}</div>
          <div className="text-xs text-slate-400">Transactions Today</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-400 mb-1">Last Updated</div>
          <div className="text-xs text-slate-300">{realtimeData?.lastUpdated ? new Date(realtimeData?.lastUpdated)?.toLocaleTimeString() : 'N/A'}</div>
        </div>
      </div>
    </div>
  );
}
