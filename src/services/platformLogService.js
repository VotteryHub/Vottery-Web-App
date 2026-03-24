import { supabase } from '../lib/supabase';

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    acc[camelKey] = toCamelCase(obj[key]);
    return acc;
  }, {});
};

export const platformLogService = {
  async getPlatformLogs(filters = {}) {
    try {
      let query = supabase
        .from('platform_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.logCategory && filters.logCategory !== 'all') {
        query = query.eq('log_category', filters.logCategory);
      }
      if (filters.logLevel && filters.logLevel !== 'all') {
        query = query.eq('log_level', filters.logLevel);
      }
      if (filters.source && filters.source !== 'all') {
        query = query.eq('source', filters.source);
      }
      if (filters.search) {
        const q = filters.search.replace(/%/g, '');
        query = query.or(
          `message.ilike.%${q}%,event_type.ilike.%${q}%,request_id.ilike.%${q}%`
        );
      }
      const limit = filters.limit ?? 500;
      query = query.limit(limit);

      const { data, error } = await query;
      if (error) throw error;
      return { data: toCamelCase(data || []), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getPlatformLogStatistics() {
    try {
      const { data, error } = await supabase
        .from('platform_logs')
        .select('log_level, log_category, created_at')
        .limit(5000);
      if (error) throw error;
      const rows = data || [];
      const byLevel = {};
      const byCategory = {};
      for (const row of rows) {
        byLevel[row.log_level] = (byLevel[row.log_level] || 0) + 1;
        byCategory[row.log_category] = (byCategory[row.log_category] || 0) + 1;
      }
      return {
        data: {
          total: rows.length,
          byLevel,
          byCategory,
        },
        error: null,
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },
};
