import React from 'react';
import { Heart, TrendingUp, CheckCircle } from 'lucide-react';

const HealthScorePanel = () => {
  const healthScore = 8.7;
  const maxScore = 10;
  const percentage = (healthScore / maxScore) * 100;

  const healthFactors = [
    { name: 'Adoption Rate', score: 9.2, weight: 30, status: 'excellent' },
    { name: 'Performance', score: 8.5, weight: 25, status: 'good' },
    { name: 'Stability', score: 8.9, weight: 25, status: 'excellent' },
    { name: 'User Satisfaction', score: 8.2, weight: 20, status: 'good' }
  ];

  const predictions = [
    { metric: 'Next Week Score', value: '8.9', trend: 'up', confidence: 92 },
    { metric: 'Success Probability', value: '94%', trend: 'up', confidence: 88 },
    { metric: 'Risk Level', value: 'Low', trend: 'down', confidence: 85 }
  ];

  const getScoreColor = (score) => {
    if (score >= 9) return 'text-green-600';
    if (score >= 7) return 'text-blue-600';
    if (score >= 5) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 9) return 'bg-green-600';
    if (score >= 7) return 'bg-blue-600';
    if (score >= 5) return 'bg-orange-600';
    return 'bg-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-pink-100 rounded-lg">
          <Heart className="w-6 h-6 text-pink-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Health Score Engine</h2>
          <p className="text-sm text-gray-600">Composite feature health</p>
        </div>
      </div>
      {/* Overall Health Score */}
      <div className="mb-6">
        <div className="relative w-40 h-40 mx-auto mb-4">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#e5e7eb"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="url(#healthGradient)"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 70}`}
              strokeDashoffset={`${2 * Math.PI * 70 * (1 - percentage / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${getScoreColor(healthScore)}`}>
              {healthScore}
            </span>
            <span className="text-sm text-gray-600">/ {maxScore}</span>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">Healthy Status</span>
          </div>
        </div>
      </div>
      {/* Health Factors */}
      <div className="space-y-3 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Health Factors</h3>
        {healthFactors?.map((factor, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">{factor?.name}</span>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${getScoreColor(factor?.score)}`}>
                  {factor?.score}
                </span>
                <span className="text-gray-500 text-xs">({factor?.weight}%)</span>
              </div>
            </div>
            <div className="bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${getScoreBg(factor?.score)}`}
                style={{ width: `${(factor?.score / maxScore) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      {/* Predictive Analytics */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Predictive Analytics
        </h3>
        <div className="space-y-3">
          {predictions?.map((pred, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">{pred?.metric}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900">{pred?.value}</span>
                <span className="text-xs text-gray-500">({pred?.confidence}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthScorePanel;