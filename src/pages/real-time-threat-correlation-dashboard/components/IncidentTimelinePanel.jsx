import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Clock } from 'lucide-react';

const IncidentTimelinePanel = ({ timelineData, loading }) => {
  const formatTime = (ts) => {
    if (!ts) return '';
    return new Date(ts)?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <Clock size={20} className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Cascading Incident Timeline</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Temporal correlation between fraud alerts, system failures, and revenue anomalies</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={timelineData || []} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="fraudGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="systemGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="time" tickFormatter={formatTime} tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip
              labelFormatter={(v) => `Time: ${formatTime(v)}`}
              contentStyle={{ fontSize: 11, borderRadius: 8 }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="fraudAlerts" name="Fraud Alerts" stroke="#ef4444" fill="url(#fraudGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="systemFailures" name="System Failures" stroke="#f97316" fill="url(#systemGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="revenueAnomalies" name="Revenue Anomalies" stroke="#8b5cf6" fill="url(#revenueGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default IncidentTimelinePanel;
