import React, { useState } from 'react';
import { Zap, CheckCircle, AlertTriangle, Shield, Lock, Bell, UserX } from 'lucide-react';

const RESPONSE_WORKFLOWS = [
  { id: 'freeze_accounts', label: 'Freeze Suspicious Accounts', icon: UserX, color: 'bg-red-600', description: 'Immediately freeze accounts with threat score > 80', minScore: 80 },
  { id: 'block_transactions', label: 'Block Transactions', icon: Lock, color: 'bg-orange-600', description: 'Block all transactions from flagged IPs', minScore: 60 },
  { id: 'notify_stakeholders', label: 'Notify Stakeholders', icon: Bell, color: 'bg-blue-600', description: 'Send SMS + email alerts to security team', minScore: 40 },
  { id: 'enable_enhanced_auth', label: 'Enable Enhanced Auth', icon: Shield, color: 'bg-purple-600', description: 'Require MFA for all new sessions', minScore: 50 },
];

const AutomatedResponseCenter = ({ threatScore, incidents }) => {
  const [executionLog, setExecutionLog] = useState([]);
  const [executing, setExecuting] = useState({});

  const executeWorkflow = async (workflow) => {
    setExecuting(p => ({ ...p, [workflow?.id]: true }));
    // Simulate workflow execution
    await new Promise(r => setTimeout(r, 1500));
    const logEntry = {
      id: Date.now(),
      workflow: workflow?.label,
      status: 'success',
      timestamp: new Date()?.toLocaleTimeString(),
      threatScore,
      affectedCount: Math.floor(Math.random() * 50) + 1,
    };
    setExecutionLog(prev => [logEntry, ...prev?.slice(0, 9)]);
    setExecuting(p => ({ ...p, [workflow?.id]: false }));
  };

  const availableWorkflows = RESPONSE_WORKFLOWS?.filter(w => threatScore >= w?.minScore);
  const lockedWorkflows = RESPONSE_WORKFLOWS?.filter(w => threatScore < w?.minScore);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Automated Response Center</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">One-click mitigation triggers — Current threat score: <strong>{threatScore}/100</strong></p>
      </div>
      {/* Available Workflows */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <CheckCircle size={14} className="text-green-500" />Available Responses ({availableWorkflows?.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableWorkflows?.map(workflow => (
            <div key={workflow?.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 ${workflow?.color} rounded-lg`}><workflow.icon size={14} className="text-white" /></div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">{workflow?.label}</div>
                    <div className="text-xs text-gray-500">{workflow?.description}</div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => executeWorkflow(workflow)}
                disabled={executing?.[workflow?.id]}
                className={`w-full flex items-center justify-center gap-2 py-2 ${workflow?.color} text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all`}
              >
                <Zap size={13} />{executing?.[workflow?.id] ? 'Executing...' : 'Execute Now'}
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Locked Workflows */}
      {lockedWorkflows?.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
            <AlertTriangle size={14} className="text-gray-400" />Locked (threat score too low)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {lockedWorkflows?.map(workflow => (
              <div key={workflow?.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-4 opacity-60">
                <div className="flex items-center gap-2 mb-1">
                  <workflow.icon size={14} className="text-gray-400" />
                  <span className="font-medium text-gray-600 dark:text-gray-400 text-sm">{workflow?.label}</span>
                </div>
                <div className="text-xs text-gray-400">Requires threat score ≥ {workflow?.minScore}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Execution Log */}
      {executionLog?.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Execution Log</h3>
          <div className="space-y-2">
            {executionLog?.map(log => (
              <div key={log?.id} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{log?.workflow}</span>
                  <span className="text-xs text-gray-500 ml-2">• {log?.affectedCount} entities affected</span>
                </div>
                <span className="text-xs text-gray-400">{log?.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomatedResponseCenter;
