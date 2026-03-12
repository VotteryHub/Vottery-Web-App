import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Calendar, Award, BarChart3, Activity } from 'lucide-react';
import { openAIQuestService } from '../../../services/openAIQuestService';
import { votesService } from '../../../services/votesService';
import { gamificationService } from '../../../services/gamificationService';

const UserBehaviorAnalysis = ({ userBehavior, userId }) => {
  const [loading, setLoading] = useState(false);
  const [behaviorData, setBehaviorData] = useState(userBehavior);
  const [votingHistory, setVotingHistory] = useState([]);

  useEffect(() => {
    if (userId && !behaviorData) {
      loadBehaviorData();
    } else if (userBehavior) {
      setBehaviorData(userBehavior);
    }
  }, [userId, userBehavior]);

  const loadBehaviorData = async () => {
    try {
      setLoading(true);
      const [votes, gamification, xpLog] = await Promise.all([
        votesService?.getUserVotes(userId),
        gamificationService?.getUserGamification(userId),
        gamificationService?.getXPLog(userId, 100)
      ]);

      const analysis = openAIQuestService?.analyzeUserBehavior(
        votes?.data,
        gamification,
        xpLog
      );

      setBehaviorData(analysis);
      setVotingHistory(votes?.data || []);
    } catch (error) {
      console.error('Error loading behavior data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Analyzing user behavior...</p>
      </div>
    );
  }

  if (!behaviorData) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          Generate quests to analyze user behavior patterns
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-blue-200 dark:border-gray-600">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          User Behavior Analysis
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          AI-powered analysis of voting patterns and engagement metrics for personalized quest generation
        </p>
      </div>

      {/* Behavior Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 dark:text-gray-400">Total Votes</span>
            <Target className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {behaviorData?.totalVotes || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Voting frequency: {behaviorData?.votingFrequency || 0} votes/day
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 dark:text-gray-400">Current Streak</span>
            <Calendar className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {behaviorData?.currentStreak || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            days active
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 dark:text-gray-400">User Level</span>
            <Award className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {behaviorData?.currentLevel || 1}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {behaviorData?.totalXP || 0} XP
          </div>
        </div>
      </div>

      {/* Engagement Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Engagement Level
          </h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Overall Engagement</span>
                <span className="font-medium text-gray-900 dark:text-white capitalize">
                  {behaviorData?.engagementLevel || 'Low'}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    behaviorData?.engagementLevel === 'high' ?'bg-green-600 w-full'
                      : behaviorData?.engagementLevel === 'medium' ?'bg-yellow-600 w-2/3' :'bg-red-600 w-1/3'
                  }`}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Skill Level</span>
                <span className="font-medium text-gray-900 dark:text-white capitalize">
                  {behaviorData?.skillLevel || 'Beginner'}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-blue-600 ${
                    behaviorData?.skillLevel === 'expert' ?'w-full'
                      : behaviorData?.skillLevel === 'intermediate' ?'w-2/3' :'w-1/3'
                  }`}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Favorite Categories
          </h4>
          <div className="space-y-3">
            {behaviorData?.favoriteCategories?.slice(0, 5)?.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">{category}</span>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                  #{index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quest Recommendations */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-purple-200 dark:border-gray-600">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          AI Recommendations
        </h4>
        <div className="space-y-2 text-gray-700 dark:text-gray-300">
          <p>• Based on {behaviorData?.engagementLevel} engagement, recommend {behaviorData?.engagementLevel === 'high' ? 'challenging' : 'achievable'} quests</p>
          <p>• Focus on {behaviorData?.favoriteCategories?.[0]} and {behaviorData?.favoriteCategories?.[1]} categories</p>
          <p>• Suggest {behaviorData?.skillLevel === 'expert' ? 'advanced' : 'progressive'} difficulty scaling</p>
          <p>• Target VP rewards: {behaviorData?.skillLevel === 'expert' ? '200-500' : behaviorData?.skillLevel === 'intermediate' ? '100-300' : '50-150'} VP</p>
        </div>
      </div>
    </div>
  );
};

export default UserBehaviorAnalysis;
