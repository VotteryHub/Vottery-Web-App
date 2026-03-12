import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { feedbackService } from '../../../services/feedbackService';

const FeatureRequestAnalyticsPanel = ({ timeRange, userId }) => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange, userId]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [analyticsData, requestsData] = await Promise.all([
        feedbackService?.getFeatureRequestAnalytics(userId, { timeRange }),
        feedbackService?.getUserFeatureRequests(userId, { timeRange })
      ]);

      if (analyticsData?.data) {
        setAnalytics(analyticsData?.data);
      }

      if (requestsData?.data) {
        setRequests(requestsData?.data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImpactBadge = (score) => {
    if (score >= 80) return { label: 'High Impact', color: 'bg-red-500' };
    if (score >= 50) return { label: 'Medium Impact', color: 'bg-yellow-500' };
    return { label: 'Low Impact', color: 'bg-gray-500' };
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
        <Icon name="Lightbulb" className="w-6 h-6 text-yellow-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Feature Request Analytics
        </h2>
      </div>
      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics?.totalRequests || 0}
                </p>
              </div>
              <Icon name="FileText" className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Implemented</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics?.implementedCount || 0}
                </p>
              </div>
              <Icon name="CheckCircle" className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Impact Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics?.averageImpactScore || 0}
                </p>
              </div>
              <Icon name="TrendingUp" className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Votes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics?.totalVotes || 0}
                </p>
              </div>
              <Icon name="ThumbsUp" className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>
      )}
      {/* Feature Requests List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Your Feature Requests
        </h3>
        {requests?.map(request => {
          const impactBadge = getImpactBadge(request?.impactScore);

          return (
            <div
              key={request?.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {request?.title}
                    </h3>
                    <span className={`${impactBadge?.color} text-white text-xs px-2 py-1 rounded-full`}>
                      {impactBadge?.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {request?.description}
                  </p>
                </div>
                <div className="ml-4">
                  <span
                    className={`${
                      request?.status === 'implemented' ?'bg-green-500'
                        : request?.status === 'in_progress' ?'bg-blue-500'
                        : request?.status === 'under_review' ?'bg-yellow-500' :'bg-gray-500'
                    } text-white text-xs px-3 py-1 rounded-full`}
                  >
                    {request?.status?.replace('_', ' ')?.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-3">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Icon name="ThumbsUp" className="w-4 h-4 text-green-500" />
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {request?.upvotes || 0}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Upvotes</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Icon name="MessageCircle" className="w-4 h-4 text-blue-500" />
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {request?.comments || 0}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Comments</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Icon name="TrendingUp" className="w-4 h-4 text-purple-500" />
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {request?.impactScore || 0}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Impact</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Icon name="Users" className="w-4 h-4 text-orange-500" />
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {request?.popularity || 0}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Popularity</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Icon name="Tag" className="w-4 h-4" />
                    {request?.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="Calendar" className="w-4 h-4" />
                    {new Date(request?.createdAt)?.toLocaleDateString()}
                  </span>
                </div>
                {request?.implementedAt && (
                  <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                    <Icon name="CheckCircle" className="w-4 h-4" />
                    Implemented {new Date(request?.implementedAt)?.toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {requests?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Lightbulb" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No feature requests found for the selected time range.
          </p>
        </div>
      )}
    </div>
  );
};

export default FeatureRequestAnalyticsPanel;