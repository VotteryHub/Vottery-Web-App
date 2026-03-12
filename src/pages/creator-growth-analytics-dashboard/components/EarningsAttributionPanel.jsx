import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DollarSign, TrendingUp, Eye, MousePointer } from 'lucide-react';

const TYPE_COLORS = {
  'Horizontal Snap': '#6366f1',
  'Vertical Stack': '#10b981',
  'Gradient Flow': '#f59e0b'
};

export default function EarningsAttributionPanel({ attribution, loading }) {
  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-700 rounded w-1/2" />
          <div className="h-48 bg-slate-700 rounded" />
        </div>
      </div>
    );
  }

  const data = attribution || [];
  const totalRevenue = data?.reduce((sum, d) => sum + (d?.revenue || 0), 0);

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          Earnings Attribution by Carousel Type
        </h2>
        <span className="text-sm text-slate-400">Total: <span className="text-emerald-400 font-bold">${totalRevenue?.toFixed(2)}</span></span>
      </div>
      {/* Bar Chart */}
      <div className="h-48 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="type" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              labelStyle={{ color: '#f1f5f9' }}
              formatter={(value) => [`$${value?.toFixed(2)}`, 'Revenue']}
            />
            <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
              {data?.map((entry, index) => (
                <Cell key={index} fill={TYPE_COLORS?.[entry?.type] || '#6366f1'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Detailed Metrics */}
      <div className="space-y-3">
        {data?.map((item, idx) => (
          <div key={idx} className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: TYPE_COLORS?.[item?.type] }} />
                <span className="text-sm font-medium text-white">{item?.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-emerald-400">${item?.revenue?.toFixed(2)}</span>
                <span className="text-xs text-emerald-300 bg-emerald-900/30 px-2 py-0.5 rounded">{item?.trend}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{item?.impressions?.toLocaleString()} impr.</span>
              </div>
              <div className="flex items-center gap-1">
                <MousePointer className="w-3 h-3" />
                <span>{item?.clicks?.toLocaleString()} clicks</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>{item?.avgEngagementRate}% eng.</span>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">Revenue share</span>
                <span className="text-slate-400">{totalRevenue > 0 ? ((item?.revenue / totalRevenue) * 100)?.toFixed(1) : 0}%</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full"
                  style={{
                    width: `${totalRevenue > 0 ? (item?.revenue / totalRevenue) * 100 : 0}%`,
                    backgroundColor: TYPE_COLORS?.[item?.type]
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
