import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle } from 'lucide-react';

const RealTimeAlertsPanel = ({ trackEvent }) => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'critical',
      message: 'Multiple authentication failures detected from IP 192.168.1.100',
      timestamp: new Date()?.toISOString(),
      acknowledged: false
    },
    {
      id: 2,
      type: 'warning',
      message: 'Payment fraud risk score exceeded threshold (85%)',
      timestamp: new Date(Date.now() - 300000)?.toISOString(),
      acknowledged: false
    }
  ]);

  useEffect(() => {
    trackEvent?.('real_time_alerts_view', {
      alert_count: alerts?.length,
      unacknowledged: alerts?.filter(a => !a?.acknowledged)?.length
    });
  }, []);

  const handleAcknowledge = (alertId) => {
    setAlerts(alerts?.map(alert => 
      alert?.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
    
    trackEvent?.('alert_acknowledged', {
      alert_id: alertId,
      alert_type: alerts?.find(a => a?.id === alertId)?.type
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Real-Time Security Alerts</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-gray-600">Live</span>
        </div>
      </div>
      <div className="space-y-3">
        {alerts?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <p>No active alerts</p>
          </div>
        ) : (
          alerts?.map((alert) => (
            <div
              key={alert?.id}
              className={`p-4 rounded-lg border ${
                alert?.type === 'critical' ?'bg-red-50 border-red-200' :'bg-yellow-50 border-yellow-200'
              } ${alert?.acknowledged ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                    alert?.type === 'critical' ? 'text-red-600' : 'text-yellow-600'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 mb-1">{alert?.message}</p>
                    <p className="text-xs text-gray-600">
                      {new Date(alert?.timestamp)?.toLocaleString()}
                    </p>
                  </div>
                </div>
                {!alert?.acknowledged && (
                  <button
                    onClick={() => handleAcknowledge(alert?.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RealTimeAlertsPanel;