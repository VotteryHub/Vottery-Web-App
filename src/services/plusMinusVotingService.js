import { supabase } from '../lib/supabase';
import { votesService } from './votesService';

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

export const plusMinusVotingService = {
  // Cast Plus-Minus vote with +1/0/-1 scores
  async castPlusMinusVote(electionId, voteScores) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      // Validate vote scores (must be -1, 0, or 1)
      const validScores = Object.values(voteScores)?.every(score => [-1, 0, 1]?.includes(score));
      if (!validScores) throw new Error('Invalid vote scores. Must be -1, 0, or 1');

      // Use existing votesService for cryptographic features
      const voteData = {
        electionId,
        voteScores, // JSONB object: { optionId: score }
        isGamified: false
      };

      const { data, receipt, error } = await votesService?.castVote(voteData);
      if (error) throw error;

      return { data, receipt, error: null };
    } catch (error) {
      return { data: null, receipt: null, error: { message: error?.message } };
    }
  },

  // Get real-time Plus-Minus analytics for election
  async getPlusMinusAnalytics(electionId) {
    try {
      const { data, error } = await supabase
        ?.from('plus_minus_vote_analytics')
        ?.select(`
          *,
          election_options!plus_minus_vote_analytics_option_id_fkey(
            id,
            title,
            description,
            image,
            image_alt
          )
        `)
        ?.eq('election_id', electionId)
        ?.order('weighted_score', { ascending: false });

      if (error) throw error;

      // Calculate aggregate statistics
      const totalVotes = data?.reduce((sum, option) => 
        sum + option?.positive_votes + option?.neutral_votes + option?.negative_votes, 0
      );

      const analytics = data?.map(option => ({
        ...toCamelCase(option),
        totalVotes: option?.positive_votes + option?.neutral_votes + option?.negative_votes,
        netScore: option?.positive_votes - option?.negative_votes,
        sentimentRatio: option?.positive_votes / Math.max(option?.negative_votes, 1),
        participationRate: totalVotes > 0 ? 
          ((option?.positive_votes + option?.neutral_votes + option?.negative_votes) / totalVotes * 100)?.toFixed(2) : 0
      }));

      return { data: analytics, totalVotes, error: null };
    } catch (error) {
      return { data: null, totalVotes: 0, error: { message: error?.message } };
    }
  },

  // Get sentiment distribution for specific option
  async getSentimentDistribution(electionId, optionId) {
    try {
      const { data, error } = await supabase
        ?.from('plus_minus_vote_analytics')
        ?.select('*')
        ?.eq('election_id', electionId)
        ?.eq('option_id', optionId)
        ?.single();

      if (error) throw error;

      const total = data?.positive_votes + data?.neutral_votes + data?.negative_votes;

      return {
        data: {
          positive: {
            count: data?.positive_votes,
            percentage: total > 0 ? (data?.positive_votes / total * 100)?.toFixed(2) : 0
          },
          neutral: {
            count: data?.neutral_votes,
            percentage: total > 0 ? (data?.neutral_votes / total * 100)?.toFixed(2) : 0
          },
          negative: {
            count: data?.negative_votes,
            percentage: total > 0 ? (data?.negative_votes / total * 100)?.toFixed(2) : 0
          },
          weightedScore: data?.weighted_score,
          netScore: data?.positive_votes - data?.negative_votes
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get user's Plus-Minus vote for election
  async getUserPlusMinusVote(userId, electionId) {
    try {
      const { data, error } = await supabase
        ?.from('votes')
        ?.select('vote_scores')
        ?.eq('user_id', userId)
        ?.eq('election_id', electionId)
        ?.single();

      if (error && error?.code !== 'PGRST116') throw error;

      return { data: data ? toCamelCase(data) : null, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Calculate ranking based on weighted scores
  async calculateRankings(electionId) {
    try {
      const { data, error } = await supabase
        ?.from('plus_minus_vote_analytics')
        ?.select(`
          *,
          election_options!plus_minus_vote_analytics_option_id_fkey(
            id,
            title,
            image,
            image_alt
          )
        `)
        ?.eq('election_id', electionId)
        ?.order('weighted_score', { ascending: false });

      if (error) throw error;

      const rankings = data?.map((option, index) => ({
        rank: index + 1,
        ...toCamelCase(option),
        netScore: option?.positive_votes - option?.negative_votes,
        approvalRating: option?.positive_votes + option?.neutral_votes + option?.negative_votes > 0 ?
          (option?.positive_votes / (option?.positive_votes + option?.neutral_votes + option?.negative_votes) * 100)?.toFixed(2) : 0
      }));

      return { data: rankings, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get statistical significance indicators
  async getStatisticalSignificance(electionId) {
    try {
      const { data, error } = await supabase
        ?.from('plus_minus_vote_analytics')
        ?.select('*')
        ?.eq('election_id', electionId);

      if (error) throw error;

      const totalVotes = data?.reduce((sum, option) => 
        sum + option?.positive_votes + option?.neutral_votes + option?.negative_votes, 0
      );

      // Calculate confidence intervals (simplified)
      const significance = data?.map(option => {
        const sampleSize = option?.positive_votes + option?.neutral_votes + option?.negative_votes;
        const proportion = sampleSize > 0 ? option?.positive_votes / sampleSize : 0;
        const standardError = Math.sqrt((proportion * (1 - proportion)) / Math.max(sampleSize, 1));
        const marginOfError = 1.96 * standardError; // 95% confidence interval

        return {
          optionId: option?.option_id,
          sampleSize,
          confidenceInterval: {
            lower: Math.max(0, (proportion - marginOfError) * 100)?.toFixed(2),
            upper: Math.min(100, (proportion + marginOfError) * 100)?.toFixed(2)
          },
          statisticallySignificant: sampleSize >= 30 && marginOfError < 0.1
        };
      });

      return { data: significance, totalVotes, error: null };
    } catch (error) {
      return { data: null, totalVotes: 0, error: { message: error?.message } };
    }
  }
};

export default plusMinusVotingService;