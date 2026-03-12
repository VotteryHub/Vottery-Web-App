import React from 'react';
import Icon from '../../../components/AppIcon';

const SystemHealthPanel = ({ healthData, onRefresh }) => {
  if (!healthData) {
    return (
      <div className="card p-8 text-center">
        <Icon name="AlertCircle" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No system health data available</p>
      </div>
    );
  }

  const { overallHealth, uptime, activeUsers, responseTime, errorRate, metrics } = healthData;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Overall Health</h3>
            <Icon name="Activity" size={20} className="text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-500">
            {overallHealth}%
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Uptime</h3>
            <Icon name="CheckCircle" size={20} className="text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-500">
            {uptime}%
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Active Users</h3>
            <Icon name="Users" size={20} className="text-primary" />
          </div>
          <div className="text-3xl font-bold text-foreground">
            {activeUsers?.toLocaleString()}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Response Time</h3>
            <Icon name="Zap" size={20} className="text-yellow-500" />
          </div>
          <div className="text-3xl font-bold text-foreground">
            {responseTime}ms
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Activity" size={20} className="text-primary" />
          System Component Health
        </h3>
        <div className="space-y-3">
          {metrics?.map((metric, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-foreground">{metric?.name}</p>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  metric?.status === 'healthy' ? 'bg-green-100 text-green-700' :
                  metric?.status === 'warning'? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  {metric?.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      metric?.value >= 95 ? 'bg-green-500' :
                      metric?.value >= 85 ? 'bg-yellow-500': 'bg-red-500'
                    }`}
                    style={{ width: `${metric?.value}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-foreground w-12 text-right">{metric?.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemHealthPanel;