import React, { useState } from 'react';
import { Brain, Lock, Database, RotateCcw } from 'lucide-react';

const MultiAISynchronizationPanel = () => {
  const [aiAgents] = useState([
    { id: 1, name: 'Claude', operations: 3247, locks: 12, conflicts: 2, syncRate: 99.8 },
    { id: 2, name: 'Perplexity', operations: 2891, locks: 8, conflicts: 1, syncRate: 99.6 },
    { id: 3, name: 'OpenAI', operations: 3105, locks: 10, conflicts: 0, syncRate: 99.9 },
    { id: 4, name: 'Anthropic', operations: 2654, locks: 6, conflicts: 1, syncRate: 99.7 }
  ]);

  const [lockingMetrics] = useState({
    activeLocks: 36,
    queuedOperations: 8,
    avgLockDuration: '0.3s',
    deadlocksDetected: 0,
    rollbacksExecuted: 3
  });

  const [recentRollbacks] = useState([
    {
      id: 1,
      agent: 'Perplexity',
      operation: 'Recommendation Update',
      reason: 'Consistency violation',
      timestamp: '3m ago',
      status: 'completed'
    },
    {
      id: 2,
      agent: 'Claude',
      operation: 'Data Synchronization',
      reason: 'Conflict detected',
      timestamp: '12m ago',
      status: 'completed'
    }
  ]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Multi-AI Synchronization</h2>
            <p className="text-sm text-gray-600">Distributed locking with eventual consistency & automated rollback</p>
          </div>
        </div>
      </div>

      {/* Locking Metrics */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-200">
          <div className="text-xl font-bold text-purple-600">{lockingMetrics?.activeLocks}</div>
          <div className="text-xs text-gray-600">Active Locks</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-200">
          <div className="text-xl font-bold text-blue-600">{lockingMetrics?.queuedOperations}</div>
          <div className="text-xs text-gray-600">Queued Ops</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-200">
          <div className="text-xl font-bold text-green-600">{lockingMetrics?.avgLockDuration}</div>
          <div className="text-xs text-gray-600">Avg Duration</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200">
          <div className="text-xl font-bold text-gray-600">{lockingMetrics?.deadlocksDetected}</div>
          <div className="text-xs text-gray-600">Deadlocks</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-white rounded-lg border border-orange-200">
          <div className="text-xl font-bold text-orange-600">{lockingMetrics?.rollbacksExecuted}</div>
          <div className="text-xs text-gray-600">Rollbacks</div>
        </div>
      </div>

      {/* AI Agent Status */}
      <div className="space-y-3 mb-6">
        {aiAgents?.map((agent) => (
          <div
            key={agent?.id}
            className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-900">{agent?.name}</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
              <span className="text-sm font-medium text-green-600">{agent?.syncRate}% sync</span>
            </div>
            <div className="grid grid-cols-4 gap-3 text-sm">
              <div>
                <div className="text-xs text-gray-600">Operations</div>
                <div className="font-semibold text-gray-900">{agent?.operations?.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600">Active Locks</div>
                <div className="font-semibold text-gray-900 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-purple-600" />
                  {agent?.locks}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600">Conflicts</div>
                <div className={`font-semibold ${
                  agent?.conflicts > 0 ? 'text-orange-600' : 'text-green-600'
                }`}>
                  {agent?.conflicts}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600">Sync Rate</div>
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden mt-1">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-full"
                    style={{ width: `${agent?.syncRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Rollbacks */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-orange-600" />
          Recent Rollbacks
        </h3>
        <div className="space-y-2">
          {recentRollbacks?.map((rollback) => (
            <div
              key={rollback?.id}
              className="p-3 bg-orange-50 rounded-lg border border-orange-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-gray-900">{rollback?.agent}</span>
                </div>
                <span className="text-xs text-gray-600">{rollback?.timestamp}</span>
              </div>
              <div className="text-sm text-gray-900 mb-1">{rollback?.operation}</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Reason: {rollback?.reason}</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded font-medium">
                  {rollback?.status?.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Consistency Monitor */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" />
            Eventual Consistency Monitor
          </h3>
          <span className="text-xs text-green-600 font-medium">All systems synchronized</span>
        </div>
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">Cross-agent data consistency</span>
            <span className="font-semibold text-green-600">99.8%</span>
          </div>
          <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 h-full" style={{ width: '99.8%' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiAISynchronizationPanel;