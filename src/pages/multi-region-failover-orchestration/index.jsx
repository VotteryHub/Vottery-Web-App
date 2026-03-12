import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Globe, Activity, Zap, ArrowRight, Clock } from 'lucide-react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';


const REGIONS = [
  { id: 'us-east-1', name: 'US East', zone: 'Zone 1', flag: '🇺🇸', latency: 12, health: 99.8, traffic: 34, status: 'primary', ppZone: 'Zone 1 - Tier A' },
  { id: 'eu-west-1', name: 'EU West', zone: 'Zone 2', flag: '🇪🇺', latency: 18, health: 99.6, traffic: 28, status: 'primary', ppZone: 'Zone 2 - Tier B' },
  { id: 'ap-northeast-1', name: 'AP Northeast', zone: 'Zone 3', flag: '🇯🇵', latency: 24, health: 98.9, traffic: 16, status: 'primary', ppZone: 'Zone 3 - Tier C' },
  { id: 'sa-east-1', name: 'SA East', zone: 'Zone 4', flag: '🇧🇷', latency: 42, health: 97.2, traffic: 8, status: 'degraded', ppZone: 'Zone 4 - Tier D' },
  { id: 'ap-south-1', name: 'AP South', zone: 'Zone 5', flag: '🇮🇳', latency: 38, health: 98.1, traffic: 7, status: 'primary', ppZone: 'Zone 5 - Tier E' },
  { id: 'af-south-1', name: 'AF South', zone: 'Zone 6', flag: '🌍', latency: 67, health: 94.3, traffic: 2, status: 'failover', ppZone: 'Zone 6 - Tier F' },
  { id: 'ap-southeast-1', name: 'AP Southeast', zone: 'Zone 7', flag: '🇸🇬', latency: 31, health: 98.7, traffic: 4, status: 'primary', ppZone: 'Zone 7 - Tier G' },
  { id: 'me-south-1', name: 'ME South', zone: 'Zone 8', flag: '🌙', latency: 55, health: 95.8, traffic: 1, status: 'primary', ppZone: 'Zone 8 - Tier H' },
];

const FAILOVER_EVENTS = [
  { id: 'fe1', time: '14:23:11', from: 'AF South', to: 'EU West', reason: 'Health check failure (3 consecutive)', duration: '2.3s', status: 'resolved', latencyImpact: '+8ms' },
  { id: 'fe2', time: '11:45:02', from: 'SA East', to: 'US East', reason: 'Latency spike >200ms threshold', duration: '1.8s', status: 'resolved', latencyImpact: '+15ms' },
  { id: 'fe3', time: '09:12:44', from: 'ME South', to: 'EU West', reason: 'Datadog APM error rate >5%', duration: '3.1s', status: 'resolved', latencyImpact: '+22ms' },
];

const HEALTH_CHECKS = [
  { name: 'HTTP Endpoint', interval: '10s', timeout: '3s', threshold: 3 },
  { name: 'Database Connectivity', interval: '30s', timeout: '5s', threshold: 2 },
  { name: 'Supabase Realtime', interval: '15s', timeout: '4s', threshold: 3 },
  { name: 'Stripe API', interval: '60s', timeout: '10s', threshold: 2 },
  { name: 'Datadog APM', interval: '5s', timeout: '2s', threshold: 5 },
];

