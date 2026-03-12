import React from 'react';
import Icon from '../../../components/AppIcon';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PerformanceAnalyticsPanel = ({ executionLogs, subscriptions }) => {
  const executionTimeData = executionLogs
    ?.filter(log => log?.executionDurationMs)
    ?.slice(0, 10)
    ?.reverse()
    ?.map((log, index) => ({
      name: `Exec ${index + 1}`,
      duration: log?.executionDurationMs,
      actions: log?.actionsExecuted?.length || 0
    }));

  const subscriptionPerformanceData = subscriptions
    ?.map(sub => ({
      name: sub?.subscriptionName?.substring(0, 20),
      refreshInterval: sub?.refreshIntervalSeconds,
      batchSize: sub?.batchSize,
      priority: sub?.priority
    }));

  const executionStatusData = [
    { name: 'Completed', value: executionLogs?.filter(l => l?.executionStatus === 'completed')?.length || 0, color: '#10b981' },
    { name: 'Running', value: executionLogs?.filter(l => l?.executionStatus === 'running')?.length || 0, color: '#3b82f6' },
    { name: 'Failed', value: executionLogs?.filter(l => l?.executionStatus === 'failed')?.length || 0, color: '#ef4444' },
    { name: 'Pending', value: executionLogs?.filter(l => l?.executionStatus === 'pending')?.length || 0, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Icon name="Zap" className="w-8 h-8 text-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Avg</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {executionLogs?.filter(l => l?.executionDurationMs)?.length > 0
              ? Math.round(
                  executionLogs
                    ?.filter(l => l?.executionDurationMs)
                    ?.reduce((sum, log) => sum + log?.executionDurationMs, 0) /
                    executionLogs?.filter(l => l?.executionDurationMs)?.length
                )
              : 0}ms
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Execution Time</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Icon name="CheckCircle2" className="w-8 h-8 text-green-500" />
            <span className="text-sm font-medium text-green-600 dark:text-green-400">Rate</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {executionLogs?.length > 0
              ? ((executionLogs?.filter(l => l?.executionStatus === 'completed')?.length / executionLogs?.length) * 100)?.toFixed(1)
              : 0}%
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Icon name="Activity" className="w-8 h-8 text-purple-500" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Total</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {executionLogs?.reduce((sum, log) => sum + (log?.actionsExecuted?.length || 0), 0)}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Actions Executed</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Icon name="Bell" className="w-8 h-8 text-orange-500" />
            <span className="text-sm font-medium text-orange-600 dark:text-orange-400">Sent</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {executionLogs?.reduce((sum, log) => sum + (log?.notificationsSent?.length || 0), 0)}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Notifications</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Icon name="TrendingUp" className="w-5 h-5 text-blue-500" />
            Execution Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={executionTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="duration" stroke="#3b82f6" strokeWidth={2} name="Duration (ms)" />
              <Line type="monotone" dataKey="actions" stroke="#10b981" strokeWidth={2} name="Actions" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Icon name="BarChart3" className="w-5 h-5 text-purple-500" />
            Execution Status Distribution
          </h3>
          <div className="space-y-4">
            {executionStatusData?.map((status) => (
              <div key={status?.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{status?.name}</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{status?.value}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${executionLogs?.length > 0 ? (status?.value / executionLogs?.length) * 100 : 0}%`,
                      backgroundColor: status?.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Radio" className="w-5 h-5 text-green-500" />
          Subscription Configuration
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={subscriptionPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '0.5rem'
              }}
            />
            <Legend />
            <Bar dataKey="refreshInterval" fill="#3b82f6" name="Refresh (s)" />
            <Bar dataKey="batchSize" fill="#10b981" name="Batch Size" />
            <Bar dataKey="priority" fill="#f59e0b" name="Priority" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceAnalyticsPanel;
