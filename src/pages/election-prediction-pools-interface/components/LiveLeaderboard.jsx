import React from 'react';

const LiveLeaderboard = ({ leaderboard, userId, electionTitle }) => {
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">🏆 Live Leaderboard</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{electionTitle} • Ranked by Brier Score (lower = better)</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          Live
        </div>
      </div>
      {leaderboard?.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-3">🎯</div>
          <p className="text-gray-500 dark:text-gray-400">No resolved predictions yet.</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Leaderboard updates after election resolution.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard?.map((entry, idx) => (
            <div
              key={entry?.id}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                entry?.user_id === userId
                  ? 'bg-purple-50 dark:bg-purple-900/30 border-2 border-purple-300 dark:border-purple-600' :'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="w-10 text-center">
                {idx < 3 ? (
                  <span className="text-2xl">{medals?.[idx]}</span>
                ) : (
                  <span className="text-lg font-bold text-gray-500 dark:text-gray-400">#{idx + 1}</span>
                )}
              </div>

              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {(entry?.user?.username || entry?.user?.full_name || 'A')?.charAt(0)?.toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white truncate">
                  {entry?.user?.username || entry?.user?.full_name || 'Anonymous'}
                  {entry?.user_id === userId && <span className="ml-2 text-xs text-purple-600 dark:text-purple-400">(You)</span>}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Brier Score: {entry?.brier_score?.toFixed(4) ?? 'Pending'}
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {entry?.accuracyPercent != null ? `${entry?.accuracyPercent}%` : '—'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">accuracy</p>
              </div>

              {entry?.vp_awarded > 0 && (
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400">+{entry?.vp_awarded} VP</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveLeaderboard;