export default function MultiRegionFailoverOrchestration() {
  const [regions, setRegions] = useState(REGIONS);
  const [activeTab, setActiveTab] = useState('overview');
  const [autoFailover, setAutoFailover] = useState(true);
  const [latencyRouting, setLatencyRouting] = useState(true);
  const [simulatingFailover, setSimulatingFailover] = useState(null);
  const [failoverEvents, setFailoverEvents] = useState(FAILOVER_EVENTS);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setRegions(prev => prev?.map(r => ({
        ...r,
        latency: Math.max(8, r?.latency + (Math.random() - 0.5) * 4),
        health: Math.min(100, Math.max(90, r?.health + (Math.random() - 0.5) * 0.3)),
      })));
      setLastRefresh(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const simulateFailover = useCallback(async (regionId) => {
    setSimulatingFailover(regionId);
    await new Promise(r => setTimeout(r, 2000));
    const region = regions?.find(r => r?.id === regionId);
    const fallback = regions?.find(r => r?.id !== regionId && r?.status === 'primary' && r?.traffic > 10);
    if (region && fallback) {
      const newEvent = {
        id: `fe_${Date.now()}`,
        time: new Date()?.toLocaleTimeString(),
        from: region?.name,
        to: fallback?.name,
        reason: 'Manual failover simulation',
        duration: `${(1.5 + Math.random())?.toFixed(1)}s`,
        status: 'resolved',
        latencyImpact: `+${Math.floor(5 + Math.random() * 20)}ms`,
      };
      setFailoverEvents(prev => [newEvent, ...prev]);
      setRegions(prev => prev?.map(r => {
        if (r?.id === regionId) return { ...r, status: 'failover', traffic: 0 };
        if (r?.id === fallback?.id) return { ...r, traffic: r?.traffic + region?.traffic };
        return r;
      }));
    }
    setSimulatingFailover(null);
  }, [regions]);

  const restoreRegion = useCallback((regionId) => {
    setRegions(prev => {
      const region = prev?.find(r => r?.id === regionId);
      const original = REGIONS?.find(r => r?.id === regionId);
      return prev?.map(r => r?.id === regionId ? { ...r, status: 'primary', traffic: original?.traffic || 5 } : r);
    });
  }, []);

  const getStatusColor = (status) => {
    if (status === 'primary') return 'text-green-400';
    if (status === 'degraded') return 'text-yellow-400';
    if (status === 'failover') return 'text-red-400';
    return 'text-gray-400';
  };

  const getHealthColor = (health) => {
    if (health >= 99) return 'text-green-400';
    if (health >= 97) return 'text-yellow-400';
    return 'text-red-400';
  };

  const tabs = [
    { id: 'overview', label: 'Region Overview', icon: Globe },
    { id: 'routing', label: 'Traffic Routing', icon: ArrowRight },
    { id: 'healthchecks', label: 'Health Checks', icon: Activity },
    { id: 'events', label: 'Failover Events', icon: Clock },
  ];

  const totalTraffic = regions?.reduce((s, r) => s + r?.traffic, 0);
  const healthyRegions = regions?.filter(r => r?.health >= 97)?.length;
  const avgLatency = (regions?.reduce((s, r) => s + r?.latency, 0) / regions?.length)?.toFixed(1);

  return (
    <>
      <Helmet>
        <title>Multi-Region Failover Orchestration - Vottery</title>
        <meta name="description" content="Automated failover between Datadog-monitored regions with intelligent traffic routing, health check cascading, and latency-based zone selection across 8 purchasing power zones." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Globe className="w-7 h-7 text-blue-400" />
                  Multi-Region Failover Orchestration
                </h1>
                <p className="text-muted-foreground mt-1">Datadog-monitored · Intelligent traffic routing · 8 purchasing power zones · Last refresh: {lastRefresh?.toLocaleTimeString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Auto-Failover</span>
                  <button
                    onClick={() => setAutoFailover(p => !p)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${autoFailover ? 'bg-green-500' : 'bg-gray-600'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${autoFailover ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Latency Routing</span>
                  <button
                    onClick={() => setLatencyRouting(p => !p)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${latencyRouting ? 'bg-blue-500' : 'bg-gray-600'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${latencyRouting ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Healthy Regions', value: `${healthyRegions}/8`, color: 'text-green-400' },
              { label: 'Avg Latency', value: `${avgLatency}ms`, color: 'text-blue-400' },
              { label: 'Failover Events (24h)', value: failoverEvents?.length, color: 'text-yellow-400' },
              { label: 'Auto-Failover', value: autoFailover ? 'ENABLED' : 'DISABLED', color: autoFailover ? 'text-green-400' : 'text-red-400' },
            ]?.map((kpi, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">{kpi?.label}</p>
                <p className={`text-2xl font-bold ${kpi?.color}`}>{kpi?.value}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-muted/30 p-1 rounded-lg overflow-x-auto">
            {tabs?.map(t => (
              <button
                key={t?.id}
                onClick={() => setActiveTab(t?.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === t?.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t?.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {regions?.map(region => (
                <div key={region?.id} className={`bg-card border rounded-lg p-4 ${
                  region?.status === 'failover' ? 'border-red-500/50' : region?.status === 'degraded' ? 'border-yellow-500/50' : 'border-border'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{region?.flag}</span>
                      <div>
                        <p className="font-medium text-foreground text-sm">{region?.name}</p>
                        <p className="text-xs text-muted-foreground">{region?.ppZone}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium ${getStatusColor(region?.status)}`}>
                      {region?.status?.toUpperCase()}
                    </span>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Latency</span>
                      <span className={region?.latency > 50 ? 'text-yellow-400' : 'text-green-400'}>{region?.latency?.toFixed(0)}ms</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Health</span>
                      <span className={getHealthColor(region?.health)}>{region?.health?.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Traffic</span>
                      <span className="text-foreground">{region?.traffic}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full">
                      <div className="h-1.5 bg-primary rounded-full" style={{ width: `${(region?.traffic / totalTraffic) * 100}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {region?.status !== 'failover' ? (
                      <button
                        onClick={() => simulateFailover(region?.id)}
                        disabled={simulatingFailover === region?.id}
                        className="flex-1 py-1.5 bg-red-900/30 text-red-300 rounded text-xs hover:bg-red-900/50 disabled:opacity-60"
                      >
                        {simulatingFailover === region?.id ? 'Failing over...' : 'Simulate Failover'}
                      </button>
                    ) : (
                      <button
                        onClick={() => restoreRegion(region?.id)}
                        className="flex-1 py-1.5 bg-green-900/30 text-green-300 rounded text-xs hover:bg-green-900/50"
                      >
                        Restore Region
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'routing' && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-4">Intelligent Traffic Routing Rules</h3>
                <div className="space-y-3">
                  {[
                    { rule: 'Latency-Based Primary Selection', desc: 'Route to lowest-latency healthy region for each user zone', active: latencyRouting, type: 'latency' },
                    { rule: 'Health Check Cascade', desc: 'Failover to next-best region when health drops below 95%', active: autoFailover, type: 'health' },
                    { rule: 'Purchasing Power Zone Affinity', desc: 'Prefer same PP zone region for pricing consistency', active: true, type: 'zone' },
                    { rule: 'Datadog APM Error Rate Gate', desc: 'Auto-failover when error rate exceeds 5% threshold', active: autoFailover, type: 'error' },
                    { rule: 'Geographic Proximity Routing', desc: 'Minimize cross-continental traffic for compliance', active: true, type: 'geo' },
                  ]?.map((rule, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-foreground">{rule?.rule}</p>
                        <p className="text-xs text-muted-foreground">{rule?.desc}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        rule?.active ? 'bg-green-900/30 text-green-300' : 'bg-gray-700 text-gray-400'
                      }`}>{rule?.active ? 'ACTIVE' : 'INACTIVE'}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-4">Current Traffic Distribution</h3>
                <div className="space-y-3">
                  {regions?.sort((a, b) => b?.traffic - a?.traffic)?.map(r => (
                    <div key={r?.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{r?.flag} {r?.name} ({r?.ppZone})</span>
                        <span className="text-foreground">{r?.traffic}% · {r?.latency?.toFixed(0)}ms</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div
                          className={`h-2 rounded-full ${
                            r?.status === 'failover' ? 'bg-red-500' : r?.status === 'degraded' ? 'bg-yellow-500' : 'bg-primary'
                          }`}
                          style={{ width: `${r?.traffic}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'healthchecks' && (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Health Check Cascade Configuration</h3>
                <p className="text-sm text-muted-foreground mt-1">Checks run per region — failure threshold triggers automatic failover</p>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['Check Name', 'Interval', 'Timeout', 'Failure Threshold', 'Status']?.map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HEALTH_CHECKS?.map((check, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{check?.name}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{check?.interval}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{check?.timeout}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{check?.threshold} consecutive</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-xs bg-green-900/30 text-green-300">✓ Passing</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-3">
              {failoverEvents?.map(event => (
                <div key={event?.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-yellow-900/30 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-yellow-400" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{event?.from} → {event?.to}</p>
                        <p className="text-xs text-muted-foreground">{event?.reason}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded text-xs bg-green-900/30 text-green-300">{event?.status}</span>
                      <p className="text-xs text-muted-foreground mt-1">{event?.time}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                    <span>Duration: <span className="text-foreground">{event?.duration}</span></span>
                    <span>Latency Impact: <span className="text-yellow-400">{event?.latencyImpact}</span></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
