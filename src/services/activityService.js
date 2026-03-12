import { supabase } from '../lib/supabase';

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toCamelCase);

  return Object.keys(obj)?.reduce((acc, key) => {
    const camelKey = key?.replace(/_([a-z])/g, (_, letter) => letter?.toUpperCase());
    acc[camelKey] = toCamelCase(obj?.[key]);
    return acc;
  }, {});
};

const toSnakeCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toSnakeCase);

  return Object.keys(obj)?.reduce((acc, key) => {
    const snakeKey = key?.replace(/[A-Z]/g, letter => `_${letter?.toLowerCase()}`);
    acc[snakeKey] = toSnakeCase(obj?.[key]);
    return acc;
  }, {});
};

export const activityService = {
  async getActivities(filters = {}) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        ?.from('activity_feed')
        ?.select(`
          *,
          actor:actor_id(id, name, username, avatar, verified)
        `)
        ?.eq('user_id', user?.id)
        ?.order('created_at', { ascending: false });

      // Apply filters
      if (filters?.activityType && filters?.activityType !== 'all') {
        query = query?.eq('activity_type', filters?.activityType);
      }

      if (filters?.isRead !== undefined) {
        query = query?.eq('is_read', filters?.isRead);
      }

      if (filters?.timeRange) {
        const now = new Date();
        let startDate;
        
        switch (filters?.timeRange) {
          case 'today':
            startDate = new Date(now.setHours(0, 0, 0, 0));
            break;
          case 'week':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
          case 'month':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
          default:
            startDate = null;
        }

        if (startDate) {
          query = query?.gte('created_at', startDate?.toISOString());
        }
      }

      if (filters?.limit) {
        query = query?.limit(filters?.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async markAsRead(activityId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('activity_feed')
        ?.update({ is_read: true })
        ?.eq('id', activityId)
        ?.eq('user_id', user?.id)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async markAllAsRead() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        ?.from('activity_feed')
        ?.update({ is_read: true })
        ?.eq('user_id', user?.id)
        ?.eq('is_read', false);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  },

  async getUnreadCount() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { count, error } = await supabase
        ?.from('activity_feed')
        ?.select('*', { count: 'exact', head: true })
        ?.eq('user_id', user?.id)
        ?.eq('is_read', false);

      if (error) throw error;
      return { data: count || 0, error: null };
    } catch (error) {
      return { data: 0, error: { message: error?.message } };
    }
  },

  async deleteActivity(activityId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        ?.from('activity_feed')
        ?.delete()
        ?.eq('id', activityId)
        ?.eq('user_id', user?.id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  },

  subscribeToActivities(callback) {
    const channel = supabase
      ?.channel('activity-feed-changes')
      ?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'activity_feed' },
        (payload) => {
          callback({
            eventType: payload?.eventType,
            new: toCamelCase(payload?.new),
            old: toCamelCase(payload?.old)
          });
        }
      )
      ?.subscribe();

    return () => supabase?.removeChannel(channel);
  }
};