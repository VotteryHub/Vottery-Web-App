import React from 'react';
import Icon from '../../../components/AppIcon';

const CampaignPerformancePanel = ({ data, timeframe }) => {
  if (!data) {
    return null;
  }

  const getOptimizationColor = (potential) => {
    if (potential?.toLowerCase()?.includes('high')) return 'bg-success/10 text-success';
    if (potential?.toLowerCase()?.includes('medium')) return 'bg-accent/10 text-accent';
    return 'bg-gray-100 dark:bg-gray-800 text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-foreground mb-1">Campaign Performance</h2>
          <p className="text-sm text-muted-foreground">
            Predictive ROI calculations and automated budget allocation suggestions
          </p>
        </div>
        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
          <Icon name="Target" size={20} className="text-accent" />
        </div>
      </div>

      <div className="bg-background border border-border rounded-lg p-5 mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="DollarSign" size={16} className="text-success" />
          ROI Predictions
        </h3>
        
        <div className="space-y-3">
          {data?.roiPredictions?.map((prediction, index) => (
            <div key={index} className="flex items-center justify-between pb-3 border-b border-border last:border-0 last:pb-0">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-foreground">{prediction?.campaignType}</p>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getOptimizationColor(prediction?.optimizationPotential)}`}>
                    {prediction?.optimizationPotential}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Current: {prediction?.currentROI?.toFixed(1)}%</span>
                  <Icon name="ArrowRight" size={12} />
                  <span className="text-primary font-medium">Predicted: {prediction?.predictedROI?.toFixed(1)}%</span>
                  <span>({(prediction?.confidence * 100)?.toFixed(0)}% confidence)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-background border border-border rounded-lg p-5 mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={16} className="text-primary" />
          Engagement Optimization
        </h3>
        
        <div className="space-y-4">
          {data?.engagementOptimization?.map((optimization, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-foreground">{optimization?.metric}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">{optimization?.currentValue}</span>
                  <Icon name="ArrowRight" size={12} className="text-muted-foreground" />
                  <span className="text-primary font-medium">{optimization?.targetValue}</span>
                </div>
              </div>
              
              <div className="bg-background rounded-lg p-3 mb-2">
                <p className="text-xs text-muted-foreground mb-1">Recommendation</p>
                <p className="text-xs text-foreground">{optimization?.recommendation}</p>
              </div>
              
              <div className="flex items-start gap-2">
                <Icon name="Zap" size={12} className="text-accent mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">{optimization?.expectedImpact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-background border border-border rounded-lg p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="PieChart" size={16} className="text-secondary" />
          Budget Allocation Recommendations
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-3">Current Distribution</p>
            <div className="space-y-2">
              {data?.budgetAllocation?.currentDistribution?.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-xs text-foreground">{item?.channel}</span>
                  <span className="text-xs font-medium text-foreground">{item?.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-3">Recommended Distribution</p>
            <div className="space-y-2">
              {data?.budgetAllocation?.recommendedDistribution?.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-foreground">{item?.channel}</span>
                    <span className="text-xs font-medium text-primary">{item?.percentage}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item?.rationale}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-success/10 border border-success/20 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Icon name="TrendingUp" size={14} className="text-success" />
            <p className="text-xs text-foreground">
              Expected ROI Increase: <span className="font-bold text-success">{data?.budgetAllocation?.expectedROIIncrease}</span>
            </p>
          </div>
        </div>
      </div>

      {data?.automatedInsights && data?.automatedInsights?.length > 0 && (
        <div className="mt-6 bg-accent/10 border border-accent/20 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Icon name="Lightbulb" size={16} className="text-accent" />
            Automated Insights
          </h3>
          <div className="space-y-2">
            {data?.automatedInsights?.map((insight, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignPerformancePanel;