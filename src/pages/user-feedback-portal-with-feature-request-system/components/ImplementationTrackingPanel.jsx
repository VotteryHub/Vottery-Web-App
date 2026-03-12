import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { feedbackService } from '../../../services/feedbackService';

const ImplementationTrackingPanel = () => {
  const [implementedFeatures, setImplementedFeatures] = useState([]);
  const [engagementStats, setEngagementStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    loadImplementedFeatures();
  }, []);

  const loadImplementedFeatures = async () => {
    try {
      setLoading(true);
      const { data, error } = await feedbackService?.getImplementedFeatures(20);
      if (error) throw error;

      setImplementedFeatures(data || []);

      // Load engagement stats for each feature
      const stats = {};
      for (const feature of data || []) {
        const { data: statsData } = await feedbackService?.getFeatureEngagementStats(feature?.id);
        if (statsData) {
          stats[feature?.id] = statsData;
        }
      }
      setEngagementStats(stats);
    } catch (error) {
      console.error('Error loading implemented features:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackEngagement = async (featureId, engagementType) => {
    try {
      await feedbackService?.trackEngagement(featureId, engagementType);
      await loadImplementedFeatures();
    } catch (error) {
      console.error('Error tracking engagement:', error);
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

  const getDaysAgo = (date) => {
    const days = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
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
      <div className="bg-gradient-to-r from-primary/10 to-green-500/10 rounded-lg p-6 border border-primary/20">
        <div className="flex items-center gap-3 mb-2">
          <Icon name="GitBranch" size={24} className="text-primary" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Implementation Tracking & Post-Launch Engagement</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Track recently implemented features and monitor community adoption and engagement metrics.
        </p>
      </div>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Implemented</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{implementedFeatures?.length}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Icon name="CheckCircle" size={24} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Engagements</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {Object.values(engagementStats)?.reduce((sum, stat) => sum + (stat?.totalEngagements || 0), 0)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Icon name="Activity" size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                {Object.values(engagementStats)?.reduce((sum, stat) => sum + (stat?.uniqueUsers || 0), 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Icon name="Users" size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
                {(Object.values(engagementStats)?.reduce((sum, stat) => sum + (stat?.averageRating || 0), 0) / 
                  (Object.values(engagementStats)?.length || 1))?.toFixed(1)}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Icon name="Star" size={24} className="text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>
      {/* Implemented Features List */}
      <div className="space-y-4">
        {implementedFeatures?.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700">
            <Icon name="Inbox" size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 dark:text-gray-400">No implemented features yet.</p>
          </div>
        ) : (
          implementedFeatures?.map((feature) => {
            const stats = engagementStats?.[feature?.id] || {};
            return (
              <div
                key={feature?.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                      <Icon name={getCategoryIcon(feature?.category)} size={24} className="text-green-600 dark:text-green-400" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              <Icon name="CheckCircle" size={12} className="inline mr-1" />
                              Implemented
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {getDaysAgo(feature?.implementationDate)}
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

                      {/* Engagement Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">First Uses</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats?.firstUseCount || 0}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Daily Uses</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats?.dailyUseCount || 0}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Unique Users</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats?.uniqueUsers || 0}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Feedback</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats?.feedbackCount || 0}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Avg Rating</p>
                          <div className="flex items-center gap-1">
                            <Icon name="Star" size={16} className="text-yellow-500" />
                            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              {stats?.averageRating?.toFixed(1) || '0.0'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ImplementationTrackingPanel;