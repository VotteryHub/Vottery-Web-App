import React from 'react';
import Icon from '../../../components/AppIcon';

const PlatformKPIsPanel = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* User Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Users" size={20} className="text-blue-500" />
          User Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              {data?.totalUsers?.toLocaleString() || 0}
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Users (24h)</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
              {data?.activeUsers24h?.toLocaleString() || 0}
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Retention Rate</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
              {data?.userRetentionRate || 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Election Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Vote" size={20} className="text-purple-500" />
          Election Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Elections</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              {data?.totalElections?.toLocaleString() || 0}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Elections</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
              {data?.activeElections || 0}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
              {data?.completedElections?.toLocaleString() || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Revenue Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="DollarSign" size={20} className="text-green-500" />
          Revenue Metrics (30d)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
              ${data?.totalRevenue30d?.toLocaleString() || 0}
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Revenue/Day</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              ${Math.round(data?.avgRevenuePerDay || 0)?.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Activity" size={20} className="text-orange-500" />
          Engagement Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Events (24h)</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              {data?.totalEngagementEvents?.toLocaleString() || 0}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Events/User</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              {data?.avgEngagementPerUser?.toFixed(2) || 0}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
              {data?.conversionRate || 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Growth Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={20} className="text-blue-500" />
          Growth Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Platform Growth Rate</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
              +{data?.platformGrowthRate || 0}%
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">User Retention</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
              {data?.userRetentionRate || 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformKPIsPanel;