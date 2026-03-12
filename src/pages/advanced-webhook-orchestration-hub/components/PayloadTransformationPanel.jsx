import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PayloadTransformationPanel = ({ webhooks }) => {
  const [transformations, setTransformations] = useState([
    {
      id: 1,
      name: 'Vote Event Enrichment',
      inputFormat: 'JSON',
      outputFormat: 'JSON',
      template: '{ "event": "{{eventType}}", "user": "{{userId}}", "timestamp": "{{timestamp}}" }',
      active: true,
    },
    {
      id: 2,
      name: 'Payment Data Mapping',
      inputFormat: 'JSON',
      outputFormat: 'XML',
      template: '<payment><amount>{{amount}}</amount><currency>{{currency}}</currency></payment>',
      active: true,
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Real-Time Data Mapping */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Icon name="Code" size={24} className="text-primary" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Real-Time Data Mapping
            </h3>
          </div>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm font-medium">
            <Icon name="Plus" size={16} />
            New Transformation
          </button>
        </div>

        <div className="space-y-4">
          {transformations?.map((transform) => (
            <div key={transform?.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{transform?.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      transform?.active
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                    }`}>
                      {transform?.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Input:</span>
                      <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded">
                        {transform?.inputFormat}
                      </span>
                    </div>
                    <Icon name="ArrowRight" size={16} className="text-gray-400" />
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Output:</span>
                      <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded">
                        {transform?.outputFormat}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Template:</span>
                    <div className="mt-1 bg-gray-100 dark:bg-gray-800 rounded px-3 py-2 font-mono text-xs text-gray-800 dark:text-gray-200 overflow-x-auto">
                      {transform?.template}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                    <Icon name="Edit" size={16} />
                  </button>
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors">
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Format Conversion */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="RefreshCw" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Format Conversion
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { from: 'JSON', to: 'XML', icon: 'FileCode' },
            { from: 'XML', to: 'JSON', icon: 'FileJson' },
            { from: 'CSV', to: 'JSON', icon: 'FileSpreadsheet' },
          ]?.map((conversion, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-3">
                <Icon name={conversion?.icon} size={24} className="text-primary" />
                <Icon name="ArrowRight" size={16} className="text-gray-400" />
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {conversion?.from} → {conversion?.to}
              </div>
              <button className="mt-3 w-full px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-xs font-medium">
                Configure
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Content Enrichment */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Sparkles" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Content Enrichment
          </h3>
        </div>

        <div className="space-y-3">
          {[
            { label: 'Add Timestamp', description: 'Automatically inject current timestamp', enabled: true },
            { label: 'User Context', description: 'Enrich with user profile data', enabled: true },
            { label: 'Geolocation', description: 'Add location data from IP address', enabled: false },
            { label: 'Custom Headers', description: 'Inject custom HTTP headers', enabled: true },
          ]?.map((enrichment, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{enrichment?.label}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{enrichment?.description}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={enrichment?.enabled} className="sr-only peer" readOnly />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Template-Based Transformations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="FileText" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Template-Based Transformations
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Input Payload</label>
            <textarea
              className="w-full h-40 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-xs text-gray-900 dark:text-gray-100 resize-none"
              placeholder='{\n  "userId": "123",\n  "eventType": "vote.cast",\n  "timestamp": "2026-01-28T00:00:00Z"\n}'
              readOnly
            />
          </div>

          {/* Output Preview */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Output Preview</label>
            <div className="w-full h-40 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-xs text-gray-900 dark:text-gray-100 overflow-auto">
              {'{\n  "event": "vote.cast",\n  "user": "123",\n  "timestamp": "2026-01-28T00:00:00Z",\n  "enriched_at": "2026-01-28T00:59:26Z"\n}'}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-3">
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium">
            Test Transformation
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
            Save Template
          </button>
        </div>
      </div>

      {/* Custom JavaScript Execution */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Terminal" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Custom JavaScript Execution Environment
          </h3>
        </div>

        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
          <div className="text-green-400 mb-2">// Custom transformation function</div>
          <div className="text-gray-300">function transform(payload) {'{'}</div>
          <div className="text-gray-300 ml-4">return {'{'}</div>
          <div className="text-gray-300 ml-8">...payload,</div>
          <div className="text-gray-300 ml-8">processedAt: new Date().toISOString(),</div>
          <div className="text-gray-300 ml-8">customField: payload.userId + '_processed'</div>
          <div className="text-gray-300 ml-4">{'}'};</div>
          <div className="text-gray-300">{'}'}</div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-yellow-600 dark:text-yellow-400">
          <Icon name="AlertTriangle" size={14} />
          <span>Custom JavaScript execution is sandboxed for security</span>
        </div>
      </div>
    </div>
  );
};

export default PayloadTransformationPanel;