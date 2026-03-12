import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SpendingAnalyticsPanel = ({ campaigns, timeRange }) => {
  const calculateRecommendations = (campaign) => {
    const recommendations = [];

    if (campaign?.spendPercentage >= 90) {
      recommendations?.push({
        type: 'critical',
        icon: 'AlertTriangle',
        title: 'Immediate Action Required',
        description: `Campaign at ${campaign?.spendPercentage}% budget. Consider pausing or increasing budget.`,
        actions: ['Pause Campaign', 'Increase Budget by 20%']
      });
    } else if (campaign?.spendPercentage >= 75) {
      recommendations?.push({
        type: 'warning',
        icon: 'AlertCircle',
        title: 'Budget Optimization Recommended',
        description: 'High spend rate detected. Review targeting and bid strategy.',
        actions: ['Adjust Bids', 'Refine Targeting']
      });
    }

    // Burn rate analysis
    const daysRemaining = (campaign?.budgetTotal - campaign?.budgetSpent) / campaign?.burnRate;
    if (daysRemaining < 3 && campaign?.spendPercentage < 90) {
      recommendations?.push({
        type: 'info',
        icon: 'TrendingUp',
        title: 'Budget Exhaustion Imminent',
        description: `Budget will be exhausted in ${daysRemaining?.toFixed(1)} days at current burn rate.`,
        actions: ['Extend Campaign', 'Reduce Daily Spend']
      });
    }

    return recommendations;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon name="Activity" className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Spending Analytics</h2>
          <p className="text-sm text-muted-foreground">Burn rate calculations and optimization recommendations</p>
        </div>
      </div>

      <div className="space-y-6">
        {campaigns?.map((campaign) => {
          const recommendations = calculateRecommendations(campaign);
          const daysRemaining = (campaign?.budgetTotal - campaign?.budgetSpent) / campaign?.burnRate;
          const dailyBudget = campaign?.budgetTotal / 30; // Assuming 30-day campaign
          const spendEfficiency = (campaign?.burnRate / dailyBudget) * 100;

          return (
            <div
              key={campaign?.id}
              className="bg-background border border-border rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{campaign?.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Burn Rate: ${campaign?.burnRate}/day</span>
                    <span>Days Remaining: {daysRemaining?.toFixed(1)}</span>
                    <span>Efficiency: {spendEfficiency?.toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              {/* Analytics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-card border border-border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="TrendingUp" className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Projected Completion</span>
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {new Date(campaign?.projectedExhaustion)?.toLocaleDateString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {Math.ceil(daysRemaining)} days from now
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="DollarSign" className="w-4 h-4 text-warning" />
                    <span className="text-xs text-muted-foreground">Remaining Budget</span>
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    ${(campaign?.budgetTotal - campaign?.budgetSpent)?.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {(100 - campaign?.spendPercentage)?.toFixed(1)}% available
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Zap" className="w-4 h-4 text-success" />
                    <span className="text-xs text-muted-foreground">Spend Velocity</span>
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {spendEfficiency?.toFixed(0)}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {spendEfficiency > 100 ? 'Above' : 'Below'} target
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              {recommendations?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Automated Recommendations</h4>
                  {recommendations?.map((rec, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-3 ${
                        rec?.type === 'critical' ? 'border-destructive/30 bg-destructive/5' :
                        rec?.type === 'warning'? 'border-warning/30 bg-warning/5' : 'border-primary/30 bg-primary/5'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon
                          name={rec?.icon}
                          className={`w-5 h-5 mt-0.5 ${
                            rec?.type === 'critical' ? 'text-destructive' :
                            rec?.type === 'warning'? 'text-warning' : 'text-primary'
                          }`}
                        />
                        <div className="flex-1">
                          <h5 className="font-semibold text-foreground text-sm mb-1">{rec?.title}</h5>
                          <p className="text-xs text-muted-foreground mb-3">{rec?.description}</p>
                          <div className="flex gap-2">
                            {rec?.actions?.map((action, actionIndex) => (
                              <Button
                                key={actionIndex}
                                size="sm"
                                variant="outline"
                              >
                                {action}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpendingAnalyticsPanel;