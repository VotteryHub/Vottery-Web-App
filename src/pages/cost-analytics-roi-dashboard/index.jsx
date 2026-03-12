import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { DollarSign, Database, BarChart2, TrendingDown, Zap, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';

const SERVICE_COSTS = [
  { id: 'supabase', name: 'Supabase', monthly: 249, trend: -5.2, usage: 'DB, Auth, Realtime, Edge', costPerQuery: 0.00012 },
  { id: 'redis', name: 'Redis (Upstash/Cache)', monthly: 89, trend: 2.1, usage: 'Session, feed cache', costPerQuery: 0.00008 },
  { id: 'datadog', name: 'Datadog APM', monthly: 312, trend: 0, usage: 'APM, logs, synthetics', costPerQuery: null },
  { id: 'ai_proxy', name: 'AI Proxy (OpenAI/Claude/Perplexity)', monthly: 1840, trend: 8.4, usage: 'Queries, embeddings', costPerQuery: 0.0024 },
  { id: 'stripe', name: 'Stripe (fees)', monthly: 420, trend: -1.2, usage: 'Payments, subscriptions', costPerQuery: null },
  { id: 'resend', name: 'Resend', monthly: 45, trend: 0, usage: 'Transactional email', costPerQuery: null },
];

const CACHING_ROI = {
  queriesEliminatedPerDay: 2840000,
  estimatedCostPerQuery: 0.00015,
  savingsPerDay: 426,
  savingsPerMonth: 12780,
  cacheHitRate: 67.4,
  recommendation: 'Increase Redis TTL for feed ranking to 10m to save ~15% more without impacting freshness.',
};

const COST_OPTIMIZATION_RECOMMENDATIONS = [
  { id: 1, title: 'Extend feed cache TTL', impact: 'High', savings: '~$1,200/mo', effort: 'Low', status: 'pending' },
  { id: 2, title: 'Batch AI embedding calls', impact: 'High', savings: '~$800/mo', effort: 'Medium', status: 'pending' },
  { id: 3, title: 'Supabase connection pooling', impact: 'Medium', savings: '~$40/mo', effort: 'Low', status: 'done' },
  { id: 4, title: 'Datadog sampling for high-volume endpoints', impact: 'Medium', savings: '~$90/mo', effort: 'Low', status: 'pending' },
];

export default function CostAnalyticsROIDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [costs, setCosts] = useState(SERVICE_COSTS);
  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const totalMonthly = costs?.reduce((s, c) => s + c?.monthly, 0) || 0;
  const costPerQueryServices = costs?.filter(c => c?.costPerQuery != null) || [];
  const avgCostPerQuery = costPerQueryServices?.length
    ? (costPerQueryServices?.reduce((s, c) => s + c?.costPerQuery, 0) / costPerQueryServices?.length)?.toFixed(6)
    : '—';

  const refresh = useCallback(async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setCosts(prev => prev?.map(c => ({ ...c, monthly: Math.round(c?.monthly * (0.98 + Math.random() * 0.04)) })));
    setLastRefreshed(new Date());
    setLoading(false);
  }, []);

  return (
    <>
      <Helmet><title>Cost Analytics & ROI Dashboard | Vottery</title></Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />
        <div className="flex">
          <LeftSidebar />
          <main className="flex-1 min-w-0 lg:ml-64 xl:ml-72 pt-14">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">Cost Analytics & ROI Dashboard</h1>
                  <p className="text-muted-foreground mt-1">Infrastructure costs per service, cost-per-query, caching ROI, and optimization strategies</p>
                </div>
                <button onClick={refresh} disabled={loading} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg">
                  <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Refresh
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="card p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><DollarSign className="text-primary" size={20} /></div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Monthly Cost</p>
                      <p className="text-xl font-data font-bold text-foreground">${totalMonthly?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="card p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center"><TrendingDown className="text-success" size={20} /></div>
                    <div>
                      <p className="text-xs text-muted-foreground">Caching Savings (est.)</p>
                      <p className="text-xl font-data font-bold text-success">${CACHING_ROI?.savingsPerMonth?.toLocaleString()}/mo</p>
                    </div>
                  </div>
                </div>
                <div className="card p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center"><BarChart2 className="text-muted-foreground" size={20} /></div>
                    <div>
                      <p className="text-xs text-muted-foreground">Avg Cost per Query</p>
                      <p className="text-xl font-data font-bold text-foreground">${avgCostPerQuery}</p>
                    </div>
                  </div>
                </div>
                <div className="card p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Zap className="text-primary" size={20} /></div>
                    <div>
                      <p className="text-xs text-muted-foreground">Cache Hit Rate</p>
                      <p className="text-xl font-data font-bold text-foreground">{CACHING_ROI?.cacheHitRate}%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card p-6">
                  <h2 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Database size={20} /> Infrastructure Cost by Service
                  </h2>
                  <div className="space-y-3">
                    {costs?.map((s) => (
                      <div key={s?.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <p className="font-medium text-foreground">{s?.name}</p>
                          <p className="text-xs text-muted-foreground">{s?.usage}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-data font-semibold text-foreground">${s?.monthly?.toLocaleString()}/mo</p>
                          {s?.costPerQuery != null && <p className="text-xs text-muted-foreground">~${s?.costPerQuery?.toFixed(6)}/query</p>}
                          {s?.trend != null && <p className={`text-xs ${s?.trend >= 0 ? 'text-destructive' : 'text-success'}`}>{s?.trend >= 0 ? '+' : ''}{s?.trend}% vs last month</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-6">
                  <h2 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                    <TrendingDown size={20} /> ROI of Caching
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">Savings from eliminated queries (Redis + Supabase cache)</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between"><span className="text-muted-foreground">Queries eliminated/day</span><span className="font-data font-medium">{CACHING_ROI?.queriesEliminatedPerDay?.toLocaleString()}</span></li>
                    <li className="flex justify-between"><span className="text-muted-foreground">Est. cost per query</span><span className="font-data font-medium">${CACHING_ROI?.estimatedCostPerQuery}</span></li>
                    <li className="flex justify-between"><span className="text-muted-foreground">Savings/day</span><span className="font-data font-medium text-success">${CACHING_ROI?.savingsPerDay}</span></li>
                    <li className="flex justify-between"><span className="text-muted-foreground">Savings/month</span><span className="font-data font-bold text-success">${CACHING_ROI?.savingsPerMonth?.toLocaleString()}</span></li>
                  </ul>
                  <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <p className="text-sm text-foreground"><strong>Recommendation:</strong> {CACHING_ROI?.recommendation}</p>
                  </div>
                </div>
              </div>

              <div className="card p-6 mt-6">
                <h2 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                  <AlertCircle size={20} /> Cost Optimization Strategies
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 font-medium text-muted-foreground">Recommendation</th>
                        <th className="text-left py-2 font-medium text-muted-foreground">Impact</th>
                        <th className="text-left py-2 font-medium text-muted-foreground">Est. Savings</th>
                        <th className="text-left py-2 font-medium text-muted-foreground">Effort</th>
                        <th className="text-left py-2 font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {COST_OPTIMIZATION_RECOMMENDATIONS?.map((r) => (
                        <tr key={r?.id} className="border-b border-border/50">
                          <td className="py-3 text-foreground">{r?.title}</td>
                          <td className="py-3 text-muted-foreground">{r?.impact}</td>
                          <td className="py-3 font-data text-success">{r?.savings}</td>
                          <td className="py-3 text-muted-foreground">{r?.effort}</td>
                          <td className="py-3">
                            {r?.status === 'done' ? <span className="flex items-center gap-1 text-success"><CheckCircle size={14} /> Done</span> : <span className="text-muted-foreground">Pending</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-4">Last refreshed: {lastRefreshed?.toLocaleString()}</p>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
