import React, { useState } from 'react';
import { TrendingUp, Zap, BarChart3, Target } from 'lucide-react';

const PerformanceOptimizationPanel = () => {
  const [performanceMetrics] = useState({
    throughput: 8450,
    avgLatency: 145,
    p95Latency: 280,
    errorRate: 0.3,
    retryRate: 1.2,
    cacheHitRate: 87
  });

  const [optimizations] = useState([
    { id: 1, name: 'Response Caching', enabled: true, improvement: '42%', impact: 'high' },
    { id: 2, name: 'Batch Processing', enabled: true, improvement: '28%', impact: 'high' },
    { id: 3, name: 'Connection Pooling', enabled: true, improvement: '15%', impact: 'medium' },
    { id: 4, name: 'Payload Compression', enabled: true, improvement: '12%', impact: 'medium' }
  ]);

  const [scalingMetrics] = useState([
    { metric: 'Current Load', value: 68, threshold: 80, status: 'healthy' },
    { metric: 'Memory Usage', value: 54, threshold: 75, status: 'healthy' },
    { metric: 'CPU Usage', value: 42, threshold: 70, status: 'healthy' },
    { metric: 'Queue Depth', value: 12, threshold: 50, status: 'healthy' }
  ]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Performance Optimization</h2>
            <p className="text-sm text-gray-600">Predictive scaling with intelligent resource allocation</p>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-3 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Throughput</span>
            <Zap className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{performanceMetrics?.throughput?.toLocaleString()}</div>
          <div className="text-xs text-gray-500">events/min</div>
        </div>
        <div className="p-3 bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Avg Latency</span>
            <Target className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{performanceMetrics?.avgLatency}ms</div>
          <div className="text-xs text-gray-500">P95: {performanceMetrics?.p95Latency}ms</div>
        </div>
        <div className="p-3 bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Cache Hit Rate</span>
            <BarChart3 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">{performanceMetrics?.cacheHitRate}%</div>
          <div className="text-xs text-gray-500">Excellent</div>
        </div>
      </div>

      {/* Active Optimizations */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Active Optimizations</h3>
        <div className="space-y-2">
          {optimizations?.map((opt) => (
            <div
              key={opt?.id}
              className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-900">{opt?.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-green-700 font-medium">+{opt?.improvement}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  opt?.impact === 'high' ?'bg-orange-100 text-orange-700' :'bg-blue-100 text-blue-700'
                }`}>
                  {opt?.impact?.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Predictive Scaling */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Predictive Scaling Metrics</h3>
        <div className="space-y-3">
          {scalingMetrics?.map((metric, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 font-medium">{metric?.metric}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">{metric?.value}%</span>
                  <span className="text-xs text-gray-500">/ {metric?.threshold}%</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                    {metric?.status?.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    metric?.value > metric?.threshold
                      ? 'bg-gradient-to-r from-red-500 to-orange-500' :'bg-gradient-to-r from-green-500 to-teal-500'
                  }`}
                  style={{ width: `${(metric?.value / metric?.threshold) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Error Rate</div>
            <div className="text-lg font-bold text-green-600">{performanceMetrics?.errorRate}%</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Retry Rate</div>
            <div className="text-lg font-bold text-blue-600">{performanceMetrics?.retryRate}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceOptimizationPanel;