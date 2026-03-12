import React, { useState, useCallback } from 'react';
import { Bell, Send, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { discordWebhookService } from '../../../services/discordWebhookService';
import { telnyxSMSService } from '../../../services/telnyxSMSService';

const AlertNotificationEngine = ({ alerts, onDismiss }) => {
  const [sending, setSending] = useState({});
  const [sent, setSent] = useState({});

  const sendAlert = useCallback(async (alert) => {
    const key = alert?.id;
    setSending(prev => ({ ...prev, [key]: true }));

    const message = `🚨 Performance Alert: ${alert?.metric} = ${alert?.value}${alert?.unit} (threshold: ${alert?.threshold}${alert?.unit}). Severity: ${alert?.severity?.toUpperCase()}. Platform: Vottery Web App.`;

    try {
      // Discord
      await discordWebhookService?.sendPerformanceAlert?.({
        title: `Performance Threshold Breached — ${alert?.metric}`,
        message,
        severity: alert?.severity,
        metric: alert?.metric,
        value: `${alert?.value}${alert?.unit}`,
        threshold: `${alert?.threshold}${alert?.unit}`,
      });

      // Telnyx SMS
      await telnyxSMSService?.sendSMS({
        to: import.meta.env?.VITE_TELNYX_PHONE_NUMBER || '+12345661030',
        message: message?.substring(0, 160),
        messageType: 'operational',
      });

      setSent(prev => ({ ...prev, [key]: true }));
    } catch (e) {
      console.error('Failed to send performance alert:', e?.message);
    } finally {
      setSending(prev => ({ ...prev, [key]: false }));
    }
  }, []);

  if (alerts?.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="w-5 h-5 text-gray-400" />
          <h3 className="text-base font-semibold text-gray-900">Alert Notification Engine</h3>
        </div>
        <div className="flex items-center gap-2 p-4 bg-green-50 rounded-lg border border-green-200">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-sm text-green-800">All performance metrics within thresholds. No alerts triggered.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-red-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-red-600" />
          <h3 className="text-base font-semibold text-gray-900">Alert Notification Engine</h3>
          <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium">{alerts?.length} active</span>
        </div>
      </div>
      <div className="space-y-3">
        {alerts?.map(alert => (
          <div key={alert?.id} className={`p-4 rounded-lg border flex items-start gap-3 ${
            alert?.severity === 'critical' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
          }`}>
            <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
              alert?.severity === 'critical' ? 'text-red-600' : 'text-amber-600'
            }`} />
            <div className="flex-1">
              <p className={`text-sm font-semibold ${
                alert?.severity === 'critical' ? 'text-red-900' : 'text-amber-900'
              }`}>
                {alert?.metric}: {alert?.value}{alert?.unit} (limit: {alert?.threshold}{alert?.unit})
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{new Date(alert.timestamp)?.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              {sent?.[alert?.id] ? (
                <span className="flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                  <CheckCircle className="w-3 h-3" /> Sent
                </span>
              ) : (
                <button
                  onClick={() => sendAlert(alert)}
                  disabled={sending?.[alert?.id]}
                  className="flex items-center gap-1 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send className="w-3 h-3" />
                  {sending?.[alert?.id] ? 'Sending...' : 'Alert'}
                </button>
              )}
              <button onClick={() => onDismiss?.(alert?.id)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertNotificationEngine;
