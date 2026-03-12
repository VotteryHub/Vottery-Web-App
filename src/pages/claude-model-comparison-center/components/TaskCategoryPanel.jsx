import React from 'react';
import Icon from '../../../components/AppIcon';

const TaskCategoryPanel = ({ history, onTaskTypeChange }) => {
  const taskCategories = [
    {
      type: 'fraud_detection',
      label: 'Fraud Detection',
      icon: 'ShieldAlert',
      description: 'Analyze transactions and user behavior for fraud indicators',
      sonnetScore: 94,
      opusScore: 97,
      recommendation: 'Opus recommended for critical fraud analysis'
    },
    {
      type: 'content_moderation',
      label: 'Content Moderation',
      icon: 'Shield',
      description: 'Review content for policy violations and safety concerns',
      sonnetScore: 92,
      opusScore: 95,
      recommendation: 'Sonnet suitable for high-volume moderation'
    },
    {
      type: 'dispute_resolution',
      label: 'Dispute Resolution',
      icon: 'Scale',
      description: 'Analyze disputes and provide resolution recommendations',
      sonnetScore: 89,
      opusScore: 96,
      recommendation: 'Opus preferred for complex dispute analysis'
    },
    {
      type: 'strategic_planning',
      label: 'Strategic Planning',
      icon: 'Target',
      description: 'Generate strategic recommendations and business insights',
      sonnetScore: 91,
      opusScore: 94,
      recommendation: 'Both models perform well, choose based on budget'
    }
  ];

  const getTestCount = (taskType) => {
    return history?.filter(h => h?.taskType === taskType)?.length || 0;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Layers" size={20} />
          Task Category Performance
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Model effectiveness across different analytics task types
        </p>

        <div className="space-y-4">
          {taskCategories?.map(category => (
            <div
              key={category?.type}
              className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer"
              onClick={() => onTaskTypeChange(category?.type)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name={category?.icon} size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {category?.label}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {category?.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Icon name="Activity" size={14} />
                      <span>{getTestCount(category?.type)} tests completed</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Sonnet Score</span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{category?.sonnetScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${category?.sonnetScore}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Opus Score</span>
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{category?.opusScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${category?.opusScore}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                <div className="flex items-start gap-2">
                  <Icon name="Lightbulb" size={14} className="text-blue-600 dark:text-blue-400 mt-0.5" />
                  <span className="text-xs text-gray-700 dark:text-gray-300">
                    <strong>Recommendation:</strong> {category?.recommendation}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskCategoryPanel;