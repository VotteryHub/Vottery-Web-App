import React, { useState, useEffect, useRef, useCallback } from 'react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import { activityService } from '../../services/activityService';
import { useAuth } from '../../contexts/AuthContext';
import ActivityCard from './components/ActivityCard';
import FilterSidebar from './components/FilterSidebar';
import Button from '../../components/ui/Button';

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
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <LeftSidebar />

      <main className="lg:ml-64 xl:ml-72 pt-14">
        <div className="flex gap-6 p-4 md:p-6 max-w-7xl mx-auto">
          {/* Filter Sidebar */}
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />

          {/* Main Activity Feed */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="card p-4 md:p-6 mb-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                    Social Activity Timeline
                  </h1>
                  <p className="text-muted-foreground">
                    Stay updated with your friends' activities and community engagement
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {unreadCount > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg">
                      <Icon name="Bell" size={18} />
                      <span className="font-semibold">{unreadCount} new</span>
                    </div>
                  )}
                  {unreadCount > 0 && (
                    <Button
                      onClick={handleMarkAllAsRead}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Icon name="CheckCheck" size={16} />
                      Mark all read
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="card p-4 mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <Icon name="AlertCircle" size={20} />
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Activity Feed */}
            <div className="space-y-4">
              {loading && activities?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                  <p className="text-muted-foreground">Loading activities...</p>
                </div>
              ) : activities?.length === 0 ? (
                <div className="card p-12 text-center">
                  <Icon name="Activity" size={64} className="mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                    No activities yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Start following friends and participating in elections to see activity here
                  </p>
                  <Button onClick={() => window.location.href = '/friends-management-hub'}>
                    Find Friends
                  </Button>
                </div>
              ) : (
                activities?.map((activity) => (
                  <ActivityCard
                    key={activity?.id}
                    activity={activity}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDeleteActivity}
                  />
                ))
              )}

              {/* Infinite Scroll Trigger */}
              {hasMore && activities?.length > 0 && (
                <div ref={observerTarget} className="py-8 text-center">
                  {loading && (
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span>Loading more...</span>
                    </div>
                  )}
                </div>
              )}

              {!hasMore && activities?.length > 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="CheckCircle" size={24} className="mx-auto mb-2" />
                  <p>You're all caught up!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SocialActivityTimeline;