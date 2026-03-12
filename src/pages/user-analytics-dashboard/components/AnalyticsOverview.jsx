import React from 'react';
import Icon from '../../../components/AppIcon';
import { stripeService } from '../../../services/stripeService';

const AnalyticsOverview = ({ engagementInsights, achievementProgress, timeRange }) => {
  const kpiCards = [
    {
      label: 'Total Votes Cast',
      value: engagementInsights?.totalVotes?.toLocaleString() || '0',
      icon: 'Vote',
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary',
      subtitle: `${timeRange === 'all' ? 'All time' : timeRange?.replace('d', ' days')}`
    },
    {
      label: 'Unique Elections',
      value: engagementInsights?.uniqueElections?.toString() || '0',
      icon: 'Trophy',
      bgColor: 'bg-secondary/10',
      iconColor: 'text-secondary',
      subtitle: 'Elections participated'
    },
    {
      label: 'Total Earnings',
      value: stripeService?.formatCurrency(engagementInsights?.totalEarnings || 0),
      icon: 'DollarSign',
      bgColor: 'bg-success/10',
      iconColor: 'text-success',
      subtitle: 'Across all zones'
    },
    {
      label: 'Average ROI',
      value: `${engagementInsights?.averageROI || 0}%`,
      icon: 'TrendingUp',
      bgColor: 'bg-accent/10',
      iconColor: 'text-accent',
      subtitle: 'Per election'
    },
    {
      label: 'Retention Rate',
      value: `${engagementInsights?.retentionRate || 0}%`,
      icon: 'Activity',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      subtitle: 'Daily engagement'
    },
    {
      label: 'Achievement Progress',
      value: `${achievementProgress?.completionPercentage || 0}%`,
      icon: 'Award',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      subtitle: `${achievementProgress?.unlockedBadges || 0}/${achievementProgress?.totalBadges || 0} badges`
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpiCards?.map((card, index) => (
        <div
          key={index}
          className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`w-11 h-11 ${card?.bgColor} rounded-lg flex items-center justify-center`}>
              <Icon name={card?.icon} size={22} className={card?.iconColor} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-1">{card?.label}</p>
          <p className="text-xl md:text-2xl font-bold text-foreground mb-1">{card?.value}</p>
          <p className="text-xs text-muted-foreground">{card?.subtitle}</p>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsOverview;