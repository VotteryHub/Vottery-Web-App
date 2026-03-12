import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { TrendingDown, CheckCircle, RefreshCw, GitBranch, RotateCcw, Activity, BarChart2, Shield } from 'lucide-react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';

const SCREENS = [
  'Home Feed Dashboard',
  'Elections Dashboard',
  'Secure Voting Interface',
  'User Profile Hub',
  'Digital Wallet Hub',
  'Admin Control Center',
  'Campaign Management',
  'Creator Earnings',
  'Fraud Detection',
  'Analytics Hub',
];

const generateRollingAvg = (base) => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d?.setDate(d?.getDate() - i);
    days?.push({
      date: d?.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      value: base + (Math.random() - 0.5) * base * 0.1,
    });
  }
  return days;
};

const generateScreenMetrics = () =>
  SCREENS?.map(screen => {
    const baseline = 400 + Math.random() * 1200;
    const rollingAvg = generateRollingAvg(baseline);
    const avgBaseline = rollingAvg?.reduce((s, d) => s + d?.value, 0) / rollingAvg?.length;
    const currentLatency = avgBaseline * (0.85 + Math.random() * 0.55);
    const pctChange = ((currentLatency - avgBaseline) / avgBaseline) * 100;
    const isRegression = pctChange > 15;
    const isCritical = pctChange > 30;
    return {
      screen,
      baseline: avgBaseline?.toFixed(0),
      current: currentLatency?.toFixed(0),
      pctChange: pctChange?.toFixed(1),
      isRegression,
      isCritical,
      rollingAvg,
      buildStatus: isRegression ? (isCritical ? 'failed' : 'warning') : 'passing',
      rollbackAvailable: isRegression,
      lastDeploy: `v${Math.floor(Math.random() * 5 + 1)}.${Math.floor(Math.random() * 20)}.${Math.floor(Math.random() * 10)}`,
    };
  });

const CI_BUILDS = [
  { id: 'build-4821', branch: 'main', commit: 'a3f9c2d', status: 'passed', latencyGate: 'passed', timestamp: '14:32:11', screens: 10, regressions: 0 },
  { id: 'build-4820', branch: 'feature/payment-v2', commit: 'b7e1a4f', status: 'failed', latencyGate: 'failed', timestamp: '13:15:44', screens: 10, regressions: 2 },
  { id: 'build-4819', branch: 'main', commit: 'c2d8b1e', status: 'passed', latencyGate: 'passed', timestamp: '11:02:33', screens: 10, regressions: 0 },
  { id: 'build-4818', branch: 'hotfix/auth', commit: 'd5f3c9a', status: 'passed', latencyGate: 'warning', timestamp: '09:44:22', screens: 10, regressions: 1 },
];

