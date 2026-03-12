import React from 'react';
import Icon from '../../../components/AppIcon';

const EndpointPerformancePanel = ({ performanceData }) => {
  const topEndpoints = Object.values(performanceData?.endpointMetrics || {})?.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
          <Icon name="Server" size={20} />
          Endpoint Performance Metrics
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Real-time performance monitoring across 200+ API endpoints with comprehensive metrics and analytics
        </p>
      </div>

      {/* Top Endpoints Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="List" size={20} />
          Top Endpoints by Request Volume
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Endpoint</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Requests</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Avg (ms)</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">P95 (ms)</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Error Rate</th>
              </tr>
            </thead>
            <tbody>
              {topEndpoints?.map((endpoint, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4 text-sm font-mono text-gray-900 dark:text-gray-100">{endpoint?.endpoint}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-700 dark:text-gray-300">
                    {endpoint?.requestCount?.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-gray-700 dark:text-gray-300">
                    {endpoint?.avgResponseTime}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-gray-700 dark:text-gray-300">
                    {endpoint?.p95ResponseTime}
                  </td>
                  <td className="py-3 px-4 text-sm text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        parseFloat(endpoint?.errorRate) > 5
                          ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                          : parseFloat(endpoint?.errorRate) > 2
                          ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' :'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                      }`}
                    >
                      {endpoint?.errorRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EndpointPerformancePanel;