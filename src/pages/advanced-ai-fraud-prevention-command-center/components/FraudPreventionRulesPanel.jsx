import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Zap, CheckCircle, XCircle, RefreshCw, Clock, TrendingUp } from 'lucide-react';
import fraudPreventionRulesService from '../../../services/fraudPreventionRulesService';

const SEVERITY_COLORS = {
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

const TYPE_LABELS = {
  rate_limiting: 'Rate Limiting',
  ip_blocking: 'IP Blocking',
  auth_requirement: 'Auth Requirement',
  transaction_blocking: 'Transaction Blocking',
};

const FraudPreventionRulesPanel = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [rejectReason, setRejectReason] = useState({});
  const [showRejectInput, setShowRejectInput] = useState({});
  const [tab, setTab] = useState('pending');

  const loadRules = useCallback(async () => {
    setLoading(true);
    const { data } = await fraudPreventionRulesService?.getAllRules();
    setRules(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadRules(); }, [loadRules]);

  const handleGenerate = async () => {
    setGenerating(true);
    await fraudPreventionRulesService?.generateAndStorePendingRules();
    setGenerating(false);
    loadRules();
  };

  const handleApprove = async (ruleId) => {
    setActionLoading(p => ({ ...p, [ruleId]: 'approving' }));
    await fraudPreventionRulesService?.approveRule(ruleId);
    setActionLoading(p => ({ ...p, [ruleId]: null }));
    loadRules();
  };

  const handleReject = async (ruleId) => {
    setActionLoading(p => ({ ...p, [ruleId]: 'rejecting' }));
    await fraudPreventionRulesService?.rejectRule(ruleId, rejectReason?.[ruleId] || 'Rejected by admin');
    setActionLoading(p => ({ ...p, [ruleId]: null }));
    setShowRejectInput(p => ({ ...p, [ruleId]: false }));
    loadRules();
  };

  const filteredRules = rules?.filter(r => r?.status === tab);
  const pendingCount = rules?.filter(r => r?.status === 'pending_approval')?.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Automated Prevention Rules Engine</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Claude AI-generated rules from attack pattern analysis</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 transition-all"
        >
          {generating ? <><RefreshCw size={16} className="animate-spin" />Analyzing Patterns...</> : <><Zap size={16} />Generate Rules with Claude</>}
        </button>
      </div>
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {[{ id: 'pending_approval', label: `Pending Approval${pendingCount > 0 ? ` (${pendingCount})` : ''}` }, { id: 'approved', label: 'Approved' }, { id: 'rejected', label: 'Rejected' }]?.map(t => (
          <button
            key={t?.id}
            onClick={() => setTab(t?.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t?.id ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {t?.label}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-12"><RefreshCw size={24} className="animate-spin text-gray-400" /></div>
      ) : filteredRules?.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <Shield size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 dark:text-gray-400">No {tab?.replace('_', ' ')} rules. Click "Generate Rules with Claude" to analyze attack patterns.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRules?.map(rule => (
            <div key={rule?.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Shield size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{rule?.rule_name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${SEVERITY_COLORS?.[rule?.severity] || SEVERITY_COLORS?.medium}`}>{rule?.severity}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{TYPE_LABELS?.[rule?.rule_type] || rule?.rule_type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {rule?.status === 'pending_approval' && (
                    <span className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400"><Clock size={12} />Pending</span>
                  )}
                  {rule?.status === 'approved' && (
                    <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400"><CheckCircle size={12} />Approved</span>
                  )}
                  {rule?.status === 'rejected' && (
                    <span className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400"><XCircle size={12} />Rejected</span>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{rule?.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Condition</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{rule?.condition_expression}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Action</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{rule?.action}</div>
                </div>
              </div>

              {/* Effectiveness Preview */}
              {rule?.estimated_effectiveness && (
                <div className="flex items-center gap-3 mb-3 bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                  <TrendingUp size={14} className="text-green-600" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Estimated effectiveness:</span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${rule?.estimated_effectiveness}%` }} />
                  </div>
                  <span className="text-xs font-bold text-green-600">{rule?.estimated_effectiveness}%</span>
                </div>
              )}

              {rule?.rationale && (
                <p className="text-xs text-gray-500 dark:text-gray-400 italic mb-3">{rule?.rationale}</p>
              )}

              {/* Approve/Reject Actions */}
              {rule?.status === 'pending_approval' && (
                <div className="space-y-2">
                  {showRejectInput?.[rule?.id] && (
                    <div className="flex gap-2">
                      <input
                        value={rejectReason?.[rule?.id] || ''}
                        onChange={e => setRejectReason(p => ({ ...p, [rule?.id]: e?.target?.value }))}
                        placeholder="Rejection reason..."
                        className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground text-xs focus:outline-none"
                      />
                      <button onClick={() => handleReject(rule?.id)} disabled={actionLoading?.[rule?.id] === 'rejecting'} className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 disabled:opacity-50">
                        {actionLoading?.[rule?.id] === 'rejecting' ? 'Rejecting...' : 'Confirm Reject'}
                      </button>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(rule?.id)}
                      disabled={!!actionLoading?.[rule?.id]}
                      className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                    >
                      <CheckCircle size={14} />{actionLoading?.[rule?.id] === 'approving' ? 'Approving...' : 'Approve & Apply'}
                    </button>
                    <button
                      onClick={() => setShowRejectInput(p => ({ ...p, [rule?.id]: !p?.[rule?.id] }))}
                      className="flex items-center gap-1.5 px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <XCircle size={14} />Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FraudPreventionRulesPanel;
