import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { feedRankingService } from '../../../services/feedRankingService';

const FeedOrchestrationPanel = ({ userId, feedRankings }) => {
  const [contentMix, setContentMix] = useState({
    elections: 6,
    posts: 2,
    ads: 2
  });
  const [orchestrating, setOrchestrating] = useState(false);
  const [orchestrationMetrics, setOrchestrationMetrics] = useState(null);

  useEffect(() => {
    if (feedRankings?.length > 0) {
      calculateOrchestrationMetrics();
    }
  }, [feedRankings]);

  const calculateOrchestrationMetrics = () => {
    const metrics = {
      totalItems: feedRankings?.length,
      elections: feedRankings?.filter((r) => r?.contentItemType === 'election')?.length,
      posts: feedRankings?.filter((r) => r?.contentItemType === 'post')?.length,
      ads: feedRankings?.filter((r) => r?.contentItemType === 'ad')?.length,
      avgScore: feedRankings?.reduce((sum, r) => sum + (r?.rankingScore || 0), 0) / feedRankings?.length || 0
    };
    setOrchestrationMetrics(metrics);
  };

  const handleOrchestrate = async () => {
    if (!userId) return;

    setOrchestrating(true);
    try {
      await feedRankingService?.generateFeedRankings(userId, contentMix);
    } catch (error) {
      console.error('Orchestration failed:', error);
    } finally {
      setOrchestrating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
          <Icon name="Layers" size={20} />
          Enhanced Feed Orchestration
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Intelligent content weighting with dynamic ranking adjustments based on semantic relevance and user preferences
        </p>
      </div>

      {/* Current Mix */}
      {orchestrationMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Grid" size={24} className="text-blue-500" />
              <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {orchestrationMetrics?.totalItems}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Items</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Vote" size={24} className="text-green-500" />
              <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {orchestrationMetrics?.elections}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Elections</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Icon name="FileText" size={24} className="text-purple-500" />
              <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {orchestrationMetrics?.posts}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Social Posts</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Icon name="DollarSign" size={24} className="text-orange-500" />
              <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {orchestrationMetrics?.ads}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Sponsored</p>
          </div>
        </div>
      )}

      {/* Content Mix Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Sliders" size={20} />
          Content Mix Configuration
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Elections</label>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{contentMix?.elections}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={contentMix?.elections}
              onChange={(e) => setContentMix({ ...contentMix, elections: parseInt(e?.target?.value) })}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Social Posts</label>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{contentMix?.posts}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={contentMix?.posts}
              onChange={(e) => setContentMix({ ...contentMix, posts: parseInt(e?.target?.value) })}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sponsored Content</label>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{contentMix?.ads}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={contentMix?.ads}
              onChange={(e) => setContentMix({ ...contentMix, ads: parseInt(e?.target?.value) })}
              className="w-full"
            />
          </div>

          <button
            onClick={handleOrchestrate}
            disabled={orchestrating}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {orchestrating ? (
              <>
                <Icon name="Loader" size={18} className="animate-spin" />
                Orchestrating Feed...
              </>
            ) : (
              <>
                <Icon name="Play" size={18} />
                Apply Content Mix
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dynamic Ranking Adjustments */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={20} />
          Dynamic Ranking Adjustments
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="Sparkles" size={20} className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Semantic relevance boosting
              </span>
            </div>
            <span className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-full font-semibold">
              +15% weight
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="Heart" size={20} className="text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                User preference matching
              </span>
            </div>
            <span className="text-xs px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full font-semibold">
              +30% weight
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="Clock" size={20} className="text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Freshness factor
              </span>
            </div>
            <span className="text-xs px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 rounded-full font-semibold">
              +15% weight
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedOrchestrationPanel;