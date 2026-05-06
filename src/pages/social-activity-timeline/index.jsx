import React, { useState, useEffect, useRef, useCallback } from 'react';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import { activityService } from '../../services/activityService';
import { useAuth } from '../../contexts/AuthContext';
import ActivityCard from './components/ActivityCard';
import FilterSidebar from './components/FilterSidebar';
import Button from '../../components/ui/Button';
import { FRIENDS_MANAGEMENT_HUB_ROUTE } from '../../constants/navigationHubRoutes';

const SocialActivityTimeline = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    activityType: 'all',
    timeRange: 'all',
    isRead: undefined
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const observerTarget = useRef(null);

  useEffect(() => {
    loadActivities(true);
    loadUnreadCount();

    const unsubscribe = activityService?.subscribeToActivities((payload) => {
      if (payload?.eventType === 'INSERT') {
        setActivities((prev) => [payload?.new, ...prev]);
        setUnreadCount((prev) => prev + 1);
      } else if (payload?.eventType === 'UPDATE') {
        setActivities((prev) =>
          prev?.map((a) => (a?.id === payload?.new?.id ? payload?.new : a))
        );
        if (payload?.new?.isRead && !payload?.old?.isRead) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      } else if (payload?.eventType === 'DELETE') {
        setActivities((prev) => prev?.filter((a) => a?.id !== payload?.old?.id));
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    loadActivities(true);
  }, [filters]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries?.[0]?.isIntersecting && hasMore && !loading) {
          loadActivities(false);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget?.current) {
      observer?.observe(observerTarget?.current);
    }

    return () => {
      if (observerTarget?.current) {
        observer?.unobserve(observerTarget?.current);
      }
    };
  }, [hasMore, loading]);

  const loadActivities = async (reset = false) => {
    try {
      setLoading(true);
      const currentPage = reset ? 1 : page;
      const limit = 20;

      const { data, error: activityError } = await activityService?.getActivities({
        ...filters,
        limit,
        offset: (currentPage - 1) * limit
      });

      if (activityError) throw new Error(activityError.message);

      if (reset) {
        setActivities(data || []);
        setPage(1);
      } else {
        setActivities((prev) => [...prev, ...(data || [])]);
      }

      setHasMore((data?.length || 0) === limit);
      setPage(currentPage + 1);
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const { data } = await activityService?.getUnreadCount();
      setUnreadCount(data || 0);
    } catch (err) {
      console.error('Failed to load unread count:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const { error: markError } = await activityService?.markAllAsRead();
      if (markError) throw new Error(markError.message);

      setActivities((prev) => prev?.map((a) => ({ ...a, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      setError(err?.message);
    }
  };

  const handleMarkAsRead = async (activityId) => {
    try {
      const { error: markError } = await activityService?.markAsRead(activityId);
      if (markError) throw new Error(markError.message);

      setActivities((prev) =>
        prev?.map((a) => (a?.id === activityId ? { ...a, isRead: true } : a))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    try {
      const { error: deleteError } = await activityService?.deleteActivity(activityId);
      if (deleteError) throw new Error(deleteError.message);

      setActivities((prev) => prev?.filter((a) => a?.id !== activityId));
    } catch (err) {
      setError(err?.message);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
    setHasMore(true);
  };

  return (
    <GeneralPageLayout title="Social Activity Timeline" showSidebar={true}>
      <div className="flex flex-col lg:flex-row gap-8 py-0">
        <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />

        <div className="flex-1 min-w-0">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white mb-3 tracking-tight uppercase">
                Social Pulse
              </h1>
              <p className="text-base md:text-lg text-slate-400 font-medium">
                Stay updated with your friends' activities and community engagement
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-xl border border-primary/30 animate-pulse">
                  <Icon name="Bell" size={16} />
                  <span className="font-black text-xs uppercase tracking-widest">{unreadCount} new</span>
                </div>
              )}
              {unreadCount > 0 && (
                <Button
                  onClick={handleMarkAllAsRead}
                  variant="outline"
                  size="sm"
                  className="rounded-xl font-black uppercase tracking-widest text-[10px] bg-white/5 border-white/10"
                >
                  <Icon name="CheckCheck" size={14} className="mr-2" />
                  Mark all read
                </Button>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-5 mb-8 flex items-center gap-4 animate-in shake">
              <Icon name="AlertCircle" size={20} className="text-destructive flex-shrink-0" />
              <p className="text-sm font-bold text-destructive-foreground">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {loading && activities?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-b-primary animate-spin" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing Timeline...</p>
              </div>
            ) : activities?.length === 0 ? (
              <div className="bg-slate-900/20 rounded-3xl border border-white/5 p-20 text-center shadow-inner">
                <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name="Activity" size={32} className="text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">No activities yet</h3>
                <p className="text-slate-500 font-medium mb-8">
                  Start following friends and participating in elections to see activity here
                </p>
                <Button 
                  onClick={() => { window.location.href = FRIENDS_MANAGEMENT_HUB_ROUTE; }}
                  className="rounded-xl font-black uppercase tracking-widest text-xs px-8"
                >
                  Find Friends
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {activities?.map((activity) => (
                  <ActivityCard
                    key={activity?.id}
                    activity={activity}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDeleteActivity}
                  />
                ))}
              </div>
            )}

            {hasMore && activities?.length > 0 && (
              <div ref={observerTarget} className="py-12 text-center">
                {loading && (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-b-primary animate-spin" />
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading more...</span>
                  </div>
                )}
              </div>
            )}

            {!hasMore && activities?.length > 0 && (
              <div className="text-center py-16 opacity-50 grayscale">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="CheckCircle" size={24} className="text-slate-400" />
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">You're all caught up!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default SocialActivityTimeline;