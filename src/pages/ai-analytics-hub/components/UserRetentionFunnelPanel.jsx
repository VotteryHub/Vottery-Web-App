import React from 'react';
import Icon from '../../../components/AppIcon';

const UserRetentionFunnelPanel = ({ funnelData = [] }) => {
  const maxUsers = funnelData?.[0]?.users || 10000;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-foreground mb-1">User Retention Funnel</h2>
          <p className="text-sm text-muted-foreground">User journey progression and drop-off analysis</p>
        </div>
        <Icon name="Filter" className="w-6 h-6 text-primary" />
      </div>

      {/* Funnel Visualization */}
      <div className="space-y-4">
        {funnelData?.map((stage, index) => (
          <div key={stage?.stage} className="relative">
            {/* Stage Bar */}
            <div className="relative">
              <div
                className="h-16 rounded-lg transition-all duration-500 flex items-center justify-between px-6"
                style={{
                  width: `${stage?.percentage}%`,
                  background: `linear-gradient(to right, 
                    ${index === 0 ? 'rgb(59, 130, 246)' : 
                      index === 1 ? 'rgb(99, 102, 241)' : 
                      index === 2 ? 'rgb(139, 92, 246)' : 
                      index === 3 ? 'rgb(168, 85, 247)' : 
                      index === 4 ? 'rgb(192, 132, 252)': 'rgb(216, 180, 254)'}, 
                    ${index === 0 ? 'rgb(37, 99, 235)' : 
                      index === 1 ? 'rgb(79, 70, 229)' : 
                      index === 2 ? 'rgb(124, 58, 237)' : 
                      index === 3 ? 'rgb(147, 51, 234)' : 
                      index === 4 ? 'rgb(168, 85, 247)': 'rgb(192, 132, 252)'})`
                }}
              >
                <div className="text-white">
                  <p className="font-bold text-lg">{stage?.stage}</p>
                  <p className="text-sm opacity-90">{stage?.users?.toLocaleString()} users</p>
                </div>
                <div className="text-white text-right">
                  <p className="font-bold text-2xl">{stage?.percentage}%</p>
                  {index > 0 && (
                    <p className="text-sm opacity-90">-{stage?.dropoff}% drop</p>
                  )}
                </div>
              </div>
            </div>

            {/* Drop-off Indicator */}
            {index < funnelData?.length - 1 && (
              <div className="absolute -bottom-2 left-0 right-0 flex items-center justify-center">
                <div className="flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full">
                  <Icon name="TrendingDown" className="w-3 h-3 text-red-600" />
                  <span className="text-xs font-medium text-red-700">
                    {funnelData?.[index + 1]?.dropoff}% drop-off
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-accent rounded-lg">
            <p className="text-2xl font-bold text-foreground">
              {((funnelData?.[funnelData?.length - 1]?.users / maxUsers) * 100)?.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">Overall Conversion</p>
          </div>
          <div className="text-center p-4 bg-accent rounded-lg">
            <p className="text-2xl font-bold text-foreground">
              {funnelData?.reduce((sum, stage) => sum + (stage?.dropoff || 0), 0)?.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">Total Drop-off</p>
          </div>
          <div className="text-center p-4 bg-accent rounded-lg">
            <p className="text-2xl font-bold text-foreground">
              {funnelData?.[funnelData?.length - 1]?.users?.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Power Users</p>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="Brain" className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-1">AI Insight</p>
            <p className="text-sm text-blue-700">
              Largest drop-off occurs at the "First Vote" stage ({funnelData?.[2]?.dropoff}%). 
              Implementing onboarding tutorials could improve conversion by 15-20%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRetentionFunnelPanel;