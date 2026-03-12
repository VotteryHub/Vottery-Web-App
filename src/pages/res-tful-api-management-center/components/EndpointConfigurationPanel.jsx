import React, { useState } from 'react';
import { Server, Check, X, Settings, Play } from 'lucide-react';

const EndpointConfigurationPanel = () => {
  const [endpoints] = useState([
    {
      id: 1,
      method: 'POST',
      path: '/api/lottery/create',
      description: 'Create new lottery election',
      status: 'active',
      requestsToday: 245,
      avgResponseTime: 120
    },
    {
      id: 2,
      method: 'POST',
      path: '/api/lottery/participate',
      description: 'Cast vote and generate lottery ticket',
      status: 'active',
      requestsToday: 1523,
      avgResponseTime: 85
    },
    {
      id: 3,
      method: 'GET',
      path: '/api/lottery/results/:electionId',
      description: 'Get lottery results and winners',
      status: 'active',
      requestsToday: 892,
      avgResponseTime: 65
    },
    {
      id: 4,
      method: 'POST',
      path: '/api/lottery/draw',
      description: 'Initiate lottery draw',
      status: 'active',
      requestsToday: 12,
      avgResponseTime: 340
    },
    {
      id: 5,
      method: 'GET',
      path: '/api/lottery/verify/:ticketId',
      description: 'Verify lottery ticket',
      status: 'active',
      requestsToday: 456,
      avgResponseTime: 45
    },
    {
      id: 6,
      method: 'GET',
      path: '/api/lottery/payouts/:userId',
      description: 'Get user prize payouts',
      status: 'active',
      requestsToday: 234,
      avgResponseTime: 78
    },
    {
      id: 7,
      method: 'GET',
      path: '/api/audit/logs',
      description: 'Retrieve audit logs',
      status: 'active',
      requestsToday: 89,
      avgResponseTime: 95
    }
  ]);

  const getMethodColor = (method) => {
    const colors = {
      GET: 'bg-green-100 text-green-800',
      POST: 'bg-blue-100 text-blue-800',
      PUT: 'bg-yellow-100 text-yellow-800',
      DELETE: 'bg-red-100 text-red-800'
    };
    return colors?.[method] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Endpoint Configuration</h2>
          <p className="text-gray-600">Manage lottery-specific API routes and parameters</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <Server className="w-5 h-5" />
          Add Endpoint
        </button>
      </div>

      <div className="space-y-4">
        {endpoints?.map((endpoint) => (
          <div key={endpoint?.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getMethodColor(endpoint?.method)}`}>
                    {endpoint?.method}
                  </span>
                  <code className="text-sm font-mono text-gray-900">{endpoint?.path}</code>
                  {endpoint?.status === 'active' ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <Check className="w-4 h-4" />
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-600 text-sm">
                      <X className="w-4 h-4" />
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-3">{endpoint?.description}</p>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-gray-500">Requests Today:</span>
                    <span className="ml-2 font-semibold text-gray-900">{endpoint?.requestsToday?.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Avg Response:</span>
                    <span className="ml-2 font-semibold text-gray-900">{endpoint?.avgResponseTime}ms</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Play className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EndpointConfigurationPanel;