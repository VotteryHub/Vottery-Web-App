import { supabase } from '../lib/supabase';
import { subscriptionService } from './subscriptionService';
import { cryptographicService } from './cryptographicService';

// VP multipliers by subscription tier
const VP_TIER_MULTIPLIERS = {
  basic: 2,
  pro: 3,
  elite: 5,
  default: 1
};

const XP_RULES = {
  voteMin: 5,
  voteMax: 50,
  dailyLogin: 10,
  referral: 100,
  questMin: 50,
  questMax: 500,
  predictionMin: 20,
  predictionMax: 1000,
  maxLevel: 100,
};

function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, Number(value) || 0));
}

// Get VP multiplier for user based on subscription tier
async function getVPMultiplier(userId) {
  try {
    const { data } = await subscriptionService.getUserSubscription(userId);
    if (!data?.plan) return VP_TIER_MULTIPLIERS.default;
    const planName = data?.plan?.planName?.toLowerCase() || data?.plan?.plan_name?.toLowerCase() || '';
    if (planName.includes('elite')) return VP_TIER_MULTIPLIERS.elite;
    if (planName.includes('pro')) return VP_TIER_MULTIPLIERS.pro;
    if (planName.includes('basic')) return VP_TIER_MULTIPLIERS.basic;
    return VP_TIER_MULTIPLIERS.default;
  } catch {
    return VP_TIER_MULTIPLIERS.default;
  }
}

// Log VP transaction to blockchain
async function logVPTransactionToBlockchain(userId, amount, actionType, sourceId = null) {
  try {
    const transactionData = {
      userId,
      amount,
      actionType,
      sourceId,
      timestamp: new Date().toISOString(),
      platform: 'vottery'
    };
    await cryptographicService?.auditTrail?.createAuditEntry?.({
      action: 'VP_TRANSACTION',
      data: transactionData,
      userId
    });
  } catch (err) {
    console.warn('Blockchain VP log failed (non-critical):', err?.message);
  }
}

// Award VP with multiplier and blockchain logging
async function awardVP(userId, baseAmount, actionType, sourceId = null) {
  try {
    const multiplier = await getVPMultiplier(userId);
    const finalAmount = baseAmount * multiplier;

    const { error } = await supabase?.from('xp_log')?.insert({
      user_id: userId,
      xp_gained: finalAmount,
      action_type: actionType,
      source_id: sourceId,
      is_sponsored: false,
      timestamp: new Date().toISOString()
    });
    if (error) throw error;

    // Update user gamification total
    const { data: existing } = await supabase?.from('user_gamification')?.select('current_xp, current_level')?.eq('user_id', userId)?.single();
    if (existing) {
      const newXP = (existing?.current_xp || 0) + finalAmount;
      const newLevel = Math.min(XP_RULES.maxLevel, Math.floor(newXP / 100) + 1);
      await supabase?.from('user_gamification')?.update({
        current_xp: newXP,
        current_level: newLevel,
        last_activity_at: new Date().toISOString()
      })?.eq('user_id', userId);
    }

    // Log to blockchain
    await logVPTransactionToBlockchain(userId, finalAmount, actionType, sourceId);

    return { amount: finalAmount, multiplier };
  } catch (err) {
    console.error('Award VP error:', err?.message);
    return { amount: 0, multiplier: 1 };
  }
}

