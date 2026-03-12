/**
 * Payout API – single contract for Web (and Mobile should call same Supabase/Edge).
 * Uses user_wallets + prize_redemptions. All errors return { data: null, error: { message } }.
 */
import { supabase } from '../../lib/supabase';
import { PAYOUT_THRESHOLD, PAYOUT_ERRORS } from './constants';

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    acc[camelKey] = toCamelCase(obj[key]);
    return acc;
  }, {});
};

const toSnakeCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    acc[snakeKey] = toSnakeCase(obj[key]);
    return acc;
  }, {});
};

export const payoutApi = {
  /** Get wallet (user_wallets). Returns { data, error }. */
  async getWallet(userId) {
    try {
      const { data, error } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (e) {
      return { data: null, error: { message: e?.message || PAYOUT_ERRORS.REQUEST_FAILED } };
    }
  },

  /** Get payout settings (payout_settings). */
  async getPayoutSettings(userId) {
    try {
      const { data, error } = await supabase
        .from('payout_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (e) {
      return { data: null, error: { message: e?.message || PAYOUT_ERRORS.REQUEST_FAILED } };
    }
  },

  /** Get payment history (prize_redemptions for user). */
  async getPayoutHistory(userId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('prize_redemptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return { data: (data || []).map(toCamelCase), error: null };
    } catch (e) {
      return { data: null, error: { message: e?.message || PAYOUT_ERRORS.REQUEST_FAILED } };
    }
  },

  /**
   * Request payout. Validates threshold and balance; writes to prize_redemptions.
   * Returns { data, error } with user-facing error.message from PAYOUT_ERRORS.
   */
  async requestPayout(userId, payload) {
    try {
      const { data: user } = (await supabase.auth.getUser()).data;
      if (!user) return { data: null, error: { message: PAYOUT_ERRORS.NOT_AUTHENTICATED } };

      const amount = Number(payload?.amount);
      if (!Number.isFinite(amount) || amount <= 0) {
        return { data: null, error: { message: PAYOUT_ERRORS.INVALID_AMOUNT } };
      }
      if (amount < PAYOUT_THRESHOLD) {
        return { data: null, error: { message: PAYOUT_ERRORS.BELOW_THRESHOLD } };
      }

      const { data: wallet, error: walletErr } = await supabase
        .from('user_wallets')
        .select('id, available_balance')
        .eq('user_id', userId)
        .single();
      if (walletErr || !wallet) {
        return { data: null, error: { message: PAYOUT_ERRORS.REQUEST_FAILED } };
      }
      const available = Number(wallet.available_balance) || 0;
      if (amount > available) {
        return { data: null, error: { message: PAYOUT_ERRORS.INSUFFICIENT_BALANCE } };
      }

      // Country-based payout calculation: fetch creator country and split for audit
      let countryCode = null;
      let splitAudit = {};
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('country_code, country_iso')
        .eq('id', userId)
        .single();
      if (profile?.country_code || profile?.country_iso) {
        countryCode = profile.country_code || profile.country_iso;
      }
      try {
        const { data: splitData } = await supabase.rpc('calculate_revenue_split_with_country', {
          p_creator_id: userId,
          p_total_amount: amount,
          p_country_code: countryCode,
        });
        const row0 = Array.isArray(splitData) ? splitData[0] : splitData;
        if (row0 && typeof row0.creator_percentage === 'number' && typeof row0.platform_percentage === 'number') {
          splitAudit = {
            countryCode,
            creatorPercentage: row0.creator_percentage,
            platformPercentage: row0.platform_percentage,
            splitSource: row0.split_source || null,
          };
        }
      } catch (_) {
        /* non-fatal */
      }

      const row = toSnakeCase({
        userId,
        walletId: wallet.id,
        redemptionType: 'cash',
        amount,
        conversionRate: 1.0,
        finalAmount: amount - (payload?.processingFee ?? 0),
        processingFee: payload?.processingFee ?? 0,
        status: 'pending',
        paymentDetails: payload?.paymentDetails ?? { method: payload?.method || 'bank_transfer' },
        notes: payload?.notes ?? '',
        countryCode: splitAudit.countryCode ?? countryCode ?? undefined,
        creatorPercentage: splitAudit.creatorPercentage,
        platformPercentage: splitAudit.platformPercentage,
        splitSource: splitAudit.splitSource,
      });
      if (row.creator_percentage == null) delete row.creator_percentage;
      if (row.platform_percentage == null) delete row.platform_percentage;
      if (row.split_source == null) delete row.split_source;
      if (row.country_code == null) delete row.country_code;

      const { data: inserted, error } = await supabase
        .from('prize_redemptions')
        .insert(row)
        .select()
        .single();
      if (error) throw error;
      return { data: toCamelCase(inserted), error: null };
    } catch (e) {
      return {
        data: null,
        error: { message: e?.message?.includes('balance') ? PAYOUT_ERRORS.INSUFFICIENT_BALANCE : PAYOUT_ERRORS.REQUEST_FAILED },
      };
    }
  },

  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  },

  /** Next payment date (YouTube-style: 21st–26th of current/next month). */
  getNextPaymentDate() {
    const d = new Date();
    let month = d.getMonth();
    let day = 21;
    if (d.getDate() > 26) {
      month += 1;
      if (month > 11) {
        month = 0;
        d.setFullYear(d.getFullYear() + 1);
      }
    }
    const next = new Date(d.getFullYear(), month, day);
    return next.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  },
};
