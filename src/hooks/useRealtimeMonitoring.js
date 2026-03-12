import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Subscribe to Supabase Realtime for monitoring dashboards instead of 30s polling.
 * Ensures updates propagate in &lt;100ms when relevant tables change.
 * @param {Object} options
 * @param {string|string[]} options.tables - Table name(s) to subscribe to (e.g. 'system_alerts' or ['system_alerts', 'incident_response_workflows'])
 * @param {Function} options.onRefresh - Callback when INSERT/UPDATE/DELETE occurs (e.g. () => loadData())
 * @param {Object} [options.filter] - Optional { column, value } for table filter (e.g. { column: 'user_id', value: user?.id })
 * @param {boolean} [options.enabled=true] - Whether subscription is active
 */
export function useRealtimeMonitoring({ tables, onRefresh, filter, enabled = true }) {
  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;

  useEffect(() => {
    if (!enabled || !supabase) return;

    const tableList = Array.isArray(tables) ? tables : [tables];
    const channelName = `monitoring-${tableList.join('-')}-${Date.now()}`;
    let channel = supabase.channel(channelName);

    tableList.forEach((table) => {
      const opts = { event: '*', schema: 'public', table };
      if (filter?.column && filter?.value != null && filter.value !== '') {
        opts.filter = `${filter.column}=eq.${filter.value}`;
      }
      channel = channel.on('postgres_changes', opts, () => {
        onRefreshRef.current?.();
      });
    });

    channel.subscribe((status) => {
      if (status === 'CHANNEL_ERROR') {
        console.warn('[useRealtimeMonitoring] Subscription error, falling back to refresh');
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, Array.isArray(tables) ? tables.join(',') : tables, filter?.column, filter?.value]);
}
