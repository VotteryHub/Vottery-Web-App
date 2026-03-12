import React from 'react';
import Icon from '../../../components/AppIcon';

const DecisionMatrixPanel = ({ selectedIncident }) => {
  if (!selectedIncident) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
        <Icon name="AlertCircle" size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Select an incident to view decision matrix</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Decision Matrix */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="GitBranch" size={20} />
          AI Decision Matrix
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Zap" size={16} className="text-purple-600 dark:text-purple-400" />
              <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-300">
                Perplexity Recommendation
              </h4>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Immediate account suspension and transaction freeze based on threat pattern analysis
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Confidence:</span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }} />
              </div>
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">85%</span>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Scale" size={16} className="text-blue-600 dark:text-blue-400" />
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                Claude Recommendation
              </h4>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Temporary hold with manual review required for compliance and fairness assessment
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Confidence:</span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '88%' }} />
              </div>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">88%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reasoning Chains */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="List" size={20} />
          Reasoning Chains
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Perplexity Reasoning
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>Detected coordinated attack pattern across multiple accounts</li>
              <li>Transaction velocity exceeds normal thresholds by 400%</li>
              <li>IP addresses match known fraud network</li>
              <li>Behavioral patterns consistent with account takeover</li>
            </ol>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Claude Reasoning
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>Policy violation severity warrants immediate action</li>
              <li>Compliance requirements mandate manual review for amounts over threshold</li>
              <li>Precedent cases suggest temporary hold is appropriate</li>
              <li>Fairness assessment indicates no bias in decision</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Manual Override */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Shield" size={20} />
          Manual Override Controls
        </h3>
        <div className="space-y-3">
          <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
            <Icon name="CheckCircle" size={18} />
            Approve AI Recommendations
          </button>
          <button className="w-full px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2">
            <Icon name="Edit" size={18} />
            Modify Response Actions
          </button>
          <button className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
            <Icon name="XCircle" size={18} />
            Override and Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default DecisionMatrixPanel;