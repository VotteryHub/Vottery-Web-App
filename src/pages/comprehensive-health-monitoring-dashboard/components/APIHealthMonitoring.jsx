import React from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const APIHealthMonitoring = ({ apiHealth }) => {
  const endpointData = apiHealth?.endpoints?.map(endpoint => ({
    name: endpoint?.name?.replace('/api/', ''),
    responseTime: endpoint?.responseTime,
    errorRate: endpoint?.errorRate * 100
  }));

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const thresholdBreaches = [
    { endpoint: '/api/payments', metric: 'Response Time', value: '342ms', threshold: '300ms', severity: 'warning' },
    { endpoint: '/api/payments', metric: 'Error Rate', value: '0.05%', threshold: '0.03%', severity: 'warning' }
  ];

  return (
    <div className="space-y-6">
      {/* API Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Avg Response Time</span>
            <Icon name="Zap" size={20} className="text-primary" />
          </div>
          <div className="text-3xl font-bold text-foreground">{apiHealth?.responseTime}ms</div>
          <div className="text-xs text-green-500 mt-1">-12ms from yesterday</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Error Rate</span>
            <Icon name="AlertCircle" size={20} className="text-green-500" />
          </div>
          <div className="text-3xl font-bold text-foreground">{apiHealth?.errorRate}%</div>
          <div className="text-xs text-green-500 mt-1">-0.01% improvement</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Throughput</span>
            <Icon name="TrendingUp" size={20} className="text-primary" />
          </div>
          <div className="text-3xl font-bold text-foreground">{apiHealth?.throughput}</div>
          <div className="text-xs text-muted-foreground mt-1">requests/min</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Availability</span>
            <Icon name="CheckCircle" size={20} className="text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-500">{apiHealth?.availability}%</div>
          <div className="text-xs text-muted-foreground mt-1">Last 24 hours</div>
        </div>
      </div>

      {/* Endpoint Performance Chart */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="BarChart" size={20} className="text-primary" />
          Endpoint Response Times
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={endpointData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Bar dataKey="responseTime" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Endpoint Details */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Endpoint Health Details</h3>
        <div className="space-y-3">
          {apiHealth?.endpoints?.map((endpoint, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(endpoint?.status)}`}></div>
                  <span className="font-mono text-sm font-medium text-foreground">{endpoint?.name}</span>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                  endpoint?.status === 'healthy' ? 'bg-green-500/10 text-green-500' :
                  endpoint?.status === 'warning' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  {endpoint?.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <span className="text-xs text-muted-foreground">Response Time</span>
                  <div className="text-sm font-semibold text-foreground">{endpoint?.responseTime}ms</div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Error Rate</span>
                  <div className="text-sm font-semibold text-foreground">{(endpoint?.errorRate * 100)?.toFixed(2)}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Threshold Breaches */}
      {thresholdBreaches?.length > 0 && (
        <div className="card p-6 border-2 border-yellow-500/30 bg-yellow-500/5">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="AlertTriangle" size={20} className="text-yellow-500" />
            <h3 className="text-lg font-semibold text-foreground">Threshold Breaches Detected</h3>
          </div>
          <div className="space-y-3">
            {thresholdBreaches?.map((breach, index) => (
              <div key={index} className="p-4 bg-white dark:bg-gray-900 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm font-medium text-foreground">{breach?.endpoint}</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    breach?.severity === 'warning' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {breach?.severity}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {breach?.metric}: <span className="font-semibold text-foreground">{breach?.value}</span> exceeds threshold of <span className="font-semibold">{breach?.threshold}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default APIHealthMonitoring;