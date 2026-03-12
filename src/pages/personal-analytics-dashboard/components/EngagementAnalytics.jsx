import React from 'react';
import Icon from '../../../components/AppIcon';

const EngagementAnalytics = ({ engagement, timeRange }) => {
  const frequencyData = engagement?.votingFrequency?.slice(-7) || [];
  const maxFrequency = Math.max(...frequencyData?.map(d => d?.count), 1);

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground">Engagement Analytics</h2>
        <Icon name="BarChart3" size={20} className="text-secondary" />
      </div>

      <div className="space-y-6">
        {/* Voting Frequency Chart */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Voting Frequency (Last 7 Days)</h3>
          {frequencyData?.length > 0 ? (
            <div className="space-y-2">
              {frequencyData?.map((day, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-20 truncate">{day?.date}</span>
                  <div className="flex-1 bg-muted rounded-full h-6 relative">
                    <div
                      className="bg-secondary rounded-full h-6 flex items-center justify-end pr-2 transition-all duration-500"
                      style={{ width: `${(day?.count / maxFrequency) * 100}%` }}
                    >
                      <span className="text-xs font-medium text-white">{day?.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Icon name="BarChart3" size={32} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No voting activity in this period</p>
            </div>
          )}
        </div>

        {/* Engagement Metrics */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Engagement Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Zap" size={16} className="text-primary" />
                <p className="text-sm text-muted-foreground">Consistency</p>
              </div>
              <p className="text-2xl font-bold text-foreground">High</p>
              <p className="text-xs text-muted-foreground mt-1">Regular participation</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Target" size={16} className="text-primary" />
                <p className="text-sm text-muted-foreground">Quality Score</p>
              </div>
              <p className="text-2xl font-bold text-foreground">92%</p>
              <p className="text-xs text-muted-foreground mt-1">Above average</p>
            </div>
          </div>
        </div>

        {/* Social Interaction */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Social Interaction</h3>
          <div className="space-y-3">
            {[
              { label: 'Friend Network', value: '456 friends', icon: 'Users', color: 'text-blue-600' },
              { label: 'Content Sharing', value: '23 shares', icon: 'Share2', color: 'text-green-600' },
              { label: 'Platform Activity', value: '89% active', icon: 'Activity', color: 'text-purple-600' }
            ]?.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon name={metric?.icon} size={20} className={metric?.color} />
                  <span className="text-sm font-medium text-foreground">{metric?.label}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">{metric?.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Tip */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Icon name="TrendingUp" size={20} className="text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900 mb-1">Engagement Tip</p>
              <p className="text-xs text-green-700">
                Your engagement is {engagement?.streakDays > 5 ? 'excellent' : 'good'}! Keep your streak going by voting daily to maximize your rewards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngagementAnalytics;