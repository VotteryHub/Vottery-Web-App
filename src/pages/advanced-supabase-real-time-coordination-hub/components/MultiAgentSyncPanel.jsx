import React, { useState } from 'react';
import { Users, Brain, AlertTriangle, CheckCircle } from 'lucide-react';

const MultiAgentSyncPanel = () => {
  const [agents] = useState([
    { id: 1, name: 'Claude', status: 'active', conflicts: 0, operations: 1247, confidence: 98 },
    { id: 2, name: 'Perplexity', status: 'active', conflicts: 1, operations: 892, confidence: 95 },
    { id: 3, name: 'OpenAI', status: 'active', conflicts: 0, operations: 1089, confidence: 97 },
    { id: 4, name: 'Anthropic', status: 'active', conflicts: 1, operations: 756, confidence: 96 }
  ]);

  const [recentConflicts] = useState([
    { id: 1, agents: ['Claude', 'Perplexity'], type: 'Data Update', resolved: true, time: '2m ago' },
    { id: 2, agents: ['OpenAI', 'Anthropic'], type: 'Recommendation', resolved: false, time: '5m ago' }
  ]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Multi-Agent Synchronization</h2>
            <p className="text-sm text-gray-600">AI coordination with intelligent conflict detection</p>
          </div>
        </div>
      </div>

      {/* Agent Status Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {agents?.map((agent) => (
          <div
            key={agent?.id}
            className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 hover:border-purple-300 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-900">{agent?.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-600 font-medium">ACTIVE</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Operations</span>
                <span className="font-medium text-gray-900">{agent?.operations?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Conflicts</span>
                <span className={`font-medium ${agent?.conflicts > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                  {agent?.conflicts}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Confidence</span>
                <span className="font-medium text-blue-600">{agent?.confidence}%</span>
              </div>
            </div>

            {/* Confidence Bar */}
            <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500"
                style={{ width: `${agent?.confidence}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Conflicts */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-600" />
          Recent Conflicts
        </h3>
        <div className="space-y-2">
          {recentConflicts?.map((conflict) => (
            <div
              key={conflict?.id}
              className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">{conflict?.type}</span>
                  {conflict?.resolved && <CheckCircle className="w-4 h-4 text-green-600" />}
                </div>
                <div className="text-xs text-gray-600">
                  {conflict?.agents?.join(' vs ')} • {conflict?.time}
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                conflict?.resolved 
                  ? 'bg-green-100 text-green-700' :'bg-orange-100 text-orange-700'
              }`}>
                {conflict?.resolved ? 'RESOLVED' : 'ACTIVE'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sync Metrics */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-purple-600">3,984</div>
            <div className="text-xs text-gray-600">Total Operations</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">99.8%</div>
            <div className="text-xs text-gray-600">Sync Success</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">1.2s</div>
            <div className="text-xs text-gray-600">Avg Sync Time</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiAgentSyncPanel;