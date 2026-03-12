import React, { useState } from 'react';
import { Shield, GitMerge, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const ConflictResolutionPanel = () => {
  const [resolutionMethods] = useState([
    { id: 1, method: 'Priority-Based', usage: 45, successRate: 98 },
    { id: 2, method: 'Timestamp Validation', usage: 30, successRate: 96 },
    { id: 3, method: 'Consensus Mechanism', usage: 20, successRate: 94 },
    { id: 4, method: 'Manual Override', usage: 5, successRate: 100 }
  ]);

  const [recentResolutions] = useState([
    { id: 1, conflict: 'Simultaneous Data Update', method: 'Priority-Based', time: '0.8s', status: 'success' },
    { id: 2, conflict: 'Recommendation Collision', method: 'Consensus', time: '1.2s', status: 'success' },
    { id: 3, conflict: 'State Synchronization', method: 'Timestamp', time: '0.5s', status: 'success' },
    { id: 4, conflict: 'Multi-Agent Write', method: 'Priority-Based', time: '1.5s', status: 'pending' }
  ]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Conflict Resolution Engine</h2>
            <p className="text-sm text-gray-600">Automated resolution with comprehensive audit trails</p>
          </div>
        </div>
      </div>

      {/* Resolution Methods */}
      <div className="space-y-3 mb-6">
        {resolutionMethods?.map((method) => (
          <div
            key={method?.id}
            className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <GitMerge className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-gray-900">{method?.method}</span>
              </div>
              <span className="text-sm font-semibold text-green-600">{method?.successRate}%</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-full transition-all"
                    style={{ width: `${method?.usage}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-gray-600">{method?.usage}% usage</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Resolutions */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          Recent Resolutions
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {recentResolutions?.map((resolution) => (
            <div
              key={resolution?.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {resolution?.status === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                  )}
                  <span className="text-sm font-medium text-gray-900">{resolution?.conflict}</span>
                </div>
                <div className="text-xs text-gray-600">
                  {resolution?.method} • Resolved in {resolution?.time}
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                resolution?.status === 'success' ?'bg-green-100 text-green-700' :'bg-orange-100 text-orange-700'
              }`}>
                {resolution?.status?.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Resolution Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">48</div>
            <div className="text-xs text-gray-600">Resolved Today</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">1.2s</div>
            <div className="text-xs text-gray-600">Avg Time</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">97%</div>
            <div className="text-xs text-gray-600">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConflictResolutionPanel;