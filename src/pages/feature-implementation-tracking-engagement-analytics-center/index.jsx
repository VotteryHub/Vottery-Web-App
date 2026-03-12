import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import { feedbackService } from '../../services/feedbackService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const FeatureImplementationTrackingEngagementAnalyticsCenter = () => {
  const [implementedFeatures, setImplementedFeatures] = useState([]);
  const [engagementStats, setEngagementStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      const { data, error } = await feedbackService?.getImplementedFeatures(50);
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

      analytics?.trackEvent('feature_tracking_viewed', {
        time_range: timeRange,
        total_features: data?.length
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
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

  const getAdoptionRate = (stats) => {
    if (!stats?.uniqueUsers) return 0;
    // Simplified adoption rate calculation
    return Math.min(100, (stats?.uniqueUsers / 10) * 100);
  };

  const totalEngagements = Object.values(engagementStats)?.reduce((sum, stat) => sum + (stat?.totalEngagements || 0), 0);
  const totalUsers = Object.values(engagementStats)?.reduce((sum, stat) => sum + (stat?.uniqueUsers || 0), 0);
  const avgRating = Object.values(engagementStats)?.reduce((sum, stat) => sum + (stat?.averageRating || 0), 0) / (Object.values(engagementStats)?.length || 1);

  return (
    <>
      <Helmet>
        <title>Feature Implementation Tracking & Engagement Analytics Center | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-14">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-14 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Feature Implementation Tracking & Engagement Analytics Center
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Comprehensive post-launch monitoring with automated user adoption tracking and engagement measurement
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e?.target?.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                >
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                  <option value="all">All Time</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Icon name="Loader" size={32} className="animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Launched Features</p>
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
                      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">{totalEngagements}</p>
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
                      <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">{totalUsers}</p>
                    </div>
                    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <Icon name="Users" size={24} className="text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Avg Satisfaction</p>
                      <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{avgRating?.toFixed(1)}</p>
                    </div>
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                      <Icon name="Star" size={24} className="text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recently Launched Features */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Recently Launched Features
                  </h3>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {implementedFeatures?.length === 0 ? (
                    <div className="p-8 text-center">
                      <Icon name="Inbox" size={48} className="mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-600 dark:text-gray-400">No implemented features yet.</p>
                    </div>
                  ) : (
                    implementedFeatures?.slice(0, 10)?.map((feature) => {
                      const stats = engagementStats?.[feature?.id] || {};
                      const adoptionRate = getAdoptionRate(stats);
                      return (
                        <div key={feature?.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                              <Icon name={getCategoryIcon(feature?.category)} size={24} className="text-green-600 dark:text-green-400" />
                            </div>
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

                              {/* Adoption Rate */}
                              <div className="mb-4">
                                <div className="flex items-center justify-between text-sm mb-1">
                                  <span className="text-gray-600 dark:text-gray-400">Adoption Rate</span>
                                  <span className="font-semibold text-gray-900 dark:text-gray-100">{adoptionRate?.toFixed(0)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                  <div
                                    className="bg-primary rounded-full h-2 transition-all"
                                    style={{ width: `${adoptionRate}%` }}
                                  />
                                </div>
                              </div>

                              {/* Engagement Metrics */}
                              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
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
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Rating</p>
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
                      );
                    })
                  )}
                </div>
              </div>

              {/* Post-Launch Analytics */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Post-Launch Analytics Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Icon name="TrendingUp" size={20} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Adoption Tracking</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Real-time monitoring of user adoption rates and feature discovery patterns
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                        <Icon name="BarChart" size={20} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Engagement Depth</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Analysis of feature usage frequency and user retention metrics
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                        <Icon name="MessageSquare" size={20} className="text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">User Satisfaction</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Feedback collection and sentiment analysis for continuous improvement
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Automated Notification System */}
              <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg p-6 border border-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <Icon name="Bell" size={24} className="text-primary" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Automated Notification System
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Community updates are automatically sent when features move through development stages, launch announcements, and follow-up engagement surveys.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="GitBranch" size={16} className="text-primary" />
                      <span className="font-medium text-gray-900 dark:text-gray-100">Status Updates</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Notify voters when features move to planned, in progress, or implemented
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="Rocket" size={16} className="text-primary" />
                      <span className="font-medium text-gray-900 dark:text-gray-100">Launch Announcements</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Personalized notifications to all voters when features go live
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="MessageCircle" size={16} className="text-primary" />
                      <span className="font-medium text-gray-900 dark:text-gray-100">Engagement Surveys</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Follow-up surveys to collect feedback on implemented features
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FeatureImplementationTrackingEngagementAnalyticsCenter;