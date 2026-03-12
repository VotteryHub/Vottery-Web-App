import React, { useState, useEffect } from 'react';
import { Trophy, Coins, TrendingUp, Zap, Gift } from 'lucide-react';
import { gamificationService } from '../../../services/gamificationService';

const VPIntegration = ({ questStats, userId }) => {
  const [vpData, setVpData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (userId) {
      loadVPData();
    }
  }, [userId]);

  const loadVPData = async () => {
    try {
      setLoading(true);
      const [gamification, xpBreakdown] = await Promise.all([
        gamificationService?.getUserGamification(userId),
        gamificationService?.getXPBreakdown(userId, 30)
      ]);

      setVpData({
        ...gamification,
        breakdown: xpBreakdown
      });
    } catch (error) {
      console.error('Error loading VP data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading VP integration data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-yellow-200 dark:border-gray-600">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-600" />
          VP Gamification Integration
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Automated reward distribution and achievement unlocking through VP system
        </p>
      </div>

      {/* VP Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 dark:text-gray-400">Total VP Balance</span>
            <Coins className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {vpData?.current_xp || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Current level: {vpData?.level || 1}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 dark:text-gray-400">Quest VP Earned</span>
            <Trophy className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {questStats?.totalVPEarned || 0}
          </div>
          <div className="text-sm text-purple-600">
            From {questStats?.completedQuests || 0} quests
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 dark:text-gray-400">Streak Bonus</span>
            <Zap className="w-6 h-6 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {vpData?.streak_count || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            days active
          </div>
        </div>
      </div>

      {/* VP Breakdown */}
      <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          VP Earnings Breakdown (Last 30 Days)
        </h4>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Sponsored Elections</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {vpData?.breakdown?.sponsored || 0} VP
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${(vpData?.breakdown?.sponsored / vpData?.breakdown?.total) * 100 || 0}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Organic Voting</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {vpData?.breakdown?.organic || 0} VP
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(vpData?.breakdown?.organic / vpData?.breakdown?.total) * 100 || 0}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Streak Bonuses</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {vpData?.breakdown?.streaks || 0} VP
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div
                className="bg-orange-600 h-2 rounded-full"
                style={{ width: `${(vpData?.breakdown?.streaks / vpData?.breakdown?.total) * 100 || 0}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Badge Achievements</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {vpData?.breakdown?.badges || 0} VP
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div
                className="bg-yellow-600 h-2 rounded-full"
                style={{ width: `${(vpData?.breakdown?.badges / vpData?.breakdown?.total) * 100 || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Reward Distribution */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-purple-200 dark:border-gray-600">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-purple-600" />
          Automated Reward Distribution
        </h4>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p className="flex items-start gap-2">
            <span className="text-green-600 mt-1">✓</span>
            VP rewards automatically credited upon quest completion
          </p>
          <p className="flex items-start gap-2">
            <span className="text-green-600 mt-1">✓</span>
            Achievement unlocking integrated with badge system
          </p>
          <p className="flex items-start gap-2">
            <span className="text-green-600 mt-1">✓</span>
            Streak bonuses applied for consecutive quest completions
          </p>
          <p className="flex items-start gap-2">
            <span className="text-green-600 mt-1">✓</span>
            Milestone celebrations triggered at level thresholds
          </p>
        </div>
      </div>
    </div>
  );
};

export default VPIntegration;
