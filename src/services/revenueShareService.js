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

export const revenueShareService = {
  // Get active revenue split for a specific creator
  async getActiveRevenueSplit(creatorId) {
    try {
      const { data, error } = await supabase?.rpc('get_active_revenue_split', {
        p_creator_id: creatorId
      });

      if (error) throw error;
      return { data: toCamelCase(data?.[0]), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get global revenue sharing configuration
  async getGlobalConfig() {
    try {
      const { data, error } = await supabase
        ?.from('revenue_sharing_config')
        ?.select('*')
        ?.eq('is_global_default', true)
        ?.eq('is_active', true)
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Update global revenue split
  async updateGlobalSplit(updates) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbData = toSnakeCase({
        ...updates,
        updatedAt: new Date()?.toISOString(),
        createdBy: user?.id
      });

      const { data, error } = await supabase
        ?.from('revenue_sharing_config')
        ?.update(dbData)
        ?.eq('is_global_default', true)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get all revenue sharing campaigns
  async getAllCampaigns() {
    try {
      const { data, error } = await supabase
        ?.from('revenue_sharing_campaigns')
        ?.select('*')
        ?.order('start_date', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get active campaigns
  async getActiveCampaigns() {
    try {
      const { data, error } = await supabase
        ?.from('revenue_sharing_campaigns')
        ?.select('*')
        ?.eq('status', 'active')
        ?.order('priority', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Create new revenue sharing campaign
  async createCampaign(campaignData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbData = toSnakeCase({
        ...campaignData,
        createdBy: user?.id
      });

      const { data, error } = await supabase
        ?.from('revenue_sharing_campaigns')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Update campaign
  async updateCampaign(campaignId, updates) {
    try {
      const dbData = toSnakeCase({
        ...updates,
        updatedAt: new Date()?.toISOString()
      });

      const { data, error } = await supabase
        ?.from('revenue_sharing_campaigns')
        ?.update(dbData)
        ?.eq('id', campaignId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Delete campaign
  async deleteCampaign(campaignId) {
    try {
      const { error } = await supabase
        ?.from('revenue_sharing_campaigns')
        ?.delete()
        ?.eq('id', campaignId);

      if (error) throw error;
      return { data: { success: true }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get per-creator overrides
  async getCreatorOverrides() {
    try {
      const { data, error } = await supabase
        ?.from('creator_revenue_overrides')
        ?.select(`
          *,
          creator:creator_id(name, username, avatar)
        `)
        ?.eq('is_active', true)
        ?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Create creator override
  async createCreatorOverride(overrideData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbData = toSnakeCase({
        ...overrideData,
        approvedBy: user?.id
      });

      const { data, error } = await supabase
        ?.from('creator_revenue_overrides')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Update creator override
  async updateCreatorOverride(overrideId, updates) {
    try {
      const dbData = toSnakeCase({
        ...updates,
        updatedAt: new Date()?.toISOString()
      });

      const { data, error } = await supabase
        ?.from('creator_revenue_overrides')
        ?.update(dbData)
        ?.eq('id', overrideId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get revenue sharing history
  async getRevenueSharingHistory(limit = 50) {
    try {
      const { data, error } = await supabase
        ?.from('revenue_sharing_history')
        ?.select('*')
        ?.order('changed_at', { ascending: false })
        ?.limit(limit);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get revenue impact projections
  async getRevenueProjections(configId = null, campaignId = null) {
    try {
      let query = supabase
        ?.from('revenue_split_projections')
        ?.select('*')
        ?.order('created_at', { ascending: false });

      if (configId) {
        query = query?.eq('config_id', configId);
      }
      if (campaignId) {
        query = query?.eq('campaign_id', campaignId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Calculate revenue split for payout
  async calculateRevenueSplit(creatorId, totalAmount, countryCode = null) {
    try {
      // Use new country-aware calculation function
      const { data, error } = await supabase?.rpc('calculate_revenue_split_with_country', {
        p_creator_id: creatorId,
        p_total_amount: totalAmount,
        p_country_code: countryCode
      });

      if (error) throw error;

      const result = toCamelCase(data?.[0]);

      return {
        data: {
          creatorAmount: result?.creatorAmount,
          platformAmount: result?.platformAmount,
          creatorPercentage: result?.creatorPercentage,
          platformPercentage: result?.platformPercentage,
          splitSource: result?.splitSource,
          breakdown: {
            total: totalAmount,
            creator: result?.creatorAmount,
            platform: result?.platformAmount
          }
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get revenue split analytics
  async getRevenueSplitAnalytics(timeRange = '30d') {
    try {
      const now = new Date();
      let startDate = new Date();

      switch (timeRange) {
        case '7d':
          startDate?.setDate(now?.getDate() - 7);
          break;
        case '30d':
          startDate?.setDate(now?.getDate() - 30);
          break;
        case '90d':
          startDate?.setDate(now?.getDate() - 90);
          break;
        default:
          startDate?.setDate(now?.getDate() - 30);
      }

      // Get historical changes in time range
      const { data: historyData } = await supabase
        ?.from('revenue_sharing_history')
        ?.select('*')
        ?.gte('changed_at', startDate?.toISOString())
        ?.order('changed_at', { ascending: true });

      // Get active campaigns
      const { data: campaignsData } = await this.getActiveCampaigns();

      // Get creator overrides count
      const { data: overridesData, count: overridesCount } = await supabase
        ?.from('creator_revenue_overrides')
        ?.select('*', { count: 'exact', head: true })
        ?.eq('is_active', true);

      return {
        data: {
          historicalChanges: toCamelCase(historyData),
          activeCampaigns: campaignsData?.data || [],
          activeOverridesCount: overridesCount || 0,
          timeRange
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Trigger campaign automation (expire/activate)
  async triggerCampaignAutomation() {
    try {
      // Expire completed campaigns
      await supabase?.rpc('auto_expire_revenue_campaigns');
      
      // Activate scheduled campaigns
      await supabase?.rpc('activate_scheduled_campaigns');

      return { data: { success: true }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};

export default revenueShareService;