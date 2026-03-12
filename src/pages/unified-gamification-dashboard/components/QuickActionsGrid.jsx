import React from 'react';

const QuickActionsGrid = ({ navigate }) => {
  const actions = [
    { icon: '⚡', label: 'VP Marketplace', path: '/vottery-points-vp-universal-currency-center', color: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300' },
    { icon: '🎯', label: 'Prediction Pools', path: '/election-prediction-pools-interface', color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300' },
    { icon: '🔔', label: 'Prediction Notifications', path: '/prediction-pool-notifications-hub', color: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300' },
    { icon: '⚡', label: 'Quest Manager', path: '/dynamic-quest-management-dashboard', color: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300' },
    { icon: '🏆', label: 'Leaderboards', path: '/gamification-rewards-management-center', color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300' },
    { icon: '🏅', label: 'Achievements', path: '/gamification-progression-achievement-hub', color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300' },
    { icon: '🌍', label: 'Multi-Language', path: '/gamification-multi-language-intelligence-center', color: 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-700 text-teal-700 dark:text-teal-300' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
      <h3 className="font-bold text-gray-900 dark:text-white mb-4">🚀 Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        {actions?.map(action => (
          <button
            key={action?.path}
            onClick={() => navigate(action?.path)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all hover:scale-105 ${action?.color}`}
          >
            <span className="text-xl">{action?.icon}</span>
            <span className="text-xs font-medium text-center leading-tight">{action?.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsGrid;
