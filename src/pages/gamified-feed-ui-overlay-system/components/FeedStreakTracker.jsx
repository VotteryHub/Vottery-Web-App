import React from 'react';
import { Flame, TrendingUp, Award, Zap } from 'lucide-react';

const FeedStreakTracker = ({ streakData }) => {
  const { currentStreak, longestStreak, multiplier, nextMilestone } = streakData;
  const progressToMilestone = (currentStreak / nextMilestone) * 100;

  return (
    <div className="space-y-4">
      {/* Main Streak Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center animate-pulse-slow">
              <Flame className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center border-2 border-white dark:border-gray-800">
              <span className="text-xs font-bold text-gray-900">{currentStreak}</span>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{currentStreak} Day Streak</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Keep it going! 🔥</p>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-2 justify-end mb-1">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{multiplier}x</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">VP Multiplier</p>
        </div>
      </div>

      {/* Progress to Next Milestone */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Next Milestone: {nextMilestone} days</span>
          <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">{Math.round(progressToMilestone)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progressToMilestone, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
          {nextMilestone - currentStreak} more days to unlock {multiplier + 0.5}x multiplier!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
          <Flame className="w-5 h-5 text-orange-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">{currentStreak}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Current</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
          <Award className="w-5 h-5 text-purple-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">{longestStreak}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Longest</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
          <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">{multiplier}x</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Multiplier</p>
        </div>
      </div>

      {/* Streak Preservation Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <p className="text-xs text-blue-900 dark:text-blue-300">
          <strong>Tip:</strong> Vote in at least one election daily to maintain your streak. Use a streak saver if you miss a day!
        </p>
      </div>
    </div>
  );
};

export default FeedStreakTracker;