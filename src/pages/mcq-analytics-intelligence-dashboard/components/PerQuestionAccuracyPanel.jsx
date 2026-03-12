import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Target, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

const PerQuestionAccuracyPanel = ({ questions = [], loading = false }) => {
  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 70) return '#10b981';
    if (accuracy >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getAccuracyLabel = (accuracy) => {
    if (accuracy >= 70) return 'Good';
    if (accuracy >= 40) return 'Average';
    return 'Low';
  };

  const chartData = questions?.map((q, i) => ({
    name: `Q${i + 1}`,
    accuracy: Math.round(q?.accuracy || 0),
    fullText: q?.questionText || `Question ${i + 1}`
  }));

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          <div className="h-48 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Target className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">Per-Question Accuracy</h3>
          <p className="text-gray-400 text-sm">Correct answer percentage per question</p>
        </div>
      </div>

      {questions?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <AlertCircle className="w-12 h-12 mb-3 opacity-50" />
          <p>No question data available</p>
        </div>
      ) : (
        <>
          <div className="h-48 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#f9fafb' }}
                  formatter={(value, name, props) => [`${value}%`, props?.payload?.fullText?.slice(0, 40) + '...']}
                />
                <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
                  {chartData?.map((entry, index) => (
                    <Cell key={index} fill={getAccuracyColor(entry?.accuracy)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {questions?.map((q, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div className="flex-1 min-w-0 mr-4">
                  <p className="text-white text-sm font-medium truncate">{q?.questionText || `Question ${i + 1}`}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{q?.totalResponses || 0} responses</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${getAccuracyColor(q?.accuracy || 0)}20`, color: getAccuracyColor(q?.accuracy || 0) }}>
                    {getAccuracyLabel(q?.accuracy || 0)}
                  </span>
                  <div className="flex items-center gap-1">
                    {(q?.accuracy || 0) >= 50 ? <TrendingUp className="w-4 h-4 text-green-400" /> : <TrendingDown className="w-4 h-4 text-red-400" />}
                    <span className="text-white font-bold text-sm">{Math.round(q?.accuracy || 0)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PerQuestionAccuracyPanel;
