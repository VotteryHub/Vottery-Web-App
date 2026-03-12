import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

export default function GrowthModelingPanel({ projections, loading }) {
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

  const data = projections || [];

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          Predictive Growth Modeling
        </h2>
        <span className="text-xs text-blue-400 bg-blue-900/30 px-2 py-1 rounded-full">6-Month Forecast</span>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              formatter={(value) => [`$${value?.toLocaleString()}`, '']}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line type="monotone" dataKey="optimistic" stroke="#10b981" strokeWidth={2} dot={false} name="Optimistic" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="projected" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4 }} name="Projected" />
            <Line type="monotone" dataKey="conservative" stroke="#f59e0b" strokeWidth={2} dot={false} name="Conservative" strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="bg-emerald-900/20 border border-emerald-700/50 rounded-lg p-3 text-center">
          <div className="text-xs text-emerald-400 mb-1">Optimistic</div>
          <div className="text-sm font-bold text-emerald-300">${data?.[data?.length - 1]?.optimistic?.toLocaleString() || '0'}</div>
        </div>
        <div className="bg-indigo-900/20 border border-indigo-700/50 rounded-lg p-3 text-center">
          <div className="text-xs text-indigo-400 mb-1">Projected</div>
          <div className="text-sm font-bold text-indigo-300">${data?.[data?.length - 1]?.projected?.toLocaleString() || '0'}</div>
        </div>
        <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-3 text-center">
          <div className="text-xs text-amber-400 mb-1">Conservative</div>
          <div className="text-sm font-bold text-amber-300">${data?.[data?.length - 1]?.conservative?.toLocaleString() || '0'}</div>
        </div>
      </div>
    </div>
  );
}
