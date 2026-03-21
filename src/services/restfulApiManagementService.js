import { supabase } from '../lib/supabase';

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    acc[camelKey] = toCamelCase(obj[key]);
    return acc;
  }, {});
};

export const restfulApiManagementService = {
  async getApiEndpointsCatalog() {
    try {
      const { data, error } = await supabase
        .from('api_endpoint_catalog')
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return { data: toCamelCase(data || []), error: null };
    } catch (error) {
      return { data: [], error: { message: error.message } };
    }
  },

  async getApiHealthSummary() {
    try {
      const { data, error } = await supabase.rpc('get_api_health_summary');
      if (error) throw error;
      return { data: toCamelCase(data || {}), error: null };
    } catch (error) {
      return { data: {}, error: { message: error.message } };
    }
  },

  async getApiRequestLogs({ limit = 100 } = {}) {
    try {
      const { data, error } = await supabase
        .from('api_request_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return { data: toCamelCase(data || []), error: null };
    } catch (error) {
      return { data: [], error: { message: error.message } };
    }
  },
};
