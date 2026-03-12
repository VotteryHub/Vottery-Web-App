import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceAnalyticsPanel = () => {
  const performanceMetrics = [
    { label: 'Total Decisions', value: '1,247', change: '+12%', icon: 'CheckCircle2', color: 'blue' },
    { label: 'Average Confidence', value: '87.3%', change: '+5%', icon: 'TrendingUp', color: 'green' },
    { label: 'Consensus Rate', value: '92.1%', change: '+8%', icon: 'GitMerge', color: 'purple' },
    { label: 'Execution Success', value: '98.5%', change: '+2%', icon: 'Zap', color: 'yellow' },
  ];

  const aiModelPerformance = [
    { model: 'Claude', accuracy: 94, speed: 2.1, confidence: 89, color: 'blue' },
    { model: 'Perplexity', accuracy: 91, speed: 1.8, confidence: 85, color: 'purple' },
    { model: 'OpenAI', accuracy: 93, speed: 2.3, confidence: 88, color: 'green' },
  ];

  return (
    <div className="space-y-6">
      {/* Performance Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics?.map((metric, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${metric?.color}-100 dark:bg-${metric?.color}-900/20 rounded-lg flex items-center justify-center`}>
                <Icon name={metric?.icon} size={24} className={`text-${metric?.color}-600 dark:text-${metric?.color}-400`} />
              </div>
              <span className="text-xs font-medium text-green-600 dark:text-green-400">{metric?.change}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{metric?.value}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{metric?.label}</div>
          </div>
        ))}
      </div>

      {/* AI Model Performance Comparison */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="BarChart3" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            AI Model Performance Comparison
          </h3>
        </div>

        <div className="space-y-6">
          {aiModelPerformance?.map((model, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 bg-${model?.color}-600 rounded-full`} />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{model?.model}</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Overall Score: {((model?.accuracy + model?.confidence) / 2)?.toFixed(1)}%</span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Accuracy</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{model?.accuracy}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className={`bg-${model?.color}-600 h-2 rounded-full`} style={{ width: `${model?.accuracy}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Speed (s)</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{model?.speed}s</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className={`bg-${model?.color}-600 h-2 rounded-full`} style={{ width: `${(3 - model?.speed) * 33}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Confidence</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{model?.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className={`bg-${model?.color}-600 h-2 rounded-full`} style={{ width: `${model?.confidence}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decision Transparency & Accountability */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Shield" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Decision Transparency & Accountability
          </h3>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Audit Trail Completeness</span>
              <span className="text-sm font-bold text-green-600 dark:text-green-400">100%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Decision Explainability</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">96%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '96%' }} />
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Compliance Adherence</span>
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">99%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '99%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Continuous Improvement */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="TrendingUp" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Continuous AI Orchestration Improvement
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Brain" size={20} className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Learning Rate</span>
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">+15%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Month over month improvement</div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Target" size={20} className="text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Accuracy Gain</span>
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">+8.3%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Since ML optimization enabled</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalyticsPanel;