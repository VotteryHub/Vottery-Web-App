/**
 * Admin Screen 4: Unified Revenue Intelligence
 * Route: /admin/revenue-intelligence
 * Role: admin only
 */
import React, { useState, useEffect } from 'react';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import { supabase } from '../../lib/supabase';

const STREAMS = [
  { key: 'subscriptions',   label: 'Subscriptions',       icon: 'CreditCard',   color: '#3b82f6',  current: 42800,  prev: 38200, target: 50000 },
  { key: 'election_fees',   label: 'Election Fees',       icon: 'Vote',         color: '#8b5cf6',  current: 28300,  prev: 24100, target: 32000 },
  { key: 'ads',             label: 'Ad Revenue',          icon: 'Megaphone',    color: '#10b981',  current: 19700,  prev: 16800, target: 25000 },
  { key: 'gamification',    label: 'Gamification Prizes', icon: 'Trophy',       color: '#f59e0b',  current: 8400,   prev: 9200,  target: 10000 },
  { key: 'creator_payouts', label: 'Creator Payouts',     icon: 'DollarSign',   color: '#ef4444',  current: -14200, prev: -11800, target: -12000 },
];

const TREND_DATA = [
  { month: 'Oct', subscriptions: 31200, election_fees: 18900, ads: 12300, gamification: 7100 },
  { month: 'Nov', subscriptions: 33800, election_fees: 20100, ads: 13800, gamification: 7400 },
  { month: 'Dec', subscriptions: 38200, election_fees: 22400, ads: 15200, gamification: 8100 },
  { month: 'Jan', subscriptions: 36100, election_fees: 21800, ads: 14900, gamification: 7800 },
  { month: 'Feb', subscriptions: 40300, election_fees: 24800, ads: 17200, gamification: 8300 },
  { month: 'Mar', subscriptions: 38200, election_fees: 24100, ads: 16800, gamification: 9200 },
  { month: 'Apr', subscriptions: 42800, election_fees: 28300, ads: 19700, gamification: 8400 },
];

function ProgressBar({ value, max, color }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(255,255,255,0.1)]" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function MultiBarChart({ data }) {
  const keys = ['subscriptions', 'election_fees', 'ads', 'gamification'];
  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];
  const maxVal = Math.max(...data.flatMap(d => keys.map(k => d[k])));

  return (
    <div className="flex items-end gap-6 h-48">
      {data.map((d, i) => (
        <div key={d.month} className="flex-1 flex flex-col items-center gap-3 group/bar">
          <div className="w-full flex items-end gap-1" style={{ height: '140px' }}>
            {keys.map((k, j) => (
              <div key={k} className="flex-1 rounded-t-md transition-all duration-700 hover:brightness-125 shadow-lg"
                style={{ 
                  height: `${Math.round((d[k] / maxVal) * 140)}px`, 
                  background: `linear-gradient(to top, ${colors[j]}20, ${colors[j]})` 
                }} 
                title={`${k}: $${d[k].toLocaleString()}`}
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

const UnifiedRevenueIntelligence = () => {
  const [loading, setLoading] = useState(true);
  const [streams, setStreams] = useState(STREAMS);
  const [trend] = useState(TREND_DATA);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase?.from('revenue_analytics')?.select('stream, current_month, previous_month, target')?.limit(10);
        if (data?.length) {
          setStreams(STREAMS.map(s => {
            const row = data.find(r => r.stream === s.key);
            return row ? { ...s, current: row.current_month, prev: row.previous_month, target: row.target } : s;
          }));
        }
      } catch { /* use mock */ }
      setLoading(false);
    })();
  }, []);

  const totalRevenue = streams.filter(s => s.current > 0).reduce((a, b) => a + b.current, 0);
  const totalPrev    = streams.filter(s => s.prev > 0).reduce((a, b) => a + b.prev, 0);
  const totalChange  = ((totalRevenue - totalPrev) / totalPrev * 100).toFixed(1);
  const totalPayouts = Math.abs(streams.find(s => s.key === 'creator_payouts')?.current || 0);
  const netRevenue   = totalRevenue - totalPayouts;

  return (
    <GeneralPageLayout title="Revenue Intelligence" showSidebar={true}>
      <div className="w-full py-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center border border-green-500/20 shadow-xl">
              <Icon name="DollarSign" size={28} className="text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">Financial Intelligence</h1>
              <p className="text-slate-500 font-medium text-sm mt-1">Cross-platform revenue analytics & forecasting</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-900/40 backdrop-blur-xl p-3 rounded-2xl border border-white/5 shadow-2xl">
            <div className="hidden md:block px-4">
              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Growth Projection</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-24 bg-white/5 h-1 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-[82%]" />
                </div>
                <span className="text-[10px] text-white font-mono">+8.2%</span>
              </div>
            </div>
            <button className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-all">
              <Icon name="RefreshCw" size={16} />
            </button>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Gross Revenue', value: `$${totalRevenue.toLocaleString()}`, sub: `${totalChange > 0 ? '+' : ''}${totalChange}% vs last month`, color: '#10b981', icon: 'TrendingUp' },
            { label: 'Net Revenue',         value: `$${netRevenue.toLocaleString()}`,   sub: 'After creator payouts',          color: '#3b82f6', icon: 'DollarSign' },
            { label: 'Creator Payouts',     value: `$${totalPayouts.toLocaleString()}`, sub: 'Paid to creators this month',    color: '#f97316', icon: 'ArrowUpRight' },
            { label: 'Forecast (30d)',       value: `$${Math.round(totalRevenue * 1.08).toLocaleString()}`, sub: '+8% projected growth', color: '#8b5cf6', icon: 'BarChart3' },
          ].map(kpi => (
            <div key={kpi.label} className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-110" />
              <div className="flex items-center justify-between mb-4 relative z-10">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{kpi.label}</p>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg" style={{ background: `${kpi.color}15`, border: `1px solid ${kpi.color}30` }}>
                  <Icon name={kpi.icon} size={15} color={kpi.color} />
                </div>
              </div>
              <p className="text-2xl font-black text-white relative z-10 font-mono tracking-tight">{kpi.value}</p>
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-2 relative z-10">{kpi.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-10 mb-12">
          {/* Revenue Streams */}
          <div className="xl:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl h-fit">
            <div className="p-8 border-b border-white/5">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Revenue by Stream</h3>
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">This month performance vs target</p>
            </div>
            <div className="p-8 space-y-8">
              {streams.filter(s => s.current > 0).map(s => {
                const change = ((s.current - s.prev) / s.prev * 100).toFixed(1);
                const isUp = s.current >= s.prev;
                return (
                  <div key={s.key} className="group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform shadow-lg" style={{ background: `${s.color}20` }}>
                          <Icon name={s.icon} size={14} color={s.color} />
                        </div>
                        <span className="text-[11px] font-black text-white uppercase tracking-widest">{s.label}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-[10px] font-black font-mono ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                          {isUp ? '▲' : '▼'} {Math.abs(change)}%
                        </span>
                        <span className="text-sm font-black text-white font-mono">${s.current.toLocaleString()}</span>
                      </div>
                    </div>
                    <ProgressBar value={s.current} max={s.target} color={s.color} />
                    <div className="flex justify-between mt-2">
                      <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">${s.prev.toLocaleString()} last month</span>
                      <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Target: ${s.target.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 6-Month Trend */}
          <div className="xl:col-span-3 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Historical Revenue Velocity</h3>
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Aggregate performance over 6 months</p>
              </div>
              <div className="flex items-center gap-6 flex-wrap">
                {[
                  { label: 'Subs', color: '#3b82f6' },
                  { label: 'Election', color: '#8b5cf6' },
                  { label: 'Ads',    color: '#10b981' },
                  { label: 'Games', color: '#f59e0b' },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ background: l.color }} />
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <MultiBarChart data={trend} />
          </div>
        </div>

        {/* Monthly breakdown table */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ledger Snapshot</h3>
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1">Detailed monthly cross-stream performance</p>
          </div>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/20 border-b border-white/5">
                  {['Month', 'Subscriptions', 'Election Fees', 'Ad Revenue', 'Gamification', 'Total'].map(h => (
                    <th key={h} className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {trend.map((row, i) => {
                  const total = row.subscriptions + row.election_fees + row.ads + row.gamification;
                  return (
                    <tr key={row.month} className={`hover:bg-white/5 transition-all duration-300 ${i === trend.length - 1 ? 'bg-indigo-500/10' : ''}`}>
                      <td className="px-8 py-5 text-sm font-black text-white uppercase tracking-tight">{row.month}{i === trend.length - 1 ? ' (curr)' : ''}</td>
                      <td className="px-8 py-5 text-sm font-black text-slate-400 font-mono tracking-tighter">${row.subscriptions.toLocaleString()}</td>
                      <td className="px-8 py-5 text-sm font-black text-slate-400 font-mono tracking-tighter">${row.election_fees.toLocaleString()}</td>
                      <td className="px-8 py-5 text-sm font-black text-slate-400 font-mono tracking-tighter">${row.ads.toLocaleString()}</td>
                      <td className="px-8 py-5 text-sm font-black text-slate-400 font-mono tracking-tighter">${row.gamification.toLocaleString()}</td>
                      <td className="px-8 py-5 text-sm font-black text-white font-mono tracking-tight">${total.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default UnifiedRevenueIntelligence;
