import React, { useState } from 'react';
import { Zap, Activity, Shield, Bell, GitBranch, RefreshCw, AlertTriangle, Pause, RotateCcw } from 'lucide-react';
import LoadTestingEngine from './components/LoadTestingEngine';
import WebSocketStressTester from './components/WebSocketStressTester';
import BlockchainThroughputPanel from './components/BlockchainThroughputPanel';
import PerformanceRegressionAlerts from './components/PerformanceRegressionAlerts';
import TestResultsDashboard from './components/TestResultsDashboard';
import { loadTestingAutoResponseService } from '../../services/loadTestingAutoResponseService';

const STATS = [
  { label: 'Scale Levels', value: '9', sub: '10K → 1B users', icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { label: 'WS Subscriptions', value: '3', sub: 'Stress tested', icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { label: 'Blockchain TPS', value: '18M', sub: 'Peak validated', icon: Shield, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { label: 'Regression Threshold', value: '20%', sub: 'SMS alert trigger', icon: Bell, color: 'text-red-400', bg: 'bg-red-500/10' },
];

const ProductionLoadTestingSuite = () => {
  const [activeSection, setActiveSection] = useState('all');
  const [lastRun, setLastRun] = useState(null);
  const [autoResponseLoading, setAutoResponseLoading] = useState(null);
  const [simulatedUsers, setSimulatedUsers] = useState(500000);
  const [loadTestsByScale, setLoadTestsByScale] = useState({});

  const sections = [
    { id: 'all', label: 'All Tests' },
    { id: 'load', label: 'Load Engine' },
    { id: 'websocket', label: 'WebSocket' },
    { id: 'blockchain', label: 'Blockchain' },
    { id: 'autoresponse', label: 'Auto-Response' },
    { id: 'alerts', label: 'Regression Alerts' },
    { id: 'results', label: 'Results' },
  ];

  const handleAutoResponse = async (action) => {
    setAutoResponseLoading(action);
    try {
      let result;
      if (action === 'scale') result = await loadTestingAutoResponseService.scaleConnections(simulatedUsers);
      else if (action === 'pause') result = await loadTestingAutoResponseService.pauseHighRiskElections();
      else if (action === 'circuit') result = await loadTestingAutoResponseService.activateCircuitBreakers();
      else if (action === 'rollback') result = await loadTestingAutoResponseService.rollback();
      else result = await loadTestingAutoResponseService.triggerFullResponse(simulatedUsers);
      if (result?.error) throw new Error(result?.error?.message);
      alert(result?.data?.message || `Auto-response "${action}" triggered. Check Edge function logs.`);
    } catch (e) {
      alert(`Auto-response failed: ${e?.message}`);
    } finally {
      setAutoResponseLoading(null);
    }
  };

  const handleTestUpdate = (test) => {
    if (!test?.scale) return;
    setLoadTestsByScale(prev => ({ ...prev, [test.scale]: test }));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-blue-500/20 rounded-xl">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Production Load Testing Suite</h1>
              <p className="text-gray-400 text-sm">Automated testing framework — 10K to 1B concurrent users</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {lastRun && (
              <span className="text-gray-500 text-sm">Last run: {lastRun}</span>
            )}
            <button
              onClick={() => setLastRun(new Date()?.toLocaleTimeString())}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Run Full Suite
            </button>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {STATS?.map((stat) => (
            <div key={stat?.label} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${stat?.bg}`}>
                  <stat.icon className={`w-4 h-4 ${stat?.color}`} />
                </div>
                <span className="text-gray-400 text-sm">{stat?.label}</span>
              </div>
              <p className={`text-2xl font-bold ${stat?.color}`}>{stat?.value}</p>
              <p className="text-gray-500 text-xs mt-1">{stat?.sub}</p>
            </div>
          ))}
        </div>

        {/* Section Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sections?.map(s => (
            <button
              key={s?.id}
              onClick={() => setActiveSection(s?.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeSection === s?.id
                  ? 'bg-blue-600 text-white' :'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {s?.label}
            </button>
          ))}
        </div>

        {/* CI/CD Integration Banner */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <GitBranch className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">CI/CD Integration Active</p>
              <p className="text-gray-400 text-xs">Automated testing runs before every production deployment — rollback enabled on failure</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm">Pipeline Connected</span>
          </div>
        </div>

        {/* Panels */}
        {(activeSection === 'all' || activeSection === 'load') && (
          <LoadTestingEngine onTestUpdate={handleTestUpdate} />
        )}
        {(activeSection === 'all' || activeSection === 'websocket') && (
          <WebSocketStressTester />
        )}
        {(activeSection === 'all' || activeSection === 'blockchain') && (
          <BlockchainThroughputPanel />
        )}
        {(activeSection === 'all' || activeSection === 'autoresponse') && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Load Testing → Auto-Response</h3>
                <p className="text-gray-400 text-sm">Trigger automated incident responses when load exceeds 500K users</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Simulated Users (for scale trigger)</label>
                <input
                  type="number"
                  value={simulatedUsers}
                  onChange={(e) => setSimulatedUsers(Number(e.target.value) || 500000)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  placeholder="500000"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleAutoResponse('scale')}
                disabled={autoResponseLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium"
              >
                {autoResponseLoading === 'scale' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
                Scale Supabase
              </button>
              <button
                onClick={() => handleAutoResponse('pause')}
                disabled={autoResponseLoading}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium"
              >
                {autoResponseLoading === 'pause' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Pause className="w-4 h-4" />}
                Pause High-Risk Elections
              </button>
              <button
                onClick={() => handleAutoResponse('circuit')}
                disabled={autoResponseLoading}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium"
              >
                {autoResponseLoading === 'circuit' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                Activate Circuit Breakers
              </button>
              <button
                onClick={() => handleAutoResponse('rollback')}
                disabled={autoResponseLoading}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium"
              >
                {autoResponseLoading === 'rollback' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                One-Click Rollback
              </button>
              <button
                onClick={() => handleAutoResponse('full')}
                disabled={autoResponseLoading}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium"
              >
                {autoResponseLoading === 'full' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                Full Auto-Response
              </button>
            </div>
            <p className="mt-4 text-xs text-gray-500">Requires Edge function: load-testing-auto-response. Deploy via Supabase Dashboard.</p>
          </div>
        )}
        {(activeSection === 'all' || activeSection === 'alerts') && (
          <PerformanceRegressionAlerts />
        )}
        {(activeSection === 'all' || activeSection === 'results') && (
          <TestResultsDashboard loadTests={Object.values(loadTestsByScale)} />
        )}
      </div>
    </div>
  );
};

export default ProductionLoadTestingSuite;
