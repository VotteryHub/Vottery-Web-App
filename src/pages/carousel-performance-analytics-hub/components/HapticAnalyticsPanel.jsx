import React from 'react';
import Icon from '../../../components/AppIcon';

const HapticAnalyticsPanel = ({ hapticEngagement }) => {
  const totalTriggers = Object.values(hapticEngagement)?.reduce((sum, item) => sum + item?.triggers, 0);
  
  const getIntensityColor = (intensity) => {
    switch(intensity) {
      case 'light': return 'text-blue-600 dark:text-blue-400';
      case 'medium': return 'text-purple-600 dark:text-purple-400';
      case 'heavy': return 'text-red-600 dark:text-red-400';
      case 'snap': return 'text-yellow-600 dark:text-yellow-400';
      case 'swipe': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getIntensityBg = (intensity) => {
    switch(intensity) {
      case 'light': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'medium': return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
      case 'heavy': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'snap': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'swipe': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      default: return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Engagement Rates by Intensity */}
      <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Vibrate" size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Haptic Feedback Engagement</h2>
            <p className="text-sm text-muted-foreground">Engagement rates by feedback intensity</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(hapticEngagement)?.map(([intensity, data]) => (
            <div key={intensity} className={`rounded-xl p-4 border ${getIntensityBg(intensity)}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-lg font-bold capitalize ${getIntensityColor(intensity)}`}>{intensity}</h3>
                <Icon name="Zap" size={20} className={getIntensityColor(intensity)} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Triggers</span>
                  <span className="text-lg font-bold text-foreground">{data?.triggers?.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg Duration</span>
                  <span className="text-sm font-semibold text-foreground">{data?.avgDuration}ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">User Preference</span>
                  <span className="text-sm font-semibold text-foreground">{data?.userPreference}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      intensity === 'light' ? 'bg-blue-500' :
                      intensity === 'medium' ? 'bg-purple-500' :
                      intensity === 'heavy' ? 'bg-red-500' :
                      intensity === 'snap' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${data?.userPreference}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <Icon name="Info" size={20} className="text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Total Haptic Triggers: {totalTriggers?.toLocaleString()}</p>
              <p className="text-xs text-blue-700 dark:text-blue-300">Across all carousel interactions in the last 24 hours</p>
            </div>
          </div>
        </div>
      </div>
      {/* User Preference Patterns */}
      <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Users" size={20} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">User Preference Patterns</h3>
            <p className="text-sm text-muted-foreground">Haptic feedback preferences by user demographics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-foreground mb-3">By Device Type</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                <span className="text-sm text-foreground">Mobile</span>
                <span className="text-sm font-bold text-primary">78%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                <span className="text-sm text-foreground">Tablet</span>
                <span className="text-sm font-bold text-primary">62%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                <span className="text-sm text-foreground">Desktop</span>
                <span className="text-sm font-bold text-primary">0%</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3">By User Segment</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                <span className="text-sm text-foreground">Power Users</span>
                <span className="text-sm font-bold text-primary">85%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                <span className="text-sm text-foreground">Regular Users</span>
                <span className="text-sm font-bold text-primary">68%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                <span className="text-sm text-foreground">New Users</span>
                <span className="text-sm font-bold text-primary">52%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Correlation with Interaction Duration */}
      <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Clock" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Correlation with Interaction Duration</h3>
            <p className="text-sm text-muted-foreground">Impact of haptic feedback on user engagement time</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">+42%</div>
            <p className="text-sm font-medium text-green-900 dark:text-green-100">Longer Engagement</p>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">With haptic feedback enabled</p>
          </div>

          <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">+28%</div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Higher Conversion</p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">On swipe-to-action carousels</p>
          </div>

          <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">+35%</div>
            <p className="text-sm font-medium text-purple-900 dark:text-purple-100">Better Retention</p>
            <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">Return visit rate improvement</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HapticAnalyticsPanel;