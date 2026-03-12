import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MultiAIConsensusPanel = ({ data }) => {
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Agreements */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
          <Icon name="GitMerge" className="w-5 h-5 text-green-600" />
          AI Consensus - Agreed Recommendations
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          When both Claude and Perplexity agree, confidence is highest. These are your priority actions.
        </p>
        <div className="space-y-4">
          {data?.agreements?.map((agreement, index) => (
            <div key={index} className="border-2 border-green-200 dark:border-green-800 rounded-lg p-4 bg-green-50/50 dark:bg-green-900/10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(agreement?.priority)}`}>
                      {agreement?.priority?.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                      {(agreement?.confidence * 100)?.toFixed(0)}% Confidence
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{agreement?.topic}</h3>
                </div>
                <Icon name="CheckCircle2" className="w-6 h-6 text-green-600 flex-shrink-0" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Brain" className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-semibold text-purple-900 dark:text-purple-100">Claude's Position</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{agreement?.claudePosition}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="TrendingUp" className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-900 dark:text-blue-100">Perplexity's Position</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{agreement?.perplexityPosition}</p>
                </div>
              </div>

              <div className="bg-green-100 dark:bg-green-900/20 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
                  <Icon name="Target" className="w-4 h-4" />
                  Consensus Action
                </h4>
                <p className="text-sm text-green-800 dark:text-green-200 mb-3">{agreement?.consensusAction}</p>
                <div className="flex items-center gap-2">
                  <Button size="sm" className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                    <Icon name="Play" className="w-4 h-4" />
                    Execute Now
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Icon name="Calendar" className="w-4 h-4" />
                    Schedule
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Disagreements */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
          <Icon name="GitBranch" className="w-5 h-5 text-orange-600" />
          AI Disagreements - Requires Review
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          When AI systems disagree, human judgment is valuable. Review these carefully.
        </p>
        <div className="space-y-4">
          {data?.disagreements?.map((disagreement, index) => (
            <div key={index} className="border-2 border-orange-200 dark:border-orange-800 rounded-lg p-4 bg-orange-50/50 dark:bg-orange-900/10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                      {(disagreement?.confidence * 100)?.toFixed(0)}% Resolution Confidence
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{disagreement?.topic}</h3>
                </div>
                <Icon name="AlertCircle" className="w-6 h-6 text-orange-600 flex-shrink-0" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Brain" className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-semibold text-purple-900 dark:text-purple-100">Claude's View</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{disagreement?.claudePosition}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="TrendingUp" className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-900 dark:text-blue-100">Perplexity's View</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{disagreement?.perplexityPosition}</p>
                </div>
              </div>

              <div className="bg-orange-100 dark:bg-orange-900/20 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-orange-900 dark:text-orange-100 mb-2 flex items-center gap-2">
                  <Icon name="Scale" className="w-4 h-4" />
                  Proposed Resolution
                </h4>
                <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">{disagreement?.resolution}</p>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <Icon name="ThumbsUp" className="w-4 h-4" />
                    Approve Resolution
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <Icon name="MessageSquare" className="w-4 h-4" />
                    Request More Analysis
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weighted Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
          <Icon name="BarChart3" className="w-5 h-5 text-indigo-600" />
          Weighted Decision Matrix
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Combined AI recommendations ranked by confidence, impact, and urgency.
        </p>
        <div className="space-y-3">
          {data?.weightedRecommendations?.map((rec, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 flex-1">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center text-sm font-bold">
                    #{index + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{rec?.action}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Timeframe: {rec?.timeframe}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Weight</p>
                    <p className="text-lg font-bold text-indigo-600">{(rec?.weight * 100)?.toFixed(0)}%</p>
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${rec?.weight * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultiAIConsensusPanel;