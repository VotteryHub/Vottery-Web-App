import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceMetricsPanel = ({ metrics }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
          <Icon name="BarChart" className="w-5 h-5 text-success" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Performance Metrics</h2>
          <p className="text-sm text-muted-foreground">Comprehensive monitoring and optimization analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Clock" className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Avg Sync Latency</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {metrics?.avgSyncLatency}s
          </div>
          <div className="text-xs text-success mt-1">
            ↓ 12% from last week
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="TrendingUp" className="w-4 h-4 text-warning" />
            <span className="text-xs text-muted-foreground">Peak Events/Min</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {metrics?.peakEventsPerMinute}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Last 24 hours
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Database" className="w-4 h-4 text-success" />
            <span className="text-xs text-muted-foreground">Total Processed</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {metrics?.totalEventsProcessed?.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            All time
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Activity" className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Uptime</span>
          </div>
          <div className="text-2xl font-bold text-success">
            {metrics?.uptime}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Last 30 days
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Zap" className="w-4 h-4 text-warning" />
            <span className="text-xs text-muted-foreground">API Response</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {metrics?.apiResponseTime}ms
          </div>
          <div className="text-xs text-success mt-1">
            ✓ Within SLA
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetricsPanel;