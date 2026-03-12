import React from 'react';
import Icon from '../../../components/AppIcon';

const IncidentEscalationPanel = ({ workflows, onRefresh }) => {
  const escalationWorkflows = workflows?.filter(w => w?.workflowType === 'incident_escalation' || w?.workflowType === 'fraud_detection');

  const getSeverityColor = (priority) => {
    if (priority >= 8) return 'text-red-600 bg-red-100';
    if (priority >= 5) return 'text-yellow-600 bg-yellow-100';
    return 'text-blue-600 bg-blue-100';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Incident Escalation Protocols</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Automated response protocols triggered by Perplexity fraud analysis with severity-based routing and stakeholder notification cascades
        </p>
      </div>

      <div className="grid gap-4">
        {escalationWorkflows?.map(workflow => (
          <div key={workflow?.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <Icon name="AlertTriangle" size={20} className="text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{workflow?.workflowName}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Automated escalation for {workflow?.workflowType?.replace(/_/g, ' ')}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(workflow?.priority)}`}>
                Priority {workflow?.priority}/10
              </span>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3">
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Automated Actions:</div>
              <div className="space-y-2">
                {workflow?.automatedActions?.map((action, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Icon name="CheckCircle2" size={14} className="text-green-500" />
                    <span>{action?.action?.replace(/_/g, ' ')?.toUpperCase()}</span>
                    <span className="text-xs text-gray-500">(Priority: {action?.priority})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Total Escalations</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">{workflow?.executionCount || 0}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Success Rate</div>
                <div className="text-lg font-semibold text-green-600">
                  {workflow?.executionCount > 0 ? ((workflow?.successCount / workflow?.executionCount) * 100)?.toFixed(1) : 0}%
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Last Escalation</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {workflow?.lastExecutedAt ? new Date(workflow?.lastExecutedAt)?.toLocaleString() : 'Never'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncidentEscalationPanel;
