import React, { useState } from 'react';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import { supabase } from '../../lib/supabase';

const MOCK_ELECTIONS = [
  { 
    id: '1', 
    title: 'Constitutional Amendment 2026', 
    creator: 'GovAuthority', 
    category: 'Sovereign', 
    prerequisites: ['Biometric', 'Payment'], 
    status: 'pending_approval', 
    risk_score: 12, 
    created_at: new Date(Date.now() - 3600000).toISOString() 
  },
  { 
    id: '2', 
    title: 'Regional Budget Allocation', 
    creator: 'LagosBoard', 
    category: 'Finance', 
    prerequisites: ['Video', 'MCQ'], 
    status: 'pending_approval', 
    risk_score: 45, 
    created_at: new Date(Date.now() - 7200000).toISOString() 
  },
  { 
    id: '3', 
    title: 'Community Sports Center Design', 
    creator: 'User99', 
    category: 'Social', 
    prerequisites: [], 
    status: 'approved', 
    risk_score: 5, 
    created_at: new Date(Date.now() - 86400000).toISOString() 
  },
];

const STATUS_CONFIG = {
  pending_approval: { label: 'Pending Approval', cls: 'bg-amber-500/10 text-amber-500 border-amber-500/20', icon: 'Clock' },
  approved: { label: 'Approved', cls: 'bg-green-500/10 text-green-500 border-green-500/20', icon: 'CheckCircle' },
  rejected: { label: 'Rejected', cls: 'bg-red-500/10 text-red-500 border-red-500/20', icon: 'XCircle' },
};

export default function AdminElectionModerationHub() {
  const [elections, setElections] = useState(MOCK_ELECTIONS);
  const [filter, setFilter] = useState('pending_approval');

  const handleAction = (id, newStatus) => {
    setElections(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
  };

  const filtered = filter === 'all' ? elections : elections.filter(e => e.status === filter);

  return (
    <GeneralPageLayout title="Election Moderation" showSidebar={true}>
      <div className="w-full py-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 shadow-xl">
              <Icon name="Shield" size={28} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">Election Moderation</h1>
              <p className="text-slate-500 font-medium text-sm mt-1">Review and approve high-stakes elections</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-900/40 backdrop-blur-xl p-3 rounded-2xl border border-white/5 shadow-2xl">
            <div className="hidden md:block px-4">
              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Platform Integrity</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-24 bg-white/5 h-1 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-[98%]" />
                </div>
                <span className="text-[10px] text-white font-mono">98.4%</span>
              </div>
            </div>
            <button className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-all">
              <Icon name="RefreshCw" size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden group border-l-4 border-l-amber-500">
              <Text className="text-[10px] text-slate-500 font-black uppercase tracking-widest relative z-10">Awaiting Approval</Text>
              <Text className="text-3xl font-black text-white mt-1 relative z-10 font-mono tracking-tight">
                {elections.filter(e => e.status === 'pending_approval').length}
              </Text>
           </div>
           <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden group border-l-4 border-l-indigo-500">
              <Text className="text-[10px] text-slate-500 font-black uppercase tracking-widest relative z-10">Risk Assessment</Text>
              <Text className="text-3xl font-black text-white mt-1 relative z-10 font-mono tracking-tight uppercase">LOW</Text>
           </div>
           <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden group border-l-4 border-l-green-500">
              <Text className="text-[10px] text-slate-500 font-black uppercase tracking-widest relative z-10">Active Elections</Text>
              <Text className="text-3xl font-black text-white mt-1 relative z-10 font-mono tracking-tight">1,284</Text>
           </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="flex border-b border-white/5 bg-black/20 overflow-x-auto no-scrollbar">
            {['pending_approval', 'approved', 'all'].map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-8 py-5 text-[10px] font-black uppercase tracking-widest transition-all duration-300 relative ${
                  filter === t ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {t.replace('_', ' ')}
                {filter === t && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.5)]" />}
              </button>
            ))}
          </div>

          <div className="p-6 max-h-[800px] overflow-y-auto no-scrollbar space-y-4">
            {filtered.map(election => (
              <div key={election.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl hover:bg-white/10 transition-all duration-300 group">
                <div className="flex items-center gap-6 mb-4 md:mb-0">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl border border-white/5 ${election.risk_score > 40 ? 'bg-red-500/10' : 'bg-indigo-500/10'}`}>
                    <Icon name={election.category === 'Sovereign' ? 'Shield' : 'Globe'} size={24} color={election.risk_score > 40 ? '#ef4444' : '#6366f1'} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight">{election.title}</h3>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        Creator: <span className="text-indigo-400 font-mono">{election.creator}</span>
                      </p>
                      <div className="w-1 h-1 rounded-full bg-slate-700" />
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        Risk: <span className={election.risk_score > 40 ? 'text-red-500' : 'text-green-500'}>{election.risk_score}%</span>
                      </p>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {election.prerequisites.map(p => (
                        <span key={p} className="text-[9px] font-black uppercase bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-lg border border-indigo-500/20 tracking-tighter">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {election.status === 'pending_approval' ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAction(election.id, 'approved')}
                      className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-black rounded-xl shadow-lg transition-all uppercase tracking-widest"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleAction(election.id, 'rejected')}
                      className="px-6 py-2.5 bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 text-[10px] font-black rounded-xl border border-white/5 hover:border-red-500/20 transition-all uppercase tracking-widest"
                    >
                      Flag
                    </button>
                  </div>
                ) : (
                  <div className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border border-white/5 ${STATUS_CONFIG[election.status].cls}`}>
                    <Icon name={STATUS_CONFIG[election.status].icon} size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{STATUS_CONFIG[election.status].label}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </GeneralPageLayout>
  );
}

function Text({ children, className }) {
  return <p className={className}>{children}</p>;
}
