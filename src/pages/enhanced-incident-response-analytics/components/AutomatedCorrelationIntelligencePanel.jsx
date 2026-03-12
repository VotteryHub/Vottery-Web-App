import React from 'react';
import Icon from '../../../components/AppIcon';

const AutomatedCorrelationIntelligencePanel = ({ timeRange }) => {
  const learningMetrics = {
    totalCorrelations: 1247,
    accuracyRate: 94.3,
    falsePositives: 23,
    learningIterations: 156,
    modelVersion: '2.4.1'
  };

  const correlationPatterns = [
    {
      id: 1,
      pattern: 'Database Migration → API Latency Spike',
      occurrences: 45,
      accuracy: 96,
      avgTimeDelta: '2-5 minutes',
      confidence: 'High'
    },
    {
      id: 2,
      pattern: 'Feature Flag Toggle → Error Rate Increase',
      occurrences: 32,
      accuracy: 89,
      avgTimeDelta: '30-60 seconds',
      confidence: 'High'
    },
    {
      id: 3,
      pattern: 'Cache Invalidation → Response Time Degradation',
      occurrences: 28,
      accuracy: 92,
      avgTimeDelta: '1-3 minutes',
      confidence: 'Medium'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="Brain" className="w-6 h-6 text-purple-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Automated Correlation Intelligence
        </h2>
      </div>

      {/* Learning Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {learningMetrics?.totalCorrelations}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total Correlations</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {learningMetrics?.accuracyRate}%
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Accuracy Rate</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {learningMetrics?.falsePositives}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">False Positives</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {learningMetrics?.learningIterations}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Learning Iterations</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 rounded-lg p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              v{learningMetrics?.modelVersion}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Model Version</p>
          </div>
        </div>
      </div>

      {/* Learned Correlation Patterns */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Learned Correlation Patterns
        </h3>
        <div className="space-y-4">
          {correlationPatterns?.map(pattern => (
            <div
              key={pattern?.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {pattern?.pattern}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Observed {pattern?.occurrences} times with {pattern?.accuracy}% accuracy
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs text-white ${
                  pattern?.confidence === 'High' ? 'bg-green-500' :
                  pattern?.confidence === 'Medium'? 'bg-yellow-500' : 'bg-gray-500'
                }`}>
                  {pattern?.confidence} Confidence
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Icon name="Clock" className="w-4 h-4" />
                  Avg time delta: {pattern?.avgTimeDelta}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Target" className="w-4 h-4" />
                  {pattern?.accuracy}% accuracy
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Automated Learning Status */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <Icon name="Brain" className="w-8 h-8 text-purple-500" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
              Automated Correlation Learning Active
            </h3>
            <p className="text-sm text-purple-800 dark:text-purple-200 mb-4">
              The system continuously learns from incident patterns and improves correlation accuracy over time.
              Current model has processed {learningMetrics?.totalCorrelations} correlations with {learningMetrics?.accuracyRate}% accuracy.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="CheckCircle" className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Pattern Recognition
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Identifying recurring incident patterns
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="TrendingUp" className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Accuracy Improvement
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Continuously refining correlation models
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Zap" className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Proactive Detection
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Predicting incidents before they occur
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomatedCorrelationIntelligencePanel;