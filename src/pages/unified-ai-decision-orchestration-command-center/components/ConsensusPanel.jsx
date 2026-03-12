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
      {/* Consensus Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              consensus?.hasConsensus
                ? 'bg-green-100 dark:bg-green-900/20' :'bg-yellow-100 dark:bg-yellow-900/20'
            }`}>
              <Icon
                name={consensus?.hasConsensus ? 'CheckCircle2' : 'AlertTriangle'}
                size={24}
                className={consensus?.hasConsensus ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {consensus?.hasConsensus ? 'AI Systems Agree' : 'Conflict Detected'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Average Confidence: {consensus?.averageConfidence}%
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{consensus?.averageConfidence}%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Consensus Score</div>
          </div>
        </div>

        {/* Individual Scores */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Brain" size={16} className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Claude</span>
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {consensus?.individualScores?.claude}%
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Zap" size={16} className="text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Perplexity</span>
            </div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {consensus?.individualScores?.perplexity}%
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Sparkles" size={16} className="text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">OpenAI</span>
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {consensus?.individualScores?.openai}%
            </div>
          </div>
        </div>

        {/* Unified Recommendation */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Unified Recommendation
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {consensus?.recommendation || 'No unified recommendation available'}
          </p>
        </div>
      </div>

      {/* Conflict Resolution */}
      {consensus?.conflictAreas?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="AlertTriangle" size={24} className="text-yellow-600 dark:text-yellow-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Conflict Resolution Workflow
            </h3>
          </div>
          <div className="space-y-3">
            {consensus?.conflictAreas?.map((conflict, index) => (
              <div key={index} className="bg-yellow-50 dark:bg-yellow-900/10 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-yellow-200 dark:bg-yellow-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-yellow-800 dark:text-yellow-200">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{conflict}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weighted Scoring Algorithm */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="BarChart3" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Weighted Scoring Algorithm
          </h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Claude Weight</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '33%' }} />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">33%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Perplexity Weight</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '33%' }} />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">33%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">OpenAI Weight</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '34%' }} />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">34%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsensusPanel;