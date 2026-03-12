import React, { useState } from 'react';
import { Key, Lock, Users, RefreshCw } from 'lucide-react';

const AuthenticationControlsPanel = () => {
  const [apiKeys] = useState([
    { id: 1, name: 'Production API Key', key: 'pk_live_***************', created: '2026-01-15', lastUsed: '2 hours ago', requests: 15234 },
    { id: 2, name: 'Development API Key', key: 'pk_test_***************', created: '2026-01-10', lastUsed: '5 minutes ago', requests: 892 },
    { id: 3, name: 'Mobile App Key', key: 'pk_mobile_***************', created: '2026-01-20', lastUsed: '1 hour ago', requests: 5621 }
  ]);

  const [rateLimits] = useState([
    { endpoint: '/api/lottery/participate', limit: '100 requests/minute', current: 45 },
    { endpoint: '/api/lottery/create', limit: '10 requests/minute', current: 3 },
    { endpoint: '/api/lottery/results', limit: '200 requests/minute', current: 156 },
    { endpoint: '/api/audit/logs', limit: '50 requests/minute', current: 12 }
  ]);

  return (
    <div className="space-y-6">
      {/* API Key Management */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">API Key Management</h2>
            <p className="text-gray-600">Generate and manage authentication keys</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Key className="w-5 h-5" />
            Generate New Key
          </button>
        </div>

        <div className="space-y-4">
          {apiKeys?.map((apiKey) => (
            <div key={apiKey?.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{apiKey?.name}</h3>
                  <code className="text-sm text-gray-600 font-mono">{apiKey?.key}</code>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <RefreshCw className="w-5 h-5" />
                  </button>
                  <button className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm">
                    Revoke
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span>Created: {apiKey?.created}</span>
                <span>Last Used: {apiKey?.lastUsed}</span>
                <span>Requests: {apiKey?.requests?.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Rate Limiting */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-6 h-6 text-blue-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Rate Limiting Configuration</h2>
            <p className="text-gray-600">Control API request throttling</p>
          </div>
        </div>

        <div className="space-y-4">
          {rateLimits?.map((limit, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <code className="text-sm font-mono text-gray-900">{limit?.endpoint}</code>
                <span className="text-sm font-semibold text-gray-700">{limit?.limit}</span>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${(limit?.current / parseInt(limit?.limit)) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {limit?.current} / {limit?.limit?.split(' ')?.[0]} requests
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Access Permissions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-blue-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Access Permission Matrix</h2>
            <p className="text-gray-600">Configure client type permissions</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Client Type</th>
                <th className="text-center py-3 px-4 text-gray-700 font-semibold">Create Lottery</th>
                <th className="text-center py-3 px-4 text-gray-700 font-semibold">Participate</th>
                <th className="text-center py-3 px-4 text-gray-700 font-semibold">View Results</th>
                <th className="text-center py-3 px-4 text-gray-700 font-semibold">Audit Logs</th>
              </tr>
            </thead>
            <tbody>
              {['Admin', 'Creator', 'Voter', 'Auditor']?.map((clientType) => (
                <tr key={clientType} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{clientType}</td>
                  <td className="text-center py-3 px-4">
                    <input type="checkbox" className="w-5 h-5" defaultChecked={clientType === 'Admin' || clientType === 'Creator'} />
                  </td>
                  <td className="text-center py-3 px-4">
                    <input type="checkbox" className="w-5 h-5" defaultChecked={true} />
                  </td>
                  <td className="text-center py-3 px-4">
                    <input type="checkbox" className="w-5 h-5" defaultChecked={true} />
                  </td>
                  <td className="text-center py-3 px-4">
                    <input type="checkbox" className="w-5 h-5" defaultChecked={clientType === 'Admin' || clientType === 'Auditor'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationControlsPanel;