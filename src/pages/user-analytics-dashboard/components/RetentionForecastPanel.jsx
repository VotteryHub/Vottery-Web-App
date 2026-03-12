import React from 'react';
import Icon from '../../../components/AppIcon';

const RetentionForecastPanel = ({ forecast, achievementProgress }) => {
  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low':
        return { text: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
      case 'medium':
        return { text: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
      case 'high':
        return { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
      default:
        return { text: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' };
    }
  };

  const riskColors = getRiskColor(forecast?.churnRisk);

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground">Retention Forecast & Achievements</h2>
        <Icon name="Target" size={20} className="text-primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Retention Forecast */}
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-foreground mb-4">Retention Forecast</h3>
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Forecasted Retention</p>
                  <p className="text-4xl font-bold text-foreground">
                    {forecast?.forecastedRetention || 0}%
                  </p>
                </div>
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <Icon name="TrendingUp" size={32} className="text-primary" />
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-primary to-secondary rounded-full h-3 transition-all duration-500"
                  style={{ width: `${forecast?.forecastedRetention || 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Churn Risk */}
          <div className={`${riskColors?.bg} border ${riskColors?.border} rounded-lg p-4`}>
            <div className="flex items-start gap-3">
              <Icon name="AlertTriangle" size={20} className={`${riskColors?.text} mt-0.5`} />
              <div>
                <p className="text-sm font-medium mb-1">
                  <span className={riskColors?.text}>Churn Risk: {forecast?.churnRisk?.toUpperCase()}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {forecast?.recommendation || 'Keep engaging to maintain your retention rate.'}
                </p>
              </div>
            </div>
          </div>

          {/* Engagement Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Calendar" size={16} className="text-primary" />
                <p className="text-xs text-muted-foreground">Avg. Days Between Votes</p>
              </div>
              <p className="text-2xl font-bold text-foreground">{forecast?.avgDaysBetweenVotes || 0}</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Clock" size={16} className="text-primary" />
                <p className="text-xs text-muted-foreground">Days Since Last Vote</p>
              </div>
              <p className="text-2xl font-bold text-foreground">{forecast?.daysSinceLastVote || 0}</p>
            </div>
          </div>
        </div>

        {/* Achievement Progress */}
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-foreground mb-4">Achievement Progress</h3>
            <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Overall Completion</p>
                  <p className="text-3xl font-bold text-foreground">
                    {achievementProgress?.completionPercentage || 0}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Badges Unlocked</p>
                  <p className="text-2xl font-bold text-foreground">
                    {achievementProgress?.unlockedBadges || 0}/{achievementProgress?.totalBadges || 0}
                  </p>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-accent to-primary rounded-full h-3 transition-all duration-500"
                  style={{ width: `${achievementProgress?.completionPercentage || 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Achievement Milestones */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Next Milestones</h3>
            <div className="space-y-3 max-h-[250px] overflow-y-auto">
              {achievementProgress?.achievements
                ?.filter(a => !a?.unlocked)
                ?.slice(0, 5)
                ?.map((achievement) => {
                  const progress = Math.min((achievement?.progress / achievement?.target) * 100, 100);
                  return (
                    <div key={achievement?.id} className="bg-muted rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon name={achievement?.icon} size={16} className="text-primary" />
                          <span className="text-sm font-medium text-foreground">{achievement?.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {achievement?.progress?.toLocaleString()}/{achievement?.target?.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-background rounded-full h-2">
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
        </div>
      </div>
    </div>
  );
};

export default RetentionForecastPanel;