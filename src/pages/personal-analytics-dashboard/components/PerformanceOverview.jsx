import React from 'react';
import Icon from '../../../components/AppIcon';
import { stripeService } from '../../../services/stripeService';

const PerformanceOverview = ({ votingStats, earningsData, achievements, timeRange }) => {
  const kpiCards = [
    {
      label: 'Total Votes Cast',
      value: votingStats?.totalVotes?.toLocaleString() || '0',
      icon: 'Vote',
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary',
      subtitle: `${timeRange === 'all' ? 'All time' : timeRange?.replace('d', ' days')}`
    },
    {
      label: 'Elections Participated',
      value: votingStats?.electionsParticipated?.toString() || '0',
      icon: 'Trophy',
      bgColor: 'bg-secondary/10',
      iconColor: 'text-secondary',
      subtitle: 'Unique elections'
    },
    {
      label: 'Total Earnings',
      value: stripeService?.formatCurrency(earningsData?.totalEarnings || 0),
      icon: 'DollarSign',
      bgColor: 'bg-success/10',
      iconColor: 'text-success',
      subtitle: 'Lifetime winnings'
    },
    {
      label: 'Achievement Progress',
      value: `${achievements?.completionPercentage || 0}%`,
      icon: 'Award',
      bgColor: 'bg-accent/10',
      iconColor: 'text-accent',
      subtitle: `${achievements?.unlockedBadges || 0}/${achievements?.totalBadges || 0} badges`
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiCards?.map((card, index) => (
        <div
          key={index}
          className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 ${card?.bgColor} rounded-lg flex items-center justify-center`}>
              <Icon name={card?.icon} size={24} className={card?.iconColor} />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">{card?.label}</p>
          <p className="text-2xl md:text-3xl font-bold text-foreground mb-1">{card?.value}</p>
          <p className="text-xs text-muted-foreground">{card?.subtitle}</p>
        </div>
      ))}
    </div>
  );
};

export default PerformanceOverview;