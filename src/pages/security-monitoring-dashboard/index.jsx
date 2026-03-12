import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Activity, Lock, Database, Globe } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import CORSViolationsPanel from './components/CORSViolationsPanel';
import RateLimitBreachesPanel from './components/RateLimitBreachesPanel';
import WebhookReplayPanel from './components/WebhookReplayPanel';
import SQLInjectionPanel from './components/SQLInjectionPanel';
import IPGeolocationPanel from './components/IPGeolocationPanel';
import SecurityAlertsPanel from './components/SecurityAlertsPanel';



const SecurityMonitoringDashboard = () => {
  const [stats, setStats] = useState({
    corsViolations: 0,
    rateLimitBreaches: 0,
    webhookReplays: 0,
    sqlInjections: 0,
    blockedCountries: 0,
    activeAlerts: 0
  });
  const [loading, setLoading] = useState(true);
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);

  // Add fetchSecurityStats function declaration before useEffect
  const fetchSecurityStats = async () => {
    try {
      const [corsData, rateLimitData, sqlData, securityData] = await Promise.all([
        supabase?.from('cors_violations')?.select('id', { count: 'exact', head: true }),
        supabase?.from('rate_limit_violations')?.select('id', { count: 'exact', head: true }),
        supabase?.from('sql_injection_attempts')?.select('id', { count: 'exact', head: true }),
        supabase?.from('security_events')?.select('id, event_type', { count: 'exact' })
      ]);

      const blockedCountries = securityData?.data?.filter(
        e => e?.event_type === 'blocked_country_attempt'
      )?.length || 0;

      setStats({
        corsViolations: corsData?.count || 0,
        rateLimitBreaches: rateLimitData?.count || 0,
        webhookReplays: 0,
        sqlInjections: sqlData?.count || 0,
        blockedCountries,
        activeAlerts: (corsData?.count || 0) + (rateLimitData?.count || 0) + (sqlData?.count || 0)
      });
    } catch (error) {
      console.error('Error fetching security stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityStats();
    
    if (realTimeEnabled) {
      const interval = setInterval(fetchSecurityStats, 5000);
      return () => clearInterval(interval);
    }
  }, [realTimeEnabled]);

  const statCards = [
    { label: 'CORS Violations', value: stats?.corsViolations, icon: Globe, color: 'red' },
    { label: 'Rate Limit Breaches', value: stats?.rateLimitBreaches, icon: Activity, color: 'orange' },
    { label: 'Webhook Replays', value: stats?.webhookReplays, icon: Lock, color: 'yellow' },
    { label: 'SQL Injection Attempts', value: stats?.sqlInjections, icon: Database, color: 'red' },
    { label: 'Blocked Countries', value: stats?.blockedCountries, icon: Shield, color: 'blue' },
    { label: 'Active Alerts', value: stats?.activeAlerts, icon: AlertTriangle, color: 'purple' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-600" />
                Security Monitoring Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Real-time security threat detection and monitoring
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  realTimeEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`} />
                <span className="text-sm text-gray-600">
                  {realTimeEnabled ? 'Live Monitoring' : 'Paused'}
                </span>
              </div>
              <button
                onClick={() => setRealTimeEnabled(!realTimeEnabled)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {realTimeEnabled ? 'Pause' : 'Resume'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards?.map((stat, index) => {
            const IconComponent = stat?.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat?.label}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {loading ? '...' : stat?.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat?.color}-100`}>
                    <IconComponent className={`w-6 h-6 text-${stat?.color}-600`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Panels */}
        <div className="space-y-6">
          <SecurityAlertsPanel />
          <CORSViolationsPanel />
          <RateLimitBreachesPanel />
          <WebhookReplayPanel />
          <SQLInjectionPanel />
          <IPGeolocationPanel />
        </div>
      </div>
    </div>
  );
};

export default SecurityMonitoringDashboard;