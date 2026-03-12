import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const PerplexityAutomationPanel = ({ workflows, executionLogs }) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'running':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'failed':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority) => {
    if (priority >= 8) return 'text-red-600 dark:text-red-400';
    if (priority >= 5) return 'text-orange-600 dark:text-orange-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon name="Zap" className="w-6 h-6 text-purple-500" />
            Perplexity Automation Workflows
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {workflows?.filter(w => w?.status === 'active')?.length} Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {workflows?.map((workflow) => (
            <div
              key={workflow?.id}
              onClick={() => setSelectedWorkflow(workflow)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedWorkflow?.id === workflow?.id
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' :'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon name="Zap" className="w-5 h-5 text-purple-500" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {workflow?.workflowName}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {workflow?.workflowType?.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-semibold ${getPriorityColor(workflow?.priority)}`}>
                  P{workflow?.priority}
                </span>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <Icon name="GitBranch" className="w-3 h-3" />
                  <span>{workflow?.executionSequence?.length || 0} steps</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <Icon name="Bell" className="w-3 h-3" />
                  <span>{workflow?.notificationChannels?.length || 0} channels</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  workflow?.status === 'active' ?'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}>
                  {workflow?.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedWorkflow && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Workflow Execution Sequence
          </h3>

          <div className="space-y-3">
            {selectedWorkflow?.executionSequence?.map((step, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full flex items-center justify-center font-semibold text-sm">
                  {step?.step}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    {step?.action?.replace(/_/g, ' ')?.toUpperCase()}
                  </h4>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-400">
                    {step?.service && (
                      <span className="flex items-center gap-1">
                        <Icon name="Server" className="w-3 h-3" />
                        {step?.service}
                      </span>
                    )}
                    {step?.parallel && (
                      <span className="flex items-center gap-1">
                        <Icon name="Layers" className="w-3 h-3" />
                        Parallel execution
                      </span>
                    )}
                    {step?.audit && (
                      <span className="flex items-center gap-1">
                        <Icon name="FileText" className="w-3 h-3" />
                        Audit trail
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Activity" className="w-5 h-5 text-blue-500" />
          Recent Executions
        </h3>

        <div className="space-y-3">
          {executionLogs?.slice(0, 10)?.map((log) => (
            <div key={log?.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(log?.executionStatus)}`}>
                  {log?.executionStatus}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {log?.workflow?.workflowName || 'Unknown Workflow'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {log?.actionsExecuted?.length || 0} actions • {log?.notificationsSent?.length || 0} notifications
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {log?.executionDurationMs ? `${log?.executionDurationMs}ms` : 'In progress'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {new Date(log?.createdAt)?.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerplexityAutomationPanel;
