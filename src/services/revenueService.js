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

export const revenueService = {
  async getSubscriptionPlans() {
    try {
      const { data, error } = await supabase
        ?.from('subscription_plans')
        ?.select('*')
        ?.eq('is_active', true)
        ?.order('price', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async createSubscriptionPlan(planData) {
    try {
      const dbData = toSnakeCase(planData);
      const { data, error } = await supabase
        ?.from('subscription_plans')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async updateSubscriptionPlan(planId, updates) {
    try {
      const dbData = toSnakeCase(updates);
      const { data, error } = await supabase
        ?.from('subscription_plans')
        ?.update(dbData)
        ?.eq('id', planId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getActiveSubscribers(planId = null) {
    try {
      let query = supabase
        ?.from('user_subscriptions')
        ?.select(`
          *,
          user:user_id(name, username, avatar, country, gender, age),
          plan:plan_id(plan_name, price, duration)
        `)
        ?.eq('is_active', true);

      if (planId) {
        query = query?.eq('plan_id', planId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getRevenueConfig() {
    try {
      const { data, error } = await supabase
        ?.from('platform_revenue_config')
        ?.select('*')
        ?.order('revenue_type', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async updateRevenueConfig(revenueType, updates) {
    try {
      const dbData = toSnakeCase(updates);
      const { data, error } = await supabase
        ?.from('platform_revenue_config')
        ?.update(dbData)
        ?.eq('revenue_type', revenueType)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getRevenueAnalytics(startDate, endDate) {
    try {
      // Get participation fee revenue
      const { data: participationData } = await supabase
        ?.from('wallet_transactions')
        ?.select('amount, created_at')
        ?.eq('transaction_type', 'participation_fee')
        ?.gte('created_at', startDate)
        ?.lte('created_at', endDate);

      // Get subscription revenue
      const { data: subscriptionData } = await supabase
        ?.from('user_subscriptions')
        ?.select('plan:plan_id(price), created_at')
        ?.gte('created_at', startDate)
        ?.lte('created_at', endDate);

      // Calculate totals
      const participationRevenue = participationData?.reduce((sum, t) => sum + parseFloat(t?.amount || 0), 0) || 0;
      const subscriptionRevenue = subscriptionData?.reduce((sum, s) => sum + parseFloat(s?.plan?.price || 0), 0) || 0;

      return {
        data: {
          participationRevenue,
          subscriptionRevenue,
          totalRevenue: participationRevenue + subscriptionRevenue,
          participationCount: participationData?.length || 0,
          subscriptionCount: subscriptionData?.length || 0
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getRevenueByZone(startDate, endDate) {
    try {
      const { data, error } = await supabase
        ?.from('wallet_transactions')
        ?.select(`
          amount,
          user:user_id(country, purchasing_power_zone)
        `)
        ?.eq('transaction_type', 'participation_fee')
        ?.gte('created_at', startDate)
        ?.lte('created_at', endDate);

      if (error) throw error;

      // Group by zone
      const zoneRevenue = data?.reduce((acc, transaction) => {
        const zone = transaction?.user?.purchasing_power_zone || 'Unknown';
        if (!acc?.[zone]) {
          acc[zone] = { zone, revenue: 0, count: 0 };
        }
        acc[zone].revenue += parseFloat(transaction?.amount || 0);
        acc[zone].count++;
        return acc;
      }, {});

      return { data: Object.values(zoneRevenue), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};

export default revenueService;