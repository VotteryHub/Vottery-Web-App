import React from 'react';
import { TrendingUp, Target, Zap } from 'lucide-react';

const PredictiveAnalyticsPanel = () => {
  const predictions = [
    {
      title: 'User Intent',
      prediction: 'High Purchase Intent',
      confidence: 89,
      timeframe: 'Next 24h'
    },
    {
      title: 'Conversion Probability',
      prediction: '76% Likely',
      confidence: 85,
      timeframe: 'Current Session'
    },
    {
      title: 'Engagement Trend',
      prediction: 'Increasing',
      confidence: 92,
      timeframe: 'Next 7 days'
    }
  ];

  const trends = [
    { label: 'Click-through Rate', current: '12.4%', predicted: '14.8%', change: '+19%' },
    { label: 'Bounce Rate', current: '32.1%', predicted: '28.5%', change: '-11%' },
    { label: 'Avg Session Time', current: '4m 23s', predicted: '5m 12s', change: '+19%' },
    { label: 'Conversion Rate', current: '3.2%', predicted: '3.9%', change: '+22%' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <TrendingUp className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Predictive Analytics</h2>
          <p className="text-sm text-gray-600">Behavioral trend forecasting</p>
        </div>
      </div>
      {/* Predictions */}
      <div className="space-y-3 mb-6">
        {predictions?.map((pred, idx) => (
          <div key={idx} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-sm font-semibold text-gray-900">{pred?.title}</div>
                <div className="text-lg font-bold text-blue-600">{pred?.prediction}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{pred?.confidence}%</div>
                <div className="text-xs text-gray-600">Confidence</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Target className="w-3 h-3" />
              <span>{pred?.timeframe}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Trend Forecasting */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Trend Forecasting</h3>
        {trends?.map((trend, idx) => (
          <div key={idx} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">{trend?.label}</span>
              <span
                className={`text-xs font-bold ${
                  trend?.change?.startsWith('+')
                    ? trend?.label === 'Bounce Rate' ?'text-red-600' :'text-green-600'
                    : trend?.label === 'Bounce Rate' ?'text-green-600' :'text-red-600'
                }`}
              >
                {trend?.change}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-gray-600">Current: </span>
                <span className="font-bold text-gray-900">{trend?.current}</span>
              </div>
              <div className="text-gray-400">→</div>
              <div>
                <span className="text-gray-600">Predicted: </span>
                <span className="font-bold text-blue-600">{trend?.predicted}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* A/B Testing Integration */}
      <div className="mt-6 p-3 bg-purple-50 rounded-lg border border-purple-200">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-semibold text-purple-900">A/B Testing Integration</span>
        </div>
        <p className="text-xs text-purple-700">
          Predictive models integrated with 5 active A/B tests for optimization
        </p>
      </div>
    </div>
  );
};

export default PredictiveAnalyticsPanel;