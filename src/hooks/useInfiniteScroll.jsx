import React, { useState, useEffect, useRef, useCallback } from 'react';
import Icon from '../components/AppIcon';

/**
 * useInfiniteScroll - IntersectionObserver-based infinite scroll hook
 * Triggers loadMore when user is within `threshold` items from the bottom
 */
const useInfiniteScroll = (loadMore, hasMore, threshold = 5) => {
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: `${threshold * 60}px` }
    );
    if (sentinelRef?.current) observer?.observe(sentinelRef?.current);
    observerRef.current = observer;
    return () => observer?.disconnect();
  }, [loadMore, hasMore, threshold]);

  return sentinelRef;
};

/**
 * usePaginatedList - Complete paginated list state management with infinite scroll
 */
export const usePaginatedList = (fetchFn, options = {}) => {
  const { pageSize = 20, filters = {} } = options;
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const prefetchRef = useRef(null);

  const loadInitial = useCallback(async () => {
    setInitialLoading(true);
    setItems([]);
    setCursor(null);
    setHasMore(true);
    try {
      const result = await fetchFn({ ...filters, pageSize, cursor: null });
      if (result?.error) throw new Error(result.error.message);
      setItems(result?.data || []);
      setCursor(result?.nextCursor || null);
      setHasMore(!!result?.nextCursor);
    } catch (err) {
      setError(err?.message);
    } finally {
      setInitialLoading(false);
    }
  }, [JSON.stringify(filters), pageSize]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !cursor) return;
    setLoading(true);
    try {
      const result = await fetchFn({ ...filters, pageSize, cursor });
      if (result?.error) throw new Error(result.error.message);
      setItems(prev => [...prev, ...(result?.data || [])]);
      setCursor(result?.nextCursor || null);
      setHasMore(!!result?.nextCursor);
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, cursor, filters, pageSize]);

  // Smart prefetch: load next page when 5 items from bottom
  const prefetch = useCallback(async () => {
    if (!hasMore || !cursor || prefetchRef?.current) return;
    prefetchRef.current = fetchFn({ ...filters, pageSize, cursor });
  }, [hasMore, cursor, filters, pageSize]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore, 5);

  return {
    items,
    loading,
    initialLoading,
    hasMore,
    error,
    sentinelRef,
    loadMore,
    refresh: loadInitial
  };
};

const ElectionsList = ({ elections, loading, hasMore, onLoadMore }) => {
  const sentinelRef = useInfiniteScroll(onLoadMore, hasMore);

  return (
    <div className="space-y-3">
      {elections?.map(election => (
        <div key={election?.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{election?.title}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{election?.description}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">{election?.category}</span>
                <span className="text-xs text-gray-500">{election?.voteCount || 0} votes</span>
              </div>
            </div>
            {election?.coverImage && (
              <img src={election?.coverImage} alt={election?.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
            )}
          </div>
        </div>
      ))}
      {loading && (
        <div className="flex items-center justify-center py-4">
          <Icon name="Loader" size={24} className="animate-spin text-primary" />
          <span className="ml-2 text-sm text-gray-500">Loading more...</span>
        </div>
      )}
      <div ref={sentinelRef} className="h-1" />
    </div>
  );
};

export { useInfiniteScroll, ElectionsList };
export default useInfiniteScroll;
