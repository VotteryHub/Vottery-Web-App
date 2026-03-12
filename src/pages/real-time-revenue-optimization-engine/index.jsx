import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { TrendingUp, Pause, Play, RefreshCw, DollarSign, BarChart2, AlertTriangle, CheckCircle, Settings, Zap, Globe, Target } from 'lucide-react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';



const PURCHASING_POWER_ZONES = [
  { id: 'zone_1', name: 'Zone 1 - Tier A', region: 'US/CA/AU', ppIndex: 100, baseMultiplier: 1.0 },
  { id: 'zone_2', name: 'Zone 2 - Tier B', region: 'UK/DE/FR', ppIndex: 88, baseMultiplier: 0.9 },
  { id: 'zone_3', name: 'Zone 3 - Tier C', region: 'JP/KR/SG', ppIndex: 76, baseMultiplier: 0.8 },
  { id: 'zone_4', name: 'Zone 4 - Tier D', region: 'BR/MX/AR', ppIndex: 52, baseMultiplier: 0.6 },
  { id: 'zone_5', name: 'Zone 5 - Tier E', region: 'IN/PK/BD', ppIndex: 38, baseMultiplier: 0.45 },
  { id: 'zone_6', name: 'Zone 6 - Tier F', region: 'NG/GH/KE', ppIndex: 28, baseMultiplier: 0.35 },
  { id: 'zone_7', name: 'Zone 7 - Tier G', region: 'ID/PH/VN', ppIndex: 42, baseMultiplier: 0.5 },
  { id: 'zone_8', name: 'Zone 8 - Tier H', region: 'EG/MA/TN', ppIndex: 32, baseMultiplier: 0.4 },
];

const SUBSCRIPTION_PLANS = [
  { id: 'basic', name: 'Basic', basePrice: 4.99, vpMultiplier: '2x', color: 'blue' },
  { id: 'pro', name: 'Pro', basePrice: 9.99, vpMultiplier: '3x', color: 'purple' },
  { id: 'elite', name: 'Elite', basePrice: 19.99, vpMultiplier: '5x', color: 'gold' },
];

const generateCampaignData = () => [
  { id: 'c1', name: 'Summer Voting Boost', zone: 'Zone 1', revenue: 12400, cost: 3200, margin: 74.2, status: 'active', roas: 3.87, paused: false },
  { id: 'c2', name: 'Festival Election Drive', zone: 'Zone 3', revenue: 4100, cost: 3900, margin: 4.9, status: 'at_risk', roas: 1.05, paused: false },
  { id: 'c3', name: 'Tier D Expansion', zone: 'Zone 4', revenue: 1800, cost: 2400, margin: -33.3, status: 'unprofitable', roas: 0.75, paused: true },
  { id: 'c4', name: 'Elite Subscriber Push', zone: 'Zone 2', revenue: 28900, cost: 6100, margin: 78.9, status: 'active', roas: 4.74, paused: false },
  { id: 'c5', name: 'Zone 5 Awareness', zone: 'Zone 5', revenue: 2200, cost: 2800, margin: -27.3, status: 'unprofitable', roas: 0.79, paused: true },
  { id: 'c6', name: 'Pro Plan Upsell', zone: 'Zone 1', revenue: 18600, cost: 4200, margin: 77.4, status: 'active', roas: 4.43, paused: false },
];

const generateABTests = () => [
  { id: 'ab1', name: 'Basic Plan Zone 4 Price Test', plan: 'Basic', zone: 'Zone 4 - Tier D', variantA: '$2.99', variantB: '$3.49', conversionA: 8.4, conversionB: 6.1, revenueA: 1240, revenueB: 1580, winner: 'B', confidence: 94.2, status: 'completed' },
  { id: 'ab2', name: 'Pro Plan Zone 2 Optimization', plan: 'Pro', zone: 'Zone 2 - Tier B', variantA: '$8.99', variantB: '$9.49', conversionA: 5.2, conversionB: 5.8, revenueA: 4680, revenueB: 5510, winner: null, confidence: 71.3, status: 'running' },
  { id: 'ab3', name: 'Elite Zone 1 Premium Test', plan: 'Elite', zone: 'Zone 1 - Tier A', variantA: '$19.99', variantB: '$24.99', conversionA: 2.1, conversionB: 1.8, revenueA: 8396, revenueB: 8996, winner: null, confidence: 58.7, status: 'running' },
  { id: 'ab4', name: 'Basic Zone 5 Affordability', plan: 'Basic', zone: 'Zone 5 - Tier E', variantA: '$1.99', variantB: '$2.49', conversionA: 12.3, conversionB: 9.8, revenueA: 2450, revenueB: 2440, winner: 'A', confidence: 91.8, status: 'completed' },
];

