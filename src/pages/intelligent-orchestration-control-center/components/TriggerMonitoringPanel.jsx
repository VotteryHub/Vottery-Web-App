import React from 'react';
import Icon from '../../../components/AppIcon';

const TriggerMonitoringPanel = ({ workflows, onRefresh }) => {
  const getTriggerStatus = (workflow) => {
    if (workflow?.status === 'active') return { label: 'Active', color: 'text-green-600 bg-green-100', icon: 'CheckCircle2' };
    if (workflow?.status === 'paused') return { label: 'Paused', color: 'text-yellow-600 bg-yellow-100', icon: 'Pause' };
    return { label: 'Inactive', color: 'text-gray-600 bg-gray-100', icon: 'Circle' };
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Trigger Status Monitoring</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Real-time monitoring of workflow triggers based on Perplexity fraud detection, financial thresholds, and compliance deadlines
        </p>
      </div>

      <div className="grid gap-4">
        {workflows?.map(workflow => {
          const status = getTriggerStatus(workflow);
          return (
            <div key={workflow?.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Icon name={status?.icon} size={20} className={status?.color?.split(' ')?.[0]} />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{workflow?.workflowName}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Trigger Type: {workflow?.workflowType?.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${status?.color}`}>
                  {status?.label}
                </span>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Trigger Conditions:</div>
                <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
                  {JSON.stringify(workflow?.triggerConditions, null, 2)}
                </pre>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Total Triggers</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">{workflow?.executionCount || 0}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Success Rate</div>
                  <div className="text-lg font-semibold text-green-600">
                    {workflow?.executionCount > 0 ? ((workflow?.successCount / workflow?.executionCount) * 100)?.toFixed(1) : 0}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Last Triggered</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {workflow?.lastExecutedAt ? new Date(workflow?.lastExecutedAt)?.toLocaleString() : 'Never'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TriggerMonitoringPanel;
