/**
 * Admin Screen 2: Advanced Fraud Detection Center
 * Route: /admin/fraud-detection-center
 * Role: admin only
 */
import React, { useState, useEffect, useCallback } from 'react';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import { supabase } from '../../lib/supabase';

const MOCK_SIGNALS = [
  { id: '1', signal_type: 'multi_account', user_id: 'usr_aXq9', display_name: 'John D.', email: 'john.d@tempmail.com', risk_score: 94, details: '4 accounts detected from same device fingerprint and IP range 192.168.x.x', created_at: new Date(Date.now() - 1800000).toISOString(), status: 'open' },
  { id: '2', signal_type: 'vote_stuffing', user_id: 'usr_bR7k', display_name: 'Sarah K.', email: 'sarah.k@mail.net', risk_score: 88, details: '23 votes cast in 4 seconds across the same election. Device: Mobile Safari.', created_at: new Date(Date.now() - 3600000).toISOString(), status: 'open' },
  { id: '3', signal_type: 'account_takeover', user_id: 'usr_cM3p', display_name: 'Michael T.', email: 'm.t@gmail.com', risk_score: 76, details: 'Login from 3 different countries within 2 hours. New device fingerprint.', created_at: new Date(Date.now() - 7200000).toISOString(), status: 'under_review' },
  { id: '4', signal_type: 'coordinated_behavior', user_id: 'usr_dY5n', display_name: 'Group of 12', email: '—', risk_score: 91, details: '12 accounts created within 30 min, same ISP, all voted identically across 5 elections.', created_at: new Date(Date.now() - 10800000).toISOString(), status: 'open' },
  { id: '5', signal_type: 'payment_fraud', user_id: 'usr_eZ2f', display_name: 'Alice M.', email: 'alice.m@proton.me', risk_score: 65, details: 'Chargeback filed after purchasing 500 VP tokens. Card used from VPN IP.', created_at: new Date(Date.now() - 86400000).toISOString(), status: 'banned' },
  { id: '6', signal_type: 'multi_account', user_id: 'usr_fL8v', display_name: 'Creator X', email: 'creator.x@example.com', risk_score: 55, details: 'Two accounts with overlapping creator activity. May be legitimate shared device.', created_at: new Date(Date.now() - 172800000).toISOString(), status: 'dismissed' },
];

const SIGNAL_LABELS = {
  multi_account:        { label: 'Multi-Account',       icon: 'Users',          color: '#ef4444' },
  vote_stuffing:        { label: 'Vote Stuffing',        icon: 'Vote',           color: '#f97316' },
  account_takeover:     { label: 'Account Takeover',    icon: 'UserX',          color: '#8b5cf6' },
  coordinated_behavior: { label: 'Coordinated Behavior', icon: 'Network',       color: '#dc2626' },
  payment_fraud:        { label: 'Payment Fraud',        icon: 'CreditCard',     color: '#ca8a04' },
};

const STATUS_BADGE = {
  open:         { label: 'Open',         cls: 'bg-red-500/10 text-red-500 border-red-500/20' },
  under_review: { label: 'Under Review', cls: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  banned:       { label: 'Banned',       cls: 'bg-slate-800 text-slate-400 border-white/5' },
  warned:       { label: 'Warned',       cls: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  dismissed:    { label: 'Dismissed',    cls: 'bg-white/5 text-slate-500 border-white/5' },
};

function RiskBadge({ score }) {
  const color = score >= 80 ? '#ef4444' : score >= 60 ? '#f97316' : '#22c55e';
  return (
    <div className="flex items-center gap-1.5">
      <div className="relative w-12 h-12">
        <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
          <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
          <circle cx="18" cy="18" r="15" fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${(score / 100) * 94.2} 94.2`}
            strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black font-mono" style={{ color }}>
          {score}
        </span>
      </div>
    </div>
  );
}

function SignalRow({ signal, onAction }) {
  const type = SIGNAL_LABELS[signal.signal_type] || { label: signal.signal_type, icon: 'AlertTriangle', color: '#6b7280' };
  const badge = STATUS_BADGE[signal.status] || { label: signal.status, cls: 'bg-white/5 text-slate-500' };
  const elapsed = Math.round((Date.now() - new Date(signal.created_at).getTime()) / 60000);
  const timeLabel = elapsed < 60 ? `${elapsed}m ago` : elapsed < 1440 ? `${Math.round(elapsed / 60)}h ago` : `${Math.round(elapsed / 1440)}d ago`;

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 group">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <RiskBadge score={signal.risk_score} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center border border-white/5" style={{ background: `${type.color}20` }}>
              <Icon name={type.icon} size={14} color={type.color} />
            </div>
            <span className="text-[11px] font-black text-white uppercase tracking-widest">{type.label}</span>
            <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border border-white/5 ${badge.cls} uppercase tracking-widest`}>{badge.label}</span>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest ml-auto">{timeLabel}</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              User: <span className="text-white">{signal.display_name}</span>
            </p>
            <code className="text-[9px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">{signal.user_id}</code>
            {signal.email !== '—' && <span className="text-[10px] text-slate-600 font-medium">{signal.email}</span>}
          </div>
          <p className="text-sm text-slate-300 font-medium leading-relaxed">{signal.details}</p>
        </div>

        {['open', 'under_review'].includes(signal.status) && (
          <div className="flex flex-row md:flex-col gap-2 flex-shrink-0">
            <button onClick={() => onAction(signal.id, 'banned')}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl border border-red-500/20 transition-all flex-1">
              <Icon name="Ban" size={12} /> Ban
            </button>
            <button onClick={() => onAction(signal.id, 'warned')}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest rounded-xl border border-amber-500/20 transition-all flex-1">
              <Icon name="AlertTriangle" size={12} /> Warn
            </button>
            <button onClick={() => onAction(signal.id, 'dismissed')}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/5 transition-all flex-1">
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const AdvancedFraudDetectionCenter = () => {
  const [signals, setSignals] = useState(MOCK_SIGNALS);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('open');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase?.from('fraud_signals')?.select('*')?.order('created_at', { ascending: false })?.limit(50);
        if (data?.length) setSignals(data);
      } catch { /* use mock */ }
      setLoading(false);
    })();
  }, []);

  const handleAction = useCallback(async (id, newStatus) => {
    setSignals(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    await supabase?.from('fraud_signals')?.update({ status: newStatus, resolved_at: new Date().toISOString() })?.eq('id', id);
  }, []);

  const counts = {
    open:         signals.filter(s => s.status === 'open').length,
    under_review: signals.filter(s => s.status === 'under_review').length,
    banned:       signals.filter(s => s.status === 'banned').length,
    all:          signals.length,
  };

  const filtered = filter === 'all' ? signals : signals.filter(s => s.status === filter);
  const TABS = [
    { id: 'open', label: 'Open', count: counts.open },
    { id: 'under_review', label: 'Under Review', count: counts.under_review },
    { id: 'banned', label: 'Banned', count: counts.banned },
    { id: 'all', label: 'All', count: counts.all },
  ];

  const avgRisk = signals.filter(s => s.status === 'open').reduce((a, b) => a + b.risk_score, 0) /
    (signals.filter(s => s.status === 'open').length || 1);

  return (
    <GeneralPageLayout title="Fraud Detection" showSidebar={true}>
      <div className="w-full py-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 shadow-xl">
              <Icon name="ShieldAlert" size={28} className="text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">Security Command</h1>
              <p className="text-slate-500 font-medium text-sm mt-1">Real-time fraud signal monitoring & mitigation</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-900/40 backdrop-blur-xl p-3 rounded-2xl border border-white/5 shadow-2xl">
            <div className="hidden md:block px-4">
              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Detection Accuracy</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-24 bg-white/5 h-1 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[94%]" />
                </div>
                <span className="text-[10px] text-white font-mono">94.2%</span>
              </div>
            </div>
            <button className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-all">
              <Icon name="RefreshCw" size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-110" />
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1 relative z-10">Open Signals</p>
            <p className="text-3xl font-black text-red-500 mt-1 relative z-10 font-mono tracking-tight">{counts.open}</p>
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1 relative z-10">Require action</p>
          </div>
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-110" />
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1 relative z-10">Avg Risk Score</p>
            <p className="text-3xl font-black mt-1 relative z-10 font-mono tracking-tight" style={{ color: avgRisk >= 80 ? '#ef4444' : avgRisk >= 60 ? '#f97316' : '#22c55e' }}>
              {Math.round(avgRisk)}
            </p>
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1 relative z-10">Open cases</p>
          </div>
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-110" />
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1 relative z-10">Banned Today</p>
            <p className="text-3xl font-black text-white mt-1 relative z-10 font-mono tracking-tight">{counts.banned}</p>
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1 relative z-10">Accounts removed</p>
          </div>
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-110" />
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1 relative z-10">Threat Mitigation</p>
            <p className="text-3xl font-black text-green-500 mt-1 relative z-10 font-mono tracking-tight">Active</p>
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1 relative z-10">24/7 Monitoring</p>
          </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fraud Signal Queue</h2>
            <div className="flex gap-2 p-1 bg-black/40 rounded-xl border border-white/5 overflow-x-auto no-scrollbar">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`flex items-center gap-2.5 px-6 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
                    filter === tab.id ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tab.label} <span className="opacity-40">{tab.count}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="p-6 max-h-[800px] overflow-y-auto no-scrollbar space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24">
                <Icon name="ShieldCheck" size={48} className="mx-auto mb-4 text-slate-700 opacity-20" />
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No signals detected</p>
              </div>
            ) : (
              filtered.map(signal => <SignalRow key={signal.id} signal={signal} onAction={handleAction} />)
            )}
          </div>
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default AdvancedFraudDetectionCenter;
