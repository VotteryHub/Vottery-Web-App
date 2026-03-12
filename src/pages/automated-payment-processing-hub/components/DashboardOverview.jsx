import React from 'react';
import Icon from '../../../components/AppIcon';

const DashboardOverview = ({ data }) => {
  const metrics = [
    {
      label: 'Processing Rate',
      value: `${data?.systemHealth?.processingRate || 0}%`,
      icon: 'Zap',
      color: 'bg-primary/10 text-primary',
      trend: '+2.3%',
      trendUp: true
    },
    {
      label: 'Avg Processing Time',
      value: `${data?.systemHealth?.avgProcessingTime || 0}s`,
      icon: 'Clock',
      color: 'bg-secondary/10 text-secondary',
      trend: '-0.5s',
      trendUp: true
    },
    {
      label: 'Success Rate',
      value: `${data?.systemHealth?.successRate || 0}%`,
      icon: 'CheckCircle',
      color: 'bg-success/10 text-success',
      trend: '+0.8%',
      trendUp: true
    },
    {
      label: 'Active Processors',
      value: data?.systemHealth?.activeProcessors || 0,
      icon: 'Server',
      color: 'bg-accent/10 text-accent',
      trend: 'All Online',
      trendUp: true
    }
  ];

  const queueStats = [
    { label: 'Pending Transactions', value: data?.transactions?.length || 0, icon: 'Clock' },
    { label: 'Processing Queue', value: data?.payoutQueue?.length || 0, icon: 'Loader' },
    { label: 'Completed Today', value: 342, icon: 'CheckCircle' },
    { label: 'Failed/Retry', value: 8, icon: 'AlertCircle' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics?.map((metric, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-full ${metric?.color} flex items-center justify-center`}>
                <Icon name={metric?.icon} size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${
                metric?.trendUp ? 'text-success' : 'text-destructive'
              }`}>
                <Icon name={metric?.trendUp ? 'TrendingUp' : 'TrendingDown'} size={14} />
                <span>{metric?.trend}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{metric?.label}</p>
            <p className="text-3xl font-heading font-bold text-foreground font-data">
              {metric?.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-semibold text-foreground">
              Transaction Queue Status
            </h2>
            <Icon name="Activity" size={24} className="text-primary" />
          </div>
          <div className="space-y-4">
            {queueStats?.map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name={stat?.icon} size={20} className="text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{stat?.label}</span>
                </div>
                <span className="text-2xl font-heading font-bold text-foreground font-data">
                  {stat?.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-semibold text-foreground">
              System Health Indicators
            </h2>
            <Icon name="Shield" size={24} className="text-success" />
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-success/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">PCI DSS Compliance</span>
                <Icon name="CheckCircle" size={20} className="text-success" />
              </div>
              <p className="text-xs text-muted-foreground">All security protocols active</p>
            </div>
            <div className="p-4 rounded-lg bg-success/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Fraud Detection</span>
                <Icon name="Shield" size={20} className="text-success" />
              </div>
              <p className="text-xs text-muted-foreground">AI monitoring active • 0 alerts</p>
            </div>
            <div className="p-4 rounded-lg bg-success/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Multi-Signature Auth</span>
                <Icon name="Key" size={20} className="text-success" />
              </div>
              <p className="text-xs text-muted-foreground">Enabled for transactions &gt; $10,000</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Processing Volume (Last 24 Hours)
          </h2>
          <Icon name="BarChart3" size={24} className="text-primary" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-lg bg-primary/10">
            <p className="text-sm text-muted-foreground mb-2">Prize Payouts</p>
            <p className="text-3xl font-heading font-bold text-foreground mb-1 font-data">$124,580</p>
            <p className="text-xs text-muted-foreground">186 transactions</p>
          </div>
          <div className="p-6 rounded-lg bg-secondary/10">
            <p className="text-sm text-muted-foreground mb-2">Participation Fees</p>
            <p className="text-3xl font-heading font-bold text-foreground mb-1 font-data">$89,320</p>
            <p className="text-xs text-muted-foreground">1,247 transactions</p>
          </div>
          <div className="p-6 rounded-lg bg-accent/10">
            <p className="text-sm text-muted-foreground mb-2">Advertiser Billing</p>
            <p className="text-3xl font-heading font-bold text-foreground mb-1 font-data">$45,670</p>
            <p className="text-xs text-muted-foreground">23 invoices</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;