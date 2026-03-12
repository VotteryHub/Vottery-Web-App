import React from 'react';
import Icon from '../../../components/AppIcon';

const AchievementProgress = ({ achievements }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground">Achievement Progress</h2>
        <Icon name="Award" size={20} className="text-accent" />
      </div>

      <div className="space-y-6">
        {/* Overall Progress */}
        <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Overall Completion</p>
              <p className="text-3xl font-bold text-foreground">{achievements?.completionPercentage || 0}%</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Badges Unlocked</p>
              <p className="text-2xl font-bold text-foreground">
                {achievements?.unlockedBadges || 0}/{achievements?.totalBadges || 0}
              </p>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-gradient-to-r from-accent to-primary rounded-full h-3 transition-all duration-500"
              style={{ width: `${achievements?.completionPercentage || 0}%` }}
            />
          </div>
        </div>

        {/* Recent Unlocks */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Recent Unlocks</h3>
          {achievements?.recentUnlocks?.length > 0 ? (
            <div className="space-y-3">
              {achievements?.recentUnlocks?.map((achievement) => (
                <div
                  key={achievement?.id}
                  className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                >
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Icon name={achievement?.icon} size={24} className="text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{achievement?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Unlocked {achievement?.unlockedAt ? 'recently' : 'today'}
                    </p>
                  </div>
                  <Icon name="CheckCircle" size={20} className="text-success" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No recent unlocks</p>
          )}
        </div>

        {/* Milestone Progress */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Milestone Progress</h3>
          <div className="space-y-4">
            {achievements?.milestones?.map((milestone) => {
              const progress = Math.min((milestone?.progress / milestone?.target) * 100, 100);
              return (
                <div key={milestone?.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon name={milestone?.icon} size={16} className="text-primary" />
                      <span className="text-sm font-medium text-foreground">{milestone?.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {milestone?.progress?.toLocaleString()}/{milestone?.target?.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Goal */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Icon name="Target" size={20} className="text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-900 mb-1">Next Goal</p>
              <p className="text-xs text-yellow-700">
                Complete {achievements?.totalBadges - achievements?.unlockedBadges || 0} more achievements to reach 100% completion!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementProgress;