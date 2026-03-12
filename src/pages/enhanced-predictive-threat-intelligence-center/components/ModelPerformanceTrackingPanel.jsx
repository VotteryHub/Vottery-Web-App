import React from 'react';
import Icon from '../../../components/AppIcon';

function ModelPerformanceTrackingPanel() {
  const performanceMetrics = {
    overallAccuracy: 94.2,
    precision: 91.8,
    recall: 89.5,
    f1Score: 90.6,
    falsePositiveRate: 3.8,
    falseNegativeRate: 4.2,
  };

  const modelVersions = [
    {
      version: 'v3.2.1',
      deployedDate: '2024-01-15',
      accuracy: 94.2,
      status: 'active',
      improvements: '+2.3% accuracy, -1.1% false positives',
    },
    {
      version: 'v3.1.0',
      deployedDate: '2023-12-10',
      accuracy: 91.9,
      status: 'deprecated',
      improvements: '+1.8% accuracy, improved cross-domain correlation',
    },
    {
      version: 'v3.0.5',
      deployedDate: '2023-11-05',
      accuracy: 90.1,
      status: 'archived',
      improvements: 'Initial Perplexity integration',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'deprecated': return 'text-yellow-600 bg-yellow-100';
      case 'archived': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMetricColor = (value, isInverse = false) => {
    if (isInverse) {
      if (value <= 5) return 'text-green-600';
      if (value <= 10) return 'text-yellow-600';
      return 'text-red-600';
    }
    if (value >= 90) return 'text-green-600';
    if (value >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={24} className="text-indigo-600" />
          Model Performance Tracking
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Predictive model performance metrics, accuracy tracking, and continuous improvement analytics
        </p>

        {/* Key Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
            <div className={`text-3xl font-bold ${getMetricColor(performanceMetrics?.overallAccuracy)} mb-1`}>
              {performanceMetrics?.overallAccuracy}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Overall Accuracy</div>
          </div>
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className={`text-3xl font-bold ${getMetricColor(performanceMetrics?.precision)} mb-1`}>
              {performanceMetrics?.precision}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Precision</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className={`text-3xl font-bold ${getMetricColor(performanceMetrics?.recall)} mb-1`}>
              {performanceMetrics?.recall}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Recall</div>
          </div>
          <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <div className={`text-3xl font-bold ${getMetricColor(performanceMetrics?.f1Score)} mb-1`}>
              {performanceMetrics?.f1Score}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">F1 Score</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className={`text-3xl font-bold ${getMetricColor(performanceMetrics?.falsePositiveRate, true)} mb-1`}>
              {performanceMetrics?.falsePositiveRate}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">False Positive Rate</div>
          </div>
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className={`text-3xl font-bold ${getMetricColor(performanceMetrics?.falseNegativeRate, true)} mb-1`}>
              {performanceMetrics?.falseNegativeRate}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">False Negative Rate</div>
          </div>
        </div>

        {/* Performance Trends */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">30-Day Performance Trends</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">Threat Detection Accuracy</span>
                <span className="text-sm font-semibold text-green-600">+2.3%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-400 to-green-600" style={{ width: '94.2%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">Cross-Domain Correlation</span>
                <span className="text-sm font-semibold text-green-600">+1.8%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600" style={{ width: '88.5%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">Compliance Forecast Accuracy</span>
                <span className="text-sm font-semibold text-green-600">+3.1%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600" style={{ width: '91.7%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Model Versions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="GitBranch" size={20} className="text-indigo-600" />
          Model Version History
        </h3>
        <div className="space-y-3">
          {modelVersions?.map((model, idx) => (
            <div
              key={idx}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono font-semibold text-gray-900 dark:text-white">{model?.version}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(model?.status)}`}>
                      {model?.status?.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Deployed: {new Date(model.deployedDate)?.toLocaleDateString()}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{model?.improvements}</p>
                </div>
                <div className="text-right ml-4">
                  <div className={`text-2xl font-bold ${getMetricColor(model?.accuracy)} mb-1`}>
                    {model?.accuracy}%
                  </div>
                  <div className="text-xs text-gray-500">Accuracy</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Training Data Quality */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Database" size={20} className="text-indigo-600" />
          Training Data Quality
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">1.2M</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Training Samples</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">98.7%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Data Quality</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">247</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Feature Dimensions</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">Daily</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Retraining Cycle</div>
          </div>
        </div>
      </div>
      {/* Continuous Improvement */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-indigo-200 dark:border-indigo-800">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Zap" size={20} className="text-indigo-600" />
          Continuous Improvement Pipeline
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Automated model retraining with feedback loops from threat detection, compliance forecasting, and cross-domain correlation
        </p>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2">
            <Icon name="RefreshCw" size={16} />
            Trigger Retraining
          </button>
          <button className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors font-medium flex items-center gap-2">
            <Icon name="Download" size={16} />
            Export Metrics
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModelPerformanceTrackingPanel;