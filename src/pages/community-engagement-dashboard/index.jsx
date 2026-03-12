import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';
import { feedbackService } from '../../services/feedbackService';
import { analytics } from '../../hooks/useGoogleAnalytics';
import FeedbackContributionsPanel from './components/FeedbackContributionsPanel';
import VotingParticipationPanel from './components/VotingParticipationPanel';
import FeatureRequestAnalyticsPanel from './components/FeatureRequestAnalyticsPanel';
import SocialProofRecognitionPanel from './components/SocialProofRecognitionPanel';
import CommunityLeaderboardPanel from './components/CommunityLeaderboardPanel';
import ContributorImpactScoringPanel from './components/ContributorImpactScoringPanel';

const CommunityEngagementDashboard = () => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [timeRange, setTimeRange] = useState('30d');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [contributionStats, setContributionStats] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadDashboardData();
    analytics?.trackEvent('community_engagement_dashboard_viewed', {
      user_role: userProfile?.role,
      time_range: timeRange
    });
  }, [timeRange]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadDashboardData();
      }, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, timeRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [leaderboard, stats] = await Promise.all([
        feedbackService?.getCommunityLeaderboard({ timeRange }),
        feedbackService?.getUserContributionStats(userProfile?.id, { timeRange })
      ]);

      if (leaderboard?.data) {
        setLeaderboardData(leaderboard?.data);
      }

      if (stats?.data) {
        setContributionStats(stats?.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'leaderboard', label: 'Community Leaderboard', icon: 'Trophy' },
    { id: 'feedback', label: 'Feedback Contributions', icon: 'MessageSquare' },
    { id: 'voting', label: 'Voting Participation', icon: 'Vote' },
    { id: 'requests', label: 'Feature Requests', icon: 'Lightbulb' },
    { id: 'recognition', label: 'Social Proof', icon: 'Award' },
    { id: 'impact', label: 'Impact Scoring', icon: 'TrendingUp' }
  ];

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: 'all', label: 'All Time' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Community Engagement Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track community member performance, contributions, and social proof recognition
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                autoRefresh
                  ? 'bg-green-500 text-white' :'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Icon name={autoRefresh ? 'RefreshCw' : 'Pause'} className="w-4 h-4" />
              {autoRefresh ? 'Auto-Refresh On' : 'Auto-Refresh Off'}
            </button>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e?.target?.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {timeRangeOptions?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* User Stats Overview */}
        {contributionStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Your Rank</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    #{contributionStats?.rank || 'N/A'}
                  </p>
                </div>
                <Icon name="Trophy" className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Contributions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {contributionStats?.totalContributions || 0}
                  </p>
                </div>
                <Icon name="MessageSquare" className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Impact Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {contributionStats?.impactScore || 0}
                  </p>
                </div>
                <Icon name="TrendingUp" className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Badges Earned</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {contributionStats?.badgesEarned || 0}
                  </p>
                </div>
                <Icon name="Award" className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Tab Navigation */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-2">
        <div className="flex flex-wrap gap-2">
          {tabs?.map(tab => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab?.id
                  ? 'bg-blue-500 text-white' :'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Icon name={tab?.icon} className="w-4 h-4" />
              {tab?.label}
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Icon name="Loader" className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            {activeTab === 'leaderboard' && (
              <CommunityLeaderboardPanel
                leaderboardData={leaderboardData}
                timeRange={timeRange}
                currentUserId={userProfile?.id}
              />
            )}
            {activeTab === 'feedback' && (
              <FeedbackContributionsPanel
                timeRange={timeRange}
                userId={userProfile?.id}
              />
            )}
            {activeTab === 'voting' && (
              <VotingParticipationPanel
                timeRange={timeRange}
                userId={userProfile?.id}
              />
            )}
            {activeTab === 'requests' && (
              <FeatureRequestAnalyticsPanel
                timeRange={timeRange}
                userId={userProfile?.id}
              />
            )}
            {activeTab === 'recognition' && (
              <SocialProofRecognitionPanel
                timeRange={timeRange}
                userId={userProfile?.id}
              />
            )}
            {activeTab === 'impact' && (
              <ContributorImpactScoringPanel
                timeRange={timeRange}
                userId={userProfile?.id}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommunityEngagementDashboard;