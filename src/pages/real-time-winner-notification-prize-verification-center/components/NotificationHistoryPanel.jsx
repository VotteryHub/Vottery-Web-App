import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { winnerNotificationService } from '../../../services/winnerNotificationService';

const NotificationHistoryPanel = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');

  useEffect(() => {
    loadHistory();
  }, [dateRange]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const { data } = await winnerNotificationService?.getNotificationHistory(dateRange);
      setHistory(data || []);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'email': return 'Mail';
      case 'sms': return 'MessageSquare';
      case 'in_app': return 'Bell';
      case 'push': return 'Smartphone';
      default: return 'Send';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent': return 'text-green-600';
      case 'delivered': return 'text-blue-600';
      case 'failed': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="History" size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-foreground">Notification History</h2>
              <p className="text-sm text-muted-foreground">Track all winner notifications and delivery status</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e?.target?.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              onClick={() => {}}
            >
              Export
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Icon name="Loader" size={48} className="text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading history...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history?.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="History" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No notification history found</p>
              </div>
            ) : (
              history?.map((notification) => (
                <div
                  key={notification?.id}
                  className="bg-background border border-border rounded-lg p-4 hover:border-primary/40 transition-all duration-250"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-muted rounded-lg">
                        <Icon name={getChannelIcon(notification?.channel)} size={24} className="text-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-heading font-bold text-foreground">
                            {notification?.recipientName}
                          </h3>
                          <span className={`text-xs font-medium ${getStatusColor(notification?.status)}`}>
                            {notification?.status?.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{notification?.message}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Icon name="Calendar" size={14} />
                            <span>{new Date(notification?.sentAt)?.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Icon name={getChannelIcon(notification?.channel)} size={14} />
                            <span className="capitalize">{notification?.channel}</span>
                          </div>
                          {notification?.deliveredAt && (
                            <div className="flex items-center gap-1">
                              <Icon name="CheckCircle" size={14} />
                              <span>Delivered: {new Date(notification?.deliveredAt)?.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={() => {}}
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Send" size={20} className="text-primary" />
            <h3 className="text-sm font-medium text-muted-foreground">Total Sent</h3>
          </div>
          <p className="text-2xl font-bold text-foreground">{history?.length || 0}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="CheckCircle" size={20} className="text-green-600" />
            <h3 className="text-sm font-medium text-muted-foreground">Delivered</h3>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {history?.filter(h => h?.status === 'delivered')?.length || 0}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="XCircle" size={20} className="text-red-600" />
            <h3 className="text-sm font-medium text-muted-foreground">Failed</h3>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {history?.filter(h => h?.status === 'failed')?.length || 0}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="TrendingUp" size={20} className="text-blue-600" />
            <h3 className="text-sm font-medium text-muted-foreground">Delivery Rate</h3>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {history?.length > 0 ? ((history?.filter(h => h?.status === 'delivered')?.length / history?.length) * 100)?.toFixed(0) : 0}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationHistoryPanel;