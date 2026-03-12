import React from 'react';
import { Shield } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

const ThreatScorePanel = ({ threatScore, breakdown, loading }) => {
  const getScoreColor = (score) => {
    if (score >= 75) return '#ef4444';
    if (score >= 50) return '#f97316';
    if (score >= 25) return '#eab308';
    return '#22c55e';
  };

  const getScoreLabel = (score) => {
    if (score >= 75) return { label: 'CRITICAL', color: 'text-red-600' };
    if (score >= 50) return { label: 'HIGH', color: 'text-orange-600' };
    if (score >= 25) return { label: 'MEDIUM', color: 'text-yellow-600' };
    return { label: 'LOW', color: 'text-green-600' };
  };

  const scoreInfo = getScoreLabel(threatScore || 0);
  const chartData = [{ value: threatScore || 0, fill: getScoreColor(threatScore || 0) }];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
          <Shield size={20} className="text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Unified Threat Score</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Aggregated from 4 AI services</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={chartData} startAngle={90} endAngle={-270}>
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar background dataKey="value" cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{threatScore || 0}</span>
                <span className={`text-xs font-bold ${scoreInfo?.color}`}>{scoreInfo?.label}</span>
              </div>
            </div>
          </div>

          {breakdown && (
            <div className="mt-4 space-y-2">
              {Object.entries(breakdown)?.map(([service, score]) => (
                <div key={service} className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">{service?.replace(/([A-Z])/g, ' $1')?.trim()}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${score}%`, backgroundColor: getScoreColor(score) }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-8 text-right">{score}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ThreatScorePanel;
