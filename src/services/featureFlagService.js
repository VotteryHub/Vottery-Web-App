import { supabase } from '../lib/supabase';

class FeatureFlagService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  // Get feature flag
  async getFeatureFlag(flagKey) {
    try {
      // Check cache first
      const cached = this.cache?.get(flagKey);
      if (cached && Date.now() - cached?.timestamp < this.cacheExpiry) {
        return cached?.value;
      }

      const { data, error } = await supabase?.from('feature_flags')?.select('*')?.eq('flag_key', flagKey)?.eq('is_active', true)?.single();

      if (error && error?.code !== 'PGRST116') throw error;

      // Cache the result
      this.cache?.set(flagKey, {
        value: data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('Get feature flag error:', error);
      return null;
    }
  }

  // Check if feature is enabled for user
  async isFeatureEnabled(flagKey, userId = null) {
    try {
      const flag = await this.getFeatureFlag(flagKey);
      
      if (!flag) return false;
      if (!flag?.is_active) return false;

      // Check rollout percentage
      if (flag?.rollout_percentage < 100) {
        if (userId) {
          // Consistent hashing for user-based rollout
          let hash = this.hashUserId(userId);
          if (hash > flag?.rollout_percentage) {
            return false;
          }
        } else {
          // Random rollout for anonymous users
          if (Math.random() * 100 > flag?.rollout_percentage) {
            return false;
          }
        }
      }

      // Check user segments
      if (flag?.target_segments && flag?.target_segments?.length > 0 && userId) {
        const userSegments = await this.getUserSegments(userId);
        const hasMatchingSegment = flag?.target_segments?.some(segment => 
          userSegments?.includes(segment)
        );
        if (!hasMatchingSegment) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Check feature enabled error:', error);
      return false;
    }
  }

  // Get all active feature flags
  async getAllFeatureFlags() {
    try {
      const { data, error } = await supabase?.from('feature_flags')?.select('*')?.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get all feature flags error:', error);
      return [];
    }
  }

  // Create feature flag
  async createFeatureFlag(flagData) {
    try {
      const { data, error } = await supabase?.from('feature_flags')?.insert({
        flag_key: flagData?.flag_key,
        flag_name: flagData?.flag_name,
        description: flagData?.description,
        is_active: flagData?.is_active ?? true,
        rollout_percentage: flagData?.rollout_percentage ?? 100,
        flag_type: flagData?.flag_type ?? 'boolean',
        created_at: new Date()?.toISOString()
      })?.select()?.single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create feature flag error:', error);
      throw error;
    }
  }

  // Update feature flag
  async updateFeatureFlag(flagKey, updates) {
    try {
      const { data, error } = await supabase?.from('feature_flags')?.update(updates)?.eq('flag_key', flagKey)?.select()?.single();
      if (error) throw error;
      // Invalidate cache
      this.cache?.delete(flagKey);
      return data;
    } catch (error) {
      console.error('Update feature flag error:', error);
      throw error;
    }
  }

  // Delete feature flag
  async deleteFeatureFlag(flagKey) {
    try {
      const { error } = await supabase?.from('feature_flags')?.delete()?.eq('flag_key', flagKey);

      if (error) throw error;

      // Clear cache
      this.cache?.delete(flagKey);

      return true;
    } catch (error) {
      console.error('Delete feature flag error:', error);
      throw error;
    }
  }

  // Get feature flag analytics
  async getFeatureFlagAnalytics(flagKey, days = 7) {
    try {
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)?.toISOString();

      const { data, error } = await supabase?.from('feature_flag_analytics')?.select('*')?.eq('flag_key', flagKey)?.gte('created_at', startDate)?.order('created_at', { ascending: true });

      if (error) throw error;

      // Aggregate analytics
      const analytics = {
        totalExposures: data?.length || 0,
        uniqueUsers: new Set(data?.map(d => d.user_id))?.size,
        conversionRate: this.calculateConversionRate(data),
        dailyExposures: this.groupByDay(data)
      };

      return analytics;
    } catch (error) {
      console.error('Get feature flag analytics error:', error);
      return null;
    }
  }

  // Track feature flag exposure
  async trackExposure(flagKey, userId, variant = 'default') {
    try {
      await supabase?.from('feature_flag_analytics')?.insert({
          flag_key: flagKey,
          user_id: userId,
          variant: variant,
          created_at: new Date()?.toISOString()
        });
    } catch (error) {
      console.error('Track exposure error:', error);
    }
  }

  // Update rollout percentage for a feature flag
  async updateRolloutPercentage(flagKey, percentage) {
    try {
      const clampedPct = Math.max(0, Math.min(100, percentage));
      const { data, error } = await supabase
        ?.from('feature_flags')
        ?.update({ rollout_percentage: clampedPct, updated_at: new Date()?.toISOString() })
        ?.eq('flag_key', flagKey)
        ?.select()
        ?.single();
      if (error) throw error;
      // Invalidate cache
      this.cache?.delete(flagKey);
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }

  // Create A/B test configuration
  async createABTest(config) {
    try {
      const { data, error } = await supabase
        ?.from('feature_flags')
        ?.insert({
          flag_key: config?.flagKey,
          flag_name: config?.name,
          description: config?.description,
          is_active: true,
          rollout_percentage: config?.rolloutPercentage || 50,
          ab_test_config: {
            variants: config?.variants || [
              { id: 'control', name: 'Control', weight: 50 },
              { id: 'variant_a', name: 'Variant A', weight: 50 }
            ],
            metric: config?.metric || 'engagement_rate',
            startDate: new Date()?.toISOString(),
            endDate: config?.endDate || null
          },
          target_segments: config?.targetSegments || []
        })
        ?.select()
        ?.single();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }

  // Get A/B test results
  async getABTestResults(flagKey) {
    try {
      const { data, error } = await supabase
        ?.from('feature_flags')
        ?.select('*')
        ?.eq('flag_key', flagKey)
        ?.single();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }

  // Helper: Hash user ID for consistent rollout
  hashUserId(userId) {
    let hash = 0;
    for (let i = 0; i < userId?.length; i++) {
      const char = userId?.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash % 100);
  }

  // Helper: Get user segments
  async getUserSegments(userId) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('user_role, reputation_score, created_at')?.eq('id', userId)?.single();

      if (error) throw error;

      const segments = [];
      
      // Role-based segments
      if (data?.user_role) segments?.push(data?.user_role);
      
      // Reputation-based segments
      if (data?.reputation_score > 1000) segments?.push('high_reputation');
      else if (data?.reputation_score > 500) segments?.push('medium_reputation');
      else segments?.push('low_reputation');
      
      // Tenure-based segments
      const accountAge = Date.now() - new Date(data.created_at)?.getTime();
      const daysOld = accountAge / (1000 * 60 * 60 * 24);
      if (daysOld > 365) segments?.push('veteran');
      else if (daysOld > 30) segments?.push('regular');
      else segments?.push('new_user');

      return segments;
    } catch (error) {
      console.error('Get user segments error:', error);
      return [];
    }
  }

  // Helper: Calculate conversion rate
  calculateConversionRate(data) {
    if (!data || data?.length === 0) return 0;
    const conversions = data?.filter(d => d?.converted)?.length;
    return (conversions / data?.length) * 100;
  }

  // Helper: Group data by day
  groupByDay(data) {
    const byDay = {};
    data?.forEach(d => {
      const day = new Date(d.created_at)?.toISOString()?.split('T')?.[0];
      byDay[day] = (byDay?.[day] || 0) + 1;
    });
    return Object.entries(byDay)?.map(([date, count]) => ({ date, count }));
  }

  // Clear cache
  clearCache() {
    this.cache?.clear();
  }
}

export const featureFlagService = new FeatureFlagService();