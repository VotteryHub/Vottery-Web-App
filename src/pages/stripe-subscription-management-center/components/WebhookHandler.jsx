import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WebhookHandler = ({ subscriptions, onRefresh }) => {
  const [webhookEvents, setWebhookEvents] = useState([
    {
      id: '1',
      type: 'customer.subscription.created',
      status: 'processed',
      timestamp: new Date()?.toISOString(),
      data: { subscriptionId: 'sub_123', customerId: 'cus_123' }
    },
    {
      id: '2',
      type: 'invoice.payment_succeeded',
      status: 'processed',
      timestamp: new Date(Date.now() - 3600000)?.toISOString(),
      data: { invoiceId: 'in_123', amount: 9.99 }
    }
  ]);

  const eventTypes = [
    { type: 'customer.subscription.created', icon: 'Plus', color: 'text-green-600' },
    { type: 'customer.subscription.updated', icon: 'Edit', color: 'text-blue-600' },
    { type: 'customer.subscription.deleted', icon: 'Trash2', color: 'text-red-600' },
    { type: 'invoice.payment_succeeded', icon: 'CheckCircle', color: 'text-green-600' },
    { type: 'invoice.payment_failed', icon: 'XCircle', color: 'text-red-600' }
  ];

  const getEventIcon = (eventType) => {
    const event = eventTypes?.find(e => e?.type === eventType);
    return event || { icon: 'Webhook', color: 'text-gray-600' };
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="Webhook" className="w-5 h-5 text-primary" />
            Webhook Event Handler
          </h2>
          <Button
            onClick={onRefresh}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Icon name="RefreshCw" className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Event Types Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {eventTypes?.map((event) => (
            <div key={event?.type} className="p-3 bg-muted/30 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-1">
                <Icon name={event?.icon} className={`w-4 h-4 ${event?.color}`} />
                <span className="text-xs font-medium text-foreground">Events</span>
              </div>
              <p className="text-sm text-muted-foreground truncate" title={event?.type}>
                {event?.type?.split('.')?.pop()}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Webhook Events */}
        <div>
          <h3 className="font-medium text-foreground mb-3">Recent Webhook Events</h3>
          <div className="space-y-3">
            {webhookEvents?.map((event) => {
              const eventConfig = getEventIcon(event?.type);
              return (
                <div key={event?.id} className="p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg bg-background`}>
                        <Icon name={eventConfig?.icon} className={`w-5 h-5 ${eventConfig?.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-foreground">{event?.type}</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            event?.status === 'processed' ?'bg-green-100 text-green-800' :'bg-orange-100 text-orange-800'
                          }`}>
                            {event?.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {new Date(event?.timestamp)?.toLocaleString()}
                        </p>
                        <div className="text-xs text-muted-foreground font-mono bg-background p-2 rounded">
                          {JSON.stringify(event?.data, null, 2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Webhook Configuration Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Icon name="Info" className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900 mb-1">Webhook Configuration</p>
              <p className="text-sm text-blue-800 mb-2">
                Configure your Stripe webhook endpoint to point to:
              </p>
              <code className="block text-xs bg-white p-2 rounded border border-blue-200 text-blue-900">
                {window.location?.origin}/functions/v1/stripe-subscription-webhook
              </code>
              <p className="text-sm text-blue-800 mt-2">
                Required events: customer.subscription.*, invoice.payment_*
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebhookHandler;