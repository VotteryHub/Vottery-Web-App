import React from 'react';
import { DollarSign, ArrowUpRight } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function RevenueStreamsPanel({ streams, totalRevenue, loading }) {
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

  const data = streams || [];

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          Consolidated Revenue Streams
        </h2>
        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-400">${totalRevenue?.toLocaleString()}</div>
          <div className="text-xs text-slate-400">Total Revenue</div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              dataKey="revenue"
              nameKey="name"
            >
              {data?.map((entry, index) => (
                <Cell key={index} fill={entry?.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              formatter={(value) => [`$${value?.toLocaleString()}`, 'Revenue']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Stream List */}
      <div className="space-y-2">
        {data?.map((stream, idx) => (
          <div key={idx} className="flex items-center justify-between bg-slate-700/30 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <span className="text-xl">{stream?.icon}</span>
              <div>
                <div className="text-sm font-medium text-white">{stream?.name}</div>
                <div className="text-xs text-slate-500">{stream?.transactions} transactions</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold" style={{ color: stream?.color }}>${stream?.revenue?.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-xs text-emerald-400">
                <ArrowUpRight className="w-3 h-3" />
                {stream?.growth}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
