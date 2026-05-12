import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar, 
  Settings, 
  History, 
  Target, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  Zap,
  CheckCircle2,
  Clock,
  ChevronRight,
  Plus
} from 'lucide-react';
import { revenueShareService } from '../../services/revenueShareService';
import { supabase } from '../../lib/supabase';
import { analytics } from '../../hooks/useGoogleAnalytics';
import toast, { Toaster } from 'react-hot-toast';

const DynamicRevenueSharingConfigurationCenter = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [globalConfig, setGlobalConfig] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [creatorOverrides, setCreatorOverrides] = useState([]);
  const [history, setHistory] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    loadData();
    analytics?.trackEvent('revenue_sharing_config_viewed', {
      active_tab: activeTab
    });

    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    const configChannel = supabase
      ?.channel('revenue_config_real_time')
      ?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'revenue_sharing_config' },
        () => refreshData()
      )
      ?.subscribe();

    const campaignChannel = supabase
      ?.channel('revenue_campaigns_real_time')
      ?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'revenue_sharing_campaigns' },
        () => refreshData()
      )
      ?.subscribe();

    return () => {
      clearInterval(interval);
      if (configChannel) supabase?.removeChannel(configChannel);
      if (campaignChannel) supabase?.removeChannel(campaignChannel);
    };
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [configResult, campaignsResult, overridesResult, historyResult] = await Promise.all([
        revenueShareService?.getGlobalConfig(),
        revenueShareService?.getAllCampaigns(),
        revenueShareService?.getCreatorOverrides(),
        revenueShareService?.getRevenueSharingHistory()
      ]);

      if (configResult?.data) setGlobalConfig(configResult?.data);
      if (campaignsResult?.data) setCampaigns(campaignsResult?.data);
      if (overridesResult?.data) setCreatorOverrides(overridesResult?.data);
      if (historyResult?.data) setHistory(historyResult?.data);

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading revenue sharing data:', error);
      toast.error('Failed to synchronize revenue data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  const handleUpdateGlobalSplit = async (creatorPercentage, platformPercentage, changeReason) => {
    try {
      const result = await revenueShareService?.updateGlobalSplit({
        creatorPercentage,
        platformPercentage,
        changeReason
      });

      if (result?.error) throw new Error(result?.error?.message);

      toast.success('Global revenue split updated successfully');
      await loadData();
      analytics?.trackEvent('global_revenue_split_updated', {
        creator_percentage: creatorPercentage,
        platform_percentage: platformPercentage
      });
    } catch (error) {
      toast.error(error?.message || 'Failed to update global split');
    }
  };

  const handleCreateCampaign = async (campaignData) => {
    try {
      const result = await revenueShareService?.createCampaign(campaignData);
      if (result?.error) throw new Error(result?.error?.message);

      toast.success('Revenue campaign deployed successfully');
      await loadData();
      analytics?.trackEvent('revenue_campaign_created', {
        campaign_name: campaignData?.campaignName
      });
    } catch (error) {
      toast.error(error?.message || 'Failed to deploy campaign');
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: DollarSign },
    { id: 'global-split', label: 'Global Split', icon: Settings },
    { id: 'campaigns', label: 'Campaigns', icon: Calendar },
    { id: 'creator-overrides', label: 'Overrides', icon: Users },
    { id: 'history', label: 'Audit Trail', icon: History },
    { id: 'projections', label: 'Yield Projections', icon: TrendingUp }
  ];

  if (loading && !globalConfig) {
    return (
      <GeneralPageLayout title="Revenue Logic" showSidebar={true}>
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-b-primary animate-spin" />
          <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Initializing Revenue Engine...</p>
        </div>
      </GeneralPageLayout>
    );
  }

  return (
    <GeneralPageLayout title="Revenue Logic" showSidebar={true}>
      <Helmet>
        <title>Revenue Sharing Configuration | Vottery Admin</title>
      </Helmet>
      <Toaster position="top-right" />

      <div className="w-full py-0">
        {/* Header Hub */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-primary/10 rounded-[24px] flex items-center justify-center border border-primary/20 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <DollarSign className="w-8 h-8 text-primary relative z-10" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tight">Revenue Logic</h1>
              <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest flex items-center gap-2">
                Dynamic Distribution Engine <span className="w-1 h-1 bg-slate-700 rounded-full" /> 
                <span className="text-primary/80">Real-time Sync Active</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Engine Pulse</p>
              <p className="text-xs font-mono text-slate-300">{lastUpdated?.toLocaleTimeString()}</p>
            </div>
            <button
              onClick={refreshData}
              className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all active:scale-95"
            >
              <Zap className={`w-5 h-5 text-primary ${loading ? 'animate-pulse' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tab Navigation Hub */}
        <div className="bg-card/40 backdrop-blur-xl rounded-[32px] border border-white/5 mb-10 overflow-hidden shadow-2xl">
          <div className="border-b border-white/5 px-6 overflow-x-auto no-scrollbar">
            <nav className="flex space-x-2 py-4">
              {tabs?.map((tab) => {
                const TabIcon = tab?.icon;
                return (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`
                      flex items-center gap-3 py-3 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 whitespace-nowrap
                      ${activeTab === tab?.id
                        ? 'bg-primary text-white shadow-xl shadow-primary/30' 
                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <TabIcon className="w-4 h-4" />
                    {tab?.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-8 lg:p-12 min-h-[500px]">
            {activeTab === 'dashboard' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
                {/* Metric Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Creator Split', value: `${globalConfig?.creatorPercentage}%`, icon: Users, color: 'text-primary', sub: 'Global Baseline' },
                    { label: 'Platform Split', value: `${globalConfig?.platformPercentage}%`, icon: Target, color: 'text-blue-400', sub: 'Operational Yield' },
                    { label: 'Active Campaigns', value: campaigns?.filter(c => c?.status === 'active')?.length, icon: Calendar, color: 'text-purple-400', sub: 'In Distribution' },
                    { label: 'Custom Overrides', value: creatorOverrides?.length, icon: Settings, color: 'text-emerald-400', sub: 'Tiered Agreements' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/5 rounded-3xl p-8 border border-white/5 relative overflow-hidden group hover:bg-white/10 transition-all duration-500">
                      <div className="relative z-10">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">{stat.label}</p>
                        <p className={`text-3xl font-black ${stat.color} tracking-tighter mb-2`}>{stat.value}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stat.sub}</p>
                      </div>
                      <stat.icon className={`absolute -right-4 -bottom-4 w-24 h-24 ${stat.color} opacity-[0.03] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700`} />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Active Campaigns Hub */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] px-2 flex items-center justify-between">
                      Live Campaigns
                      <span className="text-primary font-mono lowercase tracking-normal">.active_now</span>
                    </h3>
                    <div className="space-y-4">
                      {campaigns?.filter(c => c?.status === 'active')?.length === 0 ? (
                        <div className="bg-white/5 rounded-[24px] border border-white/5 p-12 text-center">
                          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No active revenue campaigns</p>
                        </div>
                      ) : (
                        campaigns?.filter(c => c?.status === 'active')?.map((campaign) => (
                          <div key={campaign?.id} className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-[24px] p-6 transition-all group cursor-pointer">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                  <Zap className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-black text-white uppercase tracking-tight">{campaign?.campaignName}</p>
                                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{new Date(campaign?.endDate)?.toLocaleDateString()} Deadline</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-black text-primary font-mono">{campaign?.creatorPercentage}%</p>
                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Creator Share</p>
                              </div>
                            </div>
                            <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: '100%' }} />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Yield Projections Preview */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] px-2 flex items-center justify-between">
                      Yield Projections
                      <span className="text-blue-400 font-mono lowercase tracking-normal">.predictive_analysis</span>
                    </h3>
                    <div className="bg-gradient-to-br from-blue-500/10 via-primary/5 to-transparent rounded-[32px] border border-white/5 p-8 relative overflow-hidden">
                      <div className="relative z-10 space-y-8">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">30-Day Outlook</p>
                            <p className="text-3xl font-black text-white tracking-tight">$64,686 <span className="text-xs text-green-400 font-black uppercase tracking-widest ml-2">+12%</span></p>
                          </div>
                          <TrendingUp className="w-10 h-10 text-primary opacity-50" />
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Creator Distribution</span>
                            <span className="font-black text-emerald-400 font-mono">$45,280</span>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Retention</span>
                            <span className="font-black text-blue-400 font-mono">$19,406</span>
                          </div>
                        </div>
                      </div>
                      <div className="absolute -right-10 -bottom-10 opacity-[0.02] rotate-12">
                        <TrendingUp size={240} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'global-split' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <GlobalSplitPanel 
                  globalConfig={globalConfig}
                  onUpdate={handleUpdateGlobalSplit}
                />
              </div>
            )}

            {activeTab === 'campaigns' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <CampaignsPanel 
                  campaigns={campaigns}
                  onCreate={handleCreateCampaign}
                />
              </div>
            )}

            {activeTab === 'creator-overrides' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <CreatorOverridesPanel 
                  overrides={creatorOverrides}
                />
              </div>
            )}

            {activeTab === 'history' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <HistoryPanel 
                  history={history}
                />
              </div>
            )}

            {activeTab === 'projections' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <ProjectionsPanel />
              </div>
            )}
          </div>
        </div>
      </div>
    </GeneralPageLayout>
  );
};

const GlobalSplitPanel = ({ globalConfig, onUpdate }) => {
  const [creatorPercentage, setCreatorPercentage] = useState(70);
  const [changeReason, setChangeReason] = useState('strategic_adjustment');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (globalConfig) {
      setCreatorPercentage(globalConfig?.creatorPercentage || 70);
    }
  }, [globalConfig]);

  const platformPercentage = (100 - creatorPercentage).toFixed(2);

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(creatorPercentage, parseFloat(platformPercentage), changeReason);
    setSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="bg-primary/5 border border-primary/10 rounded-[32px] p-10 shadow-inner">
        <div className="flex items-start gap-8">
          <div className="w-14 h-14 rounded-[20px] bg-primary/20 flex items-center justify-center shrink-0 border border-primary/20">
            <Settings className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3">Global Split Configuration</h3>
            <p className="text-slate-400 font-medium leading-relaxed">
              Define the baseline revenue distribution for the entire Vottery network. This ratio is applied globally unless overridden by territory-specific splits or active promotional campaigns.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-10">
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Creator Distribution</label>
              <span className="text-3xl font-black text-primary font-mono">{creatorPercentage}%</span>
            </div>
            <div className="relative h-4 bg-white/5 rounded-full border border-white/5 p-1 group">
              <input
                type="range"
                min="0"
                max="100"
                step="0.5"
                value={creatorPercentage}
                onChange={(e) => setCreatorPercentage(parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              <div 
                className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-300 relative"
                style={{ width: `${creatorPercentage}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-2xl scale-125 group-hover:scale-150 transition-transform flex items-center justify-center border-4 border-primary">
                  <div className="w-1 h-1 bg-primary rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Protocol Rationale</label>
            <select
              value={changeReason}
              onChange={(e) => setChangeReason(e.target.value)}
              className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent text-white font-black uppercase tracking-widest text-xs appearance-none cursor-pointer hover:bg-white/10 transition-all"
            >
              <option value="strategic_adjustment" className="bg-slate-900">Strategic Market Adjustment</option>
              <option value="morale_booster" className="bg-slate-900">Ecosystem Morale Booster</option>
              <option value="campaign_launch" className="bg-slate-900">Seasonal Campaign Launch</option>
              <option value="performance_incentive" className="bg-slate-900">High-Yield Performance Incentive</option>
              <option value="market_conditions" className="bg-slate-900">Macro Market Conditions</option>
              <option value="manual_override" className="bg-slate-900">Administrative Manual Override</option>
            </select>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full px-12 py-6 bg-primary text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Zap className="w-5 h-5" />}
            Commit Configuration
          </button>
        </div>

        <div className="bg-black/20 rounded-[40px] border border-white/5 p-10 flex flex-col justify-center">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10 text-center">Protocol Simulation ($1,000 Volume)</p>
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-sm font-black text-white uppercase tracking-widest">Creator Yield</span>
              </div>
              <span className="text-2xl font-black text-emerald-400 font-mono">${(1000 * creatorPercentage / 100).toFixed(2)}</span>
            </div>
            <div className="h-px bg-white/5" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-sm font-black text-white uppercase tracking-widest">System Fee</span>
              </div>
              <span className="text-2xl font-black text-blue-400 font-mono">${(1000 * (100 - creatorPercentage) / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CampaignsPanel = ({ campaigns, onCreate }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    campaignName: '',
    campaignDescription: '',
    creatorPercentage: 90,
    startDate: '',
    endDate: ''
  });

  const handleSubmit = async () => {
    await onCreate({
      ...formData,
      platformPercentage: 100 - formData.creatorPercentage
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between px-4">
        <div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tight">Active Campaigns</h3>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Temporary split overrides for promotional periods</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
        >
          {showForm ? <XCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Discard Draft' : 'Deploy Campaign'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white/5 border border-primary/20 rounded-[40px] p-10 animate-in fade-in slide-in-from-top-8 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Campaign Title</label>
                <input
                  type="text"
                  placeholder="e.g. Creator Appreciation Week"
                  value={formData.campaignName}
                  onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary text-white font-black"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Distribution Ratio (%)</label>
                <div className="flex items-center gap-6">
                  <input
                    type="number"
                    value={formData.creatorPercentage}
                    onChange={(e) => setFormData({ ...formData, creatorPercentage: parseFloat(e.target.value) })}
                    className="w-24 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-primary font-black font-mono text-center"
                  />
                  <div className="flex-1 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Creator Share / <span className="text-white">{100 - formData.creatorPercentage}%</span> Platform
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Genesis</label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-mono text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Expiration</label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-mono text-xs"
                  />
                </div>
              </div>
              <div className="pt-6">
                <button
                  onClick={handleSubmit}
                  className="w-full py-5 bg-gradient-to-r from-primary to-purple-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Confirm Deployment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {campaigns?.map((campaign) => (
          <div key={campaign?.id} className="bg-white/5 border border-white/5 rounded-[32px] p-8 hover:bg-white/10 transition-all group relative overflow-hidden">
            <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-2xl text-[9px] font-black uppercase tracking-widest ${
              campaign?.status === 'active' ? 'bg-green-500/20 text-green-400' :
              campaign?.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-500/20 text-slate-400'
            }`}>
              {campaign?.status}
            </div>
            <div className="mb-8">
              <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">{campaign?.campaignName}</h4>
              <p className="text-xs text-slate-500 font-medium line-clamp-2">{campaign?.campaignDescription}</p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                <div className="text-center flex-1">
                  <p className="text-2xl font-black text-primary font-mono">{campaign?.creatorPercentage}%</p>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Creator</p>
                </div>
                <div className="w-px h-8 bg-white/5" />
                <div className="text-center flex-1">
                  <p className="text-2xl font-black text-white font-mono">{campaign?.platformPercentage}%</p>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Platform</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <Clock className="w-3.5 h-3.5" />
                {new Date(campaign?.startDate).toLocaleDateString()} - {new Date(campaign?.endDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CreatorOverridesPanel = ({ overrides }) => (
  <div className="space-y-8">
    <div className="px-4">
      <h3 className="text-2xl font-black text-white uppercase tracking-tight">Tiered Agreements</h3>
      <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Individual creator revenue overrides</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {overrides?.map((override) => (
        <div key={override?.id} className="bg-white/5 border border-white/5 rounded-[32px] p-8 hover:bg-white/10 transition-all group">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-black shadow-xl">
              {override?.creator?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="font-black text-white uppercase tracking-tight text-lg">{override?.creator?.name}</p>
              <p className="text-[10px] text-primary font-black uppercase tracking-widest">@{override?.creator?.username}</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-5 bg-black/40 rounded-2xl border border-white/5">
            <div className="text-center">
              <p className="text-xl font-black text-primary font-mono">{override?.creatorPercentage}%</p>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Creator</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-700" />
            <div className="text-center">
              <p className="text-xl font-black text-white font-mono">{override?.platformPercentage}%</p>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Platform</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const HistoryPanel = ({ history }) => (
  <div className="space-y-8">
    <div className="px-4">
      <h3 className="text-2xl font-black text-white uppercase tracking-tight">Audit Trail</h3>
      <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Immutable log of revenue configuration changes</p>
    </div>
    <div className="space-y-4">
      {history?.map((entry) => (
        <div key={entry?.id} className="bg-white/5 border border-white/5 rounded-[24px] p-8 hover:bg-white/10 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 group">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="px-3 py-1 bg-primary/10 rounded-lg border border-primary/20">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{entry?.changeType?.replace('_', ' ')}</span>
              </div>
              <span className="text-xs font-mono text-slate-500">{new Date(entry?.changedAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Previous Evolution</p>
                <p className="font-black text-slate-400 font-mono line-through opacity-50">{entry?.previousCreatorPercentage}% / {entry?.previousPlatformPercentage}%</p>
              </div>
              <ChevronRight className="text-slate-700" />
              <div className="space-y-1">
                <p className="text-[9px] font-black text-primary uppercase tracking-widest">Current Protocol</p>
                <p className="font-black text-white font-mono">{entry?.newCreatorPercentage}% / {entry?.newPlatformPercentage}%</p>
              </div>
            </div>
          </div>
          {entry?.changeDescription && (
            <div className="lg:max-w-xs text-sm text-slate-500 font-medium italic border-l-2 border-primary/20 pl-6 py-2">
              "{entry?.changeDescription}"
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const ProjectionsPanel = () => {
  const projections = [
    { period: '7 Days', creatorEarnings: 12500, platformRevenue: 5357, total: 17857, growth: '+5.2%' },
    { period: '30 Days', creatorEarnings: 45280, platformRevenue: 19406, total: 64686, growth: '+12.8%' },
    { period: '90 Days', creatorEarnings: 128400, platformRevenue: 55029, total: 183429, growth: '+24.5%' }
  ];

  return (
    <div className="grid grid-cols-1 gap-10">
      {projections?.map((proj, index) => (
        <div key={index} className="bg-white/5 border border-white/5 rounded-[40px] p-12 hover:bg-white/10 transition-all duration-500 relative overflow-hidden group">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="shrink-0 text-center lg:text-left">
              <h4 className="text-4xl font-black text-white uppercase tracking-tight mb-2">{proj?.period} <span className="text-primary text-2xl font-mono ml-4">{proj.growth}</span></h4>
              <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Strategic Yield Forecast</p>
            </div>
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-black/20 rounded-3xl p-6 border border-white/5 text-center">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Creator Earnings</p>
                <p className="text-2xl font-black text-emerald-400 font-mono">${proj?.creatorEarnings?.toLocaleString()}</p>
              </div>
              <div className="bg-black/20 rounded-3xl p-6 border border-white/5 text-center">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Platform Revenue</p>
                <p className="text-2xl font-black text-blue-400 font-mono">${proj?.platformRevenue?.toLocaleString()}</p>
              </div>
              <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10 text-center">
                <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-2">Gross Protocol Volume</p>
                <p className="text-2xl font-black text-white font-mono">${proj?.total?.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <ArrowUpRight className="absolute -right-10 -bottom-10 w-48 h-48 text-primary opacity-[0.02] group-hover:scale-110 transition-transform duration-700" />
        </div>
      ))}
    </div>
  );
};

export default DynamicRevenueSharingConfigurationCenter;