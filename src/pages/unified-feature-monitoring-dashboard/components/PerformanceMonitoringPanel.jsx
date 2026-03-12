import React from 'react';
import { Zap, Activity, TrendingUp } from 'lucide-react';

const PerformanceMonitoringPanel = ({ timeRange }) => {
  const performanceMetrics = [
    {
      name: 'API Response Time',
      value: '145ms',
      threshold: '200ms',
      status: 'good',
      trend: '-12ms',
      utilization: 72
    },
    {
      name: 'Database Query Time',
      value: '89ms',
      threshold: '150ms',
      status: 'good',
      trend: '-8ms',
      utilization: 59
    },
    {
      name: 'CPU Utilization',
      value: '68%',
      threshold: '80%',
      status: 'warning',
      trend: '+5%',
      utilization: 68
    },
    {
      name: 'Memory Usage',
      value: '5.2GB',
      threshold: '8GB',
      status: 'good',
      trend: '+0.3GB',
      utilization: 65
    },
    {
      name: 'Error Rate',
      value: '0.12%',
      threshold: '1%',
      status: 'good',
      trend: '-0.05%',
      utilization: 12
    },
    {
      name: 'Concurrent Users',
      value: '3,450',
      threshold: '5,000',
      status: 'good',
      trend: '+450',
      utilization: 69
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-orange-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'good':
        return 'bg-green-100';
      case 'warning':
        return 'bg-orange-100';
      case 'critical':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getBarColor = (status) => {
    switch (status) {
      case 'good':
        return 'bg-green-600';
      case 'warning':
        return 'bg-orange-600';
      case 'critical':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Zap className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Performance Monitoring</h2>
          <p className="text-sm text-gray-600">System resource utilization and response times</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {performanceMetrics?.map((metric, idx) => (
          <div
            key={idx}
            className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-3">
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

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-bold text-gray-900">{metric?.value}</span>
              <span className="text-sm text-gray-600">/ {metric?.threshold}</span>
              <span
                className={`text-xs font-medium ml-auto ${
                  metric?.trend?.startsWith('+') && metric?.name !== 'Concurrent Users'
                    ? 'text-red-600' :'text-green-600'
                }`}
              >
                {metric?.trend}
              </span>
            </div>

            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${getBarColor(metric?.status)}`}
                style={{ width: `${metric?.utilization}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">
              Automated Optimization Recommendations
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Consider scaling CPU resources during peak hours (2-4 PM)</li>
              <li>• Database query optimization detected for 3 slow queries</li>
              <li>• Cache hit rate can be improved by 15% with Redis configuration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitoringPanel;