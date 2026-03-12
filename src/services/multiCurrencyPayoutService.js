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

export const multiCurrencyPayoutService = {
  // Get current exchange rate
  async getExchangeRate(sourceCurrency, targetCurrency) {
    try {
      if (sourceCurrency === targetCurrency) {
        return { data: { rate: 1.0 }, error: null };
      }

      const { data, error } = await supabase
        ?.rpc('get_exchange_rate', {
          p_source_currency: sourceCurrency,
          p_target_currency: targetCurrency
        });

      if (error) throw error;
      return { data: { rate: data }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get all exchange rates
  async getAllExchangeRates() {
    try {
      const { data, error } = await supabase
        ?.from('exchange_rates')
        ?.select('*')
        ?.eq('is_active', true)
        ?.order('target_currency', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Update exchange rates (admin only)
  async updateExchangeRates(rates) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const updates = rates?.map(rate => ({
        base_currency: rate?.baseCurrency || 'USD',
        target_currency: rate?.targetCurrency,
        rate: rate?.rate,
        provider: rate?.provider || 'openexchangerates',
        last_updated: new Date()?.toISOString()
      }));

      const { data, error } = await supabase
        ?.from('exchange_rates')
        ?.upsert(updates, { onConflict: 'base_currency,target_currency' })
        ?.select();

      if (error) throw error;

      analytics?.trackEvent('exchange_rates_updated', {
        rates_count: updates?.length
      });

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get banking methods for country
  async getBankingMethods(countryCode = null) {
    try {
      let query = supabase
        ?.from('banking_methods_config')
        ?.select('*')
        ?.eq('is_active', true);

      if (countryCode) {
        query = query?.eq('country_code', countryCode);
      }

      const { data, error } = await query?.order('method_type', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Calculate payout fee
  async calculatePayoutFee(countryCode, bankingMethod, amount) {
    try {
      const { data, error } = await supabase
        ?.rpc('calculate_payout_fee', {
          p_country_code: countryCode,
          p_banking_method: bankingMethod,
          p_amount: amount
        });

      if (error) throw error;
      return { data: { fee: data }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Create multi-currency payout
  async createPayout(payoutData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get exchange rate
      const rateResult = await this.getExchangeRate(
        payoutData?.sourceCurrency,
        payoutData?.targetCurrency
      );

      if (rateResult?.error) throw new Error(rateResult?.error?.message);

      const exchangeRate = rateResult?.data?.rate;
      const targetAmount = payoutData?.sourceAmount * exchangeRate;

      // Calculate fee
      const feeResult = await this.calculatePayoutFee(
        payoutData?.countryCode,
        payoutData?.bankingMethod,
        targetAmount
      );

      const processingFee = feeResult?.data?.fee || 0;
      const netAmount = targetAmount - processingFee;

      const dbData = toSnakeCase({
        creatorId: user?.id,
        walletId: payoutData?.walletId,
        sourceAmount: payoutData?.sourceAmount,
        sourceCurrency: payoutData?.sourceCurrency,
        targetAmount: targetAmount,
        targetCurrency: payoutData?.targetCurrency,
        exchangeRate: exchangeRate,
        bankingMethod: payoutData?.bankingMethod,
        countryCode: payoutData?.countryCode,
        payoutStatus: 'pending',
        processingFee: processingFee,
        netAmount: netAmount,
        bankingDetails: payoutData?.bankingDetails
      });

      const { data, error } = await supabase
        ?.from('multi_currency_payouts')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (error) throw error;

      // Log currency conversion
      await supabase
        ?.from('currency_conversion_logs')
        ?.insert({
          payout_id: data?.id,
          source_currency: payoutData?.sourceCurrency,
          target_currency: payoutData?.targetCurrency,
          source_amount: payoutData?.sourceAmount,
          target_amount: targetAmount,
          exchange_rate: exchangeRate,
          rate_provider: 'openexchangerates'
        });

      analytics?.trackEvent('payout_created', {
        country_code: payoutData?.countryCode,
        banking_method: payoutData?.bankingMethod,
        amount: netAmount,
        currency: payoutData?.targetCurrency
      });

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get creator payouts
  async getCreatorPayouts(creatorId = null, filters = {}) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      const userId = creatorId || user?.id;
      if (!userId) throw new Error('Not authenticated');

      let query = supabase
        ?.from('multi_currency_payouts')
        ?.select(`
          *,
          user_profiles(id, username, full_name, country_code)
        `)
        ?.eq('creator_id', userId)
        ?.order('created_at', { ascending: false });

      if (filters?.status) {
        query = query?.eq('payout_status', filters?.status);
      }

      if (filters?.startDate) {
        query = query?.gte('created_at', filters?.startDate);
      }

      if (filters?.endDate) {
        query = query?.lte('created_at', filters?.endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get all payouts (admin)
  async getAllPayouts(filters = {}) {
    try {
      let query = supabase
        ?.from('multi_currency_payouts')
        ?.select(`
          *,
          user_profiles(id, username, full_name, country_code)
        `)
        ?.order('created_at', { ascending: false });

      if (filters?.status) {
        query = query?.eq('payout_status', filters?.status);
      }

      if (filters?.countryCode) {
        query = query?.eq('country_code', filters?.countryCode);
      }

      if (filters?.bankingMethod) {
        query = query?.eq('banking_method', filters?.bankingMethod);
      }

      const { data, error } = await query?.limit(filters?.limit || 100);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Update payout status
  async updatePayoutStatus(payoutId, newStatus, eventDescription, eventData = {}) {
    try {
      const { data, error } = await supabase
        ?.rpc('update_payout_status', {
          p_payout_id: payoutId,
          p_new_status: newStatus,
          p_event_description: eventDescription,
          p_event_data: eventData
        });

      if (error) throw error;

      analytics?.trackEvent('payout_status_updated', {
        payout_id: payoutId,
        new_status: newStatus
      });

      return { data: { success: data }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get payout audit trail
  async getPayoutAuditTrail(payoutId) {
    try {
      const { data, error } = await supabase
        ?.from('payout_audit_trail')
        ?.select('*')
        ?.eq('payout_id', payoutId)
        ?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get payout statistics
  async getPayoutStatistics(filters = {}) {
    try {
      let query = supabase
        ?.from('multi_currency_payouts')
        ?.select('*');

      if (filters?.startDate) {
        query = query?.gte('created_at', filters?.startDate);
      }

      if (filters?.endDate) {
        query = query?.lte('created_at', filters?.endDate);
      }

      const { data, error } = await query;

      if (error) throw error;

      const statistics = {
        totalPayouts: data?.length || 0,
        pendingPayouts: data?.filter(p => p?.payout_status === 'pending')?.length || 0,
        processingPayouts: data?.filter(p => p?.payout_status === 'processing')?.length || 0,
        completedPayouts: data?.filter(p => p?.payout_status === 'completed')?.length || 0,
        failedPayouts: data?.filter(p => p?.payout_status === 'failed')?.length || 0,
        totalAmount: data?.reduce((sum, p) => sum + parseFloat(p?.net_amount || 0), 0),
        totalFees: data?.reduce((sum, p) => sum + parseFloat(p?.processing_fee || 0), 0),
        byCountry: this.groupByCountry(data),
        byBankingMethod: this.groupByBankingMethod(data),
        byCurrency: this.groupByCurrency(data)
      };

      return { data: statistics, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get payout schedule recommendations based on exchange rates
  async getExchangeRateOptimizationRecommendations(sourceCurrency, targetCurrency, amount) {
    try {
      // Get historical rates for last 30 days
      const { data: historicalRates, error } = await supabase
        ?.from('exchange_rates')
        ?.select('rate, last_updated')
        ?.eq('base_currency', sourceCurrency)
        ?.eq('target_currency', targetCurrency)
        ?.gte('last_updated', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)?.toISOString())
        ?.order('last_updated', { ascending: false });

      if (error) throw error;

      if (!historicalRates || historicalRates?.length === 0) {
        return {
          data: {
            recommendation: 'insufficient_data',
            message: 'Not enough historical data for optimization',
            currentRate: null
          },
          error: null
        };
      }

      const currentRate = historicalRates?.[0]?.rate;
      const rates = historicalRates?.map(r => parseFloat(r?.rate));
      const avgRate = rates?.reduce((sum, r) => sum + r, 0) / rates?.length;
      const maxRate = Math.max(...rates);
      const minRate = Math.min(...rates);

      // Calculate potential savings
      const currentConversion = amount * currentRate;
      const avgConversion = amount * avgRate;
      const maxConversion = amount * maxRate;
      const potentialSavings = maxConversion - currentConversion;
      const vsAverage = currentConversion - avgConversion;

      let recommendation = 'hold';
      let message = '';

      if (currentRate >= avgRate * 1.02) {
        recommendation = 'process_now';
        message = `Current rate is ${((currentRate / avgRate - 1) * 100)?.toFixed(2)}% above 30-day average. Good time to process payout.`;
      } else if (currentRate <= avgRate * 0.98) {
        recommendation = 'wait';
        message = `Current rate is ${((1 - currentRate / avgRate) * 100)?.toFixed(2)}% below 30-day average. Consider waiting for better rates.`;
      } else {
        recommendation = 'neutral';
        message = 'Current rate is near 30-day average. No strong recommendation.';
      }

      return {
        data: {
          recommendation,
          message,
          currentRate,
          avgRate,
          maxRate,
          minRate,
          currentConversion,
          avgConversion,
          maxConversion,
          potentialSavings,
          vsAverage,
          confidence: historicalRates?.length >= 20 ? 'high' : 'medium'
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Update payout settings (schedule, threshold, banking method)
  async updatePayoutSettings(settings) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbData = toSnakeCase({
        userId: user?.id,
        autoPayoutEnabled: settings?.autoPayoutEnabled,
        minimumPayoutThreshold: settings?.minimumPayoutThreshold,
        preferredMethod: settings?.preferredMethod,
        payoutSchedule: settings?.payoutSchedule,
        bankDetails: settings?.bankDetails
      });

      const { data, error } = await supabase
        ?.from('payout_settings')
        ?.upsert(dbData, { onConflict: 'user_id' })
        ?.select()
        ?.single();

      if (error) throw error;

      analytics?.trackEvent('payout_settings_updated', {
        auto_payout: settings?.autoPayoutEnabled,
        threshold: settings?.minimumPayoutThreshold,
        schedule: settings?.payoutSchedule
      });

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get payout settings
  async getPayoutSettings(userId = null) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      const targetUserId = userId || user?.id;
      if (!targetUserId) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('payout_settings')
        ?.select('*')
        ?.eq('user_id', targetUserId)
        ?.single();

      if (error && error?.code !== 'PGRST116') throw error;

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Process automatic payout based on settings
  async processAutomaticPayout(userId) {
    try {
      // Get payout settings
      const settingsResult = await this.getPayoutSettings(userId);
      if (settingsResult?.error || !settingsResult?.data?.autoPayoutEnabled) {
        return { data: null, error: { message: 'Auto payout not enabled' } };
      }

      const settings = settingsResult?.data;

      // Check wallet balance
      const { data: wallet, error: walletError } = await supabase
        ?.from('user_wallets')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.single();

      if (walletError) throw walletError;

      const availableBalance = parseFloat(wallet?.available_balance || 0);
      if (availableBalance < settings?.minimumPayoutThreshold) {
        return { 
          data: null, 
          error: { message: `Balance $${availableBalance} below threshold $${settings?.minimumPayoutThreshold}` } 
        };
      }

      // Get user profile for country
      const { data: profile } = await supabase
        ?.from('user_profiles')
        ?.select('country_code')
        ?.eq('id', userId)
        ?.single();

      const countryCode = profile?.country_code || 'US';

      // Create payout
      const payoutData = {
        walletId: wallet?.id,
        sourceAmount: availableBalance,
        sourceCurrency: 'USD',
        targetCurrency: 'USD',
        bankingMethod: settings?.preferredMethod || 'ACH',
        countryCode,
        bankingDetails: settings?.bankDetails || {}
      };

      return await this.createPayout(payoutData);
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  groupByCountry(payouts) {
    const grouped = {};
    payouts?.forEach(payout => {
      const country = payout?.country_code;
      if (!grouped?.[country]) {
        grouped[country] = { count: 0, totalAmount: 0 };
      }
      grouped[country].count += 1;
      grouped[country].totalAmount += parseFloat(payout?.net_amount || 0);
    });
    return grouped;
  },

  groupByBankingMethod(payouts) {
    const grouped = {};
    payouts?.forEach(payout => {
      const method = payout?.banking_method;
      if (!grouped?.[method]) {
        grouped[method] = { count: 0, totalAmount: 0 };
      }
      grouped[method].count += 1;
      grouped[method].totalAmount += parseFloat(payout?.net_amount || 0);
    });
    return grouped;
  },

  groupByCurrency(payouts) {
    const grouped = {};
    payouts?.forEach(payout => {
      const currency = payout?.target_currency;
      if (!grouped?.[currency]) {
        grouped[currency] = { count: 0, totalAmount: 0 };
      }
      grouped[currency].count += 1;
      grouped[currency].totalAmount += parseFloat(payout?.net_amount || 0);
    });
    return grouped;
  },

  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })?.format(amount);
  }
};