import React from 'react';
import { Users, Award, CheckCircle, TrendingUp, BarChart2 } from 'lucide-react';








const MetricCard = ({ icon: IconComponent, label, value, color, subValue }) => (
  <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
    <div className="flex items-center gap-3 mb-2">
      <div className={`p-2 rounded-lg ${color}`}>
        <IconComponent className="w-4 h-4" />
      </div>
      <p className="text-gray-400 text-sm">{label}</p>
    </div>
    <p className="text-white text-2xl font-bold">{value}</p>
    {subValue && <p className="text-gray-500 text-xs mt-1">{subValue}</p>}
  </div>
);

const OverallMetricsPanel = ({ metrics = null, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1,2,3,4]?.map(i => <div key={i} className="h-24 bg-gray-700 rounded"></div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-500/20 rounded-lg">
          <BarChart2 className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">Overall MCQ Performance</h3>
          <p className="text-gray-400 text-sm">Comprehensive statistics across all elections</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <MetricCard icon={Users} label="Total Attempts" value={metrics?.totalAttempts?.toLocaleString() || '0'} color="bg-blue-500/20 text-blue-400" subValue="All elections" />
        <MetricCard icon={TrendingUp} label="Average Score" value={`${Math.round(metrics?.avgScore || 0)}%`} color="bg-green-500/20 text-green-400" subValue="Across all voters" />
        <MetricCard icon={CheckCircle} label="Pass Rate" value={`${Math.round(metrics?.passRate || 0)}%`} color="bg-emerald-500/20 text-emerald-400" subValue={`${metrics?.totalPassed || 0} passed`} />
        <MetricCard icon={Award} label="Top Accuracy" value={`${Math.round(metrics?.topAccuracy || 0)}%`} color="bg-yellow-500/20 text-yellow-400" subValue="Best question" />
      </div>

      {metrics?.questionRankings?.length > 0 && (
        <div>
          <p className="text-gray-400 text-sm font-medium mb-3">Question Performance Ranking</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {metrics?.questionRankings?.map((q, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 bg-gray-700/50 rounded-lg">
                <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  i === 0 ? 'bg-yellow-500 text-black' : i === 1 ? 'bg-gray-400 text-black' : i === 2 ? 'bg-amber-600 text-white' : 'bg-gray-600 text-gray-300'
                }`}>{i + 1}</span>
                <p className="text-white text-sm flex-1 truncate">{q?.questionText || `Question ${i + 1}`}</p>
                <div className="flex items-center gap-1">
                  <div className="w-16 bg-gray-600 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-indigo-400" style={{ width: `${q?.accuracy || 0}%` }}></div>
                  </div>
                  <span className="text-white text-xs font-bold w-10 text-right">{Math.round(q?.accuracy || 0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OverallMetricsPanel;
