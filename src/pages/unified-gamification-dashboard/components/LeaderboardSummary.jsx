import React from 'react';

const LeaderboardSummary = ({ leaderboard, userId, userRank, navigate }) => {
  const top5 = leaderboard?.slice(0, 5) || [];
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white">🏆 Leaderboard</h3>
        <button onClick={() => navigate('/gamification-rewards-management-center')} className="text-xs text-purple-600 dark:text-purple-400 hover:underline">Full board →</button>
      </div>
      {userRank && (
        <div className="mb-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Your rank: #{userRank} of {leaderboard?.length}</p>
          {userRank > 1 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {(leaderboard?.[userRank - 2]?.current_xp || 0) - (leaderboard?.[userRank - 1]?.current_xp || 0)} VP to rank #{userRank - 1}
            </p>
          )}
        </div>
      )}
      <div className="space-y-2">
        {top5?.map((entry, idx) => (
          <div key={entry?.user_id || idx} className={`flex items-center gap-3 py-2 px-2 rounded-lg ${
            entry?.user_id === userId ? 'bg-purple-50 dark:bg-purple-900/20' : ''
          }`}>
            <span className="w-6 text-center">{idx < 3 ? medals?.[idx] : `#${idx + 1}`}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {entry?.user?.username || entry?.user?.full_name || 'User'}
                {entry?.user_id === userId && ' (You)'}
              </p>
            </div>
            <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">{(entry?.current_xp || 0)?.toLocaleString()} VP</span>
          </div>
        ))}
        {top5?.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No leaderboard data yet</p>
        )}
      </div>
    </div>
  );
};

export default LeaderboardSummary;
