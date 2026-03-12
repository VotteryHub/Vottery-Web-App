import { supabase } from '../lib/supabase';

// Helper functions for case conversion
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

export const countryRevenueShareService = {
  // Get all country revenue splits
  async getAllCountrySplits() {
    try {
      const { data, error } = await supabase
        ?.from('country_revenue_splits')
        ?.select('*')
        ?.order('country_name', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get active country revenue splits
  async getActiveCountrySplits() {
    try {
      const { data, error } = await supabase
        ?.from('country_revenue_splits')
        ?.select('*')
        ?.eq('is_active', true)
        ?.order('country_name', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get revenue split for specific country
  async getCountrySplit(countryCode) {
    try {
      const { data, error } = await supabase
        ?.rpc('get_country_revenue_split', {
          p_country_code: countryCode
        });

      if (error) throw error;
      return { data: toCamelCase(data?.[0]), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Create new country revenue split
  async createCountrySplit(splitData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbData = toSnakeCase({
        ...splitData,
        createdBy: user?.id,
        updatedBy: user?.id
      });

      const { data, error } = await supabase
        ?.from('country_revenue_splits')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Update country revenue split
  async updateCountrySplit(splitId, updates) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbData = toSnakeCase({
        ...updates,
        updatedBy: user?.id,
        updatedAt: new Date()?.toISOString()
      });

      const { data, error } = await supabase
        ?.from('country_revenue_splits')
        ?.update(dbData)
        ?.eq('id', splitId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Delete country revenue split
  async deleteCountrySplit(splitId) {
    try {
      const { error } = await supabase
        ?.from('country_revenue_splits')
        ?.delete()
        ?.eq('id', splitId);

      if (error) throw error;
      return { data: { success: true }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Bulk update country splits
  async bulkUpdateCountrySplits(updates) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const results = [];
      for (const update of updates) {
        const result = await this.updateCountrySplit(update?.id, {
          creatorPercentage: update?.creatorPercentage,
          platformPercentage: update?.platformPercentage,
          description: update?.description
        });
        results?.push(result);
      }

      return { data: results, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get country split history
  async getCountrySplitHistory(countryCode = null, limit = 50) {
    try {
      let query = supabase
        ?.from('country_revenue_split_history')
        ?.select('*')
        ?.order('changed_at', { ascending: false })
        ?.limit(limit);

      if (countryCode) {
        query = query?.eq('country_code', countryCode);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get country revenue analytics
  async getCountryAnalytics(countryCode = null, periodStart = null, periodEnd = null) {
    try {
      let query = supabase
        ?.from('country_revenue_analytics')
        ?.select('*')
        ?.order('period_start', { ascending: false });

      if (countryCode) {
        query = query?.eq('country_code', countryCode);
      }

      if (periodStart) {
        query = query?.gte('period_start', periodStart);
      }

      if (periodEnd) {
        query = query?.lte('period_end', periodEnd);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Calculate revenue split with country override
  async calculateRevenueSplitWithCountry(creatorId, totalAmount, countryCode = null) {
    try {
      const { data, error } = await supabase
        ?.rpc('calculate_revenue_split_with_country', {
          p_creator_id: creatorId,
          p_total_amount: totalAmount,
          p_country_code: countryCode
        });

      if (error) throw error;
      return { data: toCamelCase(data?.[0]), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get summary statistics
  async getCountrySplitSummary() {
    try {
      const { data: allSplits, error: allError } = await this.getAllCountrySplits();
      if (allError) throw new Error(allError?.message);

      const { data: activeSplits, error: activeError } = await this.getActiveCountrySplits();
      if (activeError) throw new Error(activeError?.message);

      const averageCreatorPercentage = activeSplits?.reduce((sum, split) => 
        sum + parseFloat(split?.creatorPercentage), 0) / (activeSplits?.length || 1);

      const highestCreatorSplit = activeSplits?.reduce((max, split) => 
        parseFloat(split?.creatorPercentage) > parseFloat(max?.creatorPercentage) ? split : max, 
        activeSplits?.[0] || {});

      const lowestCreatorSplit = activeSplits?.reduce((min, split) => 
        parseFloat(split?.creatorPercentage) < parseFloat(min?.creatorPercentage) ? split : min, 
        activeSplits?.[0] || {});

      return {
        data: {
          totalCountries: allSplits?.length || 0,
          activeCountries: activeSplits?.length || 0,
          inactiveCountries: (allSplits?.length || 0) - (activeSplits?.length || 0),
          averageCreatorPercentage: averageCreatorPercentage?.toFixed(2),
          highestCreatorSplit: {
            country: highestCreatorSplit?.countryName,
            countryCode: highestCreatorSplit?.countryCode,
            percentage: highestCreatorSplit?.creatorPercentage
          },
          lowestCreatorSplit: {
            country: lowestCreatorSplit?.countryName,
            countryCode: lowestCreatorSplit?.countryCode,
            percentage: lowestCreatorSplit?.creatorPercentage
          }
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Validate split percentages
  validateSplit(creatorPercentage, platformPercentage) {
    const creator = parseFloat(creatorPercentage);
    const platform = parseFloat(platformPercentage);

    if (isNaN(creator) || isNaN(platform)) {
      return { valid: false, error: 'Percentages must be valid numbers' };
    }

    if (creator < 0 || creator > 100 || platform < 0 || platform > 100) {
      return { valid: false, error: 'Percentages must be between 0 and 100' };
    }

    if (Math.abs((creator + platform) - 100) > 0.01) {
      return { valid: false, error: 'Creator and platform percentages must sum to 100' };
    }

    return { valid: true, error: null };
  },

  // Preview revenue impact
  async previewRevenueImpact(countryCode, newCreatorPercentage, newPlatformPercentage) {
    try {
      // Get current split
      const { data: currentSplit } = await this.getCountrySplit(countryCode);
      
      // Get recent analytics
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo?.setDate(thirtyDaysAgo?.getDate() - 30);
      
      const { data: analytics } = await this.getCountryAnalytics(
        countryCode,
        thirtyDaysAgo?.toISOString(),
        new Date()?.toISOString()
      );

      if (!analytics || analytics?.length === 0) {
        return {
          data: {
            currentSplit: currentSplit || { creatorPercentage: 70, platformPercentage: 30 },
            newSplit: { creatorPercentage: newCreatorPercentage, platformPercentage: newPlatformPercentage },
            estimatedImpact: 'No historical data available',
            warning: 'Unable to calculate impact without transaction history'
          },
          error: null
        };
      }

      const totalRevenue = analytics?.reduce((sum, a) => sum + parseFloat(a?.totalRevenue || 0), 0);
      const currentCreatorEarnings = analytics?.reduce((sum, a) => sum + parseFloat(a?.creatorEarnings || 0), 0);
      const currentPlatformEarnings = analytics?.reduce((sum, a) => sum + parseFloat(a?.platformEarnings || 0), 0);

      const projectedCreatorEarnings = (totalRevenue * newCreatorPercentage) / 100;
      const projectedPlatformEarnings = (totalRevenue * newPlatformPercentage) / 100;

      const creatorDifference = projectedCreatorEarnings - currentCreatorEarnings;
      const platformDifference = projectedPlatformEarnings - currentPlatformEarnings;

      return {
        data: {
          currentSplit: currentSplit || { creatorPercentage: 70, platformPercentage: 30 },
          newSplit: { creatorPercentage: newCreatorPercentage, platformPercentage: newPlatformPercentage },
          historicalData: {
            totalRevenue: totalRevenue?.toFixed(2),
            currentCreatorEarnings: currentCreatorEarnings?.toFixed(2),
            currentPlatformEarnings: currentPlatformEarnings?.toFixed(2)
          },
          projectedData: {
            projectedCreatorEarnings: projectedCreatorEarnings?.toFixed(2),
            projectedPlatformEarnings: projectedPlatformEarnings?.toFixed(2),
            creatorDifference: creatorDifference?.toFixed(2),
            platformDifference: platformDifference?.toFixed(2),
            creatorDifferencePercent: ((creatorDifference / currentCreatorEarnings) * 100)?.toFixed(2),
            platformDifferencePercent: ((platformDifference / currentPlatformEarnings) * 100)?.toFixed(2)
          }
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};

export default countryRevenueShareService;
