import React from 'react';

const PredictionStats = ({ election, leaderboard, userId }) => {
  const userEntry = leaderboard?.find(e => e?.user_id === userId);
  const totalParticipants = leaderboard?.length || 0;
  const resolvedCount = leaderboard?.filter(e => e?.brier_score != null)?.length || 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">📊 Pool Stats</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">Participants</span>
          <span className="font-bold text-gray-900 dark:text-white">{totalParticipants}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">Resolved</span>
          <span className="font-bold text-gray-900 dark:text-white">{resolvedCount}</span>
        </div>
        {userEntry && (
          <>
            <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-2">Your Performance</p>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Your Rank</span>
              <span className="font-bold text-purple-600">#{userEntry?.rank}</span>
            </div>
            {userEntry?.brier_score != null && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Accuracy</span>
                <span className="font-bold text-green-600">{userEntry?.accuracyPercent}%</span>
              </div>
            )}
            {userEntry?.vp_awarded > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">VP Earned</span>
                <span className="font-bold text-yellow-600">+{userEntry?.vp_awarded}</span>
              </div>
            )}
          </>
        )}
        <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
            <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">💡 How VP is Calculated</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              VP = (1 - Brier Score) × 100<br />
              Perfect prediction = 100 VP<br />
              Brier Score = avg((pred - actual)²)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionStats;
