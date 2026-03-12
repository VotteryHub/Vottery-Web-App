import React from 'react';
import Icon from '../../../components/AppIcon';

const PredictiveIncidentModelingPanel = ({ timeRange }) => {
  const predictions = [
    {
      id: 1,
      type: 'Performance Degradation',
      probability: 78,
      timeframe: '2-4 hours',
      affectedSystems: ['API Gateway', 'Database'],
      indicators: ['Increasing response times', 'Memory usage trending up', 'Connection pool saturation'],
      recommendation: 'Scale database read replicas and increase API gateway capacity'
    },
    {
      id: 2,
      type: 'Service Outage',
      probability: 45,
      timeframe: '6-12 hours',
      affectedSystems: ['Payment Service'],
      indicators: ['Error rate spike pattern', 'Third-party API latency'],
      recommendation: 'Enable circuit breaker and prepare fallback payment provider'
    }
  ];

  const getProbabilityColor = (prob) => {
    if (prob >= 70) return 'text-red-500';
    if (prob >= 50) return 'text-yellow-500';
    return 'text-blue-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="TrendingUp" className="w-6 h-6 text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Predictive Incident Modeling
        </h2>
      </div>

      <div className="space-y-6">
        {predictions?.map(prediction => (
          <div
            key={prediction?.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {prediction?.type}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Predicted within: {prediction?.timeframe}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold ${getProbabilityColor(prediction?.probability)}`}>
                  {prediction?.probability}%
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Probability</p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Affected Systems
              </h4>
              <div className="flex flex-wrap gap-2">
                {prediction?.affectedSystems?.map((system, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                  >
                    {system}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Early Warning Indicators
              </h4>
              <div className="space-y-2">
                {prediction?.indicators?.map((indicator, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Icon name="AlertCircle" className="w-4 h-4 text-yellow-500" />
                    <span className="text-gray-700 dark:text-gray-300">{indicator}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">
                Recommended Action
              </h4>
              <p className="text-sm text-green-800 dark:text-green-200">
                {prediction?.recommendation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictiveIncidentModelingPanel;