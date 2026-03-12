import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Layers, AlertCircle } from 'lucide-react';

const DIFFICULTY_COLORS = { easy: '#10b981', medium: '#f59e0b', hard: '#ef4444' };

const DifficultyCorrelationPanel = ({ difficultyData = null, loading = false }) => {
  const difficulties = ['easy', 'medium', 'hard'];

  const pieData = difficulties?.map(d => ({
    name: d?.charAt(0)?.toUpperCase() + d?.slice(1),
    value: difficultyData?.[d]?.count || 0,
    passRate: difficultyData?.[d]?.passRate || 0,
    avgAccuracy: difficultyData?.[d]?.avgAccuracy || 0
  }))?.filter(d => d?.value > 0);

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
        <div className="p-2 bg-orange-500/20 rounded-lg">
          <Layers className="w-5 h-5 text-orange-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">Difficulty Correlation</h3>
          <p className="text-gray-400 text-sm">Question difficulty vs passing rates</p>
        </div>
      </div>
      {!difficultyData || pieData?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <AlertCircle className="w-12 h-12 mb-3 opacity-50" />
          <p>No difficulty data available</p>
        </div>
      ) : (
        <>
          <div className="h-40 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                  {pieData?.map((entry, index) => (
                    <Cell key={index} fill={DIFFICULTY_COLORS?.[entry?.name?.toLowerCase()] || '#6b7280'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  formatter={(value, name) => [`${value} questions`, name]}
                />
                <Legend formatter={(value) => <span style={{ color: '#9ca3af', fontSize: '12px' }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {difficulties?.map(d => {
              const data = difficultyData?.[d];
              if (!data?.count) return null;
              const color = DIFFICULTY_COLORS?.[d];
              return (
                <div key={d} className="p-4 rounded-xl border" style={{ borderColor: `${color}40`, backgroundColor: `${color}10` }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-semibold capitalize">{d}</span>
                    <span className="text-gray-400 text-sm">{data?.count} questions</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Pass Rate</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div className="h-2 rounded-full" style={{ width: `${data?.passRate || 0}%`, backgroundColor: color }}></div>
                        </div>
                        <span className="text-white text-sm font-bold">{Math.round(data?.passRate || 0)}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Avg Accuracy</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div className="h-2 rounded-full" style={{ width: `${data?.avgAccuracy || 0}%`, backgroundColor: color }}></div>
                        </div>
                        <span className="text-white text-sm font-bold">{Math.round(data?.avgAccuracy || 0)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default DifficultyCorrelationPanel;
