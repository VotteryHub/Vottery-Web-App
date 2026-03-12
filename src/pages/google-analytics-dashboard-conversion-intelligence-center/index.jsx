import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { googleAnalyticsService } from '../../services/googleAnalyticsService';
import { useAuth } from '../../contexts/AuthContext';

const GoogleAnalyticsDashboardConversionIntelligenceCenter = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalyticsData();
    googleAnalyticsService?.trackUserFlow('analytics_dashboard', 'page_view', {
      tab: activeTab,
      time_range: timeRange
    });
  }, [timeRange, activeTab]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const mockData = {
        overview: {
          totalSessions: 125678,
          avgSessionDuration: '8m 45s',
          bounceRate: 28.4,
          conversionRate: 12.8,
          pageViews: 456789,
          uniqueVisitors: 89234
        },
        conversionFunnel: {
          registration: { count: 45892, rate: 100, dropOff: 0 },
          profileComplete: { count: 38234, rate: 83.3, dropOff: 16.7 },
          firstVote: { count: 32156, rate: 70.1, dropOff: 13.2 },
          prizeRedemption: { count: 12456, rate: 27.1, dropOff: 43.0 },
          socialShare: { count: 8923, rate: 19.4, dropOff: 7.7 }
        },
        userEngagement: {
          dailyActiveUsers: 12456,
          weeklyActiveUsers: 34567,
          monthlyActiveUsers: 89234,
          avgEngagementTime: '12m 34s',
          returnVisitorRate: 68.5,
          newVisitorRate: 31.5
        },
        behaviorFlow: {
          topEntryPages: [
            { page: '/home-feed-dashboard', sessions: 45678, exitRate: 12.3 },
            { page: '/vote-in-elections-hub', sessions: 34567, exitRate: 18.7 },
            { page: '/elections-dashboard', sessions: 23456, exitRate: 15.2 }
          ],
          topExitPages: [
            { page: '/enhanced-election-results-center', sessions: 12345, exitRate: 45.6 },
            { page: '/digital-wallet-hub', sessions: 9876, exitRate: 38.2 },
            { page: '/user-profile-hub', sessions: 8765, exitRate: 32.1 }
          ]
        },
        attribution: {
          channels: [
            { name: 'Direct', sessions: 45678, conversions: 5678, roi: 234 },
            { name: 'Organic Search', sessions: 34567, conversions: 4567, roi: 189 },
            { name: 'Social Media', sessions: 23456, conversions: 3456, roi: 156 },
            { name: 'Referral', sessions: 12345, conversions: 2345, roi: 123 },
            { name: 'Email', sessions: 9876, conversions: 1876, roi: 98 }
          ]
        },
        realTimeMetrics: {
          activeUsers: 1234,
          activePages: [
            { page: '/home-feed-dashboard', users: 456 },
            { page: '/secure-voting-interface', users: 234 },
            { page: '/vote-in-elections-hub', users: 178 }
          ],
          topEvents: [
            { event: 'vote_cast', count: 234 },
            { event: 'post_created', count: 156 },
            { event: 'election_viewed', count: 123 }
          ]
        }
      };
      setMetrics(mockData);
    } catch (err) {
      setError(err?.message);
      googleAnalyticsService?.trackComponentError(err?.message, 'GoogleAnalyticsDashboard', 'loadAnalyticsData');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'conversion', label: 'Conversion Funnel', icon: 'Filter' },
    { id: 'engagement', label: 'User Engagement', icon: 'Users' },
    { id: 'behavior', label: 'Behavior Flow', icon: 'GitBranch' },
    { id: 'attribution', label: 'Attribution', icon: 'Target' },
    { id: 'realtime', label: 'Real-Time', icon: 'Activity' }
  ];

  const timeRanges = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' }
  ];

  const MetricCard = ({ icon, label, value, trend, trendUp }) => (
    <div className="p-6 bg-card rounded-xl border border-border hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon name={icon} size={24} className="text-primary" />
        </div>
        {trend && (
          <span className={`px-2 py-1 text-xs font-medium rounded-md ${trendUp ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );

  const exportReport = () => {
    googleAnalyticsService?.trackUserFlow('analytics_dashboard', 'export_report', { time_range: timeRange });
    const reportData = JSON.stringify(metrics, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${timeRange}-${new Date()?.toISOString()}.json`;
    a?.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <HeaderNavigation />
        <LeftSidebar />
        <main className="lg:ml-64 xl:ml-72 pt-14">
          <div className="flex items-center justify-center py-12">
            <Icon name="Loader" size={32} className="animate-spin text-primary" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Google Analytics Dashboard & Conversion Intelligence Center - Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <LeftSidebar />

      <main className="lg:ml-64 xl:ml-72 pt-14">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                Google Analytics Dashboard & Conversion Intelligence Center
              </h1>
              <p className="text-muted-foreground">
                Comprehensive user engagement analytics with conversion funnel analysis and behavioral insights
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e?.target?.value)}
                className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {timeRanges?.map(range => (
                  <option key={range?.value} value={range?.value}>{range?.label}</option>
                ))}
              </select>
              <Button onClick={exportReport}>
                <Icon name="Download" size={16} className="mr-2" />
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-250 ${activeTab === tab?.id ? 'bg-primary text-white' : 'bg-muted text-foreground hover:bg-muted/80'}`}
                >
                  <Icon name={tab?.icon} size={18} />
                  {tab?.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <MetricCard icon="Users" label="Total Sessions" value={metrics?.overview?.totalSessions?.toLocaleString()} trend="+18.5%" trendUp={true} />
                  <MetricCard icon="Clock" label="Avg Session Duration" value={metrics?.overview?.avgSessionDuration} trend="+12.3%" trendUp={true} />
                  <MetricCard icon="TrendingDown" label="Bounce Rate" value={`${metrics?.overview?.bounceRate}%`} trend="-5.2%" trendUp={true} />
                  <MetricCard icon="Target" label="Conversion Rate" value={`${metrics?.overview?.conversionRate}%`} trend="+8.7%" trendUp={true} />
                  <MetricCard icon="Eye" label="Page Views" value={metrics?.overview?.pageViews?.toLocaleString()} trend="+22.1%" trendUp={true} />
                  <MetricCard icon="UserCheck" label="Unique Visitors" value={metrics?.overview?.uniqueVisitors?.toLocaleString()} trend="+15.4%" trendUp={true} />
                </div>
              </>
            )}

            {activeTab === 'conversion' && (
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-6">Conversion Funnel Analysis</h3>
                <div className="space-y-4">
                  {Object.entries(metrics?.conversionFunnel || {})?.map(([key, data], index) => (
                    <div key={key} className="relative">
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground capitalize">{key?.replace(/([A-Z])/g, ' $1')}</p>
                            <p className="text-sm text-muted-foreground">{data?.count?.toLocaleString()} users</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-foreground">{data?.rate}%</p>
                          {data?.dropOff > 0 && (
                            <p className="text-sm text-destructive">-{data?.dropOff}% drop-off</p>
                          )}
                        </div>
                      </div>
                      {index < Object.keys(metrics?.conversionFunnel || {})?.length - 1 && (
                        <div className="flex justify-center my-2">
                          <Icon name="ChevronDown" size={24} className="text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'engagement' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <MetricCard icon="Users" label="Daily Active Users" value={metrics?.userEngagement?.dailyActiveUsers?.toLocaleString()} trend={null} trendUp={null} />
                  <MetricCard icon="Calendar" label="Weekly Active Users" value={metrics?.userEngagement?.weeklyActiveUsers?.toLocaleString()} trend={null} trendUp={null} />
                  <MetricCard icon="CalendarDays" label="Monthly Active Users" value={metrics?.userEngagement?.monthlyActiveUsers?.toLocaleString()} trend={null} trendUp={null} />
                  <MetricCard icon="Clock" label="Avg Engagement Time" value={metrics?.userEngagement?.avgEngagementTime} trend={null} trendUp={null} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-card rounded-xl border border-border p-6">
                    <h4 className="font-semibold text-foreground mb-4">Visitor Type Distribution</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Return Visitors</span>
                          <span className="text-sm font-medium text-foreground">{metrics?.userEngagement?.returnVisitorRate}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${metrics?.userEngagement?.returnVisitorRate}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">New Visitors</span>
                          <span className="text-sm font-medium text-foreground">{metrics?.userEngagement?.newVisitorRate}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-secondary h-2 rounded-full" style={{ width: `${metrics?.userEngagement?.newVisitorRate}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'behavior' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h4 className="font-semibold text-foreground mb-4">Top Entry Pages</h4>
                  <div className="space-y-3">
                    {metrics?.behaviorFlow?.topEntryPages?.map((page, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground truncate">{page?.page}</p>
                          <p className="text-xs text-muted-foreground">{page?.sessions?.toLocaleString()} sessions</p>
                        </div>
                        <span className="text-sm font-medium text-foreground">{page?.exitRate}% exit</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-card rounded-xl border border-border p-6">
                  <h4 className="font-semibold text-foreground mb-4">Top Exit Pages</h4>
                  <div className="space-y-3">
                    {metrics?.behaviorFlow?.topExitPages?.map((page, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground truncate">{page?.page}</p>
                          <p className="text-xs text-muted-foreground">{page?.sessions?.toLocaleString()} sessions</p>
                        </div>
                        <span className="text-sm font-medium text-destructive">{page?.exitRate}% exit</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'attribution' && (
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-6">Channel Attribution & ROI</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Channel</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Sessions</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Conversions</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">ROI %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics?.attribution?.channels?.map((channel, index) => (
                        <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4 font-medium text-foreground">{channel?.name}</td>
                          <td className="text-right py-3 px-4 text-foreground">{channel?.sessions?.toLocaleString()}</td>
                          <td className="text-right py-3 px-4 text-foreground">{channel?.conversions?.toLocaleString()}</td>
                          <td className="text-right py-3 px-4 font-semibold text-success">{channel?.roi}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'realtime' && (
              <>
                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                    <h3 className="text-lg font-heading font-semibold text-foreground">Live Activity</h3>
                  </div>
                  <p className="text-4xl font-bold text-foreground">{metrics?.realTimeMetrics?.activeUsers?.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Active users right now</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-card rounded-xl border border-border p-6">
                    <h4 className="font-semibold text-foreground mb-4">Active Pages</h4>
                    <div className="space-y-3">
                      {metrics?.realTimeMetrics?.activePages?.map((page, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium text-foreground truncate flex-1">{page?.page}</p>
                          <span className="text-sm font-bold text-primary">{page?.users} users</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-card rounded-xl border border-border p-6">
                    <h4 className="font-semibold text-foreground mb-4">Top Events (Last 30 min)</h4>
                    <div className="space-y-3">
                      {metrics?.realTimeMetrics?.topEvents?.map((event, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium text-foreground">{event?.event?.replace(/_/g, ' ')}</p>
                          <span className="text-sm font-bold text-primary">{event?.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GoogleAnalyticsDashboardConversionIntelligenceCenter;