import { supabase } from '../lib/supabase';
import { votesService } from './votesService';
import { gamificationService } from './gamificationService';
import { aiProxyService } from './aiProxyService';

/**
 * Quest Generation Service (Gemini)
 * Handles AI-powered quest creation via Gemini, user behavior analysis, and quest management.
 * Replaces OpenAI with Gemini for all quest generation.
 */

class QuestGenerationService {
  /**
   * Generate personalized quests using Gemini based on user voting history and behavior
   */
  async generatePersonalizedQuests(userId, questType = 'daily', count = 3) {
    try {
      const [votingHistory, gamificationData, xpLog] = await Promise.all([
        votesService?.getUserVotes(userId),
        gamificationService?.getUserGamification(userId),
        gamificationService?.getXPLog(userId, 100)
      ]);

      const userProfile = this.analyzeUserBehavior(votingHistory?.data, gamificationData, xpLog);

      const systemContent = `You are an expert gamification designer creating personalized challenges for a voting platform. Generate engaging, achievable quests based on user behavior patterns. Focus on encouraging participation, exploration, and community engagement. Return ONLY valid JSON.`;
      const userContent = `Generate ${count} ${questType} quests for a user with the following profile:

Voting Activity:
- Total votes: ${userProfile?.totalVotes}
- Favorite categories: ${userProfile?.favoriteCategories?.join(', ')}
- Voting frequency: ${userProfile?.votingFrequency}
- Streak: ${userProfile?.currentStreak} days
- Engagement level: ${userProfile?.engagementLevel}

Create quests that:
1. Match their interests (${userProfile?.favoriteCategories?.slice(0, 2)?.join(', ')})
2. Encourage ${questType === 'daily' ? 'daily' : 'weekly'} participation
3. Offer appropriate difficulty (${userProfile?.skillLevel})
4. Include VP rewards (50-500 VP range)

Return ONLY a JSON object with a single key "quests" which is an array of objects. Each object must have exactly: title (string), description (string), category (one of: voting, social, exploration, achievement), difficulty (easy|medium|hard), targetValue (number), vpReward (number), duration ("${questType === 'daily' ? '24h' : '7d'}"), requirements (array of strings).`;

      const { data, error } = await aiProxyService?.callGemini(
        [
          { role: 'system', content: systemContent },
          { role: 'user', content: userContent }
        ],
        { model: 'gemini-1.5-flash', maxTokens: 2048, temperature: 0.5, responseMimeType: 'application/json' }
      );

      if (error) throw new Error(error?.message);

      const raw = data?.text ?? data?.content?.[0]?.text ?? data?.content ?? data?.choices?.[0]?.message?.content ?? data?.message?.content;
      if (!raw) throw new Error('No content from Gemini');

      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      const quests = parsed?.quests ?? (Array.isArray(parsed) ? parsed : []);
      return { success: true, data: quests, userProfile };
    } catch (error) {
      console.error('Error generating personalized quests:', error);
      return { success: false, error: error?.message };
    }
  }

  /**
   * Analyze user behavior patterns from voting history
   */
  analyzeUserBehavior(votingHistory, gamificationData, xpLog) {
    const votes = votingHistory || [];
    const totalVotes = votes?.length;

    // Extract categories from voting history
    const categoryCount = {};
    votes?.forEach(vote => {
      const category = vote?.elections?.category || 'General';
      categoryCount[category] = (categoryCount?.[category] || 0) + 1;
    });

    const favoriteCategories = Object.entries(categoryCount)?.sort((a, b) => b?.[1] - a?.[1])?.slice(0, 3)?.map(([category]) => category);

    // Calculate voting frequency
    const recentVotes = votes?.filter(v => {
      const voteDate = new Date(v.createdAt);
      const daysSince = (Date.now() - voteDate?.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince <= 30;
    });
    const votingFrequency = recentVotes?.length / 30; // votes per day

    // Determine engagement level
    let engagementLevel = 'low';
    if (votingFrequency >= 2) engagementLevel = 'high';
    else if (votingFrequency >= 0.5) engagementLevel = 'medium';

    // Determine skill level based on XP and level
    const level = gamificationData?.level || 1;
    let skillLevel = 'beginner';
    if (level >= 10) skillLevel = 'expert';
    else if (level >= 5) skillLevel = 'intermediate';

    return {
      totalVotes,
      favoriteCategories: favoriteCategories?.length > 0 ? favoriteCategories : ['General', 'Politics', 'Entertainment'],
      votingFrequency: votingFrequency?.toFixed(2),
      currentStreak: gamificationData?.streak_count || 0,
      engagementLevel,
      skillLevel,
      currentLevel: level,
      totalXP: gamificationData?.current_xp || 0
    };
  }

  /**
   * Get active quests for a user
   */
  async getActiveQuests(userId) {
    try {
      const { data, error } = await supabase?.from('user_quests')?.select('*')?.eq('user_id', userId)?.eq('status', 'active')?.order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching active quests:', error);
      return { success: false, error: error?.message, data: [] };
    }
  }

  /**
   * Get completed quests for a user
   */
  async getCompletedQuests(userId, limit = 50) {
    try {
      const { data, error } = await supabase?.from('user_quests')?.select('*')?.eq('user_id', userId)?.eq('status', 'completed')?.order('completed_at', { ascending: false })?.limit(limit);

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching completed quests:', error);
      return { success: false, error: error?.message, data: [] };
    }
  }

  /**
   * Assign quest to user
   */
  async assignQuestToUser(userId, questData) {
    try {
      const expiresAt = questData?.duration === '24h' 
        ? new Date(Date.now() + 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      const { data, error } = await supabase?.from('user_quests')?.insert([{
          user_id: userId,
          title: questData?.title,
          description: questData?.description,
          category: questData?.category,
          difficulty: questData?.difficulty,
          target_value: questData?.targetValue,
          current_progress: 0,
          vp_reward: questData?.vpReward,
          status: 'active',
          expires_at: expiresAt?.toISOString(),
          requirements: questData?.requirements
        }])?.select()?.single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error assigning quest:', error);
      return { success: false, error: error?.message };
    }
  }

  /**
   * Update quest progress
   */
  async updateQuestProgress(questId, progress) {
    try {
      const { data: quest, error: fetchError } = await supabase?.from('user_quests')?.select('*')?.eq('id', questId)?.single();

      if (fetchError) throw fetchError;

      const newProgress = Math.min(progress, quest?.target_value);
      const isCompleted = newProgress >= quest?.target_value;

      const updateData = {
        current_progress: newProgress,
        ...(isCompleted && {
          status: 'completed',
          completed_at: new Date()?.toISOString()
        })
      };

      const { data, error } = await supabase?.from('user_quests')?.update(updateData)?.eq('id', questId)?.select()?.single();

      if (error) throw error;

      // Award VP if completed
      if (isCompleted) {
        await this.awardQuestReward(quest?.user_id, quest?.vp_reward, questId);
      }

      return { success: true, data, completed: isCompleted };
    } catch (error) {
      console.error('Error updating quest progress:', error);
      return { success: false, error: error?.message };
    }
  }

  /**
   * Award VP reward for completed quest
   */
  async awardQuestReward(userId, vpReward, questId) {
    try {
      // Log XP gain
      await supabase?.from('xp_log')?.insert([{
          user_id: userId,
          action_type: 'QUEST_COMPLETED',
          xp_gained: vpReward,
          is_sponsored: false,
          metadata: { quest_id: questId }
        }]);

      return { success: true };
    } catch (error) {
      console.error('Error awarding quest reward:', error);
      return { success: false, error: error?.message };
    }
  }

  /**
   * Get quest statistics
   */
  async getQuestStatistics(userId) {
    try {
      const { data: allQuests, error } = await supabase?.from('user_quests')?.select('*')?.eq('user_id', userId);

      if (error) throw error;

      const stats = {
        totalQuests: allQuests?.length,
        completedQuests: allQuests?.filter(q => q?.status === 'completed')?.length,
        activeQuests: allQuests?.filter(q => q?.status === 'active')?.length,
        totalVPEarned: allQuests?.filter(q => q?.status === 'completed')?.reduce((sum, q) => sum + (q?.vp_reward || 0), 0),
        completionRate: allQuests?.length > 0 
          ? ((allQuests?.filter(q => q?.status === 'completed')?.length / allQuests?.length) * 100)?.toFixed(1)
          : 0
      };

      return { success: true, data: stats };
    } catch (error) {
      console.error('Error fetching quest statistics:', error);
      return { success: false, error: error?.message };
    }
  }

  /**
   * Generate quest recommendations using Gemini
   */
  async generateQuestRecommendations(userId, userBehavior) {
    try {
      const { data, error } = await aiProxyService?.callGemini(
        [
          { role: 'system', content: 'You are a gamification expert. Provide 3 personalized quest recommendations based on user behavior. Be concise.' },
          { role: 'user', content: `User profile: ${JSON.stringify(userBehavior)}. Suggest 3 quest types that would engage this user.` }
        ],
        { model: 'gemini-1.5-flash', maxTokens: 500, temperature: 0.4 }
      );

      if (error) throw new Error(error?.message);
      const raw = data?.text ?? data?.content?.[0]?.text ?? data?.content ?? data?.choices?.[0]?.message?.content ?? data?.message?.content;
      return { success: true, data: raw ?? '' };
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return { success: false, error: error?.message };
    }
  }
}

const questGenerationService = new QuestGenerationService();

export default questGenerationService;

// Named export for backward compatibility: all pages that import { openAIQuestService } get the real service
export { questGenerationService as openAIQuestService };