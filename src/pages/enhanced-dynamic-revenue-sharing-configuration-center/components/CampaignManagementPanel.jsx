import React, { useState } from 'react';
import { Calendar, Plus, Play, Pause } from 'lucide-react';
import { revenueShareService } from '../../../services/revenueShareService';
import { analytics } from '../../../hooks/useGoogleAnalytics';

const CampaignManagementPanel = ({ campaigns, onRefresh, sandboxMode }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300';
      case 'scheduled':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300';
      case 'completed':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const handleToggleCampaign = async (campaignId, currentStatus) => {
    try {
      setLoading(true);
      const newStatus = currentStatus === 'active' ? 'scheduled' : 'active';
      const result = await revenueShareService?.updateCampaign(campaignId, { status: newStatus });
      
      if (result?.error) throw new Error(result?.error?.message);

      analytics?.trackEvent('campaign_status_toggled', {
        campaign_id: campaignId,
        new_status: newStatus
      });

      onRefresh();
    } catch (error) {
      console.error('Error toggling campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Revenue Sharing Campaigns
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Time-bound special revenue splits
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={sandboxMode}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Campaign
          </button>
        </div>

        <div className="space-y-4">
          {campaigns?.map((campaign) => (
            <div
              key={campaign?.id}
              className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-5 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {campaign?.campaignName}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(campaign?.status)}`}>
                      {campaign?.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {campaign?.campaignDescription}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleCampaign(campaign?.id, campaign?.status)}
                    disabled={loading || sandboxMode}
                    className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {campaign?.status === 'active' ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Creator Split</div>
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {campaign?.creatorPercentage}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Platform Split</div>
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {campaign?.platformPercentage}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Start Date</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(campaign?.startDate)?.toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">End Date</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(campaign?.endDate)?.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {campaigns?.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No campaigns created yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignManagementPanel;