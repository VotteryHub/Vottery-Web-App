import React from 'react';
import Icon from '../../../components/AppIcon';

const PredictiveOverviewPanel = ({ data, timeframe }) => {
  if (!data) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <p className="text-muted-foreground text-center">No predictive data available</p>
      </div>
    );
  }

  const kpiCards = [
    {
      label: 'Engagement Rate Forecast',
      current: `${data?.engagementForecast?.currentRate?.toFixed(1)}%`,
      predicted: `${data?.engagementForecast?.predictedRate?.toFixed(1)}%`,
      trend: data?.engagementForecast?.trend,
      confidence: data?.engagementForecast?.confidenceInterval,
      icon: 'TrendingUp',
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary'
    },
    {
      label: 'User Growth Projection',
      current: data?.userGrowthProjection?.currentUsers?.toLocaleString(),
      predicted: data?.userGrowthProjection?.projectedUsers?.toLocaleString(),
      trend: data?.userGrowthProjection?.growthRate,
      confidence: `${(data?.userGrowthProjection?.confidence * 100)?.toFixed(0)}% confidence`,
      icon: 'Users',
      bgColor: 'bg-secondary/10',
      iconColor: 'text-secondary'
    }
  ];

  const getTrendIcon = (trend) => {
    if (trend === 'increasing') return 'TrendingUp';
    if (trend === 'decreasing') return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = (trend) => {
    if (trend === 'increasing') return 'text-success';
    if (trend === 'decreasing') return 'text-red-500';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-foreground mb-1">Predictive Overview</h2>
          <p className="text-sm text-muted-foreground">
            AI-powered engagement forecasting for next {timeframe?.replace('d', ' days')}
          </p>
        </div>
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="BarChart3" size={20} className="text-primary" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {kpiCards?.map((card, index) => (
          <div
            key={index}
            className="bg-background border border-border rounded-lg p-5 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 ${card?.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon name={card?.icon} size={22} className={card?.iconColor} />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-background ${getTrendColor(card?.trend)}`}>
                <Icon name={getTrendIcon(card?.trend)} size={14} />
                <span className="text-xs font-medium">{card?.trend}</span>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mb-2">{card?.label}</p>
            
            <div className="flex items-baseline gap-3 mb-2">
              <div>
                <p className="text-xs text-muted-foreground">Current</p>
                <p className="text-xl font-bold text-foreground">{card?.current}</p>
              </div>
              <Icon name="ArrowRight" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Predicted</p>
                <p className="text-xl font-bold text-primary">{card?.predicted}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Icon name="Info" size={12} />
              <span>{card?.confidence}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-background border border-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Icon name="Lightbulb" size={16} className="text-accent" />
          Key Predictive Insights
        </h3>
        <div className="space-y-2">
          {data?.keyInsights?.map((insight, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictiveOverviewPanel;