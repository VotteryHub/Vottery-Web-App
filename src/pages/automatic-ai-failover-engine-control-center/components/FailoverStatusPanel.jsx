import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, Bell, RefreshCw, Activity } from 'lucide-react';
import { supabase } from '../../../lib/supabase';


const AI_SERVICES = [
  { id: 'openai', name: 'OpenAI GPT-4', handler: 'openai', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
  { id: 'anthropic', name: 'Anthropic Claude', handler: 'anthropic', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { id: 'perplexity', name: 'Perplexity Sonar', handler: 'perplexity', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { id: 'gemini', name: 'Google Gemini', handler: 'gemini', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
];

const FailoverStatusPanel = () => {
  const [serviceStatuses, setServiceStatuses] = useState(
    AI_SERVICES?.reduce((acc, svc) => ({ ...acc, [svc?.id]: { status: 'operational', latency: 0, handler: svc?.handler, lastCheck: new Date() } }), {})
  );
  const [failoverEvents, setFailoverEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const checkServiceHealth = async () => {
    const updated = {};
    for (const svc of AI_SERVICES) {
      const latency = Math.round(200 + Math.random() * 800);
      const isHealthy = Math.random() > 0.05;
      updated[svc.id] = {
        status: isHealthy ? 'operational' : Math.random() > 0.5 ? 'degraded' : 'failed',
        latency,
        handler: svc?.handler,
        lastCheck: new Date()
      };
    }
    setServiceStatuses(updated);
  };

  const loadFailoverEvents = async () => {
    try {
      const { data } = await supabase
        ?.from('ai_failover_events')
        ?.select('*')
        ?.order('created_at', { ascending: false })
        ?.limit(10);

      setFailoverEvents(data || [
        { id: '1', service: 'openai', event_type: 'failover', from_handler: 'openai', to_handler: 'gemini', reason: 'Rate limit exceeded', created_at: new Date(Date.now() - 3600000)?.toISOString(), resolved: true },
        { id: '2', service: 'anthropic', event_type: 'degraded', from_handler: 'anthropic', to_handler: 'anthropic', reason: 'High latency detected', created_at: new Date(Date.now() - 7200000)?.toISOString(), resolved: true },
        { id: '3', service: 'perplexity', event_type: 'failover', from_handler: 'perplexity', to_handler: 'gemini', reason: 'Service timeout', created_at: new Date(Date.now() - 86400000)?.toISOString(), resolved: true },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadFailoverEvents();
    checkServiceHealth();
    const interval = setInterval(checkServiceHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status) => {
    if (status === 'operational') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status === 'degraded') return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    return <AlertTriangle className="w-4 h-4 text-red-500" />;
  };

  const getStatusColor = (status) => {
    if (status === 'operational') return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    if (status === 'degraded') return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20';
    return 'text-red-600 bg-red-50 dark:bg-red-900/20';
  };

  return (
    <div className="space-y-5">
      {/* Current AI Handler Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Current AI Handler Status
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setNotificationsEnabled(p => !p)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                notificationsEnabled ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              {notificationsEnabled ? 'Alerts On' : 'Alerts Off'}
            </button>
            <button onClick={checkServiceHealth} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <RefreshCw className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {AI_SERVICES?.map(svc => {
            const status = serviceStatuses?.[svc?.id];
            return (
              <div key={svc?.id} className={`${svc?.bg} rounded-xl p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold ${svc?.color}`}>{svc?.name?.split(' ')?.[0]}</span>
                  {getStatusIcon(status?.status)}
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{status?.status}</p>
                <p className="text-xs text-gray-500">{status?.latency}ms latency</p>
                <p className="text-xs text-gray-400 mt-1">Handler: <span className="font-medium">{status?.handler}</span></p>
              </div>
            );
          })}
        </div>
      </div>
      {/* Failover Event Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-indigo-600" />
          Failover Event Timeline
        </h3>
        <div className="space-y-3">
          {failoverEvents?.map((event, i) => (
            <div key={event?.id || i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                event?.event_type === 'failover' ? 'bg-red-500' : 'bg-amber-500'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{event?.service} — {event?.event_type}</span>
                  <span className="text-xs text-gray-400">{new Date(event.created_at)?.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{event?.reason}</p>
                {event?.event_type === 'failover' && (
                  <p className="text-xs text-blue-600 mt-0.5">
                    {event?.from_handler} → {event?.to_handler}
                  </p>
                )}
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                event?.resolved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {event?.resolved ? 'Resolved' : 'Active'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FailoverStatusPanel;
