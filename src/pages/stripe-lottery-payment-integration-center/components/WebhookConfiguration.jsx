import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { webhookService } from '../../../services/webhookService';

const WebhookConfiguration = ({ data, onRefresh }) => {
  const [showAddWebhook, setShowAddWebhook] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const availableEvents = webhookService?.getAvailableEventTypes();
  const configuredWebhooks = data?.webhooks || [];

  const handleAddWebhook = async () => {
    if (!webhookUrl || selectedEvents?.length === 0) return;

    setLoading(true);
    try {
      await webhookService?.configureWebhook({
        webhookUrl,
        eventTypes: selectedEvents,
        description
      });
      setShowAddWebhook(false);
      setWebhookUrl('');
      setSelectedEvents([]);
      setDescription('');
      onRefresh();
    } catch (error) {
      console.error('Failed to add webhook:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEvent = (eventId) => {
    setSelectedEvents(prev => 
      prev?.includes(eventId) 
        ? prev?.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Add Webhook Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Webhook Configurations</h2>
          <p className="text-sm text-gray-600 mt-1">Configure external integrations with event notifications</p>
        </div>
        <Button onClick={() => setShowAddWebhook(!showAddWebhook)}>
          <Icon name="Plus" className="w-4 h-4 mr-2" />
          Add Webhook
        </Button>
      </div>
      {/* Add Webhook Form */}
      {showAddWebhook && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Configure New Webhook</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook URL
              </label>
              <Input
                type="url"
                placeholder="https://your-domain.com/webhook"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e?.target?.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <Input
                type="text"
                placeholder="Production webhook for payment notifications"
                value={description}
                onChange={(e) => setDescription(e?.target?.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Events to Subscribe
              </label>
              <div className="space-y-2">
                {availableEvents?.map((event) => (
                  <div key={event?.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={selectedEvents?.includes(event?.id)}
                      onChange={() => handleToggleEvent(event?.id)}
                      className="mt-1 w-4 h-4 text-blue-600 rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{event?.name}</p>
                      <p className="text-sm text-gray-600">{event?.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={handleAddWebhook} disabled={loading || !webhookUrl || selectedEvents?.length === 0}>
                {loading ? (
                  <Icon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Icon name="Check" className="w-4 h-4 mr-2" />
                )}
                Create Webhook
              </Button>
              <Button variant="outline" onClick={() => setShowAddWebhook(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Available Event Types */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Event Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableEvents?.map((event) => (
            <div key={event?.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Zap" className="w-5 h-5 text-blue-600" />
                <p className="font-semibold text-gray-900">{event?.name}</p>
              </div>
              <p className="text-sm text-gray-600 mb-3">{event?.description}</p>
              <div className="bg-gray-50 rounded p-2">
                <p className="text-xs font-mono text-gray-700">
                  {JSON.stringify(event?.payload, null, 2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Configured Webhooks */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Webhooks</h3>
        {configuredWebhooks?.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Webhook" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No webhooks configured yet</p>
            <Button onClick={() => setShowAddWebhook(true)} variant="outline" className="mt-4">
              Add Your First Webhook
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {configuredWebhooks?.map((webhook) => (
              <div key={webhook?.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Icon name="Webhook" className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{webhook?.webhookUrl}</p>
                      <p className="text-sm text-gray-600">{webhook?.description || 'No description'}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    webhook?.isActive 
                      ? 'bg-green-100 text-green-800' :'bg-gray-100 text-gray-800'
                  }`}>
                    {webhook?.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {webhook?.eventType}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Webhook Delivery Logs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Webhook Deliveries</h3>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5]?.map((item) => (
            <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Icon name="CheckCircle" className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">vote.cast</p>
                  <p className="text-xs text-gray-600">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">200 OK</span>
                <span className="text-xs text-gray-500">142ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebhookConfiguration;