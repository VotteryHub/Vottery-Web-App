import React, { useState, useEffect, useRef } from 'react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import { notificationService } from '../../services/notificationService';
import { webSocketMonitoringService } from '../../services/webSocketMonitoringService';
import { useAuth } from '../../contexts/AuthContext';
import NotificationCard from '../notification-center-hub/components/NotificationCard';
import CategoryFilter from '../notification-center-hub/components/CategoryFilter';
import NotificationToast from './components/NotificationToast';
import PushNotificationConfig from './components/PushNotificationConfig';
import NotificationGrouping from './components/NotificationGrouping';
import PersistentHistory from './components/PersistentHistory';

const RealTimeNotificationsHubWithPushIntegration = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryCounts, setCategoryCounts] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [toastNotifications, setToastNotifications] = useState([]);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState({});
  const [retryQueue, setRetryQueue] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    readStatus: 'all',
    sortBy: 'newest',
    search: ''
  });
  const refreshIntervalRef = useRef(null);
  const wsRef = useRef(null);
  const retryTimersRef = useRef({});

  useEffect(() => {
    loadNotifications();
    loadCategoryCounts();
    checkPushPermission();
    initWebSocket();

    const unsubscribe = notificationService?.subscribeToNotifications((payload) => {
      if (payload?.eventType === 'INSERT') {
        const newNotification = payload?.new;
        setNotifications((prev) => [newNotification, ...prev]);
        loadCategoryCounts();
        showToast(newNotification);
        trackDelivery(newNotification?.id, 'delivered');
        if (pushEnabled) sendPushNotification(newNotification);
      } else if (payload?.eventType === 'UPDATE') {
        setNotifications((prev) => prev?.map((n) => (n?.id === payload?.new?.id ? payload?.new : n)));
        loadCategoryCounts();
      } else if (payload?.eventType === 'DELETE') {
        setNotifications((prev) => prev?.filter((n) => n?.id !== payload?.old?.id));
        loadCategoryCounts();
      }
    });

    refreshIntervalRef.current = setInterval(() => {
      loadNotifications();
      loadCategoryCounts();
    }, 15000);

    return () => {
      unsubscribe();
      if (refreshIntervalRef?.current) clearInterval(refreshIntervalRef?.current);
      if (wsRef?.current) wsRef?.current?.disconnect?.();
      Object.values(retryTimersRef?.current)?.forEach(clearTimeout);
    };
  }, [pushEnabled]);

  const initWebSocket = () => {
    try {
      if (webSocketMonitoringService?.connect) {
        wsRef.current = webSocketMonitoringService;
        webSocketMonitoringService?.connect();
        setWsConnected(true);

        // Listen for delivery status updates
        webSocketMonitoringService?.onMessage?.((msg) => {
          if (msg?.type === 'delivery_status') {
            setDeliveryStatus((prev) => ({ ...prev, [msg?.notificationId]: msg?.status }));
          }
          if (msg?.type === 'notification_failed') {
            scheduleRetry(msg?.notificationId, msg?.notification);
          }
        });
      }
    } catch (err) {
      console.error('WebSocket init failed:', err);
      setWsConnected(false);
    }
  };

  const trackDelivery = (notificationId, status) => {
    setDeliveryStatus((prev) => ({ ...prev, [notificationId]: status }));
  };

  const scheduleRetry = (notificationId, notification, attempt = 1) => {
    if (attempt > 3) {
      setRetryQueue((prev) => prev?.filter((r) => r?.id !== notificationId));
      trackDelivery(notificationId, 'failed');
      return;
    }
    const delay = attempt * 5000;
    setRetryQueue((prev) => [
      ...prev?.filter((r) => r?.id !== notificationId),
      { id: notificationId, notification, attempt, retryAt: Date.now() + delay }
    ]);
    retryTimersRef.current[notificationId] = setTimeout(() => {
      trackDelivery(notificationId, 'retrying');
      scheduleRetry(notificationId, notification, attempt + 1);
    }, delay);
  };

  useEffect(() => {
    loadNotifications();
  }, [filters]);

  const checkPushPermission = async () => {
    if ('Notification' in window) {
      const permission = Notification.permission;
      setPushEnabled(permission === 'granted');
    }
  };

  const requestPushPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPushEnabled(permission === 'granted');
      return permission === 'granted';
    }
    return false;
  };

  const sendPushNotification = (notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification?.title || 'New Notification', {
        body: notification?.description || '',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification?.id,
        requireInteraction: false,
        silent: false
      });
    }
  };

  const showToast = (notification) => {
    const toast = {
      id: notification?.id,
      ...notification,
      timestamp: new Date()?.toISOString()
    };
    setToastNotifications((prev) => [toast, ...prev]?.slice(0, 5));
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToastNotifications((prev) => prev?.filter((t) => t?.id !== toast?.id));
    }, 5000);
  };

  const dismissToast = (toastId) => {
    setToastNotifications((prev) => prev?.filter((t) => t?.id !== toastId));
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const { data, error: notifError } = await notificationService?.getNotifications(filters);

      if (notifError) throw new Error(notifError.message);
      setNotifications(data || []);
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryCounts = async () => {
    try {
      const { data } = await notificationService?.getUnreadCountByCategory();
      setCategoryCounts(data || {});
    } catch (err) {
      console.error('Failed to load category counts:', err);
    }
  };

  const handleMarkAsRead = async (ids) => {
    try {
      const { error: markError } = await notificationService?.markAsRead(ids);
      if (markError) throw new Error(markError.message);

      setNotifications((prev) =>
        prev?.map((n) => (ids?.includes(n?.id) ? { ...n, isRead: true } : n))
      );
      loadCategoryCounts();
    } catch (err) {
      setError(err?.message);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const { error: markError } = await notificationService?.markAllAsRead();
      if (markError) throw new Error(markError.message);

      setNotifications((prev) => prev?.map((n) => ({ ...n, isRead: true })));
      loadCategoryCounts();
    } catch (err) {
      setError(err?.message);
    }
  };

  const handleArchive = async (ids) => {
    try {
      const { error: archiveError } = await notificationService?.archiveNotifications(ids);
      if (archiveError) throw new Error(archiveError.message);

      setNotifications((prev) => prev?.filter((n) => !ids?.includes(n?.id)));
      setSelectedIds([]);
      loadCategoryCounts();
    } catch (err) {
      setError(err?.message);
    }
  };

  const handleDelete = async (ids) => {
    try {
      const { error: deleteError } = await notificationService?.deleteNotifications(ids);
      if (deleteError) throw new Error(deleteError.message);

      setNotifications((prev) => prev?.filter((n) => !ids?.includes(n?.id)));
      setSelectedIds([]);
      loadCategoryCounts();
    } catch (err) {
      setError(err?.message);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds?.length === notifications?.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(notifications?.map((n) => n?.id));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedIds?.length === 0) return;

    switch (action) {
      case 'markRead':
        await handleMarkAsRead(selectedIds);
        setSelectedIds([]);
        break;
      case 'archive':
        await handleArchive(selectedIds);
        break;
      case 'delete':
        await handleDelete(selectedIds);
        break;
      default:
        break;
    }
  };

  const unreadNotifications = notifications?.filter((n) => !n?.isRead);

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <LeftSidebar />
      {/* Toast Notifications */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {toastNotifications?.map((toast) => (
          <NotificationToast
            key={toast?.id}
            notification={toast}
            onDismiss={() => dismissToast(toast?.id)}
            onMarkRead={() => handleMarkAsRead([toast?.id])}
          />
        ))}
      </div>
      <main className="lg:ml-64 xl:ml-72 pt-14">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                Real-Time Notifications Hub
              </h1>
              {categoryCounts?.total > 0 && (
                <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full animate-pulse">
                  {categoryCounts?.total} unread
                </span>
              )}
            </div>
            <p className="text-muted-foreground">
              Unified push alert management with intelligent categorization and persistent history
            </p>
          </div>

          {/* Delivery Status & Retry Banner */}
          {(Object.keys(deliveryStatus)?.length > 0 || retryQueue?.length > 0) && (
            <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-amber-800 dark:text-amber-200">Delivery Status</span>
                  {retryQueue?.length > 0 && (
                    <span className="px-2 py-0.5 bg-amber-200 dark:bg-amber-800 rounded text-xs font-medium">
                      {retryQueue?.length} retrying
                    </span>
                  )}
                  {wsConnected ? (
                    <span className="text-xs text-green-600 dark:text-green-400">WebSocket connected</span>
                  ) : (
                    <span className="text-xs text-red-600 dark:text-red-400">WebSocket reconnecting</span>
                  )}
                </div>
                <div className="text-xs text-amber-700 dark:text-amber-300">
                  {Object.values(deliveryStatus)?.filter(s => s === 'delivered')?.length} delivered · {Object.values(deliveryStatus)?.filter(s => s === 'retrying')?.length} retrying
                </div>
              </div>
            </div>
          )}

          {/* Push Notification Configuration */}
          <PushNotificationConfig
            pushEnabled={pushEnabled}
            onTogglePush={requestPushPermission}
          />

          <CategoryFilter
            categoryCounts={categoryCounts}
            activeCategory={filters?.category}
            onCategoryChange={(category) => setFilters({ ...filters, category })}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Notification Feed */}
            <div className="lg:col-span-2 space-y-4">
              {/* Bulk Actions Bar */}
              <div className="bg-card rounded-xl border border-border p-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Checkbox
                      checked={selectedIds?.length === notifications?.length && notifications?.length > 0}
                      onChange={handleSelectAll}
                      label="Select All"
                    />
                    {selectedIds?.length > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {selectedIds?.length} selected
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedIds?.length > 0 ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          iconName="Check"
                          onClick={() => handleBulkAction('markRead')}
                        >
                          Mark Read
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          iconName="Archive"
                          onClick={() => handleBulkAction('archive')}
                        >
                          Archive
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          iconName="Trash2"
                          onClick={() => handleBulkAction('delete')}
                        >
                          Delete
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="CheckCheck"
                        onClick={handleMarkAllAsRead}
                        disabled={unreadNotifications?.length === 0}
                      >
                        Mark All Read
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Notification List */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Icon name="Loader" size={32} className="animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                  <Icon name="AlertCircle" size={32} className="text-red-500 mx-auto mb-2" />
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              ) : notifications?.length === 0 ? (
                <div className="bg-card rounded-xl border border-border p-12 text-center">
                  <Icon name="Bell" size={48} className="text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications?.map((notification) => (
                    <NotificationCard
                      key={notification?.id}
                      notification={notification}
                      isSelected={selectedIds?.includes(notification?.id)}
                      onSelect={(id) => {
                        setSelectedIds((prev) =>
                          prev?.includes(id) ? prev?.filter((i) => i !== id) : [...prev, id]
                        );
                      }}
                      onMarkRead={() => handleMarkAsRead([notification?.id])}
                      onArchive={() => handleArchive([notification?.id])}
                      onDelete={() => handleDelete([notification?.id])}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Intelligent Grouping */}
              <NotificationGrouping notifications={notifications} />

              {/* Persistent History */}
              <PersistentHistory />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RealTimeNotificationsHubWithPushIntegration;