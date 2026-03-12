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

export const walletService = {
  async getUserWallet(userId) {
    try {
      const { data, error } = await supabase
        ?.from('user_wallets')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getWalletTransactions(userId, filters = {}) {
    try {
      let query = supabase
        ?.from('wallet_transactions')
        ?.select(`
          *,
          elections(id, title, cover_image, cover_image_alt)
        `)
        ?.eq('user_id', userId)
        ?.order('created_at', { ascending: false });

      if (filters?.type) {
        query = query?.eq('transaction_type', filters?.type);
      }

      if (filters?.status) {
        query = query?.eq('status', filters?.status);
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

  async createTransaction(transactionData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: wallet } = await this.getUserWallet(user?.id);
      if (!wallet) throw new Error('Wallet not found');

      const dbData = toSnakeCase({
        walletId: wallet?.id,
        userId: user?.id,
        transactionType: transactionData?.transactionType,
        amount: transactionData?.amount,
        balanceBefore: wallet?.availableBalance,
        balanceAfter: transactionData?.transactionType === 'winning' 
          ? parseFloat(wallet?.availableBalance) + parseFloat(transactionData?.amount)
          : parseFloat(wallet?.availableBalance) - parseFloat(transactionData?.amount),
        status: transactionData?.status || 'completed',
        description: transactionData?.description,
        referenceId: transactionData?.referenceId,
        electionId: transactionData?.electionId || null,
        metadata: transactionData?.metadata || {}
      });

      const { data, error } = await supabase
        ?.from('wallet_transactions')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getPrizeRedemptions(userId) {
    try {
      const { data, error } = await supabase
        ?.from('prize_redemptions')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async createRedemption(redemptionData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: wallet } = await this.getUserWallet(user?.id);
      if (!wallet) throw new Error('Wallet not found');

      if (parseFloat(wallet?.availableBalance) < parseFloat(redemptionData?.amount)) {
        throw new Error('Insufficient balance');
      }

      const dbData = toSnakeCase({
        userId: user?.id,
        walletId: wallet?.id,
        redemptionType: redemptionData?.redemptionType,
        amount: redemptionData?.amount,
        conversionRate: redemptionData?.conversionRate || 1.0,
        finalAmount: redemptionData?.finalAmount || redemptionData?.amount,
        status: 'pending',
        paymentDetails: redemptionData?.paymentDetails || {},
        processingFee: redemptionData?.processingFee || 0,
        notes: redemptionData?.notes || ''
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

  async getPayoutSettings(userId) {
    try {
      const { data, error } = await supabase
        ?.from('payout_settings')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async updatePayoutSettings(userId, settings) {
    try {
      const dbData = toSnakeCase(settings);

      const { data, error } = await supabase
        ?.from('payout_settings')
        ?.update(dbData)
        ?.eq('user_id', userId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  formatCurrency(amount, currency = 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })?.format(amount);
  },

  formatDate(dateString) {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};