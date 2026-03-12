import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { unifiedIncidentResponseService } from '../../../services/unifiedIncidentResponseService';


const OneClickResolutionPanel = ({ selectedIncident, onRefresh }) => {
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);

  const executeResolution = async (workflow) => {
    if (!selectedIncident) return;

    setExecuting(true);
    try {
      const { data, error } = await unifiedIncidentResponseService?.executeResolutionWorkflow(
        selectedIncident?.id,
        workflow
      );
      if (error) throw error;
      setExecutionResult(data);
      onRefresh?.();
    } catch (error) {
      console.error('Error executing resolution:', error);
    } finally {
      setExecuting(false);
    }
  };

  const workflows = [
    {
      id: 'auto_block',
      name: 'Auto-Block & Quarantine',
      description: 'Automatically block suspicious accounts and quarantine affected transactions',
      icon: 'Shield',
      color: 'red',
      actions: ['Block user accounts', 'Freeze transactions', 'Notify security team', 'Generate audit log']
    },
    {
      id: 'system_recovery',
      name: 'System Recovery',
      description: 'Restart affected services and restore from last known good state',
      icon: 'RefreshCw',
      color: 'blue',
      actions: ['Restart services', 'Clear cache', 'Restore backup', 'Verify integrity']
    },
    {
      id: 'revenue_reconciliation',
      name: 'Revenue Reconciliation',
      description: 'Reconcile transactions and adjust revenue reporting',
      icon: 'DollarSign',
      color: 'green',
      actions: ['Reconcile transactions', 'Adjust reports', 'Notify finance', 'Update dashboards']
    },
    {
      id: 'escalate',
      name: 'Escalate to Team',
      description: 'Escalate incident to on-call team with full context',
      icon: 'AlertTriangle',
      color: 'orange',
      actions: ['Notify on-call', 'Create ticket', 'Send SMS alerts', 'Schedule war room']
    }
  ];

  if (!selectedIncident) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
        <Icon name="MousePointer" size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Select an incident to view resolution workflows</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selected Incident */}
      <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 dark:from-primary/20 dark:to-blue-500/20 rounded-xl p-6 border border-primary/20">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {selectedIncident?.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {selectedIncident?.description}
        </p>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-2">
            <Icon name="AlertTriangle" size={16} />
            Severity: <span className="font-semibold">{selectedIncident?.severity}</span>
          </span>
          <span className="flex items-center gap-2">
            <Icon name="Clock" size={16} />
            {new Date(selectedIncident?.detectedAt)?.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Resolution Workflows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workflows?.map((workflow) => (
          <div
            key={workflow?.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-primary transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-${workflow?.color}-50 dark:bg-${workflow?.color}-900/20 flex items-center justify-center`}>
                <Icon name={workflow?.icon} size={24} className={`text-${workflow?.color}-600 dark:text-${workflow?.color}-400`} />
              </div>
              <button
                onClick={() => executeResolution(workflow)}
                disabled={executing}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-400 transition-colors flex items-center gap-2"
              >
                <Icon name="Zap" size={16} />
                Execute
              </button>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {workflow?.name}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {workflow?.description}
            </p>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Actions:</p>
              {workflow?.actions?.map((action, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <Icon name="Check" size={12} className="text-green-500" />
                  {action}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Execution Result */}
      {executionResult && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="CheckCircle" size={24} className="text-green-600 dark:text-green-400" />
            <h4 className="text-lg font-semibold text-green-900 dark:text-green-300">
              Resolution Executed Successfully
            </h4>
          </div>
          <div className="space-y-2">
            {executionResult?.actions?.map((action, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-green-800 dark:text-green-400">
                <Icon name="Check" size={16} />
                {action}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
            <p className="text-sm text-green-800 dark:text-green-400">
              Audit Log ID: <span className="font-mono font-semibold">{executionResult?.auditLogId}</span>
            </p>
          </div>
        </div>
      )}

      {/* Audit Trail */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="FileText" size={20} />
          Comprehensive Audit Logging
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">All actions logged with timestamps</span>
            <Icon name="Check" size={16} className="text-green-500" />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">User attribution tracked</span>
            <Icon name="Check" size={16} className="text-green-500" />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Compliance-ready reporting</span>
            <Icon name="Check" size={16} className="text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneClickResolutionPanel;