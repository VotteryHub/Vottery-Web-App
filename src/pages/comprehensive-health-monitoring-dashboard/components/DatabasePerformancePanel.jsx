import React from 'react';
import Icon from '../../../components/AppIcon';

const DatabasePerformancePanel = ({ databasePerformance }) => {
  const metrics = [
    { label: 'Query Execution Time', value: `${databasePerformance?.queryTime}ms`, icon: 'Clock', status: 'healthy', target: '<50ms' },
    { label: 'Connection Pool Usage', value: `${databasePerformance?.connectionPool}%`, icon: 'Link', status: 'warning', target: '<80%' },
    { label: 'Storage Utilization', value: `${databasePerformance?.storageUtilization}%`, icon: 'HardDrive', status: 'healthy', target: '<75%' },
    { label: 'Replication Lag', value: `${databasePerformance?.replicationLag}ms`, icon: 'RefreshCw', status: 'healthy', target: '<20ms' },
    { label: 'Slow Queries', value: databasePerformance?.slowQueries, icon: 'AlertCircle', status: 'warning', target: '0' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-500 bg-green-500/10';
      case 'warning': return 'text-yellow-500 bg-yellow-500/10';
      case 'critical': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Database Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics?.map((metric, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(metric?.status)}`}>
                <Icon name={metric?.icon} size={20} className={getStatusColor(metric?.status)?.split(' ')?.[0]} />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(metric?.status)}`}>
                {metric?.status}
              </span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{metric?.value}</div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{metric?.label}</span>
              <span className="text-xs text-muted-foreground">Target: {metric?.target}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Optimization Opportunities */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="Lightbulb" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Optimization Recommendations</h3>
        </div>
        <div className="space-y-3">
          {databasePerformance?.optimizationOpportunities?.map((opportunity, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      opportunity?.impact === 'high' ? 'bg-red-500/10 text-red-500' :
                      opportunity?.impact === 'medium' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {opportunity?.impact} impact
                    </span>
                  </div>
                  <p className="text-sm font-mono text-foreground mb-2">{opportunity?.query}</p>
                  <div className="flex items-center gap-2">
                    <Icon name="ArrowRight" size={14} className="text-primary" />
                    <span className="text-sm text-muted-foreground">{opportunity?.recommendation}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Query Performance Breakdown */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Query Performance Breakdown</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Fast Queries (&lt;50ms)</span>
              <span className="text-sm font-semibold text-green-500">87%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Medium Queries (50-200ms)</span>
              <span className="text-sm font-semibold text-yellow-500">11%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '11%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Slow Queries (&gt;200ms)</span>
              <span className="text-sm font-semibold text-red-500">2%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: '2%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabasePerformancePanel;