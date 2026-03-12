import React from 'react';
import Icon from '../../../components/AppIcon';

const InfrastructureUtilizationPanel = () => {
  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
          <Icon name="Database" size={20} />
          Infrastructure Utilization Patterns
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Real-time monitoring of database performance, API gateway metrics, and infrastructure resource utilization
        </p>
      </div>

      {/* Resource Utilization */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Icon name="Cpu" size={24} className="text-blue-500" />
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">45%</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">CPU Utilization</p>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: '45%' }} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Icon name="HardDrive" size={24} className="text-green-500" />
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">62%</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Memory Usage</p>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: '62%' }} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Icon name="Database" size={24} className="text-purple-500" />
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">38%</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Database Load</p>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500" style={{ width: '38%' }} />
          </div>
        </div>
      </div>

      {/* Database Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Database" size={20} />
          Database Query Optimization Insights
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Connections</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Supabase PostgreSQL</div>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">127</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Avg Query Time</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Last 24 hours</div>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">45ms</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Slow Queries</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">&gt;1s execution time</div>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">8</span>
          </div>
        </div>
      </div>

      {/* API Gateway Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Server" size={20} />
          API Gateway Performance
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Requests/Second</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">1,247</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Avg Latency</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">89ms</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfrastructureUtilizationPanel;