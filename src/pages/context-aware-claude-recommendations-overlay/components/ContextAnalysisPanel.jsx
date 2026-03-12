import React from 'react';
import Icon from '../../../components/AppIcon';

const ContextAnalysisPanel = ({ screenName }) => {
  const contextData = {
    screenActivity: {
      currentUsers: 847,
      avgSessionTime: '12m 34s',
      actionsPerMinute: 23,
      errorRate: '0.3%'
    },
    recentActions: [
      { action: 'Approved election', timestamp: '2 minutes ago', user: 'Admin' },
      { action: 'Updated campaign budget', timestamp: '5 minutes ago', user: 'Advertiser' },
      { action: 'Moderated content', timestamp: '8 minutes ago', user: 'Moderator' }
    ],
    performanceMetrics: {
      responseTime: '234ms',
      throughput: '1,247 req/s',
      cpuUsage: '45%',
      memoryUsage: '62%'
    }
  };

  return (
    <div className="space-y-6">
      {/* Screen Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Activity" size={20} />
          Screen Activity Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Current Users</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {contextData?.screenActivity?.currentUsers}
            </div>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Avg Session Time</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {contextData?.screenActivity?.avgSessionTime}
            </div>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Actions/Min</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {contextData?.screenActivity?.actionsPerMinute}
            </div>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Error Rate</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {contextData?.screenActivity?.errorRate}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Clock" size={20} />
          Recent Actions
        </h3>
        <div className="space-y-3">
          {contextData?.recentActions?.map((action, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{action?.action}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{action?.user}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{action?.timestamp}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Zap" size={20} />
          Performance Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(contextData?.performanceMetrics)?.map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {key?.replace(/([A-Z])/g, ' $1')?.trim()}
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContextAnalysisPanel;