import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, Code } from 'lucide-react';
import { webhookService } from '../../../services/webhookService';

const WebhookTestingPanel = ({ webhooks }) => {
  const [selectedWebhook, setSelectedWebhook] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const handleTestWebhook = async () => {
    if (!selectedWebhook) return;

    setTesting(true);
    setTestResult(null);

    try {
      const result = await webhookService?.testWebhook(selectedWebhook);
      setTestResult(result);
    } catch (error) {
      setTestResult({ success: false, error: { message: error?.message } });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Play className="w-6 h-6 text-purple-500" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Webhook Testing</h2>
          <p className="text-gray-600">Test webhook endpoints and payload simulation</p>
        </div>
      </div>

      {/* Webhook Selector */}
      {webhooks?.length > 0 ? (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Webhook to Test</label>
          <select
            value={selectedWebhook || ''}
            onChange={(e) => setSelectedWebhook(e?.target?.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Choose a webhook...</option>
            {webhooks?.map((webhook) => (
              <option key={webhook?.id} value={webhook?.id}>
                {webhook?.name} - {webhook?.url}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="text-center py-12 border border-gray-200 rounded-lg mb-6">
          <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No webhooks available for testing</p>
          <p className="text-sm text-gray-500 mt-2">Create a webhook first to test it</p>
        </div>
      )}

      {/* Test Button */}
      {selectedWebhook && (
        <button
          onClick={handleTestWebhook}
          disabled={testing}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-5 h-5" />
          {testing ? 'Testing Webhook...' : 'Send Test Webhook'}
        </button>
      )}

      {/* Test Result */}
      {testResult && (
        <div className={`mt-6 border-2 rounded-lg p-6 ${
          testResult?.success
            ? 'border-green-500 bg-green-50' :'border-red-500 bg-red-50'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            {testResult?.success ? (
              <CheckCircle className="w-8 h-8 text-green-500" />
            ) : (
              <XCircle className="w-8 h-8 text-red-500" />
            )}
            <div>
              <h3 className={`text-lg font-bold ${
                testResult?.success ? 'text-green-900' : 'text-red-900'
              }`}>
                {testResult?.success ? 'Test Successful!' : 'Test Failed'}
              </h3>
              <p className={`text-sm ${
                testResult?.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {testResult?.success 
                  ? 'Webhook endpoint is responding correctly' : testResult?.error?.message ||'Failed to deliver test webhook'
                }
              </p>
            </div>
          </div>

          {testResult?.deliveryId && (
            <div className="mt-4 p-3 bg-white rounded border border-gray-200">
              <p className="text-sm text-gray-600">Delivery ID:</p>
              <code className="text-sm text-gray-900">{testResult?.deliveryId}</code>
            </div>
          )}
        </div>
      )}

      {/* Test Payload Example */}
      <div className="mt-6 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Test Payload Example</h3>
        <div className="bg-gray-50 rounded p-4">
          <pre className="text-sm text-gray-800 overflow-x-auto">
            {JSON.stringify({
              test: true,
              message: 'This is a test webhook delivery',
              timestamp: new Date()?.toISOString()
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default WebhookTestingPanel;