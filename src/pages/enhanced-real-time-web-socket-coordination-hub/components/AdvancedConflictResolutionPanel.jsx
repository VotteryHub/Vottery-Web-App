import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Brain, Shield } from 'lucide-react';

const AdvancedConflictResolutionPanel = () => {
  const [conflicts] = useState([
    {
      id: 1,
      type: 'Data Synchronization',
      agents: ['Claude', 'Perplexity'],
      severity: 'medium',
      status: 'resolved',
      resolution: 'Priority-based merge',
      time: '2m ago'
    },
    {
      id: 2,
      type: 'Recommendation Conflict',
      agents: ['OpenAI', 'Anthropic'],
      severity: 'low',
      status: 'resolving',
      resolution: 'Consensus algorithm',
      time: '5m ago'
    },
    {
      id: 3,
      type: 'State Update',
      agents: ['Claude', 'OpenAI', 'Perplexity'],
      severity: 'high',
      status: 'resolved',
      resolution: 'Last-write-wins',
      time: '8m ago'
    }
  ]);

  const [resolutionStrategies] = useState([
    { name: 'Last-Write-Wins', usage: 45, successRate: 98 },
    { name: 'Priority-Based', usage: 30, successRate: 96 },
    { name: 'Consensus', usage: 20, successRate: 94 },
    { name: 'Manual Review', usage: 5, successRate: 100 }
  ]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'yellow';
      default: return 'gray';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-50 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Advanced Conflict Resolution</h2>
            <p className="text-sm text-gray-600">Real-time detection with priority-based resolution algorithms</p>
          </div>
        </div>
      </div>

      {/* Resolution Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">156</div>
          <div className="text-xs text-gray-600">Resolved Today</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-white rounded-lg border border-orange-200">
          <div className="text-2xl font-bold text-orange-600">2</div>
          <div className="text-xs text-gray-600">Active Conflicts</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">1.8s</div>
          <div className="text-xs text-gray-600">Avg Resolution</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">97%</div>
          <div className="text-xs text-gray-600">Success Rate</div>
        </div>
      </div>

      {/* Recent Conflicts */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-orange-600" />
          Recent Conflicts
        </h3>
        <div className="space-y-2">
          {conflicts?.map((conflict) => {
            const severityColor = getSeverityColor(conflict?.severity);
            return (
              <div
                key={conflict?.id}
                className={`p-4 bg-${severityColor}-50 rounded-lg border border-${severityColor}-200`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">{conflict?.type}</span>
                      {conflict?.status === 'resolved' && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                      <Brain className="w-3 h-3" />
                      <span>{conflict?.agents?.join(' vs ')}</span>
                      <span>•</span>
                      <span>{conflict?.time}</span>
                    </div>
                    <div className="text-xs text-gray-700">
                      <span className="font-medium">Resolution:</span> {conflict?.resolution}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium bg-${severityColor}-100 text-${severityColor}-700`}>
                      {conflict?.severity?.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      conflict?.status === 'resolved' ?'bg-green-100 text-green-700' :'bg-blue-100 text-blue-700'
                    }`}>
                      {conflict?.status?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resolution Strategies */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Resolution Strategies</h3>
        <div className="space-y-3">
          {resolutionStrategies?.map((strategy, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 font-medium">{strategy?.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600">{strategy?.usage}% usage</span>
                  <span className="text-green-600 font-medium">{strategy?.successRate}% success</span>
                </div>
              </div>
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500"
                  style={{ width: `${strategy?.usage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedConflictResolutionPanel;