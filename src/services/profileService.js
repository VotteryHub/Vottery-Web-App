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

export const profileService = {
  async getProfile(userId) {
    try {
      // Use specific columns instead of SELECT * to reduce data transfer
      const { data, error } = await supabase?.from('user_profiles')?.select(
        'id, name, username, email, phone, location, date_of_birth, occupation, website, avatar, bio, verified, role, interests, languages, stats, reputation_score, prizes_delivered, is_blacklisted, created_at, updated_at' )?.eq('id', userId)?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async updateProfile(userId, updates) {
    try {
      const dbData = toSnakeCase(updates);

      const { data, error } = await supabase?.from('user_profiles')?.update(dbData)?.eq('id', userId)?.select()?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async searchProfiles(searchTerm) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('id, name, username, avatar, verified, location')?.or(`name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`)?.limit(10);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getCreatorReputations() {
    try {
      // Use specific columns and add limit to prevent full table scan
      const { data, error } = await supabase?.from('creator_reputation')?.select(
        'id, user_id, reputation_score, total_elections, prizes_delivered, prizes_failed, created_at, user_profiles(id, name, username, avatar, verified)' )?.order('reputation_score', { ascending: false })?.limit(100);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getCreatorReputation(userId) {
    try {
      // Use specific columns instead of SELECT *
      const { data, error } = await supabase?.from('creator_reputation')?.select(
        'id, user_id, reputation_score, total_elections, prizes_delivered, prizes_failed, created_at, user_profiles(id, name, username, avatar, verified)' )?.eq('user_id', userId)?.single();

      if (error) {
        if (error?.code === 'PGRST116') {
          return { data: null, error: null };
        }
        throw error;
      }
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};