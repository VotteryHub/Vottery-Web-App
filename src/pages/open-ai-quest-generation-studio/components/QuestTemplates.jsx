import React from 'react';
import { Target } from 'lucide-react';

const QuestTemplates = ({ onSelectTemplate }) => {
  const templates = [
    {
      title: 'Daily Voter',
      description: 'Vote in 3 different elections today',
      category: 'voting',
      difficulty: 'easy',
      targetValue: 3,
      vpReward: 100,
      duration: '24h',
      requirements: ['Vote in 3 elections', 'Complete within 24 hours'],
      icon: '🗳️'
    },
    {
      title: 'Category Explorer',
      description: 'Vote in 5 different categories this week',
      category: 'exploration',
      difficulty: 'medium',
      targetValue: 5,
      vpReward: 250,
      duration: '7d',
      requirements: ['Vote in 5 unique categories', 'Complete within 7 days'],
      icon: '🔍'
    },
    {
      title: 'Social Butterfly',
      description: 'Share 3 elections with friends',
      category: 'social',
      difficulty: 'easy',
      targetValue: 3,
      vpReward: 150,
      duration: '24h',
      requirements: ['Share 3 elections', 'Get at least 1 friend to vote'],
      icon: '👥'
    },
    {
      title: 'Streak Master',
      description: 'Maintain a 7-day voting streak',
      category: 'achievement',
      difficulty: 'hard',
      targetValue: 7,
      vpReward: 500,
      duration: '7d',
      requirements: ['Vote at least once per day', 'Complete 7 consecutive days'],
      icon: '🔥'
    },
    {
      title: 'Early Bird',
      description: 'Be among the first 100 voters in 5 elections',
      category: 'voting',
      difficulty: 'medium',
      targetValue: 5,
      vpReward: 300,
      duration: '7d',
      requirements: ['Vote early in 5 elections', 'Rank in top 100 voters'],
      icon: '🌅'
    },
    {
      title: 'Community Builder',
      description: 'Create 2 elections and get 50+ votes combined',
      category: 'achievement',
      difficulty: 'hard',
      targetValue: 50,
      vpReward: 400,
      duration: '7d',
      requirements: ['Create 2 elections', 'Receive 50+ total votes'],
      icon: '🏗️'
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-blue-200 dark:border-gray-600">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-600" />
          Quest Templates
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Pre-designed quest templates for quick assignment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates?.map((template, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{template?.icon}</span>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                    {template?.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {template?.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template?.difficulty)}`}>
                {template?.difficulty?.toUpperCase()}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                {template?.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                {template?.duration}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                {template?.vpReward} VP
              </span>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-4">
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Requirements:
              </div>
              <ul className="space-y-1">
                {template?.requirements?.map((req, idx) => (
                  <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => onSelectTemplate(template)}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              Use Template
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestTemplates;
