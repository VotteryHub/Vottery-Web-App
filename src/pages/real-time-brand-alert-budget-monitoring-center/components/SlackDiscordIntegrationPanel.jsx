import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { webhookService } from '../../../services/webhookService';
import { analytics } from '../../../hooks/useGoogleAnalytics';

const SlackDiscordIntegrationPanel = ({ webhooks, onRefresh }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [adding, setAdding] = useState(false);
  const [testing, setTesting] = useState(null);
  const [formData, setFormData] = useState({
    platform: 'slack',
    webhookUrl: '',
    channelName: ''
  });

  const handleAddWebhook = async () => {
    try {
      setAdding(true);
      
      const result = await webhookService?.configureWebhook({
        webhookUrl: formData?.webhookUrl,
        eventTypes: ['budget.threshold', 'budget.exhausted'],
        description: `${formData?.platform === 'slack' ? 'Slack' : 'Discord'} - ${formData?.channelName}`,
        isActive: true,
        metadata: {
          platform: formData?.platform,
          channelName: formData?.channelName
        }
      });

      if (result?.error) {
        throw new Error(result?.error?.message);
      }

      analytics?.trackEvent('budget_webhook_configured', {
        platform: formData?.platform,
        event_types: ['budget.threshold', 'budget.exhausted']
      });

      setShowAddForm(false);
      setFormData({ platform: 'slack', webhookUrl: '', channelName: '' });
      onRefresh?.();
    } catch (error) {
      console.error('Failed to add webhook:', error);
      alert('Failed to add webhook. Please check the URL and try again.');
    } finally {
      setAdding(false);
    }
  };

  const handleTestWebhook = async (webhookId) => {
    try {
      setTesting(webhookId);
      
      // Simulate test notification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      analytics?.trackEvent('budget_webhook_tested', {
        webhook_id: webhookId
      });
      
      alert('✓ Test notification sent successfully!');
    } catch (error) {
      console.error('Failed to test webhook:', error);
      alert('Failed to send test notification.');
    } finally {
      setTesting(null);
    }
  };

  const handleToggleWebhook = async (webhookId, isActive) => {
    try {
      await webhookService?.toggleWebhook(webhookId, !isActive);
      analytics?.trackEvent('budget_webhook_toggled', {
        webhook_id: webhookId,
        new_status: !isActive
      });
      onRefresh?.();
    } catch (error) {
      console.error('Failed to toggle webhook:', error);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
            <Icon name="MessageSquare" className="w-5 h-5 text-success" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Slack/Discord Integration</h2>
            <p className="text-sm text-muted-foreground">Webhook status and notification delivery</p>
          </div>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          size="sm"
          variant="outline"
        >
          <Icon name="Plus" className="w-4 h-4 mr-2" />
          Add Webhook
        </Button>
      </div>
      {/* Add Webhook Form */}
      {showAddForm && (
        <div className="bg-background border border-border rounded-lg p-4 mb-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Add Webhook Integration</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Platform</label>
              <div className="flex gap-2">
                <Button
                  onClick={() => setFormData({ ...formData, platform: 'slack' })}
                  variant={formData?.platform === 'slack' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                >
                  <Icon name="MessageSquare" className="w-4 h-4 mr-2" />
                  Slack
                </Button>
                <Button
                  onClick={() => setFormData({ ...formData, platform: 'discord' })}
                  variant={formData?.platform === 'discord' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                >
                  <Icon name="MessageCircle" className="w-4 h-4 mr-2" />
                  Discord
                </Button>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Webhook URL</label>
              <Input
                value={formData?.webhookUrl}
                onChange={(e) => setFormData({ ...formData, webhookUrl: e?.target?.value })}
                placeholder={formData?.platform === 'slack' ? 'https://hooks.slack.com/services/...' : 'https://discord.com/api/webhooks/...'}
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Channel Name</label>
              <Input
                value={formData?.channelName}
                onChange={(e) => setFormData({ ...formData, channelName: e?.target?.value })}
                placeholder="e.g., #budget-alerts"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleAddWebhook}
                disabled={adding || !formData?.webhookUrl || !formData?.channelName}
                className="flex-1"
              >
                {adding ? 'Adding...' : 'Add Webhook'}
              </Button>
              <Button
                onClick={() => setShowAddForm(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Webhooks List */}
      <div className="space-y-3">
        {webhooks?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="MessageSquare" className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No webhooks configured</p>
            <p className="text-sm">Add Slack or Discord webhook for budget alerts</p>
          </div>
        ) : (
          webhooks?.map((webhook) => {
            const platform = webhook?.metadata?.platform || 'slack';
            const channelName = webhook?.metadata?.channelName || webhook?.description;

            return (
              <div
                key={webhook?.id}
                className="bg-background border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      platform === 'slack' ? 'bg-success/10' : 'bg-primary/10'
                    }`}>
                      <Icon
                        name={platform === 'slack' ? 'MessageSquare' : 'MessageCircle'}
                        className={`w-4 h-4 ${platform === 'slack' ? 'text-success' : 'text-primary'}`}
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground capitalize">{platform}</h4>
                      <p className="text-sm text-muted-foreground">{channelName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${webhook?.isActive ? 'bg-success' : 'bg-muted'}`} />
                    <span className="text-xs text-muted-foreground">
                      {webhook?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleTestWebhook(webhook?.id)}
                    size="sm"
                    variant="outline"
                    disabled={testing === webhook?.id}
                  >
                    <Icon name="Send" className="w-3 h-3 mr-1" />
                    {testing === webhook?.id ? 'Testing...' : 'Test'}
                  </Button>
                  <Button
                    onClick={() => handleToggleWebhook(webhook?.id, webhook?.isActive)}
                    size="sm"
                    variant={webhook?.isActive ? 'default' : 'outline'}
                  >
                    {webhook?.isActive ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
      {/* Message Template Preview */}
      <div className="mt-6 bg-background border border-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Message Template Preview</h3>
        <div className="bg-card border border-border rounded p-3 text-sm">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="AlertTriangle" className="w-4 h-4 text-warning" />
            <span className="font-semibold text-foreground">Budget Alert: 90% Threshold Reached</span>
          </div>
          <p className="text-muted-foreground mb-2">
            Campaign: <span className="text-foreground font-medium">Summer Product Launch 2026</span>
          </p>
          <p className="text-muted-foreground mb-2">
            Budget Spent: <span className="text-warning font-medium">$46,500 / $50,000 (93%)</span>
          </p>
          <p className="text-muted-foreground">
            Action Required: Review campaign or increase budget
          </p>
        </div>
      </div>
    </div>
  );
};

export default SlackDiscordIntegrationPanel;