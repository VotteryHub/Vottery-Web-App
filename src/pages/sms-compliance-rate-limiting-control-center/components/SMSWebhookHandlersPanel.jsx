import React from 'react';
import Icon from '../../../components/AppIcon';

const SMSWebhookHandlersPanel = () => {
  const webhookEndpoints = [
    {
      id: 1,
      provider: 'telnyx',
      endpoint: '/functions/v1/sms-webhooks',
      events: ['message.sent', 'message.delivered', 'message.failed', 'message.bounced'],
      status: 'active',
      lastReceived: new Date()?.toISOString()
    },
    {
      id: 2,
      provider: 'twilio',
      endpoint: '/functions/v1/twilio-webhooks',
      events: ['message.sent', 'message.delivered', 'message.failed', 'message.undelivered'],
      status: 'active',
      lastReceived: new Date()?.toISOString()
    }
  ];

  return (
    <div className="space-y-6">
      {/* Webhook Overview */}
      <div className="card bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <Icon name="Webhook" size={20} className="text-green-600 dark:text-green-400 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">SMS Webhook Handlers</h4>
            <p className="text-sm text-green-700 dark:text-green-400">
              Telnyx and Twilio webhook endpoints receive delivery receipts, bounce notifications, and status updates with automatic failover provider switching based on delivery success rates.
            </p>
          </div>
        </div>
      </div>

      {/* Webhook Endpoints */}
      {webhookEndpoints?.map((webhook) => (
        <div key={webhook?.id} className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                webhook?.provider === 'telnyx' ?'bg-green-50 dark:bg-green-900/20' :'bg-orange-50 dark:bg-orange-900/20'
              }`}>
                <Icon name="Webhook" size={20} className={webhook?.provider === 'telnyx' ? 'text-green-600' : 'text-orange-600'} />
              </div>
              <div>
                <h4 className="font-semibold text-foreground capitalize">{webhook?.provider} Webhook</h4>
                <p className="text-sm text-muted-foreground font-mono">{webhook?.endpoint}</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium capitalize">
              {webhook?.status}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Supported Events:</p>
              <div className="flex flex-wrap gap-2">
                {webhook?.events?.map((event) => (
                  <span key={event} className="px-2 py-1 bg-muted rounded text-xs font-mono text-foreground">
                    {event}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-sm text-muted-foreground">Last Event Received</span>
              <span className="text-sm font-medium text-foreground">
                {new Date(webhook?.lastReceived)?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Automatic Failover Logic */}
      <div className="card">
        <h4 className="font-semibold text-foreground mb-4">Automatic Failover Logic</h4>
        <div className="space-y-3">
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-start gap-2 mb-2">
              <Icon name="CheckCircle" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Delivery Success Monitoring</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Webhooks track delivery success rates in real-time for both providers
                </p>
              </div>
            </div>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-start gap-2 mb-2">
              <Icon name="AlertCircle" size={16} className="text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Bounce Detection</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Automatic bounce notifications trigger provider health checks
                </p>
              </div>
            </div>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-start gap-2 mb-2">
              <Icon name="Repeat" size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Provider Switching</p>
                <p className="text-xs text-muted-foreground mt-1">
                  If delivery rate drops below 95%, automatic failover to backup provider
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Webhook Configuration */}
      <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Webhook Configuration</h4>
            <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Webhooks are automatically configured in Supabase Edge Functions</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Delivery receipts update SMS delivery analytics in real-time</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Bounce notifications automatically add numbers to suppression list</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Status updates trigger automatic provider health checks and failover</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SMSWebhookHandlersPanel;
