import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { feedbackService } from '../../../services/feedbackService';

const FeedbackContributionsPanel = ({ timeRange, userId }) => {
  const [loading, setLoading] = useState(true);
  const [contributions, setContributions] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadContributions();
  }, [timeRange, userId]);

  const loadContributions = async () => {
    setLoading(true);
    try {
      const [contributionsData, statsData] = await Promise.all([
        feedbackService?.getUserFeedbackContributions(userId, { timeRange }),
        feedbackService?.getFeedbackContributionStats(userId, { timeRange })
      ]);

      if (contributionsData?.data) {
        setContributions(contributionsData?.data);
      }

      if (statsData?.data) {
        setStats(statsData?.data);
      }
    } catch (error) {
      console.error('Error loading contributions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getQualityBadge = (score) => {
    if (score >= 90) return { label: 'Excellent', color: 'bg-green-500' };
    if (score >= 70) return { label: 'Good', color: 'bg-blue-500' };
    if (score >= 50) return { label: 'Average', color: 'bg-yellow-500' };
    return { label: 'Needs Improvement', color: 'bg-gray-500' };
  };

  const getStatusBadge = (status) => {
    const badges = {
      implemented: { label: 'Implemented', color: 'bg-green-500' },
      in_progress: { label: 'In Progress', color: 'bg-blue-500' },
      under_review: { label: 'Under Review', color: 'bg-yellow-500' },
      submitted: { label: 'Submitted', color: 'bg-gray-500' }
    };
    return badges?.[status] || badges?.submitted;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center h-64">
          <Icon name="Loader" className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="MessageSquare" className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Feedback Contributions
        </h2>
      </div>
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.totalSubmissions || 0}
                </p>
              </div>
              <Icon name="FileText" className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Quality Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.averageQualityScore || 0}%
                </p>
              </div>
              <Icon name="Star" className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Implementation Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.implementationRate || 0}%
                </p>
              </div>
              <Icon name="CheckCircle" className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Community Upvotes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.totalUpvotes || 0}
                </p>
              </div>
              <Icon name="ThumbsUp" className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>
      )}
      {/* Contributions List */}
      <div className="space-y-4">
        {contributions?.map(contribution => {
          const qualityBadge = getQualityBadge(contribution?.qualityScore);
          const statusBadge = getStatusBadge(contribution?.status);

          return (
            <div
              key={contribution?.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {contribution?.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {contribution?.description}
                  </p>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <span className={`${statusBadge?.color} text-white text-xs px-3 py-1 rounded-full`}>
                    {statusBadge?.label}
                  </span>
                  <span className={`${qualityBadge?.color} text-white text-xs px-3 py-1 rounded-full`}>
                    {qualityBadge?.label}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Icon name="Star" className="w-4 h-4 text-yellow-500" />
                    <span>Quality: {contribution?.qualityScore}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="ThumbsUp" className="w-4 h-4 text-blue-500" />
                    <span>{contribution?.upvotes || 0} upvotes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="MessageCircle" className="w-4 h-4 text-green-500" />
                    <span>{contribution?.comments || 0} comments</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(contribution?.createdAt)?.toLocaleDateString()}
                </div>
              </div>
              {contribution?.moderatorApproval && (
                <div className="mt-3 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <Icon name="CheckCircle" className="w-4 h-4" />
                  <span>Moderator Approved</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {contributions?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="MessageSquare" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No feedback contributions found for the selected time range.
          </p>
        </div>
      )}
    </div>
  );
};

export default FeedbackContributionsPanel;