import React from 'react';
import Icon from '../../../components/AppIcon';

const RecommendationTransparencyPanel = ({ feedRankings }) => {
  const getReasoningForRanking = (ranking) => {
    const reasons = [];
    const score = ranking?.rankingScore || 0;

    if (score > 0.7) {
      reasons?.push('High semantic similarity to your interests');
    }
    if (score > 0.6) {
      reasons?.push('Matches your engagement patterns');
    }
    if (score > 0.5) {
      reasons?.push('Fresh content in your preferred topics');
    }
    if (reasons?.length === 0) {
      reasons?.push('Exploratory recommendation for diversity');
    }

    return reasons;
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-cyan-200 dark:border-cyan-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
          <Icon name="Eye" size={20} />
          Recommendation Transparency Tools
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Understand why content is recommended with detailed reasoning and preference adjustment controls
        </p>
      </div>

      {/* Ranking Explanations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Info" size={20} />
          Why These Recommendations?
        </h3>
        <div className="space-y-4">
          {feedRankings?.slice(0, 5)?.map((ranking, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      #{ranking?.rankingPosition}
                    </span>
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-full">
                      {ranking?.contentItemType}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Score: {(ranking?.rankingScore * 100)?.toFixed(1)}%
                  </div>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                  <Icon name="Star" size={24} className="text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Reasoning:</div>
                {getReasoningForRanking(ranking)?.map((reason, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <Icon name="Check" size={12} className="text-green-500" />
                    {reason}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {feedRankings?.length === 0 && (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              <Icon name="Inbox" size={48} className="mx-auto mb-4 opacity-50" />
              <p>No rankings available. Generate feed rankings to see transparency insights.</p>
            </div>
          )}
        </div>
      </div>

      {/* Preference Adjustment Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Sliders" size={20} />
          Preference Adjustment Controls
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Semantic Matching Weight
              </label>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">30%</span>
            </div>
            <input type="range" min="0" max="100" defaultValue="30" className="w-full" />
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              How much to prioritize content semantically similar to your interests
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Engagement Pattern Weight
              </label>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">20%</span>
            </div>
            <input type="range" min="0" max="100" defaultValue="20" className="w-full" />
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              How much to consider your past engagement behavior
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Freshness Factor
              </label>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">15%</span>
            </div>
            <input type="range" min="0" max="100" defaultValue="15" className="w-full" />
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              How much to prioritize recent content
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Diversity Boost
              </label>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">35%</span>
            </div>
            <input type="range" min="0" max="100" defaultValue="35" className="w-full" />
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              How much to show diverse content outside your usual preferences
            </div>
          </div>

          <button className="w-full px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 flex items-center justify-center gap-2">
            <Icon name="Save" size={18} />
            Save Preference Adjustments
          </button>
        </div>
      </div>

      {/* Algorithm Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Brain" size={20} />
          Algorithm Insights
        </h3>
        <div className="space-y-3">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="Sparkles" size={20} className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                OpenAI Semantic Analysis
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Uses text-embedding-3-small model to understand deep content meaning and match with your interests
            </p>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="Activity" size={20} className="text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Behavioral Learning
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Continuously learns from your swipes, dwell time, and engagement patterns to improve recommendations
            </p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="Layers" size={20} className="text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Multi-Modal Scoring
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Combines semantic similarity, engagement history, freshness, and diversity for optimal content mix
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationTransparencyPanel;