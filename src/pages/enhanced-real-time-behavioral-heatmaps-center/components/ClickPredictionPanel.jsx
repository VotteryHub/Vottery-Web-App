import React from 'react';
import { Brain, Target, TrendingUp, Zap } from 'lucide-react';

const ClickPredictionPanel = () => {
  const predictions = [
    {
      element: 'Primary Vote Button',
      probability: 94,
      confidence: 92,
      placement: 'Optimal',
      recommendation: 'Maintain current position'
    },
    {
      element: 'Election Card CTA',
      probability: 87,
      confidence: 88,
      placement: 'Good',
      recommendation: 'Consider A/B test with larger size'
    },
    {
      element: 'Navigation Menu',
      probability: 76,
      confidence: 85,
      placement: 'Moderate',
      recommendation: 'Increase visibility with color contrast'
    },
    {
      element: 'Sidebar Widget',
      probability: 62,
      confidence: 78,
      placement: 'Low',
      recommendation: 'Reposition to higher attention zone'
    }
  ];

  const behavioralModels = [
    { name: 'Click Patterns', accuracy: 94.2, status: 'active' },
    { name: 'Conversion Zones', accuracy: 89.7, status: 'active' },
    { name: 'User Intent', accuracy: 87.3, status: 'training' },
    { name: 'Engagement Flow', accuracy: 91.5, status: 'active' }
  ];

  const getPlacementColor = (placement) => {
    switch (placement?.toLowerCase()) {
      case 'optimal':
        return 'bg-green-100 text-green-700';
      case 'good':
        return 'bg-blue-100 text-blue-700';
      case 'moderate':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Brain className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Click Prediction Engine</h2>
          <p className="text-sm text-gray-600">ML-powered interaction forecasting</p>
        </div>
      </div>
      {/* Predictions List */}
      <div className="space-y-4 mb-6">
        {predictions?.map((pred, idx) => (
          <div
            key={idx}
            className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-gray-600" />
                  <span className="font-semibold text-gray-900">{pred?.element}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      getPlacementColor(pred?.placement)
                    }`}
                  >
                    {pred?.placement}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{pred?.recommendation}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-indigo-600">{pred?.probability}%</div>
                <div className="text-xs text-gray-600">Click Probability</div>
              </div>
            </div>

            {/* Confidence Score */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-600 min-w-[5rem]">Confidence:</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full"
                  style={{ width: `${pred?.confidence}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-700">{pred?.confidence}%</span>
            </div>
          </div>
        ))}
      </div>
      {/* Behavioral Models */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Behavioral Modeling
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {behavioralModels?.map((model, idx) => (
            <div key={idx} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{model?.name}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    model?.status === 'active' ?'bg-green-100 text-green-700' :'bg-blue-100 text-blue-700'
                  }`}
                >
                  {model?.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full"
                    style={{ width: `${model?.accuracy}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-gray-700">{model?.accuracy}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* A/B Testing Integration */}
      <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-semibold text-purple-900">
            A/B Testing Integration
          </span>
        </div>
        <p className="text-xs text-purple-700">
          3 active experiments using prediction data for variant optimization
        </p>
      </div>
    </div>
  );
};

export default ClickPredictionPanel;