const MARGIN_THRESHOLD = 15;

export default function RealTimeRevenueOptimizationEngine() {
  const [activeTab, setActiveTab] = useState('overview');
  const [campaigns, setCampaigns] = useState(generateCampaignData());
  const [abTests, setAbTests] = useState(generateABTests());
  const [marginThreshold, setMarginThreshold] = useState(MARGIN_THRESHOLD);
  const [autoProtectionEnabled, setAutoProtectionEnabled] = useState(true);
  const [zonePricing, setZonePricing] = useState(
    PURCHASING_POWER_ZONES?.map(z => ({
      ...z,
      adjustedPrices: SUBSCRIPTION_PLANS?.map(p => ({
        planId: p?.id,
        planName: p?.name,
        basePrice: p?.basePrice,
        adjustedPrice: (p?.basePrice * z?.baseMultiplier)?.toFixed(2),
        optimizedPrice: (p?.basePrice * z?.baseMultiplier * (0.95 + Math.random() * 0.1))?.toFixed(2),
      }))
    }))
  );
  const [optimizing, setOptimizing] = useState(false);
  const [lastOptimized, setLastOptimized] = useState(new Date());

  const totalRevenue = campaigns?.reduce((s, c) => s + c?.revenue, 0);
  const totalCost = campaigns?.reduce((s, c) => s + c?.cost, 0);
  const overallMargin = (((totalRevenue - totalCost) / totalRevenue) * 100)?.toFixed(1);
  const activeCampaigns = campaigns?.filter(c => !c?.paused)?.length;
  const pausedCampaigns = campaigns?.filter(c => c?.paused)?.length;

  const toggleCampaignPause = useCallback((id) => {
    setCampaigns(prev => prev?.map(c => c?.id === id ? { ...c, paused: !c?.paused, status: !c?.paused ? 'paused' : (c?.margin < 0 ? 'unprofitable' : c?.margin < marginThreshold ? 'at_risk' : 'active') } : c));
  }, [marginThreshold]);

  const runAutoProtection = useCallback(() => {
    setCampaigns(prev => prev?.map(c => ({
      ...c,
      paused: c?.margin < marginThreshold ? true : c?.paused,
      status: c?.margin < marginThreshold ? 'auto_paused' : c?.status
    })));
  }, [marginThreshold]);

  const runOptimization = useCallback(async () => {
    setOptimizing(true);
    await new Promise(r => setTimeout(r, 1800));
    setZonePricing(prev => prev?.map(z => ({
      ...z,
      adjustedPrices: z?.adjustedPrices?.map(p => ({
        ...p,
        optimizedPrice: (parseFloat(p?.adjustedPrice) * (0.93 + Math.random() * 0.14))?.toFixed(2)
      }))
    })));
    setLastOptimized(new Date());
    setOptimizing(false);
  }, []);

  useEffect(() => {
    if (autoProtectionEnabled) runAutoProtection();
  }, [autoProtectionEnabled, marginThreshold, runAutoProtection]);

  const getStatusBadge = (c) => {
    if (c?.paused || c?.status === 'auto_paused') return <span className="px-2 py-0.5 rounded text-xs bg-gray-700 text-gray-300">⏸ {c?.status === 'auto_paused' ? 'Auto-Paused' : 'Paused'}</span>;
    if (c?.status === 'unprofitable') return <span className="px-2 py-0.5 rounded text-xs bg-red-900/50 text-red-300">⚠ Unprofitable</span>;
    if (c?.status === 'at_risk') return <span className="px-2 py-0.5 rounded text-xs bg-yellow-900/50 text-yellow-300">⚡ At Risk</span>;
    return <span className="px-2 py-0.5 rounded text-xs bg-green-900/50 text-green-300">✓ Active</span>;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'campaigns', label: 'Campaign Manager', icon: Target },
    { id: 'abtesting', label: 'A/B Pricing Tests', icon: Zap },
    { id: 'zones', label: 'Zone Pricing', icon: Globe },
    { id: 'protection', label: 'Margin Protection', icon: Settings },
  ];

  return (
    <>
      <Helmet>
        <title>Real-Time Revenue Optimization Engine - Vottery</title>
        <meta name="description" content="Dynamic pricing adjustment algorithms, A/B subscription pricing across zones, auto-pause unprofitable campaigns with margin protection." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="w-7 h-7 text-green-400" />
                  Real-Time Revenue Optimization Engine
                </h1>
                <p className="text-muted-foreground mt-1">Dynamic pricing algorithms · A/B zone testing · Auto-pause margin protection</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Last optimized: {lastOptimized?.toLocaleTimeString()}</span>
                <button
                  onClick={runOptimization}
                  disabled={optimizing}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-60"
                >
                  <RefreshCw className={`w-4 h-4 ${optimizing ? 'animate-spin' : ''}`} />
                  {optimizing ? 'Optimizing...' : 'Run Optimization'}
                </button>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Revenue', value: `$${totalRevenue?.toLocaleString()}`, icon: DollarSign, color: 'text-green-400', sub: 'All campaigns' },
              { label: 'Overall Margin', value: `${overallMargin}%`, icon: TrendingUp, color: parseFloat(overallMargin) >= marginThreshold ? 'text-green-400' : 'text-red-400', sub: `Threshold: ${marginThreshold}%` },
              { label: 'Active Campaigns', value: activeCampaigns, icon: Play, color: 'text-blue-400', sub: `${pausedCampaigns} paused` },
              { label: 'Auto-Protection', value: autoProtectionEnabled ? 'ON' : 'OFF', icon: autoProtectionEnabled ? CheckCircle : AlertTriangle, color: autoProtectionEnabled ? 'text-green-400' : 'text-yellow-400', sub: `${marginThreshold}% min margin` },
            ]?.map((kpi, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{kpi?.label}</span>
                  <kpi.icon className={`w-4 h-4 ${kpi?.color}`} />
                </div>
                <p className={`text-2xl font-bold ${kpi?.color}`}>{kpi?.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{kpi?.sub}</p>
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

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-4">Revenue by Zone</h3>
                <div className="space-y-3">
                  {PURCHASING_POWER_ZONES?.map(z => {
                    const zCampaigns = campaigns?.filter(c => c?.zone === z?.name?.split(' - ')?.[0]);
                    const zRevenue = zCampaigns?.reduce((s, c) => s + c?.revenue, 0);
                    const pct = totalRevenue > 0 ? (zRevenue / totalRevenue * 100)?.toFixed(1) : 0;
                    return (
                      <div key={z?.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">{z?.name}</span>
                          <span className="text-foreground font-medium">${zRevenue?.toLocaleString()} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full">
                          <div className="h-2 bg-primary rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-4">Optimization Insights</h3>
                <div className="space-y-3">
                  {[
                    { icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-900/20', text: 'Zone 1 & 2 campaigns showing 4x+ ROAS — consider increasing budget allocation by 20%' },
                    { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-900/20', text: `${campaigns?.filter(c => c?.paused)?.length} campaigns auto-paused due to margin below ${marginThreshold}% threshold` },
                    { icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-900/20', text: 'A/B test in Zone 2 shows Variant B outperforming by 17.7% revenue — apply pricing update' },
                    { icon: Globe, color: 'text-blue-400', bg: 'bg-blue-900/20', text: 'Zone 5 pricing at $1.99 (Variant A) achieves 12.3% conversion — highest in Tier E regions' },
                  ]?.map((ins, i) => (
                    <div key={i} className={`flex gap-3 p-3 rounded-lg ${ins?.bg}`}>
                      <ins.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${ins?.color}`} />
                      <p className="text-sm text-foreground">{ins?.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'campaigns' && (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Campaign Margin Monitor</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">Auto-pause below {marginThreshold}% margin</span>
                  <button
                    onClick={runAutoProtection}
                    className="px-3 py-1.5 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700"
                  >
                    Run Auto-Protection
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      {['Campaign', 'Zone', 'Revenue', 'Cost', 'Margin', 'ROAS', 'Status', 'Action']?.map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns?.map(c => (
                      <tr key={c?.id} className={`border-b border-border/50 hover:bg-muted/20 ${c?.paused ? 'opacity-60' : ''}`}>
                        <td className="px-4 py-3 text-sm text-foreground font-medium">{c?.name}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{c?.zone}</td>
                        <td className="px-4 py-3 text-sm text-green-400">${c?.revenue?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-red-400">${c?.cost?.toLocaleString()}</td>
                        <td className={`px-4 py-3 text-sm font-bold ${c?.margin >= marginThreshold ? 'text-green-400' : c?.margin >= 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {c?.margin?.toFixed(1)}%
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">{c?.roas}x</td>
                        <td className="px-4 py-3">{getStatusBadge(c)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleCampaignPause(c?.id)}
                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                              c?.paused ? 'bg-green-900/30 text-green-300 hover:bg-green-900/50' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            {c?.paused ? <><Play className="w-3 h-3" /> Resume</> : <><Pause className="w-3 h-3" /> Pause</>}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'abtesting' && (
            <div className="space-y-4">
              {abTests?.map(test => (
                <div key={test?.id} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{test?.name}</h3>
                      <p className="text-sm text-muted-foreground">{test?.plan} Plan · {test?.zone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        test?.status === 'completed' ? 'bg-green-900/30 text-green-300' : 'bg-blue-900/30 text-blue-300'
                      }`}>
                        {test?.status === 'completed' ? '✓ Completed' : '⟳ Running'}
                      </span>
                      <span className="text-xs text-muted-foreground">Confidence: {test?.confidence}%</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {['A', 'B']?.map(variant => {
                      const price = test?.[`variant${variant}`];
                      const conversion = test?.[`conversion${variant}`];
                      const revenue = test?.[`revenue${variant}`];
                      const isWinner = test?.winner === variant;
                      return (
                        <div key={variant} className={`p-4 rounded-lg border ${
                          isWinner ? 'border-green-500/50 bg-green-900/10' : 'border-border bg-muted/20'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-foreground">Variant {variant}</span>
                            {isWinner && <span className="text-xs text-green-400 font-medium">🏆 Winner</span>}
                          </div>
                          <p className="text-2xl font-bold text-foreground mb-2">{price}</p>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Conversion</span>
                              <span className="text-foreground">{conversion}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Revenue</span>
                              <span className="text-green-400">${revenue?.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {test?.winner && (
                    <div className="mt-3 p-3 bg-green-900/20 rounded-lg flex items-center justify-between">
                      <span className="text-sm text-green-300">Variant {test?.winner} wins with {test?.confidence}% confidence — ready to deploy</span>
                      <button className="px-3 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700">Apply Pricing</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'zones' && (
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">Zone-Adjusted Subscription Pricing</h3>
                  <p className="text-sm text-muted-foreground mt-1">Prices adjusted by purchasing power index per zone</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Zone</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Region</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">PP Index</th>
                        {SUBSCRIPTION_PLANS?.map(p => (
                          <th key={p?.id} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">{p?.name} (Base ${p?.basePrice})</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {zonePricing?.map(z => (
                        <tr key={z?.id} className="border-b border-border/50 hover:bg-muted/20">
                          <td className="px-4 py-3 text-sm font-medium text-foreground">{z?.name}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{z?.region}</td>
                          <td className="px-4 py-3">
                            <span className={`text-sm font-bold ${
                              z?.ppIndex >= 80 ? 'text-green-400' : z?.ppIndex >= 50 ? 'text-yellow-400' : 'text-red-400'
                            }`}>{z?.ppIndex}</span>
                          </td>
                          {z?.adjustedPrices?.map(p => (
                            <td key={p?.planId} className="px-4 py-3">
                              <div className="text-sm">
                                <span className="text-foreground font-medium">${p?.optimizedPrice}</span>
                                <span className="text-muted-foreground text-xs ml-1">(adj: ${p?.adjustedPrice})</span>
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'protection' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-4">Margin Protection Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">Minimum Margin Threshold (%)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={marginThreshold}
                        onChange={e => setMarginThreshold(Number(e?.target?.value))}
                        className="flex-1"
                      />
                      <span className="text-foreground font-bold w-12 text-center">{marginThreshold}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Campaigns below this margin will be auto-paused</p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">Auto-Protection Engine</p>
                      <p className="text-xs text-muted-foreground">Automatically pause unprofitable campaigns</p>
                    </div>
                    <button
                      onClick={() => setAutoProtectionEnabled(p => !p)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        autoProtectionEnabled ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        autoProtectionEnabled ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-4">Protection Summary</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Campaigns Protected', value: campaigns?.filter(c => c?.paused)?.length, color: 'text-yellow-400' },
                    { label: 'Cost Saved (paused)', value: `$${campaigns?.filter(c => c?.paused)?.reduce((s, c) => s + c?.cost, 0)?.toLocaleString()}`, color: 'text-green-400' },
                    { label: 'Avg Margin (active)', value: `${(campaigns?.filter(c => !c?.paused)?.reduce((s, c) => s + c?.margin, 0) / Math.max(campaigns?.filter(c => !c?.paused)?.length, 1))?.toFixed(1)}%`, color: 'text-blue-400' },
                    { label: 'Protection Status', value: autoProtectionEnabled ? 'Active' : 'Disabled', color: autoProtectionEnabled ? 'text-green-400' : 'text-red-400' },
                  ]?.map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                      <span className="text-sm text-muted-foreground">{item?.label}</span>
                      <span className={`text-sm font-bold ${item?.color}`}>{item?.value}</span>
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
