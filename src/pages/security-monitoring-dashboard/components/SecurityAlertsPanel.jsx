import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const SecurityAlertsPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase?.from('security_events')?.select('*')?.in('severity', ['high', 'critical'])?.order('created_at', { ascending: false })?.limit(5);

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching security alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      default: return 'blue';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">Automated Security Alerts</h2>
        </div>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
          {alerts?.length || 0} Active
        </span>
      </div>
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading alerts...</div>
      ) : alerts?.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
          <p>No active security alerts</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts?.map((alert) => {
            const color = getSeverityColor(alert?.severity);
            const colorClasses = {
              red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', badge: 'bg-red-200 text-red-800' },
              orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', badge: 'bg-orange-200 text-orange-800' },
              yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600', badge: 'bg-yellow-200 text-yellow-800' },
              blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', badge: 'bg-blue-200 text-blue-800' }
            };
            const classes = colorClasses?.[color] || colorClasses?.blue;
            
            return (
              <div
                key={alert?.id}
                className={`flex items-start gap-4 p-4 ${classes?.bg} rounded-lg border ${classes?.border}`}
              >
                <AlertTriangle className={`w-5 h-5 ${classes?.text} mt-0.5 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">
                      {alert?.event_type?.replace(/_/g, ' ')?.toUpperCase()}
                    </p>
                    <span className={`px-2 py-1 ${classes?.badge} text-xs rounded font-medium`}>
                      {alert?.severity?.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">{alert?.reason || 'Security event detected'}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    {alert?.ip_address && <span>IP: {alert?.ip_address}</span>}
                    {alert?.country && <span>Country: {alert?.country}</span>}
                    <span>{new Date(alert?.created_at)?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SecurityAlertsPanel;