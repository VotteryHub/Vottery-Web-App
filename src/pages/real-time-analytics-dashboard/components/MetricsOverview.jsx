import React from 'react';

import PlatformMetricsCard from '../../admin-control-center/components/PlatformMetricsCard';

const MetricsOverview = ({ engagement, elections, revenue, adROI }) => {
  const kpiMetrics = [
    {
      label: "Active Users",
      value: engagement?.activeUsers?.toLocaleString() || '0',
      trend: "+12%",
      icon: "Users",
      bgColor: "bg-primary/10",
      iconColor: "var(--color-primary)",
      subtitle: "Current period"
    },
    {
      label: "Concurrent Elections",
      value: elections?.activeElections?.toString() || '0',
      trend: "+5",
      icon: "Vote",
      bgColor: "bg-secondary/10",
      iconColor: "var(--color-secondary)",
      subtitle: "Currently active"
    },
    {
      label: "Total Revenue",
      value: `$${revenue?.totalRevenue || '0'}`,
      trend: "+18%",
      icon: "DollarSign",
      bgColor: "bg-success/10",
      iconColor: "var(--color-success)",
      subtitle: "Participation fees"
    },
    {
      label: "Ad Campaign ROI",
      value: `${adROI?.roi || '0'}%`,
      trend: adROI?.roi > 0 ? `+${adROI?.roi}%` : '0%',
      icon: "TrendingUp",
      bgColor: "bg-accent/10",
      iconColor: "var(--color-accent)",
      subtitle: "Return on investment"
    },
    {
      label: "Total Votes Cast",
      value: elections?.totalVotes?.toLocaleString() || '0',
      trend: "+23%",
      icon: "CheckCircle",
      bgColor: "bg-success/10",
      iconColor: "var(--color-success)",
      subtitle: "Across all elections"
    },
    {
      label: "Engagement Rate",
      value: `${engagement?.engagementRate || '0'}`,
      trend: "+8%",
      icon: "Activity",
      bgColor: "bg-primary/10",
      iconColor: "var(--color-primary)",
      subtitle: "Per post average"
    },
    {
      label: "Platform Fees",
      value: `$${revenue?.platformFees || '0'}`,
      trend: "+15%",
      icon: "Wallet",
      bgColor: "bg-accent/10",
      iconColor: "var(--color-accent)",
      subtitle: "Net platform revenue"
    },
    {
      label: "Ad Conversion Rate",
      value: `${adROI?.conversionRate || '0'}%`,
      trend: `+${adROI?.conversionRate || '0'}%`,
      icon: "Target",
      bgColor: "bg-secondary/10",
      iconColor: "var(--color-secondary)",
      subtitle: "Click to conversion"
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
        Key Performance Indicators
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiMetrics?.map((metric, index) => (
          <PlatformMetricsCard key={index} metric={metric} />
        ))}
      </div>
    </div>
  );
};

export default MetricsOverview;
