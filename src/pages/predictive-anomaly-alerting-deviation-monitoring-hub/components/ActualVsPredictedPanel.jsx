import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Activity } from 'lucide-react';

const ActualVsPredictedPanel = () => {
  const [comparisonData, setComparisonData] = useState([
    {
      id: 1,
      metric: 'Revenue',
      predicted: 38500,
      actual: 45230,
      deviation: 17.5,
      unit: '$',
      category: 'revenue',
      timestamp: new Date()?.toISOString()
    },
    {
      id: 2,
      metric: 'User Engagement',
      predicted: 10450,
      actual: 8920,
      deviation: -14.6,
      unit: 'users',
      category: 'engagement',
      timestamp: new Date()?.toISOString()
    },
    {
      id: 3,
      metric: 'Campaign CTR',
      predicted: 10.5,
      actual: 12.3,
      deviation: 17.1,
      unit: '%',
      category: 'campaign',
      timestamp: new Date()?.toISOString()
    },
    {
      id: 4,
      metric: 'Fraud Detection Rate',
      predicted: 2.8,
      actual: 3.5,
      deviation: 25.0,
      unit: '%',
      category: 'fraud',
      timestamp: new Date()?.toISOString()
    }
  ]);

  const getDeviationColor = (deviation) => {
    const absDeviation = Math.abs(deviation);
    if (absDeviation >= 20) return 'text-red-600';
    if (absDeviation >= 15) return 'text-orange-600';
    return 'text-yellow-600';
  };

  const getDeviationBg = (deviation) => {
    const absDeviation = Math.abs(deviation);
    if (absDeviation >= 20) return 'bg-red-50 border-red-300';
    if (absDeviation >= 15) return 'bg-orange-50 border-orange-300';
    return 'bg-yellow-50 border-yellow-300';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
          Actual vs Predicted Metrics Visualization
        </h2>
        <p className="text-gray-600 mb-6">Side-by-side comparison with real-time percentage deviation calculations and confidence interval boundaries</p>

        <div className="space-y-4">
          {comparisonData?.map((item) => (
            <div key={item?.id} className={`border-2 rounded-lg p-5 ${getDeviationBg(item?.deviation)}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{item?.metric}</h3>
                  <p className="text-sm text-gray-600 capitalize">Category: {item?.category}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {item?.deviation > 0 ? (
                    <TrendingUp className={`w-6 h-6 ${getDeviationColor(item?.deviation)}`} />
                  ) : (
                    <TrendingDown className={`w-6 h-6 ${getDeviationColor(item?.deviation)}`} />
                  )}
                  <span className={`text-2xl font-bold ${getDeviationColor(item?.deviation)}`}>
                    {item?.deviation > 0 ? '+' : ''}{item?.deviation}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-4">
                <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
                  <p className="text-sm text-gray-600 mb-1">Predicted Value</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {item?.unit === '$' && item?.unit}
                    {item?.predicted?.toLocaleString()}
                    {item?.unit !== '$' && ` ${item?.unit}`}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-green-300">
                  <p className="text-sm text-gray-600 mb-1">Actual Value</p>
                  <p className="text-3xl font-bold text-green-600">
                    {item?.unit === '$' && item?.unit}
                    {item?.actual?.toLocaleString()}
                    {item?.unit !== '$' && ` ${item?.unit}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t-2 border-current opacity-50">
                <p className="text-xs">Last Updated: {new Date(item.timestamp)?.toLocaleString()}</p>
                {Math.abs(item?.deviation) >= 15 && (
                  <span className="px-3 py-1 bg-red-600 text-white rounded-full text-xs font-semibold">
                    ALERT TRIGGERED
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Avg Deviation</h3>
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">18.6%</p>
          <p className="text-sm text-gray-600">Across all metrics</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Predictions Today</h3>
            <BarChart3 className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">247</p>
          <p className="text-sm text-gray-600">Real-time monitoring</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Alerts Triggered</h3>
            <TrendingUp className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">12</p>
          <p className="text-sm text-gray-600">Exceeding 15% threshold</p>
        </div>
      </div>
    </div>
  );
};

export default ActualVsPredictedPanel;