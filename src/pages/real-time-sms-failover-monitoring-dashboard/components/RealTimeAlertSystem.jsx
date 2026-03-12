import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Bell, X, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const ALERT_TYPES = {
  failover: { color: 'border-yellow-500 bg-yellow-500/10', icon: AlertTriangle, iconColor: 'text-yellow-400', badge: 'bg-yellow-500' },
  degraded: { color: 'border-orange-500 bg-orange-500/10', icon: AlertTriangle, iconColor: 'text-orange-400', badge: 'bg-orange-500' },
  failure: { color: 'border-red-500 bg-red-500/10', icon: XCircle, iconColor: 'text-red-400', badge: 'bg-red-500' },
  recovery: { color: 'border-green-500 bg-green-500/10', icon: CheckCircle, iconColor: 'text-green-400', badge: 'bg-green-500' },
  info: { color: 'border-blue-500 bg-blue-500/10', icon: Info, iconColor: 'text-blue-400', badge: 'bg-blue-500' },
};

const AlertItem = ({ alert, onDismiss }) => {
  const cfg = ALERT_TYPES?.[alert?.type] || ALERT_TYPES?.info;
  const Icon = cfg?.icon;
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${cfg?.color} transition-all duration-300`}>
      <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg?.iconColor}`} />
      <div className="flex-1 min-w-0">
        <div className="text-white text-sm font-medium">{alert?.title}</div>
        <div className="text-gray-400 text-xs mt-0.5">{alert?.message}</div>
        <div className="text-gray-600 text-xs mt-1">{new Date(alert.timestamp)?.toLocaleTimeString()}</div>
      </div>
      <button onClick={() => onDismiss(alert?.id)} className="text-gray-600 hover:text-gray-400 flex-shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function RealTimeAlertSystem() {
  const [alerts, setAlerts] = useState([
    { id: '1', type: 'info', title: 'System Monitoring Active', message: 'Real-time monitoring initialized. Tracking Telnyx and Twilio health.', timestamp: new Date()?.toISOString() },
    { id: '2', type: 'recovery', title: 'All Providers Healthy', message: 'Telnyx: 97.2% delivery rate | Twilio: 96.5% delivery rate', timestamp: new Date(Date.now() - 300000)?.toISOString() },
  ]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addAlert = (alert) => {
    const newAlert = { id: Date.now()?.toString(), timestamp: new Date()?.toISOString(), ...alert };
    setAlerts(prev => [newAlert, ...prev]?.slice(0, 20));
    setUnreadCount(prev => prev + 1);
  };

  const dismissAlert = (id) => {
    setAlerts(prev => prev?.filter(a => a?.id !== id));
  };

  const clearAll = () => {
    setAlerts([]);
    setUnreadCount(0);
  };

  useEffect(() => {
    const failoverChannel = supabase
      ?.channel('alert-failover-channel')
      ?.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sms_failover_events' }, (payload) => {
        const event = payload?.new;
        addAlert({
          type: 'failover',
          title: `Provider Failover: ${event?.from_provider} → ${event?.to_provider}`,
          message: event?.reason || 'Automatic failover triggered',
        });
      })
      ?.subscribe();

    const healthChannel = supabase
      ?.channel('alert-health-channel')
      ?.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sms_provider_health' }, (payload) => {
        const health = payload?.new;
        if (health?.status === 'degraded') {
          addAlert({
            type: 'degraded',
            title: `${health?.provider} Performance Degraded`,
            message: health?.error_message || 'Provider health score dropped below threshold',
          });
        } else if (health?.status === 'offline') {
          addAlert({
            type: 'failure',
            title: `${health?.provider} Provider Offline`,
            message: 'Provider is unreachable. Failover may be triggered.',
          });
        }
      })
      ?.subscribe();

    return () => {
      supabase?.removeChannel(failoverChannel);
      supabase?.removeChannel(healthChannel);
    };
  }, []);

  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-red-400" />
          <h2 className="text-white font-bold text-lg">Real-time Alert System</h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{unreadCount}</span>
          )}
        </div>
        {alerts?.length > 0 && (
          <button onClick={clearAll} className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Clear all</button>
        )}
      </div>
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {alerts?.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No active alerts</p>
          </div>
        ) : (
          alerts?.map(alert => (
            <AlertItem key={alert?.id} alert={alert} onDismiss={dismissAlert} />
          ))
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <div className="text-yellow-400 font-bold">{alerts?.filter(a => a?.type === 'failover')?.length}</div>
          <div className="text-gray-500">Failovers</div>
        </div>
        <div>
          <div className="text-orange-400 font-bold">{alerts?.filter(a => a?.type === 'degraded')?.length}</div>
          <div className="text-gray-500">Degraded</div>
        </div>
        <div>
          <div className="text-red-400 font-bold">{alerts?.filter(a => a?.type === 'failure')?.length}</div>
          <div className="text-gray-500">Failures</div>
        </div>
      </div>
    </div>
  );
}
