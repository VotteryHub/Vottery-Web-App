import React, { useState, useEffect } from 'react';
import { Shield, RefreshCw, Wifi, WifiOff, Activity, Eye } from 'lucide-react';
import AnomalyDetectionPanel from './components/AnomalyDetectionPanel';
import GeographicHeatmap from './components/GeographicHeatmap';
import DemographicBreakdown from './components/DemographicBreakdown';
import BlockchainHealthIndicators from './components/BlockchainHealthIndicators';
import ConcurrentElectionsCounter from './components/ConcurrentElectionsCounter';

const STATS = [
  { label: 'Active Elections', value: '5', sub: 'Live monitoring', color: 'text-green-400', bg: 'bg-green-500/10' },
  { label: 'Anomalies Detected', value: '12', sub: 'Last 24 hours', color: 'text-red-400', bg: 'bg-red-500/10' },
  { label: 'Total Votes Monitored', value: '9.8M', sub: 'Real-time aggregate', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { label: 'Blockchain Integrity', value: '99.7%', sub: 'Verification rate', color: 'text-amber-400', bg: 'bg-amber-500/10' },
];

const ElectionIntegrityMonitoringHub = () => {
  const [wsConnected, setWsConnected] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date()?.toLocaleTimeString());
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate 5-second refresh
    const interval = setInterval(() => {
      setLastRefresh(new Date()?.toLocaleTimeString());
      // Simulate occasional WS reconnect
      if (Math.random() > 0.95) {
        setWsConnected(false);
        setTimeout(() => setWsConnected(true), 1500);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'anomalies', label: 'Anomaly Detection' },
    { id: 'geographic', label: 'Geographic Heatmap' },
    { id: 'demographics', label: 'Demographics' },
    { id: 'blockchain', label: 'Blockchain Health' },
    { id: 'elections', label: 'Elections Counter' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-green-500/20 rounded-xl">
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Election Integrity Monitoring Hub</h1>
              <p className="text-gray-400 text-sm">Real-time aggregate voting analytics with AI anomaly detection</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {wsConnected ? (
                <><Wifi className="w-4 h-4 text-green-400" /><span className="text-green-400 text-sm">WebSocket Connected</span></>
              ) : (
                <><WifiOff className="w-4 h-4 text-red-400" /><span className="text-red-400 text-sm">Reconnecting...</span></>
              )}
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refreshed: {lastRefresh}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-xs">5s Auto-Refresh</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {STATS?.map((stat) => (
            <div key={stat?.label} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg ${stat?.bg} mb-3`}>
                <Activity className={`w-3.5 h-3.5 ${stat?.color}`} />
                <span className={`text-xs font-medium ${stat?.color}`}>{stat?.sub}</span>
              </div>
              <p className={`text-2xl font-bold ${stat?.color}`}>{stat?.value}</p>
              <p className="text-gray-400 text-sm mt-1">{stat?.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs?.map(tab => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab?.id
                  ? 'bg-green-600 text-white' :'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {tab?.label}
            </button>
          ))}
        </div>

        {/* WebSocket Health Banner */}
        <div className={`rounded-xl border p-4 flex items-center justify-between ${wsConnected ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
          <div className="flex items-center gap-3">
            <Eye className={`w-4 h-4 ${wsConnected ? 'text-green-400' : 'text-red-400'}`} />
            <div>
              <p className="text-white font-medium text-sm">Real-time Supabase Subscriptions</p>
              <p className="text-gray-400 text-xs">voter_mcq_responses • live_question_broadcasts • election_results • blockchain_vote_verifications</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 text-sm ${wsConnected ? 'text-green-400' : 'text-red-400'}`}>
            <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
            {wsConnected ? 'All subscriptions active' : 'Failover in progress...'}
          </div>
        </div>

        {/* Panels */}
        {(activeTab === 'overview' || activeTab === 'elections') && (
          <ConcurrentElectionsCounter />
        )}
        {(activeTab === 'overview' || activeTab === 'anomalies') && (
          <AnomalyDetectionPanel />
        )}
        {(activeTab === 'overview' || activeTab === 'geographic') && (
          <GeographicHeatmap />
        )}
        {(activeTab === 'overview' || activeTab === 'demographics') && (
          <DemographicBreakdown />
        )}
        {(activeTab === 'overview' || activeTab === 'blockchain') && (
          <BlockchainHealthIndicators />
        )}
      </div>
    </div>
  );
};

export default ElectionIntegrityMonitoringHub;
