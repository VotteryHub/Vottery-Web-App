import React, { useState } from 'react';
import { Settings, Save } from 'lucide-react';

const SecurityEventConfigPanel = ({ trackEvent }) => {
  const [config, setConfig] = useState({
    authAnomalyThreshold: 5,
    paymentFraudThreshold: 70,
    voteManipulationThreshold: 80,
    policyViolationAutoModerate: true,
    realTimeAlerts: true,
    emailNotifications: true,
    slackIntegration: false
  });

  const handleSave = () => {
    trackEvent?.('security_config_update', {
      auth_threshold: config?.authAnomalyThreshold,
      payment_threshold: config?.paymentFraudThreshold,
      vote_threshold: config?.voteManipulationThreshold,
      auto_moderate: config?.policyViolationAutoModerate
    });
    alert('Security event configuration saved!');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Custom Security Event Configuration</h2>
      </div>
      <div className="space-y-6">
        {/* Threshold Settings */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Alert Thresholds</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Authentication Anomaly Threshold (attempts)
              </label>
              <input
                type="number"
                value={config?.authAnomalyThreshold}
                onChange={(e) => setConfig({ ...config, authAnomalyThreshold: parseInt(e?.target?.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Payment Fraud Risk Score Threshold (%)
              </label>
              <input
                type="number"
                value={config?.paymentFraudThreshold}
                onChange={(e) => setConfig({ ...config, paymentFraudThreshold: parseInt(e?.target?.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Vote Manipulation Confidence Threshold (%)
              </label>
              <input
                type="number"
                value={config?.voteManipulationThreshold}
                onChange={(e) => setConfig({ ...config, voteManipulationThreshold: parseInt(e?.target?.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Automation Settings */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Automation Settings</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={config?.policyViolationAutoModerate}
                onChange={(e) => setConfig({ ...config, policyViolationAutoModerate: e?.target?.checked })}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Auto-moderate policy violations</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={config?.realTimeAlerts}
                onChange={(e) => setConfig({ ...config, realTimeAlerts: e?.target?.checked })}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Enable real-time alerts</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={config?.emailNotifications}
                onChange={(e) => setConfig({ ...config, emailNotifications: e?.target?.checked })}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Email notifications</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={config?.slackIntegration}
                onChange={(e) => setConfig({ ...config, slackIntegration: e?.target?.checked })}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Slack integration</span>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Save className="w-5 h-5" />
          Save Configuration
        </button>
      </div>
    </div>
  );
};

export default SecurityEventConfigPanel;