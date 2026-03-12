import React from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PerformanceProfiling = ({ profile }) => {
  if (!profile) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center text-gray-500 dark:text-gray-400">
        <Icon name="Activity" size={48} className="mx-auto mb-3 opacity-30" />
        <p>Loading performance profile...</p>
      </div>
    );
  }

  const resourceData = [
    { resource: 'CPU', usage: profile?.cpuUsage, limit: 80 },
    { resource: 'Memory', usage: profile?.memoryUsage, limit: 85 },
    { resource: 'Database', usage: profile?.databaseConnections, limit: 90 },
    { resource: 'Network', usage: profile?.networkLatency, limit: 70 },
    { resource: 'Disk I/O', usage: profile?.diskIO, limit: 75 }
  ];

  const getUsageColor = (usage, limit) => {
    if (usage >= limit * 0.9) return 'bg-red-500';
    if (usage >= limit * 0.7) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Resource Utilization Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {resourceData?.map((resource) => (
          <div key={resource?.resource} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-3">
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{resource?.usage}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{resource?.resource}</div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getUsageColor(resource?.usage, resource?.limit)}`}
                style={{ width: `${(resource?.usage / resource?.limit) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Resource Utilization Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="BarChart3" size={20} className="text-primary" />
          Resource Utilization Analysis
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={resourceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="resource" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Bar dataKey="usage" fill="#3b82f6" name="Current Usage %" />
            <Bar dataKey="limit" fill="#ef4444" name="Limit %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Icon name="Cpu" size={20} className="text-primary" />
            CPU & Memory Profiling
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">CPU Usage</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{profile?.cpuUsage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${getUsageColor(profile?.cpuUsage, 80)}`}
                  style={{ width: `${profile?.cpuUsage}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                {profile?.cpuUsage >= 72 ? 'Consider scaling up CPU resources' : 'CPU usage within acceptable range'}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Memory Usage</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{profile?.memoryUsage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${getUsageColor(profile?.memoryUsage, 85)}`}
                  style={{ width: `${profile?.memoryUsage}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                {profile?.memoryUsage >= 76 ? 'Memory optimization recommended' : 'Memory usage optimal'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Icon name="Database" size={20} className="text-primary" />
            Database & Network Performance
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Database Connections</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{profile?.databaseConnections}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${getUsageColor(profile?.databaseConnections, 90)}`}
                  style={{ width: `${profile?.databaseConnections}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                {profile?.databaseConnections >= 81 ? 'Approaching connection pool limit' : 'Database connections healthy'}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Network Latency</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{profile?.networkLatency}ms</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-green-500"
                  style={{ width: `${(profile?.networkLatency / 100) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Network latency is optimal for current load
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Optimization Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Lightbulb" size={20} className="text-primary" />
          Performance Optimization Recommendations
        </h3>
        <div className="space-y-3">
          {profile?.databaseConnections >= 80 && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-900/30">
              <div className="flex items-start gap-3">
                <Icon name="AlertTriangle" size={20} className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">Database Connection Pool Optimization</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                    Connection pool utilization at {profile?.databaseConnections}%. Consider increasing pool size or optimizing query patterns.
                  </p>
                  <div className="text-xs text-yellow-600 dark:text-yellow-400">
                    Recommendation: Increase max connections from 100 to 150
                  </div>
                </div>
              </div>
            </div>
          )}

          {profile?.cpuUsage >= 65 && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-900/30">
              <div className="flex items-start gap-3">
                <Icon name="Zap" size={20} className="text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">CPU Optimization Opportunity</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                    CPU usage at {profile?.cpuUsage}%. Implement caching strategies to reduce computational load.
                  </p>
                  <div className="text-xs text-blue-600 dark:text-blue-400">
                    Recommendation: Implement Redis caching for frequently accessed data
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-900/30">
            <div className="flex items-start gap-3">
              <Icon name="CheckCircle" size={20} className="text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">Overall Performance Status</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  System performance is within acceptable parameters. Continue monitoring for sustained optimization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceProfiling;