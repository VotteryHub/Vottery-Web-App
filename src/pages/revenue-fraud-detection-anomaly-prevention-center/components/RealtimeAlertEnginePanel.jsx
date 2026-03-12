import React, { useState } from 'react';
import { AlertTriangle, Bell, Lock } from 'lucide-react';

const RealtimeAlertEnginePanel = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'revenue_anomaly',
      severity: 'critical',
      message: 'Revenue anomaly detected: 85% deviation from expected payout',
      creatorId: 'CR-10234',
      action: 'account_frozen',
      timestamp: new Date()?.toISOString()
    },
    {
      id: 2,
      type: 'override_abuse',
      severity: 'high',
      message: 'Excessive override usage: 15 modifications in 24 hours',
      creatorId: 'CR-10456',
      action: 'escalated',
      timestamp: new Date()?.toISOString()
    },
    {
      id: 3,
      type: 'campaign_manipulation',
      severity: 'medium',
      message: 'Coordinated campaign split manipulation detected',
      creatorId: 'Multiple',
      action: 'monitoring',
      timestamp: new Date()?.toISOString()
    }
  ]);

  const [thresholds, setThresholds] = useState({
    payoutDeviation: 50,
    overrideCount: 10,
    correlationScore: 75,
    autoFreezeThreshold: 85
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'medium': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  const getActionBadge = (action) => {
    const colors = {
      account_frozen: 'bg-red-100 text-red-800',
      escalated: 'bg-orange-100 text-orange-800',
      monitoring: 'bg-yellow-100 text-yellow-800'
    };
    return colors?.[action] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Bell className="w-6 h-6 mr-2 text-blue-600" />
          Real-time Alert Engine
        </h2>
        <p className="text-gray-600 mb-6">Threshold-based notifications, automated account freezing, and escalation workflows with stakeholder coordination</p>

        <div className="space-y-3">
          {alerts?.map((alert) => (
            <div key={alert?.id} className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3 flex-1">
                  <AlertTriangle className={`w-6 h-6 ${alert?.severity === 'critical' ? 'text-red-600' : alert?.severity === 'high' ? 'text-orange-600' : 'text-yellow-600'}`} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 ${getSeverityColor(alert?.severity)} text-white rounded text-xs font-semibold uppercase`}>
                        {alert?.severity}
                      </span>
                      <span className={`px-2 py-1 ${getActionBadge(alert?.action)} rounded text-xs font-semibold uppercase`}>
                        {alert?.action?.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-900 font-semibold mb-1">{alert?.message}</p>
                    <p className="text-sm text-gray-600">Creator: {alert?.creatorId}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 whitespace-nowrap ml-4">{new Date(alert.timestamp)?.toLocaleTimeString()}</p>
              </div>
              <div className="flex space-x-2 pt-3 border-t border-gray-200">
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700">
                  View Details
                </button>
                <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm font-semibold hover:bg-gray-700">
                  Acknowledge
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
            Alert Thresholds Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payout Deviation Threshold: {thresholds?.payoutDeviation}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={thresholds?.payoutDeviation}
                onChange={(e) => setThresholds({ ...thresholds, payoutDeviation: parseInt(e?.target?.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Override Count Threshold: {thresholds?.overrideCount}
              </label>
              <input
                type="range"
                min="0"
                max="20"
                value={thresholds?.overrideCount}
                onChange={(e) => setThresholds({ ...thresholds, overrideCount: parseInt(e?.target?.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correlation Score Threshold: {thresholds?.correlationScore}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={thresholds?.correlationScore}
                onChange={(e) => setThresholds({ ...thresholds, correlationScore: parseInt(e?.target?.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auto-Freeze Threshold: {thresholds?.autoFreezeThreshold}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={thresholds?.autoFreezeThreshold}
                onChange={(e) => setThresholds({ ...thresholds, autoFreezeThreshold: parseInt(e?.target?.value) })}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Lock className="w-5 h-5 mr-2 text-red-600" />
            Automated Account Freezing
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-gray-900">Accounts frozen today</span>
              <span className="text-red-600 font-semibold text-xl">8</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="text-gray-900">Pending escalations</span>
              <span className="text-orange-600 font-semibold text-xl">15</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-900">Stakeholder notifications sent</span>
              <span className="text-blue-600 font-semibold text-xl">42</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-gray-900">Resolved violations</span>
              <span className="text-green-600 font-semibold text-xl">127</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeAlertEnginePanel;