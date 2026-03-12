import React from 'react';
import Icon from '../../../components/AppIcon';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SystemHealthOverview = ({ healthData }) => {
  const performanceData = [
    { time: '00:00', health: 95, responseTime: 210 },
    { time: '04:00', health: 96, responseTime: 195 },
    { time: '08:00', health: 94, responseTime: 245 },
    { time: '12:00', health: 97, responseTime: 178 },
    { time: '16:00', health: 96, responseTime: 187 },
    { time: '20:00', health: 97, responseTime: 165 },
    { time: 'Now', health: healthData?.overallHealth, responseTime: healthData?.apiHealth?.responseTime }
  ];

  const metrics = [
    { label: 'API Response Time', value: `${healthData?.apiHealth?.responseTime}ms`, status: 'healthy', icon: 'Zap', change: '-12ms' },
    { label: 'Database Query Time', value: `${healthData?.databasePerformance?.queryTime}ms`, status: 'healthy', icon: 'Database', change: '-5ms' },
    { label: 'Error Rate', value: `${healthData?.apiHealth?.errorRate}%`, status: 'healthy', icon: 'AlertCircle', change: '-0.01%' },
    { label: 'Throughput', value: `${healthData?.apiHealth?.throughput}/min`, status: 'healthy', icon: 'TrendingUp', change: '+230' },
    { label: 'Storage Usage', value: `${healthData?.databasePerformance?.storageUtilization}%`, status: 'warning', icon: 'HardDrive', change: '+2%' },
    { label: 'Connection Pool', value: `${healthData?.databasePerformance?.connectionPool}%`, status: 'healthy', icon: 'Link', change: '+5%' }
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
      {/* Performance Trend Chart */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          24-Hour Performance Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={performanceData}>
            <defs>
              <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Area
              type="monotone"
              dataKey="health"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#healthGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* System Metrics Grid */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">System Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics?.map((metric, index) => (
            <div key={index} className="card p-5">
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
                <span className={`text-xs font-medium ${
                  metric?.change?.startsWith('+') ? 'text-green-500' : 'text-red-500'
                }`}>
                  {metric?.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Status */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Server" size={20} className="text-primary" />
          Service Status
        </h3>
        <div className="space-y-3">
          {[
            { name: 'Authentication Service', status: 'operational', uptime: 99.98 },
            { name: 'Voting Engine', status: 'operational', uptime: 99.97 },
            { name: 'Payment Processing', status: 'operational', uptime: 99.95 },
            { name: 'Real-time Subscriptions', status: 'degraded', uptime: 98.92 },
            { name: 'AI Services', status: 'operational', uptime: 99.94 },
            { name: 'Blockchain Verification', status: 'operational', uptime: 99.99 }
          ]?.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  service?.status === 'operational' ? 'bg-green-500' :
                  service?.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="font-medium text-foreground">{service?.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{service?.uptime}% uptime</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                  service?.status === 'operational' ? 'bg-green-500/10 text-green-500' :
                  service?.status === 'degraded' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  {service?.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemHealthOverview;