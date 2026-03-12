import React, { useState } from 'react';
import { Settings, Lock, TrendingUp, RotateCcw, Layers } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const AdvancedFeaturesPanel = () => {
  const [features] = useState([
    { id: 1, name: 'Distributed Locking', icon: Lock, status: 'active', efficiency: 99.1 },
    { id: 2, name: 'Eventual Consistency', icon: Layers, status: 'active', efficiency: 98.7 },
    { id: 3, name: 'Auto Rollback', icon: RotateCcw, status: 'active', efficiency: 97.5 },
    { id: 4, name: 'Predictive Scaling', icon: TrendingUp, status: 'active', efficiency: 96.8 }
  ]);

  const [systemMetrics] = useState({
    lockAcquisitions: 1247,
    consistencyChecks: 3894,
    rollbacksExecuted: 12,
    scalingEvents: 8
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-50 rounded-lg">
            <Settings className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Advanced Features</h2>
            <p className="text-sm text-gray-600">Subscription health & predictive scaling monitoring</p>
          </div>
        </div>
      </div>

      {/* Feature Status Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {features?.map((feature) => {
          const Icon = feature?.icon;
          return (
            <div
              key={feature?.id}
              className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 hover:border-teal-300 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-teal-600" />
                  <span className="font-medium text-gray-900">{feature?.name}</span>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Efficiency</span>
                  <span className="font-semibold text-green-600">{feature?.efficiency}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-teal-500 to-green-500 h-full transition-all"
                    style={{ width: `${feature?.efficiency}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* System Metrics */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">System Metrics (Last 24h)</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{systemMetrics?.lockAcquisitions?.toLocaleString()}</div>
            <div className="text-xs text-gray-600">Lock Acquisitions</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">{systemMetrics?.consistencyChecks?.toLocaleString()}</div>
            <div className="text-xs text-gray-600">Consistency Checks</div>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-2xl font-bold text-orange-600">{systemMetrics?.rollbacksExecuted}</div>
            <div className="text-xs text-gray-600">Rollbacks Executed</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">{systemMetrics?.scalingEvents}</div>
            <div className="text-xs text-gray-600">Scaling Events</div>
          </div>
        </div>
      </div>

      {/* Connection Multiplexing */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-teal-50 to-green-50 rounded-lg border border-teal-200">
          <div>
            <div className="font-medium text-gray-900">Connection Multiplexing</div>
            <div className="text-xs text-gray-600 mt-1">Optimizing bandwidth across all subscriptions</div>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">ACTIVE</span>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFeaturesPanel;