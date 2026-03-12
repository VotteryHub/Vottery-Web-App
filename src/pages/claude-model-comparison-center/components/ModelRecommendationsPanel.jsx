import React from 'react';
import Icon from '../../../components/AppIcon';

const ModelRecommendationsPanel = ({ metrics, taskType }) => {
  if (!metrics) return null;

  const getRecommendation = () => {
    const costDiff = ((metrics?.opus?.avgCost - metrics?.sonnet?.avgCost) / metrics?.opus?.avgCost * 100)?.toFixed(0);
    const speedDiff = ((metrics?.opus?.avgResponseTime - metrics?.sonnet?.avgResponseTime) / metrics?.opus?.avgResponseTime * 100)?.toFixed(0);

    const recommendations = {
      fraud_detection: {
        primary: 'opus',
        reason: 'Critical accuracy required for fraud detection. Opus provides 3% higher accuracy with deeper reasoning.',
        useCase: 'High-risk transactions, complex fraud patterns, regulatory compliance'
      },
      content_moderation: {
        primary: 'sonnet',
        reason: `Sonnet offers ${speedDiff}% faster response with ${costDiff}% cost savings, ideal for high-volume moderation.`,
        useCase: 'Real-time content screening, bulk moderation, automated filtering'
      },
      dispute_resolution: {
        primary: 'opus',
        reason: 'Complex reasoning and nuanced understanding required. Opus excels at multi-party dispute analysis.',
        useCase: 'High-value disputes, legal considerations, detailed evidence analysis'
      },
      strategic_planning: {
        primary: 'balanced',
        reason: 'Both models perform well. Choose Sonnet for speed and cost, Opus for deeper strategic insights.',
        useCase: 'Sonnet: Quick insights, daily planning. Opus: Long-term strategy, critical decisions'
      }
    };

    return recommendations?.[taskType] || recommendations?.strategic_planning;
  };

  const recommendation = getRecommendation();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Lightbulb" size={20} className="text-yellow-500" />
          Recommended Model for {taskType?.replace('_', ' ')?.toUpperCase()}
        </h3>

        <div className="flex items-center gap-4 mb-6">
          {recommendation?.primary === 'opus' && (
            <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg flex-1">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Icon name="Brain" size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">Claude 3 Opus</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Recommended</div>
              </div>
            </div>
          )}
          {recommendation?.primary === 'sonnet' && (
            <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg flex-1">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Icon name="Zap" size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">Claude 3.5 Sonnet</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Recommended</div>
              </div>
            </div>
          )}
          {recommendation?.primary === 'balanced' && (
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg">
                <Icon name="Zap" size={20} className="text-blue-600" />
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Sonnet</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg">
                <Icon name="Brain" size={20} className="text-purple-600" />
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Opus</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Reasoning</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">{recommendation?.reason}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Best Use Cases</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">{recommendation?.useCase}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Target" size={20} />
          Model Selection Criteria
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
              <Icon name="Zap" size={16} />
              Choose Sonnet When:
            </h4>
            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="text-blue-600 mt-0.5" />
                <span>High-volume operations requiring fast response times</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="text-blue-600 mt-0.5" />
                <span>Cost optimization is a priority</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="text-blue-600 mt-0.5" />
                <span>Tasks require good accuracy but not maximum precision</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="text-blue-600 mt-0.5" />
                <span>Real-time processing and immediate feedback needed</span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
            <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-2 flex items-center gap-2">
              <Icon name="Brain" size={16} />
              Choose Opus When:
            </h4>
            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="text-purple-600 mt-0.5" />
                <span>Maximum accuracy and reasoning depth required</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="text-purple-600 mt-0.5" />
                <span>Complex analysis with multiple factors and nuances</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="text-purple-600 mt-0.5" />
                <span>High-stakes decisions with significant consequences</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="text-purple-600 mt-0.5" />
                <span>Regulatory compliance and audit requirements</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={20} />
          Optimization Strategy
        </h3>
        <div className="space-y-3">
          <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <div className="flex items-start gap-2">
              <Icon name="Lightbulb" size={16} className="text-green-600 mt-0.5" />
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Hybrid Approach:</strong> Use Sonnet for initial screening and Opus for flagged cases requiring deeper analysis.
              </div>
            </div>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <div className="flex items-start gap-2">
              <Icon name="Lightbulb" size={16} className="text-blue-600 mt-0.5" />
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Automated Switching:</strong> Configure thresholds to automatically route complex cases to Opus while handling routine tasks with Sonnet.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelRecommendationsPanel;