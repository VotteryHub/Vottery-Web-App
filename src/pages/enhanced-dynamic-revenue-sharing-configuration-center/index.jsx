import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import { DollarSign, Calendar, Settings, AlertCircle, TestTube, Sparkles, CheckCircle, XCircle, RefreshCw, Globe } from 'lucide-react';
import { revenueShareService } from '../../services/revenueShareService';
import { revenueSplitSandboxService } from '../../services/revenueSplitSandboxService';
import { revenueSplitForecastingService } from '../../services/revenueSplitForecastingService';
import { supabase } from '../../lib/supabase';
import { analytics } from '../../hooks/useGoogleAnalytics';
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
  const [message, setMessage] = useState(null);
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
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  const handleGenerateAIForecast = async () => {
    try {
      setMessage({ type: 'info', text: 'Generating AI-powered forecasts...' });

      const scenarios = [
        { name: 'Current Split', creatorPercentage: globalConfig?.creatorPercentage, platformPercentage: globalConfig?.platformPercentage },
        { name: '90/10 Morale Booster', creatorPercentage: 90, platformPercentage: 10 },
        { name: '80/20 Balanced', creatorPercentage: 80, platformPercentage: 20 },
        { name: '68/32 Conservative', creatorPercentage: 68, platformPercentage: 32 }
      ];

      const result = await revenueSplitForecastingService?.generateScenarioComparison(scenarios);

      if (result?.error) throw new Error(result?.error?.message);

      setAIForecasts(result?.data);
      setMessage({ type: 'success', text: 'AI forecasts generated successfully' });
      analytics?.trackEvent('ai_forecast_generated', {
        scenarios_count: scenarios?.length
      });
    } catch (error) {
      setMessage({ type: 'error', text: error?.message });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const handleToggleSandboxMode = () => {
    setSandboxMode(!sandboxMode);
    analytics?.trackEvent('sandbox_mode_toggled', {
      enabled: !sandboxMode
    });
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: DollarSign },
    { id: 'country-splits', label: 'Country Splits', icon: Globe },
    { id: 'sandbox', label: 'Sandbox Testing', icon: TestTube },
    { id: 'ai-optimization', label: 'AI Optimization', icon: Sparkles },
    { id: 'global-split', label: 'Global Split', icon: Settings },
    { id: 'campaigns', label: 'Campaigns', icon: Calendar },
    { id: 'validation', label: 'Validation', icon: CheckCircle }
  ];

  const dashboardStats = [
    {
      label: 'Current Split',
      value: `${globalConfig?.creatorPercentage || 70}/${globalConfig?.platformPercentage || 30}`,
      subtext: 'Creator / Platform',
      icon: DollarSign,
      color: 'blue'
    },
    {
      label: 'Active Campaigns',
      value: campaigns?.filter(c => c?.status === 'active')?.length || 0,
      subtext: 'Running now',
      icon: Calendar,
      color: 'green'
    },
    {
      label: 'Sandbox Tests',
      value: sandboxConfigs?.filter(s => s?.isActive)?.length || 0,
      subtext: 'In progress',
      icon: TestTube,
      color: 'purple'
    },
    {
      label: 'AI Forecasts',
      value: aiForecasts ? 'Ready' : 'Generate',
      subtext: 'Optimization insights',
      icon: Sparkles,
      color: 'orange'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Helmet>
        <title>Enhanced Dynamic Revenue Sharing Configuration Center | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Enhanced Revenue Sharing Configuration Center
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Sandbox testing, AI-powered forecasting, and strategic revenue optimization
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleSandboxMode}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  sandboxMode
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <TestTube className="w-5 h-5" />
                {sandboxMode ? 'Sandbox Mode: ON' : 'Sandbox Mode: OFF'}
              </button>
              <button
                onClick={handleGenerateAIForecast}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-200 flex items-center gap-2 shadow-lg"
              >
                <Sparkles className="w-5 h-5" />
                Generate AI Forecast
              </button>
              <button
                onClick={refreshData}
                className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Sandbox Mode Banner */}
          {sandboxMode && (
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4 flex items-center gap-3">
              <TestTube className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <div className="flex-1">
                <div className="font-semibold text-purple-900 dark:text-purple-100">
                  Sandbox Mode Active
                </div>
                <div className="text-sm text-purple-700 dark:text-purple-300">
                  All changes are isolated and will not affect production data. Test freely!
                </div>
              </div>
              <button
                onClick={handleToggleSandboxMode}
                className="px-3 py-1 bg-purple-600 text-white rounded text-sm font-medium hover:bg-purple-700 transition-colors"
              >
                Exit Sandbox
              </button>
            </div>
          )}

          {/* Message Alert */}
          {message && (
            <div
              className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
                message?.type === 'success' ?'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700'
                  : message?.type === 'error' ?'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700' :'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
              }`}
            >
              {message?.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              ) : message?.type === 'error' ? (
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              )}
              <span
                className={`text-sm ${
                  message?.type === 'success' ?'text-green-800 dark:text-green-200'
                    : message?.type === 'error' ?'text-red-800 dark:text-red-200' :'text-blue-800 dark:text-blue-200'
                }`}
              >
                {message?.text}
              </span>
            </div>
          )}
        </div>

        {/* Dashboard Stats */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardStats?.map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-lg bg-${stat?.color}-100 dark:bg-${stat?.color}-900/20`}
                  >
                    <stat.icon className={`w-6 h-6 text-${stat?.color}-600 dark:text-${stat?.color}-400`} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat?.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {stat?.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {stat?.subtext}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex overflow-x-auto">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' :'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab?.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <ScenarioComparisonPanel
                    globalConfig={globalConfig}
                    campaigns={campaigns}
                    aiForecasts={aiForecasts}
                  />
                </div>
              )}

              {/* Country Splits Tab */}
              {activeTab === 'country-splits' && <CountrySpecificSplitsPanel />}

              {/* Sandbox Testing Tab */}
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
            </>
          )}
        </div>

        {/* Last Updated */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Last updated: {lastUpdated?.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default EnhancedDynamicRevenueSharingConfigurationCenter;