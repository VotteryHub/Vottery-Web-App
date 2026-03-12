import React from 'react';
import Icon from '../../../components/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PerformanceMetricsPanel = ({ systemHealth, latency }) => {
  const mockPerformanceData = [
    { time: '00:00', cpu: 45, memory: 62, latency: 45 },
    { time: '00:05', cpu: 52, memory: 65, latency: 38 },
    { time: '00:10', cpu: 48, memory: 63, latency: 42 },
    { time: '00:15', cpu: 55, memory: 68, latency: 35 },
    { time: '00:20', cpu: 50, memory: 64, latency: 40 },
    { time: '00:25', cpu: 47, memory: 62, latency: 43 }
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Performance Metrics
          </h2>
          <p className="text-sm text-muted-foreground">
            Continuous system health monitoring with real-time alerts
          </p>
        </div>
        <Icon name="TrendingUp" size={24} className="text-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Cpu" size={18} className="text-primary" />
            <span className="text-sm text-muted-foreground">CPU Usage</span>
          </div>
          <p className="text-3xl font-heading font-bold text-foreground">48%</p>
          <div className="flex items-center gap-1 mt-2">
            <Icon name="TrendingDown" size={14} className="text-success" />
            <span className="text-xs text-success">Normal range</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-secondary/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="HardDrive" size={18} className="text-secondary" />
            <span className="text-sm text-muted-foreground">Memory Usage</span>
          </div>
          <p className="text-3xl font-heading font-bold text-foreground">64%</p>
          <div className="flex items-center gap-1 mt-2">
            <Icon name="Activity" size={14} className="text-primary" />
            <span className="text-xs text-primary">Optimal</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-success/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Zap" size={18} className="text-success" />
            <span className="text-sm text-muted-foreground">Avg Latency</span>
          </div>
          <p className="text-3xl font-heading font-bold text-foreground">
            {Math.round(latency?.average || 0)}ms
          </p>
          <div className="flex items-center gap-1 mt-2">
            <Icon name="CheckCircle" size={14} className="text-success" />
            <span className="text-xs text-success">Sub-100ms</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Real-Time Performance Trends
        </h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="time" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                }}
              />
              <Line type="monotone" dataKey="cpu" stroke="#2563EB" strokeWidth={2} />
              <Line type="monotone" dataKey="memory" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="latency" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          System Health Status
        </h3>
        <div className="space-y-3">
          {systemHealth?.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <p>No health data available</p>
            </div>
          ) : (
            systemHealth?.slice(0, 5)?.map((item, index) => (
              <div key={index} className="p-3 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      item?.healthStatus === 'healthy' ? 'bg-success' :
                      item?.healthStatus === 'degraded' ? 'bg-warning' : 'bg-destructive'
                    }`} />
                    <div>
                      <h4 className="font-medium text-foreground">{item?.integrationName}</h4>
                      <p className="text-xs text-muted-foreground">{item?.integrationType}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {item?.averageResponseTimeMs}ms
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item?.successRate24h}% success
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetricsPanel;