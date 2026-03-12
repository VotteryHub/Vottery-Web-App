import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChannelManagementPanel = ({ channels, onRefresh }) => {
  const channelDetails = [
    {
      id: 'sms',
      name: 'SMS Gateway',
      icon: 'MessageSquare',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      status: channels?.sms?.status || 'operational',
      deliveryRate: channels?.sms?.deliveryRate || 99.2,
      queueSize: channels?.sms?.queueSize || 0,
      provider: 'Twilio',
      failover: 'AWS SNS',
      avgLatency: '1.2s'
    },
    {
      id: 'email',
      name: 'Email Service',
      icon: 'Mail',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      status: channels?.email?.status || 'operational',
      deliveryRate: channels?.email?.deliveryRate || 98.7,
      queueSize: channels?.email?.queueSize || 0,
      provider: 'Resend',
      failover: 'SendGrid',
      avgLatency: '2.5s'
    },
    {
      id: 'inApp',
      name: 'In-App Notifications',
      icon: 'Bell',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      status: channels?.inApp?.status || 'operational',
      deliveryRate: channels?.inApp?.deliveryRate || 100,
      queueSize: channels?.inApp?.queueSize || 0,
      provider: 'Supabase Realtime',
      failover: 'WebSocket',
      avgLatency: '0.3s'
    },
    {
      id: 'push',
      name: 'Push Notifications',
      icon: 'Smartphone',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      status: channels?.push?.status || 'operational',
      deliveryRate: channels?.push?.deliveryRate || 97.5,
      queueSize: channels?.push?.queueSize || 0,
      provider: 'FCM',
      failover: 'APNS',
      avgLatency: '1.8s'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'down':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Channel Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {channelDetails?.map((channel) => (
          <div key={channel?.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${channel?.bgColor}`}>
                  <Icon name={channel?.icon} size={24} className={channel?.color} />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground">{channel?.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(channel?.status)}`} />
                    <span className="text-xs text-muted-foreground capitalize">{channel?.status}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" iconName="Settings" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Delivery Rate</span>
                <span className="text-sm font-bold text-foreground font-data">{channel?.deliveryRate}%</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${channel?.deliveryRate >= 98 ? 'bg-green-500' : channel?.deliveryRate >= 95 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${channel?.deliveryRate}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Queue Size</p>
                  <p className="text-lg font-bold text-foreground font-data">{channel?.queueSize}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Avg Latency</p>
                  <p className="text-lg font-bold text-foreground font-data">{channel?.avgLatency}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Primary Provider</span>
                  <span className="text-xs font-medium text-foreground">{channel?.provider}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Failover</span>
                  <span className="text-xs font-medium text-foreground">{channel?.failover}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Failover Configuration */}
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Failover Configuration</h3>
        <div className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="GitBranch" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-2">Automatic Failover</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Automatically switch to backup provider when primary fails or latency exceeds threshold
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs text-muted-foreground">Enabled</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Threshold: 5s latency or 3 consecutive failures</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="RefreshCw" size={20} className="text-green-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-2">Retry Logic</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Exponential backoff with 3 retry attempts before failover activation
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">Retry intervals: 1s, 3s, 9s</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="Shield" size={20} className="text-purple-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-2">Health Monitoring</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Continuous health checks every 30 seconds with automatic recovery detection
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs text-muted-foreground">All channels healthy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">24-Hour Performance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Total Sent</p>
            <p className="text-2xl font-heading font-bold text-foreground font-data">12,847</p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Delivered</p>
            <p className="text-2xl font-heading font-bold text-green-600 font-data">12,689</p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Failed</p>
            <p className="text-2xl font-heading font-bold text-red-600 font-data">158</p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Avg Latency</p>
            <p className="text-2xl font-heading font-bold text-foreground font-data">1.5s</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelManagementPanel;