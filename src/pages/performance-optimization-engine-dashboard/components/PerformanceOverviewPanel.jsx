import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceOverviewPanel = ({ data }) => {
  if (!data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center text-gray-500 dark:text-gray-400">
        <Icon name="Activity" size={48} className="mx-auto mb-3 opacity-30" />
        <p>Loading performance overview...</p>
      </div>
    );
  }

  const { queryMetrics, cacheMetrics, infrastructureMetrics, overallScore } = data;

  const MetricCard = ({ title, value, subtitle, icon, color = 'blue', score }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-${color}-50 dark:bg-${color}-900/20 flex items-center justify-center`}>
          <Icon name={icon} size={24} className={`text-${color}-600 dark:text-${color}-400`} />
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold text-${color}-600 dark:text-${color}-400`}>{value}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</div>
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      {score !== undefined && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
            <span>Performance Score</span>
            <span className="font-semibold">{score}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full bg-${color}-500`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 dark:from-primary/20 dark:to-blue-500/20 rounded-xl p-6 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Overall Performance Score
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Status: <span className="font-semibold text-primary capitalize">{overallScore?.status}</span>
            </p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold text-primary mb-2">{overallScore?.score}%</div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              System Operational
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{overallScore?.breakdown?.query}%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Query Performance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{overallScore?.breakdown?.cache}%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Cache Performance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{overallScore?.breakdown?.infrastructure}%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Infrastructure</div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Query Performance"
          value={`${queryMetrics?.avgResponseTime}ms`}
          subtitle="Avg Response Time"
          icon="Database"
          color="blue"
          score={queryMetrics?.performanceScore}
        />
        <MetricCard
          title="Cache Hit Rate"
          value={`${cacheMetrics?.hitRate}%`}
          subtitle="Cache Efficiency"
          icon="Zap"
          color="green"
          score={cacheMetrics?.performanceScore}
        />
        <MetricCard
          title="Infrastructure Load"
          value={`${infrastructureMetrics?.cpuUtilization}%`}
          subtitle="CPU Utilization"
          icon="Server"
          color="purple"
          score={infrastructureMetrics?.performanceScore}
        />
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Query Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Icon name="Database" size={20} />
            Query Performance Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Queries</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {queryMetrics?.totalQueries?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Slow Queries</span>
              <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                {queryMetrics?.slowQueries}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {queryMetrics?.avgResponseTime}ms
              </span>
            </div>
          </div>
        </div>

        {/* Cache Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Icon name="Zap" size={20} />
            Cache Performance Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Hit Rate</span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                {cacheMetrics?.hitRate}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Memory Utilization</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {cacheMetrics?.memoryUtilization}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Requests</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {cacheMetrics?.totalRequests?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Infrastructure Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Server" size={20} />
          Infrastructure Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{infrastructureMetrics?.cpuUtilization}%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">CPU Usage</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{infrastructureMetrics?.memoryUtilization}%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Memory Usage</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{infrastructureMetrics?.requestsPerSecond}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Requests/sec</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{infrastructureMetrics?.uptime}%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceOverviewPanel;