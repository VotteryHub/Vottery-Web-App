import React, { useState } from 'react';
import { Code, Layers, Zap, FileCode } from 'lucide-react';

const PayloadTransformationPanel = () => {
  const [transformations] = useState([
    {
      id: 1,
      name: 'Snake to Camel Case Converter',
      type: 'template',
      input: 'user_profile',
      output: 'userProfile',
      status: 'active',
      usage: 1247
    },
    {
      id: 2,
      name: 'Currency Format Enrichment',
      type: 'custom',
      input: '{ amount: 1000 }',
      output: '{ amount: 1000, currency: "USD", formatted: "$1,000.00" }',
      status: 'active',
      usage: 892
    },
    {
      id: 3,
      name: 'Timestamp Normalization',
      type: 'template',
      input: '2024-01-28T10:15:23Z',
      output: 'ISO 8601 + Unix timestamp',
      status: 'active',
      usage: 2156
    },
    {
      id: 4,
      name: 'Nested Object Flattening',
      type: 'custom',
      input: '{ user: { profile: { name: "John" } } }',
      output: '{ user_profile_name: "John" }',
      status: 'active',
      usage: 654
    }
  ]);

  const [transformationStats] = useState({
    totalTransformations: 4949,
    avgTransformTime: 12,
    successRate: 99.8,
    customScripts: 8
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Code className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Real-Time Payload Transformation</h2>
            <p className="text-sm text-gray-600">Dynamic data mapping with custom JavaScript execution</p>
          </div>
        </div>
      </div>

      {/* Transformation Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{transformationStats?.totalTransformations?.toLocaleString()}</div>
          <div className="text-xs text-gray-600">Total Today</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{transformationStats?.avgTransformTime}ms</div>
          <div className="text-xs text-gray-600">Avg Time</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">{transformationStats?.successRate}%</div>
          <div className="text-xs text-gray-600">Success Rate</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-white rounded-lg border border-orange-200">
          <div className="text-2xl font-bold text-orange-600">{transformationStats?.customScripts}</div>
          <div className="text-xs text-gray-600">Custom Scripts</div>
        </div>
      </div>

      {/* Active Transformations */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          Active Transformations
        </h3>
        <div className="space-y-3">
          {transformations?.map((transform) => (
            <div
              key={transform?.id}
              className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">{transform?.name}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      transform?.type === 'custom' ?'bg-orange-100 text-orange-700' :'bg-blue-100 text-blue-700'
                    }`}>
                      {transform?.type?.toUpperCase()}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="text-gray-600 font-medium min-w-[60px]">Input:</span>
                      <code className="flex-1 text-gray-700 bg-gray-100 px-2 py-1 rounded">
                        {transform?.input}
                      </code>
                    </div>
                    <div className="flex items-center justify-center text-gray-400">
                      <Zap className="w-3 h-3" />
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-600 font-medium min-w-[60px]">Output:</span>
                      <code className="flex-1 text-gray-700 bg-green-50 px-2 py-1 rounded border border-green-200">
                        {transform?.output}
                      </code>
                    </div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-sm font-semibold text-gray-900">{transform?.usage?.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">executions</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transformation Preview */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <FileCode className="w-4 h-4 text-blue-600" />
          Transformation Preview
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-xs font-medium text-gray-700 mb-2">Before Transformation</div>
            <pre className="text-xs text-gray-600 overflow-x-auto">
              {JSON.stringify({
                user_id: '12345',
                created_at: '2024-01-28T10:15:23Z',
                vote_count: 42
              }, null, 2)}
            </pre>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-xs font-medium text-green-700 mb-2">After Transformation</div>
            <pre className="text-xs text-gray-600 overflow-x-auto">
              {JSON.stringify({
                userId: '12345',
                createdAt: '2024-01-28T10:15:23Z',
                createdAtUnix: 1706438123,
                voteCount: 42,
                metadata: { transformed: true }
              }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayloadTransformationPanel;