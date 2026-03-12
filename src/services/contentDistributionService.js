import { supabase } from '../lib/supabase';
import { analytics } from '../hooks/useGoogleAnalytics';

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

export const contentDistributionService = {
  // Get current distribution settings
  async getDistributionSettings() {
    try {
      const { data, error } = await supabase
        ?.from('content_distribution_settings')
        ?.select('*')
        ?.order('updated_at', { ascending: false })
        ?.limit(1)
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Update distribution percentages
  async updateDistributionPercentages(electionPercentage, socialMediaPercentage, userId) {
    try {
      // Validate percentages sum to 100
      if (electionPercentage + socialMediaPercentage !== 100) {
        throw new Error('Percentages must sum to 100');
      }

      const { data: currentSettings } = await this.getDistributionSettings();
      
      if (!currentSettings) {
        throw new Error('No distribution settings found');
      }

      const { data, error } = await supabase
        ?.from('content_distribution_settings')
        ?.update({
          election_content_percentage: electionPercentage,
          social_media_percentage: socialMediaPercentage,
          updated_by: userId
        })
        ?.eq('id', currentSettings?.id)
        ?.select()
        ?.single();

      if (error) throw error;

      analytics?.trackEvent('content_distribution_updated', {
        election_percentage: electionPercentage,
        social_media_percentage: socialMediaPercentage,
        user_id: userId
      });

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Toggle distribution system on/off
  async toggleDistributionSystem(isEnabled, userId) {
    try {
      const { data: currentSettings } = await this.getDistributionSettings();
      
      if (!currentSettings) {
        throw new Error('No distribution settings found');
      }

      const { data, error } = await supabase
        ?.from('content_distribution_settings')
        ?.update({
          is_enabled: isEnabled,
          updated_by: userId
        })
        ?.eq('id', currentSettings?.id)
        ?.select()
        ?.single();

      if (error) throw error;

      analytics?.trackEvent('content_distribution_toggled', {
        is_enabled: isEnabled,
        user_id: userId
      });

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Toggle emergency freeze
  async toggleEmergencyFreeze(isActive, userId) {
    try {
      const { data: currentSettings } = await this.getDistributionSettings();
      
      if (!currentSettings) {
        throw new Error('No distribution settings found');
      }

      const { data, error } = await supabase
        ?.from('content_distribution_settings')
        ?.update({
          emergency_freeze: isActive,
          updated_by: userId
        })
        ?.eq('id', currentSettings?.id)
        ?.select()
        ?.single();

      if (error) throw error;

      analytics?.trackEvent('emergency_freeze_toggled', {
        is_active: isActive,
        user_id: userId
      });

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get real-time metrics
  async getDistributionMetrics(timeRange = '24h') {
    try {
      const now = new Date();
      let startDate = new Date();
      
      switch(timeRange) {
        case '1h':
          startDate?.setHours(now?.getHours() - 1);
          break;
        case '24h':
          startDate?.setHours(now?.getHours() - 24);
          break;
        case '7d':
          startDate?.setDate(now?.getDate() - 7);
          break;
        case '30d':
          startDate?.setDate(now?.getDate() - 30);
          break;
        default:
          startDate?.setHours(now?.getHours() - 24);
      }

      const { data, error } = await supabase
        ?.from('content_distribution_metrics')
        ?.select('*')
        ?.gte('timestamp', startDate?.toISOString())
        ?.order('timestamp', { ascending: false })
        ?.limit(100);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get distribution history
  async getDistributionHistory(limit = 50) {
    try {
      const { data, error } = await supabase
        ?.from('content_distribution_history')
        ?.select('*, changed_by:user_profiles!changed_by(name, username, avatar)')
        ?.order('created_at', { ascending: false })
        ?.limit(limit);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get algorithm performance
  async getAlgorithmPerformance() {
    try {
      const { data, error } = await supabase
        ?.from('algorithm_performance')
        ?.select('*')
        ?.order('timestamp', { ascending: false })
        ?.limit(10);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Update zone-specific settings
  async updateZoneSettings(zoneSettings, userId) {
    try {
      const { data: currentSettings } = await this.getDistributionSettings();
      
      if (!currentSettings) {
        throw new Error('No distribution settings found');
      }

      const { data, error } = await supabase
        ?.from('content_distribution_settings')
        ?.update({
          zone_specific_settings: toSnakeCase(zoneSettings),
          updated_by: userId
        })
        ?.eq('id', currentSettings?.id)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Update algorithm mode
  async updateAlgorithmMode(mode, userId) {
    try {
      const { data: currentSettings } = await this.getDistributionSettings();
      
      if (!currentSettings) {
        throw new Error('No distribution settings found');
      }

      const { data, error } = await supabase
        ?.from('content_distribution_settings')
        ?.update({
          algorithm_mode: mode,
          updated_by: userId
        })
        ?.eq('id', currentSettings?.id)
        ?.select()
        ?.single();

      if (error) throw error;

      analytics?.trackEvent('algorithm_mode_changed', {
        mode: mode,
        user_id: userId
      });

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get current distribution effectiveness
  async getDistributionEffectiveness() {
    try {
      const { data: metrics } = await this.getDistributionMetrics('24h');
      
      if (!metrics || metrics?.length === 0) {
        return { data: null, error: { message: 'No metrics available' } };
      }

      const latestMetric = metrics?.[0];
      const totalServed = latestMetric?.electionContentServed + latestMetric?.socialMediaContentServed;
      
      const effectiveness = {
        actualElectionPercentage: ((latestMetric?.electionContentServed / totalServed) * 100)?.toFixed(1),
        actualSocialPercentage: ((latestMetric?.socialMediaContentServed / totalServed) * 100)?.toFixed(1),
        totalImpressions: latestMetric?.totalImpressions,
        electionEngagement: latestMetric?.electionEngagementRate,
        socialEngagement: latestMetric?.socialMediaEngagementRate,
        averageSessionDuration: latestMetric?.averageSessionDuration,
        bounceRate: latestMetric?.bounceRate,
        conversionRate: latestMetric?.conversionRate
      };

      return { data: effectiveness, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};