/**
 * Admin Screen 5: Social Activity Analytics Dashboard
 * Route: /admin/social-activity-analytics
 * Role: admin only
 */
import React, { useState, useEffect } from 'react';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import { supabase } from '../../lib/supabase';

const MOCK_DAILY = [
  { date: 'Apr 11', posts: 3420, likes: 28400, comments: 8900, shares: 2100, follows: 1840, dau: 11200 },
  { date: 'Apr 12', posts: 3810, likes: 31200, comments: 9700, shares: 2380, follows: 2010, dau: 12100 },
  { date: 'Apr 13', posts: 3580, likes: 29800, comments: 9100, shares: 2200, follows: 1920, dau: 11800 },
  { date: 'Apr 14', posts: 4120, likes: 34500, comments: 10800, shares: 2560, follows: 2190, dau: 12900 },
  { date: 'Apr 15', posts: 4380, likes: 36800, comments: 11400, shares: 2740, follows: 2310, dau: 13400 },
  { date: 'Apr 16', posts: 4100, likes: 34100, comments: 10600, shares: 2600, follows: 2180, dau: 12800 },
  { date: 'Apr 17', posts: 3690, likes: 30400, comments: 9400, shares: 2290, follows: 1980, dau: 11600 },
];

const MAU_DATA = [
  { month: 'Jan', mau: 42000, dau: 9800 },
  { month: 'Feb', mau: 46000, dau: 10900 },
  { month: 'Mar', mau: 51000, dau: 12100 },
  { month: 'Apr', mau: 54800, dau: 13400 },
];

const ACTIONS = [
  { key: 'posts',    label: 'Posts',    icon: 'FileText',  color: '#3b82f6' },
  { key: 'likes',    label: 'Likes',    icon: 'Heart',     color: '#ef4444' },
  { key: 'comments', label: 'Comments', icon: 'MessageCircle', color: '#10b981' },
  { key: 'shares',   label: 'Shares',   icon: 'Share2',    color: '#8b5cf6' },
  { key: 'follows',  label: 'Follows',  icon: 'UserPlus',  color: '#f59e0b' },
];

function SparkLine({ data, color }) {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80, h = 32;
  const pts = data.map((v, i) => [
    Math.round((i / (data.length - 1)) * w),
    Math.round(h - ((v - min) / range) * (h - 8) - 4),
  ]);
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
  return (
    <div className="relative group/spark">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
        <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" 
          className="drop-shadow-[0_0_4px_rgba(255,255,255,0.1)] transition-all duration-500" />
      </svg>
    </div>
  );
}

function LineChart({ data, keys, colors }) {
  const w = 100, h = 60;
  const allVals = data.flatMap(d => keys.map(k => d[k]));
  const max = Math.max(...allVals);
  const getPath = (key) => data.map((d, i) => {
    const x = Math.round((i / (data.length - 1)) * w);
    const y = Math.round(h - (d[key] / max) * (h - 10) - 5);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-48 overflow-visible" preserveAspectRatio="none">
        {/* Background Grid */}
        {[0, 1, 2, 3].map(i => (
          <line key={i} x1="0" y1={(i / 3) * h} x2={w} y2={(i / 3) * h} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
        ))}
        {keys.map((k, i) => (
          <path key={k} d={getPath(k)} fill="none" stroke={colors[i]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
            className="drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] opacity-80 hover:opacity-100 transition-opacity duration-300" />
        ))}
      </svg>
      <div className="flex justify-between mt-6 px-2">
        {data.map(d => <span key={d.date} className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">{d.date}</span>)}
      </div>
    </div>
  );
}

const SocialActivityAnalyticsDashboard = () => {
  const [data] = useState(MOCK_DAILY);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('dau');

  useEffect(() => {
    setTimeout(() => setLoading(false), 600);
  }, []);

  const today = data[data.length - 1];
  const yesterday = data[data.length - 2];
  const totals7d = ACTIONS.reduce((acc, a) => {
    acc[a.key] = data.reduce((s, d) => s + d[a.key], 0);
    return acc;
  }, {});

  const dauData = data.map(d => d.dau);
  const mauCurrent = MAU_DATA[MAU_DATA.length - 1].mau;
  const dauRatio = ((today.dau / mauCurrent) * 100).toFixed(1);

  return (
    <GeneralPageLayout title="Social Intelligence" showSidebar={true}>
      <div className="w-full py-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 shadow-xl">
              <Icon name="Activity" size={28} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">Social Intelligence</h1>
              <p className="text-slate-500 font-medium text-sm mt-1">Cross-platform engagement & interaction metrics</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-900/40 backdrop-blur-xl p-3 rounded-2xl border border-white/5 shadow-2xl">
            <div className="hidden md:block px-4">
              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Active Retention</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-24 bg-white/5 h-1 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[24%]" />
                </div>
                <span className="text-[10px] text-white font-mono">{dauRatio}%</span>
              </div>
            </div>
            <button className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-all">
              <Icon name="RefreshCw" size={16} />
            </button>
          </div>
        </div>

        {/* DAU / MAU Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'DAU (Today)',    value: today.dau.toLocaleString(),   sub: `${((today.dau - yesterday.dau) / yesterday.dau * 100).toFixed(1)}% vs yesterday`, color: '#3b82f6', icon: 'Users' },
            { label: 'MAU (Apr)',      value: mauCurrent.toLocaleString(),  sub: '+7.4% vs March',    color: '#8b5cf6', icon: 'UserCheck' },
            { label: 'DAU/MAU Ratio', value: `${dauRatio}%`,               sub: 'Engagement depth',  color: '#10b981', icon: 'TrendingUp' },
            { label: 'Social Actions', value: (today.posts + today.likes + today.comments + today.shares + today.follows).toLocaleString(), sub: 'Total interactions', color: '#f59e0b', icon: 'Heart' },
          ].map(kpi => (
            <div key={kpi.label} className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-110" />
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: `${kpi.color}15`, border: `1px solid ${kpi.color}30` }}>
                  <Icon name={kpi.icon} size={18} color={kpi.color} />
                </div>
                <SparkLine data={kpi.label === 'DAU (Today)' ? dauData : []} color={kpi.color} />
              </div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest relative z-10">{kpi.label}</p>
              <p className="text-2xl font-black text-white mt-1 relative z-10 font-mono tracking-tight">{kpi.value}</p>
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-2 relative z-10">{kpi.sub}</p>
            </div>
          ))}
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
          {ACTIONS.map(action => {
            const todayVal = today[action.key];
            const yesterdayVal = yesterday[action.key];
            const change = ((todayVal - yesterdayVal) / yesterdayVal * 100).toFixed(1);
            const isUp = todayVal >= yesterdayVal;
            const sparkData = data.map(d => d[action.key]);
            return (
              <div key={action.key} className={`bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl hover:bg-white/5 transition-all cursor-pointer group ${selectedMetric === action.key ? 'ring-2 ring-indigo-500 shadow-indigo-500/20' : ''}`}
                onClick={() => setSelectedMetric(action.key)}>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform shadow-lg" style={{ background: `${action.color}20` }}>
                    <Icon name={action.icon} size={16} color={action.color} />
                  </div>
                  <span className={`text-[10px] font-black font-mono ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                    {isUp ? '▲' : '▼'} {Math.abs(change)}%
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{action.label}</p>
                <p className="text-xl font-black text-white mt-1 font-mono tracking-tight">{todayVal.toLocaleString()}</p>
                <div className="mt-6">
                  <SparkLine data={sparkData} color={action.color} />
                </div>
                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-4">7d Vol: <span className="text-white font-mono">{totals7d[action.key].toLocaleString()}</span></p>
              </div>
            );
          })}
        </div>

        {/* 7-Day Trend Chart */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
            <div>
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Engagement Velocity Trends</h3>
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Aggregate daily interaction volume</p>
            </div>
            <div className="flex items-center gap-6 flex-wrap">
              {ACTIONS.map(a => (
                <div key={a.key} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ background: a.color }} />
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{a.label}</span>
                </div>
              ))}
            </div>
          </div>
          <LineChart data={data} keys={ACTIONS.map(a => a.key)} colors={ACTIONS.map(a => a.color)} />
        </div>

        {/* Daily breakdown table */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 bg-black/20">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Engagement Ledger</h3>
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1">Cross-metric performance history</p>
          </div>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/20 border-b border-white/5">
                  {['Date', 'DAU', 'Posts', 'Likes', 'Comments', 'Shares', 'Follows'].map(h => (
                    <th key={h} className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[...data].reverse().map((row, i) => (
                  <tr key={row.date} className={`hover:bg-white/5 transition-all duration-300 ${i === 0 ? 'bg-indigo-500/10' : ''}`}>
                    <td className="px-8 py-5 text-sm font-black text-white uppercase tracking-tight">{row.date}{i === 0 ? ' (curr)' : ''}</td>
                    <td className="px-8 py-5 text-sm font-black text-slate-400 font-mono tracking-tighter">{row.dau.toLocaleString()}</td>
                    <td className="px-8 py-5 text-sm font-black text-slate-400 font-mono tracking-tighter">{row.posts.toLocaleString()}</td>
                    <td className="px-8 py-5 text-sm font-black text-slate-400 font-mono tracking-tighter">{row.likes.toLocaleString()}</td>
                    <td className="px-8 py-5 text-sm font-black text-slate-400 font-mono tracking-tighter">{row.comments.toLocaleString()}</td>
                    <td className="px-8 py-5 text-sm font-black text-slate-400 font-mono tracking-tighter">{row.shares.toLocaleString()}</td>
                    <td className="px-8 py-5 text-sm font-black text-slate-400 font-mono tracking-tighter">{row.follows.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default SocialActivityAnalyticsDashboard;
