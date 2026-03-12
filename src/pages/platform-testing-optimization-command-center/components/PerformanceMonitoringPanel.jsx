import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceMonitoringPanel = ({ performanceData, onRefresh }) => {
  if (!performanceData) {
    return (
      <div className="card p-8 text-center">
        <Icon name="AlertCircle" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No performance data available</p>
      </div>
    );
  }

  const { loadTime, firstContentfulPaint, largestContentfulPaint, timeToInteractive, cumulativeLayoutShift, databaseQueries, scalability } = performanceData;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Load Time</h3>
            <Icon name="Zap" size={20} className="text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-500">
            {loadTime}s
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">FCP</h3>
            <Icon name="Eye" size={20} className="text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-500">
            {firstContentfulPaint}s
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">TTI</h3>
            <Icon name="Activity" size={20} className="text-yellow-500" />
          </div>
          <div className="text-3xl font-bold text-yellow-500">
            {timeToInteractive}s
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Database" size={20} className="text-primary" />
            Database Performance
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Avg Response Time</span>
              <span className="font-medium text-foreground">{databaseQueries?.avgResponseTime}ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Slow Queries</span>
              <span className="font-medium text-red-500">{databaseQueries?.slowQueries}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Optimization Opportunities</span>
              <span className="font-medium text-yellow-500">{databaseQueries?.optimizationOpportunities}</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="TrendingUp" size={20} className="text-primary" />
            Scalability Assessment
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Current Load</span>
              <span className="font-medium text-foreground">{scalability?.currentLoad?.toLocaleString()} users</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Max Capacity</span>
              <span className="font-medium text-foreground">{scalability?.maxCapacity?.toLocaleString()} users</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Utilization Rate</span>
              <span className="font-medium text-green-500">{scalability?.utilizationRate}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitoringPanel;