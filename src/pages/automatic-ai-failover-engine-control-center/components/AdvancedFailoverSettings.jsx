import React, { useState } from 'react';
import { Settings, Sliders, AlertTriangle, RefreshCw, Play } from 'lucide-react';

const AdvancedFailoverSettings = () => {
  const [settings, setSettings] = useState({
    responseTimeThreshold: 500,
    errorRateThreshold: 5,
    rateLimitThreshold: 95,
    detectionWindow: 2,
    autoRecovery: true,
    manualOverride: false
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Advanced Failover Settings</h2>
        <p className="text-slate-600">Configure custom thresholds, manual override controls, and predictive failure detection</p>
      </div>
      {/* Threshold Configuration */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-blue-600" />
          Custom Failover Thresholds
        </h3>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">Response Time Threshold</label>
              <span className="text-sm font-semibold text-slate-900">{settings?.responseTimeThreshold}ms</span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={settings?.responseTimeThreshold}
              onChange={(e) => handleSettingChange('responseTimeThreshold', parseInt(e?.target?.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>100ms</span>
              <span>2000ms</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">Error Rate Threshold</label>
              <span className="text-sm font-semibold text-slate-900">{settings?.errorRateThreshold}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={settings?.errorRateThreshold}
              onChange={(e) => handleSettingChange('errorRateThreshold', parseInt(e?.target?.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>1%</span>
              <span>20%</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">Rate Limit Threshold</label>
              <span className="text-sm font-semibold text-slate-900">{settings?.rateLimitThreshold}%</span>
            </div>
            <input
              type="range"
              min="70"
              max="100"
              step="5"
              value={settings?.rateLimitThreshold}
              onChange={(e) => handleSettingChange('rateLimitThreshold', parseInt(e?.target?.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>70%</span>
              <span>100%</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">Detection Window</label>
              <span className="text-sm font-semibold text-slate-900">{settings?.detectionWindow}s</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={settings?.detectionWindow}
              onChange={(e) => handleSettingChange('detectionWindow', parseInt(e?.target?.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>1s</span>
              <span>10s</span>
            </div>
          </div>
        </div>
      </div>
      {/* Control Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-green-600" />
            Automatic Recovery
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-900">Enable Auto-Recovery</div>
                <div className="text-sm text-slate-600">Automatically restore primary service when healthy</div>
              </div>
              <button
                onClick={() => handleSettingChange('autoRecovery', !settings?.autoRecovery)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings?.autoRecovery ? 'bg-green-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings?.autoRecovery ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            {settings?.autoRecovery && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm text-green-800">
                  Primary services will be automatically restored when health checks pass for 5 consecutive minutes.
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            Manual Override
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-900">Enable Manual Control</div>
                <div className="text-sm text-slate-600">Manually control service routing and failover</div>
              </div>
              <button
                onClick={() => handleSettingChange('manualOverride', !settings?.manualOverride)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings?.manualOverride ? 'bg-yellow-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings?.manualOverride ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            {settings?.manualOverride && (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-sm text-yellow-800 mb-3">
                  Manual override is enabled. Automatic failover will require approval.
                </div>
                <button className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" />
                  Force Failover to Gemini
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Predictive Failure Detection */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-600" />
          Predictive Failure Detection
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <div className="font-medium text-slate-900 mb-2">Machine Learning Algorithms</div>
            <div className="text-sm text-slate-600">Analyzes historical patterns to predict potential service disruptions before they occur</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <div className="font-medium text-slate-900 mb-2">Proactive Failover</div>
            <div className="text-sm text-slate-600">Initiates failover before complete service failure based on degradation trends</div>
          </div>
        </div>
      </div>
      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Save Configuration
        </button>
      </div>
    </div>
  );
};

export default AdvancedFailoverSettings;