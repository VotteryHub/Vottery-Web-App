import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const WebhookTestingPanel = ({ webhooks }) => {
  const [testPayload, setTestPayload] = useState('{\n  "eventType": "vote.cast",\n  "userId": "123",\n  "electionId": "456",\n  "timestamp": "2026-01-28T00:00:00Z"\n}');
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const handleTest = () => {
    setTesting(true);
    setTimeout(() => {
      setTestResult({
        success: true,
        statusCode: 200,
        responseTime: 142,
        response: '{ "status": "success", "message": "Webhook received" }',
      });
      setTesting(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Webhook Testing Environment */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="TestTube" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Webhook Testing Environment
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Configuration */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Select Webhook</label>
            <select className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 mb-4">
              <option>Select a webhook to test...</option>
              {webhooks?.map((webhook) => (
                <option key={webhook?.id} value={webhook?.id}>
                  {webhook?.name || webhook?.eventType}
                </option>
              ))}
            </select>

            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Test Payload</label>
            <textarea
              value={testPayload}
              onChange={(e) => setTestPayload(e?.target?.value)}
              className="w-full h-64 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-xs text-gray-900 dark:text-gray-100 resize-none"
            />

            <button
              onClick={handleTest}
              disabled={testing}
              className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              {testing ? (
                <>
                  <Icon name="Loader" size={16} className="animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Icon name="Play" size={16} />
                  Send Test Webhook
                </>
              )}
            </button>
          </div>

          {/* Test Results */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Test Results</label>
            {testResult ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${
                  testResult?.success
                    ? 'bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800' :'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon
                      name={testResult?.success ? 'CheckCircle2' : 'XCircle'}
                      size={20}
                      className={testResult?.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}
                    />
                    <span className={`text-sm font-semibold ${
                      testResult?.success ? 'text-green-900 dark:text-green-300' : 'text-red-900 dark:text-red-300'
                    }`}>
                      {testResult?.success ? 'Test Successful' : 'Test Failed'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Status Code:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">{testResult?.statusCode}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Response Time:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">{testResult?.responseTime}ms</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Response Body</label>
                  <div className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 font-mono text-xs text-gray-900 dark:text-gray-100 max-h-48 overflow-auto">
                    {testResult?.response}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                <div className="text-center">
                  <Icon name="TestTube" size={48} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Send a test webhook to see results</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transformation Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Eye" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Transformation Preview
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Original Payload</label>
            <div className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 font-mono text-xs text-gray-900 dark:text-gray-100 h-40 overflow-auto">
              {testPayload}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Transformed Payload</label>
            <div className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 font-mono text-xs text-gray-900 dark:text-gray-100 h-40 overflow-auto">
              {'{\n  "event": "vote.cast",\n  "user": "123",\n  "election": "456",\n  "timestamp": "2026-01-28T00:00:00Z",\n  "enriched_at": "2026-01-28T00:59:26Z"\n}'}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Optimization */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Zap" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Performance Optimization
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Clock" size={20} className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Avg Response Time</span>
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">142ms</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">-15% from last week</div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="CheckCircle2" size={20} className="text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Success Rate</span>
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">99.2%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">+0.5% from last week</div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Activity" size={20} className="text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Throughput</span>
            </div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">1.2K/min</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">+8% from last week</div>
          </div>
        </div>
      </div>

      {/* Integration Health Monitoring */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Heart" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Integration Health Monitoring
          </h3>
        </div>

        <div className="space-y-3">
          {[
            { service: 'Supabase Database', status: 'healthy', uptime: 99.9, latency: 45 },
            { service: 'Transformation Service', status: 'healthy', uptime: 99.5, latency: 12 },
            { service: 'External API', status: 'degraded', uptime: 97.2, latency: 320 },
            { service: 'Notification Service', status: 'healthy', uptime: 99.8, latency: 180 },
          ]?.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  service?.status === 'healthy' ?'bg-green-500'
                    : service?.status === 'degraded' ?'bg-yellow-500' :'bg-red-500'
                }`} />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{service?.service}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                <span>Uptime: {service?.uptime}%</span>
                <span>Latency: {service?.latency}ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebhookTestingPanel;