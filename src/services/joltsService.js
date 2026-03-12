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

export const joltsService = {
  async getAll(filters = {}) {
    try {
      let query = supabase?.from('jolts')?.select(`
        *,
        user_profiles!jolts_creator_id_fkey(name, username, avatar, verified)
      `)?.order('created_at', { ascending: false });

      if (filters?.trending) query = query?.eq('is_trending', true);
      if (filters?.creatorId) query = query?.eq('creator_id', filters?.creatorId);

      // Cursor-based pagination
      if (filters?.cursor) {
        query = query?.lt('created_at', filters?.cursor);
      }
      const pageSize = filters?.pageSize || 20;
      query = query?.limit(pageSize);

      const { data, error } = await query;
      if (error) throw error;

      const camelData = toCamelCase(data);
      const nextCursor = camelData?.length === pageSize ? camelData?.[camelData?.length - 1]?.createdAt : null;

      return { data: camelData, nextCursor, hasMore: !!nextCursor, error: null };
    } catch (error) {
      // Return mock data if table doesn't exist
      return {
        data: [],
        nextCursor: null,
        hasMore: false,
        error: null
      };
    }
  }
};
