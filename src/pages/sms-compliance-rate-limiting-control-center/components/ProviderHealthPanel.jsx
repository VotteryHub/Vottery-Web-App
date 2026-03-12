import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProviderHealthPanel = ({ providerState, healthMetrics, onManualFailover, onRefresh }) => {
  const [switching, setSwitching] = useState(false);

  const handleSwitch = async (provider) => {
    try {
      setSwitching(true);
      await onManualFailover(provider);
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Provider Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Telnyx Card */}
        <div className={`card border-2 ${
          providerState?.activeProvider === 'telnyx' ? 'border-green-500' : 'border-border'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                <Icon name="Radio" size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-semibold text-foreground">Telnyx</h3>
                <p className="text-sm text-muted-foreground">Primary Provider</p>
              </div>
            </div>
            {providerState?.activeProvider === 'telnyx' && (
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                Active
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Health Status</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  healthMetrics?.telnyx?.healthy ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-sm font-medium text-foreground">
                  {healthMetrics?.telnyx?.healthy ? 'Healthy' : 'Unhealthy'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Response Time</span>
              <span className="text-sm font-medium text-foreground font-data">
                {healthMetrics?.telnyx?.responseTime || 0}ms
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Phone Number</span>
              <span className="text-sm font-medium text-foreground font-mono">
                +12345661030
              </span>
            </div>
          </div>

          {providerState?.activeProvider !== 'telnyx' && (
            <Button
              className="w-full mt-4"
              onClick={() => handleSwitch('telnyx')}
              disabled={switching || !healthMetrics?.telnyx?.healthy}
              iconName="ArrowRight"
            >
              Switch to Telnyx
            </Button>
          )}
        </div>

        {/* Twilio Card */}
        <div className={`card border-2 ${
          providerState?.activeProvider === 'twilio' ? 'border-orange-500' : 'border-border'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                <Icon name="Radio" size={24} className="text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-semibold text-foreground">Twilio</h3>
                <p className="text-sm text-muted-foreground">Fallback Provider</p>
              </div>
            </div>
            {providerState?.activeProvider === 'twilio' && (
              <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-sm font-medium">
                Active
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Health Status</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  healthMetrics?.twilio?.healthy ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-sm font-medium text-foreground">
                  {healthMetrics?.twilio?.healthy ? 'Healthy' : 'Unhealthy'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Response Time</span>
              <span className="text-sm font-medium text-foreground font-data">
                {healthMetrics?.twilio?.responseTime || 0}ms
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Restrictions</span>
              <span className="text-xs text-orange-600 dark:text-orange-400">
                No Gamification
              </span>
            </div>
          </div>

          {providerState?.activeProvider !== 'twilio' && (
            <Button
              className="w-full mt-4"
              variant="outline"
              onClick={() => handleSwitch('twilio')}
              disabled={switching || !healthMetrics?.twilio?.healthy}
              iconName="ArrowRight"
            >
              Switch to Twilio
            </Button>
          )}
        </div>
      </div>

      {/* Failover Information */}
      <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Automatic Failover System</h4>
            <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>AI-powered health monitoring detects Telnyx failures within 2 seconds</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Automatic switch to Twilio with zero downtime when Telnyx fails</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Twilio excludes gamification/lottery/prizes SMS (security/compliance only)</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Automatic switch back to Telnyx when service is restored</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Last Failover Info */}
      {providerState?.lastFailoverAt && (
        <div className="card">
          <h4 className="font-semibold text-foreground mb-3">Last Failover Event</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Time</span>
              <span className="text-sm font-medium text-foreground">
                {new Date(providerState?.lastFailoverAt)?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Reason</span>
              <span className="text-sm font-medium text-foreground">
                {providerState?.failoverReason || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderHealthPanel;
