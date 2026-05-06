import { supabase } from '../lib/supabase';
import { getEmbedding } from './geminiRecommendationService';
import { geminiChatService } from './geminiChatService';

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
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    acc[snakeKey] = toSnakeCase(obj[key]);
    return acc;
  }, {});
};

export const feedRankingService = {
  /**
   * Fetch V1 Tuning Config from Admin Quadants
   */
  async getV1TuningConfig() {
    try {
      const { data: configRows } = await supabase
        ?.from('vottery_ads_admin_config')
        ?.select('key, value_json');
      
      const config = {
        viq_amplification: 1.0,
        reach_penalty_cp: 1.0,
        discovery_split: 30, // 30% discovery, 70% personalization
        w1: 0.4, // accuracy
        w2: 0.3, // consensus
        w3: 0.3, // longevity
        efficiency_mode: true
      };

      (configRows || []).forEach(r => {
        if (config.hasOwnProperty(r.key)) {
          config[r.key] = r.value_json === 'true' ? true : r.value_json === 'false' ? false : Number(r.value_json);
        }
      });
      return config;
    } catch (error) {
      console.error('Error fetching tuning config:', error);
      return { viq_amplification: 1.0, reach_penalty_cp: 1.0, discovery_split: 30, w1: 0.4, w2: 0.3, w3: 0.3, efficiency_mode: true };
    }
  },

  /**
   * V1 MERIT RANKING (vIQ + Reach Penalty)
   * Formula: Score = (Personalization * (1-D) + Discovery * D) * (1 + vIQ) * Cp
   */
  async rankContentItems(items, userPreferences, tuning) {
    const { viq_amplification, reach_penalty_cp, discovery_split, w1, w2, w3 } = tuning;
    const D = discovery_split / 100;

    // Pre-calculate user interest embedding if needed
    // For now, use simpler matching to stay within latency budget
    const topTopicNames = (userPreferences || []).slice(0, 3).map(p => p.topic_categories?.display_name?.toLowerCase());

    return items.map((item) => {
      // 1. Personalization Score (0.0 to 1.0)
      let personalizationScore = 0.2; // base
      const contentText = (item.title || item.content || item.description || '').toLowerCase();
      topTopicNames.forEach(topic => {
        if (topic && contentText.includes(topic)) personalizationScore += 0.25;
      });
      personalizationScore = Math.min(1, personalizationScore);
      
      // 2. Discovery Score (Recency Decay)
      const ageHours = (Date.now() - new Date(item.created_at).getTime()) / (1000 * 60 * 60);
      const discoveryScore = Math.exp(-ageHours / 48); // Decay over 48h

      // 3. vIQ Calculation (Merit)
      // A = log(engagement) * (w1*accuracy + w2*consensus + w3*longevity)
      const engagement = (item.view_count || 0) + (item.vote_count || 0) * 5;
      const logE = Math.log10(Math.max(1, engagement) + 1);
      
      const accuracy = item.accuracy_score || 0.7;
      const consensus = item.consensus_score || 0.6;
      const longevity = Math.min(1, (item.view_count || 0) / 1000);
      
      const vIQ = logE * (w1 * accuracy + w2 * consensus + w3 * longevity) * viq_amplification;

      // 4. Combined Raw Score
      let finalScore = (personalizationScore * (1 - D) + discoveryScore * D) * (1 + vIQ);

      // 5. Reach Penalty (Enforced from Admin)
      finalScore *= reach_penalty_cp;

      return { 
        ...item, 
        ranking_score: finalScore,
        viq_metadata: { vIQ, personalizationScore, discoveryScore }
      };
    }).sort((a, b) => b.ranking_score - a.ranking_score);
  },

  async generatePersonalizedFeed(userId, contentMix = { elections: 10, posts: 20, ads: 4 }) {
    try {
      const tuning = await this.getV1TuningConfig();

      // 1. Fetch User Preferences
      const { data: preferences } = await supabase
        ?.from('user_topic_preferences')
        ?.select('*, topic_categories(*)')
        ?.eq('user_id', userId)
        ?.order('preference_score', { ascending: false });

      // 2. Fetch Content Candidates
      const [electionsResult, postsResult] = await Promise.all([
        supabase?.from('elections')?.select(`
          *,
          user_profiles!elections_created_by_fkey(name, username, avatar, verified)
        `)?.eq('status', 'active')?.limit(50),
        supabase?.from('posts')?.select(`
          *,
          user_profiles!posts_user_id_fkey(name, username, avatar, verified),
          elections(title, category)
        `)?.order('created_at', { ascending: false })?.limit(50)
      ]);

      const candidates = [
        ...(electionsResult?.data || []).map(e => ({ ...e, contentType: 'election' })),
        ...(postsResult?.data || []).map(p => ({ ...p, contentType: 'post' }))
      ];

      // 3. Rank Content using V1 Merit Logic
      const ranked = await this.rankContentItems(candidates, preferences, tuning);

      // 4. Interleave Ads (placeholder for adSlotManagerService integration)
      // Actual ad injection happens in the UI layer via AdSlotRenderer

      return { data: ranked, error: null };
    } catch (error) {
      console.error('Feed generation failed:', error);
      return { data: [], error };
    }
  },

  async recordEngagementSignal(engagementData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) return { error: 'Not authenticated' };

      const dbData = toSnakeCase({
        ...engagementData,
        userId: user.id,
        createdAt: new Date().toISOString()
      });

      const { data, error } = await supabase
        ?.from('user_engagement_signals')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error recording engagement signal:', error);
      return { data: null, error };
    }
  },

  async generateSemanticEmbedding(text) {
    try {
      const embedding = await getEmbedding(text);
      return { data: embedding, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

export default feedRankingService;