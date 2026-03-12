import React, { useState, useEffect, useRef } from 'react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../contexts/AuthContext';
import NotificationCard from './components/NotificationCard';
import CategoryFilter from './components/CategoryFilter';

const NotificationCenterHub = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryCounts, setCategoryCounts] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    readStatus: 'all',
    sortBy: 'newest',
    search: ''
  });
  const refreshIntervalRef = useRef(null);

  useEffect(() => {
    loadNotifications();
    loadCategoryCounts();

    const unsubscribe = notificationService?.subscribeToNotifications((payload) => {
      if (payload?.eventType === 'INSERT') {
        setNotifications((prev) => [payload?.new, ...prev]);
        loadCategoryCounts();
      } else if (payload?.eventType === 'UPDATE') {
        setNotifications((prev) =>
          prev?.map((n) => (n?.id === payload?.new?.id ? payload?.new : n))
        );
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
      if (refreshIntervalRef?.current) {
        clearInterval(refreshIntervalRef?.current);
      }
    };
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [filters]);

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

      <main className="lg:ml-64 xl:ml-72 pt-14">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                Notification Center
              </h1>
              {categoryCounts?.total > 0 && (
                <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                  {categoryCounts?.total} unread
                </span>
              )}
            </div>
            <p className="text-muted-foreground">
              Stay updated with votes, messages, achievements, and more
            </p>
          </div>

          <CategoryFilter
            categoryCounts={categoryCounts}
            activeCategory={filters?.category}
            onCategoryChange={(category) => setFilters({ ...filters, category })}
          />

          <div className="bg-card rounded-xl border border-border p-4 mb-6">
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
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="CheckCheck"
                      onClick={handleMarkAllAsRead}
                      disabled={unreadNotifications?.length === 0}
                    >
                      Mark All Read
                    </Button>
                    <select
                      value={filters?.readStatus}
                      onChange={(e) => setFilters({ ...filters, readStatus: e?.target?.value })}
                      className="px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground"
                    >
                      <option value="all">All</option>
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                    </select>
                    <select
                      value={filters?.sortBy}
                      onChange={(e) => setFilters({ ...filters, sortBy: e?.target?.value })}
                      className="px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                  </>
                )}
              </div>
            </div>

            <div className="mt-4">
              <div className="relative">
                <Icon
                  name="Search"
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={filters?.search}
                  onChange={(e) => setFilters({ ...filters, search: e?.target?.value })}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : notifications?.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <Icon name="Bell" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No notifications found
              </h3>
              <p className="text-muted-foreground">
                {filters?.category !== 'all' || filters?.readStatus !== 'all' ?'Try adjusting your filters' : "You're all caught up!"}
              </p>
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
                      prev?.includes(id)
                        ? prev?.filter((selectedId) => selectedId !== id)
                        : [...prev, id]
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
      </main>
    </div>
  );
};

export default NotificationCenterHub;
