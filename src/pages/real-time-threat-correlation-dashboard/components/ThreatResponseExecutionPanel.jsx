import React, { useState } from 'react';
import { Lock, Ban, Shield, AlertTriangle, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp, User, Zap } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const AUTOMATED_ACTIONS = [
  {
    id: 'freeze_account',
    label: 'Freeze Suspicious Account',
    description: 'Immediately suspend account access for flagged user',
    icon: Lock,
    color: 'bg-red-600 hover:bg-red-700',
    badgeColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    severity: 'critical',
    requiresApproval: true,
    approvalRole: 'admin',
  },
  {
    id: 'block_transactions',
    label: 'Block Transactions',
    description: 'Halt all financial transactions from flagged accounts',
    icon: Ban,
    color: 'bg-orange-600 hover:bg-orange-700',
    badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    severity: 'high',
    requiresApproval: true,
    approvalRole: 'admin',
  },
  {
    id: 'deploy_fraud_rule',
    label: 'Deploy Fraud Rule',
    description: 'Activate new fraud detection rule across all endpoints',
    icon: Shield,
    color: 'bg-yellow-600 hover:bg-yellow-700',
    badgeColor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    severity: 'high',
    requiresApproval: true,
    approvalRole: 'super_admin',
  },
  {
    id: 'rate_limit_ip',
    label: 'Rate Limit IP Range',
    description: 'Apply strict rate limiting to suspicious IP ranges',
    icon: AlertTriangle,
    color: 'bg-blue-600 hover:bg-blue-700',
    badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    severity: 'medium',
    requiresApproval: false,
    approvalRole: null,
  },
];

const ApprovalModal = ({ action, onApprove, onReject, onClose }) => {
  const [notes, setNotes] = useState('');
  const [approving, setApproving] = useState(false);
  const ActionIcon = action?.icon;

  const handleApprove = async () => {
    setApproving(true);
    await new Promise(r => setTimeout(r, 1000));
    onApprove(action?.id, notes);
    setApproving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Admin Approval Required</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Role: {action?.approvalRole}</p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            {ActionIcon && <ActionIcon size={16} className="text-gray-600 dark:text-gray-400" />}
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{action?.label}</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">{action?.description}</p>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Approval Notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e?.target?.value)}
            placeholder="Add justification for this action..."
            rows={3}
            className="w-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-red-500 resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => { onReject(action?.id); onClose(); }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <XCircle size={15} /> Reject
          </button>
          <button
            onClick={handleApprove}
            disabled={approving}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {approving ? <><Clock size={15} className="animate-spin" /> Approving...</> : <><CheckCircle size={15} /> Approve & Execute</>}
          </button>
        </div>
      </div>
    </div>
  );
};

const ThreatResponseExecutionPanel = ({ threatScore }) => {
  const [pendingApproval, setPendingApproval] = useState(null);
  const [actionStates, setActionStates] = useState({});
  const [auditLog, setAuditLog] = useState([]);
  const [showLog, setShowLog] = useState(false);

  const handleTrigger = (action) => {
    if (action?.requiresApproval) {
      setPendingApproval(action);
    } else {
      executeAction(action?.id, 'auto', '');
    }
  };

  const executeAction = async (actionId, approvedBy, notes) => {
    setActionStates(prev => ({ ...prev, [actionId]: 'executing' }));
    await new Promise(r => setTimeout(r, 1500));

    const logEntry = {
      id: Date.now(),
      actionId,
      action: AUTOMATED_ACTIONS?.find(a => a?.id === actionId)?.label,
      approvedBy,
      notes,
      timestamp: new Date()?.toISOString(),
      status: 'executed',
    };

    // Persist to Supabase
    try {
      await supabase?.from('admin_logs')?.insert({
        action_type: 'threat_response_execution',
        action_details: logEntry,
        created_at: new Date()?.toISOString(),
      });
    } catch (_) {}

    setAuditLog(prev => [logEntry, ...prev]);
    setActionStates(prev => ({ ...prev, [actionId]: 'executed' }));
  };

  const handleApprove = (actionId, notes) => {
    setPendingApproval(null);
    executeAction(actionId, 'admin', notes);
  };

  const handleReject = (actionId) => {
    setActionStates(prev => ({ ...prev, [actionId]: 'rejected' }));
    setAuditLog(prev => [{
      id: Date.now(),
      actionId,
      action: AUTOMATED_ACTIONS?.find(a => a?.id === actionId)?.label,
      approvedBy: 'admin',
      notes: 'Rejected by admin',
      timestamp: new Date()?.toISOString(),
      status: 'rejected',
    }, ...prev]);
  };

  const resetAction = (actionId) => {
    setActionStates(prev => { const n = { ...prev }; delete n?.[actionId]; return n; });
  };

  return (
    <>
      {pendingApproval && (
        <ApprovalModal
          action={pendingApproval}
          onApprove={handleApprove}
          onReject={handleReject}
          onClose={() => setPendingApproval(null)}
        />
      )}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <Zap size={20} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Automated Threat Response</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Execute actions with admin approval workflow</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
            threatScore >= 70 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
            threatScore >= 40 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          }`}>
            Threat: {threatScore || 0}/100
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {AUTOMATED_ACTIONS?.map(action => {
            const ActionIcon = action?.icon;
            const state = actionStates?.[action?.id];
            const isExecuting = state === 'executing';
            const isExecuted = state === 'executed';
            const isRejected = state === 'rejected';

            return (
              <div key={action?.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <ActionIcon size={18} className="text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{action?.label}</p>
                      {action?.requiresApproval && (
                        <span className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400">
                          <User size={9} /> Approval
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{action?.description}</p>
                    {isExecuted && (
                      <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                        <CheckCircle size={10} /> Executed successfully
                      </p>
                    )}
                    {isRejected && (
                      <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
                        <XCircle size={10} /> Rejected by admin
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(isExecuted || isRejected) && (
                    <button onClick={() => resetAction(action?.id)} className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                      <Clock size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => handleTrigger(action)}
                    disabled={isExecuting || isExecuted}
                    className={`flex items-center gap-1.5 px-3 py-2 text-white rounded-lg text-xs font-medium transition-all disabled:opacity-50 ${
                      isExecuted ? 'bg-green-600' : isRejected ? 'bg-gray-400' : action?.color
                    }`}
                  >
                    {isExecuting ? <><Clock size={12} className="animate-spin" /> Executing...</> :
                     isExecuted ? <><CheckCircle size={12} /> Done</> :
                     isRejected ? <><XCircle size={12} /> Rejected</> :
                     <><Zap size={12} /> {action?.requiresApproval ? 'Request' : 'Execute'}</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Audit Log */}
        {auditLog?.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <button
              onClick={() => setShowLog(!showLog)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {showLog ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              Execution Audit Log ({auditLog?.length})
            </button>
            {showLog && (
              <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                {auditLog?.map(entry => (
                  <div key={entry?.id} className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-xs">
                    <div className="flex items-center gap-2">
                      {entry?.status === 'executed' ? <CheckCircle size={12} className="text-green-500" /> : <XCircle size={12} className="text-red-500" />}
                      <span className="font-medium text-gray-900 dark:text-white">{entry?.action}</span>
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {new Date(entry.timestamp)?.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ThreatResponseExecutionPanel;
