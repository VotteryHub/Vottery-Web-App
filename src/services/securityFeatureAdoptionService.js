/**
 * Security Feature Adoption Analytics
 * Tracks Voter Education Hub completion and Blockchain Verification usage
 * for Security Feature Adoption Analytics dashboard
 */
import { supabase } from '../lib/supabase';

export const securityFeatureAdoptionService = {
  async recordVoterEducationCompletion(userId, topicId, topicsCompleted = 1) {
    try {
      if (!userId) return { data: null, error: { message: 'User ID required' } };
      const completionRate = Math.min(100, Math.round((topicsCompleted / 4) * 100));
      const { data, error } = await supabase?.from('feature_analytics')?.insert({
        feature_id: 'voter_education_hub',
        user_id: userId,
        adoption_rate: completionRate,
        engagement_metrics: { topics_completed: topicsCompleted, last_topic: topicId, completion_rate: completionRate / 100 },
        created_at: new Date()?.toISOString()
      })?.select()?.single();
      if (error) throw error;
      return { data, error: null };
    } catch (e) {
      return { data: null, error: { message: e?.message } };
    }
  },

  async recordBlockchainVerification(userId, voteId) {
    try {
      const { data, error } = await supabase?.from('feature_analytics')?.insert({
        feature_id: 'blockchain_verification',
        user_id: userId || null,
        adoption_rate: 100,
        engagement_metrics: { vote_id: voteId, verified_at: new Date()?.toISOString() },
        created_at: new Date()?.toISOString()
      })?.select()?.single();
      if (error) throw error;
      return { data, error: null };
    } catch (e) {
      return { data: null, error: { message: e?.message } };
    }
  }
};
