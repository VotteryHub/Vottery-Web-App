import React, { useState } from 'react';
import { Network, Layers, BarChart3, Zap } from 'lucide-react';

const ConnectionMultiplexingPanel = () => {
  const [channels] = useState([
    { id: 1, name: 'elections', subscriptions: 45, bandwidth: 2.4, priority: 'high', status: 'active' },
    { id: 2, name: 'votes', subscriptions: 38, bandwidth: 1.8, priority: 'high', status: 'active' },
    { id: 3, name: 'ai_recommendations', subscriptions: 32, bandwidth: 1.5, priority: 'medium', status: 'active' },
    { id: 4, name: 'fraud_alerts', subscriptions: 28, bandwidth: 1.2, priority: 'critical', status: 'active' },
    { id: 5, name: 'campaign_analytics', subscriptions: 24, bandwidth: 0.9, priority: 'medium', status: 'active' },
    { id: 6, name: 'user_profiles', subscriptions: 18, bandwidth: 0.6, priority: 'low', status: 'active' }
  ]);

  const [loadBalancing] = useState({
    algorithm: 'Weighted Round Robin',
    efficiency: 96,
    totalBandwidth: 8.4,
    availableBandwidth: 3.2,
    utilizationRate: 72
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'blue';
      case 'low': return 'gray';
      default: return 'gray';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-50 rounded-lg">
            <Network className="w-6 h-6 text-cyan-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Connection Multiplexing Optimization</h2>
            <p className="text-sm text-gray-600">Intelligent load balancing across subscription channels</p>
          </div>
        </div>
      </div>

      {/* Load Balancing Overview */}
      <div className="mb-6 p-4 bg-gradient-to-br from-cyan-50 to-white rounded-lg border border-cyan-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-600" />
            Load Balancing Status
          </h3>
          <span className="text-xs font-medium text-cyan-600 bg-cyan-100 px-2 py-1 rounded">
            {loadBalancing?.algorithm}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-xs text-gray-600">Efficiency</div>
            <div className="text-lg font-bold text-cyan-600">{loadBalancing?.efficiency}%</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Total Bandwidth</div>
            <div className="text-lg font-bold text-gray-900">{loadBalancing?.totalBandwidth} MB/s</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Available</div>
            <div className="text-lg font-bold text-green-600">{loadBalancing?.availableBandwidth} MB/s</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Utilization</div>
            <div className="text-lg font-bold text-orange-600">{loadBalancing?.utilizationRate}%</div>
          </div>
        </div>
        <div className="mt-3 bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-500"
            style={{ width: `${loadBalancing?.utilizationRate}%` }}
          />
        </div>
      </div>

      {/* Channel Subscriptions */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-600" />
          Active Subscription Channels
        </h3>
        <div className="space-y-2">
          {channels?.map((channel) => {
            const priorityColor = getPriorityColor(channel?.priority);
            return (
              <div
                key={channel?.id}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-cyan-300 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="font-medium text-gray-900">{channel?.name}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium bg-${priorityColor}-100 text-${priorityColor}-700`}>
                      {channel?.priority?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600">{channel?.status?.toUpperCase()}</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-600">Subscriptions</div>
                    <div className="font-semibold text-gray-900">{channel?.subscriptions}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Bandwidth</div>
                    <div className="font-semibold text-gray-900">{channel?.bandwidth} MB/s</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Allocation</div>
                    <div className="bg-gray-200 rounded-full h-2 overflow-hidden mt-1">
                      <div
                        className={`bg-${priorityColor}-500 h-full`}
                        style={{ width: `${(channel?.bandwidth / loadBalancing?.totalBandwidth) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Optimization Metrics */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-600" />
          Optimization Metrics
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-xs text-gray-600 mb-1">Connection Reuse Rate</div>
            <div className="text-2xl font-bold text-green-600">94%</div>
            <div className="text-xs text-gray-500 mt-1">Excellent efficiency</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-xs text-gray-600 mb-1">Avg Messages/Channel</div>
            <div className="text-2xl font-bold text-blue-600">1,247</div>
            <div className="text-xs text-gray-500 mt-1">High throughput</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-xs text-gray-600 mb-1">Channel Saturation</div>
            <div className="text-2xl font-bold text-purple-600">68%</div>
            <div className="text-xs text-gray-500 mt-1">Optimal range</div>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-xs text-gray-600 mb-1">Load Distribution</div>
            <div className="text-2xl font-bold text-orange-600">Balanced</div>
            <div className="text-xs text-gray-500 mt-1">No hotspots detected</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionMultiplexingPanel;