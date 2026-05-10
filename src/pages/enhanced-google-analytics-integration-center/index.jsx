import React, { useState, useEffect } from 'react';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { googleAnalyticsService } from '../../services/googleAnalyticsService';
import ParticipationAnalyticsPanel from './components/ParticipationAnalyticsPanel';
import ViralityMetricsPanel from './components/ViralityMetricsPanel';
import AudienceGrowthPanel from './components/AudienceGrowthPanel';
import WatchTimeAnalyticsPanel from './components/WatchTimeAnalyticsPanel';
import EngagementFunnelPanel from './components/EngagementFunnelPanel';
import CustomEventsPanel from './components/CustomEventsPanel';

const EnhancedGoogleAnalyticsIntegrationCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [overviewMetrics, setOverviewMetrics] = useState(null);

  useEffect(() => {
    loadOverviewMetrics();
    
    // Track page view
    googleAnalyticsService?.trackUserFlow('analytics_center', 'page_view', {
      tab: activeTab,
      time_range: timeRange
    });
  }, [timeRange]);

  const loadOverviewMetrics = async () => {
    setLoading(true);
    try {
      // Mock comprehensive analytics data
      const mockData = {
        userAcquisition: {
          totalUsers: 45892,
          newUsers: 12456,
          returningUsers: 33436,
          userGrowth: '+18.5%'
        },
        engagement: {
          avgSessionDuration: '8m 34s',
          bounceRate: 32.4,
          pagesPerSession: 5.7,
          engagementRate: 78.3
        },
        conversions: {
          totalConversions: 3456,
          conversionRate: 7.5,
          goalCompletions: 8923,
          revenueGenerated: 125678
        },
        participationMetrics: {
          totalVotes: 89234,
          participationRate: 82.7,
          avgVotesPerUser: 3.2,
          voteCompletionRate: 94.5
        },
        viralityMetrics: {
          socialShares: 15678,
          referralTraffic: 23456,
          viralCoefficient: 1.8,
          networkEffect: 'Strong'
        },
        audienceGrowth: {
          dailyActiveUsers: 12456,
          weeklyActiveUsers: 34567,
          monthlyActiveUsers: 45892,
          retentionRate: 85.3
        },
        watchTime: {
          totalWatchTime: '234,567 hours',
          avgWatchTime: '12m 45s',
          videoCompletionRate: 67.8,
          engagementDuration: '8m 23s'
        }
      };

      setOverviewMetrics(mockData);
    } catch (error) {
      console.error('Error loading overview metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'participation', label: 'Participation', icon: 'Users' },
    { id: 'virality', label: 'Virality', icon: 'Share2' },
    { id: 'audience', label: 'Audience Growth', icon: 'TrendingUp' },
    { id: 'watch-time', label: 'Watch Time', icon: 'Clock' },
    { id: 'funnel', label: 'Engagement Funnel', icon: 'Filter' },
    { id: 'custom', label: 'Custom Events', icon: 'Settings' }
  ];

  const timeRanges = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' },
    { value: 'all', label: 'All Time' }
  ];

  const MetricCard = ({ icon, label, value, trend, trendUp, description }) => (
    <div className="p-6 bg-card rounded-xl border border-border hover:shadow-lg transition-all duration-250">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon name={icon} size={24} className="text-primary" />
        </div>
        {trend && (
          <span className={`px-2 py-1 text-xs font-medium rounded-md ${
            trendUp ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
          }`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
      <p className="text-sm font-medium text-foreground mb-1">{label}</p>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );

  return (
    <GeneralPageLayout 
      title="Enhanced Google Analytics Integration Center" 
      description="Holistic tracking beyond standard views, capturing participatory election engagement, Jolts video retention, and cross-platform user flow virality."
      showSidebar={true}
      maxWidth="max-w-[1600px]"
    >
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
              Google Analytics Integration Center
            </h1>
            <p className="text-muted-foreground">
              Comprehensive tracking of 30+ metrics including participation rates, vote funnels, virality scores, and engagement analytics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e?.target?.value)}
              className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {timeRanges?.map(range => (
                <option key={range?.value} value={range?.value}>
                  {range?.label}
                </option>
              ))}
            </select>
            <Button>
              <Icon name="Download" size={16} />
              Export Report
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {tabs?.map(tab => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-250 ${
                  activeTab === tab?.id
                    ? 'bg-primary text-white' : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                <Icon name={tab?.icon} size={18} />
                {tab?.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Icon name="Loader" size={32} className="animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <>
                {/* User Acquisition */}
                <div>
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                    User Acquisition
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                      icon="Users"
                      label="Total Users"
                      value={overviewMetrics?.userAcquisition?.totalUsers?.toLocaleString()}
                      trend={overviewMetrics?.userAcquisition?.userGrowth}
                      trendUp={true}
                      description="All-time registered users"
                    />
                    <MetricCard
                      icon="UserPlus"
                      label="New Users"
                      value={overviewMetrics?.userAcquisition?.newUsers?.toLocaleString()}
                      trend={undefined}
                      trendUp={undefined}
                      description="First-time visitors"
                    />
                    <MetricCard
                      icon="UserCheck"
                      label="Returning Users"
                      value={overviewMetrics?.userAcquisition?.returningUsers?.toLocaleString()}
                      trend={undefined}
                      trendUp={undefined}
                      description="Repeat visitors"
                    />
                    <MetricCard
                      icon="TrendingUp"
                      label="User Growth"
                      value={overviewMetrics?.userAcquisition?.userGrowth}
                      trend={undefined}
                      trendUp={true}
                      description="Period-over-period growth"
                    />
                  </div>
                </div>

                {/* Engagement Metrics */}
                <div>
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                    Engagement Metrics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                      icon="Clock"
                      label="Avg Session Duration"
                      value={overviewMetrics?.engagement?.avgSessionDuration}
                      trend={undefined}
                      trendUp={undefined}
                      description="Time spent per session"
                    />
                    <MetricCard
                      icon="Activity"
                      label="Bounce Rate"
                      value={`${overviewMetrics?.engagement?.bounceRate}%`}
                      trend={undefined}
                      trendUp={undefined}
                      description="Single-page sessions"
                    />
                    <MetricCard
                      icon="FileText"
                      label="Pages Per Session"
                      value={overviewMetrics?.engagement?.pagesPerSession}
                      trend={undefined}
                      trendUp={undefined}
                      description="Avg pages viewed"
                    />
                    <MetricCard
                      icon="Heart"
                      label="Engagement Rate"
                      value={`${overviewMetrics?.engagement?.engagementRate}%`}
                      trend={undefined}
                      trendUp={undefined}
                      description="Active user engagement"
                    />
                  </div>
                </div>

                {/* Conversion Metrics */}
                <div>
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                    Conversion Metrics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                      icon="Target"
                      label="Total Conversions"
                      value={overviewMetrics?.conversions?.totalConversions?.toLocaleString()}
                      trend={undefined}
                      trendUp={undefined}
                      description="Completed conversions"
                    />
                    <MetricCard
                      icon="Percent"
                      label="Conversion Rate"
                      value={`${overviewMetrics?.conversions?.conversionRate}%`}
                      trend={undefined}
                      trendUp={undefined}
                      description="Conversion percentage"
                    />
                    <MetricCard
                      icon="CheckCircle"
                      label="Goal Completions"
                      value={overviewMetrics?.conversions?.goalCompletions?.toLocaleString()}
                      trend={undefined}
                      trendUp={undefined}
                      description="Goals achieved"
                    />
                    <MetricCard
                      icon="DollarSign"
                      label="Revenue Generated"
                      value={`₹${overviewMetrics?.conversions?.revenueGenerated?.toLocaleString()}`}
                      trend={undefined}
                      trendUp={undefined}
                      description="Total revenue"
                    />
                  </div>
                </div>

                {/* Participation Metrics */}
                <div>
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                    Participation Metrics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                      icon="Vote"
                      label="Total Votes"
                      value={overviewMetrics?.participationMetrics?.totalVotes?.toLocaleString()}
                      trend={undefined}
                      trendUp={undefined}
                      description="All votes cast"
                    />
                    <MetricCard
                      icon="TrendingUp"
                      label="Participation Rate"
                      value={`${overviewMetrics?.participationMetrics?.participationRate}%`}
                      trend={undefined}
                      trendUp={undefined}
                      description="User participation"
                    />
                    <MetricCard
                      icon="BarChart"
                      label="Avg Votes Per User"
                      value={overviewMetrics?.participationMetrics?.avgVotesPerUser}
                      trend={undefined}
                      trendUp={undefined}
                      description="Average engagement"
                    />
                    <MetricCard
                      icon="CheckCircle"
                      label="Vote Completion Rate"
                      value={`${overviewMetrics?.participationMetrics?.voteCompletionRate}%`}
                      trend={undefined}
                      trendUp={undefined}
                      description="Completed votes"
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'participation' && <ParticipationAnalyticsPanel timeRange={timeRange} />}
            {activeTab === 'virality' && <ViralityMetricsPanel timeRange={timeRange} />}
            {activeTab === 'audience' && <AudienceGrowthPanel timeRange={timeRange} />}
            {activeTab === 'watch-time' && <WatchTimeAnalyticsPanel timeRange={timeRange} />}
            {activeTab === 'funnel' && <EngagementFunnelPanel timeRange={timeRange} />}
            {activeTab === 'custom' && <CustomEventsPanel timeRange={timeRange} />}
          </div>
        )}
      </div>
    </GeneralPageLayout>
  );
};

export default EnhancedGoogleAnalyticsIntegrationCenter;