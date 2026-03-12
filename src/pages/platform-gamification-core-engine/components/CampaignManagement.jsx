import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

export default function CampaignManagement({ onCampaignSelect }) {
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: 'January 2026 Gamification',
      prizePool: 23000000,
      status: 'active',
      startDate: '2026-01-01',
      endDate: '2026-01-31',
      frequency: 'monthly',
      eligibleUsers: 45892,
      winnersCount: 203,
      customPrizeName: 'Vottery UBI',
      brandingLogo: null
    }
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    prizePool: 0,
    frequency: 'monthly',
    customPrizeName: 'Vottery Prize',
    startDate: '',
    endDate: ''
  });

  const createCampaign = () => {
    const campaign = {
      id: Date.now(),
      ...newCampaign,
      status: 'draft',
      eligibleUsers: 0,
      winnersCount: 0,
      brandingLogo: null
    };
    setCampaigns(prev => [...prev, campaign]);
    setShowCreateModal(false);
    setNewCampaign({
      name: '',
      prizePool: 0,
      frequency: 'monthly',
      customPrizeName: 'Vottery Prize',
      startDate: '',
      endDate: ''
    });
  };

  const updateCampaignStatus = (id, status) => {
    setCampaigns(prev => prev?.map(c => c?.id === id ? { ...c, status } : c));
  };

  const deleteCampaign = (id) => {
    setCampaigns(prev => prev?.filter(c => c?.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Campaign Management
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Create and manage gamification campaigns with flexible prize naming and branding
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Icon name="Plus" className="w-5 h-5" />
          New Campaign
        </button>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {campaigns?.map(campaign => (
          <div
            key={campaign?.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-purple-600"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {campaign?.name}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    campaign?.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    campaign?.status === 'draft'? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {campaign?.status?.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Prize Pool</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      ${campaign?.prizePool?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Prize Name</p>
                    <p className="text-lg font-semibold text-purple-600">
                      {campaign?.customPrizeName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Eligible Users</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {campaign?.eligibleUsers?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Winners</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {campaign?.winnersCount}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Icon name="Calendar" className="w-4 h-4" />
                    <span>{campaign?.startDate} to {campaign?.endDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Clock" className="w-4 h-4" />
                    <span className="capitalize">{campaign?.frequency}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => onCampaignSelect?.(campaign)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="Select Campaign"
                >
                  <Icon name="Eye" className="w-5 h-5" />
                </button>
                {campaign?.status === 'draft' && (
                  <button
                    onClick={() => updateCampaignStatus(campaign?.id, 'active')}
                    className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    title="Activate Campaign"
                  >
                    <Icon name="Play" className="w-5 h-5" />
                  </button>
                )}
                {campaign?.status === 'active' && (
                  <button
                    onClick={() => updateCampaignStatus(campaign?.id, 'paused')}
                    className="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                    title="Pause Campaign"
                  >
                    <Icon name="Pause" className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => deleteCampaign(campaign?.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete Campaign"
                >
                  <Icon name="Trash2" className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Create New Campaign
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={newCampaign?.name}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e?.target?.value }))}
                  placeholder="e.g., February 2026 Gamification"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom Prize Name
                </label>
                <input
                  type="text"
                  value={newCampaign?.customPrizeName}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, customPrizeName: e?.target?.value }))}
                  placeholder="e.g., Vottery UBI, Made Millionaires"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Total Prize Pool ($)
                </label>
                <input
                  type="number"
                  value={newCampaign?.prizePool}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, prizePool: parseFloat(e?.target?.value) || 0 }))}
                  placeholder="23000000"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frequency
                </label>
                <select
                  value={newCampaign?.frequency}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, frequency: e?.target?.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newCampaign?.startDate}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, startDate: e?.target?.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={newCampaign?.endDate}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, endDate: e?.target?.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createCampaign}
                disabled={!newCampaign?.name || !newCampaign?.prizePool}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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