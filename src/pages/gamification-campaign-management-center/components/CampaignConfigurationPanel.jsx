import React, { useState, useEffect } from 'react';
import { Settings, Upload, Save, DollarSign, Plus, Trash2 } from 'lucide-react';
import { platformGamificationService } from '../../../services/platformGamificationService';

export default function CampaignConfigurationPanel({ campaign, onUpdate }) {
  const [config, setConfig] = useState({
    custom_prize_name: '',
    prize_pool_amount: 0,
    branding_logo_url: '',
    sponsor_name: '',
    display_position: 'home_feed',
    prize_tiers: []
  });
  const [newTier, setNewTier] = useState({ tier: '', amount: 0, count: 0 });

  useEffect(() => {
    if (campaign) {
      setConfig({
        custom_prize_name: campaign?.custom_prize_name || '',
        prize_pool_amount: campaign?.prize_pool_amount || 0,
        branding_logo_url: campaign?.branding_logo_url || '',
        sponsor_name: campaign?.sponsor_name || '',
        display_position: campaign?.display_position || 'home_feed',
        prize_tiers: campaign?.prize_tiers || []
      });
    }
  }, [campaign]);

  const handleSave = async () => {
    if (!campaign) return;
    
    const result = await platformGamificationService?.updateCampaign(campaign?.id, config);
    if (result?.success) {
      onUpdate();
    }
  };

  const handleAddTier = () => {
    if (newTier?.tier && newTier?.amount > 0 && newTier?.count > 0) {
      setConfig({
        ...config,
        prize_tiers: [...config?.prize_tiers, newTier]
      });
      setNewTier({ tier: '', amount: 0, count: 0 });
    }
  };

  const handleRemoveTier = (index) => {
    const updatedTiers = config?.prize_tiers?.filter((_, i) => i !== index);
    setConfig({ ...config, prize_tiers: updatedTiers });
  };

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">Select a campaign to configure</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Campaign Configuration</h2>
          <p className="text-gray-600 mt-1">Customize prize naming, branding, and display settings</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </div>
      <div className="space-y-6">
        {/* Prize Naming */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Prize Naming & Branding</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Prize Name
              </label>
              <input
                type="text"
                value={config?.custom_prize_name}
                onChange={(e) => setConfig({ ...config, custom_prize_name: e?.target?.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Vottery UBI, Made Millionaires, etc."
              />
              <p className="text-xs text-gray-500 mt-1">
                Customize the prize name to match your brand or campaign theme
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sponsor Name
              </label>
              <input
                type="text"
                value={config?.sponsor_name}
                onChange={(e) => setConfig({ ...config, sponsor_name: e?.target?.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="In Association with..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branding Logo URL
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={config?.branding_logo_url}
                  onChange={(e) => setConfig({ ...config, branding_logo_url: e?.target?.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com/logo.png"
                />
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all">
                  <Upload className="w-4 h-4" />
                  Upload
                </button>
              </div>
              {config?.branding_logo_url && (
                <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                  <img
                    src={config?.branding_logo_url}
                    alt="Brand Logo"
                    className="h-16 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Prize Pool */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Prize Pool Configuration</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Prize Pool Amount ($)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={config?.prize_pool_amount}
                onChange={(e) => setConfig({ ...config, prize_pool_amount: parseFloat(e?.target?.value) })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-2xl font-bold"
                placeholder="23000000"
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Current: <span className="font-bold text-purple-600">
                ${parseFloat(config?.prize_pool_amount || 0)?.toLocaleString()}
              </span>
            </p>
          </div>
        </div>

        {/* Prize Tiers */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Prize Tiers</h3>
          
          {/* Existing Tiers */}
          <div className="space-y-3 mb-4">
            {config?.prize_tiers?.map((tier, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-gray-600">Tier Name</p>
                    <p className="font-semibold text-gray-900">{tier?.tier}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Prize Amount</p>
                    <p className="font-semibold text-gray-900">${tier?.amount?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Winners</p>
                    <p className="font-semibold text-gray-900">{tier?.count}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveTier(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Tier */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Add New Tier</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                value={newTier?.tier}
                onChange={(e) => setNewTier({ ...newTier, tier: e?.target?.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Tier (e.g., 1M)"
              />
              <input
                type="number"
                value={newTier?.amount}
                onChange={(e) => setNewTier({ ...newTier, amount: parseFloat(e?.target?.value) })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Amount"
              />
              <input
                type="number"
                value={newTier?.count}
                onChange={(e) => setNewTier({ ...newTier, count: parseInt(e?.target?.value) })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Count"
              />
              <button
                onClick={handleAddTier}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Tier
              </button>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Display Settings</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Position
            </label>
            <select
              value={config?.display_position}
              onChange={(e) => setConfig({ ...config, display_position: e?.target?.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="home_feed">Home Feed (Top)</option>
              <option value="profile_page">Profile Page</option>
              <option value="both">Both Locations</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}