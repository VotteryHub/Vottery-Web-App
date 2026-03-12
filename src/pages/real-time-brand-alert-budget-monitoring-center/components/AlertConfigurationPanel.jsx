import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { alertService } from '../../../services/alertService';
import { analytics } from '../../../hooks/useGoogleAnalytics';

const AlertConfigurationPanel = ({ alerts, onRefresh }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    ruleName: '',
    threshold: 90,
    channels: ['email'],
    severity: 'high',
    escalationLevel: 'immediate'
  });

  const handleCreateAlert = async () => {
    try {
      setCreating(true);
      
      const result = await alertService?.createAlertRule({
        ruleName: formData?.ruleName,
        category: 'budget',
        severity: formData?.severity,
        conditions: {
          threshold: formData?.threshold,
          metric: 'budget_spend_percentage'
        },
        actions: {
          channels: formData?.channels,
          escalationLevel: formData?.escalationLevel
        },
        isEnabled: true
      });

      if (result?.error) {
        throw new Error(result?.error?.message);
      }

      analytics?.trackEvent('budget_alert_rule_created', {
        threshold: formData?.threshold,
        channels: formData?.channels,
        severity: formData?.severity
      });

      setShowCreateForm(false);
      setFormData({
        ruleName: '',
        threshold: 90,
        channels: ['email'],
        severity: 'high',
        escalationLevel: 'immediate'
      });
      onRefresh?.();
    } catch (error) {
      console.error('Failed to create alert rule:', error);
      alert('Failed to create alert rule. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleAlert = async (alertId, isEnabled) => {
    try {
      await alertService?.updateAlertRule(alertId, { isEnabled: !isEnabled });
      analytics?.trackEvent('budget_alert_toggled', {
        alert_id: alertId,
        new_status: !isEnabled
      });
      onRefresh?.();
    } catch (error) {
      console.error('Failed to toggle alert:', error);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
            <Icon name="Bell" className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Alert Configuration</h2>
            <p className="text-sm text-muted-foreground">90% threshold triggers and notification channels</p>
          </div>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          size="sm"
          variant="outline"
        >
          <Icon name="Plus" className="w-4 h-4 mr-2" />
          New Rule
        </Button>
      </div>
      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-background border border-border rounded-lg p-4 mb-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Create Alert Rule</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Rule Name</label>
              <Input
                value={formData?.ruleName}
                onChange={(e) => setFormData({ ...formData, ruleName: e?.target?.value })}
                placeholder="e.g., Budget 90% Alert"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Threshold (%)</label>
              <Input
                type="number"
                value={formData?.threshold}
                onChange={(e) => setFormData({ ...formData, threshold: parseInt(e?.target?.value) })}
                min="50"
                max="100"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Notification Channels</label>
              <div className="space-y-2">
                {['email', 'slack', 'discord', 'sms']?.map((channel) => (
                  <label key={channel} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData?.channels?.includes(channel)}
                      onChange={(e) => {
                        if (e?.target?.checked) {
                          setFormData({ ...formData, channels: [...formData?.channels, channel] });
                        } else {
                          setFormData({ ...formData, channels: formData?.channels?.filter(c => c !== channel) });
                        }
                      }}
                      className="rounded border-border"
                    />
                    <span className="text-sm text-foreground capitalize">{channel}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Severity</label>
              <Select
                value={formData?.severity}
                onChange={(e) => setFormData({ ...formData, severity: e?.target?.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </Select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleCreateAlert}
                disabled={creating || !formData?.ruleName}
                className="flex-1"
              >
                {creating ? 'Creating...' : 'Create Rule'}
              </Button>
              <Button
                onClick={() => setShowCreateForm(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Alert Rules List */}
      <div className="space-y-3">
        {alerts?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Bell" className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No alert rules configured</p>
            <p className="text-sm">Create your first budget alert rule</p>
          </div>
        ) : (
          alerts?.map((alert) => (
            <div
              key={alert?.id}
              className="bg-background border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-foreground">{alert?.ruleName}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      alert?.severity === 'critical' ? 'bg-destructive/10 text-destructive' :
                      alert?.severity === 'high'? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'
                    }`}>
                      {alert?.severity}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Threshold: {alert?.conditions?.threshold}%</p>
                    <p>Channels: {alert?.actions?.channels?.join(', ')}</p>
                  </div>
                </div>
                <Button
                  onClick={() => handleToggleAlert(alert?.id, alert?.isEnabled)}
                  size="sm"
                  variant={alert?.isEnabled ? 'default' : 'outline'}
                >
                  {alert?.isEnabled ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertConfigurationPanel;