import React from 'react';
import { Activity, Zap } from 'lucide-react';

const PerformanceMetricsPanel = () => {
  const metrics = [
    {
      name: 'Processing Latency',
      value: '45ms',
      status: 'excellent',
      target: '<100ms'
    },
    {
      name: 'Data Throughput',
      value: '12.4K/s',
      status: 'good',
      target: '>10K/s'
    },
    {
      name: 'ML Model Response',
      value: '89ms',
      status: 'good',
      target: '<150ms'
    },
    {
      name: 'Heatmap Refresh',
      value: '5.2s',
      status: 'excellent',
      target: '<10s'
    }
  ];

  const alerts = [
    {
      type: 'info',
      message: 'Heatmap processing optimized',
      time: '2 min ago'
    },
    {
      type: 'success',
      message: 'ML model accuracy improved to 94.2%',
      time: '15 min ago'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'warning':
        return 'text-orange-600';
      default:
        return 'text-red-600';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100';
      case 'good':
        return 'bg-blue-100';
      case 'warning':
        return 'bg-orange-100';
      default:
        return 'bg-red-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Zap className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Performance Metrics</h2>
          <p className="text-sm text-gray-600">Real-time system health</p>
        </div>
      </div>
      {/* Metrics */}
      <div className="space-y-4 mb-6">
        {metrics?.map((metric, idx) => (
          <div key={idx} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className={`w-4 h-4 ${getStatusColor(metric?.status)}`} />
                <span className="font-medium text-gray-900">{metric?.name}</span>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  getStatusBg(metric?.status)
                } ${getStatusColor(metric?.status)}`}
              >
                {metric?.status}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">{metric?.value}</span>
              <span className="text-sm text-gray-600">Target: {metric?.target}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Alerts */}
      <div className="space-y-2 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Activity</h3>
        {alerts?.map((alert, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg ${
              alert?.type === 'success' ?'bg-green-50 border border-green-200' :'bg-blue-50 border border-blue-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">{alert?.message}</p>
              <span className="text-xs text-gray-500">{alert?.time}</span>
            </div>
          </div>
        ))}
      </div>
      {/* System Stats */}
      <div className="pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">99.8%</div>
            <div className="text-xs text-gray-600">Uptime</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">3.2M</div>
            <div className="text-xs text-gray-600">Events Processed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetricsPanel;