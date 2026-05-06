/**
 * Admin Screen 3: Notification Intelligence Hub
 * Route: /admin/notification-intelligence
 * Role: admin only
 */
import React, { useState, useEffect } from 'react';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import { supabase } from '../../lib/supabase';

const MOCK_DATA = {
  summary: { sent: 284720, delivered: 271350, opened: 108540, optOuts: 3210, deliveryRate: 95.3, openRate: 40.0, optOutRate: 1.2 },
  byChannel: [
    { channel: 'Push', sent: 142360, delivered: 139480, opened: 72130, deliveryRate: 97.9, openRate: 51.7, optOuts: 890, icon: 'Smartphone', color: '#3b82f6' },
    { channel: 'Email', sent: 98450, delivered: 91560, opened: 29800, deliveryRate: 93.0, openRate: 32.5, optOuts: 1840, icon: 'Mail', color: '#8b5cf6' },
    { channel: 'SMS', sent: 43910, delivered: 40310, opened: 6610, deliveryRate: 91.8, openRate: 16.4, optOuts: 480, icon: 'MessageSquare', color: '#10b981' },
  ],
  trend: [
    { date: 'Apr 11', sent: 38200, opened: 14800 },
    { date: 'Apr 12', sent: 41500, opened: 16200 },
    { date: 'Apr 13', sent: 39800, opened: 15600 },
    { date: 'Apr 14', sent: 44100, opened: 17900 },
    { date: 'Apr 15', sent: 46300, opened: 18400 },
    { date: 'Apr 16', sent: 42900, opened: 17100 },
    { date: 'Apr 17', sent: 31920, opened: 12540 },
  ],
  topCategories: [
    { name: 'Election Updates', sent: 98200, openRate: 52.3 },
    { name: 'VP Rewards Earned', sent: 72400, openRate: 65.1 },
    { name: 'New Election Near You', sent: 54300, openRate: 38.7 },
    { name: 'Winner Announcement', sent: 38900, openRate: 71.4 },
    { name: 'Account Security', sent: 21020, openRate: 82.3 },
  ],
};

function BarChart({ data, maxVal, color = '#3b82f6' }) {
  return (
    <div className="flex items-end gap-3 h-32">
      {data.map((d, i) => {
        const height = Math.max(8, Math.round((d.value / maxVal) * 128));
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar" title={`${d.label}: ${d.value.toLocaleString()}`}>
            <div className="relative w-full flex items-end justify-center">
               <div
                className="w-full rounded-t-lg transition-all duration-700 bg-gradient-to-t group-hover/bar:brightness-125 shadow-lg"
                style={{ 
                  height: `${height}px`, 
                  from: `${color}40`, 
                  to: color,
                  background: `linear-gradient(to top, ${color}20, ${color})` 
                }}
              />
            </div>
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-tighter rotate-0">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function RateRing({ rate, color, label }) {
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (rate / 100) * circumference;
  return (
    <div className="flex flex-col items-center group">
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 44 44" className="w-20 h-20 -rotate-90">
          <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
          <circle cx="22" cy="22" r="18" fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" className="transition-all duration-1000 drop-shadow-[0_0_8px_rgba(59,130,241,0.3)]" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-white font-mono">
          {rate}%
        </span>
      </div>
      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-3 group-hover:text-white transition-colors">{label}</p>
    </div>
  );
}

const NotificationIntelligenceHub = () => {
  const [data, setData] = useState(MOCK_DATA);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState('all');

  useEffect(() => {
    (async () => {
      try {
        const { data: rows } = await supabase?.from('notification_analytics')?.select('*')?.single();
        if (rows) setData(prev => ({ ...prev, summary: rows }));
      } catch { /* use mock */ }
      setLoading(false);
    })();
  }, []);

  const trendChartData = data.trend.map(d => ({ label: d.date, value: d.opened }));
  const maxTrend = Math.max(...trendChartData.map(d => d.value));

  const channel = selectedChannel === 'all' ? null : data.byChannel.find(c => c.channel === selectedChannel);
  const displaySummary = channel ? {
    sent: channel.sent, delivered: channel.delivered, opened: channel.opened,
    deliveryRate: channel.deliveryRate, openRate: channel.openRate, optOuts: channel.optOuts,
    optOutRate: ((channel.optOuts / channel.sent) * 100).toFixed(1),
  } : data.summary;

  return (
    <GeneralPageLayout title="Notification Intelligence" showSidebar={true}>
      <div className="w-full py-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-xl">
              <Icon name="Bell" size={28} className="text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">Notification Analytics</h1>
              <p className="text-slate-500 font-medium text-sm mt-1">Cross-channel delivery & engagement metrics</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-900/40 backdrop-blur-xl p-3 rounded-2xl border border-white/5 shadow-2xl">
            <div className="hidden md:block px-4">
              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Global Delivery Rate</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-24 bg-white/5 h-1 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[95%]" />
                </div>
                <span className="text-[10px] text-white font-mono">95.3%</span>
              </div>
            </div>
            <button className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-all">
              <Icon name="RefreshCw" size={16} />
            </button>
          </div>
        </div>

        {/* Channel selector */}
        <div className="flex gap-2 mb-10 flex-wrap p-1 bg-black/20 rounded-2xl border border-white/5 w-fit">
          <button onClick={() => setSelectedChannel('all')}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${selectedChannel === 'all' ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>
            All Channels
          </button>
          {data.byChannel.map(ch => (
            <button key={ch.channel} onClick={() => setSelectedChannel(ch.channel)}
              className={`flex items-center gap-2.5 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${selectedChannel === ch.channel ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>
              <Icon name={ch.icon} size={14} /> {ch.channel}
            </button>
          ))}
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Sent',      value: displaySummary.sent?.toLocaleString(),      icon: 'Send',          color: '#3b82f6' },
            { label: 'Delivered',       value: displaySummary.delivered?.toLocaleString(), icon: 'CheckCircle',   color: '#10b981' },
            { label: 'Opened',          value: displaySummary.opened?.toLocaleString(),    icon: 'Eye',           color: '#8b5cf6' },
            { label: 'Opt-Outs',        value: displaySummary.optOuts?.toLocaleString(),   icon: 'BellOff',       color: '#f97316' },
          ].map(kpi => (
            <div key={kpi.label} className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-110" />
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: `${kpi.color}15`, border: `1px solid ${kpi.color}30` }}>
                  <Icon name={kpi.icon} size={20} color={kpi.color} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{kpi.label}</p>
                  <p className="text-2xl font-black text-white mt-1 font-mono tracking-tight">{kpi.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
          {/* Rate Rings */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10">Rate Summary</h3>
            <div className="flex justify-around items-center">
              <RateRing rate={displaySummary.deliveryRate} color="#10b981" label="Delivery" />
              <RateRing rate={displaySummary.openRate}     color="#3b82f6" label="Open" />
              <RateRing rate={parseFloat(displaySummary.optOutRate)} color="#f97316" label="Opt-Out" />
            </div>
          </div>

          {/* 7-Day Trend */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl lg:col-span-2">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">7-Day Engagement Trend</h3>
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Notifications opened per day</p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,241,0.5)]" />
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Opens</span>
                 </div>
              </div>
            </div>
            <BarChart data={trendChartData} maxVal={maxTrend} color="#3b82f6" />
          </div>
        </div>

        {/* Per-channel breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {data.byChannel.map(ch => (
            <div key={ch.channel} className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl relative group overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-all group-hover:scale-110" />
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/5" style={{ background: `${ch.color}15` }}>
                  <Icon name={ch.icon} size={18} color={ch.color} />
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">{ch.channel}</h3>
              </div>
              <div className="space-y-4 relative z-10">
                {[
                  { label: 'Sent', value: ch.sent.toLocaleString() },
                  { label: 'Delivery Rate', value: `${ch.deliveryRate}%` },
                  { label: 'Open Rate', value: `${ch.openRate}%` },
                  { label: 'Opt-Outs', value: ch.optOuts.toLocaleString() },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{row.label}</span>
                    <span className="text-sm font-black text-white font-mono">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Open Efficiency</span>
                  <span className="text-[10px] text-white font-mono font-black">{ch.openRate}%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full shadow-[0_0_8px_rgba(59,130,241,0.3)] transition-all duration-1000" style={{ width: `${ch.openRate}%`, background: ch.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Top notification categories */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Engagement Leaderboard</h3>
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1">Highest performing notification categories</p>
          </div>
          <div className="divide-y divide-white/5">
            {data.topCategories.sort((a, b) => b.openRate - a.openRate).map((cat, i) => (
              <div key={cat.name} className="flex items-center gap-8 p-8 hover:bg-white/5 transition-all duration-300">
                <span className="text-lg font-black text-slate-700 font-mono w-8">{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm font-black text-white uppercase tracking-tight">{cat.name}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{cat.sent.toLocaleString()} notifications dispatched</p>
                </div>
                <div className="text-right hidden md:block">
                  <p className="text-lg font-black text-white font-mono">{cat.openRate}%</p>
                  <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">open conversion</p>
                </div>
                <div className="w-32 hidden lg:block">
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,241,0.4)]" style={{ width: `${cat.openRate}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default NotificationIntelligenceHub;
