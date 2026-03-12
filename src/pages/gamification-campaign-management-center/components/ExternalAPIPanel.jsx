import React, { useState } from 'react';
import { Key, Copy } from 'lucide-react';

export default function ExternalAPIPanel() {
  const [apiKeys, setApiKeys] = useState([
    {
      id: '1',
      client_name: 'Demo Client',
      api_key: 'gam_live_1234567890abcdef',
      organization_name: 'Demo Organization',
      is_active: true,
      rate_limit_per_hour: 1000,
      created_at: new Date()?.toISOString()
    }
  ]);

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">External API Access</h2>
        <p className="text-gray-600 mt-1">
          Manage API keys for third-party platform integration
        </p>
      </div>
      {/* API Documentation */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">API Documentation</h3>
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4">
            <p className="font-mono text-sm text-gray-700 mb-2">
              <span className="text-green-600 font-bold">POST</span> /api/v1/gamification/campaigns
            </p>
            <p className="text-xs text-gray-600">Create a new gamification campaign</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="font-mono text-sm text-gray-700 mb-2">
              <span className="text-blue-600 font-bold">GET</span> /api/v1/gamification/campaigns/:id
            </p>
            <p className="text-xs text-gray-600">Retrieve campaign details</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="font-mono text-sm text-gray-700 mb-2">
              <span className="text-orange-600 font-bold">PUT</span> /api/v1/gamification/allocation-rules
            </p>
            <p className="text-xs text-gray-600">Update allocation rules</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="font-mono text-sm text-gray-700 mb-2">
              <span className="text-purple-600 font-bold">POST</span> /api/v1/gamification/trigger-drawing
            </p>
            <p className="text-xs text-gray-600">Trigger winner selection process</p>
          </div>
        </div>
      </div>
      {/* API Keys List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">API Keys</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all">
            <Key className="w-4 h-4" />
            Generate New Key
          </button>
        </div>

        {apiKeys?.map((key) => (
          <div key={key?.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-bold text-gray-900">{key?.client_name}</h4>
                <p className="text-sm text-gray-600">{key?.organization_name}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                key?.is_active
                  ? 'bg-green-100 text-green-700' :'bg-red-100 text-red-700'
              }`}>
                {key?.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">API Key</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-gray-50 rounded-lg font-mono text-sm text-gray-900">
                    {key?.api_key}
                  </code>
                  <button
                    onClick={() => copyToClipboard(key?.api_key)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Rate Limit</label>
                  <p className="text-sm font-semibold text-gray-900">
                    {key?.rate_limit_per_hour?.toLocaleString()} requests/hour
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Created</label>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(key.created_at)?.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Integration Examples */}
      <div className="mt-6 bg-gray-900 rounded-xl p-6 text-white">
        <h3 className="text-lg font-bold mb-4">Integration Example</h3>
        <pre className="text-sm overflow-x-auto">
          <code>{`// JavaScript Example
const response = await fetch('https://api.vottery.com/v1/gamification/campaigns', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    campaign_name: 'My Campaign',
    prize_pool_amount: 10000,
    frequency: 'monthly'
  })
});

const data = await response.json();`}</code>
        </pre>
      </div>
    </div>
  );
}