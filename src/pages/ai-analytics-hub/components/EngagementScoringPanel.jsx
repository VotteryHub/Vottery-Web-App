import React from 'react';
import Icon from '../../../components/AppIcon';

const EngagementScoringPanel = ({ engagementData, timeframe }) => {
  const currentRate = engagementData?.engagementForecast?.currentRate || 82.5;
  const predictedRate = engagementData?.engagementForecast?.predictedRate || 87.3;
  const trend = engagementData?.engagementForecast?.trend || 'increasing';
  const confidence = engagementData?.engagementForecast?.confidenceInterval || '85-90%';

  const contentPerformance = engagementData?.contentPerformance || [
    { contentType: 'Elections', currentEngagement: 85.2, predictedEngagement: 89.7, recommendation: 'Increase frequency of political elections' },
    { contentType: 'Polls', currentEngagement: 78.4, predictedEngagement: 82.1, recommendation: 'Add more interactive poll formats' },
    { contentType: 'Social Posts', currentEngagement: 72.6, predictedEngagement: 76.3, recommendation: 'Encourage user-generated content' },
    { contentType: 'Comments', currentEngagement: 68.9, predictedEngagement: 71.5, recommendation: 'Implement threaded discussions' }
  ];

  const getTrendIcon = (trend) => {
    if (trend === 'increasing') return 'TrendingUp';
    if (trend === 'decreasing') return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = (trend) => {
    if (trend === 'increasing') return 'text-green-600';
    if (trend === 'decreasing') return 'text-red-600';
    return 'text-yellow-600';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-foreground mb-1">Engagement Scoring Algorithm</h2>
          <p className="text-sm text-muted-foreground">AI-powered engagement predictions and optimization</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg">
          <Icon name="Brain" className="w-4 h-4 text-purple-600" />
          <span className="text-xs font-medium text-purple-700">ML Powered</span>
        </div>
      </div>

      {/* Current vs Predicted */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700 mb-2">Current Engagement Rate</p>
          <p className="text-3xl font-bold text-blue-900">{currentRate}%</p>
          <p className="text-xs text-blue-600 mt-1">Last {timeframe}</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 mb-2">Predicted Rate (30d)</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-green-900">{predictedRate}%</p>
            <Icon name={getTrendIcon(trend)} className={`w-6 h-6 ${getTrendColor(trend)}`} />
          </div>
          <p className="text-xs text-green-600 mt-1">Confidence: {confidence}</p>
        </div>
      </div>

      {/* Engagement Growth Projection */}
      <div className="mb-6 p-4 bg-accent rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-foreground">30-Day Growth Projection</span>
          <span className="text-sm font-bold text-green-600">+{(predictedRate - currentRate)?.toFixed(1)}%</span>
        </div>
        <div className="relative w-full bg-muted rounded-full h-3">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
            style={{ width: `${(currentRate / 100) * 100}%` }}
          />
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full opacity-50"
            style={{ width: `${(predictedRate / 100) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>Current</span>
          <span>Predicted</span>
        </div>
      </div>

      {/* Content Performance Breakdown */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Content Type Performance</h3>
        <div className="space-y-3">
          {contentPerformance?.map((content, index) => (
            <div key={index} className="p-3 bg-accent rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{content?.contentType}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {content?.currentEngagement}%
                  </span>
                  <Icon name="ArrowRight" className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-semibold text-green-600">
                    {content?.predictedEngagement}%
                  </span>
                </div>
              </div>
              <div className="relative w-full bg-muted rounded-full h-2 mb-2">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${content?.predictedEngagement}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                <Icon name="Lightbulb" className="w-3 h-3 inline mr-1" />
                {content?.recommendation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="Sparkles" className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-purple-900 mb-1">AI Optimization Recommendation</p>
            <p className="text-sm text-purple-700">
              Focus on increasing election frequency and implementing gamification features. 
              Expected impact: +{(predictedRate - currentRate)?.toFixed(1)}% engagement boost within 30 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngagementScoringPanel;