import React, { useState, useEffect, useRef } from 'react';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
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
    <GeneralPageLayout title="Notification Center">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">
            Notification Center
          </h1>
          {categoryCounts?.total > 0 && (
            <span className="px-4 py-1.5 bg-red-500 text-white text-xs font-black rounded-full uppercase tracking-widest animate-pulse shadow-lg shadow-red-500/30">
              {categoryCounts?.total} unread
            </span>
          )}
        </div>
        <p className="text-slate-400 font-medium">
          Stay updated with votes, messages, achievements, and more
        </p>
      </div>

      <CategoryFilter
        categoryCounts={categoryCounts}
        activeCategory={filters?.category}
        onCategoryChange={(category) => setFilters({ ...filters, category })}
      />

      <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 p-4 md:p-6 mb-8 shadow-inner">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-6">
          <div className="flex items-center gap-4 flex-wrap w-full md:w-auto">
            <Checkbox
              checked={selectedIds?.length === notifications?.length && notifications?.length > 0}
              onChange={handleSelectAll}
              label={<span className="font-bold text-slate-300">Select All</span>}
            />
            {selectedIds?.length > 0 && (
              <span className="text-xs font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                {selectedIds?.length} selected
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap w-full md:w-auto">
            {selectedIds?.length > 0 ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Check"
                  onClick={() => handleBulkAction('markRead')}
                  className="rounded-xl font-black uppercase tracking-widest text-[10px]"
                >
                  Mark Read
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Archive"
                  onClick={() => handleBulkAction('archive')}
                  className="rounded-xl font-black uppercase tracking-widest text-[10px]"
                >
                  Archive
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Trash2"
                  onClick={() => handleBulkAction('delete')}
                  className="rounded-xl font-black uppercase tracking-widest text-[10px] border-red-500/50 text-red-400"
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
                  className="rounded-xl font-black uppercase tracking-widest text-[10px]"
                >
                  Mark All Read
                </Button>
                <select
                  value={filters?.readStatus}
                  onChange={(e) => setFilters({ ...filters, readStatus: e?.target?.value })}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-widest border border-white/10 rounded-xl bg-slate-800 text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="all">All</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
                <select
                  value={filters?.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e?.target?.value })}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-widest border border-white/10 rounded-xl bg-slate-800 text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </>
            )}
          </div>
        </div>

        <div className="relative">
          <Icon
            name="Search"
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            placeholder="Search notifications..."
            value={filters?.search}
            onChange={(e) => setFilters({ ...filters, search: e?.target?.value })}
            className="w-full pl-12 pr-6 py-4 border border-white/5 rounded-2xl bg-slate-800/50 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium transition-all"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-8 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <Icon name="AlertCircle" size={20} className="text-red-500" />
          <p className="text-red-400 text-sm font-medium">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-b-primary animate-spin" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing Notifications...</p>
        </div>
      ) : notifications?.length === 0 ? (
        <div className="bg-slate-900/20 rounded-3xl border border-white/5 p-16 text-center shadow-inner">
          <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="BellOff" size={32} className="text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">
            No notifications found
          </h3>
          <p className="text-slate-500 font-medium">
            {filters?.category !== 'all' || filters?.readStatus !== 'all' ? 'Try adjusting your filters' : "You're all caught up! Check back later for updates."}
          </p>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-700">
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
    </GeneralPageLayout>
  );
};

export default NotificationCenterHub;
