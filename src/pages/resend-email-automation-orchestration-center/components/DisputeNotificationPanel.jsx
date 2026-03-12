import React, { useState } from 'react';
import { AlertTriangle, Bell, Zap, CheckCircle } from 'lucide-react';

const DisputeNotificationPanel = () => {
  const [notifications] = useState([
    { id: 1, type: 'Escalation', severity: 'high', dispute: 'Election Fraud #1247', sent: '5m ago', status: 'delivered' },
    { id: 2, type: 'Resolution Update', severity: 'medium', dispute: 'Content Dispute #892', sent: '15m ago', status: 'delivered' },
    { id: 3, type: 'Stakeholder Alert', severity: 'high', dispute: 'Payment Issue #634', sent: '1h ago', status: 'delivered' },
    { id: 4, type: 'Escalation', severity: 'critical', dispute: 'Security Breach #423', sent: 'Just now', status: 'sending' }
  ]);

  const [routingRules] = useState([
    { id: 1, severity: 'Critical', recipients: 'Executive Team', deliveryTime: 'Immediate' },
    { id: 2, severity: 'High', recipients: 'Management + Legal', deliveryTime: '< 5 minutes' },
    { id: 3, severity: 'Medium', recipients: 'Support Team', deliveryTime: '< 15 minutes' },
    { id: 4, severity: 'Low', recipients: 'General Queue', deliveryTime: '< 1 hour' }
  ]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-50 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Dispute Notification Engine</h2>
            <p className="text-sm text-gray-600">Real-time escalation with severity-based routing</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-lg">
          <Zap className="w-4 h-4 text-orange-600 animate-pulse" />
          <span className="text-sm font-medium text-orange-700">Real-Time</span>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-600" />
          Recent Notifications
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {notifications?.map((notification) => (
            <div
              key={notification?.id}
              className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-3 flex-1">
                {notification?.status === 'delivered' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Zap className="w-5 h-5 text-orange-600 animate-pulse" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{notification?.type}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getSeverityColor(notification?.severity)}`}>
                      {notification?.severity?.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {notification?.dispute} • {notification?.sent}
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                notification?.status === 'delivered' ?'bg-green-100 text-green-700' :'bg-blue-100 text-blue-700'
              }`}>
                {notification?.status?.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Routing Rules */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Severity-Based Routing</h3>
        <div className="space-y-2">
          {routingRules?.map((rule) => (
            <div
              key={rule?.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(rule?.severity?.toLowerCase())}`}>
                  {rule?.severity?.toUpperCase()}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{rule?.recipients}</div>
                  <div className="text-xs text-gray-600">Delivery: {rule?.deliveryTime}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-orange-600">1,892</div>
            <div className="text-xs text-gray-600">Sent Today</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">98.5%</div>
            <div className="text-xs text-gray-600">Delivery Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">2.1s</div>
            <div className="text-xs text-gray-600">Avg Response</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisputeNotificationPanel;