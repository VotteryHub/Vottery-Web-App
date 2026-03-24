import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConnectedIntegrations = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: 1,
      name: 'Stripe',
      description: 'Payment processing and payouts',
      icon: 'CreditCard',
      connected: true,
      connectedAt: '2026-01-15'
    },
    {
      id: 2,
      name: 'Google',
      description: 'Social login and profile sync',
      icon: 'Globe',
      connected: false,
      connectedAt: null
    },
    {
      id: 3,
      name: 'Twitter',
      description: 'Share elections and results',
      icon: 'Twitter',
      connected: false,
      connectedAt: null
    },
    {
      id: 4,
      name: 'PayPal',
      description: 'Payouts and linked payment activity',
      icon: 'Wallet',
      connected: false,
      connectedAt: null
    }
  ]);

  const handleToggleConnection = (id) => {
    setIntegrations((prev) =>
      prev?.map((integration) =>
        integration?.id === id
          ? {
              ...integration,
              connected: !integration?.connected,
              connectedAt: !integration?.connected ? new Date()?.toISOString() : null
            }
          : integration
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
          Connected Integrations
        </h3>
        <p className="text-sm text-muted-foreground">
          Manage your connected services and third-party integrations
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations?.map((integration) => (
          <div
            key={integration?.id}
            className="bg-card rounded-lg border border-border p-4 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon name={integration?.icon} size={24} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{integration?.name}</h4>
                  <p className="text-xs text-muted-foreground">{integration?.description}</p>
                </div>
              </div>
              {integration?.connected && (
                <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs font-medium rounded-full">
                  Connected
                </span>
              )}
            </div>

            {integration?.connected && integration?.connectedAt && (
              <p className="text-xs text-muted-foreground mb-3">
                Connected on {new Date(integration?.connectedAt)?.toLocaleDateString()}
              </p>
            )}

            <Button
              variant={integration?.connected ? 'outline' : 'default'}
              size="sm"
              className="w-full"
              onClick={() => handleToggleConnection(integration?.id)}
            >
              {integration?.connected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
        ))}
      </div>
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
              Integration Security
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              All integrations use secure OAuth 2.0 authentication. We never store your passwords.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectedIntegrations;
