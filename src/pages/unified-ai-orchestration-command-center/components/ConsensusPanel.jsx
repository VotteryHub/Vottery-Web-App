import React from 'react';
import Icon from '../../../components/AppIcon';

const ConsensusPanel = ({ consensus, aiAnalyses }) => {
  if (!consensus) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
        <Icon name="AlertCircle" size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Run AI analysis to see consensus results</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Consensus Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Icon name={consensus?.hasConsensus ? 'CheckCircle2' : 'AlertTriangle'} size={24} />
            Multi-AI Consensus
          </h3>
          <div className={`px-4 py-2 rounded-lg font-semibold ${
            consensus?.hasConsensus
              ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
          }`}>
            {consensus?.hasConsensus ? 'Consensus Reached' : 'Conflict Detected'}
          </div>
        </div>

        {/* Average Confidence */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Average Confidence</span>
            <span className="text-2xl font-bold text-primary">{consensus?.averageConfidence}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-500"
              style={{ width: `${consensus?.averageConfidence}%` }}
            />
          </div>
        </div>

        {/* Individual Scores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Brain" size={18} className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">Claude</span>
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {consensus?.individualScores?.claude}%
            </div>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Zap" size={18} className="text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-semibold text-purple-900 dark:text-purple-300">Perplexity</span>
            </div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {consensus?.individualScores?.perplexity}%
            </div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Sparkles" size={18} className="text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-green-900 dark:text-green-300">OpenAI</span>
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {consensus?.individualScores?.openai}%
            </div>
          </div>
        </div>
      </div>

      {/* Unified Recommendation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Target" size={20} />
          Unified Recommendation
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Recommended Action</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                consensus?.recommendation?.priority === 'high' ?'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' :'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
              }`}>
                {consensus?.recommendation?.priority?.toUpperCase()}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{consensus?.recommendation?.action}</p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 block mb-2">Reasoning</span>
            <p className="text-sm text-gray-700 dark:text-gray-300">{consensus?.recommendation?.reasoning}</p>
          </div>

          <div className="flex items-center gap-2">
            <Icon name={consensus?.recommendation?.approvalRequired ? 'Lock' : 'Unlock'} size={18} className="text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {consensus?.recommendation?.approvalRequired ? 'Manual approval required' : 'Auto-approval enabled'}
            </span>
          </div>
        </div>
      </div>

      {/* Conflict Areas */}
      {consensus?.conflictAreas?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Icon name="AlertTriangle" size={20} className="text-yellow-600" />
            Conflict Resolution Required
          </h3>
          <div className="space-y-3">
            {consensus?.conflictAreas?.map((conflict, idx) => (
              <div key={idx} className="p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">{conflict}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsensusPanel;