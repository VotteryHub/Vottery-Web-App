import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { useAuth } from '../../contexts/AuthContext';
import { googleAnalyticsService } from '../../services/googleAnalyticsService';

import AnalyticsOverview from './components/AnalyticsOverview';
import VotingHistoryPanel from './components/VotingHistoryPanel';
import ZoneEarningsPanel from './components/ZoneEarningsPanel';
import ElectionROIPanel from './components/ElectionROIPanel';
import EngagementInsightsPanel from './components/EngagementInsightsPanel';
import RetentionForecastPanel from './components/RetentionForecastPanel';

const UserAnalyticsDashboard = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    votingHistory: [],
    earningsByZone: {},
    electionROI: [],
    engagementInsights: null,
    retentionForecast: null,
    achievementProgress: null
  });

  useEffect(() => {
    if (user?.id) {
      loadAnalyticsData();
    }
  }, [user?.id, timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const [analyticsResult, retentionResult, achievementResult] = await Promise.all([
        googleAnalyticsService?.getUserAnalytics(user?.id, timeRange),
        googleAnalyticsService?.getRetentionForecast(user?.id),
        googleAnalyticsService?.getAchievementProgress(user?.id)
      ]);

      if (analyticsResult?.data) {
        setAnalyticsData({
          votingHistory: analyticsResult?.data?.votingHistory || [],
          earningsByZone: analyticsResult?.data?.earningsByZone || {},
          electionROI: analyticsResult?.data?.electionROI || [],
          engagementInsights: analyticsResult?.data?.engagementInsights || null,
          retentionForecast: retentionResult?.data || null,
          achievementProgress: achievementResult?.data || null
        });
      }

      // Track analytics dashboard view
      googleAnalyticsService?.trackUserFlow('user_analytics', 'dashboard_view', {
        time_range: timeRange
      });
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
  };

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: 'all', label: 'All Time' }
  ];

  return (
    <>
      <Helmet>
        <title>User Analytics Dashboard - Vottery</title>
        <meta name="description" content="Comprehensive behavioral analytics tracking voting history, earnings across zones, achievement progress, engagement insights, ROI per election, and retention forecasting." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1600px] mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                  User Analytics Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Comprehensive behavioral analytics with voting history, zone earnings, ROI tracking, and retention forecasting
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e?.target?.value)}
                  options={timeRangeOptions}
                  className="w-40"
                />
                <Button
                  onClick={refreshData}
                  iconName="RefreshCw"
                  variant="outline"
                  disabled={refreshing}
                  iconClassName={refreshing ? 'animate-spin' : ''}
                >
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <Icon name="Loader2" size={48} className="animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground">Loading analytics data...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Analytics Overview */}
              <AnalyticsOverview 
                engagementInsights={analyticsData?.engagementInsights}
                achievementProgress={analyticsData?.achievementProgress}
                timeRange={timeRange}
              />

              {/* Main Analytics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <VotingHistoryPanel 
                  votingHistory={analyticsData?.votingHistory}
                  timeRange={timeRange}
                />
                <ZoneEarningsPanel 
                  earningsByZone={analyticsData?.earningsByZone}
                  timeRange={timeRange}
                />
              </div>

              {/* ROI and Engagement */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ElectionROIPanel 
                  electionROI={analyticsData?.electionROI}
                  timeRange={timeRange}
                />
                <EngagementInsightsPanel 
                  insights={analyticsData?.engagementInsights}
                  timeRange={timeRange}
                />
              </div>

              {/* Retention Forecast */}
              <RetentionForecastPanel 
                forecast={analyticsData?.retentionForecast}
                achievementProgress={analyticsData?.achievementProgress}
              />
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default UserAnalyticsDashboard;