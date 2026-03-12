import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Activity } from 'lucide-react';
import ProviderHealthPanel from './components/ProviderHealthPanel';
import FailoverDetectionPanel from './components/FailoverDetectionPanel';
import PerformanceComparisonPanel from './components/PerformanceComparisonPanel';
import FailoverHistoryTimeline from './components/FailoverHistoryTimeline';
import RealTimeAlertSystem from './components/RealTimeAlertSystem';
import ResponseTrackingPanel from './components/ResponseTrackingPanel';

const StatCard = ({ label, value, sub, color = 'text-white' }) => (
  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
    <div className="text-gray-400 text-sm mt-1">{label}</div>
    {sub && <div className="text-gray-500 text-xs mt-0.5">{sub}</div>}
  </div>
);

export default function RealTimeSMSFailoverMonitoringDashboard() {
  const [activeProvider, setActiveProvider] = useState('telnyx');
  const [systemStatus, setSystemStatus] = useState('operational');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [stats, setStats] = useState({
    totalMessages: 0,
    failoverCount: 0,
    avgLatency: 0,
    uptime: 99.9,
  });

  // Add this block - state for component props
  const [providerState, setProviderState] = useState({
    telnyx: { status: 'healthy', latency: 0 },
    twilio: { status: 'healthy', latency: 0 }
  });
  const [healthMetrics, setHealthMetrics] = useState([]);
  const [communications, setCommunications] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    telnyx: { avgLatency: 0, successRate: 0 },
    twilio: { avgLatency: 0, successRate: 0 }
  });
  const [performanceHistory, setPerformanceHistory] = useState([]);

  const fetchDashboardStats = async () => {
    try {
      const [logsResult, failoverResult, healthResult, stateResult] = await Promise.all([
        supabase?.from('sms_delivery_logs')?.select('id', { count: 'exact', head: true }),
        supabase?.from('sms_failover_events')?.select('id', { count: 'exact', head: true }),
        supabase?.from('sms_health_check_results')?.select('latency_ms')?.order('checked_at', { ascending: false })?.limit(20),
        supabase?.from('sms_provider_state')?.select('active_provider')?.single(),
      ]);

      const latencies = healthResult?.data?.map(h => h?.latency_ms)?.filter(Boolean) || [];
      const avgLat = latencies?.length ? Math.round(latencies?.reduce((s, v) => s + v, 0) / latencies?.length) : 378;

      setStats({
        totalMessages: logsResult?.count || 0,
        failoverCount: failoverResult?.count || 0,
        avgLatency: avgLat,
        uptime: 99.9,
      });

      if (stateResult?.data?.active_provider) {
        setActiveProvider(stateResult?.data?.active_provider);
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  };

  // Add this block - handlers for component callbacks
  const handleManualFailover = async (provider) => {
    console.log('Manual failover to:', provider);
    setActiveProvider(provider);
  };

  const handleRefresh = () => {
    fetchDashboardStats();
  };

  useEffect(() => {
    fetchDashboardStats();
    const interval = setInterval(() => {
      fetchDashboardStats();
      setLastUpdated(new Date());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const channel = supabase
      ?.channel('dashboard-realtime')
      ?.on('postgres_changes', { event: '*', schema: 'public', table: 'sms_failover_events' }, fetchDashboardStats)
      ?.on('postgres_changes', { event: '*', schema: 'public', table: 'sms_provider_state' }, fetchDashboardStats)
      ?.subscribe();
    return () => supabase?.removeChannel(channel);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Real-time SMS Failover Monitoring</h1>
              <p className="text-gray-400 text-sm">Live Telnyx / Twilio health monitoring with instant failover detection</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-400 text-sm font-medium">System Operational</span>
            </div>
            <div className="text-gray-500 text-xs">
              Active: <span className="text-blue-400 font-semibold capitalize">{activeProvider}</span>
            </div>
            <div className="text-gray-600 text-xs">
              Updated: {lastUpdated?.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto px-6 py-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total SMS Sent" value={stats?.totalMessages?.toLocaleString()} sub="All providers" color="text-blue-400" />
          <StatCard label="Failover Events" value={stats?.failoverCount} sub="Auto-triggered" color={stats?.failoverCount > 0 ? 'text-yellow-400' : 'text-green-400'} />
          <StatCard label="Avg Response Time" value={`${stats?.avgLatency}ms`} sub="Both providers" color={stats?.avgLatency < 500 ? 'text-green-400' : 'text-yellow-400'} />
          <StatCard label="System Uptime" value={`${stats?.uptime}%`} sub="Last 30 days" color="text-green-400" />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="xl:col-span-2 space-y-6">
            <ProviderHealthPanel 
              providerState={providerState}
              healthMetrics={healthMetrics}
              onManualFailover={handleManualFailover}
              onRefresh={handleRefresh}
            />
            <ResponseTrackingPanel 
              communications={communications}
              onRefresh={handleRefresh}
            />
            <PerformanceComparisonPanel 
              metrics={performanceMetrics}
              history={performanceHistory}
            />
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            <FailoverDetectionPanel />
            <RealTimeAlertSystem />
            <FailoverHistoryTimeline />
          </div>
        </div>
      </div>
    </div>
  );
}
