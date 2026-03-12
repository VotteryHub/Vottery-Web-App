import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceMetricsPanel = ({ metrics }) => {
  if (!metrics) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
        <Icon name="BarChart3" size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 dark:text-gray-400">Loading performance metrics...</p>
      </div>
    );
  }

  const { apiHealth, dbPerformance, fraudMetrics, paymentStatus } = metrics;

  return (
    <div className="space-y-6">
      {/* API Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Server" size={20} />
          API Performance Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Endpoints</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {apiHealth?.summary?.total}
            </div>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Healthy</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {apiHealth?.summary?.healthy}
            </div>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Degraded</div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {apiHealth?.summary?.degraded}
            </div>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Down</div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {apiHealth?.summary?.down}
            </div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Average Response Time</span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {apiHealth?.summary?.avgResponseTime}ms
            </span>
          </div>
        </div>
      </div>

      {/* Database Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Database" size={20} />
          Database Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Connections</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {dbPerformance?.activeConnections}
            </div>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cache Hit Ratio</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {dbPerformance?.cacheHitRatio}%
            </div>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Index Efficiency</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {dbPerformance?.indexEfficiency}%
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Query Performance</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Avg Query Time</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {dbPerformance?.queryPerformance?.avgQueryTime}ms
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Slow Queries</span>
              <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                {dbPerformance?.queryPerformance?.slowQueries}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Queries</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {dbPerformance?.queryPerformance?.totalQueries?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fraud & Payment Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Icon name="Shield" size={20} />
            Fraud Detection
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Detection Rate</div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {fraudMetrics?.detectionRate}%
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">High</div>
                <div className="text-lg font-bold text-red-600 dark:text-red-400">
                  {fraudMetrics?.bySeverity?.high}
                </div>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Medium</div>
                <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                  {fraudMetrics?.bySeverity?.medium}
                </div>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Low</div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {fraudMetrics?.bySeverity?.low}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Icon name="CreditCard" size={20} />
            Payment Processing
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Success Rate</div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {paymentStatus?.successRate}%
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Transactions</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {paymentStatus?.totalTransactions?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Avg Processing Time</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {paymentStatus?.avgProcessingTime}s
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Volume</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  ${paymentStatus?.totalVolume?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetricsPanel;
