import React from 'react';
import { CheckCircle, Trophy, Calendar, Award } from 'lucide-react';

const CompletedQuestAnalytics = ({ quests, stats }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getCompletionTime = (createdAt, completedAt) => {
    const created = new Date(createdAt);
    const completed = new Date(completedAt);
    const hours = Math.floor((completed - created) / (1000 * 60 * 60));
    return hours;
  };

  if (quests?.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
        <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">No completed quests yet</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          Complete active quests to see analytics here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-green-200 dark:border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700 dark:text-gray-300">Total Completed</span>
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {stats?.completedQuests || 0}
          </div>
          <div className="text-sm text-green-600">
            {stats?.completionRate || 0}% success rate
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-yellow-200 dark:border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700 dark:text-gray-300">VP Earned</span>
            <Trophy className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {stats?.totalVPEarned || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            From completed quests
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-purple-200 dark:border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700 dark:text-gray-300">Avg VP/Quest</span>
            <Award className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {stats?.completedQuests > 0 ? Math.round(stats?.totalVPEarned / stats?.completedQuests) : 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Per completion
          </div>
        </div>
      </div>

      {/* Completed Quests List */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-green-600" />
          Completed Quest History
        </h3>

        <div className="space-y-3">
          {quests?.map((quest) => (
            <div
              key={quest?.id}
              className="bg-white dark:bg-gray-700 rounded-xl p-5 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {quest?.title}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {quest?.description}
                  </p>
                </div>
                <div className="ml-4 text-right">
                  <div className="flex items-center gap-1 text-yellow-600 font-bold mb-1">
                    <Trophy className="w-4 h-4" />
                    +{quest?.vp_reward} VP
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(quest?.completed_at)}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quest?.difficulty)}`}>
                  {quest?.difficulty?.toUpperCase()}
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                  {quest?.category}
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Completed in {getCompletionTime(quest?.created_at, quest?.completed_at)}h
                </span>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">Progress</span>
                  <span className="font-bold text-green-600">
                    {quest?.current_progress} / {quest?.target_value} (100%)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompletedQuestAnalytics;
