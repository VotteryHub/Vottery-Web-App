import React, { useState } from 'react';
import { Workflow, Play, Pause, RotateCcw } from 'lucide-react';

const WorkflowVisualizationPanel = () => {
  const [workflows] = useState([
    {
      id: 1,
      name: 'User Onboarding Flow',
      steps: 5,
      status: 'running',
      completionRate: 94,
      avgDuration: '2.3s'
    },
    {
      id: 2,
      name: 'Payment Processing Pipeline',
      steps: 7,
      status: 'running',
      completionRate: 98,
      avgDuration: '1.8s'
    },
    {
      id: 3,
      name: 'Fraud Detection Workflow',
      steps: 4,
      status: 'running',
      completionRate: 100,
      avgDuration: '0.9s'
    }
  ]);

  const [activeWorkflow] = useState({
    name: 'Payment Processing Pipeline',
    steps: [
      { id: 1, name: 'Receive Payment Event', status: 'completed', duration: '120ms' },
      { id: 2, name: 'Validate Payload', status: 'completed', duration: '85ms' },
      { id: 3, name: 'Transform Data', status: 'completed', duration: '150ms' },
      { id: 4, name: 'Route to Stripe', status: 'in_progress', duration: '-' },
      { id: 5, name: 'Update Database', status: 'pending', duration: '-' },
      { id: 6, name: 'Send Confirmation', status: 'pending', duration: '-' },
      { id: 7, name: 'Log Analytics', status: 'pending', duration: '-' }
    ]
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in_progress': return 'blue';
      case 'pending': return 'gray';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Workflow className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Workflow Visualization</h2>
            <p className="text-sm text-gray-600">Real-time workflow execution monitoring & analytics</p>
          </div>
        </div>
      </div>

      {/* Active Workflows Summary */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Active Workflows</h3>
        <div className="space-y-2">
          {workflows?.map((workflow) => (
            <div
              key={workflow?.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">{workflow?.name}</div>
                  <div className="text-xs text-gray-600">{workflow?.steps} steps • {workflow?.avgDuration} avg</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-600">{workflow?.completionRate}%</div>
                  <div className="text-xs text-gray-600">success</div>
                </div>
                <button className="p-1.5 hover:bg-gray-200 rounded transition-colors">
                  <Pause className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Workflow Execution */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">{activeWorkflow?.name}</h3>
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
              <Play className="w-4 h-4 text-green-600" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
              <RotateCcw className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {activeWorkflow?.steps?.map((step, index) => {
            const statusColor = getStatusColor(step?.status);
            return (
              <div key={step?.id} className="relative">
                <div className={`flex items-center gap-3 p-3 rounded-lg border bg-${statusColor}-50 border-${statusColor}-200`}>
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white border-2 border-${statusColor}-500">
                    <span className="text-xs font-bold text-${statusColor}-600">{step?.id}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{step?.name}</div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      {step?.status === 'completed' && `Completed in ${step?.duration}`}
                      {step?.status === 'in_progress' && 'Processing...'}
                      {step?.status === 'pending' && 'Waiting'}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium bg-${statusColor}-100 text-${statusColor}-700`}>
                    {step?.status?.toUpperCase()?.replace('_', ' ')}
                  </span>
                </div>
                {index < activeWorkflow?.steps?.length - 1 && (
                  <div className="ml-3 h-4 w-0.5 bg-gray-300" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Workflow Statistics */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-indigo-600">18</div>
            <div className="text-xs text-gray-600">Active Workflows</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">97%</div>
            <div className="text-xs text-gray-600">Success Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">1.8s</div>
            <div className="text-xs text-gray-600">Avg Duration</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowVisualizationPanel;