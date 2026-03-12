import React from 'react';
import Icon from '../../../components/AppIcon';

const SystemHealthOverview = ({ metrics }) => {
  if (!metrics) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center text-gray-500 dark:text-gray-400">
        <Icon name="Activity" size={48} className="mx-auto mb-3 opacity-30" />
        <p>Loading system health metrics...</p>
      </div>
    );
  }

  const { apiHealth, dbPerformance, fraudMetrics, paymentStatus, integrationHealth, overallHealth } = metrics;

  const MetricCard = ({ title, value, subtitle, icon, color = 'blue' }) => (
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
      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h3>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Overall Health */}
      <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 dark:from-primary/20 dark:to-blue-500/20 rounded-xl p-6 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Overall System Health
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Status: <span className="font-semibold text-primary capitalize">{overallHealth?.status}</span>
            </p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold text-primary mb-2">{overallHealth?.score}%</div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              All Systems Operational
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="API Health"
          value={`${apiHealth?.summary?.healthy}/${apiHealth?.summary?.total}`}
          subtitle="Endpoints Healthy"
          icon="Server"
          color="green"
        />
        <MetricCard
          title="Database Performance"
          value={`${dbPerformance?.cacheHitRatio}%`}
          subtitle="Cache Hit Ratio"
          icon="Database"
          color="blue"
        />
        <MetricCard
          title="Fraud Detection"
          value={`${fraudMetrics?.detectionRate}%`}
          subtitle="Detection Rate"
          icon="Shield"
          color="purple"
        />
        <MetricCard
          title="Payment Success"
          value={`${paymentStatus?.successRate}%`}
          subtitle="Success Rate"
          icon="CreditCard"
          color="green"
        />
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Health Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Icon name="Server" size={20} />
            API Health Status
          </h3>
          <div className="space-y-3">
            {apiHealth?.endpoints?.slice(0, 5)?.map((endpoint) => (
              <div key={endpoint?.endpoint} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    endpoint?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{endpoint?.endpoint}</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {endpoint?.responseTime}ms
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Avg Response Time: <span className="font-semibold">{apiHealth?.summary?.avgResponseTime}ms</span>
            </div>
          </div>
        </div>

        {/* Integration Health */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Icon name="Zap" size={20} />
            Integration Health
          </h3>
          <div className="space-y-3">
            {integrationHealth?.integrations?.map((integration) => (
              <div key={integration?.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    integration?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{integration?.name}</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {integration?.uptime}% uptime
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Overall Status: <span className="font-semibold text-green-600 dark:text-green-400 capitalize">
                {integrationHealth?.overallStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Database & Fraud Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Icon name="Database" size={20} />
            Database Performance
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active Connections</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {dbPerformance?.activeConnections}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Avg Query Time</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {dbPerformance?.queryPerformance?.avgQueryTime}ms
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Index Efficiency</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {dbPerformance?.indexEfficiency}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Icon name="Shield" size={20} />
            Fraud Detection Metrics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Alerts (24h)</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {fraudMetrics?.totalAlerts}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">High Severity</span>
              <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                {fraudMetrics?.bySeverity?.high}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">False Positive Rate</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {fraudMetrics?.falsePositiveRate}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthOverview;
