import React from 'react';
import Icon from '../../../components/AppIcon';

const OneClickExecutionPanel = ({ selectedIncident, consensus, executionStatus, onExecute }) => {
  if (!selectedIncident) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
        <Icon name="AlertCircle" size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Select an incident to enable execution</p>
      </div>
    );
  }

  const approvalThreshold = 75;
  const canExecute = consensus?.averageConfidence >= approvalThreshold;

  return (
    <div className="space-y-6">
      {/* Execution Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              executionStatus === 'executed' ?'bg-green-100 dark:bg-green-900/20'
                : executionStatus === 'executing' ?'bg-blue-100 dark:bg-blue-900/20' :'bg-gray-100 dark:bg-gray-700'
            }`}>
              <Icon
                name={executionStatus === 'executed' ? 'CheckCircle2' : executionStatus === 'executing' ? 'Loader' : 'Zap'}
                size={24}
                className={`${
                  executionStatus === 'executed' ?'text-green-600 dark:text-green-400'
                    : executionStatus === 'executing' ?'text-blue-600 dark:text-blue-400 animate-spin' :'text-gray-600 dark:text-gray-400'
                }`}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                1-Click Multi-Model Execution
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {executionStatus === 'executed' ?'Action executed successfully'
                  : executionStatus === 'executing' ?'Executing automated workflow...' :'Ready for instant execution'}
              </p>
            </div>
          </div>
          {consensus && (
            <button
              onClick={onExecute}
              disabled={!canExecute || executionStatus === 'executing' || executionStatus === 'executed'}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center gap-2 font-medium"
            >
              <Icon name="Zap" size={20} />
              Execute Now
            </button>
          )}
        </div>

        {/* Approval Threshold */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Approval Threshold</span>
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{approvalThreshold}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                consensus?.averageConfidence >= approvalThreshold
                  ? 'bg-green-600' :'bg-yellow-600'
              }`}
              style={{ width: `${Math.min(consensus?.averageConfidence || 0, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Current: {consensus?.averageConfidence || 0}%</span>
            <span className={`text-xs font-medium ${
              canExecute ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
            }`}>
              {canExecute ? 'Approved for Execution' : 'Below Threshold'}
            </span>
          </div>
        </div>

        {/* Execution Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Zap" size={16} className="text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Execution Mode</span>
            </div>
            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">Automated</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Clock" size={16} className="text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Estimated Time</span>
            </div>
            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">2-5 seconds</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Shield" size={16} className="text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Audit Logging</span>
            </div>
            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">Enabled</div>
          </div>
        </div>
      </div>
      {/* Automated Workflow Triggers */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="GitBranch" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Automated Workflow Triggers
          </h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <Icon name="CheckCircle2" size={20} className="text-green-600 dark:text-green-400" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Evidence Collection</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Automatic data gathering from all sources</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <Icon name="CheckCircle2" size={20} className="text-green-600 dark:text-green-400" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Policy Enforcement</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Apply platform policies automatically</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <Icon name="CheckCircle2" size={20} className="text-green-600 dark:text-green-400" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Stakeholder Notification</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Multi-channel alerts to relevant parties</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <Icon name="CheckCircle2" size={20} className="text-green-600 dark:text-green-400" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Audit Trail Creation</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Comprehensive logging for compliance</div>
            </div>
          </div>
        </div>
      </div>
      {/* Comprehensive Audit Logging */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="FileText" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Comprehensive Audit Logging
          </h3>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 font-mono text-xs">
          <div className="space-y-1 text-gray-700 dark:text-gray-300">
            <div>[{new Date()?.toISOString()}] Incident selected: {selectedIncident?.id}</div>
            <div>[{new Date()?.toISOString()}] AI analysis initiated across 3 models</div>
            {consensus && <div>[{new Date()?.toISOString()}] Consensus achieved: {consensus?.averageConfidence}%</div>}
            {executionStatus === 'executing' && <div>[{new Date()?.toISOString()}] Execution started...</div>}
            {executionStatus === 'executed' && <div>[{new Date()?.toISOString()}] Execution completed successfully</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneClickExecutionPanel;