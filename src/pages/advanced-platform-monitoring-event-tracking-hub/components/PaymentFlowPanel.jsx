import React from 'react';
import Icon from '../../../components/AppIcon';

const PaymentFlowPanel = ({ data, timeRange }) => {
  if (!data) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <p className="text-muted-foreground text-center">No payment flow data available</p>
      </div>
    );
  }

  const overviewMetrics = [
    {
      label: 'Total Transactions',
      value: data?.totalTransactions || 0,
      icon: 'CreditCard',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Success Rate',
      value: `${data?.successRate || 0}%`,
      icon: 'CheckCircle',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Failed Transactions',
      value: data?.failedTransactions || 0,
      icon: 'XCircle',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
    {
      label: 'Pending',
      value: data?.pendingTransactions || 0,
      icon: 'Clock',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-1">
              Payment Flow Optimization
            </h2>
            <p className="text-sm text-muted-foreground">
              Transaction success rates and processing bottleneck analysis
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Icon name="TrendingUp" size={16} className="text-blue-500" />
            <span className="text-sm font-medium text-blue-500">
              {data?.successRate || 0}% Success
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {overviewMetrics?.map((metric, index) => (
            <div key={index} className="bg-background rounded-lg border border-border p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-lg ${metric?.bgColor} flex items-center justify-center`}>
                  <Icon name={metric?.icon} size={20} className={metric?.color} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">{metric?.label}</p>
                  <p className="text-2xl font-bold text-foreground">{metric?.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-heading font-bold text-foreground mb-4">
          Zone Performance Breakdown
        </h3>
        <div className="space-y-4">
          {Object.entries(data?.zoneBreakdown || {})?.map(([zone, metrics]) => {
            const zoneSuccessRate = metrics?.count > 0 ? (metrics?.success / metrics?.count) * 100 : 0;
            return (
              <div key={zone} className="bg-background rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon name="MapPin" size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Zone {zone}</p>
                      <p className="text-xs text-muted-foreground">
                        {metrics?.count || 0} transactions • ${(metrics?.revenue || 0)?.toFixed(2)} revenue
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">{zoneSuccessRate?.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">Success Rate</p>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      zoneSuccessRate >= 90
                        ? 'bg-gradient-to-r from-green-500 to-green-600'
                        : zoneSuccessRate >= 70
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :'bg-gradient-to-r from-red-500 to-red-600'
                    }`}
                    style={{ width: `${zoneSuccessRate}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-green-500">{metrics?.success || 0} successful</span>
                  <span className="text-red-500">{metrics?.failed || 0} failed</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {data?.bottlenecks && data?.bottlenecks?.length > 0 && (
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-heading font-bold text-foreground mb-4">
            Identified Bottlenecks & Recommendations
          </h3>
          <div className="space-y-3">
            {data?.bottlenecks?.map((bottleneck, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <Icon name="AlertTriangle" size={20} className="text-red-500 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-red-500">Zone {bottleneck?.zone} - High Failure Rate</p>
                    <span className="text-xs font-bold text-red-500">{bottleneck?.failureRate}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {bottleneck?.failedCount} failed transactions detected
                  </p>
                  <p className="text-xs text-foreground font-medium">
                    💡 {bottleneck?.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-heading font-bold text-foreground mb-4">
          Optimization Recommendations
        </h3>
        <div className="space-y-3">
          {parseFloat(data?.successRate) < 95 && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <Icon name="Zap" size={20} className="text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-500 mb-1">Improve Success Rate</p>
                <p className="text-xs text-muted-foreground">
                  Current success rate is {data?.successRate}%. Target 95%+ by optimizing payment gateway integration and retry logic.
                </p>
              </div>
            </div>
          )}
          {data?.pendingTransactions > 10 && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <Icon name="Clock" size={20} className="text-orange-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-500 mb-1">Reduce Pending Transactions</p>
                <p className="text-xs text-muted-foreground">
                  {data?.pendingTransactions} transactions are pending. Implement automated status checks and timeout handling.
                </p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Icon name="TrendingUp" size={20} className="text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-500 mb-1">Revenue Optimization</p>
              <p className="text-xs text-muted-foreground">
                Focus on high-performing zones and investigate underperforming regions for potential improvements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFlowPanel;