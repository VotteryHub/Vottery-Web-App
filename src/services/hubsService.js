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

export const hubsService = {
  async getAllHubs(limit = 20) {
    return trackQuery('hubsService.getAllHubs', async () => {
      try {
        const { data, error } = await supabase
          ?.from('groups')
          ?.select('id, name, description, created_by, member_count, is_public, created_at')
          ?.eq('is_public', true)
          ?.order('member_count', { ascending: false })
          ?.limit(limit);

        if (error) throw error;
        return { data: toCamelCase(data), error: null };
      } catch (error) {
        return { data: null, error: { message: error?.message } };
      }
    });
  },

  async getUserHubs(userId, limit = 20) {
    return trackQuery('hubsService.getUserHubs', async () => {
      try {
        const { data, error } = await supabase
          ?.from('group_members')
          ?.select(`
            group_id,
            groups!inner(id, name, description, created_by, member_count, is_public, created_at)
          `)
          ?.eq('user_id', userId)
          ?.limit(limit);

        if (error) throw error;
        const hubs = data?.map(item => item?.groups) || [];
        return { data: toCamelCase(hubs), error: null };
      } catch (error) {
        return { data: null, error: { message: error?.message } };
      }
    });
  },

  async getHubById(hubId) {
    return trackQuery('hubsService.getHubById', async () => {
      try {
        const { data, error } = await supabase
          ?.from('groups')
          ?.select('id, name, description, created_by, member_count, is_public, created_at')
          ?.eq('id', hubId)
          ?.single();

        if (error) throw error;
        return { data: toCamelCase(data), error: null };
      } catch (error) {
        return { data: null, error: { message: error?.message } };
      }
    });
  },

  async getHubMembers(hubId, limit = 20) {
    return trackQuery('hubsService.getHubMembers', async () => {
      try {
        const { data, error } = await supabase
          ?.from('group_members')
          ?.select(`
            id, group_id, user_id, role, joined_at,
            user_profiles!group_members_user_id_fkey(id, username, name, avatar, verified)
          `)
          ?.eq('group_id', hubId)
          ?.order('joined_at', { ascending: true })
          ?.limit(limit);

        if (error) throw error;
        return { data: toCamelCase(data), error: null };
      } catch (error) {
        return { data: null, error: { message: error?.message } };
      }
    });
  },

  async createHub(hubData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('groups')
        ?.insert({ ...toSnakeCase(hubData), created_by: user?.id })
        ?.select('id, name, description, created_by, member_count, is_public, created_at')
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async joinHub(hubId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('group_members')
        ?.insert({ group_id: hubId, user_id: user?.id, role: 'member' })
        ?.select('id, group_id, user_id, role, joined_at')
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async leaveHub(hubId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        ?.from('group_members')
        ?.delete()
        ?.eq('group_id', hubId)
        ?.eq('user_id', user?.id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  },

  async searchHubs(searchTerm, limit = 20) {
    return trackQuery('hubsService.searchHubs', async () => {
      try {
        const { data, error } = await supabase
          ?.from('groups')
          ?.select('id, name, description, created_by, member_count, is_public, created_at')
          ?.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
          ?.eq('is_public', true)
          ?.limit(limit);

        if (error) throw error;
        return { data: toCamelCase(data), error: null };
      } catch (error) {
        return { data: null, error: { message: error?.message } };
      }
    });
  }
};

export default hubsService;
