import React from 'react';
import { TrendingUp, BarChart3, Target, Clock, Award } from 'lucide-react';

const QuestPerformanceMonitoring = ({ activeQuests, completedQuests, stats }) => {
  const calculateAverageCompletionTime = () => {
    if (completedQuests?.length === 0) return 0;
    
    const totalTime = completedQuests?.reduce((sum, quest) => {
      const created = new Date(quest?.created_at);
      const completed = new Date(quest?.completed_at);
      return sum + (completed - created) / (1000 * 60 * 60);
    }, 0);
    
    return (totalTime / completedQuests?.length)?.toFixed(1);
  };

  const getCategoryBreakdown = () => {
    const categories = {};
    [...activeQuests, ...completedQuests]?.forEach(quest => {
      const cat = quest?.category || 'unknown';
      categories[cat] = (categories?.[cat] || 0) + 1;
    });
    return categories;
  };

  const getDifficultyBreakdown = () => {
    const difficulties = { easy: 0, medium: 0, hard: 0 };
    completedQuests?.forEach(quest => {
      const diff = quest?.difficulty || 'medium';
      difficulties[diff] = (difficulties?.[diff] || 0) + 1;
    });
    return difficulties;
  };

  const categoryBreakdown = getCategoryBreakdown();
  const difficultyBreakdown = getDifficultyBreakdown();
  const avgCompletionTime = calculateAverageCompletionTime();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-blue-200 dark:border-gray-600">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          Quest Performance Monitoring
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Engagement correlation analysis and optimization recommendations
        </p>
      </div>
      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 dark:text-gray-400">Avg Completion Time</span>
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {avgCompletionTime}h
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Per quest
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 dark:text-gray-400">Success Rate</span>
            <Target className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {stats?.completionRate || 0}%
          </div>
          <div className="text-sm text-green-600">
            {stats?.completedQuests || 0} completed
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 dark:text-gray-400">Avg VP/Quest</span>
            <Award className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {stats?.completedQuests > 0 ? Math.round(stats?.totalVPEarned / stats?.completedQuests) : 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            VP reward
          </div>
        </div>
      </div>
      {/* Category Performance */}
      <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          Quest Category Distribution
        </h4>
        <div className="space-y-4">
          {Object.entries(categoryBreakdown)?.map(([category, count]) => (
            <div key={category}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400 capitalize">{category}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {count} quests
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                  style={{ width: `${(count / (activeQuests?.length + completedQuests?.length)) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Difficulty Analysis */}
      <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          Difficulty Completion Analysis
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {difficultyBreakdown?.easy}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Easy</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {difficultyBreakdown?.medium}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Medium</div>
          </div>
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {difficultyBreakdown?.hard}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Hard</div>
          </div>
        </div>
      </div>
      {/* Optimization Recommendations */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-purple-200 dark:border-gray-600">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Optimization Recommendations
        </h4>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p className="flex items-start gap-2">
            <span className="text-purple-600 mt-1">•</span>
            {stats?.completionRate >= 70 ? 'Excellent completion rate! Consider introducing more challenging quests.' : 'Focus on easier quests to build user confidence and engagement.'}
          </p>
          <p className="flex items-start gap-2">
            <span className="text-purple-600 mt-1">•</span>
            Average completion time of {avgCompletionTime}h suggests {parseFloat(avgCompletionTime) < 12 ? 'quick engagement' : 'longer-term commitment'} patterns.
          </p>
          <p className="flex items-start gap-2">
            <span className="text-purple-600 mt-1">•</span>
            Most popular category: {Object.entries(categoryBreakdown)?.sort((a, b) => b?.[1] - a?.[1])?.[0]?.[0] || 'N/A'} - consider creating more quests in this category.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuestPerformanceMonitoring;