export default function PerformanceRegressionDetection() {
  const [screenMetrics, setScreenMetrics] = useState(generateScreenMetrics());
  const [activeTab, setActiveTab] = useState('screens');
  const [threshold, setThreshold] = useState(15);
  const [rollingWindow, setRollingWindow] = useState(7);
  const [autoRollback, setAutoRollback] = useState(true);
  const [ciGateEnabled, setCiGateEnabled] = useState(true);
  const [rollingBackScreen, setRollingBackScreen] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const regressions = screenMetrics?.filter(s => s?.isRegression);
  const criticals = screenMetrics?.filter(s => s?.isCritical);
  const passing = screenMetrics?.filter(s => !s?.isRegression);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 800));
    setScreenMetrics(generateScreenMetrics());
    setRefreshing(false);
  }, []);

  const triggerRollback = useCallback(async (screen) => {
    setRollingBackScreen(screen);
    await new Promise(r => setTimeout(r, 2000));
    setScreenMetrics(prev => prev?.map(s =>
      s?.screen === screen
        ? { ...s, current: s?.baseline, pctChange: '0.0', isRegression: false, isCritical: false, buildStatus: 'passing', rollbackAvailable: false }
        : s
    ));
    setRollingBackScreen(null);
  }, []);

  const tabs = [
    { id: 'screens', label: 'Per-Screen Metrics', icon: Activity },
    { id: 'rolling', label: '7-Day Rolling Avg', icon: BarChart2 },
    { id: 'cicd', label: 'CI/CD Build Gates', icon: GitBranch },
    { id: 'config', label: 'Configuration', icon: Shield },
  ];

  return (
    <>
      <Helmet>
        <title>Performance Regression Detection - Vottery</title>
        <meta name="description" content="Automated baseline comparison with 7-day rolling average detecting 15%+ latency increases per screen with CI/CD build failure gates and automated rollback triggers." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <TrendingDown className="w-7 h-7 text-orange-400" />
                  Performance Regression Detection
                </h1>
                <p className="text-muted-foreground mt-1">
                  7-day rolling avg baseline · {threshold}% regression threshold · CI/CD build gates · Auto-rollback
                </p>
              </div>
              <button
                onClick={refresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh Metrics
              </button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Screens Monitored', value: screenMetrics?.length, color: 'text-blue-400' },
              { label: 'Regressions Detected', value: regressions?.length, color: regressions?.length > 0 ? 'text-red-400' : 'text-green-400' },
              { label: 'Critical (>30%)', value: criticals?.length, color: criticals?.length > 0 ? 'text-red-500' : 'text-green-400' },
              { label: 'CI/CD Gate', value: ciGateEnabled ? 'ACTIVE' : 'DISABLED', color: ciGateEnabled ? 'text-green-400' : 'text-yellow-400' },
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

          {activeTab === 'screens' && (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Per-Screen Latency vs 7-Day Baseline</h3>
                <span className="text-xs text-muted-foreground">Threshold: &gt;{threshold}% = regression</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      {['Screen', '7-Day Avg Baseline', 'Current Latency', 'Change', 'Build Gate', 'Action']?.map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {screenMetrics?.map(s => (
                      <tr key={s?.screen} className={`border-b border-border/50 hover:bg-muted/20 ${
                        s?.isCritical ? 'bg-red-900/5' : s?.isRegression ? 'bg-yellow-900/5' : ''
                      }`}>
                        <td className="px-4 py-3 text-sm font-medium text-foreground">{s?.screen}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{s?.baseline}ms</td>
                        <td className="px-4 py-3 text-sm text-foreground">{s?.current}ms</td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-bold flex items-center gap-1 ${
                            parseFloat(s?.pctChange) > threshold ? (parseFloat(s?.pctChange) > 30 ? 'text-red-400' : 'text-yellow-400') : 'text-green-400'
                          }`}>
                            {parseFloat(s?.pctChange) > 0 ? <TrendingDown className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                            {s?.pctChange > 0 ? '+' : ''}{s?.pctChange}%
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            s?.buildStatus === 'failed' ? 'bg-red-900/50 text-red-300'
                            : s?.buildStatus === 'warning'? 'bg-yellow-900/50 text-yellow-300' :'bg-green-900/50 text-green-300'
                          }`}>
                            {s?.buildStatus === 'failed' ? '❌ FAILED' : s?.buildStatus === 'warning' ? '⚠ WARNING' : '✓ PASSING'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {s?.rollbackAvailable && (
                            <button
                              onClick={() => triggerRollback(s?.screen)}
                              disabled={rollingBackScreen === s?.screen}
                              className="flex items-center gap-1 px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-xs hover:bg-blue-900/50 disabled:opacity-60"
                            >
                              <RotateCcw className={`w-3 h-3 ${rollingBackScreen === s?.screen ? 'animate-spin' : ''}`} />
                              {rollingBackScreen === s?.screen ? 'Rolling back...' : 'Rollback'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'rolling' && (
            <div className="space-y-4">
              {screenMetrics?.filter(s => s?.isRegression)?.map(s => (
                <div key={s?.screen} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">{s?.screen}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      s?.isCritical ? 'bg-red-900/50 text-red-300' : 'bg-yellow-900/50 text-yellow-300'
                    }`}>
                      {s?.pctChange > 0 ? '+' : ''}{s?.pctChange}% vs baseline
                    </span>
                  </div>
                  <div className="flex items-end gap-1 h-24">
                    {s?.rollingAvg?.map((day, i) => {
                      const maxVal = Math.max(...s?.rollingAvg?.map(d => d?.value), parseFloat(s?.current));
                      const heightPct = (day?.value / maxVal) * 100;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className="w-full bg-blue-500/60 rounded-t"
                            style={{ height: `${heightPct}%` }}
                            title={`${day?.date}: ${day?.value?.toFixed(0)}ms`}
                          />
                          <span className="text-xs text-muted-foreground">{day?.date?.split(' ')?.[1]}</span>
                        </div>
                      );
                    })}
                    <div className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-red-500/80 rounded-t"
                        style={{ height: `${(parseFloat(s?.current) / Math.max(...s?.rollingAvg?.map(d => d?.value), parseFloat(s?.current))) * 100}%` }}
                        title={`Current: ${s?.current}ms`}
                      />
                      <span className="text-xs text-red-400">Now</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>7-day avg: {s?.baseline}ms</span>
                    <span>Current: <span className="text-red-400">{s?.current}ms</span></span>
                  </div>
                </div>
              ))}
              {screenMetrics?.filter(s => s?.isRegression)?.length === 0 && (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <p className="text-foreground font-medium">No regressions detected</p>
                  <p className="text-muted-foreground text-sm">All screens within {threshold}% of 7-day baseline</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'cicd' && (
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">CI/CD Build Failure Gate</p>
                  <p className="text-sm text-muted-foreground">Fail builds when any screen exceeds {threshold}% latency regression</p>
                </div>
                <button
                  onClick={() => setCiGateEnabled(p => !p)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${ciGateEnabled ? 'bg-green-500' : 'bg-gray-600'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${ciGateEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">Recent CI/CD Builds</h3>
                </div>
                <div className="divide-y divide-border">
                  {CI_BUILDS?.map(build => (
                    <div key={build?.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          build?.status === 'passed' ? 'bg-green-400' : 'bg-red-400'
                        }`} />
                        <div>
                          <p className="text-sm font-medium text-foreground">{build?.id} · {build?.branch}</p>
                          <p className="text-xs text-muted-foreground">Commit: {build?.commit} · {build?.timestamp}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Latency Gate</p>
                          <span className={`text-xs font-medium ${
                            build?.latencyGate === 'passed' ? 'text-green-400'
                            : build?.latencyGate === 'warning'? 'text-yellow-400' :'text-red-400'
                          }`}>{build?.latencyGate?.toUpperCase()}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Regressions</p>
                          <span className={`text-xs font-bold ${build?.regressions > 0 ? 'text-red-400' : 'text-green-400'}`}>
                            {build?.regressions}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-4">Detection Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">Regression Threshold (%)</label>
                    <div className="flex items-center gap-3">
                      <input type="range" min="5" max="50" value={threshold} onChange={e => setThreshold(Number(e?.target?.value))} className="flex-1" />
                      <span className="text-foreground font-bold w-10 text-center">{threshold}%</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">Rolling Average Window (days)</label>
                    <div className="flex items-center gap-3">
                      <input type="range" min="1" max="30" value={rollingWindow} onChange={e => setRollingWindow(Number(e?.target?.value))} className="flex-1" />
                      <span className="text-foreground font-bold w-10 text-center">{rollingWindow}d</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">Auto-Rollback on Critical Regression</p>
                      <p className="text-xs text-muted-foreground">Automatically rollback when regression &gt;30%</p>
                    </div>
                    <button
                      onClick={() => setAutoRollback(p => !p)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${autoRollback ? 'bg-green-500' : 'bg-gray-600'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${autoRollback ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-4">Detection Summary</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Monitoring Window', value: `${rollingWindow}-day rolling avg` },
                    { label: 'Regression Threshold', value: `>${threshold}% latency increase` },
                    { label: 'Critical Threshold', value: '>30% latency increase' },
                    { label: 'CI/CD Gate', value: ciGateEnabled ? 'Enabled — fails builds' : 'Disabled' },
                    { label: 'Auto-Rollback', value: autoRollback ? 'Enabled for critical' : 'Manual only' },
                    { label: 'Screens Monitored', value: `${SCREENS?.length} screens` },
                  ]?.map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                      <span className="text-sm text-muted-foreground">{item?.label}</span>
                      <span className="text-sm font-medium text-foreground">{item?.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
