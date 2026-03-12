import React from 'react';
import Icon from '../../../components/AppIcon';

const VotingPerformance = ({ stats, engagement, timeRange }) => {
  const categoryData = engagement?.categoryPreferences || [];
  const maxCount = Math.max(...categoryData?.map(c => c?.count), 1);

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground">Voting Performance</h2>
        <Icon name="TrendingUp" size={20} className="text-primary" />
      </div>

      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Activity" size={16} className="text-primary" />
              <p className="text-sm text-muted-foreground">Participation Rate</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats?.participationRate || 0}%</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Calendar" size={16} className="text-primary" />
              <p className="text-sm text-muted-foreground">Avg. Per Week</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats?.averagePerWeek || 0}</p>
          </div>
        </div>

        {/* Category Preferences */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Category Preferences</h3>
          <div className="space-y-3">
            {categoryData?.map((category, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{category?.category}</span>
                  <span className="text-sm text-muted-foreground">{category?.count} votes</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2 transition-all duration-500"
                    style={{ width: `${(category?.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Pattern */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Activity Pattern</h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Morning', key: 'morning', icon: 'Sunrise' },
              { label: 'Afternoon', key: 'afternoon', icon: 'Sun' },
              { label: 'Evening', key: 'evening', icon: 'Sunset' },
              { label: 'Night', key: 'night', icon: 'Moon' }
            ]?.map((period) => (
              <div key={period?.key} className="bg-muted rounded-lg p-3 text-center">
                <Icon name={period?.icon} size={20} className="text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">{period?.label}</p>
                <p className="text-lg font-bold text-foreground">
                  {engagement?.activityPattern?.[period?.key] || 0}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Voting Streak */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
              <p className="text-3xl font-bold text-foreground">{engagement?.streakDays || 0} days</p>
            </div>
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <Icon name="Flame" size={32} className="text-primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingPerformance;