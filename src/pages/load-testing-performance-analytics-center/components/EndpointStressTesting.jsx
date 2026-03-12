import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EndpointStressTesting = ({ endpoints }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);

  if (!endpoints || endpoints?.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center text-gray-500 dark:text-gray-400">
        <Icon name="Zap" size={48} className="mx-auto mb-3 opacity-30" />
        <p>No endpoint data available</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'warning': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
      case 'critical': return 'bg-red-500/10 text-red-600 dark:text-red-400';
      default: return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Endpoint Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {endpoints?.map((endpoint) => (
          <div key={endpoint?.name} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Icon name="Zap" size={20} className="text-primary" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{endpoint?.name}</h3>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getStatusColor(endpoint?.status)}`}>
                {endpoint?.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Response</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{endpoint?.avgResponseTime}ms</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Throughput</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{endpoint?.throughput}/min</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">P95 Latency</div>
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{endpoint?.p95}ms</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">P99 Latency</div>
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{endpoint?.p99}ms</div>
              </div>
            </div>

            {/* Performance Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Error Rate</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{endpoint?.errorRate}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    endpoint?.errorRate > 5 ? 'bg-red-500' :
                    endpoint?.errorRate > 2 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(endpoint?.errorRate * 10, 100)}%` }}
                />
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedEndpoint(endpoint)}
              className="w-full flex items-center justify-center gap-2"
            >
              <Icon name="Play" size={14} />
              Run Stress Test
            </Button>
          </div>
        ))}
      </div>

      {/* Endpoint Comparison Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Icon name="BarChart3" size={20} className="text-primary" />
            Endpoint Performance Comparison
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Endpoint
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Avg Response
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  P95
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  P99
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Throughput
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Error Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {endpoints?.map((endpoint) => (
                <tr key={endpoint?.name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {endpoint?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {endpoint?.avgResponseTime}ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {endpoint?.p95}ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {endpoint?.p99}ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {endpoint?.throughput}/min
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {endpoint?.errorRate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${getStatusColor(endpoint?.status)}`}>
                      {endpoint?.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Breaking Point Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="AlertTriangle" size={20} className="text-primary" />
          Breaking Point Identification
        </h3>
        <div className="space-y-3">
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-900/30">
            <div className="flex items-start gap-3">
              <Icon name="AlertTriangle" size={20} className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">/api/payments - Performance Degradation</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                  Breaking point detected at 450 concurrent requests. Response time increases to 1456ms (target: &lt;500ms)
                </p>
                <div className="text-xs text-yellow-600 dark:text-yellow-400">
                  Recommendation: Optimize payment gateway integration, implement connection pooling
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-900/30">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={20} className="text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Automated Test Execution</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                  Schedule recurring stress tests to validate performance under various load conditions
                </p>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Icon name="Calendar" size={14} />
                  Schedule Tests
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndpointStressTesting;