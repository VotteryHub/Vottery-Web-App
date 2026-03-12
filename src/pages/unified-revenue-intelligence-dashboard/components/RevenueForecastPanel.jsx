import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Brain } from 'lucide-react';

export default function RevenueForecastPanel({ forecast, loading }) {
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

  const projections = forecast?.monthlyProjections || [];

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-violet-400" />
          30-90 Day Revenue Forecast
        </h2>
        <span className="text-xs text-violet-400 bg-violet-900/30 px-2 py-1 rounded-full">Claude AI Powered</span>
      </div>
      {/* Forecast Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-3 text-center">
          <div className="text-xs text-blue-400 mb-1">30-Day Forecast</div>
          <div className="text-lg font-bold text-blue-300">${forecast?.thirtyDayForecast?.total?.toLocaleString() || '0'}</div>
          <div className="text-xs text-slate-500">{forecast?.thirtyDayForecast?.confidence || 0}% confidence</div>
        </div>
        <div className="bg-indigo-900/20 border border-indigo-700/50 rounded-lg p-3 text-center">
          <div className="text-xs text-indigo-400 mb-1">60-Day Forecast</div>
          <div className="text-lg font-bold text-indigo-300">${forecast?.sixtyDayForecast?.total?.toLocaleString() || '0'}</div>
          <div className="text-xs text-slate-500">{forecast?.sixtyDayForecast?.confidence || 0}% confidence</div>
        </div>
        <div className="bg-violet-900/20 border border-violet-700/50 rounded-lg p-3 text-center">
          <div className="text-xs text-violet-400 mb-1">90-Day Forecast</div>
          <div className="text-lg font-bold text-violet-300">${forecast?.ninetyDayForecast?.total?.toLocaleString() || '0'}</div>
          <div className="text-xs text-slate-500">{forecast?.ninetyDayForecast?.confidence || 0}% confidence</div>
        </div>
      </div>
      {/* Projection Chart */}
      <div className="h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={projections} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000)?.toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              formatter={(value) => [`$${value?.toLocaleString()}`, '']}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line type="monotone" dataKey="optimistic" stroke="#10b981" strokeWidth={2} dot={false} name="Optimistic" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4 }} name="Projected" />
            <Line type="monotone" dataKey="conservative" stroke="#f59e0b" strokeWidth={2} dot={false} name="Conservative" strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Key Insights */}
      {forecast?.keyInsights?.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-slate-400 mb-2">AI Key Insights</h3>
          <div className="space-y-2">
            {forecast?.keyInsights?.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                <TrendingUp className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
