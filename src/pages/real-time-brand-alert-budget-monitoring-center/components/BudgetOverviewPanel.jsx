import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BudgetOverviewPanel = ({ campaigns, analytics, timeRange }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'critical':
        return 'text-destructive';
      case 'warning':
        return 'text-warning';
      case 'healthy':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'critical':
        return 'AlertTriangle';
      case 'warning':
        return 'AlertCircle';
      case 'healthy':
        return 'CheckCircle';
      default:
        return 'Circle';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon name="DollarSign" className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Budget Overview</h2>
            <p className="text-sm text-muted-foreground">Active campaign budgets and spending velocity</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Budget</span>
            <Icon name="TrendingUp" className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            ${analytics?.totalBudget?.toLocaleString()}
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Spent</span>
            <Icon name="DollarSign" className="w-4 h-4 text-warning" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            ${analytics?.totalSpent?.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {((analytics?.totalSpent / analytics?.totalBudget) * 100)?.toFixed(1)}% of total
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Critical Campaigns</span>
            <Icon name="AlertTriangle" className="w-4 h-4 text-destructive" />
          </div>
          <div className="text-2xl font-bold text-destructive">
            {analytics?.criticalCampaigns}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            ≥90% budget spent
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Avg Burn Rate</span>
            <Icon name="Activity" className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            ${analytics?.averageBurnRate?.toFixed(0)}/day
          </div>
        </div>
      </div>

      {/* Campaign List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground mb-3">Active Campaigns</h3>
        {campaigns?.map((campaign) => (
          <div
            key={campaign?.id}
            className="bg-background border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-foreground">{campaign?.name}</h4>
                  <Icon
                    name={getStatusIcon(campaign?.status)}
                    className={`w-4 h-4 ${getStatusColor(campaign?.status)}`}
                  />
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Budget: ${campaign?.budgetTotal?.toLocaleString()}</span>
                  <span>Spent: ${campaign?.budgetSpent?.toLocaleString()}</span>
                  <span>Burn Rate: ${campaign?.burnRate}/day</span>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${getStatusColor(campaign?.status)}`}>
                  {campaign?.spendPercentage}%
                </div>
                <div className="text-xs text-muted-foreground">spent</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden mb-3">
              <div
                className={`absolute top-0 left-0 h-full transition-all ${
                  campaign?.spendPercentage >= 90
                    ? 'bg-destructive'
                    : campaign?.spendPercentage >= 75
                    ? 'bg-warning' :'bg-success'
                }`}
                style={{ width: `${Math.min(campaign?.spendPercentage, 100)}%` }}
              />
              {/* 90% Threshold Marker */}
              <div className="absolute top-0 left-[90%] w-0.5 h-full bg-destructive/50" />
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">
                  Zones: {campaign?.zones?.join(', ')}
                </span>
                <span className={getStatusColor(campaign?.status)}>
                  Projected exhaustion: {new Date(campaign?.projectedExhaustion)?.toLocaleDateString()}
                </span>
              </div>
              {campaign?.spendPercentage >= 90 && (
                <Button size="sm" variant="destructive">
                  <Icon name="Bell" className="w-3 h-3 mr-1" />
                  Alert Triggered
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetOverviewPanel;