import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import { supabase } from '../../lib/supabase';

import TrendingIdeasPanel from './components/TrendingIdeasPanel';
import SubmitRequestPanel from './components/SubmitRequestPanel';
import CommunityVotingPanel from './components/CommunityVotingPanel';
import ImplementationTrackingPanel from './components/ImplementationTrackingPanel';

import GeneralPageLayout from '../../components/layout/GeneralPageLayout';

const UserFeedbackPortalWithFeatureRequestSystem = () => {
  const [activeTab, setActiveTab] = useState('trending');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      const { data: { user: currentUser } } = await supabase?.auth?.getUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'trending', label: 'Trending Ideas', icon: 'TrendingUp' },
    { id: 'submit', label: 'Submit Request', icon: 'Plus' },
    { id: 'voting', label: 'Community Voting', icon: 'ThumbsUp' },
    { id: 'tracking', label: 'Implementation Tracking', icon: 'GitBranch' }
  ];

  return (
    <GeneralPageLayout title="Feedback Portal" showSidebar={true}>
      <Helmet>
        <title>User Feedback Portal | Vottery</title>
      </Helmet>
      
      <div className="w-full py-0">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white mb-3 tracking-tight uppercase">
              Community Forge
            </h1>
            <p className="text-base md:text-lg text-slate-400 font-medium max-w-2xl">
              Propose features, vote on prioritization, and track the architectural evolution of the Vottery ecosystem.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</span>
              <span className="text-xs font-black text-primary uppercase tracking-widest">Active Governance</span>
            </div>
          </div>
        </div>

        {/* Premium Tabbed Navigation */}
        <div className="flex flex-wrap gap-2 mb-10 p-2 bg-white/5 rounded-3xl border border-white/10 w-fit">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab?.id
                  ? 'bg-primary text-black shadow-lg shadow-primary/20 scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon name={tab?.icon} size={14} />
              {tab?.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                {activeTab === 'trending' && <TrendingIdeasPanel />}
                {activeTab === 'submit' && <SubmitRequestPanel onSubmitSuccess={() => setActiveTab('trending')} />}
                {activeTab === 'voting' && <CommunityVotingPanel />}
                {activeTab === 'tracking' && <ImplementationTrackingPanel />}
              </div>
            )}
          </div>

          <aside className="lg:col-span-4 space-y-10">
            <div className="premium-glass p-8 rounded-3xl border border-white/10 shadow-2xl animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 mb-6">
                <Icon name="Lightbulb" size={24} className="text-primary" />
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight mb-3">Architectural Vision</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                Vottery is built by its users. Top-voted features are automatically added to the quarterly implementation roadmap and funded through the Decentralized Growth Treasury.
              </p>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Treasury</span>
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">$1.2M USD</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div className="h-full bg-primary w-3/4 shadow-[0_0_8px_rgba(255,255,0,0.3)]" />
                </div>
              </div>
            </div>

            <div className="premium-glass p-8 rounded-3xl border border-indigo-500/20 shadow-2xl animate-in fade-in slide-in-from-right-8 duration-700 delay-500">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Execution Log</h4>
              <div className="space-y-4">
                {[
                  { label: 'Feed 3.0', status: 'Shipped', color: 'bg-success' },
                  { label: 'ZK-Rollups', status: 'In Progress', color: 'bg-primary' },
                  { label: 'Jolts AI', status: 'Alpha', color: 'bg-indigo-500' },
                ]?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{item?.label}</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black text-black uppercase tracking-widest ${item?.color}`}>{item?.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default UserFeedbackPortalWithFeatureRequestSystem;