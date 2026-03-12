import React, { useMemo } from 'react';
import { Target, TrendingUp, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ThreatCorrelationEngine = ({ incidents, scoreHistory }) => {
  const correlationData = useMemo(() => {
    const sourceCounts = {};
    const severityCounts = { critical: 0, high: 0, medium: 0, low: 0 };
    incidents?.forEach(inc => {
      sourceCounts[inc.source] = (sourceCounts?.[inc?.source] || 0) + 1;
      if (inc?.severity) severityCounts[inc.severity] = (severityCounts?.[inc?.severity] || 0) + 1;
    });
    return {
      sources: Object.entries(sourceCounts)?.map(([name, count]) => ({ name: name?.replace('_', ' '), count })),
      severities: Object.entries(severityCounts)?.map(([name, count]) => ({ name, count })),
    };
  }, [incidents]);

  const avgScore = scoreHistory?.length ? Math.round(scoreHistory?.reduce((s, p) => s + p?.score, 0) / scoreHistory?.length) : 0;
  const peakScore = scoreHistory?.length ? Math.max(...scoreHistory?.map(p => p?.score)) : 0;
  const trend = scoreHistory?.length >= 2 ? scoreHistory?.[scoreHistory?.length - 1]?.score - scoreHistory?.[0]?.score : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Threat Correlation Engine</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Cross-domain pattern matching and predictive threat modeling</p>
      </div>
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[{ label: 'Avg Threat Score', value: avgScore, color: 'text-purple-600' },
          { label: 'Peak Score', value: peakScore, color: 'text-red-600' },
          { label: 'Score Trend', value: `${trend >= 0 ? '+' : ''}${trend}`, color: trend > 0 ? 'text-red-600' : 'text-green-600' },
        ]?.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
            <div className={`text-2xl font-bold ${stat?.color}`}>{stat?.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat?.label}</div>
          </div>
        ))}
      </div>
      {/* Source Distribution */}
      {correlationData?.sources?.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <BarChart2 size={14} />Incident Source Distribution
          </h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={correlationData?.sources}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      {/* Severity Distribution */}
      {correlationData?.severities?.some(s => s?.count > 0) && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Target size={14} />Severity Distribution
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {correlationData?.severities?.map(({ name, count }) => (
              <div key={name} className="text-center">
                <div className={`text-xl font-bold ${
                  name === 'critical' ? 'text-red-600' : name === 'high' ? 'text-orange-600' : name === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                }`}>{count}</div>
                <div className="text-xs text-gray-500 capitalize">{name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Predictive Modeling */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} className="text-purple-600" />
          <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-300">Predictive Threat Modeling</h3>
        </div>
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <div className="flex justify-between">
            <span>Projected score (next 30min):</span>
            <span className="font-bold">{Math.min(100, Math.round(avgScore + trend * 0.5))}/100</span>
          </div>
          <div className="flex justify-between">
            <span>Correlation strength:</span>
            <span className="font-bold">{incidents?.length > 10 ? 'High' : incidents?.length > 5 ? 'Medium' : 'Low'}</span>
          </div>
          <div className="flex justify-between">
            <span>Pattern confidence:</span>
            <span className="font-bold">{Math.min(95, 60 + incidents?.length)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatCorrelationEngine;
