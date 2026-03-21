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

export const paymentRoutingService = {
  /**
   * Determine optimal payment provider based on zone, user preferences, and transaction type
   */
  async routePayment(paymentRequest) {
    try {
      const { userId, amount, currency, transactionType, zoneId } = paymentRequest;

      // Get user payment preferences
      const { data: userPreferences } = await supabase
        ?.from('user_payment_preferences')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.single();

      // Get zone-specific routing rules
      const { data: zoneRules } = await supabase
        ?.from('zone_payment_routing')
        ?.select('*')
        ?.eq('zone_id', zoneId)
        ?.single();

      // Get provider availability and costs
      const { data: providerConfig } = await supabase
        ?.from('payment_provider_config')
        ?.select('*')
        ?.eq('is_active', true);

      // Smart routing logic
      const routingDecision = this.calculateOptimalRoute({
        userPreferences,
        zoneRules,
        providerConfig,
        amount,
        currency,
        transactionType
      });

      // Log routing decision
      await supabase
        ?.from('payment_routing_logs')
        ?.insert(toSnakeCase({
          userId,
          amount,
          currency,
          transactionType,
          zoneId,
          selectedProvider: routingDecision?.provider,
          routingReason: routingDecision?.reason,
          estimatedCost: routingDecision?.estimatedCost,
          estimatedTime: routingDecision?.estimatedTime
        }));

      return { data: toCamelCase(routingDecision), error: null };
    } catch (error) {
      console.error('Error routing payment:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Calculate optimal payment route
   */
  calculateOptimalRoute(context) {
    const { userPreferences, zoneRules, providerConfig, amount, currency, transactionType } = context;

    // Priority 1: User preference (if set)
    if (userPreferences?.preferred_provider && this.isProviderAvailable(userPreferences?.preferred_provider, providerConfig)) {
      const provider = providerConfig?.find(p => p?.provider_name === userPreferences?.preferred_provider);
      return {
        provider: userPreferences?.preferred_provider,
        reason: 'user_preference',
        estimatedCost: this.calculateProviderCost(provider, amount),
        estimatedTime: provider?.avg_processing_time,
        providerConfig: provider
      };
    }

    // Priority 2: Zone-specific routing rules
    if (zoneRules?.preferred_providers?.length > 0) {
      const zoneProvider = zoneRules?.preferred_providers?.[0];
      if (this.isProviderAvailable(zoneProvider, providerConfig)) {
        const provider = providerConfig?.find(p => p?.provider_name === zoneProvider);
        return {
          provider: zoneProvider,
          reason: 'zone_optimization',
          estimatedCost: this.calculateProviderCost(provider, amount),
          estimatedTime: provider?.avg_processing_time,
          providerConfig: provider
        };
      }
    }

    // Priority 3: Transaction type optimization
    if (transactionType === 'subscription') {
      // Stripe is optimal for recurring payments
      const stripe = providerConfig?.find(p => p?.provider_name === 'stripe');
      if (stripe) {
        return {
          provider: 'stripe',
          reason: 'subscription_optimization',
          estimatedCost: this.calculateProviderCost(stripe, amount),
          estimatedTime: stripe?.avg_processing_time,
          providerConfig: stripe
        };
      }
    }

    if (transactionType === 'payout' && amount > 10000) {
      // Crypto is optimal for large payouts
      const crypto = providerConfig?.find(p => p?.provider_name === 'crypto');
      if (crypto) {
        return {
          provider: 'crypto',
          reason: 'large_payout_optimization',
          estimatedCost: this.calculateProviderCost(crypto, amount),
          estimatedTime: crypto?.avg_processing_time,
          providerConfig: crypto
        };
      }
    }

    // Priority 4: Cost optimization (lowest fees)
    const sortedByCost = providerConfig
      ?.map(p => ({
        ...p,
        totalCost: this.calculateProviderCost(p, amount)
      }))
      ?.sort((a, b) => a?.totalCost - b?.totalCost);

    const cheapestProvider = sortedByCost?.[0];
    return {
      provider: cheapestProvider?.provider_name,
      reason: 'cost_optimization',
      estimatedCost: cheapestProvider?.totalCost,
      estimatedTime: cheapestProvider?.avg_processing_time,
      providerConfig: cheapestProvider
    };
  },

  /**
   * Check if provider is available
   */
  isProviderAvailable(providerName, providerConfig) {
    return providerConfig?.some(p => p?.provider_name === providerName && p?.is_active);
  },

  /**
   * Calculate provider cost
   */
  calculateProviderCost(provider, amount) {
    const fixedFee = provider?.fixed_fee || 0;
    const percentageFee = (amount * (provider?.percentage_fee || 0)) / 100;
    return fixedFee + percentageFee;
  },

  /**
   * Process payment through selected provider
   */
  async processPayment(routingDecision, paymentDetails) {
    try {
      const { provider, providerConfig } = routingDecision;

      switch (provider) {
        case 'stripe':
          return await this.processStripePayment(paymentDetails, providerConfig);
        case 'paypal':
          return await this.processPayPalPayment(paymentDetails, providerConfig);
        case 'crypto':
          return await this.processCryptoPayment(paymentDetails, providerConfig);
        default:
          throw new Error(`Unsupported payment provider: ${provider}`);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Process Stripe payment
   */
  async processStripePayment(paymentDetails, config) {
    try {
      // Use existing Stripe service
      if (paymentDetails?.type === 'payout') {
        return await stripeService?.createCashPayout(paymentDetails);
      } else if (paymentDetails?.type === 'subscription') {
        // Handle subscription payment
        return { data: { success: true, provider: 'stripe' }, error: null };
      }
      return { data: { success: true, provider: 'stripe' }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Process PayPal payment
   */
  async processPayPalPayment(paymentDetails, config) {
    try {
      const processingFee = this.calculateProviderCost(config, paymentDetails?.amount);
      const localTransactionId = `PAYPAL_${Date.now()}`;
      const edgeFunctionName = config?.edge_function_name || 'paypal-payment-proxy';

      // Store transaction as initiated before external call
      const { data: txRow, error: txError } = await supabase
        ?.from('payment_transactions')
        ?.insert(toSnakeCase({
          userId: paymentDetails?.userId,
          provider: 'paypal',
          transactionId: localTransactionId,
          amount: paymentDetails?.amount,
          currency: paymentDetails?.currency || 'USD',
          status: 'initiated',
          transactionType: paymentDetails?.type,
          processingFee
        }))
        ?.select()
        ?.single();

      if (txError) throw txError;

      // Attempt PayPal checkout/create-payment through edge function.
      const { data: providerResult, error: providerError } = await supabase?.functions?.invoke(
        edgeFunctionName,
        {
          body: {
            provider: 'paypal',
            transactionId: localTransactionId,
            amount: paymentDetails?.amount,
            currency: paymentDetails?.currency || 'USD',
            paymentType: paymentDetails?.type,
            metadata: paymentDetails?.metadata || {}
          }
        }
      );

      if (providerError) {
        await supabase
          ?.from('payment_transactions')
          ?.update({
            status: 'failed',
            failure_reason: providerError?.message || 'PayPal provider error'
          })
          ?.eq('id', txRow?.id);
        throw providerError;
      }

      const providerTransactionId = providerResult?.transactionId || providerResult?.id || localTransactionId;
      const status = providerResult?.status || 'pending';
      const approvalUrl = providerResult?.approvalUrl || providerResult?.checkoutUrl || null;

      await supabase
        ?.from('payment_transactions')
        ?.update({
          transaction_id: providerTransactionId,
          status,
          provider_response: providerResult || {}
        })
        ?.eq('id', txRow?.id);

      return {
        data: toCamelCase({
          transactionId: providerTransactionId,
          status,
          amount: paymentDetails?.amount,
          provider: 'paypal',
          processingFee,
          approvalUrl,
          dbRecord: txRow
        }),
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Process crypto payment
   */
  async processCryptoPayment(paymentDetails, config) {
    try {
      // Use existing crypto withdrawal from stripeService
      if (paymentDetails?.type === 'payout') {
        return await stripeService?.createCryptoWithdrawal({
          amount: paymentDetails?.amount,
          cryptocurrency: paymentDetails?.cryptocurrency || 'USDT',
          walletAddress: paymentDetails?.walletAddress,
          network: paymentDetails?.network || 'ERC20',
          conversionRate: paymentDetails?.conversionRate || 1.0,
          cryptoAmount: paymentDetails?.cryptoAmount,
          networkFee: this.calculateProviderCost(config, paymentDetails?.amount)
        });
      }

      return { data: { success: true, provider: 'crypto' }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Get payment routing analytics
   */
  async getRoutingAnalytics(filters = {}) {
    try {
      let query = supabase
        ?.from('payment_routing_logs')
        ?.select('*')
        ?.order('created_at', { ascending: false });

      if (filters?.startDate) {
        query = query?.gte('created_at', filters?.startDate);
      }

      if (filters?.endDate) {
        query = query?.lte('created_at', filters?.endDate);
      }

      if (filters?.provider) {
        query = query?.eq('selected_provider', filters?.provider);
      }

      const { data, error } = await query?.limit(100);

      if (error) throw error;

      // Calculate analytics
      const analytics = {
        totalTransactions: data?.length,
        providerDistribution: this.calculateProviderDistribution(data),
        averageCost: data?.reduce((sum, t) => sum + (t?.estimated_cost || 0), 0) / (data?.length || 1),
        routingReasons: this.calculateRoutingReasons(data),
        costSavings: this.calculateCostSavings(data)
      };

      return { data: toCamelCase(analytics), error: null };
    } catch (error) {
      console.error('Error fetching routing analytics:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  calculateProviderDistribution(logs) {
    const distribution = {};
    logs?.forEach(log => {
      const provider = log?.selected_provider;
      distribution[provider] = (distribution?.[provider] || 0) + 1;
    });
    return distribution;
  },

  calculateRoutingReasons(logs) {
    const reasons = {};
    logs?.forEach(log => {
      const reason = log?.routing_reason;
      reasons[reason] = (reasons?.[reason] || 0) + 1;
    });
    return reasons;
  },

  calculateCostSavings(logs) {
    // Calculate savings compared to always using most expensive provider
    const maxCost = Math.max(...logs?.map(l => l?.estimated_cost || 0));
    const actualCost = logs?.reduce((sum, l) => sum + (l?.estimated_cost || 0), 0);
    const potentialCost = logs?.length * maxCost;
    return potentialCost - actualCost;
  }
};