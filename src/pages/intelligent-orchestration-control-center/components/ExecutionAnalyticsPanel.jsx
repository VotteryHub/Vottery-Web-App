import React from 'react';
import Icon from '../../../components/AppIcon';

const ExecutionAnalyticsPanel = ({ statistics, executions }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Execution Analytics</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Performance metrics and success rates for automated workflow executions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Zap" size={24} />
            <span className="text-2xl font-bold">{statistics?.totalExecutions || 0}</span>
          </div>
          <div className="text-sm opacity-90">Total Executions</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Icon name="CheckCircle2" size={24} />
            <span className="text-2xl font-bold">{statistics?.successRate || 0}%</span>
          </div>
          <div className="text-sm opacity-90">Success Rate</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Clock" size={24} />
            <span className="text-2xl font-bold">{statistics?.averageExecutionTime || 0}ms</span>
          </div>
          <div className="text-sm opacity-90">Avg Execution Time</div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Workflows by Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {statistics?.workflowsByType && Object.entries(statistics?.workflowsByType)?.map(([type, count]) => (
            <div key={type} className="bg-white dark:bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{type?.replace(/_/g, ' ')?.toUpperCase()}</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{count}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Executions</h3>
        <div className="space-y-2">
          {executions?.slice(0, 10)?.map(execution => (
            <div key={execution?.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon
                  name={execution?.status === 'completed' ? 'CheckCircle2' : execution?.status === 'failed' ? 'XCircle' : 'Loader2'}
                  size={18}
                  className={execution?.status === 'completed' ? 'text-green-500' : execution?.status === 'failed' ? 'text-red-500' : 'text-yellow-500'}
                />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{execution?.triggerSource}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(execution?.startedAt)?.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {execution?.executionDurationMs}ms
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExecutionAnalyticsPanel;
