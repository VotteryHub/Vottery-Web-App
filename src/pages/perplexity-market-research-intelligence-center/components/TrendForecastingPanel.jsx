import React from 'react';
import Icon from '../../../components/AppIcon';

const TrendForecastingPanel = ({ trendsData, onRefresh }) => {
  if (!trendsData) {
    return (
      <div className="card p-8 text-center">
        <Icon name="AlertCircle" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No trend forecasting data available</p>
      </div>
    );
  }

  const { sentimentForecasts, votingBehaviorPatterns, marketOpportunities, consumerPreferences, seasonalFactors, statisticalConfidence, confidenceIntervals, reasoning } = trendsData;

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          Sentiment Forecasts (30/60/90 Days)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sentimentForecasts?.map((forecast, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-semibold text-muted-foreground mb-2">{forecast?.period} Days</p>
              <p className="text-2xl font-bold text-foreground mb-2">{forecast?.sentiment}</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Low:</span>
                  <span className="font-medium">{forecast?.confidenceInterval?.low}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>High:</span>
                  <span className="font-medium">{forecast?.confidenceInterval?.high}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Activity" size={20} className="text-primary" />
            Voting Behavior Patterns
          </h3>
          <div className="space-y-3">
            {votingBehaviorPatterns?.emergingTrends?.map((trend, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground">{trend?.pattern}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    trend?.impact === 'high' ? 'bg-red-100 text-red-700' :
                    trend?.impact === 'medium'? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {trend?.impact} impact
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{trend?.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Target" size={20} className="text-primary" />
            Market Opportunities
          </h3>
          <div className="space-y-3">
            {marketOpportunities?.map((opportunity, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground">{opportunity?.opportunity}</p>
                  <span className="text-xs font-medium text-primary">{opportunity?.timing}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{opportunity?.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Icon name="TrendingUp" size={12} />
                  <span>Potential Impact: {opportunity?.potentialImpact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Users" size={20} className="text-primary" />
          Consumer Preference Predictions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {consumerPreferences?.map((preference, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg">
              <p className="font-medium text-foreground mb-2">{preference?.category}</p>
              <p className="text-sm text-muted-foreground mb-3">{preference?.prediction}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${preference?.confidence * 100}%` }}></div>
                </div>
                <span className="text-xs font-medium text-foreground">{(preference?.confidence * 100)?.toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Calendar" size={20} className="text-primary" />
          Seasonal Factors
        </h3>
        <div className="space-y-2">
          {seasonalFactors?.map((factor, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <Icon name="Sun" size={18} className="text-primary mt-0.5" />
              <div>
                <p className="font-medium text-foreground">{factor?.season}</p>
                <p className="text-sm text-muted-foreground">{factor?.influence}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Brain" size={20} className="text-primary" />
          Forecasting Methodology & Reasoning
        </h3>
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm text-foreground leading-relaxed">{reasoning}</p>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Icon name="CheckCircle" size={16} className="text-green-500" />
          <span className="text-sm text-muted-foreground">
            Statistical Confidence: <span className="font-semibold text-foreground">{(statisticalConfidence * 100)?.toFixed(1)}%</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrendForecastingPanel;