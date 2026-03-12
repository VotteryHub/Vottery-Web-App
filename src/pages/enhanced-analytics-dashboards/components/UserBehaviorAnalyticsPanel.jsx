import React from 'react';
import Icon from '../../../components/AppIcon';

const UserBehaviorAnalyticsPanel = ({ data, timeframe }) => {
  if (!data) {
    return null;
  }

  const getImpactColor = (impact) => {
    if (impact === 'high') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    if (impact === 'medium') return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
  };

  const getTrendColor = (trend) => {
    if (trend?.includes('increasing')) return 'text-success';
    if (trend?.includes('decreasing')) return 'text-red-500';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-foreground mb-1">User Behavior Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Activity pattern recognition and retention forecasting with churn prediction
          </p>
        </div>
        <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
          <Icon name="Users" size={20} className="text-success" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-background border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Activity" size={16} className="text-primary" />
            Retention Forecast
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Current Retention Rate</span>
              <span className="text-lg font-bold text-foreground">
                {data?.retentionForecast?.currentRetentionRate?.toFixed(1)}%
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Predicted Retention Rate</span>
              <span className="text-lg font-bold text-primary">
                {data?.retentionForecast?.predictedRetentionRate?.toFixed(1)}%
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Trend</span>
              <span className={`text-sm font-medium ${getTrendColor(data?.retentionForecast?.trend)}`}>
                {data?.retentionForecast?.trend}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Confidence</span>
              <span className="text-sm font-medium text-foreground">
                {(data?.retentionForecast?.confidence * 100)?.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="AlertTriangle" size={16} className="text-red-500" />
            Churn Prediction
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">At-Risk Users</span>
              <span className="text-lg font-bold text-red-500">
                {data?.churnPrediction?.atRiskUsers?.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Predicted Churn Rate</span>
              <span className="text-lg font-bold text-foreground">
                {data?.churnPrediction?.churnRate}
              </span>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground mb-2">Risk Factors</p>
              <div className="flex flex-wrap gap-1">
                {data?.churnPrediction?.riskFactors?.slice(0, 3)?.map((factor, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded-full"
                  >
                    {factor}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background border border-border rounded-lg p-5 mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Target" size={16} className="text-secondary" />
          Activity Patterns
        </h3>
        
        <div className="space-y-3">
          {data?.activityPatterns?.map((pattern, index) => (
            <div key={index} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-foreground">{pattern?.pattern}</p>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getImpactColor(pattern?.impact)}`}>
                    {pattern?.impact} impact
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  Frequency: {pattern?.frequency} | Segment: {pattern?.userSegment}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Icon name="Shield" size={16} className="text-accent" />
          Prevention Strategies
        </h3>
        <div className="space-y-2">
          {data?.churnPrediction?.preventionStrategies?.map((strategy, index) => (
            <div key={index} className="flex items-start gap-2">
              <Icon name="CheckCircle" size={14} className="text-accent mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">{strategy}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserBehaviorAnalyticsPanel;