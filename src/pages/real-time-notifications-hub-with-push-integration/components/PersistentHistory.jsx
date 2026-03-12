import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { notificationService } from '../../../services/notificationService';

const PersistentHistory = () => {
  const [historyStats, setHistoryStats] = useState({
    total: 0,
    last7Days: 0,
    last30Days: 0,
    byCategory: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistoryStats();
  }, []);

  const loadHistoryStats = async () => {
    try {
      setLoading(true);
      const { data: allNotifications } = await notificationService?.getNotifications({ limit: 1000 });
      
      if (allNotifications) {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const last7Days = allNotifications?.filter(
          (n) => new Date(n.createdAt) >= sevenDaysAgo
        )?.length;

        const last30Days = allNotifications?.filter(
          (n) => new Date(n.createdAt) >= thirtyDaysAgo
        )?.length;

        // Count by category
        const byCategory = {};
        allNotifications?.forEach((n) => {
          const type = n?.activityType;
          byCategory[type] = (byCategory?.[type] || 0) + 1;
        });

        setHistoryStats({
          total: allNotifications?.length,
          last7Days,
          last30Days,
          byCategory
        });
      }
    } catch (error) {
      console.error('Failed to load history stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportHistory = async () => {
    try {
      const { data: allNotifications } = await notificationService?.getNotifications({ limit: 1000 });
      
      if (allNotifications) {
        const csvContent = [
          ['Date', 'Title', 'Description', 'Type', 'Read Status']?.join(','),
          ...allNotifications?.map((n) =>
            [
              new Date(n.createdAt)?.toLocaleString(),
              `"${n?.title}"`,
              `"${n?.description || ''}"`,
              n?.activityType,
              n?.isRead ? 'Read' : 'Unread'
            ]?.join(',')
          )
        ]?.join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL?.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `notification-history-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
        document.body?.appendChild(a);
        a?.click();
        document.body?.removeChild(a);
        window.URL?.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to export history:', error);
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name="Archive" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Persistent History</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName="Download"
          onClick={handleExportHistory}
          title="Export history"
        />
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Icon name="Loader" size={24} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-foreground mb-1">
                {historyStats?.total}
              </div>
              <div className="text-xs text-muted-foreground">Total Notifications</div>
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-foreground mb-1">
                {historyStats?.last7Days}
              </div>
              <div className="text-xs text-muted-foreground">Last 7 Days</div>
            </div>

            <div className="p-3 bg-muted rounded-lg col-span-2">
              <div className="text-2xl font-bold text-foreground mb-1">
                {historyStats?.last30Days}
              </div>
              <div className="text-xs text-muted-foreground">Last 30 Days</div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">By Category</h4>
            <div className="space-y-2">
              {Object.entries(historyStats?.byCategory)?.sort(([, a], [, b]) => b - a)?.slice(0, 5)?.map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground capitalize">
                      {type?.replace(/_/g, ' ')}
                    </span>
                    <span className="font-medium text-foreground">{count}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Archive Info */}
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Icon name="Shield" size={16} className="text-green-500 mt-0.5" />
              <div className="text-xs text-green-600 dark:text-green-400">
                <span className="font-semibold">Secure Storage:</span> All notifications are stored with audit trails for compliance
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersistentHistory;