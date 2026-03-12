import React, { useState, useEffect } from 'react';
import { Brain, Activity, DollarSign, Zap, AlertCircle, CheckCircle2, TrendingUp, Settings } from 'lucide-react';

const OpenAIIntegrationManagement = () => {
  const [apiStatus, setApiStatus] = useState({
    connected: true,
    lastCheck: new Date(),
    responseTime: 245,
    errorRate: 0.02
  });
  const [usage, setUsage] = useState({
    tokensToday: 125430,
    tokensThisMonth: 3420850,
    estimatedCost: 42.15,
    requestsToday: 3420,
    avgTokensPerRequest: 36.7
  });
  const [modelConfig, setModelConfig] = useState({
    model: 'gpt-5-mini',
    reasoningEffort: 'minimal',
    verbosity: 'medium',
    maxCompletionTokens: 500
  });
  const [rateLimiting, setRateLimiting] = useState({
    enabled: true,
    requestsPerMinute: 100,
    requestsPerHour: 5000,
    failoverEnabled: true
  });
  const [testing, setTesting] = useState(false);

  const testConnection = async () => {
    setTesting(true);
    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 2000));
    setApiStatus({
      ...apiStatus,
      lastCheck: new Date(),
      responseTime: Math.floor(Math.random() * 300) + 150
    });
    setTesting(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-600" />
          OpenAI Integration Management
        </h2>
        <p className="text-gray-600 mt-1">Monitor API connection, token usage, model performance, and cost optimization</p>
      </div>
      {/* API Connection Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            API Connection Status
          </h3>
          <button
            onClick={testConnection}
            disabled={testing}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            <Zap className="w-4 h-4" />
            {testing ? 'Testing...' : 'Test Connection'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Connection Status</span>
              {apiStatus?.connected ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div className={`text-lg font-semibold ${
              apiStatus?.connected ? 'text-green-600' : 'text-red-600'
            }`}>
              {apiStatus?.connected ? 'Connected' : 'Disconnected'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Last check: {apiStatus?.lastCheck?.toLocaleTimeString()}
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-2">Response Time</div>
            <div className="text-2xl font-bold text-gray-900">{apiStatus?.responseTime}ms</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-xs text-green-600">-12% vs avg</span>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-2">Error Rate</div>
            <div className="text-2xl font-bold text-gray-900">{(apiStatus?.errorRate * 100)?.toFixed(2)}%</div>
            <div className="text-xs text-gray-500 mt-1">Last 24 hours</div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-2">Uptime</div>
            <div className="text-2xl font-bold text-gray-900">99.8%</div>
            <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
          </div>
        </div>
      </div>
      {/* Token Usage Tracking */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-purple-600" />
          Token Usage & Cost Tracking
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-2">Tokens Today</div>
            <div className="text-2xl font-bold text-gray-900">{(usage?.tokensToday / 1000)?.toFixed(1)}K</div>
            <div className="text-xs text-gray-500 mt-1">of 500K daily limit</div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-2">Tokens This Month</div>
            <div className="text-2xl font-bold text-gray-900">{(usage?.tokensThisMonth / 1000000)?.toFixed(2)}M</div>
            <div className="text-xs text-gray-500 mt-1">of 10M monthly limit</div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-2">Estimated Cost</div>
            <div className="text-2xl font-bold text-gray-900">${usage?.estimatedCost?.toFixed(2)}</div>
            <div className="text-xs text-gray-500 mt-1">This month</div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-2">Requests Today</div>
            <div className="text-2xl font-bold text-gray-900">{usage?.requestsToday?.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">Quest generations</div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-2">Avg Tokens/Request</div>
            <div className="text-2xl font-bold text-gray-900">{usage?.avgTokensPerRequest?.toFixed(1)}</div>
            <div className="text-xs text-gray-500 mt-1">Efficiency metric</div>
          </div>
        </div>

        {/* Usage Chart Placeholder */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
          <div className="text-sm font-medium text-gray-700 mb-2">Token Usage Trend (Last 7 Days)</div>
          <div className="h-32 flex items-end justify-between gap-2">
            {[65, 72, 58, 81, 75, 88, 92]?.map((height, i) => (
              <div key={i} className="flex-1 bg-purple-600 rounded-t" style={{ height: `${height}%` }}></div>
            ))}
          </div>
        </div>
      </div>
      {/* Model Performance Metrics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-600" />
          Model Configuration & Performance
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Model Selection</label>
            <select
              value={modelConfig?.model}
              onChange={(e) => setModelConfig({ ...modelConfig, model: e?.target?.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="gpt-5">GPT-5 (Best quality, higher cost)</option>
              <option value="gpt-5-mini">GPT-5 Mini (Balanced, recommended)</option>
              <option value="gpt-5-nano">GPT-5 Nano (Fast, low cost)</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Reasoning Effort</label>
            <select
              value={modelConfig?.reasoningEffort}
              onChange={(e) => setModelConfig({ ...modelConfig, reasoningEffort: e?.target?.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="minimal">Minimal (Fastest)</option>
              <option value="low">Low</option>
              <option value="medium">Medium (Recommended)</option>
              <option value="high">High (Best quality)</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Verbosity</label>
            <select
              value={modelConfig?.verbosity}
              onChange={(e) => setModelConfig({ ...modelConfig, verbosity: e?.target?.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="low">Low (Concise)</option>
              <option value="medium">Medium (Balanced)</option>
              <option value="high">High (Detailed)</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Max Completion Tokens</label>
            <input
              type="number"
              value={modelConfig?.maxCompletionTokens}
              onChange={(e) => setModelConfig({ ...modelConfig, maxCompletionTokens: parseInt(e?.target?.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-sm text-green-700 mb-1">Success Rate</div>
            <div className="text-2xl font-bold text-green-900">98.7%</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm text-blue-700 mb-1">Avg Generation Time</div>
            <div className="text-2xl font-bold text-blue-900">1.8s</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-sm text-purple-700 mb-1">Quality Score</div>
            <div className="text-2xl font-bold text-purple-900">9.2/10</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-sm text-yellow-700 mb-1">User Satisfaction</div>
            <div className="text-2xl font-bold text-yellow-900">94%</div>
          </div>
        </div>
      </div>
      {/* Cost Optimization Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Cost Optimization & Rate Limiting</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Enable Rate Limiting</div>
              <div className="text-sm text-gray-600">Prevent excessive API usage</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rateLimiting?.enabled}
                onChange={(e) => setRateLimiting({ ...rateLimiting, enabled: e?.target?.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {rateLimiting?.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Requests Per Minute</label>
                <input
                  type="number"
                  value={rateLimiting?.requestsPerMinute}
                  onChange={(e) => setRateLimiting({ ...rateLimiting, requestsPerMinute: parseInt(e?.target?.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Requests Per Hour</label>
                <input
                  type="number"
                  value={rateLimiting?.requestsPerHour}
                  onChange={(e) => setRateLimiting({ ...rateLimiting, requestsPerHour: parseInt(e?.target?.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Automated Failover</div>
              <div className="text-sm text-gray-600">Switch to backup model on errors</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rateLimiting?.failoverEnabled}
                onChange={(e) => setRateLimiting({ ...rateLimiting, failoverEnabled: e?.target?.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenAIIntegrationManagement;