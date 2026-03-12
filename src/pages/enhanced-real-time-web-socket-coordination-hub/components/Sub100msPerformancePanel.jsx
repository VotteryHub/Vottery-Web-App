import React, { useState, useEffect } from 'react';
import { Zap, TrendingUp, Activity, Target } from 'lucide-react';

const Sub100msPerformancePanel = ({ currentLatency }) => {
  const [metrics, setMetrics] = useState({
    p50: 42,
    p95: 78,
    p99: 92,
    jitter: 8,
    throughput: 12500,
    packetLoss: 0.02
  });

  const [optimizations] = useState([
    { id: 1, name: 'TCP Fast Open', status: 'active', improvement: '12ms' },
    { id: 2, name: 'Connection Pooling', status: 'active', improvement: '8ms' },
    { id: 3, name: 'Compression', status: 'active', improvement: '15ms' },
    { id: 4, name: 'Multiplexing', status: 'active', improvement: '6ms' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        p50: Math.max(35, Math.min(60, prev?.p50 + Math.floor(Math.random() * 6 - 3))),
        p95: Math.max(65, Math.min(95, prev?.p95 + Math.floor(Math.random() * 8 - 4))),
        throughput: Math.max(10000, Math.min(15000, prev?.throughput + Math.floor(Math.random() * 1000 - 500)))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Sub-100ms Performance Engine</h2>
            <p className="text-sm text-gray-600">Real-time latency optimization with intelligent bandwidth allocation</p>
          </div>
        </div>
      </div>

      {/* Latency Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">P50 Latency</span>
            <Target className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{metrics?.p50}ms</div>
          <div className="text-xs text-gray-500 mt-1">Median response time</div>
        </div>

        <div className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">P95 Latency</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">{metrics?.p95}ms</div>
          <div className="text-xs text-gray-500 mt-1">95th percentile</div>
        </div>

        <div className="p-4 bg-gradient-to-br from-orange-50 to-white rounded-lg border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">P99 Latency</span>
            <Activity className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-600">{metrics?.p99}ms</div>
          <div className="text-xs text-gray-500 mt-1">99th percentile</div>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-900">{metrics?.jitter}ms</div>
          <div className="text-xs text-gray-600">Jitter</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-900">{(metrics?.throughput / 1000)?.toFixed(1)}k/s</div>
          <div className="text-xs text-gray-600">Throughput</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-900">{metrics?.packetLoss}%</div>
          <div className="text-xs text-gray-600">Packet Loss</div>
        </div>
      </div>

      {/* Active Optimizations */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Active Optimizations</h3>
        <div className="space-y-2">
          {optimizations?.map((opt) => (
            <div
              key={opt?.id}
              className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-900">{opt?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-green-700 font-medium">-{opt?.improvement}</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                  {opt?.status?.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Graph Placeholder */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Latency Trend (Last 60s)</h3>
          <span className="text-xs text-gray-600">Current: {currentLatency}ms</span>
        </div>
        <div className="h-24 bg-gradient-to-t from-blue-50 to-transparent rounded-lg flex items-end justify-between px-2 pb-2">
          {[...Array(20)]?.map((_, i) => (
            <div
              key={i}
              className="w-2 bg-blue-500 rounded-t transition-all duration-300"
              style={{ height: `${Math.random() * 80 + 20}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sub100msPerformancePanel;