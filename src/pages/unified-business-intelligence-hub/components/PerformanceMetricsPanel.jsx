import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceMetricsPanel = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Performance Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              {data?.avgResponseTime || 0}ms
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Screens Monitored</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              {data?.totalScreens || 0}
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Performance Trend</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
              Improving
            </p>
          </div>
        </div>
      </div>

      {/* Slowest Screens */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="AlertTriangle" size={20} className="text-orange-500" />
          Slowest Performing Screens
        </h3>
        <div className="space-y-3">
          {data?.slowestScreens?.slice(0, 10)?.map((screen, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {screen?.name}
              </span>
              <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                {screen?.avgTime}ms
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Fastest Screens */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Zap" size={20} className="text-green-500" />
          Fastest Performing Screens
        </h3>
        <div className="space-y-3">
          {data?.fastestScreens?.slice(0, 10)?.map((screen, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {screen?.name}
              </span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                {screen?.avgTime}ms
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetricsPanel;