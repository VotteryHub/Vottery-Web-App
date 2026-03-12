import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceAnalyticsPanel = ({ incidents }) => {
  const totalIncidents = incidents?.length || 0;
  const resolvedIncidents = incidents?.filter(i => i?.status === 'resolved')?.length || 0;
  const avgResponseTime = '15 min';
  const aiAccuracy = '92%';

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="AlertTriangle" size={24} className="text-red-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Total</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalIncidents}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active Incidents</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="CheckCircle" size={24} className="text-green-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Resolved</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{resolvedIncidents}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Successfully Resolved</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Clock" size={24} className="text-blue-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Avg Time</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{avgResponseTime}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Response Time</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Brain" size={24} className="text-purple-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">AI Accuracy</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{aiAccuracy}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Decision Accuracy</p>
        </div>
      </div>

      {/* AI Model Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">AI Model Performance</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Perplexity Threat Analysis</span>
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">94%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '94%' }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Claude Decision Reasoning</span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">91%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '91%' }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Combined AI Orchestration</span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">96%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '96%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Response Effectiveness */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Response Effectiveness</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">False Positive Rate</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">4.2%</p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Escalation Accuracy</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">97.8%</p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Automated Resolution Rate</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">68%</p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Manual Override Rate</p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">8.5%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalyticsPanel;