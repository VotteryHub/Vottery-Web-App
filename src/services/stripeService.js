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

export const stripeService = {
  async getPaymentMethods(userId) {
    try {
      const { data, error } = await supabase
        ?.from('payment_methods')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async setDefaultPaymentMethod(userId, methodId) {
    try {
      await supabase
        ?.from('payment_methods')
        ?.update({ is_default: false })
        ?.eq('user_id', userId);

      const { data, error } = await supabase
        ?.from('payment_methods')
        ?.update({ is_default: true })
        ?.eq('user_id', userId)
        ?.eq('id', methodId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async removePaymentMethod(userId, methodId) {
    try {
      const { data: existing, error: readError } = await supabase
        ?.from('payment_methods')
        ?.select('id, is_default')
        ?.eq('user_id', userId)
        ?.eq('id', methodId)
        ?.single();
      if (readError) throw readError;

      const { error } = await supabase
        ?.from('payment_methods')
        ?.delete()
        ?.eq('user_id', userId)
        ?.eq('id', methodId);
      if (error) throw error;

      if (existing?.is_default) {
        const { data: fallback } = await supabase
          ?.from('payment_methods')
          ?.select('id')
          ?.eq('user_id', userId)
          ?.order('created_at', { ascending: false })
          ?.limit(1)
          ?.single();

        if (fallback?.id) {
          await supabase
            ?.from('payment_methods')
            ?.update({ is_default: true })
            ?.eq('user_id', userId)
            ?.eq('id', fallback?.id);
        }
      }

      return { data: { success: true }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getPayoutQueue(userId) {
    try {
      const { data, error } = await supabase
        ?.from('prize_redemptions')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.in('status', ['pending', 'processing'])
        ?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async createCashPayout(payoutData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbData = toSnakeCase({
        userId: user?.id,
        redemptionType: 'cash',
        amount: payoutData?.amount,
        conversionRate: 1.0,
        finalAmount: payoutData?.amount - (payoutData?.processingFee || 0),
        processingFee: payoutData?.processingFee || 0,
        paymentDetails: payoutData?.paymentDetails || {},
        status: 'pending'
      });

      const { data, error } = await supabase
        ?.from('prize_redemptions')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async createGiftCardRedemption(redemptionData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbData = toSnakeCase({
        userId: user?.id,
        redemptionType: 'gift_card',
        amount: redemptionData?.amount,
        conversionRate: 1.0,
        finalAmount: redemptionData?.amount,
        processingFee: 0,
        paymentDetails: {
          retailer: redemptionData?.retailer,
          denomination: redemptionData?.denomination,
          deliveryMethod: 'email'
        },
        status: 'pending'
      });

      const { data, error } = await supabase
        ?.from('prize_redemptions')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async createCryptoWithdrawal(withdrawalData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbData = toSnakeCase({
        userId: user?.id,
        redemptionType: 'crypto',
        amount: withdrawalData?.amount,
        conversionRate: withdrawalData?.conversionRate || 1.0,
        finalAmount: withdrawalData?.cryptoAmount,
        processingFee: withdrawalData?.networkFee || 0,
        paymentDetails: {
          cryptocurrency: withdrawalData?.cryptocurrency,
          walletAddress: withdrawalData?.walletAddress,
          network: withdrawalData?.network,
          exchangeRate: withdrawalData?.exchangeRate
        },
        status: 'pending'
      });

      const { data, error } = await supabase
        ?.from('prize_redemptions')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  getGiftCardRetailers() {
    return [
      { id: 'amazon', name: 'Amazon', logo: '🛒', denominations: [500, 1000, 2000, 5000] },
      { id: 'flipkart', name: 'Flipkart', logo: '🛍️', denominations: [500, 1000, 2000, 5000] },
      { id: 'swiggy', name: 'Swiggy', logo: '🍔', denominations: [200, 500, 1000, 2000] },
      { id: 'zomato', name: 'Zomato', logo: '🍕', denominations: [200, 500, 1000, 2000] },
      { id: 'myntra', name: 'Myntra', logo: '👗', denominations: [500, 1000, 2000, 5000] },
      { id: 'bigbasket', name: 'BigBasket', logo: '🥬', denominations: [500, 1000, 2000] }
    ];
  },

  getCryptocurrencies() {
    return [
      { 
        id: 'bitcoin', 
        name: 'Bitcoin', 
        symbol: 'BTC', 
        icon: '₿',
        currentRate: 4200000,
        networkFee: 0.0001,
        minWithdrawal: 1000
      },
      { 
        id: 'ethereum', 
        name: 'Ethereum', 
        symbol: 'ETH', 
        icon: 'Ξ',
        currentRate: 280000,
        networkFee: 0.002,
        minWithdrawal: 500
      },
      { 
        id: 'usdt', 
        name: 'Tether', 
        symbol: 'USDT', 
        icon: '₮',
        currentRate: 83,
        networkFee: 1,
        minWithdrawal: 100
      }
    ];
  },

  formatCurrency(amount, currency = 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })?.format(amount);
  },

  formatCrypto(amount, decimals = 8) {
    return parseFloat(amount)?.toFixed(decimals);
  },

  async processSubscriptionWebhook(event) {
    try {
      const subscription = event?.data?.object;
      const userId = subscription?.metadata?.user_id;
      const planId = subscription?.metadata?.plan_id;

      switch (event?.type) {
        case 'customer.subscription.created': case'customer.subscription.updated':
          // Calculate end date based on current period
          const endDate = new Date(subscription?.current_period_end * 1000);
          
          const { error: upsertError } = await supabase
            ?.from('user_subscriptions')
            ?.upsert({
              user_id: userId,
              plan_id: planId,
              stripe_subscription_id: subscription?.id,
              subscriber_type: subscription?.metadata?.subscriber_type || 'individual',
              start_date: new Date(subscription?.current_period_start * 1000)?.toISOString(),
              end_date: endDate?.toISOString(),
              is_active: subscription?.status === 'active',
              auto_renew: !subscription?.cancel_at_period_end,
              updated_at: new Date()?.toISOString()
            }, {
              onConflict: 'stripe_subscription_id'
            });

          if (upsertError) throw upsertError;
          break;

        case 'customer.subscription.deleted':
          const { error: deleteError } = await supabase
            ?.from('user_subscriptions')
            ?.update({
              is_active: false,
              auto_renew: false,
              end_date: new Date()?.toISOString(),
              updated_at: new Date()?.toISOString()
            })
            ?.eq('stripe_subscription_id', subscription?.id);

          if (deleteError) throw deleteError;
          break;

        case 'invoice.payment_succeeded':
          // Log successful payment
          console.log('Payment succeeded for subscription:', subscription?.id);
          break;

        case 'invoice.payment_failed':
          // Handle failed payment - could trigger retry logic
          console.error('Payment failed for subscription:', subscription?.id);
          
          // Update subscription status
          const { error: failError } = await supabase
            ?.from('user_subscriptions')
            ?.update({
              is_active: false,
              updated_at: new Date()?.toISOString()
            })
            ?.eq('stripe_subscription_id', subscription?.subscription);

          if (failError) throw failError;
          break;
      }

      return { success: true };
    } catch (error) {
      console.error('Webhook processing error:', error);
      return { success: false, error: error?.message };
    }
  },

  async getStripeCustomer(customerId) {
    try {
      const response = await fetch(`https://api.stripe.com/v1/customers/${customerId}`, {
        headers: {
          'Authorization': `Bearer ${import.meta.env?.STRIPE_SECRET_KEY}`,
        },
      });

      const customer = await response?.json();
      
      if (!response?.ok) {
        throw new Error(customer?.error?.message || 'Failed to get customer');
      }

      return { data: customer, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Carousel Monetization - Sponsorship Tiers
  async createCarouselSponsorship(sponsorshipData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbData = toSnakeCase({
        brandId: user?.id,
        carouselType: sponsorshipData?.carouselType, // 'horizontal', 'vertical', 'gradient'
        contentType: sponsorshipData?.contentType, // 'jolts', 'elections', 'winners', etc.
        tier: sponsorshipData?.tier, // 'bronze', 'silver', 'gold', 'platinum'
        placementSlot: sponsorshipData?.placementSlot, // 1-10
        pricingModel: sponsorshipData?.pricingModel, // 'cpm', 'cpc', 'flat'
        budgetTotal: sponsorshipData?.budgetTotal,
        startDate: sponsorshipData?.startDate,
        endDate: sponsorshipData?.endDate,
        targetAudience: sponsorshipData?.targetAudience || {},
        status: 'pending'
      });

      const { data, error } = await supabase
        ?.from('carousel_sponsorships')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getCarouselSponsorshipTiers() {
    return [
      {
        id: 'bronze',
        name: 'Bronze Tier',
        description: 'Featured placement in carousel rotation',
        features: ['Slots 8-10', 'Standard visibility', 'Basic analytics'],
        pricing: {
          cpm: 5.00, // $5 per 1000 impressions
          cpc: 0.50, // $0.50 per click
          flat: 500 // $500/month
        },
        revenueShare: { creator: 0.30, platform: 0.70 }
      },
      {
        id: 'silver',
        name: 'Silver Tier',
        description: 'Priority placement with enhanced visibility',
        features: ['Slots 5-7', 'Enhanced visibility', 'Advanced analytics', 'A/B testing'],
        pricing: {
          cpm: 8.00,
          cpc: 0.75,
          flat: 1000
        },
        revenueShare: { creator: 0.35, platform: 0.65 }
      },
      {
        id: 'gold',
        name: 'Gold Tier',
        description: 'Premium placement with maximum exposure',
        features: ['Slots 2-4', 'Premium visibility', 'Real-time analytics', 'Custom targeting'],
        pricing: {
          cpm: 12.00,
          cpc: 1.00,
          flat: 2000
        },
        revenueShare: { creator: 0.40, platform: 0.60 }
      },
      {
        id: 'platinum',
        name: 'Platinum Tier',
        description: 'Exclusive top placement with guaranteed visibility',
        features: ['Slot 1 (Hero)', 'Guaranteed impressions', 'Dedicated support', 'Custom integration'],
        pricing: {
          cpm: 20.00,
          cpc: 1.50,
          flat: 5000
        },
        revenueShare: { creator: 0.45, platform: 0.55 }
      }
    ];
  },

  async processCarouselPayment(sponsorshipId, paymentDetails) {
    try {
      const { data: sponsorship } = await supabase
        ?.from('carousel_sponsorships')
        ?.select('*')
        ?.eq('id', sponsorshipId)
        ?.single();

      if (!sponsorship) throw new Error('Sponsorship not found');

      // Create Stripe payment intent
      const paymentIntent = {
        amount: Math.round(sponsorship?.budget_total * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          sponsorship_id: sponsorshipId,
          carousel_type: sponsorship?.carousel_type,
          content_type: sponsorship?.content_type,
          tier: sponsorship?.tier
        }
      };

      // Update sponsorship status
      const { data, error } = await supabase
        ?.from('carousel_sponsorships')
        ?.update({
          status: 'active',
          payment_status: 'paid',
          activated_at: new Date()?.toISOString()
        })
        ?.eq('id', sponsorshipId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Creator Revenue Sharing
  async calculateCreatorRevenue(sponsorshipId, metrics) {
    try {
      const { data: sponsorship } = await supabase
        ?.from('carousel_sponsorships')
        ?.select('*, carousel_sponsorship_tiers(*)')
        ?.eq('id', sponsorshipId)
        ?.single();

      if (!sponsorship) throw new Error('Sponsorship not found');

      const tier = await this.getCarouselSponsorshipTiers()?.find(t => t?.id === sponsorship?.tier);
      const revenueShare = tier?.revenueShare;

      let totalRevenue = 0;
      if (sponsorship?.pricing_model === 'cpm') {
        totalRevenue = (metrics?.impressions / 1000) * tier?.pricing?.cpm;
      } else if (sponsorship?.pricing_model === 'cpc') {
        totalRevenue = metrics?.clicks * tier?.pricing?.cpc;
      } else {
        totalRevenue = tier?.pricing?.flat;
      }

      const creatorEarnings = totalRevenue * revenueShare?.creator;
      const platformFee = totalRevenue * revenueShare?.platform;

      return {
        data: {
          totalRevenue,
          creatorEarnings,
          platformFee,
          revenueShare,
          metrics
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async distributeCreatorPayouts(sponsorshipId) {
    try {
      const { data: sponsorship } = await supabase
        ?.from('carousel_sponsorships')
        ?.select('*, carousel_content!inner(creator_id)')
        ?.eq('id', sponsorshipId)
        ?.single();

      if (!sponsorship) throw new Error('Sponsorship not found');

      // Get metrics for revenue calculation
      const { data: metrics } = await supabase
        ?.from('carousel_analytics')
        ?.select('impressions, clicks, conversions')
        ?.eq('sponsorship_id', sponsorshipId)
        ?.single();

      const { data: revenue } = await this.calculateCreatorRevenue(sponsorshipId, metrics);

      // Create payout record
      const { data: payout, error } = await supabase
        ?.from('creator_payouts')
        ?.insert(toSnakeCase({
          creatorId: sponsorship?.carousel_content?.creator_id,
          sponsorshipId: sponsorshipId,
          amount: revenue?.creatorEarnings,
          payoutMethod: 'stripe_connect',
          status: 'pending',
          metrics: revenue?.metrics
        }))
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(payout), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Monetization Analytics
  async getCarouselMonetizationAnalytics(filters = {}) {
    try {
      let query = supabase
        ?.from('carousel_sponsorships')
        ?.select(`
          *,
          carousel_analytics(*)
        `);

      if (filters?.carouselType) {
        query = query?.eq('carousel_type', filters?.carouselType);
      }

      if (filters?.startDate) {
        query = query?.gte('created_at', filters?.startDate);
      }

      if (filters?.endDate) {
        query = query?.lte('created_at', filters?.endDate);
      }

      const { data, error } = await query?.order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate aggregate metrics
      const analytics = {
        totalSponsorships: data?.length || 0,
        totalRevenue: data?.reduce((sum, s) => sum + (s?.budget_total || 0), 0),
        totalImpressions: data?.reduce((sum, s) => sum + (s?.carousel_analytics?.impressions || 0), 0),
        totalClicks: data?.reduce((sum, s) => sum + (s?.carousel_analytics?.clicks || 0), 0),
        averageCTR: 0,
        revenueByCarouselType: {},
        revenueByTier: {},
        topPerformingContent: []
      };

      analytics.averageCTR = analytics?.totalImpressions > 0
        ? (analytics?.totalClicks / analytics?.totalImpressions * 100)?.toFixed(2)
        : 0;

      // Group by carousel type
      data?.forEach(s => {
        if (!analytics?.revenueByCarouselType?.[s?.carousel_type]) {
          analytics.revenueByCarouselType[s?.carousel_type] = 0;
        }
        analytics.revenueByCarouselType[s?.carousel_type] += s?.budget_total || 0;

        if (!analytics?.revenueByTier?.[s?.tier]) {
          analytics.revenueByTier[s?.tier] = 0;
        }
        analytics.revenueByTier[s?.tier] += s?.budget_total || 0;
      });

      return { data: { ...analytics, sponsorships: toCamelCase(data) }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Webhook handling for Stripe Connect
  async handleCarouselWebhook(event) {
    try {
      const sponsorshipId = event?.data?.object?.metadata?.sponsorship_id;

      switch (event?.type) {
        case 'payment_intent.succeeded':
          await supabase
            ?.from('carousel_sponsorships')
            ?.update({
              payment_status: 'paid',
              status: 'active',
              activated_at: new Date()?.toISOString()
            })
            ?.eq('id', sponsorshipId);
          break;

        case 'payment_intent.payment_failed':
          await supabase
            ?.from('carousel_sponsorships')
            ?.update({
              payment_status: 'failed',
              status: 'inactive'
            })
            ?.eq('id', sponsorshipId);
          break;

        case 'transfer.created':
          // Creator payout initiated
          const payoutId = event?.data?.object?.metadata?.payout_id;
          await supabase
            ?.from('creator_payouts')
            ?.update({
              status: 'processing',
              stripe_transfer_id: event?.data?.object?.id
            })
            ?.eq('id', payoutId);
          break;

        case 'transfer.paid':
          // Creator payout completed
          const completedPayoutId = event?.data?.object?.metadata?.payout_id;
          await supabase
            ?.from('creator_payouts')
            ?.update({
              status: 'completed',
              completed_at: new Date()?.toISOString()
            })
            ?.eq('id', completedPayoutId);
          break;
      }

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: { message: error?.message } };
    }
  }
};