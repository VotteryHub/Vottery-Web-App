import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { feedbackService } from '../../../services/feedbackService';

const TrendingIdeasPanel = () => {
  const [trendingFeatures, setTrendingFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userVotes, setUserVotes] = useState({});

  useEffect(() => {
    loadTrendingFeatures();
  }, []);

  const loadTrendingFeatures = async () => {
    try {
      setLoading(true);
      const { data, error } = await feedbackService?.getTrendingFeatureRequests(20);
      if (error) throw error;

      setTrendingFeatures(data || []);

      // Load user votes for each feature
      const votes = {};
      for (const feature of data || []) {
        const { data: voteData } = await feedbackService?.getUserVote(feature?.id);
        if (voteData) {
          votes[feature?.id] = voteData?.voteType;
        }
      }
      setUserVotes(votes);
    } catch (error) {
      console.error('Error loading trending features:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (featureId, voteType) => {
    try {
      const { data, error } = await feedbackService?.voteOnFeature(featureId, voteType);
      if (error) throw error;

      // Update local state
      if (data?.action === 'removed') {
        setUserVotes(prev => {
          const updated = { ...prev };
          delete updated?.[featureId];
          return updated;
        });
      } else {
        setUserVotes(prev => ({ ...prev, [featureId]: voteType }));
      }

      // Refresh trending list
      await loadTrendingFeatures();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'under_review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'planned': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'in_progress': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'implemented': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      elections: 'Vote',
      analytics: 'BarChart',
      payments: 'DollarSign',
      security: 'Shield',
      ai: 'Cpu',
      communication: 'MessageSquare',
      gamification: 'Trophy',
      other: 'Package'
    };
    return icons?.[category] || 'Package';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg p-6 border border-primary/20">
        <div className="flex items-center gap-3 mb-2">
          <Icon name="TrendingUp" size={24} className="text-primary" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Trending Feature Requests</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Vote on the most popular feature requests from the community. Your votes help prioritize development.
        </p>
      </div>
      {/* Trending Features List */}
      <div className="space-y-4">
        {trendingFeatures?.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700">
            <Icon name="Inbox" size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 dark:text-gray-400">No trending feature requests yet. Be the first to submit one!</p>
          </div>
        ) : (
          trendingFeatures?.map((feature, index) => (
            <div
              key={feature?.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-all"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Ranking Badge */}
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      index === 1 ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
                      index === 2 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      #{index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon name={getCategoryIcon(feature?.category)} size={16} className="text-primary" />
                          <span className="text-xs font-medium text-primary capitalize">{feature?.category}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(feature?.status)}`}>
                            {feature?.status?.replace('_', ' ')}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          {feature?.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {feature?.description}
                        </p>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Icon name="User" size={14} />
                        <span>{feature?.user?.username || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="Clock" size={14} />
                        <span>{new Date(feature?.createdAt)?.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="MessageSquare" size={14} />
                        <span>{feature?.comments?.[0]?.count || 0} comments</span>
                      </div>
                    </div>

                    {/* Voting */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(feature?.id, 'upvote')}
                          className={`flex items-center gap-1 ${
                            userVotes?.[feature?.id] === 'upvote' ? 'text-green-600 dark:text-green-400' : ''
                          }`}
                        >
                          <Icon name="ThumbsUp" size={16} />
                        </Button>
                        <span className="font-bold text-gray-900 dark:text-gray-100 min-w-[2rem] text-center">
                          {feature?.voteCount || 0}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(feature?.id, 'downvote')}
                          className={`flex items-center gap-1 ${
                            userVotes?.[feature?.id] === 'downvote' ? 'text-red-600 dark:text-red-400' : ''
                          }`}
                        >
                          <Icon name="ThumbsDown" size={16} />
                        </Button>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {feature?.votes?.[0]?.count || 0} total votes
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TrendingIdeasPanel;