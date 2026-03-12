import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const AudienceGrowthPanel = ({ timeRange }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    setLoading(true);
    try {
      const mockData = {
        growthMetrics: {
          dailyActiveUsers: 12456,
          weeklyActiveUsers: 34567,
          monthlyActiveUsers: 45892,
          retentionRate: 85.3
        },
        acquisitionChannels: [
          { channel: 'Organic Search', users: 15678, percentage: 34.2 },
          { channel: 'Social Media', users: 12456, percentage: 27.1 },
          { channel: 'Direct', users: 9876, percentage: 21.5 },
          { channel: 'Referral', users: 5432, percentage: 11.8 },
          { channel: 'Email', users: 2450, percentage: 5.4 }
        ],
        demographicExpansion: {
          ageGroups: [
            { range: '18-24', growth: '+25%', users: 11234 },
            { range: '25-34', growth: '+18%', users: 16789 },
            { range: '35-44', growth: '+12%', users: 10123 },
            { range: '45+', growth: '+8%', users: 7746 }
          ],
          geographicReach: [
            { region: 'North America', users: 18456, growth: '+15%' },
            { region: 'Europe', users: 12345, growth: '+22%' },
            { region: 'Asia', users: 10234, growth: '+28%' },
            { region: 'Others', users: 4857, growth: '+10%' }
          ]
        },
        growthTrend: [
          { month: 'Jan', users: 35000 },
          { month: 'Feb', users: 37500 },
          { month: 'Mar', users: 40200 },
          { month: 'Apr', users: 42800 },
          { month: 'May', users: 45892 }
        ]
      };

      setData(mockData);
    } catch (error) {
      console.error('Error loading audience growth data:', error);
    } finally {
      setLoading(false);
    }
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
      {/* Growth Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 bg-card rounded-xl border border-border">
          <Icon name="Users" size={24} className="text-primary mb-3" />
          <p className="text-3xl font-bold text-foreground mb-2">
            {data?.growthMetrics?.dailyActiveUsers?.toLocaleString()}
          </p>
          <p className="text-sm font-medium text-foreground">Daily Active Users</p>
        </div>
        <div className="p-6 bg-card rounded-xl border border-border">
          <Icon name="Calendar" size={24} className="text-secondary mb-3" />
          <p className="text-3xl font-bold text-foreground mb-2">
            {data?.growthMetrics?.weeklyActiveUsers?.toLocaleString()}
          </p>
          <p className="text-sm font-medium text-foreground">Weekly Active Users</p>
        </div>
        <div className="p-6 bg-card rounded-xl border border-border">
          <Icon name="CalendarDays" size={24} className="text-success mb-3" />
          <p className="text-3xl font-bold text-foreground mb-2">
            {data?.growthMetrics?.monthlyActiveUsers?.toLocaleString()}
          </p>
          <p className="text-sm font-medium text-foreground">Monthly Active Users</p>
        </div>
        <div className="p-6 bg-card rounded-xl border border-border">
          <Icon name="Repeat" size={24} className="text-warning mb-3" />
          <p className="text-3xl font-bold text-foreground mb-2">
            {data?.growthMetrics?.retentionRate}%
          </p>
          <p className="text-sm font-medium text-foreground">Retention Rate</p>
        </div>
      </div>

      {/* Growth Trend Chart */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
          User Growth Trend
        </h3>
        <div className="flex items-end justify-between gap-4 h-64">
          {data?.growthTrend?.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-primary/20 rounded-t-lg relative" style={{ height: `${(item?.users / 50000) * 100}%` }}>
                <div className="absolute inset-0 bg-primary rounded-t-lg" />
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-foreground">
                  {(item?.users / 1000)?.toFixed(0)}k
                </span>
              </div>
              <span className="text-sm text-muted-foreground">{item?.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Acquisition Channels */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
          User Acquisition Channels
        </h3>
        <div className="space-y-4">
          {data?.acquisitionChannels?.map((channel, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{channel?.channel}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {channel?.users?.toLocaleString()} users
                  </span>
                  <span className="text-sm font-medium text-primary">{channel?.percentage}%</span>
                </div>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${channel?.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demographic Expansion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
            Age Group Expansion
          </h3>
          <div className="space-y-4">
            {data?.demographicExpansion?.ageGroups?.map((group, index) => (
              <div key={index} className="p-4 bg-background rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{group?.range}</span>
                  <span className="text-sm font-medium text-success">{group?.growth}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {group?.users?.toLocaleString()} users
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
            Geographic Reach
          </h3>
          <div className="space-y-4">
            {data?.demographicExpansion?.geographicReach?.map((region, index) => (
              <div key={index} className="p-4 bg-background rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{region?.region}</span>
                  <span className="text-sm font-medium text-success">{region?.growth}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {region?.users?.toLocaleString()} users
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudienceGrowthPanel;