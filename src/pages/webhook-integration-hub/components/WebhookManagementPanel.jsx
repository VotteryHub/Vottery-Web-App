import React, { useState } from 'react';
import { Webhook, Plus, Edit, Trash2, Power, CheckCircle, XCircle } from 'lucide-react';
import { webhookService } from '../../../services/webhookService';

const WebhookManagementPanel = ({ webhooks, onRefresh }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [],
    authMethod: 'none',
    maxRetries: 3
  });

  const handleCreateWebhook = async () => {
    try {
      const result = await webhookService?.registerWebhook(newWebhook);
      if (result?.data) {
        setShowCreateModal(false);
        setNewWebhook({ name: '', url: '', events: [], authMethod: 'none', maxRetries: 3 });
        onRefresh?.();
      }
    } catch (error) {
      console.error('Failed to create webhook:', error);
    }
  };

  const handleToggleWebhook = async (webhookId, currentStatus) => {
    try {
      await webhookService?.updateWebhook(webhookId, { isActive: !currentStatus });
      onRefresh?.();
    } catch (error) {
      console.error('Failed to toggle webhook:', error);
    }
  };

  const handleDeleteWebhook = async (webhookId) => {
    if (confirm('Are you sure you want to delete this webhook?')) {
      try {
        await webhookService?.deleteWebhook(webhookId);
        onRefresh?.();
      } catch (error) {
        console.error('Failed to delete webhook:', error);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Webhook Management</h2>
          <p className="text-gray-600">Registered endpoints with URL validation and authentication</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Webhook
        </button>
      </div>

      {webhooks?.length === 0 ? (
        <div className="text-center py-12">
          <Webhook className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No webhooks configured</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Create Your First Webhook
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {webhooks?.map((webhook) => (
            <div key={webhook?.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{webhook?.name}</h3>
                    {webhook?.isActive ? (
                      <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        <CheckCircle className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                        <XCircle className="w-3 h-3" />
                        Inactive
                      </span>
                    )}
                  </div>
                  <code className="text-sm text-gray-600 block mb-2">{webhook?.url}</code>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Events: {webhook?.events?.length}</span>
                    <span>Auth: {webhook?.authMethod}</span>
                    <span>Max Retries: {webhook?.retryConfig?.maxRetries || 3}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleWebhook(webhook?.id, webhook?.isActive)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Power className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteWebhook(webhook?.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Webhook Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Webhook</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Webhook Name</label>
                <input
                  type="text"
                  value={newWebhook?.name}
                  onChange={(e) => setNewWebhook({ ...newWebhook, name: e?.target?.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="My Webhook"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
                <input
                  type="url"
                  value={newWebhook?.url}
                  onChange={(e) => setNewWebhook({ ...newWebhook, url: e?.target?.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="https://example.com/webhook"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Authentication Method</label>
                <select
                  value={newWebhook?.authMethod}
                  onChange={(e) => setNewWebhook({ ...newWebhook, authMethod: e?.target?.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="none">None</option>
                  <option value="api_key">API Key</option>
                  <option value="signature">Signature</option>
                  <option value="oauth">OAuth</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleCreateWebhook}
                className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Create Webhook
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebhookManagementPanel;