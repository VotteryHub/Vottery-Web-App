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

// Simple in-memory cache with TTL to avoid excessive DB calls from the browser.
const policyCache = new Map();
const POLICY_TTL_MS = 5 * 60 * 1000;

export const aiAutoApprovalPolicyService = {
  async getPolicy(analysisType) {
    try {
      if (!analysisType) return { data: null, error: null };

      const cacheKey = analysisType;
      const cached = policyCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < POLICY_TTL_MS) {
        return { data: cached.data, error: null };
      }

      const { data, error } = await supabase
        ?.from('ai_auto_approval_policies')
        ?.select('*')
        ?.eq('analysis_type', analysisType)
        ?.eq('enabled', true)
        ?.maybeSingle();

      if (error) {
        return { data: null, error: { message: error?.message } };
      }

      const camelData = data ? toCamelCase(data) : null;
      policyCache.set(cacheKey, { data: camelData, timestamp: Date.now() });

      return { data: camelData, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },
};

