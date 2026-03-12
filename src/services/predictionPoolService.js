import { supabase } from '../lib/supabase';
import { gamificationService } from './gamificationService';

export const predictionPoolService = {
  // Create or update a prediction for an election
  async createPrediction(electionId, userId, predictions) {
    try {
      // Validate predictions sum to ~100
      const total = Object.values(predictions)?.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
      if (Math.abs(total - 100) > 1) {
        return { data: null, error: { message: 'Predictions must sum to 100%' } };
      }

      // Normalize to 0-1 range for Brier score calculation
      const normalizedPredictions = {};
      Object.entries(predictions)?.forEach(([key, val]) => {
        normalizedPredictions[key] = parseFloat(val) / 100;
      });

      // Check if prediction already exists
      const { data: existing } = await supabase
        ?.from('election_predictions')
        ?.select('id, is_resolved')
        ?.eq('user_id', userId)
        ?.eq('election_id', electionId)
        ?.single();

      if (existing?.is_resolved) {
        return { data: null, error: { message: 'Cannot modify prediction after pool resolution' } };
      }

      let result;
      if (existing) {
        // Update existing prediction
        const { data, error } = await supabase
          ?.from('election_predictions')
          ?.update({
            predictions: normalizedPredictions,
            updated_at: new Date()?.toISOString()
          })
          ?.eq('id', existing?.id)
          ?.select()
          ?.single();
        if (error) throw error;
        result = data;
      } else {
        // Create new prediction
        const { data, error } = await supabase
          ?.from('election_predictions')
          ?.insert({
            user_id: userId,
            election_id: electionId,
            predictions: normalizedPredictions,
            created_at: new Date()?.toISOString(),
            updated_at: new Date()?.toISOString()
          })
          ?.select()
          ?.single();
        if (error) throw error;
        result = data;
      }

      // Award VP for making a prediction
      await gamificationService?.awardVPForPrediction(userId, result?.id);

      return { data: result, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Calculate Brier Score: avg((pred_i - actual_i)^2)
  // Lower is better (0 = perfect, 1 = worst)
  calculateBrierScore(predictions, actualResults) {
    try {
      const keys = Object.keys(actualResults);
      if (keys?.length === 0) return 1;

      let totalSquaredError = 0;
      let count = 0;

      keys?.forEach(key => {
        const predicted = parseFloat(predictions?.[key] || 0);
        const actual = parseFloat(actualResults?.[key] || 0);
        totalSquaredError += Math.pow(predicted - actual, 2);
        count++;
      });

      return count > 0 ? totalSquaredError / count : 1;
    } catch {
      return 1;
    }
  },

  // Get prediction leaderboard for an election (ranked by brier_score ascending = best first)
  async getPredictionLeaderboard(electionId, limit = 50) {
    try {
      // Use specific columns to avoid SELECT * and reduce data transfer
      const { data, error } = await supabase
        ?.from('election_predictions')
        ?.select(
          'id, user_id, predictions, brier_score, vp_awarded, is_resolved, created_at, user_profiles!election_predictions_user_id_fkey(id, username, avatar)'
        )
        ?.eq('election_id', electionId)
        ?.not('brier_score', 'is', null)
        ?.order('brier_score', { ascending: true })
        ?.limit(limit);

      if (error) throw error;

      return {
        data: (data || [])?.map((item, index) => ({
          ...item,
          rank: index + 1,
          accuracyPercent: item?.brier_score != null
            ? Math.round((1 - item?.brier_score) * 100)
            : null
        })),
        error: null
      };
    } catch (error) {
      return { data: [], error: { message: error?.message } };
    }
  },

  // Get user's predictions - paginated with specific columns
  async getUserPredictions(userId, limit = 20, cursor = null) {
    try {
      let query = supabase
        ?.from('election_predictions')
        ?.select(
          'id, user_id, election_id, predictions, brier_score, vp_awarded, is_resolved, created_at, updated_at'
        )
        ?.eq('user_id', userId)
        ?.order('created_at', { ascending: false })
        ?.limit(limit);

      if (cursor) {
        query = query?.lt('created_at', cursor);
      }

      const { data, error } = await query;
      if (error) throw error;

      const nextCursor = data?.length === limit ? data?.[data?.length - 1]?.created_at : null;
      return { data: data || [], nextCursor, hasMore: !!nextCursor, error: null };
    } catch (error) {
      return { data: [], nextCursor: null, hasMore: false, error: { message: error?.message } };
    }
  },

  // Get user's prediction for an election
  async getUserPrediction(electionId, userId) {
    try {
      const { data, error } = await supabase
        ?.from('election_predictions')
        ?.select('*')
        ?.eq('election_id', electionId)
        ?.eq('user_id', userId)
        ?.single();

      if (error && error?.code !== 'PGRST116') throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Resolve pool: calculate Brier scores for all predictions and award VP
  async resolvePool(electionId, actualResults) {
    try {
      // Get all unresolved predictions for this election
      const { data: predictions, error: fetchError } = await supabase
        ?.from('election_predictions')
        ?.select('*')
        ?.eq('election_id', electionId)
        ?.eq('is_resolved', false);

      if (fetchError) throw fetchError;
      if (!predictions || predictions?.length === 0) {
        return { data: { resolved: 0, topPerformers: [] }, error: null };
      }

      // Normalize actual results to 0-1
      const normalizedActual = {};
      Object.entries(actualResults)?.forEach(([key, val]) => {
        normalizedActual[key] = parseFloat(val) / 100;
      });

      // Calculate Brier score for each prediction
      const updates = predictions?.map(pred => {
        const brierScore = this.calculateBrierScore(pred?.predictions, normalizedActual);
        // VP reward: higher accuracy = more VP (100x inverse of brier score)
        const vpReward = Math.round(Math.max(0, (1 - brierScore) * 100));
        return {
          id: pred?.id,
          user_id: pred?.user_id,
          brier_score: brierScore,
          vp_awarded: vpReward,
          is_resolved: true,
          updated_at: new Date()?.toISOString()
        };
      });

      // Update all predictions with scores
      for (const update of updates) {
        const { id, user_id, ...updateData } = update;
        await supabase
          ?.from('election_predictions')
          ?.update(updateData)
          ?.eq('id', id);

        // Award VP based on accuracy
        if (update?.vp_awarded > 0) {
          await supabase?.from('xp_log')?.insert({
            user_id: user_id,
            xp_gained: update?.vp_awarded,
            action_type: 'PREDICTION_ACCURACY',
            source_id: electionId,
            is_sponsored: false,
            timestamp: new Date()?.toISOString()
          });
        }
      }

      // Sort by brier score to find top performers
      const sorted = updates?.sort((a, b) => a?.brier_score - b?.brier_score);
      const topPerformers = sorted?.slice(0, 3);

      return {
        data: {
          resolved: updates?.length,
          topPerformers,
          averageBrierScore: updates?.reduce((sum, u) => sum + u?.brier_score, 0) / updates?.length
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};
