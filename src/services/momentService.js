import { supabase } from '../lib/supabase';

// ============ PERFORMANCE TRACKING HELPER ============
const trackQuery = async (queryName, queryFn) => {
  const markStart = `${queryName}_start`;
  const markEnd = `${queryName}_end`;
  const measureName = `query_${queryName}`;

  performance.mark(markStart);
  try {
    const result = await queryFn();
    performance.mark(markEnd);
    try {
      performance.measure(measureName, markStart, markEnd);
      const entries = performance.getEntriesByName(measureName);
      const duration = entries?.[entries?.length - 1]?.duration || 0;
      if (duration > 100) {
        console.warn(`[SlowQuery] ${queryName} took ${duration?.toFixed(2)}ms (threshold: 100ms)`);
      }
      performance.clearMarks(markStart);
      performance.clearMarks(markEnd);
      performance.clearMeasures(measureName);
    } catch (_) {}
    return result;
  } catch (error) {
    performance.clearMarks(markStart);
    throw error;
  }
};

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

export const momentService = {
  async getMoments(limit = 30) {
    return trackQuery('momentService.getMoments', async () => {
      try {
        const now = new Date()?.toISOString();
        const { data, error } = await supabase
          ?.from('moments')
          ?.select('id, creator_id, content, media_url, expires_at, view_count, created_at')
          ?.gt('expires_at', now)
          ?.order('created_at', { ascending: false })
          ?.limit(limit);

        if (error) throw error;
        return { data: toCamelCase(data), error: null };
      } catch (error) {
        return { data: null, error: { message: error?.message } };
      }
    });
  },

  async getMomentsCursor(cursor = null, limit = 30) {
    return trackQuery('momentService.getMomentsCursor', async () => {
      try {
        const now = new Date()?.toISOString();
        let query = supabase
          ?.from('moments')
          ?.select('id, creator_id, content, media_url, expires_at, view_count, created_at')
          ?.gt('expires_at', now)
          ?.order('created_at', { ascending: false })
          ?.limit(limit);

        // Cursor-based pagination using created_at for infinite scroll
        if (cursor) {
          query = query?.lt('created_at', cursor);
        }

        const { data, error } = await query;

        if (error) throw error;

        const nextCursor = data?.length === limit ? data?.[data?.length - 1]?.created_at : null;

        return {
          data: toCamelCase(data),
          nextCursor,
          hasMore: data?.length === limit,
          error: null
        };
      } catch (error) {
        return { data: null, nextCursor: null, hasMore: false, error: { message: error?.message } };
      }
    });
  },

  async getUserMoments(userId, limit = 30) {
    return trackQuery('momentService.getUserMoments', async () => {
      try {
        const { data, error } = await supabase
          ?.from('moments')
          ?.select('id, creator_id, content, media_url, expires_at, view_count, created_at')
          ?.eq('creator_id', userId)
          ?.order('created_at', { ascending: false })
          ?.limit(limit);

        if (error) throw error;
        return { data: toCamelCase(data), error: null };
      } catch (error) {
        return { data: null, error: { message: error?.message } };
      }
    });
  },

  async getMomentById(momentId) {
    return trackQuery('momentService.getMomentById', async () => {
      try {
        const { data, error } = await supabase
          ?.from('moments')
          ?.select('id, creator_id, content, media_url, expires_at, view_count, created_at')
          ?.eq('id', momentId)
          ?.single();

        if (error) throw error;
        return { data: toCamelCase(data), error: null };
      } catch (error) {
        return { data: null, error: { message: error?.message } };
      }
    });
  },

  async getMomentWithCreator(momentId) {
    return trackQuery('momentService.getMomentWithCreator', async () => {
      try {
        // Single query with user_profiles join — eliminates separate profile fetch
        const { data, error } = await supabase
          ?.from('moments')
          ?.select('id, creator_id, content, media_url, expires_at, view_count, created_at, user_profiles(username, avatar_url)')
          ?.eq('id', momentId)
          ?.single();

        if (error) throw error;
        return { data: toCamelCase(data), error: null };
      } catch (error) {
        return { data: null, error: { message: error?.message } };
      }
    });
  },

  async getMomentsWithCreators(limit = 30, cursor = null) {
    return trackQuery('momentService.getMomentsWithCreators', async () => {
      try {
        const now = new Date()?.toISOString();
        let query = supabase
          ?.from('moments')
          ?.select('id, creator_id, content, media_url, expires_at, view_count, created_at, user_profiles(username, avatar_url)')
          ?.gt('expires_at', now)
          ?.order('created_at', { ascending: false })
          ?.limit(limit);

        if (cursor) {
          query = query?.lt('created_at', cursor);
        }

        const { data, error } = await query;

        if (error) throw error;

        const nextCursor = data?.length === limit ? data?.[data?.length - 1]?.created_at : null;

        return {
          data: toCamelCase(data),
          nextCursor,
          hasMore: data?.length === limit,
          error: null
        };
      } catch (error) {
        return { data: null, nextCursor: null, hasMore: false, error: { message: error?.message } };
      }
    });
  },

  async createMoment(momentData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('moments')
        ?.insert({ ...toSnakeCase(momentData), creator_id: user?.id })
        ?.select('id, creator_id, content, media_url, expires_at, view_count, created_at')
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async incrementViewCount(momentId) {
    try {
      const { error } = await supabase
        ?.rpc('increment_moment_view_count', { moment_id: momentId });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  },

  async deleteMoment(momentId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        ?.from('moments')
        ?.delete()
        ?.eq('id', momentId)
        ?.eq('creator_id', user?.id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  }
};

export default momentService;
