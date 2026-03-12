import React from 'react';
import { CheckCircle, Clock, Zap } from 'lucide-react';

const FeedQuestProgressBar = ({ quest, onComplete }) => {
  const progress = (quest?.progress / quest?.target) * 100;
  const isComplete = quest?.progress >= quest?.target;

  const handleClaim = () => {
    if (isComplete && onComplete) {
      onComplete();
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">{quest?.title}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              quest?.type === 'daily' ?'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
            }`}>
              {quest?.type}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{quest?.description}</p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className="font-bold text-yellow-600 dark:text-yellow-400">{quest?.vpReward} VP</span>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-700 dark:text-gray-300">
            Progress: {quest?.progress}/{quest?.target}
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isComplete
                ? 'bg-gradient-to-r from-green-500 to-green-600' :'bg-gradient-to-r from-blue-500 to-purple-600'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          >
            {isComplete && (
              <div className="w-full h-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white animate-bounce" />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Action Button */}
      {isComplete ? (
        <button
          onClick={handleClaim}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-2 animate-pulse"
        >
          <CheckCircle className="w-5 h-5" />
          Claim {quest?.vpReward} VP Reward
        </button>
      ) : (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Complete {quest?.target - quest?.progress} more to unlock reward</span>
        </div>
      )}
    </div>
  );
};

export default FeedQuestProgressBar;