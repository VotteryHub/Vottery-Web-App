import React from 'react';
import { Target, Clock, Trophy, RefreshCw, AlertCircle } from 'lucide-react';

const ActiveQuestTracking = ({ quests, onUpdate, onRefresh }) => {
  const getProgressPercentage = (quest) => {
    return Math.min(100, ((quest?.current_progress || 0) / quest?.target_value) * 100);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const hoursLeft = Math.max(0, Math.floor((expiry - now) / (1000 * 60 * 60)));
    return hoursLeft;
  };

  const isExpiringSoon = (expiresAt) => {
    return getTimeRemaining(expiresAt) <= 6;
  };

  if (quests?.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
        <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 mb-2">No active quests</p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Visit the Quest Generation Studio to create new quests
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-600" />
          Active Quest Tracking ({quests?.length})
        </h3>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {quests?.map((quest) => (
          <div
            key={quest?.id}
            className={`bg-white dark:bg-gray-700 rounded-xl p-6 border-2 transition-all ${
              isExpiringSoon(quest?.expires_at)
                ? 'border-red-300 dark:border-red-700 shadow-lg'
                : 'border-gray-200 dark:border-gray-600 hover:shadow-lg'
            }`}
          >
            {/* Quest Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                    {quest?.title}
                  </h4>
                  {isExpiringSoon(quest?.expires_at) && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-xs font-medium">
                      <AlertCircle className="w-3 h-3" />
                      Expiring Soon
                    </span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  {quest?.description}
                </p>
              </div>
            </div>

            {/* Quest Metadata */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quest?.difficulty)}`}>
                {quest?.difficulty?.toUpperCase()}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                {quest?.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                {quest?.vp_reward} VP
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {getTimeRemaining(quest?.expires_at)}h remaining
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {quest?.current_progress || 0} / {quest?.target_value}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all flex items-center justify-end pr-2"
                  style={{ width: `${getProgressPercentage(quest)}%` }}
                >
                  {getProgressPercentage(quest) > 10 && (
                    <span className="text-white text-xs font-bold">
                      {Math.round(getProgressPercentage(quest))}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Requirements */}
            {quest?.requirements && quest?.requirements?.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Requirements:
                </div>
                <ul className="space-y-1">
                  {quest?.requirements?.map((req, idx) => (
                    <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveQuestTracking;
