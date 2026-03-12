import React from 'react';
import Icon from '../../../components/AppIcon';

const NotificationHistoryPanel = ({ alerts }) => {
  const mockHistory = [
    {
      id: 1,
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      campaign: 'Summer Product Launch 2026',
      type: 'critical',
      message: 'Budget 93% spent - immediate action required',
      channels: ['slack', 'email'],
      status: 'delivered'
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      campaign: 'Brand Awareness Q1',
      type: 'warning',
      message: 'Budget 91% spent - review recommended',
      channels: ['slack'],
      status: 'delivered'
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      campaign: 'Holiday Promotion Campaign',
      type: 'warning',
      message: 'Budget 89.5% spent - approaching threshold',
      channels: ['email', 'discord'],
      status: 'delivered'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon name="History" className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Notification History</h2>
          <p className="text-sm text-muted-foreground">Recent alert deliveries and status</p>
        </div>
      </div>

      <div className="space-y-3">
        {mockHistory?.map((notification) => (
          <div
            key={notification?.id}
            className="bg-background border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon
                  name={notification?.type === 'critical' ? 'AlertTriangle' : 'AlertCircle'}
                  className={`w-4 h-4 ${notification?.type === 'critical' ? 'text-destructive' : 'text-warning'}`}
                />
                <span className="font-semibold text-foreground text-sm">{notification?.campaign}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {notification?.timestamp?.toLocaleTimeString()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{notification?.message}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {notification?.channels?.map((channel) => (
                  <span
                    key={channel}
                    className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize"
                  >
                    {channel}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <Icon name="CheckCircle" className="w-3 h-3 text-success" />
                <span className="text-xs text-success">Delivered</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationHistoryPanel;