import React from 'react';
import { Target, Clock, Trophy } from 'lucide-react';

const ActiveQuestPreview = ({ quests, onRefresh }) => {
  const getProgressPercentage = (quest) => {
    return ((quest?.current_progress || 0) / quest?.target_value) * 100;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const hoursLeft = Math.max(0, Math.floor((expiry - now) / (1000 * 60 * 60)));
    return hoursLeft;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Target className="w-6 h-6 text-purple-600" />
          Active Quests ({quests?.length})
        </h3>
        <button
          onClick={onRefresh}
          className="text-purple-600 hover:text-purple-700 text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quests?.map((quest) => (
          <div
            key={quest?.id}
            className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 border border-purple-200 dark:border-gray-600"
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                {quest?.title}
              </h4>
              <span className={`text-xs font-medium ${getDifficultyColor(quest?.difficulty)}`}>
                {quest?.difficulty?.toUpperCase()}
              </span>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {quest?.description}
            </p>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {quest?.current_progress || 0} / {quest?.target_value}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${getProgressPercentage(quest)}%` }}
                ></div>
              </div>
            </div>

            {/* Quest Info */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                {getTimeRemaining(quest?.expires_at)}h left
              </div>
              <div className="flex items-center gap-1 text-yellow-600">
                <Trophy className="w-3 h-3" />
                {quest?.vp_reward} VP
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveQuestPreview;
