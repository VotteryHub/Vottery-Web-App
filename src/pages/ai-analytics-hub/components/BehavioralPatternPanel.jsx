import React from 'react';
import Icon from '../../../components/AppIcon';

const BehavioralPatternPanel = ({ patterns = [] }) => {
  const getTrendIcon = (trend) => {
    if (trend === 'increasing') return 'TrendingUp';
    if (trend === 'decreasing') return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = (trend) => {
    if (trend === 'increasing') return 'text-green-600 bg-green-50';
    if (trend === 'decreasing') return 'text-red-600 bg-red-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  const getEngagementColor = (rate) => {
    if (rate >= 90) return 'from-green-500 to-green-600';
    if (rate >= 80) return 'from-blue-500 to-blue-600';
    if (rate >= 70) return 'from-yellow-500 to-yellow-600';
    return 'from-gray-500 to-gray-600';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-foreground mb-1">Behavioral Pattern Recognition</h2>
          <p className="text-sm text-muted-foreground">ML analysis of user interaction sequences and engagement timing</p>
        </div>
        <Icon name="Activity" className="w-6 h-6 text-primary" />
      </div>

      {/* Patterns List */}
      <div className="space-y-4">
        {patterns?.map((pattern, index) => (
          <div key={index} className="p-4 bg-accent rounded-lg border border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-foreground">{pattern?.pattern}</h3>
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${getTrendColor(pattern?.trend)}`}>
                    <Icon name={getTrendIcon(pattern?.trend)} className="w-3 h-3" />
                    <span className="text-xs font-medium capitalize">{pattern?.trend}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{pattern?.description}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Icon name="Users" className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      {pattern?.userCount?.toLocaleString()} users
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Zap" className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      {pattern?.engagementRate}% engagement
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Engagement Bar */}
            <div className="relative w-full bg-muted rounded-full h-2">
              <div
                className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getEngagementColor(pattern?.engagementRate)} rounded-full transition-all duration-500`}
                style={{ width: `${pattern?.engagementRate}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* AI Insights */}
      <div className="mt-6 space-y-3">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Icon name="Brain" className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Pattern Insight</p>
              <p className="text-sm text-blue-700">
                Evening Voters show highest engagement rates. Consider scheduling important elections between 6-10 PM for maximum participation.
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Icon name="Target" className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-900 mb-1">Optimization Opportunity</p>
              <p className="text-sm text-green-700">
                Social Engagers have 94.7% engagement rate. Implementing more social features could boost overall platform engagement by 15-20%.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-accent rounded-lg">
            <p className="text-2xl font-bold text-foreground">{patterns?.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Patterns Identified</p>
          </div>
          <div className="text-center p-3 bg-accent rounded-lg">
            <p className="text-2xl font-bold text-foreground">
              {(patterns?.reduce((sum, p) => sum + p?.engagementRate, 0) / patterns?.length)?.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">Avg Engagement</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BehavioralPatternPanel;