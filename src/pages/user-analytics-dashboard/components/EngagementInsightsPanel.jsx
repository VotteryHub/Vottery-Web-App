import React from 'react';
import Icon from '../../../components/AppIcon';

const EngagementInsightsPanel = ({ insights, timeRange }) => {
  const engagementMetrics = [
    {
      label: 'Active Days',
      value: insights?.activeDays || 0,
      icon: 'Calendar',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Avg. Votes/Day',
      value: insights?.averageVotesPerDay || 0,
      icon: 'Activity',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Retention Rate',
      value: `${insights?.retentionRate || 0}%`,
      icon: 'TrendingUp',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Engagement Score',
      value: insights?.retentionRate > 70 ? 'High' : insights?.retentionRate > 40 ? 'Medium' : 'Low',
      icon: 'Zap',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const getEngagementLevel = () => {
    const rate = parseFloat(insights?.retentionRate || 0);
    if (rate >= 70) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-50' };
    if (rate >= 50) return { level: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-50' };
    if (rate >= 30) return { level: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    return { level: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-50' };
  };

  const engagementLevel = getEngagementLevel();

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground">Engagement Insights</h2>
        <Icon name="BarChart3" size={20} className="text-secondary" />
      </div>

      <div className="space-y-6">
        {/* Engagement Level */}
        <div className={`${engagementLevel?.bgColor} border border-${engagementLevel?.color?.replace('text-', '')} rounded-lg p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Engagement Level</p>
              <p className={`text-3xl font-bold ${engagementLevel?.color}`}>
                {engagementLevel?.level}
              </p>
            </div>
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <Icon name="Zap" size={32} className={engagementLevel?.color} />
            </div>
          </div>
        </div>

        {/* Engagement Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {engagementMetrics?.map((metric, index) => (
            <div key={index} className={`${metric?.bgColor} rounded-lg p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon name={metric?.icon} size={18} className={metric?.color} />
                <p className="text-xs text-muted-foreground">{metric?.label}</p>
              </div>
              <p className="text-2xl font-bold text-foreground">{metric?.value}</p>
            </div>
          ))}
        </div>

        {/* Engagement Breakdown */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Engagement Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Icon name="Vote" size={20} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Total Votes</span>
              </div>
              <span className="text-sm font-bold text-foreground">
                {insights?.totalVotes?.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Icon name="Trophy" size={20} className="text-secondary" />
                <span className="text-sm font-medium text-foreground">Unique Elections</span>
              </div>
              <span className="text-sm font-bold text-foreground">
                {insights?.uniqueElections || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Icon name="DollarSign" size={20} className="text-success" />
                <span className="text-sm font-medium text-foreground">Average ROI</span>
              </div>
              <span className="text-sm font-bold text-success">
                {insights?.averageROI || 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Engagement Tip */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Icon name="Lightbulb" size={20} className="text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900 mb-1">Engagement Tip</p>
              <p className="text-xs text-green-700">
                {insights?.retentionRate > 70
                  ? 'Your engagement is excellent! Keep your consistent voting pattern to maximize rewards.'
                  : insights?.retentionRate > 40
                  ? 'Good engagement! Try voting more frequently to unlock additional achievements and increase earnings.' :'Increase your engagement by participating in daily elections to improve your retention rate and unlock rewards.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngagementInsightsPanel;