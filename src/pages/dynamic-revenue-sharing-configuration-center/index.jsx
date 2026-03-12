import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import { DollarSign, TrendingUp, Users, Calendar, Settings, History, Target, AlertCircle } from 'lucide-react';
import { revenueShareService } from '../../services/revenueShareService';
import { supabase } from '../../lib/supabase';
import { analytics } from '../../hooks/useGoogleAnalytics';

const DynamicRevenueSharingConfigurationCenter = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [globalConfig, setGlobalConfig] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [creatorOverrides, setCreatorOverrides] = useState([]);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState(null);
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

      setMessage({ type: 'success', text: 'Global revenue split updated successfully' });
      await loadData();
      analytics?.trackEvent('global_revenue_split_updated', {
        creator_percentage: creatorPercentage,
        platform_percentage: platformPercentage
      });
    } catch (error) {
      setMessage({ type: 'error', text: error?.message });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const handleCreateCampaign = async (campaignData) => {
    try {
      const result = await revenueShareService?.createCampaign(campaignData);
      if (result?.error) throw new Error(result?.error?.message);

      setMessage({ type: 'success', text: 'Campaign created successfully' });
      await loadData();
      analytics?.trackEvent('revenue_campaign_created', {
        campaign_name: campaignData?.campaignName
      });
    } catch (error) {
      setMessage({ type: 'error', text: error?.message });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const handleUpdateCampaign = async (campaignId, updates) => {
    try {
      const result = await revenueShareService?.updateCampaign(campaignId, updates);
      if (result?.error) throw new Error(result?.error?.message);

      setMessage({ type: 'success', text: 'Campaign updated successfully' });
      await loadData();
    } catch (error) {
      setMessage({ type: 'error', text: error?.message });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: DollarSign },
    { id: 'global-split', label: 'Global Split', icon: Settings },
    { id: 'campaigns', label: 'Campaigns', icon: Calendar },
    { id: 'creator-overrides', label: 'Creator Overrides', icon: Users },
    { id: 'history', label: 'History', icon: History },
    { id: 'projections', label: 'Projections', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Helmet>
        <title>Dynamic Revenue Sharing Configuration Center | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Revenue Sharing Configuration
              </h1>
              <p className="text-gray-600">
                Dynamic creator/platform revenue split management with real-time modification capabilities
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Last Updated</div>
              <div className="text-lg font-semibold text-gray-900">
                {lastUpdated?.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            message?.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <AlertCircle className="w-5 h-5" />
            <span>{message?.text}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg mb-6">
          <div className="flex overflow-x-auto border-b border-gray-200">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab?.id
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' :'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
          {activeTab === 'dashboard' && (
            <DashboardPanel 
              globalConfig={globalConfig}
              campaigns={campaigns}
              creatorOverrides={creatorOverrides}
              loading={loading}
            />
          )}

          {activeTab === 'global-split' && (
            <GlobalSplitPanel 
              globalConfig={globalConfig}
              onUpdate={handleUpdateGlobalSplit}
              loading={loading}
            />
          )}

          {activeTab === 'campaigns' && (
            <CampaignsPanel 
              campaigns={campaigns}
              onCreate={handleCreateCampaign}
              onUpdate={handleUpdateCampaign}
              loading={loading}
            />
          )}

          {activeTab === 'creator-overrides' && (
            <CreatorOverridesPanel 
              overrides={creatorOverrides}
              loading={loading}
            />
          )}

          {activeTab === 'history' && (
            <HistoryPanel 
              history={history}
              loading={loading}
            />
          )}

          {activeTab === 'projections' && (
            <ProjectionsPanel 
              globalConfig={globalConfig}
              campaigns={campaigns}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Dashboard Panel
const DashboardPanel = ({ globalConfig, campaigns, creatorOverrides, loading }) => {
  const activeCampaigns = campaigns?.filter(c => c?.status === 'active') || [];
  const scheduledCampaigns = campaigns?.filter(c => c?.status === 'scheduled') || [];

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Current Global Split */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-indigo-600" />
          Current Global Split
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
            <div>
              <div className="text-sm text-gray-600">Creator Share</div>
              <div className="text-3xl font-bold text-green-600">
                {globalConfig?.creatorPercentage || 70}%
              </div>
            </div>
            <TrendingUp className="w-12 h-12 text-green-600 opacity-20" />
          </div>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
            <div>
              <div className="text-sm text-gray-600">Platform Share</div>
              <div className="text-3xl font-bold text-blue-600">
                {globalConfig?.platformPercentage || 30}%
              </div>
            </div>
            <Target className="w-12 h-12 text-blue-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Active Campaigns */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-indigo-600" />
          Active Campaigns
        </h3>
        <div className="space-y-3">
          {activeCampaigns?.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No active campaigns</p>
          ) : (
            activeCampaigns?.map((campaign) => (
              <div key={campaign?.id} className="p-4 bg-purple-50 rounded-xl">
                <div className="font-semibold text-gray-900">{campaign?.campaignName}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {campaign?.creatorPercentage}% / {campaign?.platformPercentage}% split
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Ends: {new Date(campaign?.endDate)?.toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="text-sm text-gray-600">Total Campaigns</div>
            <div className="text-2xl font-bold text-gray-900">{campaigns?.length || 0}</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="text-sm text-gray-600">Active Campaigns</div>
            <div className="text-2xl font-bold text-green-600">{activeCampaigns?.length || 0}</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="text-sm text-gray-600">Scheduled</div>
            <div className="text-2xl font-bold text-blue-600">{scheduledCampaigns?.length || 0}</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="text-sm text-gray-600">Creator Overrides</div>
            <div className="text-2xl font-bold text-purple-600">{creatorOverrides?.length || 0}</div>
          </div>
        </div>
      </div>

      {/* Revenue Impact */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-indigo-600" />
          Revenue Impact Projection
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Projected Creator Earnings</span>
            <span className="font-bold text-green-600">$45,280</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Projected Platform Revenue</span>
            <span className="font-bold text-blue-600">$19,406</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t">
            <span className="text-gray-900 font-semibold">Total Revenue</span>
            <span className="font-bold text-indigo-600">$64,686</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Global Split Configuration Panel
const GlobalSplitPanel = ({ globalConfig, onUpdate, loading }) => {
  const [creatorPercentage, setCreatorPercentage] = useState(70);
  const [platformPercentage, setPlatformPercentage] = useState(30);
  const [changeReason, setChangeReason] = useState('strategic_adjustment');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (globalConfig) {
      setCreatorPercentage(globalConfig?.creatorPercentage || 70);
      setPlatformPercentage(globalConfig?.platformPercentage || 30);
    }
  }, [globalConfig]);

  const handleCreatorChange = (value) => {
    const creator = parseFloat(value);
    setCreatorPercentage(creator);
    setPlatformPercentage(100 - creator);
  };

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(creatorPercentage, platformPercentage, changeReason);
    setSaving(false);
  };

  if (loading) {
    return <div className="text-center py-12">Loading configuration...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Global Revenue Split Configuration</h3>
      
      <div className="space-y-6">
        {/* Creator Percentage Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Creator Percentage: {creatorPercentage}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={creatorPercentage}
            onChange={(e) => handleCreatorChange(e?.target?.value)}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Platform Percentage (Auto-calculated) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Platform Percentage: {platformPercentage}%
          </label>
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="text-sm text-gray-600">Automatically calculated to ensure 100% total</div>
          </div>
        </div>

        {/* Change Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Change Reason
          </label>
          <select
            value={changeReason}
            onChange={(e) => setChangeReason(e?.target?.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="morale_booster">Morale Booster</option>
            <option value="strategic_adjustment">Strategic Adjustment</option>
            <option value="campaign_launch">Campaign Launch</option>
            <option value="performance_incentive">Performance Incentive</option>
            <option value="market_conditions">Market Conditions</option>
            <option value="manual_override">Manual Override</option>
          </select>
        </div>

        {/* Preview */}
        <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
          <h4 className="font-semibold text-gray-900 mb-3">Preview Impact</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">On $1,000 revenue</div>
              <div className="text-lg font-bold text-green-600">
                Creator: ${(1000 * creatorPercentage / 100)?.toFixed(2)}
              </div>
              <div className="text-lg font-bold text-blue-600">
                Platform: ${(1000 * platformPercentage / 100)?.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">On $10,000 revenue</div>
              <div className="text-lg font-bold text-green-600">
                Creator: ${(10000 * creatorPercentage / 100)?.toFixed(2)}
              </div>
              <div className="text-lg font-bold text-blue-600">
                Platform: ${(10000 * platformPercentage / 100)?.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full px-6 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Global Configuration'}
        </button>
      </div>
    </div>
  );
};

// Campaigns Management Panel
const CampaignsPanel = ({ campaigns, onCreate, onUpdate, loading }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    campaignName: '',
    campaignDescription: '',
    creatorPercentage: 90,
    platformPercentage: 10,
    startDate: '',
    endDate: '',
    campaignObjectives: ''
  });

  const handleCreate = async () => {
    await onCreate(formData);
    setShowCreateForm(false);
    setFormData({
      campaignName: '',
      campaignDescription: '',
      creatorPercentage: 90,
      platformPercentage: 10,
      startDate: '',
      endDate: '',
      campaignObjectives: ''
    });
  };

  if (loading) {
    return <div className="text-center py-12">Loading campaigns...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Create Campaign Button */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="w-full px-6 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
        >
          {showCreateForm ? 'Cancel' : 'Create New Campaign'}
        </button>
      </div>

      {/* Create Campaign Form */}
      {showCreateForm && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Create Revenue Sharing Campaign</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
              <input
                type="text"
                value={formData?.campaignName}
                onChange={(e) => setFormData({ ...formData, campaignName: e?.target?.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Morale Booster Month"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData?.campaignDescription}
                onChange={(e) => setFormData({ ...formData, campaignDescription: e?.target?.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                rows="3"
                placeholder="Campaign description and objectives"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Creator %: {formData?.creatorPercentage}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData?.creatorPercentage}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    creatorPercentage: parseFloat(e?.target?.value),
                    platformPercentage: 100 - parseFloat(e?.target?.value)
                  })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform %: {formData?.platformPercentage}%
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-center font-semibold">
                  {formData?.platformPercentage}%
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="datetime-local"
                  value={formData?.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e?.target?.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="datetime-local"
                  value={formData?.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e?.target?.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <button
              onClick={handleCreate}
              className="w-full px-6 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
            >
              Create Campaign
            </button>
          </div>
        </div>
      )}

      {/* Campaigns List */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">All Campaigns</h3>
        <div className="space-y-3">
          {campaigns?.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No campaigns created yet</p>
          ) : (
            campaigns?.map((campaign) => (
              <div key={campaign?.id} className="p-4 border border-gray-200 rounded-xl hover:border-indigo-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{campaign?.campaignName}</div>
                    <div className="text-sm text-gray-600 mt-1">{campaign?.campaignDescription}</div>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-green-600 font-semibold">
                        Creator: {campaign?.creatorPercentage}%
                      </span>
                      <span className="text-blue-600 font-semibold">
                        Platform: {campaign?.platformPercentage}%
                      </span>
                      <span className="text-gray-500">
                        {new Date(campaign?.startDate)?.toLocaleDateString()} - {new Date(campaign?.endDate)?.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    campaign?.status === 'active' ? 'bg-green-100 text-green-800' :
                    campaign?.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    campaign?.status === 'completed'? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {campaign?.status}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Creator Overrides Panel
const CreatorOverridesPanel = ({ overrides, loading }) => {
  if (loading) {
    return <div className="text-center py-12">Loading creator overrides...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Per-Creator Custom Splits</h3>
      <div className="space-y-3">
        {overrides?.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No creator overrides configured</p>
        ) : (
          overrides?.map((override) => (
            <div key={override?.id} className="p-4 border border-gray-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                    {override?.creator?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{override?.creator?.name}</div>
                    <div className="text-sm text-gray-600">@{override?.creator?.username}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Custom Split</div>
                  <div className="font-bold text-indigo-600">
                    {override?.creatorPercentage}% / {override?.platformPercentage}%
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// History Panel
const HistoryPanel = ({ history, loading }) => {
  if (loading) {
    return <div className="text-center py-12">Loading history...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Revenue Sharing Change History</h3>
      <div className="space-y-3">
        {history?.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No history available</p>
        ) : (
          history?.map((entry) => (
            <div key={entry?.id} className="p-4 border border-gray-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{entry?.changeType?.replace('_', ' ')?.toUpperCase()}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {entry?.previousCreatorPercentage}% → {entry?.newCreatorPercentage}% (Creator)
                  </div>
                  <div className="text-sm text-gray-600">
                    {entry?.previousPlatformPercentage}% → {entry?.newPlatformPercentage}% (Platform)
                  </div>
                  {entry?.changeDescription && (
                    <div className="text-sm text-gray-500 mt-1">{entry?.changeDescription}</div>
                  )}
                </div>
                <div className="text-right text-sm text-gray-500">
                  {new Date(entry?.changedAt)?.toLocaleString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Projections Panel
const ProjectionsPanel = ({ globalConfig, campaigns, loading }) => {
  if (loading) {
    return <div className="text-center py-12">Loading projections...</div>;
  }

  const projections = [
    { period: '7 Days', creatorEarnings: 12500, platformRevenue: 5357, total: 17857 },
    { period: '30 Days', creatorEarnings: 45280, platformRevenue: 19406, total: 64686 },
    { period: '90 Days', creatorEarnings: 128400, platformRevenue: 55029, total: 183429 }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Revenue Impact Projections</h3>
      <div className="space-y-4">
        {projections?.map((proj, index) => (
          <div key={index} className="p-6 border border-gray-200 rounded-xl">
            <div className="font-semibold text-gray-900 mb-3">{proj?.period} Projection</div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-600">Creator Earnings</div>
                <div className="text-xl font-bold text-green-600">${proj?.creatorEarnings?.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Platform Revenue</div>
                <div className="text-xl font-bold text-blue-600">${proj?.platformRevenue?.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Revenue</div>
                <div className="text-xl font-bold text-indigo-600">${proj?.total?.toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicRevenueSharingConfigurationCenter;