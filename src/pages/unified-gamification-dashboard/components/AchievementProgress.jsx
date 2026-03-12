import React from 'react';

const AchievementProgress = ({ badges, xpLog, gamification }) => {
  const recentXP = xpLog?.slice(0, 5) || [];
  const actionLabels = {
    VOTE: '🗳️ Voted in election',
    AD_INTERACTION: '📢 Ad interaction',
    PREDICTION: '🎯 Made prediction',
    DAILY_LOGIN: '📅 Daily login',
    STREAK_BONUS: '🔥 Streak bonus',
    BADGE_EARNED: '🏅 Badge earned',
    PREDICTION_ACCURACY: '🎯 Prediction accuracy reward'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">🏅 Achievement Progress</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Badges */}
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Recent Badges ({badges?.length || 0} earned)</p>
          {badges?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {badges?.slice(0, 6)?.map(ub => (
                <div key={ub?.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-full">
                  <span className="text-sm">🏅</span>
                  <span className="text-xs font-medium text-yellow-800 dark:text-yellow-300">{ub?.badge?.name || 'Badge'}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No badges yet. Start voting to earn badges!</p>
          )}
        </div>
        {/* Recent VP Activity */}
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Recent VP Activity</p>
          {recentXP?.length > 0 ? (
            <div className="space-y-2">
              {recentXP?.map((log, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {actionLabels?.[log?.action_type] || log?.action_type}
                  </span>
                  <span className="text-xs font-bold text-green-600 dark:text-green-400">+{log?.xp_gained} VP</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No recent VP activity</p>
          )}
        </div>
      </div>
      {/* Streak */}
      {gamification?.streak_count > 0 && (
        <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center gap-3">
          <span className="text-2xl">🔥</span>
          <div>
            <p className="font-semibold text-orange-700 dark:text-orange-300">{gamification?.streak_count}-Day Streak!</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Keep it up for streak multiplier bonuses</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementProgress;
