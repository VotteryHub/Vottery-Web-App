import React from 'react';
import Icon from '../../../components/AppIcon';

const DashboardOverview = ({ data }) => {
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    })?.format(amount);
  };

  const metrics = [
    {
      label: 'Total Payouts',
      value: formatCurrency(data?.totalPayouts),
      icon: 'DollarSign',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: '+12.5%',
      changeType: 'positive'
    },
    {
      label: 'Active Settlements',
      value: data?.activeSettlements,
      icon: 'Activity',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      change: '+5',
      changeType: 'positive'
    },
    {
      label: 'Pending Amount',
      value: formatCurrency(data?.pendingAmount),
      icon: 'Clock',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      change: '-8.2%',
      changeType: 'negative'
    },
    {
      label: 'Completed Today',
      value: data?.completedToday,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: '+3',
      changeType: 'positive'
    },
    {
      label: 'Avg Processing Time',
      value: `${data?.avgProcessingTime}h`,
      icon: 'Timer',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: '-0.3h',
      changeType: 'positive'
    },
    {
      label: 'Success Rate',
      value: `${data?.successRate}%`,
      icon: 'TrendingUp',
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: '+0.5%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {metrics?.map((metric, index) => (
        <div key={index} className="bg-card rounded-lg border border-border p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg ${metric?.bgColor} flex items-center justify-center`}>
              <Icon name={metric?.icon} size={20} className={metric?.color} />
            </div>
            <span className={`text-xs font-medium ${
              metric?.changeType === 'positive' ? 'text-success' : 'text-destructive'
            }`}>
              {metric?.change}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-1">{metric?.label}</p>
          <p className="text-xl font-heading font-bold text-foreground">{metric?.value}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardOverview;