import React, { useState } from 'react';
import { Download, Code, Key, Book, ExternalLink } from 'lucide-react';

const AuditAPIPanel = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState('bulletin');
  const [apiKey, setApiKey] = useState('');
  const [responseData, setResponseData] = useState(null);

  const apiEndpoints = [
    {
      id: 'bulletin',
      method: 'GET',
      path: '/api/v1/bulletin-board',
      description: 'Retrieve all public bulletin board transactions',
      params: ['election_id (optional)', 'limit (optional)', 'offset (optional)'],
      response: {
        transactions: [
          {
            id: 'tx-001',
            type: 'vote_cast',
            electionId: 'election-001',
            timestamp: '2026-01-23T20:00:00Z',
            hash: '0x...',
            proofAvailable: true
          }
        ],
        total: 15847,
        page: 1
      }
    },
    {
      id: 'verify',
      method: 'POST',
      path: '/api/v1/verify-proof',
      description: 'Verify cryptographic proof for a specific transaction',
      params: ['hash (required)', 'proof_type (required)'],
      response: {
        valid: true,
        timestamp: '2026-01-23T20:00:00Z',
        details: {
          hashChainValid: true,
          signatureValid: true,
          merkleProofValid: true
        }
      }
    },
    {
      id: 'audit-trail',
      method: 'GET',
      path: '/api/v1/audit-trail',
      description: 'Access chronological audit trail with hash chain',
      params: ['election_id (required)', 'start_date (optional)', 'end_date (optional)'],
      response: {
        logs: [
          {
            id: 'log-001',
            action: 'vote_cast',
            timestamp: '2026-01-23T20:00:00Z',
            hash: '0x...',
            previousHash: '0x...'
          }
        ],
        hashChainValid: true
      }
    },
    {
      id: 'compliance',
      method: 'GET',
      path: '/api/v1/compliance-status',
      description: 'Get VVSG 2.0 compliance status and test results',
      params: [],
      response: {
        overallScore: 99.7,
        certificationStatus: 'Certified',
        categories: [
          { name: 'Software Independence', score: 100, status: 'pass' }
        ]
      }
    }
  ];

  const generateAPIKey = () => {
    const key = 'vvsg_' + Array(32)?.fill(0)?.map(() => 
      Math.floor(Math.random() * 16)?.toString(16)
    )?.join('');
    setApiKey(key);
  };

  const testEndpoint = () => {
    const endpoint = apiEndpoints?.find(e => e?.id === selectedEndpoint);
    if (endpoint) {
      setResponseData(endpoint?.response);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    alert('Copied to clipboard!');
  };

  const selectedEndpointData = apiEndpoints?.find(e => e?.id === selectedEndpoint);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Public API Access</h2>
          <p className="text-gray-600">Third-party verification tools, downloadable proofs, and real-time transparency metrics</p>
        </div>
        <Download className="w-12 h-12 text-teal-600" />
      </div>

      {/* API Key Generation */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">API Authentication</h3>
            <p className="text-sm text-gray-600">Generate an API key for programmatic access</p>
          </div>
          <Key className="w-8 h-8 text-teal-600" />
        </div>

        {apiKey ? (
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <code className="text-sm font-mono text-gray-900">{apiKey}</code>
              <button
                onClick={() => copyToClipboard(apiKey)}
                className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={generateAPIKey}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Key className="w-5 h-5" />
            <span>Generate API Key</span>
          </button>
        )}
      </div>

      {/* Endpoint Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Endpoints</h3>
        <div className="grid grid-cols-2 gap-3">
          {apiEndpoints?.map((endpoint) => (
            <button
              key={endpoint?.id}
              onClick={() => {
                setSelectedEndpoint(endpoint?.id);
                setResponseData(null);
              }}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedEndpoint === endpoint?.id
                  ? 'border-teal-600 bg-teal-50' :'border-gray-200 bg-white hover:border-teal-300'
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  endpoint?.method === 'GET' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {endpoint?.method}
                </span>
                <code className="text-sm font-mono text-gray-900">{endpoint?.path}</code>
              </div>
              <p className="text-sm text-gray-600">{endpoint?.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Endpoint Details */}
      {selectedEndpointData && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Endpoint Details</h3>
            <button
              onClick={testEndpoint}
              className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Code className="w-5 h-5" />
              <span>Test Endpoint</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Request</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    selectedEndpointData?.method === 'GET' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedEndpointData?.method}
                  </span>
                  <code className="text-sm font-mono text-gray-900">{selectedEndpointData?.path}</code>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Parameters:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {selectedEndpointData?.params?.map((param, index) => (
                      <li key={index}>{param}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {responseData && (
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Response</h4>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                  {JSON.stringify(responseData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* API Documentation */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Book className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-blue-900">Full Documentation</h4>
          </div>
          <p className="text-sm text-blue-800 mb-3">
            Complete API reference with examples, authentication guides, and integration tutorials.
          </p>
          <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <ExternalLink className="w-4 h-4" />
            <span>View Docs</span>
          </button>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Code className="w-5 h-5 text-purple-600" />
            <h4 className="font-semibold text-purple-900">SDK Libraries</h4>
          </div>
          <p className="text-sm text-purple-800 mb-3">
            Official SDKs for JavaScript, Python, and Go to simplify integration with your applications.
          </p>
          <button className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Download SDKs</span>
          </button>
        </div>
      </div>

      {/* Rate Limits Notice */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 mb-1">API Rate Limits</h4>
        <p className="text-sm text-yellow-800">
          Public API access is rate-limited to 1000 requests per hour per API key. For higher limits or enterprise access, please contact our support team.
        </p>
      </div>
    </div>
  );
};

export default AuditAPIPanel;