import React from 'react';
import Icon from '../../../components/AppIcon';

const LiveMonitoringPanel = ({ metrics, effectiveness, settings }) => {
  const latestMetric = metrics?.[0];

  const monitoringCards = [
    {
      label: 'Total Impressions',
      value: effectiveness?.totalImpressions?.toLocaleString() || '0',
      icon: 'Eye',
      color: 'primary',
      subtitle: 'Last 24 hours'
    },
    {
      label: 'Election Content Served',
      value: `${effectiveness?.actualElectionPercentage || 0}%`,
      icon: 'Vote',
      color: 'primary',
      subtitle: `Target: ${settings?.electionContentPercentage || 50}%`
    },
    {
      label: 'Social Media Served',
      value: `${effectiveness?.actualSocialPercentage || 0}%`,
      icon: 'MessageCircle',
      color: 'secondary',
      subtitle: `Target: ${settings?.socialMediaPercentage || 50}%`
    },
    {
      label: 'Election Engagement',
      value: `${effectiveness?.electionEngagement || 0}%`,
      icon: 'TrendingUp',
      color: 'success',
      subtitle: 'Engagement rate'
    },
    {
      label: 'Social Engagement',
      value: `${effectiveness?.socialEngagement || 0}%`,
      icon: 'Heart',
      color: 'success',
      subtitle: 'Engagement rate'
    },
    {
      label: 'Avg Session Duration',
      value: `${Math.floor((effectiveness?.averageSessionDuration || 0) / 60)}m`,
      icon: 'Clock',
      color: 'accent',
      subtitle: `${effectiveness?.averageSessionDuration || 0}s total`
    },
    {
      label: 'Bounce Rate',
      value: `${effectiveness?.bounceRate || 0}%`,
      icon: 'ArrowLeft',
      color: 'warning',
      subtitle: 'Users leaving quickly'
    },
    {
      label: 'Conversion Rate',
      value: `${effectiveness?.conversionRate || 0}%`,
      icon: 'Target',
      color: 'success',
      subtitle: 'Vote participation'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Real-time Status Banner */}
      <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
              <Icon name="Activity" size={24} className="text-success animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
                Live Monitoring Dashboard
              </h2>
              <p className="text-sm text-muted-foreground">
                Real-time feed composition and engagement metrics • Auto-refresh: 15s
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">System Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-semibold text-success">Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monitoring Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {monitoringCards?.map((card, index) => (
          <div key={index} className="card hover:shadow-democratic-md transition-all duration-250">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${card?.color}/10`}>
                <Icon name={card?.icon} size={20} className={`text-${card?.color}`} />
              </div>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">{card?.label}</h3>
            <p className="text-2xl font-heading font-bold text-foreground font-data mb-1">
              {card?.value}
            </p>
            <p className="text-xs text-muted-foreground">{card?.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Distribution Accuracy */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
              Distribution Accuracy
            </h3>
            <p className="text-sm text-muted-foreground">
              How closely actual distribution matches target percentages
            </p>
          </div>
          <Icon name="Target" size={24} className="text-primary" />
        </div>

        <div className="space-y-4">
          {/* Election Content Accuracy */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Election Content</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Target: {settings?.electionContentPercentage || 50}%
                </span>
                <span className="text-xs font-semibold text-primary">
                  Actual: {effectiveness?.actualElectionPercentage || 0}%
                </span>
              </div>
            </div>
            <div className="relative h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
                style={{ width: `${effectiveness?.actualElectionPercentage || 0}%` }}
              />
              <div
                className="absolute top-0 h-full w-0.5 bg-primary-foreground"
                style={{ left: `${settings?.electionContentPercentage || 50}%` }}
              />
            </div>
          </div>

          {/* Social Media Accuracy */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Social Media Content</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Target: {settings?.socialMediaPercentage || 50}%
                </span>
                <span className="text-xs font-semibold text-secondary">
                  Actual: {effectiveness?.actualSocialPercentage || 0}%
                </span>
              </div>
            </div>
            <div className="relative h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-secondary transition-all duration-500"
                style={{ width: `${effectiveness?.actualSocialPercentage || 0}%` }}
              />
              <div
                className="absolute top-0 h-full w-0.5 bg-secondary-foreground"
                style={{ left: `${settings?.socialMediaPercentage || 50}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Comparison */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
              Engagement by Content Type
            </h3>
            <p className="text-sm text-muted-foreground">
              User interaction rates for each content category
            </p>
          </div>
          <Icon name="BarChart3" size={24} className="text-primary" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Vote" size={20} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Election Content</span>
            </div>
            <p className="text-3xl font-heading font-bold text-primary font-data mb-1">
              {effectiveness?.electionEngagement || 0}%
            </p>
            <p className="text-xs text-muted-foreground">Engagement Rate</p>
          </div>

          <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/20">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="MessageCircle" size={20} className="text-secondary" />
              <span className="text-sm font-medium text-foreground">Social Media</span>
            </div>
            <p className="text-3xl font-heading font-bold text-secondary font-data mb-1">
              {effectiveness?.socialEngagement || 0}%
            </p>
            <p className="text-xs text-muted-foreground">Engagement Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMonitoringPanel;