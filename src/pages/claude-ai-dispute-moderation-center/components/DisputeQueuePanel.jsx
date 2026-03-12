import React from 'react';
import Icon from '../../../components/AppIcon';

function DisputeQueuePanel({ disputes, onAnalyze, selectedDispute }) {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      default: return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_analysis': return 'text-yellow-600 bg-yellow-100';
      case 'under_review': return 'text-blue-600 bg-blue-100';
      case 'escalated': return 'text-red-600 bg-red-100';
      case 'analyzed': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'payment_dispute': return 'Payment Dispute';
      case 'policy_violation': return 'Policy Violation';
      case 'compliance_conflict': return 'Compliance Conflict';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="List" size={24} className="text-purple-600" />
          Active Dispute Queue
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Pending cases with AI-generated summaries, severity classifications, and recommended actions
        </p>

        <div className="space-y-4">
          {disputes?.map(dispute => (
            <div
              key={dispute?.id}
              className={`border rounded-lg p-4 transition-all ${
                selectedDispute?.id === dispute?.id
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10' :'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                      {dispute?.id}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(dispute?.severity)}`}>
                      {dispute?.severity?.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(dispute?.status)}`}>
                      {dispute?.status?.replace('_', ' ')?.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {getTypeLabel(dispute?.type)}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    {dispute?.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Icon name="User" size={14} />
                      {dispute?.parties?.claimant}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Clock" size={14} />
                      {new Date(dispute.createdAt)?.toLocaleDateString()}
                    </span>
                    {dispute?.amount && (
                      <span className="flex items-center gap-1 font-semibold text-green-600">
                        <Icon name="DollarSign" size={14} />
                        ${dispute?.amount}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {dispute?.aiConfidence !== null && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">{dispute?.aiConfidence}%</div>
                      <div className="text-xs text-gray-500">AI Confidence</div>
                    </div>
                  )}
                  <button
                    onClick={() => onAnalyze(dispute)}
                    disabled={dispute?.status === 'analyzed'}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                  >
                    <Icon name="Brain" size={16} />
                    {dispute?.status === 'analyzed' ? 'Analyzed' : 'Analyze with Claude'}
                  </button>
                </div>
              </div>

              {dispute?.aiAnalysis && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <Icon name="FileText" size={18} className="text-purple-600" />
                    Claude AI Analysis
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {dispute?.aiAnalysis}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Recommended Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Zap" size={20} className="text-yellow-600" />
          Automated Resolution Recommendations
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="CheckCircle" size={20} className="text-green-600" />
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">Auto-Resolve Clear Cases</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Confidence ≥ 90%</div>
              </div>
            </div>
            <span className="text-2xl font-bold text-green-600">2</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="AlertTriangle" size={20} className="text-yellow-600" />
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">Human Review Required</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Confidence 60-89%</div>
              </div>
            </div>
            <span className="text-2xl font-bold text-yellow-600">1</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="AlertCircle" size={20} className="text-red-600" />
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">Escalate to Legal</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Complex scenarios</div>
              </div>
            </div>
            <span className="text-2xl font-bold text-red-600">0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DisputeQueuePanel;