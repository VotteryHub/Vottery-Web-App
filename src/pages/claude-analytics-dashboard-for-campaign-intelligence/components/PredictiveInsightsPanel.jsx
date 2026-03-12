import React from 'react';
import Icon from '../../../components/AppIcon';

const PredictiveInsightsPanel = ({ predictions }) => {
  if (!predictions) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <Icon name="TrendingUp" size={48} className="mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">No predictive insights available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon name="TrendingUp" size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground">Predictive Insights</h2>
            <p className="text-sm text-muted-foreground">30-90 day forecasts powered by Claude AI</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500/5 to-transparent border border-blue-500/20 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="Users" size={24} className="text-blue-600" />
              <h3 className="text-lg font-heading font-bold text-foreground">Participation Forecast</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{predictions?.participationForecast}</p>
          </div>

          <div className="bg-gradient-to-r from-green-500/5 to-transparent border border-green-500/20 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="DollarSign" size={24} className="text-green-600" />
              <h3 className="text-lg font-heading font-bold text-foreground">Prizing Recommendations</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{predictions?.prizingRecommendations}</p>
          </div>

          <div className="bg-gradient-to-r from-purple-500/5 to-transparent border border-purple-500/20 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="Target" size={24} className="text-purple-600" />
              <h3 className="text-lg font-heading font-bold text-foreground">Distribution Predictions</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{predictions?.distributionPredictions}</p>
          </div>

          <div className="bg-gradient-to-r from-yellow-500/5 to-transparent border border-yellow-500/20 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="TrendingUp" size={24} className="text-yellow-600" />
              <h3 className="text-lg font-heading font-bold text-foreground">Engagement Trends</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{predictions?.engagementTrends}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveInsightsPanel;