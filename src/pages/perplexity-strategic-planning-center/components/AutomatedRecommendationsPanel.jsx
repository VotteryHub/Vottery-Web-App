import React from 'react';
import Icon from '../../../components/AppIcon';

const AutomatedRecommendationsPanel = ({ data }) => {
  const priorityColors = {
    critical: { bg: 'bg-red-50 dark:bg-red-900/10', text: 'text-red-700 dark:text-red-400', badge: 'bg-red-100 dark:bg-red-900/20' },
    high: { bg: 'bg-orange-50 dark:bg-orange-900/10', text: 'text-orange-700 dark:text-orange-400', badge: 'bg-orange-100 dark:bg-orange-900/20' },
    medium: { bg: 'bg-yellow-50 dark:bg-yellow-900/10', text: 'text-yellow-700 dark:text-yellow-400', badge: 'bg-yellow-100 dark:bg-yellow-900/20' },
    low: { bg: 'bg-blue-50 dark:bg-blue-900/10', text: 'text-blue-700 dark:text-blue-400', badge: 'bg-blue-100 dark:bg-blue-900/20' }
  };

  const impactIcons = {
    high: 'TrendingUp',
    medium: 'Minus',
    low: 'TrendingDown'
  };

  return (
    <div className="space-y-6">
      {data?.recommendations?.map((rec, idx) => {
        const colors = priorityColors?.[rec?.priority] || priorityColors?.medium;
        
        return (
          <div key={idx} className={`rounded-lg p-6 border ${colors?.bg} border-gray-200 dark:border-gray-700`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-1 ${colors?.badge} ${colors?.text} text-xs font-semibold rounded-full uppercase`}>
                    {rec?.priority} Priority
                  </span>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full">
                    {rec?.category}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full">
                    {rec?.timeline}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{rec?.action}</h3>
              </div>
            </div>
            {/* Rationale */}
            <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                <Icon name="FileText" size={16} />
                Rationale
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">{rec?.rationale}</p>
            </div>
            {/* Impact & Effort */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name={impactIcons?.[rec?.impact] || 'Activity'} size={16} className="text-green-500" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Impact</p>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100 capitalize">{rec?.impact}</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Zap" size={16} className="text-orange-500" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Effort</p>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100 capitalize">{rec?.effort}</p>
              </div>
            </div>
            {/* Dependencies */}
            {rec?.dependencies?.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <Icon name="GitBranch" size={16} />
                  Dependencies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {rec?.dependencies?.map((dep, dIdx) => (
                    <span key={dIdx} className="px-3 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full border border-gray-200 dark:border-gray-700">
                      {dep}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* Success Metrics */}
            {rec?.successMetrics?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <Icon name="Target" size={16} className="text-green-500" />
                  Success Metrics
                </h4>
                <div className="space-y-2">
                  {rec?.successMetrics?.map((metric, mIdx) => (
                    <div key={mIdx} className="flex items-start gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <Icon name="CheckCircle" size={16} className="text-green-600 dark:text-green-400 mt-0.5" />
                      <p className="text-sm text-gray-700 dark:text-gray-300">{metric}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AutomatedRecommendationsPanel;