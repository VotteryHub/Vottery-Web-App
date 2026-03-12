import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { feedbackService } from '../../../services/feedbackService';

const CommunityVotingPanel = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    sortBy: 'trending'
  });
  const [userVotes, setUserVotes] = useState({});

  useEffect(() => {
    loadFeatures();
  }, [filters]);

  const loadFeatures = async () => {
    try {
      setLoading(true);
      const { data, error } = await feedbackService?.getFeatureRequests(filters);
      if (error) throw error;

      setFeatures(data || []);

      // Load user votes
      const votes = {};
      for (const feature of data || []) {
        const { data: voteData } = await feedbackService?.getUserVote(feature?.id);
        if (voteData) {
          votes[feature?.id] = voteData?.voteType;
        }
      }
      setUserVotes(votes);
    } catch (error) {
      console.error('Error loading features:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (featureId, voteType) => {
    try {
      const { data, error } = await feedbackService?.voteOnFeature(featureId, voteType);
      if (error) throw error;

      if (data?.action === 'removed') {
        setUserVotes(prev => {
          const updated = { ...prev };
          delete updated?.[featureId];
          return updated;
        });
      } else {
        setUserVotes(prev => ({ ...prev, [featureId]: voteType }));
      }

      await loadFeatures();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'elections', label: 'Elections' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'payments', label: 'Payments' },
    { value: 'security', label: 'Security' },
    { value: 'ai', label: 'AI' },
    { value: 'communication', label: 'Communication' },
    { value: 'gamification', label: 'Gamification' },
    { value: 'other', label: 'Other' }
  ];

  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'planned', label: 'Planned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'implemented', label: 'Implemented' }
  ];

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-green-500/10 rounded-lg p-6 border border-primary/20">
        <div className="flex items-center gap-3 mb-2">
          <Icon name="ThumbsUp" size={24} className="text-primary" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Community Voting</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Browse all feature requests and vote on the ones you'd like to see implemented. Your vote matters!
        </p>
      </div>
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={filters?.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e?.target?.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {categories?.map(cat => (
                <option key={cat?.value} value={cat?.value}>{cat?.label}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={filters?.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e?.target?.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {statuses?.map(status => (
                <option key={status?.value} value={status?.value}>{status?.label}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={filters?.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e?.target?.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="trending">Most Votes</option>
              <option value="recent">Most Recent</option>
            </select>
          </div>
        </div>
      </div>
      {/* Features List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Icon name="Loader" size={32} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {features?.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700">
              <Icon name="Inbox" size={48} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 dark:text-gray-400">No feature requests found with the selected filters.</p>
            </div>
          ) : (
            features?.map((feature) => (
              <div
                key={feature?.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-all p-6"
              >
                <div className="flex items-start gap-4">
                  {/* Voting Section */}
                  <div className="flex flex-col items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(feature?.id, 'upvote')}
                      className={`p-2 ${
                        userVotes?.[feature?.id] === 'upvote' ? 'text-green-600 dark:text-green-400' : ''
                      }`}
                    >
                      <Icon name="ChevronUp" size={20} />
                    </Button>
                    <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                      {feature?.voteCount || 0}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(feature?.id, 'downvote')}
                      className={`p-2 ${
                        userVotes?.[feature?.id] === 'downvote' ? 'text-red-600 dark:text-red-400' : ''
                      }`}
                    >
                      <Icon name="ChevronDown" size={20} />
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-primary capitalize">{feature?.category}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(feature?.status)}`}>
                            {feature?.status?.replace('_', ' ')}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          {feature?.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                          {feature?.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
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
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CommunityVotingPanel;