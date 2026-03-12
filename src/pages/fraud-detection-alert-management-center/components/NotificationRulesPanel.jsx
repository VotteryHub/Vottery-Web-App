import React from 'react';
import Icon from '../../../components/AppIcon';

const NotificationRulesPanel = ({ rules }) => {
  const notificationChannels = [
    { id: 'email', label: 'Email', icon: 'Mail', color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 'sms', label: 'SMS', icon: 'MessageSquare', color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-900/20' },
    { id: 'in_app', label: 'In-App', icon: 'Bell', color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    { id: 'webhook', label: 'Webhook', icon: 'Webhook', color: 'text-orange-600', bgColor: 'bg-orange-50 dark:bg-orange-900/20' }
  ];

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Notification Channels</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {notificationChannels?.map((channel) => (
            <div key={channel?.id} className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${channel?.bgColor}`}>
                <Icon name={channel?.icon} size={20} className={channel?.color} />
              </div>
              <h4 className="font-semibold text-foreground mb-1">{channel?.label}</h4>
              <p className="text-xs text-muted-foreground">Configure {channel?.label?.toLowerCase()} notifications</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Alert Rule Notifications</h3>
        <div className="space-y-3">
          {rules?.map((rule) => (
            <div key={rule?.id} className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-2">{rule?.ruleName}</h4>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded text-xs font-medium">
                      <Icon name="Mail" size={12} className="inline mr-1" />
                      Email
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded text-xs font-medium">
                      <Icon name="Bell" size={12} className="inline mr-1" />
                      In-App
                    </span>
                  </div>
                </div>
                <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                  Configure
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">Notification Templates</h4>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Customize notification templates for each alert type with dynamic variables and formatting options.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationRulesPanel;