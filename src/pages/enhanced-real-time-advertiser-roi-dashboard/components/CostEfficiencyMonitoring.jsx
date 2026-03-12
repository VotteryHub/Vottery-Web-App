import React from 'react';
import Icon from '../../../components/AppIcon';

const CostEfficiencyMonitoring = ({ data }) => {
  const costMetrics = [
    { label: 'Cost/Participant', value: `$${data?.costEfficiency?.costPerParticipant || 0}`, change: '-12%', positive: true },
    { label: 'Budget Utilization', value: `${data?.costEfficiency?.budgetUtilization || 0}%`, change: '+5%', positive: true },
    { label: 'Cost Savings', value: `$${data?.costEfficiency?.costSavings?.toLocaleString() || 0}`, change: '+$2.4K', positive: true }
  ];

  const budgetAlerts = [
    { campaign: 'Summer Product Launch', status: 'optimal', utilization: 87, remaining: 1638, message: 'On track for optimal ROI' },
    { campaign: 'Brand Awareness Q3', status: 'warning', utilization: 94, remaining: 730, message: 'Approaching budget limit' },
    { campaign: 'Holiday Special', status: 'critical', utilization: 98, remaining: 250, message: 'Budget nearly exhausted' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'optimal':
        return 'bg-green-100 text-green-700';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700';
      case 'critical':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'optimal':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'critical':
        return 'AlertCircle';
      default:
        return 'Info';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Cost Efficiency Monitoring
          </h2>
          <p className="text-sm text-muted-foreground">
            Real-time cost tracking and budget optimization
          </p>
        </div>
        <Icon name="DollarSign" size={24} className="text-accent" />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {costMetrics?.map((metric, index) => (
          <div key={index} className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-2">{metric?.label}</p>
            <p className="text-2xl font-heading font-bold text-foreground mb-1 font-data">
              {metric?.value}
            </p>
            <div className={`flex items-center gap-1 text-xs font-medium ${
              metric?.positive ? 'text-success' : 'text-destructive'
            }`}>
              <Icon name={metric?.positive ? 'TrendingDown' : 'TrendingUp'} size={12} />
              <span>{metric?.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Dynamic Cost-Per-Engagement
        </h3>
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-primary/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Current CPE</span>
              <span className="text-xl font-bold text-foreground font-data">$2.80</span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Target: $3.00</span>
              <span className="text-success font-medium">6.7% below target</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Best Performing</p>
              <p className="text-sm font-semibold text-success font-data">$2.10 (Zone 3)</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Needs Optimization</p>
              <p className="text-sm font-semibold text-destructive font-data">$3.80 (Zone 6)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Budget Utilization Alerts
        </h3>
        <div className="space-y-3">
          {budgetAlerts?.map((alert, index) => (
            <div key={index} className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-start gap-3">
                <Icon name={getStatusIcon(alert?.status)} size={20} className={alert?.status === 'optimal' ? 'text-success' : alert?.status === 'warning' ? 'text-yellow-600' : 'text-destructive'} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-foreground">{alert?.campaign}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(alert?.status)}`}>
                      {alert?.status}
                    </span>
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Budget Utilization</span>
                      <span className="font-semibold font-data">{alert?.utilization}%</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          alert?.status === 'optimal' ? 'bg-success' :
                          alert?.status === 'warning' ? 'bg-yellow-500' : 'bg-destructive'
                        }`}
                        style={{ width: `${alert?.utilization}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{alert?.message}</span>
                    <span className="font-semibold text-foreground font-data">${alert?.remaining} remaining</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-lg bg-accent/10">
        <div className="flex items-start gap-3">
          <Icon name="Lightbulb" size={20} className="text-accent mt-0.5" />
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-2">
              ROI Projection
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              Based on current performance trends, maintaining cost efficiency at $2.80 CPE will yield a projected ROI of <span className="font-semibold text-success">185%</span> by month end.
            </p>
            <p className="text-xs text-muted-foreground">
              Recommendation: Reallocate 15% of budget from Zone 6 to Zone 3 for optimal returns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostEfficiencyMonitoring;