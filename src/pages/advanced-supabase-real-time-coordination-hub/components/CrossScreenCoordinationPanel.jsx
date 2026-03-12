import React, { useState } from 'react';
import { Network, ArrowRight, Activity, Gauge } from 'lucide-react';

const CrossScreenCoordinationPanel = () => {
  const [dataFlows] = useState([
    { id: 1, from: 'Admin Dashboard', to: 'Creator Interface', rate: '1.2k/s', load: 45 },
    { id: 2, from: 'Elections Hub', to: 'User Screens', rate: '2.8k/s', load: 78 },
    { id: 3, from: 'Fraud Detection', to: 'Admin Dashboard', rate: '0.8k/s', load: 32 },
    { id: 4, from: 'Analytics Center', to: 'All Screens', rate: '1.5k/s', load: 56 }
  ]);

  const [routingMetrics] = useState({
    totalRoutes: 342,
    activeConnections: 117,
    loadBalanced: 98.5,
    avgThroughput: '6.3k/s'
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Network className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Cross-Screen Coordination</h2>
            <p className="text-sm text-gray-600">Real-time data flow with intelligent routing</p>
          </div>
        </div>
      </div>

      {/* Routing Metrics */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-indigo-50 to-white rounded-lg border border-indigo-200">
          <div className="text-2xl font-bold text-indigo-600">{routingMetrics?.totalRoutes}</div>
          <div className="text-xs text-gray-600">Total Routes</div>
        </div>
        <div className="p-3 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{routingMetrics?.activeConnections}</div>
          <div className="text-xs text-gray-600">Active Connections</div>
        </div>
        <div className="p-3 bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{routingMetrics?.loadBalanced}%</div>
          <div className="text-xs text-gray-600">Load Balanced</div>
        </div>
        <div className="p-3 bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">{routingMetrics?.avgThroughput}</div>
          <div className="text-xs text-gray-600">Throughput</div>
        </div>
      </div>

      {/* Data Flow Visualization */}
      <div className="space-y-3">
        {dataFlows?.map((flow) => (
          <div
            key={flow?.id}
            className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="px-3 py-1 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-sm font-medium text-blue-700">{flow?.from}</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
                <div className="px-3 py-1 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-sm font-medium text-green-700">{flow?.to}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{flow?.rate}</div>
                  <div className="text-xs text-gray-600">Data Rate</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Gauge className="w-4 h-4 text-gray-600" />
              <div className="flex-1">
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      flow?.load > 70 ? 'bg-orange-500' : flow?.load > 50 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${flow?.load}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-gray-600">{flow?.load}% load</span>
            </div>
          </div>
        ))}
      </div>

      {/* Coordination Status */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-600 animate-pulse" />
            <span className="text-sm text-gray-600">Intelligent routing with load balancing active</span>
          </div>
          <span className="text-sm font-medium text-green-600">Optimal Performance</span>
        </div>
      </div>
    </div>
  );
};

export default CrossScreenCoordinationPanel;