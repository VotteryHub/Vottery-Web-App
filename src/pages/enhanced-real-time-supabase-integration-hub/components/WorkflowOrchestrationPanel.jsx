import React from 'react';
import Icon from '../../../components/AppIcon';

const WorkflowOrchestrationPanel = ({ workflows, executionLogs, onRefresh }) => {
  const getWorkflowTypeIcon = (type) => {
    switch (type) {
      case 'fraud_response':
        return 'Shield';
      case 'compliance_submission':
        return 'FileText';
      case 'incident_escalation':
        return 'AlertTriangle';
      case 'financial_optimization':
        return 'TrendingUp';
      case 'stakeholder_notification':
        return 'Bell';
      default:
        return 'GitBranch';
    }
  };

  const getWorkflowTypeColor = (type) => {
    switch (type) {
      case 'fraud_response':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'compliance_submission':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'incident_escalation':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'financial_optimization':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'stakeholder_notification':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getTriggerSourceIcon = (source) => {
    switch (source) {
      case 'perplexity_fraud':
        return 'Brain';
      case 'financial_threshold':
        return 'DollarSign';
      case 'manual':
        return 'Hand';
      case 'scheduled':
        return 'Clock';
      default:
        return 'Zap';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon name="GitBranch" className="w-6 h-6 text-purple-500" />
            Workflow Orchestration
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {workflows?.filter(w => w?.status === 'active')?.length} / {workflows?.length} Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {workflows?.map((workflow) => (
            <div key={workflow?.id} className="p-5 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getWorkflowTypeColor(workflow?.workflowType)}`}>
                    <Icon name={getWorkflowTypeIcon(workflow?.workflowType)} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {workflow?.workflowName}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {workflow?.workflowType?.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  workflow?.status === 'active' ?'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : workflow?.status === 'paused' ?'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}>
                  {workflow?.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <Icon name={getTriggerSourceIcon(workflow?.triggerSource)} className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Trigger: {workflow?.triggerSource?.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Target" className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Priority: {workflow?.priority}/10
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Layers" className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {workflow?.executionSequence?.length || 0} execution steps
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-2">
                  {workflow?.notificationChannels?.map((channel, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    >
                      {channel}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Activity" className="w-5 h-5 text-blue-500" />
          Execution Timeline
        </h3>

        <div className="space-y-3">
          {executionLogs?.slice(0, 15)?.map((log, index) => (
            <div key={log?.id} className="relative">
              {index !== executionLogs?.slice(0, 15)?.length - 1 && (
                <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
              )}
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  log?.executionStatus === 'completed'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : log?.executionStatus === 'running' ?'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : log?.executionStatus === 'failed' ?'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}>
                  <Icon
                    name={
                      log?.executionStatus === 'completed' ? 'CheckCircle2' :
                      log?.executionStatus === 'running' ? 'Loader2' :
                      log?.executionStatus === 'failed'? 'XCircle' : 'Clock'
                    }
                    className={`w-4 h-4 ${log?.executionStatus === 'running' ? 'animate-spin' : ''}`}
                  />
                </div>
                <div className="flex-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {log?.workflow?.workflowName || 'Unknown Workflow'}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {log?.workflow?.triggerSource?.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(log?.createdAt)?.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                    <span>{log?.actionsExecuted?.length || 0} actions</span>
                    <span>•</span>
                    <span>{log?.notificationsSent?.length || 0} notifications</span>
                    {log?.executionDurationMs && (
                      <>
                        <span>•</span>
                        <span>{log?.executionDurationMs}ms</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkflowOrchestrationPanel;
