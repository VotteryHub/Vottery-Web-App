import React from 'react';
import Icon from '../../../components/AppIcon';

const AutomatedResponsePanel = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Zap" size={20} />
          Automated Incident Response Workflows
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Execute automated response actions triggered by orchestration workflows with ML-powered decision confidence
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: 'Fraud Detection Response',
              trigger: 'High confidence fraud pattern',
              actions: ['Freeze account', 'Block transactions', 'Notify security team', 'Generate evidence report'],
              confidence: 94,
              status: 'active',
            },
            {
              name: 'Compliance Violation Alert',
              trigger: 'Policy violation detected',
              actions: ['Flag content', 'Notify compliance team', 'Initiate review workflow', 'Log incident'],
              confidence: 87,
              status: 'active',
            },
            {
              name: 'Payment Dispute Escalation',
              trigger: 'Dispute threshold exceeded',
              actions: ['Escalate to finance', 'Hold payment', 'Request documentation', 'Notify stakeholders'],
              confidence: 76,
              status: 'pending',
            },
            {
              name: 'Security Threat Mitigation',
              trigger: 'Critical threat identified',
              actions: ['Rate limit enforcement', 'IP blocking', 'Alert security team', 'Activate DDoS protection'],
              confidence: 91,
              status: 'active',
            },
          ]?.map((workflow, idx) => (
            <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">{workflow?.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  workflow?.status === 'active' ?'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                }`}>
                  {workflow?.status?.toUpperCase()}
                </span>
              </div>

              <div className="mb-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Trigger Condition</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">{workflow?.trigger}</div>
              </div>

              <div className="mb-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Automated Actions</div>
                <div className="space-y-1">
                  {workflow?.actions?.map((action, actionIdx) => (
                    <div key={actionIdx} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                      <Icon name="ArrowRight" size={12} className="text-gray-400" />
                      {action}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">ML Confidence</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${workflow?.confidence}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-primary">{workflow?.confidence}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Execution History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="History" size={20} />
          Recent Automated Executions
        </h3>
        <div className="space-y-3">
          {[
            { workflow: 'Fraud Detection Response', time: '2 minutes ago', result: 'success', actions: 4 },
            { workflow: 'Security Threat Mitigation', time: '15 minutes ago', result: 'success', actions: 3 },
            { workflow: 'Compliance Violation Alert', time: '1 hour ago', result: 'success', actions: 4 },
          ]?.map((execution, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Icon
                  name={execution?.result === 'success' ? 'CheckCircle' : 'XCircle'}
                  size={20}
                  className={execution?.result === 'success' ? 'text-green-600' : 'text-red-600'}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{execution?.workflow}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{execution?.time} • {execution?.actions} actions executed</p>
                </div>
              </div>
              <Icon name="ExternalLink" size={16} className="text-gray-400 cursor-pointer hover:text-primary" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutomatedResponsePanel;