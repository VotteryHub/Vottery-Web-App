/**
 * Admin Screen 1: AI Content Moderation Dashboard
 * Route: /admin/ai-content-moderation
 * Role: admin only
 */
import React, { useState, useEffect, useCallback } from 'react';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import { supabase } from '../../lib/supabase';

// ── Mock data fallback ────────────────────────────────────────────────────────
const MOCK_FLAGS = [
  { id: '1', content_type: 'post', content_preview: 'This election is rigged! Everyone should boycott the vote and disrupt...', reason: 'Incitement', severity: 'high', status: 'pending_review', created_at: new Date(Date.now() - 3600000).toISOString(), ai_confidence: 0.94, author: 'user_a91x' },
  { id: '2', content_type: 'comment', content_preview: 'Check out this link for free VP coins — click now before it expires!', reason: 'Spam/Phishing', severity: 'medium', status: 'pending_review', created_at: new Date(Date.now() - 7200000).toISOString(), ai_confidence: 0.88, author: 'user_b32z' },
  { id: '3', content_type: 'jolt', content_preview: 'Graphic content detected in Jolt video thumbnail — explicit imagery', reason: 'Explicit Content', severity: 'high', status: 'under_review', created_at: new Date(Date.now() - 10800000).toISOString(), ai_confidence: 0.97, author: 'creator_ux8' },
  { id: '4', content_type: 'post', content_preview: 'Candidate X has a secret criminal record — voting for them is dangerous.', reason: 'Misinformation', severity: 'medium', status: 'pending_review', created_at: new Date(Date.now() - 14400000).toISOString(), ai_confidence: 0.79, author: 'user_c47q' },
  { id: '5', content_type: 'comment', content_preview: 'I hate all voters in this category, they are all corrupt and should be removed.', reason: 'Hate Speech', severity: 'high', status: 'escalated', created_at: new Date(Date.now() - 18000000).toISOString(), ai_confidence: 0.91, author: 'user_d15w' },
  { id: '6', content_type: 'post', content_preview: 'Buy my premium election analytics service — guaranteed winning strategy!', reason: 'Commercial Spam', severity: 'low', status: 'approved', created_at: new Date(Date.now() - 86400000).toISOString(), ai_confidence: 0.72, author: 'adv_e88m' },
  { id: '7', content_type: 'jolt', content_preview: 'Misleading statistics about voter turnout shown as proven facts without sources.', reason: 'Misinformation', severity: 'medium', status: 'rejected', created_at: new Date(Date.now() - 172800000).toISOString(), ai_confidence: 0.83, author: 'creator_f29k' },
];

const SEVERITY_CONFIG = {
  high:   { color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/20',    dot: 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]' },
  medium: { color: 'text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/20', dot: 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]' },
  low:    { color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20',   dot: 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.4)]' },
};

const STATUS_BADGE = {
  pending_review: { label: 'Pending Review', cls: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  under_review:   { label: 'Under Review',   cls: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  approved:       { label: 'Approved',       cls: 'bg-green-500/10 text-green-500 border-green-500/20' },
  rejected:       { label: 'Rejected',       cls: 'bg-red-500/10 text-red-500 border-red-500/20' },
  escalated:      { label: 'Escalated',      cls: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
};

const TYPE_ICON = { post: 'FileText', comment: 'MessageCircle', jolt: 'Zap' };

function StatCard({ icon, label, value, color, trend }) {
  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-110" />
      <div className="flex items-center gap-5 relative z-10">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
          <Icon name={icon} size={20} color={color} />
        </div>
        <div>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{label}</p>
          <p className="text-2xl font-black text-white mt-1 font-mono tracking-tight">{value}</p>
          {trend && <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1">{trend}</p>}
        </div>
      </div>
    </div>
  );
}

function FlagRow({ flag, onAction }) {
  const sev = SEVERITY_CONFIG[flag.severity] || SEVERITY_CONFIG.low;
  const statusBadge = STATUS_BADGE[flag.status] || { label: flag.status, cls: 'bg-white/5 text-slate-500' };
  const timeAgo = new Date(flag.created_at);
  const elapsed = Math.round((Date.now() - timeAgo.getTime()) / 60000);
  const timeLabel = elapsed < 60 ? `${elapsed}m ago` : elapsed < 1440 ? `${Math.round(elapsed / 60)}h ago` : `${Math.round(elapsed / 1440)}d ago`;

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl p-5 transition-all duration-300 hover:bg-white/10 group">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-4 flex-1">
          <div className={`w-1.5 h-12 rounded-full flex-shrink-0 shadow-lg ${sev.dot}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/40 rounded-lg border border-white/5">
                <Icon name={TYPE_ICON[flag.content_type] || 'File'} size={12} className="text-slate-500" />
                <span className="text-[9px] font-black uppercase text-slate-400">{flag.content_type}</span>
              </div>
              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border border-white/5 ${statusBadge.cls}`}>{statusBadge.label}</span>
              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border border-white/5 ${sev.color}`}>{flag.severity} RISK</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">AI Confidence: {Math.round(flag.ai_confidence * 100)}%</span>
            </div>
            <p className="text-sm text-slate-200 font-medium leading-relaxed mb-3">{flag.content_preview}</p>
            <div className="flex items-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Icon name="AlertCircle" size={12} /> {flag.reason}</span>
              <span className="flex items-center gap-1.5"><Icon name="User" size={12} /> {flag.author}</span>
              <span className="flex items-center gap-1.5 ml-auto text-slate-600"><Icon name="Clock" size={12} /> {timeLabel}</span>
            </div>
          </div>
        </div>
        
        {['pending_review', 'under_review'].includes(flag.status) && (
          <div className="flex flex-row md:flex-col gap-2 flex-shrink-0">
            <button
              onClick={() => onAction(flag.id, 'approved')}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest rounded-xl border border-green-500/20 transition-all flex-1"
            >
              <Icon name="Check" size={12} /> Approve
            </button>
            <button
              onClick={() => onAction(flag.id, 'rejected')}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl border border-red-500/20 transition-all flex-1"
            >
              <Icon name="X" size={12} /> Reject
            </button>
            <button
              onClick={() => onAction(flag.id, 'escalated')}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 text-[10px] font-black uppercase tracking-widest rounded-xl border border-purple-500/20 transition-all flex-1"
            >
              <Icon name="ArrowUpCircle" size={12} /> Escalate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const AiContentModerationDashboard = () => {
  const [flags, setFlags] = useState(MOCK_FLAGS);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending_review');
  const [auditLog, setAuditLog] = useState([]);

  const loadFlags = useCallback(async () => {
    try {
      const { data, error } = await supabase
        ?.from('content_flags')
        ?.select('id, content_type, content_preview, reason, severity, status, created_at, ai_confidence, author_id')
        ?.order('created_at', { ascending: false })
        ?.limit(50);
      if (!error && data?.length) {
        setFlags(data.map(f => ({ ...f, author: f.author_id || 'unknown' })));
      }
    } catch {
      // fallback to mock
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFlags(); }, [loadFlags]);

  const handleAction = useCallback(async (flagId, newStatus) => {
    setFlags(prev => prev.map(f => f.id === flagId ? { ...f, status: newStatus } : f));
    setAuditLog(prev => [
      { id: Date.now(), flagId, action: newStatus, timestamp: new Date().toISOString(), admin: 'Admin' },
      ...prev.slice(0, 19),
    ]);
    await supabase?.from('content_flags')?.update({ status: newStatus, reviewed_at: new Date().toISOString() })?.eq('id', flagId);
  }, []);

  const filtered = flags.filter(f => filter === 'all' ? true : f.status === filter);
  const counts = {
    pending_review: flags.filter(f => f.status === 'pending_review').length,
    under_review:   flags.filter(f => f.status === 'under_review').length,
    escalated:      flags.filter(f => f.status === 'escalated').length,
    resolved:       flags.filter(f => ['approved', 'rejected'].includes(f.status)).length,
  };

  const TABS = [
    { id: 'pending_review', label: 'Pending Review', count: counts.pending_review },
    { id: 'under_review',   label: 'Under Review',  count: counts.under_review },
    { id: 'escalated',      label: 'Escalated',     count: counts.escalated },
    { id: 'all',            label: 'All Flags',     count: flags.length },
  ];

  return (
    <GeneralPageLayout title="AI Content Moderation" showSidebar={true}>
      <div className="w-full py-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 shadow-xl">
              <Icon name="Shield" size={28} className="text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">AI Governance</h1>
              <p className="text-slate-500 font-medium text-sm mt-1">Reviewing AI-flagged content & policy enforcement</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-900/40 backdrop-blur-xl p-3 rounded-2xl border border-white/5 shadow-2xl">
            <div className="hidden md:block px-4">
              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Platform Safety Score</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-24 bg-white/5 h-1 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-[94%]" />
                </div>
                <span className="text-[10px] text-white font-mono">94.2%</span>
              </div>
            </div>
            <button onClick={loadFlags} className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-all">
              <Icon name="RefreshCw" size={16} />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard icon="Clock" label="Pending Review" value={counts.pending_review} color="#f59e0b" trend="Awaiting action" />
          <StatCard icon="Eye" label="Under Review" value={counts.under_review} color="#3b82f6" trend="Being reviewed" />
          <StatCard icon="ArrowUpCircle" label="Escalated" value={counts.escalated} color="#8b5cf6" trend="Needs senior review" />
          <StatCard icon="CheckCircle" label="Resolved" value={counts.resolved} color="#10b981" trend="This session" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Main Queue */}
          <div className="xl:col-span-2">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Moderation Queue</h2>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2 p-4 bg-black/20 border-b border-white/5 overflow-x-auto no-scrollbar">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id)}
                    className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                      filter === tab.id ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {tab.label}
                    <span className={`px-2 py-0.5 rounded-full ${filter === tab.id ? 'bg-white/20' : 'bg-white/5'}`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="p-6 max-h-[700px] overflow-y-auto no-scrollbar space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-24">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="text-center py-24">
                    <Icon name="CheckCircle" size={48} className="mx-auto mb-4 text-slate-700 opacity-20" />
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No items in queue</p>
                  </div>
                ) : (
                  filtered.map(flag => (
                    <FlagRow key={flag.id} flag={flag} onAction={handleAction} />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Audit Log */}
          <div className="xl:col-span-1">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl sticky top-24">
              <div className="p-6 border-b border-white/5">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Audit Trail</h2>
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Active Session History</p>
              </div>
              <div className="p-6 max-h-[500px] overflow-y-auto no-scrollbar space-y-6">
                {auditLog.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest opacity-50">Empty Trail</p>
                  </div>
                ) : (
                  auditLog.map(entry => (
                    <div key={entry.id} className="flex items-start gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
                      <div className={`w-2 h-2 rounded-full mt-2.5 flex-shrink-0 shadow-lg ${
                        entry.action === 'approved' ? 'bg-green-500 shadow-green-500/20' :
                        entry.action === 'rejected' ? 'bg-red-500 shadow-red-500/20' : 'bg-purple-500 shadow-purple-500/20'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">{entry.action}</span>
                          <span className="text-[9px] text-slate-500 font-mono">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium">Flag #{entry.flagId?.toString().slice(0,8)} by {entry.admin}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default AiContentModerationDashboard;
