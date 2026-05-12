import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import { 
  DollarSign, 
  Calendar, 
  Settings, 
  AlertCircle, 
  TestTube, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Globe, 
  Zap,
  TrendingUp,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { revenueShareService } from '../../services/revenueShareService';
import { revenueSplitSandboxService } from '../../services/revenueSplitSandboxService';
import { revenueSplitForecastingService } from '../../services/revenueSplitForecastingService';
import { supabase } from '../../lib/supabase';
import { analytics } from '../../hooks/useGoogleAnalytics';
import toast, { Toaster } from 'react-hot-toast';

// Component imports (Assuming these will be upgraded as well or already match)
import SandboxTestingPanel from './components/SandboxTestingPanel';
import AIOptimizationPanel from './components/AIOptimizationPanel';
import ScenarioComparisonPanel from './components/ScenarioComparisonPanel';
import ValidationWorkflowPanel from './components/ValidationWorkflowPanel';
import GlobalSplitConfigPanel from './components/GlobalSplitConfigPanel';
import CampaignManagementPanel from './components/CampaignManagementPanel';
import CountrySpecificSplitsPanel from './components/CountrySpecificSplitsPanel';

const EnhancedDynamicRevenueSharingConfigurationCenter = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sandboxMode, setSandboxMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [globalConfig, setGlobalConfig] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [sandboxConfigs, setSandboxConfigs] = useState([]);
  const [aiForecasts, setAIForecasts] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    loadData();
    analytics?.trackEvent('enhanced_revenue_config_viewed', {
      active_tab: activeTab,
      sandbox_mode: sandboxMode
    });

    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    const configChannel = supabase
      ?.channel('revenue_config_enhanced_real_time')
      ?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'revenue_sharing_config' },
        () => refreshData()
      )
      ?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'revenue_split_sandbox_config' },
        () => refreshData()
      )
      ?.subscribe();

    return () => {
      clearInterval(interval);
      if (configChannel) supabase?.removeChannel(configChannel);
    };
  }, [activeTab, sandboxMode]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [configResult, campaignsResult, sandboxResult] = await Promise.all([
        revenueShareService?.getGlobalConfig(),
        revenueShareService?.getAllCampaigns(),
        revenueSplitSandboxService?.getAllSandboxConfigs()
      ]);

      if (configResult?.data) setGlobalConfig(configResult?.data);
      if (campaignsResult?.data) setCampaigns(campaignsResult?.data);
      if (sandboxResult?.data) setSandboxConfigs(sandboxResult?.data);

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading revenue sharing data:', error);
      toast.error('Sync failure detected in revenue core');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  const handleGenerateAIForecast = async () => {
    try {
      toast.loading('Initializing AI revenue projection...', { id: 'ai-forecast' });

      const scenarios = [
        { name: 'Current Split', creatorPercentage: globalConfig?.creatorPercentage, platformPercentage: globalConfig?.platformPercentage },
        { name: '90/10 Morale Booster', creatorPercentage: 90, platformPercentage: 10 },
        { name: '80/20 Balanced', creatorPercentage: 80, platformPercentage: 20 },
        { name: '68/32 Conservative', creatorPercentage: 68, platformPercentage: 32 }
      ];

      const result = await revenueSplitForecastingService?.generateScenarioComparison(scenarios);

      if (result?.error) throw new Error(result?.error?.message);

      setAIForecasts(result?.data);
      toast.success('AI market projection complete', { id: 'ai-forecast' });
      analytics?.trackEvent('ai_forecast_generated', {
        scenarios_count: scenarios?.length
      });
    } catch (error) {
      toast.error(error?.message || 'AI engine failure', { id: 'ai-forecast' });
    }
  };

  const handleToggleSandboxMode = () => {
    setSandboxMode(!sandboxMode);
    const mode = !sandboxMode ? 'initialized' : 'terminated';
    toast.success(`Sandbox environment ${mode}`, {
      icon: <TestTube className="w-4 h-4 text-purple-400" />
    });
    analytics?.trackEvent('sandbox_mode_toggled', {
      enabled: !sandboxMode
    });
  };

  const tabs = [
    { id: 'dashboard', label: 'Command Center', icon: DollarSign },
    { id: 'country-splits', label: 'Territory Logic', icon: Globe },
    { id: 'sandbox', label: 'Sandbox Lab', icon: TestTube },
    { id: 'ai-optimization', label: 'AI Strategy', icon: Sparkles },
    { id: 'global-split', label: 'Global Core', icon: Settings },
    { id: 'campaigns', label: 'Campaigns', icon: Calendar },
    { id: 'validation', label: 'Validation', icon: CheckCircle2 }
  ];

  if (loading && !globalConfig) {
    return (
      <GeneralPageLayout title="Revenue Hub" showSidebar={true}>
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-b-primary animate-spin" />
          <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Synchronizing Financial Intelligence...</p>
        </div>
      </GeneralPageLayout>
    );
  }

  return (
    <GeneralPageLayout title="Revenue Hub" showSidebar={true}>
      <Helmet>
        <title>Enhanced Revenue Configuration Hub | Vottery Admin</title>
      </Helmet>
      <Toaster position="top-right" />

      <div className="w-full py-0">
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-primary/10 rounded-[32px] flex items-center justify-center border border-primary/20 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <Zap className="w-10 h-10 text-primary relative z-10" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Revenue Hub</h1>
                <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary/20">Enhanced v2.4</span>
              </div>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                Financial Orchestration & AI Projections <span className="w-1 h-1 bg-slate-700 rounded-full" /> 
                <span className="text-primary/80">Real-time Node: {lastUpdated.toLocaleTimeString()}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={handleToggleSandboxMode}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl active:scale-95 ${
                sandboxMode 
                  ? 'bg-purple-600 text-white shadow-purple-900/40 border border-purple-400/50' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'
              }`}
            >
              <TestTube className="w-4 h-4" />
              {sandboxMode ? 'Sandbox Initialized' : 'Sandbox Standby'}
            </button>
            <button
              onClick={handleGenerateAIForecast}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-orange-900/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Cpu className="w-4 h-4" />
              AI Market Projection
            </button>
            <button
              onClick={refreshData}
              className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all active:rotate-180 duration-500"
            >
              <RefreshCw className={`w-5 h-5 text-primary ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Sandbox Alert Banner */}
        {sandboxMode && (
          <div className="mb-10 bg-purple-600/10 border border-purple-500/30 rounded-[32px] p-8 flex items-center gap-8 relative overflow-hidden animate-in slide-in-from-top-4 duration-500">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center shrink-0 border border-purple-500/20">
              <ShieldCheck className="w-8 h-8 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Isolated Testing Environment Active</h3>
              <p className="text-purple-300/70 font-medium text-sm">You are currently operating within a high-fidelity sandbox. Changes made here will simulate impact metrics but will not modify the production revenue core.</p>
            </div>
            <button 
              onClick={handleToggleSandboxMode}
              className="px-6 py-3 bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-purple-400 transition-colors"
            >
              Terminate Sandbox
            </button>
            <TestTube className="absolute -right-12 -bottom-12 w-48 h-48 text-purple-500 opacity-[0.05] -rotate-12" />
          </div>
        )}

        {/* Navigation & Content Hub */}
        <div className="bg-card/40 backdrop-blur-xl rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
          <div className="border-b border-white/5 px-8 overflow-x-auto no-scrollbar">
            <nav className="flex space-x-2 py-5">
              {tabs?.map((tab) => {
                const TabIcon = tab?.icon;
                return (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`
                      flex items-center gap-3 py-3.5 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 whitespace-nowrap
                      ${activeTab === tab?.id
                        ? 'bg-primary text-white shadow-2xl shadow-primary/30' 
                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <TabIcon className="w-4.5 h-4.5" />
                    {tab?.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-8 lg:p-14 min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {activeTab === 'dashboard' && (
              <div className="space-y-12">
                {/* Dashboard Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { label: 'Global Protocol', value: `${globalConfig?.creatorPercentage}/${globalConfig?.platformPercentage}`, sub: 'Baseline Split', icon: DollarSign, color: 'text-primary' },
                    { label: 'Live Campaigns', value: campaigns?.filter(c => c?.status === 'active')?.length, sub: 'Market Overrides', icon: Calendar, color: 'text-green-400' },
                    { label: 'Simulation Node', value: sandboxConfigs?.filter(s => s?.isActive)?.length, sub: 'Active Lab Tests', icon: TestTube, color: 'text-purple-400' },
                    { label: 'AI Forecast', value: aiForecasts ? 'Ready' : 'Pending', sub: 'Market Projections', icon: Sparkles, color: 'text-orange-400' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/5 rounded-[32px] p-10 border border-white/5 group hover:bg-white/10 transition-all duration-500 relative overflow-hidden">
                      <div className="relative z-10">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">{stat.label}</p>
                        <p className={`text-4xl font-black ${stat.color} tracking-tighter mb-3`}>{stat.value}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stat.sub}</p>
                      </div>
                      <stat.icon className={`absolute -right-6 -bottom-6 w-32 h-32 ${stat.color} opacity-[0.02] group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700`} />
                    </div>
                  ))}
                </div>

                <ScenarioComparisonPanel
                  globalConfig={globalConfig}
                  campaigns={campaigns}
                  aiForecasts={aiForecasts}
                />
              </div>
            )}

            {/* Sub-Panels (Assuming they handle their own internal layout but we wrap them for consistency) */}
            {activeTab === 'country-splits' && (
              <div className="space-y-10">
                <div className="px-4">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Territory Revenue Logic</h3>
                  <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Regional distribution nodes and localized overrides</p>
                </div>
                <CountrySpecificSplitsPanel />
              </div>
            )}

            {activeTab === 'sandbox' && (
              <SandboxTestingPanel
                sandboxConfigs={sandboxConfigs}
                onRefresh={refreshData}
                sandboxMode={sandboxMode}
              />
            )}

            {activeTab === 'ai-optimization' && (
              <AIOptimizationPanel
                globalConfig={globalConfig}
                aiForecasts={aiForecasts}
                onGenerateForecast={handleGenerateAIForecast}
              />
            )}

            {activeTab === 'global-split' && (
              <GlobalSplitConfigPanel
                globalConfig={globalConfig}
                onUpdate={refreshData}
                sandboxMode={sandboxMode}
              />
            )}

            {activeTab === 'campaigns' && (
              <CampaignManagementPanel
                campaigns={campaigns}
                onRefresh={refreshData}
                sandboxMode={sandboxMode}
              />
            )}

            {activeTab === 'validation' && (
              <ValidationWorkflowPanel
                sandboxConfigs={sandboxConfigs}
                onRefresh={refreshData}
              />
            )}
          </div>
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default EnhancedDynamicRevenueSharingConfigurationCenter;