export const gamificationService = {
  // Award VP for voting (5-50 VP based on activity score)
  async awardVPForVote(userId, electionId = null, activityScore = 0.5) {
    const boundedScore = clampNumber(activityScore, 0, 1);
    const amount = Math.round(XP_RULES.voteMin + ((XP_RULES.voteMax - XP_RULES.voteMin) * boundedScore));
    return awardVP(userId, amount, 'VOTE', electionId);
  },

  // Award VP for ad interaction (5 VP base)
  async awardVPForAdInteraction(userId, adId = null) {
    return awardVP(userId, 5, 'AD_INTERACTION', adId);
  },

  // Award VP for prediction
  async awardVPForPrediction(userId, predictionId = null, amount = XP_RULES.predictionMin) {
    const safeAmount = clampNumber(amount, XP_RULES.predictionMin, XP_RULES.predictionMax);
    return awardVP(userId, safeAmount, 'PREDICTION', predictionId);
  },

  // Award VP for daily login (10 VP base)
  async awardVPForDailyLogin(userId) {
    return awardVP(userId, XP_RULES.dailyLogin, 'DAILY_LOGIN', null);
  },

  // Award VP for successful referral
  async awardVPForReferral(userId, referralId = null) {
    return awardVP(userId, XP_RULES.referral, 'REFERRAL_SUCCESS', referralId);
  },

  // Award VP for quest completion (50-500)
  async awardVPForQuestCompletion(userId, questId = null, amount = XP_RULES.questMin) {
    const safeAmount = clampNumber(amount, XP_RULES.questMin, XP_RULES.questMax);
    return awardVP(userId, safeAmount, 'QUEST_COMPLETE', questId);
  },

  // Get VP balance for user - optimized single column query
  async getVPBalance(userId) {
    try {
      const { data, error } = await supabase
        ?.from('user_gamification')
        ?.select('current_xp, current_level')
        ?.eq('user_id', userId)
        ?.single();

      if (error && error?.code !== 'PGRST116') throw error;
      return { data: { balance: data?.current_xp || 0, level: data?.current_level || 1 }, error: null };
    } catch (error) {
      return { data: { balance: 0, level: 1 }, error: { message: error?.message } };
    }
  },

  // Get user gamification stats - specific columns only
  async getUserStats(userId) {
    try {
      const { data, error } = await supabase
        ?.from('user_gamification')
        ?.select('user_id, current_xp, current_level, streak_count, last_activity_at')
        ?.eq('user_id', userId)
        ?.single();

      if (error && error?.code !== 'PGRST116') throw error;
      return { data: data || null, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get leaderboard - optimized with limit and specific columns
  async getLeaderboard(limit = 50) {
    try {
      const { data, error } = await supabase
        ?.from('user_gamification')
        ?.select('user_id, current_xp, current_level, streak_count, user_profiles(id, name, username, avatar, verified)')
        ?.order('current_xp', { ascending: false })
        ?.limit(limit);

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: { message: error?.message } };
    }
  },

  // Get user badges - specific columns with limit
  async getUserBadges(userId) {
    try {
      const { data, error } = await supabase
        ?.from('user_badges')
        ?.select('id, user_id, badge_id, awarded_at, badges(id, name, description, icon, bonus_percentage)')
        ?.eq('user_id', userId)
        ?.order('awarded_at', { ascending: false })
        ?.limit(50);

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: { message: error?.message } };
    }
  },

  // Get XP transaction history - paginated with specific columns
  async getXPHistory(userId, limit = 20, cursor = null) {
    try {
      let query = supabase
        ?.from('xp_log')
        ?.select('id, user_id, xp_gained, action_type, source_id, created_at')
        ?.eq('user_id', userId)
        ?.order('created_at', { ascending: false })
        ?.limit(limit);

      if (cursor) {
        query = query?.lt('created_at', cursor);
      }

      const { data, error } = await query;
      if (error) throw error;

      const nextCursor = data?.length === limit ? data?.[data.length - 1]?.created_at : null;
      return { data: data || [], nextCursor, hasMore: !!nextCursor, error: null };
    } catch (error) {
      return { data: [], nextCursor: null, hasMore: false, error: { message: error?.message } };
    }
  },

  // Legacy compatibility aliases used by existing pages
  async getUserGamification(userId) {
    const { data } = await this.getUserStats(userId);
    if (!data) return null;
    return {
      ...data,
      level: data?.current_level || 1,
    };
  },

  async getXPLog(userId, limit = 50) {
    const { data } = await this.getXPHistory(userId, limit);
    return data || [];
  },

  // Get all available badges
  async getAllBadges() {
    const { data, error } = await supabase?.from('badges')?.select('*')?.order('requirement_value', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  // Equip badge
  async equipBadge(userId, badgeId) {
    await supabase?.from('user_badges')?.update({ is_equipped: false })?.eq('user_id', userId);
    const { data, error } = await supabase?.from('user_badges')?.update({ is_equipped: true })?.eq('user_id', userId)?.eq('badge_id', badgeId)?.select()?.single();
    if (error) throw error;
    return data;
  },

  // Calculate XP needed for next level
  calculateXPForNextLevel(currentLevel) {
    return currentLevel * 100;
  },

  // Get streak status
  async getStreakStatus(userId) {
    const gamification = await this.getUserGamification(userId);
    if (!gamification) return null;
    const lastActivity = new Date(gamification.last_activity_at);
    const now = new Date();
    const hoursSinceActivity = (now - lastActivity) / (1000 * 60 * 60);
    return {
      ...gamification,
      streakActive: hoursSinceActivity < 24,
      hoursRemaining: Math.max(0, 24 - hoursSinceActivity),
      gracePeriodActive: hoursSinceActivity >= 24 && hoursSinceActivity < 48
    };
  },

  // Get XP breakdown by source
  async getXPBreakdown(userId, days = 30) {
    const startDate = new Date();
    startDate?.setDate(startDate?.getDate() - days);
    const { data, error } = await supabase?.from('xp_log')?.select('action_type, xp_gained, is_sponsored')?.eq('user_id', userId)?.gte('timestamp', startDate?.toISOString());
    if (error) throw error;
    const breakdown = { sponsored: 0, organic: 0, streaks: 0, badges: 0, total: 0 };
    data?.forEach(log => {
      breakdown.total += log?.xp_gained;
      if (log?.is_sponsored) breakdown.sponsored += log?.xp_gained;
      else if (log?.action_type === 'STREAK_BONUS') breakdown.streaks += log?.xp_gained;
      else if (log?.action_type === 'BADGE_EARNED') breakdown.badges += log?.xp_gained;
      else breakdown.organic += log?.xp_gained;
    });
    return breakdown;
  },

  // Get badge progress
  async getBadgeProgress(userId) {
    const [allBadges, userBadges, xpLog, gamification] = await Promise.all([
      this.getAllBadges(),
      this.getUserBadges(userId),
      this.getXPLog(userId, 1000),
      this.getUserGamification(userId)
    ]);
    const earnedBadgeIds = new Set(userBadges.map(ub => ub.badge_id));
    const sponsoredVoteCount = xpLog?.filter(log => log?.is_sponsored)?.length;
    return allBadges?.map(badge => {
      const earned = earnedBadgeIds?.has(badge?.id);
      let progress = 0;
      if (!earned) {
        switch (badge?.requirement_type) {
          case 'VOTE_COUNT':
            progress = Math.min(100, (sponsoredVoteCount / badge?.requirement_value) * 100);
            break;
          case 'STREAK':
            progress = Math.min(100, ((gamification?.streak_count || 0) / badge?.requirement_value) * 100);
            break;
          default:
            progress = 0;
        }
      } else {
        progress = 100;
      }
      return {
        ...badge,
        earned,
        progress: Math.round(progress),
        currentValue: badge?.requirement_type === 'VOTE_COUNT' ? sponsoredVoteCount : gamification?.streak_count || 0
      };
    });
  }
};