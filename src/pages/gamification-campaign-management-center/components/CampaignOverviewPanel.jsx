import React, { useState } from 'react';
import { Plus, Calendar, DollarSign, Trophy, Trash2, Power, PowerOff } from 'lucide-react';
import { platformGamificationService } from '../../../services/platformGamificationService';

export default function CampaignOverviewPanel({ campaigns, selectedCampaign, onCampaignSelect, onRefresh }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    campaign_name: '',
    custom_prize_name: 'Vottery Prize',
    prize_pool_amount: 0,
    frequency: 'monthly',
    start_date: '',
    end_date: '',
    drawing_date: '',
    prize_tiers: []
  });

  const handleCreateCampaign = async () => {
    const result = await platformGamificationService?.createCampaign(newCampaign);
    if (result?.success) {
      setShowCreateModal(false);
      onRefresh();
      setNewCampaign({
        campaign_name: '',
        custom_prize_name: 'Vottery Prize',
        prize_pool_amount: 0,
        frequency: 'monthly',
        start_date: '',
        end_date: '',
        drawing_date: '',
        prize_tiers: []
      });
    }
  };

  const handleToggleCampaign = async (campaignId, currentStatus) => {
    await platformGamificationService?.updateCampaign(campaignId, {
      is_enabled: !currentStatus
    });
    onRefresh();
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      await platformGamificationService?.deleteCampaign(campaignId);
      onRefresh();
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      active: 'bg-green-100 text-green-700',
      drawing: 'bg-blue-100 text-blue-700',
      completed: 'bg-purple-100 text-purple-700',
      disabled: 'bg-red-100 text-red-700'
    };
    return colors?.[status] || colors?.draft;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Active Campaigns</h2>
          <p className="text-gray-600 mt-1">Manage platform-wide gamification campaigns</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Create Campaign
        </button>
      </div>
      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {campaigns?.map((campaign) => (
          <div
            key={campaign?.id}
            className={`bg-white border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg ${
              selectedCampaign?.id === campaign?.id
                ? 'border-purple-500 shadow-lg'
                : 'border-gray-200'
            }`}
            onClick={() => onCampaignSelect(campaign)}
          >
            {/* Campaign Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{campaign?.campaign_name}</h3>
                <p className="text-sm text-gray-600 mt-1">{campaign?.custom_prize_name}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(campaign?.status)}`}>
                {campaign?.status}
              </span>
            </div>

            {/* Prize Pool */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Prize Pool</span>
              </div>
              <p className="text-3xl font-bold text-purple-600">
                ${parseFloat(campaign?.prize_pool_amount || 0)?.toLocaleString()}
              </p>
            </div>

            {/* Campaign Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Start:</span>
                <span className="font-medium text-gray-900">
                  {new Date(campaign.start_date)?.toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">End:</span>
                <span className="font-medium text-gray-900">
                  {new Date(campaign.end_date)?.toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Trophy className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Winners:</span>
                <span className="font-medium text-gray-900">{campaign?.total_winners || 0}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
              <button
                onClick={(e) => {
                  e?.stopPropagation();
                  handleToggleCampaign(campaign?.id, campaign?.is_enabled);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  campaign?.is_enabled
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {campaign?.is_enabled ? (
                  <Power className="w-4 h-4" />
                ) : (
                  <PowerOff className="w-4 h-4" />
                )}
                {campaign?.is_enabled ? 'Enabled' : 'Disabled'}
              </button>
              <button
                onClick={(e) => {
                  e?.stopPropagation();
                  handleDeleteCampaign(campaign?.id);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {campaigns?.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No campaigns yet</h3>
          <p className="text-gray-600 mb-6">Create your first gamification campaign to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            Create Campaign
          </button>
        </div>
      )}
      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">Create New Campaign</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                <input
                  type="text"
                  value={newCampaign?.campaign_name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, campaign_name: e?.target?.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="January 2026 Platform Gamification"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Custom Prize Name</label>
                <input
                  type="text"
                  value={newCampaign?.custom_prize_name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, custom_prize_name: e?.target?.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Vottery UBI"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prize Pool Amount ($)</label>
                <input
                  type="number"
                  value={newCampaign?.prize_pool_amount}
                  onChange={(e) => setNewCampaign({ ...newCampaign, prize_pool_amount: parseFloat(e?.target?.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="23000000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                <select
                  value={newCampaign?.frequency}
                  onChange={(e) => setNewCampaign({ ...newCampaign, frequency: e?.target?.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={newCampaign?.start_date}
                    onChange={(e) => setNewCampaign({ ...newCampaign, start_date: e?.target?.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={newCampaign?.end_date}
                    onChange={(e) => setNewCampaign({ ...newCampaign, end_date: e?.target?.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Drawing Date</label>
                  <input
                    type="date"
                    value={newCampaign?.drawing_date}
                    onChange={(e) => setNewCampaign({ ...newCampaign, drawing_date: e?.target?.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCampaign}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}