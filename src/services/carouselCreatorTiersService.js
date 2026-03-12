import { supabase } from '../lib/supabase';
import { stripeService } from './stripeService';

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

export const carouselCreatorTiersService = {
  // Get all available tiers
  async getAllTiers() {
    try {
      const { data, error } = await supabase
        ?.from('carousel_creator_tiers')
        ?.select('*')
        ?.eq('is_active', true)
        ?.order('price_monthly', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error fetching carousel tiers:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get creator's current subscription
  async getCreatorSubscription(creatorId) {
    try {
      const { data, error } = await supabase
        ?.from('carousel_creator_subscriptions')
        ?.select(`
          *,
          tier:tier_id(
            id,
            tier_name,
            tier_display_name,
            price_monthly,
            features,
            max_carousels,
            sponsorship_priority,
            analytics_access,
            exclusive_tools
          )
        `)
        ?.eq('creator_id', creatorId)
        ?.eq('status', 'active')
        ?.single();

      if (error && error?.code !== 'PGRST116') throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error fetching creator subscription:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Subscribe to a tier
  async subscribeTier(tierId, creatorId) {
    try {
      // Get tier details
      const { data: tier, error: tierError } = await supabase
        ?.from('carousel_creator_tiers')
        ?.select('*')
        ?.eq('id', tierId)
        ?.single();

      if (tierError) throw tierError;

      // Check if creator already has an active subscription
      const { data: existingSub } = await this.getCreatorSubscription(creatorId);
      if (existingSub) {
        throw new Error('Creator already has an active subscription');
      }

      // Create Stripe subscription if not free tier
      let stripeSubscriptionId = null;
      if (tier?.price_monthly > 0) {
        const { data: stripeData, error: stripeError } = await stripeService?.createSubscription({
          userId: creatorId,
          priceId: tier?.stripe_price_id,
          metadata: {
            tier_id: tierId,
            tier_name: tier?.tier_name
          }
        });

        if (stripeError) throw new Error('Failed to create Stripe subscription');
        stripeSubscriptionId = stripeData?.id;
      }

      // Create subscription record
      const expiresAt = new Date();
      expiresAt?.setMonth(expiresAt?.getMonth() + 1);

      const { data, error } = await supabase
        ?.from('carousel_creator_subscriptions')
        ?.insert(toSnakeCase({
          creatorId,
          tierId,
          status: 'active',
          startedAt: new Date()?.toISOString(),
          expiresAt: expiresAt?.toISOString(),
          stripeSubscriptionId,
          autoRenew: true
        }))
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error subscribing to tier:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Upgrade/Downgrade tier
  async changeTier(subscriptionId, newTierId) {
    try {
      const { data: subscription, error: subError } = await supabase
        ?.from('carousel_creator_subscriptions')
        ?.select('*, tier:tier_id(*)')
        ?.eq('id', subscriptionId)
        ?.single();

      if (subError) throw subError;

      const { data: newTier, error: tierError } = await supabase
        ?.from('carousel_creator_tiers')
        ?.select('*')
        ?.eq('id', newTierId)
        ?.single();

      if (tierError) throw tierError;

      // Update Stripe subscription if applicable
      if (subscription?.stripe_subscription_id) {
        await stripeService?.updateSubscription(subscription?.stripe_subscription_id, {
          priceId: newTier?.stripe_price_id
        });
      }

      // Update subscription record
      const { data, error } = await supabase
        ?.from('carousel_creator_subscriptions')
        ?.update({ tier_id: newTierId })
        ?.eq('id', subscriptionId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error changing tier:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Cancel subscription
  async cancelSubscription(subscriptionId) {
    try {
      const { data: subscription } = await supabase
        ?.from('carousel_creator_subscriptions')
        ?.select('*')
        ?.eq('id', subscriptionId)
        ?.single();

      if (subscription?.stripe_subscription_id) {
        await stripeService?.cancelSubscription(subscription?.stripe_subscription_id);
      }

      const { data, error } = await supabase
        ?.from('carousel_creator_subscriptions')
        ?.update({ status: 'cancelled', auto_renew: false })
        ?.eq('id', subscriptionId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Check feature access
  async hasFeatureAccess(creatorId, featureName) {
    try {
      const { data: subscription } = await this.getCreatorSubscription(creatorId);
      if (!subscription) return { data: false, error: null };

      const features = subscription?.tier?.features?.features || [];
      const hasAccess = features?.some(f => f?.toLowerCase()?.includes(featureName?.toLowerCase()));

      return { data: hasAccess, error: null };
    } catch (error) {
      console.error('Error checking feature access:', error);
      return { data: false, error: { message: error?.message } };
    }
  },

  // Get tier statistics
  async getTierStatistics() {
    try {
      const { data: subscriptions, error } = await supabase
        ?.from('carousel_creator_subscriptions')
        ?.select('tier_id, status')
        ?.eq('status', 'active');

      if (error) throw error;

      const stats = {};
      subscriptions?.forEach(sub => {
        if (!stats?.[sub?.tier_id]) {
          stats[sub?.tier_id] = 0;
        }
        stats[sub?.tier_id]++;
      });

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching tier statistics:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Admin: Toggle tier availability
  async toggleTierAvailability(tierId, isActive) {
    try {
      const { data, error } = await supabase
        ?.from('carousel_creator_tiers')
        ?.update({ is_active: isActive })
        ?.eq('id', tierId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error toggling tier availability:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Admin: Update tier features
  async updateTierFeatures(tierId, updates) {
    try {
      const dbData = toSnakeCase(updates);
      const { data, error } = await supabase
        ?.from('carousel_creator_tiers')
        ?.update(dbData)
        ?.eq('id', tierId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error updating tier features:', error);
      return { data: null, error: { message: error?.message } };
    }
  }
};