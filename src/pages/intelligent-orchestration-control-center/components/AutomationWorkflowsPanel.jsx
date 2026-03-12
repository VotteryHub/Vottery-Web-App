import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AutomationWorkflowsPanel = ({ workflows, statistics, onRefresh }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getWorkflowTypeIcon = (type) => {
    switch (type) {
      case 'fraud_detection': return 'Shield';
      case 'financial_threshold': return 'DollarSign';
      case 'compliance_deadline': return 'Calendar';
      case 'incident_escalation': return 'AlertTriangle';
      case 'optimization_opportunity': return 'TrendingUp';
      default: return 'Workflow';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Automation Workflows</h2>
        <Button onClick={onRefresh} className="flex items-center gap-2">
          <Icon name="Plus" size={16} />
          Create Workflow
        </Button>
      </div>

      <div className="grid gap-4">
        {workflows?.map(workflow => (
          <div key={workflow?.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon name={getWorkflowTypeIcon(workflow?.workflowType)} size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{workflow?.workflowName}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Type: {workflow?.workflowType?.replace(/_/g, ' ')?.toUpperCase()}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow?.status)}`}>
                {workflow?.status?.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Priority</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{workflow?.priority}/10</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Executions</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{workflow?.executionCount || 0}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Success Rate</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {workflow?.executionCount > 0 ? ((workflow?.successCount / workflow?.executionCount) * 100)?.toFixed(1) : 0}%
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Last Executed</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {workflow?.lastExecutedAt ? new Date(workflow?.lastExecutedAt)?.toLocaleTimeString() : 'Never'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" className="flex items-center gap-1">
                <Icon name="Play" size={14} />
                Execute
              </Button>
              <Button size="sm" variant="outline" className="flex items-center gap-1">
                <Icon name="Settings" size={14} />
                Configure
              </Button>
              <Button size="sm" variant="outline" className="flex items-center gap-1">
                <Icon name="BarChart3" size={14} />
                Analytics
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AutomationWorkflowsPanel;
