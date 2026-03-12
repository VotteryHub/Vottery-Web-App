import React from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EndpointPerformancePanel = ({ performanceData, onSelectEndpoint }) => {
  if (!performanceData) return null;

  const { endpointMetrics, totalEndpoints } = performanceData;
  const endpoints = Object.values(endpointMetrics || {});

  const chartData = endpoints?.slice(0, 10)?.map(endpoint => ({
    name: endpoint?.endpoint?.replace('/api/', '')?.substring(0, 20),
    avgTime: parseFloat(endpoint?.avgResponseTime),
    p95Time: parseFloat(endpoint?.p95ResponseTime),
    errorRate: parseFloat(endpoint?.errorRate)
  }));

  const getHealthStatus = (endpoint) => {
    const avgTime = parseFloat(endpoint?.avgResponseTime);
    const errorRate = parseFloat(endpoint?.errorRate);
    
    if (avgTime > 2000 || errorRate > 5) return 'critical';
    if (avgTime > 1000 || errorRate > 2) return 'warning';
    return 'healthy';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Server" size={24} className="text-primary" />
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalEndpoints}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Endpoints</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Zap" size={24} className="text-blue-500" />
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {endpoints?.length > 0 ? (endpoints?.reduce((sum, e) => sum + parseFloat(e?.avgResponseTime), 0) / endpoints?.length)?.toFixed(0) : 0}ms
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="CheckCircle" size={24} className="text-green-500" />
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {endpoints?.filter(e => getHealthStatus(e) === 'healthy')?.length}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Healthy Endpoints</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="AlertTriangle" size={24} className="text-red-500" />
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {endpoints?.filter(e => getHealthStatus(e) === 'critical')?.length}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Critical Issues</p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="BarChart" size={20} />
          Response Time Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Bar dataKey="avgTime" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Avg Response Time (ms)" />
            <Bar dataKey="p95Time" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="P95 Response Time (ms)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Endpoint Details */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="List" size={20} />
          Endpoint Performance Details
        </h3>
        <div className="space-y-3">
          {endpoints?.slice(0, 15)?.map((endpoint, index) => {
            const status = getHealthStatus(endpoint);
            return (
              <div
                key={index}
                onClick={() => onSelectEndpoint(endpoint)}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
                    <span className="font-mono text-sm font-medium text-gray-900 dark:text-gray-100">
                      {endpoint?.endpoint}
                    </span>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                    status === 'healthy' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                    status === 'warning'? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                  }`}>
                    {status}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-3">
                  <div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Avg Response</span>
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{endpoint?.avgResponseTime}ms</div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">P95</span>
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{endpoint?.p95ResponseTime}ms</div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Error Rate</span>
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{endpoint?.errorRate}%</div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Requests</span>
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{endpoint?.requestCount}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EndpointPerformancePanel;