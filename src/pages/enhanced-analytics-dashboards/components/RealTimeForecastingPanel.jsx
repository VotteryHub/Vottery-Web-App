import React from 'react';
import Icon from '../../../components/AppIcon';

const RealTimeForecastingPanel = ({ data, timeframe }) => {
  if (!data?.contentPerformance) {
    return null;
  }

  const getPerformanceColor = (current, predicted) => {
    const change = ((predicted - current) / current) * 100;
    if (change > 10) return 'text-success';
    if (change < -10) return 'text-red-500';
    return 'text-accent';
  };

  const getPerformanceIcon = (current, predicted) => {
    const change = ((predicted - current) / current) * 100;
    if (change > 10) return 'TrendingUp';
    if (change < -10) return 'TrendingDown';
    return 'Minus';
  };

  const calculateChange = (current, predicted) => {
    const change = ((predicted - current) / current) * 100;
    return change > 0 ? `+${change?.toFixed(1)}%` : `${change?.toFixed(1)}%`;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-foreground mb-1">Real-Time Forecasting</h2>
          <p className="text-sm text-muted-foreground">
            Content performance predictions with automated alert triggers
          </p>
        </div>
        <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
          <Icon name="Activity" size={20} className="text-secondary" />
        </div>
      </div>

      <div className="space-y-4">
        {data?.contentPerformance?.map((content, index) => (
          <div
            key={index}
            className="bg-background border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-foreground">{content?.contentType}</h3>
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full bg-card ${getPerformanceColor(content?.currentEngagement, content?.predictedEngagement)}`}>
                    <Icon name={getPerformanceIcon(content?.currentEngagement, content?.predictedEngagement)} size={12} />
                    <span className="text-xs font-medium">
                      {calculateChange(content?.currentEngagement, content?.predictedEngagement)}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Current Engagement</p>
                    <p className="text-lg font-bold text-foreground">{content?.currentEngagement?.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Predicted Engagement</p>
                    <p className="text-lg font-bold text-primary">{content?.predictedEngagement?.toFixed(1)}</p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Icon name="Zap" size={14} className="text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-foreground mb-1">Optimization Recommendation</p>
                      <p className="text-xs text-muted-foreground">{content?.recommendation}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-accent/10 border border-accent/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Bell" size={16} className="text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Automated Alert System</h3>
            <p className="text-xs text-muted-foreground">
              Significant deviations from predictions will trigger automatic alerts for immediate action.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeForecastingPanel;