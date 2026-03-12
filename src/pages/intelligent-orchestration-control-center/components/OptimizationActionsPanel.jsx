import React from 'react';
import Icon from '../../../components/AppIcon';

const OptimizationActionsPanel = ({ actions, onRefresh }) => {
  const getActionTypeIcon = (type) => {
    switch (type) {
      case 'budget_reallocation': return 'DollarSign';
      case 'campaign_adjustment': return 'Settings';
      case 'fraud_prevention': return 'Shield';
      case 'performance_optimization': return 'TrendingUp';
      default: return 'Zap';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'executing': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Optimization Actions</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Automated budget reallocation, campaign adjustments, and fraud prevention measures executed based on AI recommendations
        </p>
      </div>

      <div className="grid gap-4">
        {actions?.map(action => (
          <div key={action?.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Icon name={getActionTypeIcon(action?.actionType)} size={20} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {action?.actionType?.replace(/_/g, ' ')?.toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Triggered by: {action?.triggerSource?.replace(/_/g, ' ')}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(action?.status)}`}>
                {action?.status?.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Before State:</div>
                <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
                  {JSON.stringify(action?.beforeState, null, 2)}
                </pre>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">After State:</div>
                <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
                  {JSON.stringify(action?.afterState, null, 2)}
                </pre>
              </div>
            </div>

            {action?.performanceImpact && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 mb-3">
                <div className="text-xs font-medium text-green-700 dark:text-green-400 mb-2">Performance Impact:</div>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(action?.performanceImpact)?.map(([key, value]) => (
                    <div key={key}>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{key?.replace(/([A-Z])/g, ' $1')?.trim()}</div>
                      <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {typeof value === 'number' ? `+${value}${key?.includes('Percentage') || key?.includes('Increase') ? '%' : ''}` : value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-gray-500 dark:text-gray-400">
              Executed: {action?.executedAt ? new Date(action?.executedAt)?.toLocaleString() : 'Pending'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OptimizationActionsPanel;
