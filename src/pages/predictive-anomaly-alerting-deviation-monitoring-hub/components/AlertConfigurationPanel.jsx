import React, { useState } from 'react';
import { Bell, Settings, Users, Mail } from 'lucide-react';

const AlertConfigurationPanel = () => {
  const [alertConfig, setAlertConfig] = useState({
    deviationThreshold: 15,
    criticalThreshold: 20,
    autoEscalation: true,
    emailNotifications: true,
    slackIntegration: true,
    smsAlerts: false
  });

  const [recentAlerts, setRecentAlerts] = useState([
    {
      id: 1,
      metric: 'Revenue Forecast',
      deviation: 17.5,
      severity: 'high',
      status: 'escalated',
      timestamp: new Date()?.toISOString()
    },
    {
      id: 2,
      metric: 'Fraud Detection Rate',
      deviation: 25.0,
      severity: 'critical',
      status: 'active',
      timestamp: new Date()?.toISOString()
    },
    {
      id: 3,
      metric: 'Campaign CTR',
      deviation: 17.1,
      severity: 'high',
      status: 'acknowledged',
      timestamp: new Date()?.toISOString()
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Bell className="w-6 h-6 mr-2 text-blue-600" />
          Real-time Alert System
        </h2>
        <p className="text-gray-600 mb-6">Immediate notifications when actual metrics exceed 15% deviation from AI predictions with automated escalation protocols</p>

        <div className="space-y-4">
          {recentAlerts?.map((alert) => (
            <div key={alert?.id} className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                      alert?.severity === 'critical' ? 'bg-red-600 text-white' :
                      alert?.severity === 'high'? 'bg-orange-600 text-white' : 'bg-yellow-600 text-white'
                    }`}>
                      {alert?.severity}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                      alert?.status === 'active' ? 'bg-red-100 text-red-800' :
                      alert?.status === 'escalated'? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {alert?.status}
                    </span>
                  </div>
                  <p className="text-gray-900 font-semibold mb-1">{alert?.metric} Deviation Alert</p>
                  <p className="text-sm text-gray-600">Deviation: {alert?.deviation}% (Threshold: {alertConfig?.deviationThreshold}%)</p>
                </div>
                <p className="text-xs text-gray-500 whitespace-nowrap ml-4">
                  {new Date(alert.timestamp)?.toLocaleTimeString()}
                </p>
              </div>
              <div className="flex space-x-2 pt-3 border-t border-gray-200">
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700">
                  Investigate
                </button>
                <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm font-semibold hover:bg-gray-700">
                  Acknowledge
                </button>
                <button className="px-3 py-1 bg-red-600 text-white rounded text-sm font-semibold hover:bg-red-700">
                  Escalate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-gray-600" />
          Alert Configuration
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deviation Threshold: {alertConfig?.deviationThreshold}%
            </label>
            <input
              type="range"
              min="5"
              max="30"
              value={alertConfig?.deviationThreshold}
              onChange={(e) => setAlertConfig({ ...alertConfig, deviationThreshold: parseInt(e?.target?.value) })}
              className="w-full"
            />
            <p className="text-xs text-gray-600 mt-1">Trigger alerts when deviation exceeds this threshold</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Critical Threshold: {alertConfig?.criticalThreshold}%
            </label>
            <input
              type="range"
              min="15"
              max="50"
              value={alertConfig?.criticalThreshold}
              onChange={(e) => setAlertConfig({ ...alertConfig, criticalThreshold: parseInt(e?.target?.value) })}
              className="w-full"
            />
            <p className="text-xs text-gray-600 mt-1">Auto-escalate when deviation exceeds this threshold</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Stakeholder Notification Workflows
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={alertConfig?.autoEscalation}
                  onChange={(e) => setAlertConfig({ ...alertConfig, autoEscalation: e?.target?.checked })}
                  className="w-4 h-4"
                />
                <span className="text-gray-900">Automated escalation</span>
              </div>
              <span className={alertConfig?.autoEscalation ? 'text-green-600 font-semibold' : 'text-gray-600'}>
                {alertConfig?.autoEscalation ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={alertConfig?.emailNotifications}
                  onChange={(e) => setAlertConfig({ ...alertConfig, emailNotifications: e?.target?.checked })}
                  className="w-4 h-4"
                />
                <span className="text-gray-900">Email notifications</span>
              </div>
              <span className={alertConfig?.emailNotifications ? 'text-green-600 font-semibold' : 'text-gray-600'}>
                {alertConfig?.emailNotifications ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={alertConfig?.slackIntegration}
                  onChange={(e) => setAlertConfig({ ...alertConfig, slackIntegration: e?.target?.checked })}
                  className="w-4 h-4"
                />
                <span className="text-gray-900">Slack integration</span>
              </div>
              <span className={alertConfig?.slackIntegration ? 'text-green-600 font-semibold' : 'text-gray-600'}>
                {alertConfig?.slackIntegration ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={alertConfig?.smsAlerts}
                  onChange={(e) => setAlertConfig({ ...alertConfig, smsAlerts: e?.target?.checked })}
                  className="w-4 h-4"
                />
                <span className="text-gray-900">SMS alerts</span>
              </div>
              <span className={alertConfig?.smsAlerts ? 'text-green-600 font-semibold' : 'text-gray-600'}>
                {alertConfig?.smsAlerts ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Mail className="w-5 h-5 mr-2 text-green-600" />
            Severity-Based Routing
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-600">
              <p className="font-semibold text-gray-900 mb-1">Critical (&gt;20%)</p>
              <p className="text-sm text-gray-700">→ Immediate escalation to executives + SMS alerts</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-600">
              <p className="font-semibold text-gray-900 mb-1">High (15-20%)</p>
              <p className="text-sm text-gray-700">→ Email + Slack notification to team leads</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-600">
              <p className="font-semibold text-gray-900 mb-1">Medium (10-15%)</p>
              <p className="text-sm text-gray-700">→ Slack notification to monitoring team</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertConfigurationPanel;