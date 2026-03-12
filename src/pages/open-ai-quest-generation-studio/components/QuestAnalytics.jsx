import React from 'react';
import { BarChart3, TrendingUp, Award, Target, CheckCircle, Clock } from 'lucide-react';

const QuestAnalytics = ({ questStats, userId }) => {
  if (!questStats) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          No quest data available yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-green-200 dark:border-gray-600">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-green-600" />
          Quest Analytics
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive quest performance metrics and completion tracking
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 dark:text-gray-400">Total Quests</span>
            <Target className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {questStats?.totalQuests || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            All time
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 dark:text-gray-400">Completed</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {questStats?.completedQuests || 0}
          </div>
          <div className="text-sm text-green-600 mt-2">
            {questStats?.completionRate || 0}% success rate
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 dark:text-gray-400">Active</span>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {questStats?.activeQuests || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            In progress
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 dark:text-gray-400">VP Earned</span>
            <Award className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {questStats?.totalVPEarned || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            From quests
          </div>
        </div>
      </div>

      {/* Completion Rate Visualization */}
      <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Completion Rate
        </h4>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Overall Success Rate</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {questStats?.completionRate || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-600 to-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${questStats?.completionRate || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-purple-200 dark:border-gray-600">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Performance Insights
          </h4>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium">Strong Completion Rate</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {questStats?.completionRate >= 70 ? 'Excellent' : questStats?.completionRate >= 50 ? 'Good' : 'Needs improvement'} quest completion performance
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Award className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <div className="font-medium">VP Earnings</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Earned {questStats?.totalVPEarned || 0} VP from completed quests
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Target className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <div className="font-medium">Active Engagement</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {questStats?.activeQuests || 0} quests currently in progress
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-green-200 dark:border-gray-600">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Recommendations
          </h4>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p className="text-sm">
              • {questStats?.completionRate < 50 ? 'Try easier quests to build momentum' : 'Consider more challenging quests for higher rewards'}
            </p>
            <p className="text-sm">
              • {questStats?.activeQuests === 0 ? 'Generate new quests to stay engaged' : 'Focus on completing active quests first'}
            </p>
            <p className="text-sm">
              • Average VP per quest: {questStats?.completedQuests > 0 ? Math.round(questStats?.totalVPEarned / questStats?.completedQuests) : 0} VP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestAnalytics;
