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

export const settingsService = {
  async getSettings() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('user_profiles')
        ?.select('*')
        ?.eq('id', user?.id)
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async updateProfile(updates) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbData = toSnakeCase(updates);

      const { data, error } = await supabase
        ?.from('user_profiles')
        ?.update(dbData)
        ?.eq('id', user?.id)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getPayoutSettings() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('payout_settings')
        ?.select('*')
        ?.eq('user_id', user?.id)
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async updatePayoutSettings(updates) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbData = toSnakeCase(updates);

      const { data, error } = await supabase
        ?.from('payout_settings')
        ?.upsert({ ...dbData, user_id: user?.id })
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getWalletInfo() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('user_wallets')
        ?.select('*')
        ?.eq('user_id', user?.id)
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getTransactionHistory(limit = 50) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('wallet_transactions')
        ?.select('*')
        ?.eq('user_id', user?.id)
        ?.order('created_at', { ascending: false })
        ?.limit(limit);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async exportAccountData() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const [profile, wallet, transactions, votes] = await Promise.all([
        supabase?.from('user_profiles')?.select('*')?.eq('id', user?.id)?.single(),
        supabase?.from('user_wallets')?.select('*')?.eq('user_id', user?.id)?.single(),
        supabase?.from('wallet_transactions')?.select('*')?.eq('user_id', user?.id),
        supabase?.from('votes')?.select('*')?.eq('user_id', user?.id)
      ]);

      const exportData = {
        profile: toCamelCase(profile?.data),
        wallet: toCamelCase(wallet?.data),
        transactions: toCamelCase(transactions?.data),
        votes: toCamelCase(votes?.data),
        exportedAt: new Date()?.toISOString()
      };

      return { data: exportData, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getVotingHistory(limit = 250) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('votes')
        ?.select('*')
        ?.eq('user_id', user?.id)
        ?.order('created_at', { ascending: false })
        ?.limit(limit);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getActivityFeed(limit = 250) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const [featureVotes, featureComments] = await Promise.all([
        supabase
          ?.from('feature_votes')
          ?.select('*')
          ?.eq('user_id', user?.id)
          ?.order('created_at', { ascending: false })
          ?.limit(limit),
        supabase
          ?.from('feature_comments')
          ?.select('*')
          ?.eq('user_id', user?.id)
          ?.order('created_at', { ascending: false })
          ?.limit(limit)
      ]);

      if (featureVotes?.error) throw featureVotes.error;
      if (featureComments?.error) throw featureComments.error;

      const activity = [
        ...(featureVotes?.data || [])?.map((item) => ({ ...item, activity_type: 'feature_vote' })),
        ...(featureComments?.data || [])?.map((item) => ({ ...item, activity_type: 'feature_comment' }))
      ]?.sort((a, b) => new Date(b?.created_at) - new Date(a?.created_at));

      return { data: toCamelCase(activity), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async requestGdprExport(details = {}) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('gdpr_requests')
        ?.insert({
          user_id: user?.id,
          request_type: 'export',
          details
        })
        ?.select()
        ?.single();
      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async requestGdprDeletion(details = {}) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('gdpr_requests')
        ?.insert({
          user_id: user?.id,
          request_type: 'deletion',
          details
        })
        ?.select()
        ?.single();
      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getConsentPreferences() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        ?.from('user_consent_preferences')
        ?.select('*')
        ?.eq('user_id', user?.id)
        ?.maybeSingle();
      if (error) throw error;
      return {
        data: toCamelCase(data || {
          user_id: user?.id,
          analytics_consent: false,
          marketing_consent: false,
          personalization_consent: false,
          ai_decisioning_consent: false,
        }),
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async updateConsentPreferences(updates) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        ?.from('user_consent_preferences')
        ?.upsert({
          user_id: user?.id,
          ...toSnakeCase(updates),
          updated_at: new Date()?.toISOString()
        })
        ?.select()
        ?.single();
      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getAutomatedDecisionExplanations(limit = 50) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        ?.from('automated_decision_explanations')
        ?.select('*')
        ?.eq('user_id', user?.id)
        ?.order('created_at', { ascending: false })
        ?.limit(limit);
      if (error) throw error;
      return { data: toCamelCase(data || []), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};
