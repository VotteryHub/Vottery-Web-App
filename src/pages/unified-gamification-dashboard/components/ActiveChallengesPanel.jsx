import React from 'react';

const ActiveChallengesPanel = ({ challenges, navigate }) => {
  const mockChallenges = [
    { id: 1, title: 'Vote in 3 Elections Today', description: 'Cast votes in 3 different elections', progress: 1, total: 3, vpReward: 50, timeLeft: '18h', type: 'daily' },
    { id: 2, title: 'Make 2 Predictions', description: 'Submit predictions for active elections', progress: 0, total: 2, vpReward: 40, timeLeft: '18h', type: 'daily' },
    { id: 3, title: 'Weekly Streak Master', description: 'Maintain a 7-day activity streak', progress: 3, total: 7, vpReward: 200, timeLeft: '4d', type: 'weekly' },
  ];

  const displayChallenges = challenges?.length > 0 ? challenges : mockChallenges;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">⚡ Active Challenges</h3>
        <button
          onClick={() => navigate('/dynamic-quest-management-dashboard')}
          className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
        >
          View all
        </button>
      </div>
      <div className="space-y-4">
        {displayChallenges?.slice(0, 4)?.map(challenge => {
          const progress = challenge?.progress || 0;
          const total = challenge?.total || 1;
          const percent = Math.round((progress / total) * 100);
          return (
            <div key={challenge?.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      challenge?.type === 'weekly' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {challenge?.type === 'weekly' ? 'Weekly' : 'Daily'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">⏰ {challenge?.timeLeft}</span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white mt-1">{challenge?.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{challenge?.description}</p>
                </div>
                <span className="ml-3 text-sm font-bold text-yellow-600 dark:text-yellow-400 whitespace-nowrap">+{challenge?.vpReward} VP</span>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>{progress}/{total} completed</span>
                  <span>{percent}%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveChallengesPanel;
