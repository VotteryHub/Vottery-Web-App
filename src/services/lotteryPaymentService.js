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

export const gamifiedPaymentService = {
  async processParticipationFee(electionId, userId) {
    try {
      const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3001';
      
      // Get election details
      const { data: election } = await supabase?.from('elections')?.select('participation_fee_amount, participation_fee_enabled')?.eq('id', electionId)?.single();

      if (!election?.participation_fee_enabled) {
        return { requiresPayment: false, error: null };
      }

      // Create payment intent via API
      const response = await fetch(`${API_URL}/api/gamified/cast-vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          electionId,
          userId,
          voteData: {},
          participationFee: true
        })
      });

      const result = await response?.json();
      
      if (!response?.ok) {
        throw new Error(result.error || 'Failed to process participation fee');
      }

      return { 
        requiresPayment: result?.requiresPayment,
        clientSecret: result?.clientSecret,
        paymentIntentId: result?.paymentIntentId,
        error: null 
      };
    } catch (error) {
      return { requiresPayment: false, error: { message: error?.message } };
    }
  },

  async getParticipationFeeTransactions(userId, filters = {}) {
    try {
      let query = supabase?.from('participation_fee_transactions')?.select(`
          *,
          elections(id, title, cover_image, cover_image_alt)
        `)?.eq('user_id', userId)?.order('created_at', { ascending: false });

      if (filters?.status) {
        query = query?.eq('status', filters?.status);
      }

      if (filters?.electionId) {
        query = query?.eq('election_id', filters?.electionId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getTransactionStats(userId) {
    try {
      const { data, error } = await supabase?.from('participation_fee_transactions')?.select('amount, status')?.eq('user_id', userId);

      if (error) throw error;

      const stats = {
        totalTransactions: data?.length,
        totalSpent: data?.filter(t => t?.status === 'completed')?.reduce((sum, t) => sum + parseFloat(t?.amount), 0),
        pendingAmount: data?.filter(t => t?.status === 'pending')?.reduce((sum, t) => sum + parseFloat(t?.amount), 0),
        failedCount: data?.filter(t => t?.status === 'failed')?.length
      };

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async processPrizePayout(distributionId) {
    try {
      // Get distribution details
      const { data: distribution } = await supabase?.from('prize_distributions')?.select(`
          *,
          user_profiles(id, email),
          elections(id, title)
        `)?.eq('id', distributionId)?.single();

      if (!distribution) {
        throw new Error('Distribution not found');
      }

      // Create Stripe payout (this would typically call Stripe API)
      const stripePublishableKey = import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY;
      
      if (!stripePublishableKey) {
        throw new Error('Stripe not configured');
      }

      // Update distribution status
      const { data, error } = await supabase?.from('prize_distributions')?.update({ 
          distribution_status: 'processing',
          payout_initiated_at: new Date()?.toISOString()
        })?.eq('id', distributionId)?.select()?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getPendingPayouts() {
    try {
      const { data, error } = await supabase?.from('prize_distributions')?.select(`
          *,
          user_profiles(id, name, email),
          elections(id, title)
        `)?.eq('distribution_status', 'pending')?.order('created_at', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getPayoutStats() {
    try {
      const { data, error } = await supabase?.from('prize_distributions')?.select('prize_amount, distribution_status');

      if (error) throw error;

      const stats = {
        totalPayouts: data?.length,
        totalAmount: data?.reduce((sum, p) => sum + parseFloat(p?.prize_amount), 0),
        completedAmount: data?.filter(p => p?.distribution_status === 'completed')?.reduce((sum, p) => sum + parseFloat(p?.prize_amount), 0),
        pendingAmount: data?.filter(p => p?.distribution_status === 'pending')?.reduce((sum, p) => sum + parseFloat(p?.prize_amount), 0),
        processingCount: data?.filter(p => p?.distribution_status === 'processing')?.length
      };

      return { data: stats, error: null };
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
  }
};
function lotteryPaymentService(...args) {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: lotteryPaymentService is not implemented yet.', args);
  return null;
}

export { lotteryPaymentService };