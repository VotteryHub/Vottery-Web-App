import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, TrendingDown, TrendingUp } from 'lucide-react';

export default function EngagementScoringPanel({ engagementData, loading }) {
  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-700 rounded w-1/2" />
          <div className="h-40 bg-slate-700 rounded" />
        </div>
      </div>
    );
  }

  const data = engagementData || {};
  const isDecline = parseFloat(data?.engagementDeclineRate || 0) > 10;

  // Generate trend data from carousel metrics
  const trendData = data?.carouselMetrics?.map((m, idx) => ({
    day: `Day ${idx + 1}`,
    engagement: parseFloat(m?.engagementRate || 0),
    revenue: parseFloat(m?.revenue || 0)
  })) || Array.from({ length: 7 }, (_, i) => ({
    day: `Day ${i + 1}`,
    engagement: Math.random() * 10 + 5,
    revenue: Math.random() * 100 + 50
  }));

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          Engagement Scoring Analysis
        </h2>
        <div className={`flex items-center gap-1 text-sm ${isDecline ? 'text-red-400' : 'text-emerald-400'}`}>
          {isDecline ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
          {isDecline ? `-${data?.engagementDeclineRate}%` : `+${Math.abs(data?.engagementDeclineRate || 0)}%`}
        </div>
      </div>

      {/* Engagement Trend Chart */}
      <div className="h-40 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="engGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              formatter={(value) => [`${value?.toFixed(2)}%`, 'Engagement']}
            />
            <Area type="monotone" dataKey="engagement" stroke="#06b6d4" fill="url(#engGradient)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Recent Activity (14d)</div>
          <div className="text-xl font-bold text-white">{data?.recentActivityCount || 0}</div>
          <div className="text-xs text-slate-500">actions logged</div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Previous Activity (14-30d)</div>
          <div className="text-xl font-bold text-white">{data?.previousActivityCount || 0}</div>
          <div className="text-xs text-slate-500">actions logged</div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Recent Engagement</div>
          <div className="text-xl font-bold text-cyan-400">{data?.avgRecentEngagement || 0}%</div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Previous Engagement</div>
          <div className="text-xl font-bold text-slate-300">{data?.avgPreviousEngagement || 0}%</div>
        </div>
      </div>
    </div>
  );
}
