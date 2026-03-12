import React from 'react';
import { Zap, TrendingDown, TrendingUp, Activity } from 'lucide-react';

const PerformanceMetricsPanel = ({ screenData }) => {
  if (!screenData || screenData?.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Metrics</h2>
        <p className="text-gray-500">Loading performance data...</p>
      </div>
    );
  }

  const latencies = screenData?.map(s => s?.averageLatency)?.filter(l => l > 0);
  const avgLatency = latencies?.length > 0
    ? (latencies?.reduce((a, b) => a + b, 0) / latencies?.length)?.toFixed(2)
    : 0;
  const minLatency = latencies?.length > 0 ? Math.min(...latencies)?.toFixed(2) : 0;
  const maxLatency = latencies?.length > 0 ? Math.max(...latencies)?.toFixed(2) : 0;

  const topPerformers = [...screenData]
    ?.sort((a, b) => a?.averageLatency - b?.averageLatency)
    ?.slice(0, 5);

  const slowestScreens = [...screenData]
    ?.sort((a, b) => b?.averageLatency - a?.averageLatency)
    ?.slice(0, 5);

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-600" />
          Performance Metrics
        </h2>
        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
          {avgLatency}ms Avg
        </span>
      </div>

      {/* Latency Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-green-900">Min Latency</span>
          </div>
          <p className="text-2xl font-bold text-green-700">{minLatency}ms</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-900">Avg Latency</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">{avgLatency}ms</p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-medium text-orange-900">Max Latency</span>
          </div>
          <p className="text-2xl font-bold text-orange-700">{maxLatency}ms</p>
        </div>
      </div>

      {/* Top Performers */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-green-600" />
          Top Performers
        </h3>
        <div className="space-y-2">
          {topPerformers?.map((screen, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-green-50 rounded-lg p-3 border border-green-200"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-green-700">#{index + 1}</span>
                <span className="text-sm text-gray-900">{screen?.screenName}</span>
              </div>
              <span className="text-sm font-bold text-green-700">{screen?.averageLatency?.toFixed(2)}ms</span>
            </div>
          ))}
        </div>
      </div>

      {/* Slowest Screens */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-orange-600" />
          Needs Optimization
        </h3>
        <div className="space-y-2">
          {slowestScreens?.map((screen, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-orange-50 rounded-lg p-3 border border-orange-200"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-orange-700">#{index + 1}</span>
                <span className="text-sm text-gray-900">{screen?.screenName}</span>
              </div>
              <span className="text-sm font-bold text-orange-700">{screen?.averageLatency?.toFixed(2)}ms</span>
            </div>
          ))}
        </div>
      </div>

      {/* Load Balancing Status */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Optimization Status</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Load Balancing</span>
            <span className="text-sm font-bold text-green-600">Active</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Failover</span>
            <span className="text-sm font-bold text-blue-600">Enabled</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Predictive Scaling</span>
            <span className="text-sm font-bold text-purple-600">Monitoring</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetricsPanel;