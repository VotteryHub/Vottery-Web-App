import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

import { googleAnalyticsService } from '../../../services/googleAnalyticsService';

const CommunityAnalyticsPanel = ({ communityId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    loadAnalytics();
  }, [communityId, timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Mock analytics data
      const mockData = {
        participationRate: 78.5,
        participationTrend: '+12.3%',
        totalMembers: 1247,
        memberGrowth: '+156',
        activeMembers: 892,
        activeMembersTrend: '+8.2%',
        totalElections: 45,
        electionsTrend: '+5',
        averageVotesPerElection: 234,
        votesTrend: '+15.7%',
        engagementScore: 8.7,
        engagementTrend: '+0.5',
        memberRetention: 85.3,
        retentionTrend: '+2.1%',
        topContributors: [
          { name: 'John Doe', contributions: 45, role: 'moderator' },
          { name: 'Jane Smith', contributions: 38, role: 'member' },
          { name: 'Bob Johnson', contributions: 32, role: 'member' }
        ],
        engagementByDay: [
          { day: 'Mon', engagement: 65 },
          { day: 'Tue', engagement: 72 },
          { day: 'Wed', engagement: 85 },
          { day: 'Thu', engagement: 78 },
          { day: 'Fri', engagement: 92 },
          { day: 'Sat', engagement: 88 },
          { day: 'Sun', engagement: 70 }
        ],
        memberDemographics: {
          ageGroups: [
            { range: '18-24', percentage: 25 },
            { range: '25-34', percentage: 35 },
            { range: '35-44', percentage: 22 },
            { range: '45+', percentage: 18 }
          ],
          topLocations: [
            { country: 'United States', percentage: 45 },
            { country: 'United Kingdom', percentage: 20 },
            { country: 'Canada', percentage: 15 },
            { country: 'Australia', percentage: 10 },
            { country: 'Others', percentage: 10 }
          ]
        }
      };

      setAnalytics(mockData);

      // Track analytics view
      googleAnalyticsService?.trackUserFlow('community_analytics', 'view', {
        community_id: communityId,
        time_range: timeRange
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: 'all', label: 'All Time' }
  ];

  const MetricCard = ({ icon, label, value, trend, trendUp }) => (
    <div className="p-4 bg-card rounded-lg border border-border">
      <div className="flex items-center justify-between mb-2">
        <Icon name={icon} size={20} className="text-primary" />
        {trend && (
          <span className={`text-xs font-medium ${
            trendUp ? 'text-success' : 'text-destructive'
          }`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );

  return (
    <div className="bg-background rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
            Community Analytics
          </h3>
          <p className="text-sm text-muted-foreground">
            Track participation rates, engagement patterns, and growth metrics
          </p>
        </div>
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
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Icon name="Loader" size={24} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              icon="TrendingUp"
              label="Participation Rate"
              value={`${analytics?.participationRate}%`}
              trend={analytics?.participationTrend}
              trendUp={true}
            />
            <MetricCard
              icon="Users"
              label="Total Members"
              value={analytics?.totalMembers?.toLocaleString()}
              trend={analytics?.memberGrowth}
              trendUp={true}
            />
            <MetricCard
              icon="Activity"
              label="Active Members"
              value={analytics?.activeMembers?.toLocaleString()}
              trend={analytics?.activeMembersTrend}
              trendUp={true}
            />
            <MetricCard
              icon="Vote"
              label="Total Elections"
              value={analytics?.totalElections}
              trend={analytics?.electionsTrend}
              trendUp={true}
            />
          </div>

          {/* Engagement Chart */}
          <div className="p-4 bg-card rounded-lg border border-border">
            <h4 className="font-medium text-foreground mb-4">Weekly Engagement</h4>
            <div className="flex items-end justify-between gap-2 h-40">
              {analytics?.engagementByDay?.map(day => (
                <div key={day?.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-primary/20 rounded-t-lg relative" style={{ height: `${day?.engagement}%` }}>
                    <div className="absolute inset-0 bg-primary rounded-t-lg" />
                  </div>
                  <span className="text-xs text-muted-foreground">{day?.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Contributors */}
          <div className="p-4 bg-card rounded-lg border border-border">
            <h4 className="font-medium text-foreground mb-4">Top Contributors</h4>
            <div className="space-y-3">
              {analytics?.topContributors?.map((contributor, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{contributor?.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{contributor?.role}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {contributor?.contributions} contributions
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Demographics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-card rounded-lg border border-border">
              <h4 className="font-medium text-foreground mb-4">Age Distribution</h4>
              <div className="space-y-3">
                {analytics?.memberDemographics?.ageGroups?.map(group => (
                  <div key={group?.range}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{group?.range}</span>
                      <span className="text-sm font-medium text-foreground">{group?.percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${group?.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-card rounded-lg border border-border">
              <h4 className="font-medium text-foreground mb-4">Top Locations</h4>
              <div className="space-y-3">
                {analytics?.memberDemographics?.topLocations?.map(location => (
                  <div key={location?.country}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{location?.country}</span>
                      <span className="text-sm font-medium text-foreground">{location?.percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-secondary rounded-full"
                        style={{ width: `${location?.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityAnalyticsPanel;