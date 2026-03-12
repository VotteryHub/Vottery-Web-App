import React from 'react';
import Icon from '../../../components/AppIcon';

const FinancialOverviewPanel = ({ overview, timeRange, loading }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const metrics = [
    {
      label: 'Total Platform Revenue',
      value: `₹${overview?.totalRevenue?.toLocaleString() || 0}`,
      change: '+15.3%',
      trend: 'up',
      icon: 'DollarSign',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Active Prize Pools',
      value: `₹${overview?.totalPrizePools?.toLocaleString() || 0}`,
      change: '+12.8%',
      trend: 'up',
      icon: 'Award',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Participation Fees',
      value: `₹${overview?.totalParticipationFees?.toLocaleString() || 0}`,
      change: '+18.2%',
      trend: 'up',
      icon: 'Users',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      label: 'Advertiser Spending',
      value: `₹${overview?.totalAdvertiserSpending?.toLocaleString() || 0}`,
      change: '+9.5%',
      trend: 'up',
      icon: 'TrendingUp',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      label: 'Average ROI',
      value: `${overview?.averageROI?.toFixed(2) || 0}%`,
      change: '+5.7%',
      trend: 'up',
      icon: 'Target',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Active Zones',
      value: overview?.activeZones || 8,
      change: 'All operational',
      trend: 'stable',
      icon: 'MapPin',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
              Financial Overview
            </h2>
            <p className="text-sm text-muted-foreground">
              Real-time financial metrics across all 8 purchasing power zones
            </p>
          </div>
          <div className="px-3 py-1 rounded-full bg-green-500/10">
            <span className="text-xs font-medium text-green-500">Live Data</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics?.map((metric, index) => (
            <div key={index} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-full ${metric?.bgColor} flex items-center justify-center`}>
                  <Icon name={metric?.icon} size={20} className={metric?.color} />
                </div>
                <div className="flex items-center gap-1">
                  <Icon 
                    name={metric?.trend === 'up' ? 'TrendingUp' : metric?.trend === 'down' ? 'TrendingDown' : 'Minus'} 
                    size={14} 
                    className={metric?.trend === 'up' ? 'text-green-500' : metric?.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'} 
                  />
                  <span className={`text-xs font-medium ${
                    metric?.trend === 'up' ? 'text-green-500' : metric?.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
                  }`}>
                    {metric?.change}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{metric?.label}</p>
              <p className="text-2xl font-heading font-bold text-foreground font-data">
                {metric?.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Financial Performance Trends
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Revenue Growth Rate</span>
              <span className="text-lg font-bold text-green-500">+15.3%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">ROI Performance</span>
              <span className="text-lg font-bold text-blue-500">{overview?.averageROI?.toFixed(1) || 0}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${overview?.averageROI || 0}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialOverviewPanel;