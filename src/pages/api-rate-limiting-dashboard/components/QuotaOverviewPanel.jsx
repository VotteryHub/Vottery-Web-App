import React from 'react';
import Icon from '../../../components/AppIcon';


const QuotaOverviewPanel = ({ metrics, rateLimits }) => {
  const overviewStats = [
    {
      label: 'Total Endpoints',
      value: metrics?.totalEndpoints || 0,
      icon: 'Globe',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Throttled Endpoints',
      value: metrics?.throttledEndpoints || 0,
      icon: 'Sliders',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      label: 'Total Violations (24h)',
      value: metrics?.totalViolations || 0,
      icon: 'AlertTriangle',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
    {
      label: 'Blocked Requests',
      value: metrics?.blockedRequests || 0,
      icon: 'Shield',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      label: 'Avg Quota Utilization',
      value: `${metrics?.avgQuotaUtilization || 0}%`,
      icon: 'Activity',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'High Utilization Endpoints',
      value: metrics?.highUtilizationEndpoints || 0,
      icon: 'TrendingUp',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    }
  ];

  const topEndpoints = rateLimits
    ?.map(r => ({
      endpoint: r?.endpoint,
      method: r?.method,
      utilization: ((r?.currentMinuteCount / r?.quotaPerMinute) * 100)?.toFixed(1),
      requestsPerMinute: r?.currentMinuteCount,
      quota: r?.quotaPerMinute
    }))
    ?.sort((a, b) => parseFloat(b?.utilization) - parseFloat(a?.utilization))
    ?.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Overview Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {overviewStats?.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">{stat?.label}</span>
              <div className={`p-2 rounded-lg ${stat?.bgColor}`}>
                <Icon name={stat?.icon} size={20} className={stat?.color} />
              </div>
            </div>
            <div className={`text-3xl font-bold ${stat?.color}`}>{stat?.value}</div>
          </div>
        ))}
      </div>

      {/* System Status Alerts */}
      {metrics?.abuseDetected && (
        <div className="card p-6 border-2 border-red-500/30 bg-red-500/5">
          <div className="flex items-center gap-3 mb-3">
            <Icon name="AlertTriangle" size={24} className="text-red-500" />
            <h3 className="text-lg font-semibold text-foreground">Abuse Detected</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            High-severity rate limit violations detected. Review abuse detection panel for details.
          </p>
        </div>
      )}

      {metrics?.predictiveScalingNeeded && (
        <div className="card p-6 border-2 border-orange-500/30 bg-orange-500/5">
          <div className="flex items-center gap-3 mb-3">
            <Icon name="TrendingUp" size={24} className="text-orange-500" />
            <h3 className="text-lg font-semibold text-foreground">Predictive Scaling Recommended</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {metrics?.highUtilizationEndpoints} endpoint(s) approaching quota limits. Consider increasing capacity.
          </p>
        </div>
      )}

      {/* Top Endpoints by Utilization */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="BarChart" size={20} className="text-primary" />
          Top Endpoints by Quota Utilization
        </h3>
        <div className="space-y-3">
          {topEndpoints?.map((endpoint, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-500/10 text-blue-500">
                    {endpoint?.method}
                  </span>
                  <span className="font-mono text-sm font-medium text-foreground">{endpoint?.endpoint}</span>
                </div>
                <span className={`text-sm font-bold ${
                  parseFloat(endpoint?.utilization) > 80 ? 'text-red-500' :
                  parseFloat(endpoint?.utilization) > 60 ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {endpoint?.utilization}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    parseFloat(endpoint?.utilization) > 80 ? 'bg-red-500' :
                    parseFloat(endpoint?.utilization) > 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${endpoint?.utilization}%` }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {endpoint?.requestsPerMinute} / {endpoint?.quota} requests/min
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuotaOverviewPanel;