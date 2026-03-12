import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const SOURCE_COLORS = { fraud_alerts: '#EF4444', system_failures: '#F97316', revenue_anomalies: '#EAB308' };

const CascadingIncidentTimeline = ({ incidents, scoreHistory }) => {
  // Group incidents by 5-minute buckets for timeline
  const timelineBuckets = {};
  incidents?.forEach(inc => {
    const bucket = new Date(inc.created_at);
    bucket?.setMinutes(Math.floor(bucket?.getMinutes() / 5) * 5, 0, 0);
    const key = bucket?.toLocaleTimeString();
    if (!timelineBuckets?.[key]) timelineBuckets[key] = { time: key, fraud_alerts: 0, system_failures: 0, revenue_anomalies: 0 };
    timelineBuckets[key][inc.source] = (timelineBuckets?.[key]?.[inc?.source] || 0) + 1;
  });
  const timelineData = Object.values(timelineBuckets)?.slice(-20);

  const criticalIncidents = incidents?.filter(i => i?.severity === 'critical' || i?.severity === 'high')?.slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Cascading Incident Timeline</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Temporal correlation between fraud alerts, system failures, and revenue anomalies</p>
      </div>
      {/* Threat Score History */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Unified Threat Score History</h3>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={scoreHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend />
            <ReferenceLine y={80} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Critical', fill: '#EF4444', fontSize: 10 }} />
            <ReferenceLine y={60} stroke="#F97316" strokeDasharray="4 4" label={{ value: 'High', fill: '#F97316', fontSize: 10 }} />
            <Line type="monotone" dataKey="score" stroke="#8B5CF6" strokeWidth={2} dot={false} name="Threat Score" />
            <Line type="monotone" dataKey="fraud" stroke="#EF4444" strokeWidth={1.5} dot={false} name="Fraud" />
            <Line type="monotone" dataKey="system" stroke="#F97316" strokeWidth={1.5} dot={false} name="System" />
            <Line type="monotone" dataKey="revenue" stroke="#EAB308" strokeWidth={1.5} dot={false} name="Revenue" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Incident Distribution */}
      {timelineData?.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Incident Distribution (5-min buckets)</h3>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              {Object.entries(SOURCE_COLORS)?.map(([key, color]) => (
                <Line key={key} type="monotone" dataKey={key} stroke={color} strokeWidth={2} dot={false} name={key?.replace('_', ' ')} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {/* Critical Incidents Drill-Down */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <AlertTriangle size={14} className="text-red-500" />Critical & High Severity Incidents
        </h3>
        <div className="space-y-2">
          {criticalIncidents?.length === 0 ? (
            <div className="text-center py-6 text-gray-400 text-sm">No critical incidents in the last hour</div>
          ) : criticalIncidents?.map((inc, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${inc?.severity === 'critical' ? 'bg-red-500' : 'bg-orange-500'}`} />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{inc?.type}</div>
                <div className="text-xs text-gray-500">{inc?.source?.replace('_', ' ')}</div>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${inc?.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>{inc?.severity}</span>
                <div className="text-xs text-gray-400 mt-1">{new Date(inc.created_at)?.toLocaleTimeString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CascadingIncidentTimeline;
