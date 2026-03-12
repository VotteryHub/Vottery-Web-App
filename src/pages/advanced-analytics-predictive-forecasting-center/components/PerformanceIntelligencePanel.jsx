import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceIntelligencePanel = ({ data, timeframe }) => {
  const crossPlatformCorrelations = [
    { metric: 'Social Media Mentions', correlation: 0.87, impact: 'High', trend: 'increasing' },
    { metric: 'External Traffic Sources', correlation: 0.72, impact: 'Medium', trend: 'stable' },
    { metric: 'Influencer Endorsements', correlation: 0.91, impact: 'Very High', trend: 'increasing' },
    { metric: 'Trending Topics Alignment', correlation: 0.68, impact: 'Medium', trend: 'fluctuating' },
    { metric: 'Competitor Activity', correlation: -0.45, impact: 'Low', trend: 'decreasing' }
  ];

  const engagementPatterns = [
    { pattern: 'Peak Hours', description: '7-9 PM EST shows 34% higher engagement', confidence: 92 },
    { pattern: 'Day of Week', description: 'Tuesday and Thursday generate 28% more participation', confidence: 88 },
    { pattern: 'Content Length', description: 'Elections with 3-5 options perform 41% better', confidence: 85 },
    { pattern: 'Prize Pool Sweet Spot', description: '$50-$100 range maximizes participation/cost ratio', confidence: 90 },
    { pattern: 'Voting Type Preference', description: 'Ranked choice increases completion by 23%', confidence: 87 }
  ];

  const automatedInsights = [
    {
      type: 'opportunity',
      title: 'Untapped Market Segment Detected',
      description: 'Users aged 25-34 in Zone 5-6 show 45% higher engagement potential but only 12% current reach',
      action: 'Expand targeting to this demographic',
      priority: 'high'
    },
    {
      type: 'warning',
      title: 'Engagement Drop in Sports Category',
      description: 'Sports elections showing 18% decline over past 14 days, likely due to off-season timing',
      action: 'Shift focus to entertainment category temporarily',
      priority: 'medium'
    },
    {
      type: 'success',
      title: 'Viral Content Pattern Identified',
      description: 'Elections with celebrity involvement generate 3.2x more shares and 2.8x higher participation',
      action: 'Increase celebrity-focused content',
      priority: 'high'
    },
    {
      type: 'info',
      title: 'Seasonal Trend Approaching',
      description: 'Historical data shows 35% engagement increase during Q4 holiday season',
      action: 'Prepare holiday-themed election campaigns',
      priority: 'low'
    }
  ];

  const getCorrelationColor = (correlation) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.8) return 'text-green-600 dark:text-green-400';
    if (abs >= 0.6) return 'text-blue-600 dark:text-blue-400';
    if (abs >= 0.4) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'opportunity': return { name: 'TrendingUp', color: 'text-green-600 dark:text-green-400' };
      case 'warning': return { name: 'AlertTriangle', color: 'text-orange-600 dark:text-orange-400' };
      case 'success': return { name: 'CheckCircle', color: 'text-blue-600 dark:text-blue-400' };
      case 'info': return { name: 'Info', color: 'text-purple-600 dark:text-purple-400' };
      default: return { name: 'Circle', color: 'text-gray-600 dark:text-gray-400' };
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400';
      case 'low':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Icon name="Activity" size={24} className="text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            Cross-Platform Correlation Analysis
          </h2>
        </div>

        <div className="space-y-3">
          {crossPlatformCorrelations?.map((corr, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">{corr?.metric}</span>
                  <span className={`text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 ${getCorrelationColor(corr?.correlation)}`}>
                    r = {corr?.correlation?.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{corr?.impact} Impact</span>
                  <Icon 
                    name={corr?.trend === 'increasing' ? 'TrendingUp' : corr?.trend === 'decreasing' ? 'TrendingDown' : 'Minus'} 
                    size={16} 
                    className={corr?.trend === 'increasing' ? 'text-green-600 dark:text-green-400' : corr?.trend === 'decreasing' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}
                  />
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    Math.abs(corr?.correlation) >= 0.8 
                      ? 'bg-green-500' 
                      : Math.abs(corr?.correlation) >= 0.6 
                      ? 'bg-blue-500' :'bg-yellow-500'
                  }`}
                  style={{ width: `${Math.abs(corr?.correlation) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Icon name="Zap" size={24} className="text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            Engagement Pattern Recognition
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {engagementPatterns?.map((pattern, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon name="Target" size={20} className="text-blue-600 dark:text-blue-400" />
                  <h3 className="text-sm font-semibold text-foreground">{pattern?.pattern}</h3>
                </div>
                <div className="flex items-center gap-1 bg-white dark:bg-gray-800 px-2 py-1 rounded-full">
                  <Icon name="CheckCircle" size={12} className="text-green-600 dark:text-green-400" />
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">
                    {pattern?.confidence}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{pattern?.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Icon name="Sparkles" size={24} className="text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            Automated Insight Generation (AI-Powered)
          </h2>
        </div>

        <div className="space-y-4">
          {automatedInsights?.map((insight, index) => {
            const iconConfig = getInsightIcon(insight?.type);
            return (
              <div key={index} className="border border-border rounded-lg p-4 hover:border-primary/50 transition-all duration-200">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 ${iconConfig?.color}`}>
                    <Icon name={iconConfig?.name} size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-base font-semibold text-foreground">{insight?.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(insight?.priority)}`}>
                        {insight?.priority?.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{insight?.description}</p>
                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
                      <Icon name="Lightbulb" size={16} className="text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        Recommended Action: {insight?.action}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Icon name="TrendingUp" size={24} />
              Continuous Model Improvement
            </h3>
            <p className="text-purple-100 mb-4">
              Our AI models continuously learn from outcome validation to improve forecasting accuracy
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-2xl font-bold">94.2%</div>
                <div className="text-sm text-purple-100">Average Model Accuracy</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-2xl font-bold">12,450</div>
                <div className="text-sm text-purple-100">Predictions Validated</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-2xl font-bold">+2.3%</div>
                <div className="text-sm text-purple-100">Accuracy Improvement (30d)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceIntelligencePanel;