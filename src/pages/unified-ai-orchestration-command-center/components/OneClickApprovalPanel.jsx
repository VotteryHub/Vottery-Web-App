import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { aiOrchestrationService } from '../../../services/aiOrchestrationService';
import { useAuth } from '../../../contexts/AuthContext';

const OneClickApprovalPanel = ({ selectedIncident, consensus, aiAnalyses }) => {
  const { userProfile } = useAuth();
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);

  const handleOneClickApproval = async () => {
    if (!selectedIncident || !consensus) return;

    setExecuting(true);
    try {
      const { data, error } = await aiOrchestrationService?.executeOneClickApproval({
        incidentId: selectedIncident?.id,
        action: consensus?.recommendation?.action,
        aiRecommendations: consensus,
        userId: userProfile?.id,
      });

      if (error) throw error;
      setExecutionResult({ success: true, data });
    } catch (error) {
      setExecutionResult({ success: false, error: error?.message });
    } finally {
      setExecuting(false);
    }
  };

  if (!selectedIncident) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
        <Icon name="AlertCircle" size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Select an incident to enable 1-click approval</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Approval Threshold */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Settings" size={20} />
          Approval Configuration
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Auto-Approval Threshold
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="50"
                max="100"
                defaultValue="80"
                className="flex-1"
              />
              <span className="text-lg font-bold text-primary">80%</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Actions with confidence above this threshold will be auto-approved
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Confidence</div>
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {consensus?.averageConfidence || 0}%
              </div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Approval Status</div>
              <div className={`text-sm font-semibold ${
                (consensus?.averageConfidence || 0) >= 80
                  ? 'text-green-600 dark:text-green-400' :'text-yellow-600 dark:text-yellow-400'
              }`}>
                {(consensus?.averageConfidence || 0) >= 80 ? 'Auto-Approved' : 'Manual Review'}
              </div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">AI Consensus</div>
              <div className={`text-sm font-semibold ${
                consensus?.hasConsensus
                  ? 'text-green-600 dark:text-green-400' :'text-red-600 dark:text-red-400'
              }`}>
                {consensus?.hasConsensus ? 'Reached' : 'Conflict'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1-Click Approval Action */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-lg p-6 border-2 border-primary/30">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Icon name="Zap" size={24} className="text-primary" />
              1-Click Approval
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Execute AI-recommended actions instantly
            </p>
          </div>
          <button
            onClick={handleOneClickApproval}
            disabled={executing || !consensus}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-400 transition-all duration-200 flex items-center gap-2 font-semibold text-lg shadow-lg hover:shadow-xl"
          >
            {executing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Executing...
              </>
            ) : (
              <>
                <Icon name="CheckCircle" size={20} />
                Approve & Execute
              </>
            )}
          </button>
        </div>

        {consensus && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Action Preview</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Action:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{consensus?.recommendation?.action}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Priority:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  consensus?.recommendation?.priority === 'high' ?'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' :'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                }`}>
                  {consensus?.recommendation?.priority?.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Confidence:</span>
                <span className="font-bold text-primary">{consensus?.averageConfidence}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Execution Result */}
      {executionResult && (
        <div className={`rounded-lg p-6 border-2 ${
          executionResult?.success
            ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' :'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <Icon
              name={executionResult?.success ? 'CheckCircle' : 'XCircle'}
              size={24}
              className={executionResult?.success ? 'text-green-600' : 'text-red-600'}
            />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {executionResult?.success ? 'Execution Successful' : 'Execution Failed'}
            </h4>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {executionResult?.success
              ? 'Automated workflow has been triggered and is now executing.'
              : `Error: ${executionResult?.error}`}
          </p>
          {executionResult?.success && executionResult?.data && (
            <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Workflow ID</div>
              <div className="font-mono text-sm text-gray-900 dark:text-gray-100">{executionResult?.data?.id}</div>
            </div>
          )}
        </div>
      )}

      {/* Audit Log */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="FileText" size={20} />
          Comprehensive Audit Trail
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Icon name="Check" size={16} className="text-green-600" />
            <span>All approval actions are logged with timestamps</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Icon name="Check" size={16} className="text-green-600" />
            <span>AI confidence scores and reasoning chains preserved</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Icon name="Check" size={16} className="text-green-600" />
            <span>User identity and approval context tracked</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneClickApprovalPanel;