import React from 'react';
import Icon from '../../../components/AppIcon';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const PerformanceMetricsVisualization = ({ metrics }) => {
  if (!metrics) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center text-gray-500 dark:text-gray-400">
        <Icon name="BarChart3" size={48} className="mx-auto mb-3 opacity-30" />
        <p>Loading performance metrics...</p>
      </div>
    );
  }

  const responseTimeData = [
    { time: '00:00', api: 210, db: 45, external: 320 },
    { time: '04:00', api: 195, db: 42, external: 298 },
    { time: '08:00', api: 245, db: 51, external: 356 },
    { time: '12:00', api: 178, db: 38, external: 287 },
    { time: '16:00', api: 187, db: 43, external: 312 },
    { time: '20:00', api: 165, db: 36, external: 276 },
    { time: 'Now', api: metrics?.avgResponseTime, db: 42, external: 305 }
  ];

  const throughputData = [
    { time: '00:00', requests: 3200, errors: 12 },
    { time: '04:00', requests: 2800, errors: 8 },
    { time: '08:00', requests: 4100, errors: 18 },
    { time: '12:00', requests: 5200, errors: 15 },
    { time: '16:00', requests: 4800, errors: 11 },
    { time: '20:00', requests: 4200, errors: 9 },
    { time: 'Now', requests: metrics?.throughput, errors: 7 }
  ];

  const resourceUtilization = [
    { resource: 'CPU', usage: 68, limit: 80 },
    { resource: 'Memory', usage: 72, limit: 85 },
    { resource: 'Database', usage: 54, limit: 75 },
    { resource: 'Network', usage: 45, limit: 70 },
    { resource: 'Storage', usage: 67, limit: 80 }
  ];

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Zap" size={24} className="text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-green-600 dark:text-green-400">-12ms</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{metrics?.avgResponseTime}ms</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="TrendingUp" size={24} className="text-purple-600 dark:text-purple-400" />
            <span className="text-sm text-green-600 dark:text-green-400">+230</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{metrics?.throughput}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Requests/min</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="AlertCircle" size={24} className="text-red-600 dark:text-red-400" />
            <span className="text-sm text-green-600 dark:text-green-400">-0.01%</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{metrics?.errorRate}%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Error Rate</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Link" size={24} className="text-green-600 dark:text-green-400" />
            <span className="text-sm text-green-600 dark:text-green-400">+15</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{metrics?.activeConnections}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active Connections</div>
        </div>
      </div>

      {/* Response Time Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Activity" size={20} className="text-primary" />
          Response Time Analysis
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={responseTimeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Legend />
            <Line type="monotone" dataKey="api" stroke="#3b82f6" strokeWidth={2} name="API" />
            <Line type="monotone" dataKey="db" stroke="#10b981" strokeWidth={2} name="Database" />
            <Line type="monotone" dataKey="external" stroke="#f59e0b" strokeWidth={2} name="External Services" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Throughput Analytics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          Throughput Analytics
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={throughputData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Legend />
            <Bar dataKey="requests" fill="#3b82f6" name="Requests" />
            <Bar dataKey="errors" fill="#ef4444" name="Errors" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Resource Utilization */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Cpu" size={20} className="text-primary" />
          Resource Utilization
        </h3>
        <div className="space-y-4">
          {resourceUtilization?.map((resource) => (
            <div key={resource?.resource}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{resource?.resource}</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {resource?.usage}% / {resource?.limit}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    resource?.usage >= resource?.limit * 0.9 ? 'bg-red-500' :
                    resource?.usage >= resource?.limit * 0.7 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${(resource?.usage / resource?.limit) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottleneck Identification */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="AlertTriangle" size={20} className="text-primary" />
          Bottleneck Identification
        </h3>
        <div className="space-y-3">
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-900/30">
            <div className="flex items-start gap-3">
              <Icon name="Database" size={20} className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">Database Query Optimization Needed</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                  Slow queries detected on elections table. Average query time: 245ms (target: &lt;100ms)
                </p>
                <div className="text-xs text-yellow-600 dark:text-yellow-400">
                  Recommendation: Add composite index on (status, created_at) columns
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-900/30">
            <div className="flex items-start gap-3">
              <Icon name="Zap" size={20} className="text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Predictive Scaling Recommendation</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                  Traffic pattern analysis suggests 40% increase in next 2 hours. Current capacity: 68%
                </p>
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  Recommendation: Scale up by 2 instances to maintain &lt;2s latency SLA
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetricsVisualization;