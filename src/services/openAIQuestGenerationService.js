import openai from '../lib/openai';
import { supabase } from '../lib/supabase';
import { votesService } from './votesService';
import { gamificationService } from './gamificationService';

/**
 * OpenAI Quest Generation Service
 * Generates personalized daily/weekly challenges using OpenAI's language models
 * tailored to individual user interests and voting history
 */

class OpenAIQuestGenerationService {
  /**
   * Generate personalized quest for a user
   */
  async generatePersonalizedQuest(userId, questType = 'daily', difficulty = 'medium') {
    try {
      // Gather user context
      const userContext = await this.getUserContext(userId);
      
      // Generate quest using OpenAI
      const quest = await this.createQuestWithOpenAI(userContext, questType, difficulty);
      
      // Save quest to database
      const savedQuest = await this.saveQuest(userId, quest);
      
      return { success: true, data: savedQuest };
    } catch (error) {
      console.error('Error generating personalized quest:', error);
      return { success: false, error: error?.message };
    }
  }

  /**
   * Get user context for personalized quest generation
   */
  async getUserContext(userId) {
    try {
      // Get user voting history
      const { data: votes } = await votesService?.getUserVotes(userId);
      
      // Get user gamification data
      const gamification = await gamificationService?.getUserGamification(userId);
      
      // Get user badges
      const badges = await gamificationService?.getUserBadges(userId);
      
      // Analyze voting patterns
      const votingPatterns = this.analyzeVotingPatterns(votes);
      
      return {
        userId,
        votingHistory: votes?.slice(0, 20) || [],
        currentLevel: gamification?.currentLevel || 1,
        currentXP: gamification?.currentXp || 0,
        streakCount: gamification?.streakCount || 0,
        badges: badges?.length || 0,
        votingPatterns,
        preferences: {
          favoriteCategories: votingPatterns?.topCategories || [],
          votingFrequency: votingPatterns?.frequency || 'moderate',
          engagementLevel: votingPatterns?.engagementLevel || 'medium'
        }
      };
    } catch (error) {
      console.error('Error getting user context:', error);
      return null;
    }
  }

  /**
   * Analyze user voting patterns
   */
  analyzeVotingPatterns(votes) {
    if (!votes || votes?.length === 0) {
      return {
        topCategories: ['General', 'Politics', 'Entertainment'],
        frequency: 'new',
        engagementLevel: 'low',
        totalVotes: 0
      };
    }

    // Count votes by category
    const categoryCount = {};
    votes?.forEach(vote => {
      const category = vote?.elections?.category || 'General';
      categoryCount[category] = (categoryCount?.[category] || 0) + 1;
    });

    // Get top 3 categories
    const topCategories = Object.entries(categoryCount)?.sort((a, b) => b?.[1] - a?.[1])?.slice(0, 3)?.map(([category]) => category);

    // Calculate frequency
    const totalVotes = votes?.length;
    let frequency = 'low';
    if (totalVotes > 50) frequency = 'high';
    else if (totalVotes > 20) frequency = 'moderate';

    // Calculate engagement level
    let engagementLevel = 'low';
    if (totalVotes > 100) engagementLevel = 'high';
    else if (totalVotes > 30) engagementLevel = 'medium';

    return {
      topCategories,
      frequency,
      engagementLevel,
      totalVotes
    };
  }

  /**
   * Create quest using OpenAI
   */
  async createQuestWithOpenAI(userContext, questType, difficulty) {
    try {
      const prompt = this.buildQuestPrompt(userContext, questType, difficulty);
      
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-5-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a gamification expert creating engaging, personalized challenges for a voting platform. Generate quests that are fun, achievable, and tailored to user interests. Always respond with valid JSON matching the specified schema.' 
          },
          { role: 'user', content: prompt }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'quest_generation',
            schema: {
              type: 'object',
              properties: {
                title: { type: 'string', description: 'Catchy quest title' },
                description: { type: 'string', description: 'Detailed quest description' },
                objectives: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'List of quest objectives'
                },
                requirements: {
                  type: 'object',
                  properties: {
                    voteCount: { type: 'number', description: 'Number of votes required' },
                    categories: { 
                      type: 'array', 
                      items: { type: 'string' },
                      description: 'Specific categories to vote in'
                    },
                    timeLimit: { type: 'string', description: 'Time limit for completion' }
                  },
                  required: ['voteCount', 'timeLimit']
                },
                rewards: {
                  type: 'object',
                  properties: {
                    vpPoints: { type: 'number', description: 'VP points reward' },
                    xpBonus: { type: 'number', description: 'XP bonus reward' },
                    badgeEligible: { type: 'boolean', description: 'Whether quest unlocks badge' }
                  },
                  required: ['vpPoints', 'xpBonus']
                },
                difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'], description: 'Quest difficulty' },
                estimatedTime: { type: 'string', description: 'Estimated completion time' }
              },
              required: ['title', 'description', 'objectives', 'requirements', 'rewards', 'difficulty', 'estimatedTime'],
              additionalProperties: false
            }
          }
        },
        reasoning_effort: 'minimal',
        verbosity: 'medium'
      });

      const questData = JSON.parse(response?.choices?.[0]?.message?.content);
      
      return {
        ...questData,
        questType,
        generatedBy: 'openai',
        generatedAt: new Date()?.toISOString()
      };
    } catch (error) {
      console.error('Error creating quest with OpenAI:', error);
      throw error;
    }
  }

  /**
   * Build quest generation prompt
   */
  buildQuestPrompt(userContext, questType, difficulty) {
    const { preferences, currentLevel, streakCount, votingPatterns } = userContext;
    
    return `Generate a ${questType} quest for a user with the following profile:

**User Profile:**
- Current Level: ${currentLevel}
- Streak Count: ${streakCount} days
- Voting Frequency: ${votingPatterns?.frequency}
- Engagement Level: ${votingPatterns?.engagementLevel}
- Favorite Categories: ${preferences?.favoriteCategories?.join(', ')}
- Total Votes: ${votingPatterns?.totalVotes}

**Quest Requirements:**
- Type: ${questType} (${questType === 'daily' ? '24 hours' : '7 days'} to complete)
- Difficulty: ${difficulty}
- Should be personalized to user's interests in: ${preferences?.favoriteCategories?.join(', ')}
- Should encourage exploration of new categories
- Rewards should scale with difficulty and user level

**Guidelines:**
- Make the quest title exciting and action-oriented
- Description should be clear and motivating
- Objectives should be specific and measurable
- Requirements should be challenging but achievable
- Rewards should feel valuable (VP points: ${difficulty === 'easy' ? '50-100' : difficulty === 'medium' ? '100-200' : '200-500'})
- Estimated time should be realistic

Generate a quest that will engage this user and encourage platform participation!`;
  }

  /**
   * Save quest to database
   */
  async saveQuest(userId, questData) {
    try {
      const { data, error } = await supabase?.from('user_quests')?.insert([{
          user_id: userId,
          quest_type: questData?.questType,
          title: questData?.title,
          description: questData?.description,
          objectives: questData?.objectives,
          requirements: questData?.requirements,
          rewards: questData?.rewards,
          difficulty: questData?.difficulty,
          estimated_time: questData?.estimatedTime,
          status: 'active',
          progress: 0,
          generated_by: 'openai',
          expires_at: this.calculateExpiryDate(questData?.questType)
        }])?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving quest:', error);
      throw error;
    }
  }

  /**
   * Calculate quest expiry date
   */
  calculateExpiryDate(questType) {
    const now = new Date();
    if (questType === 'daily') {
      now?.setHours(23, 59, 59, 999);
    } else if (questType === 'weekly') {
      now?.setDate(now?.getDate() + 7);
    }
    return now?.toISOString();
  }

  /**
   * Get active quests for user
   */
  async getActiveQuests(userId) {
    try {
      const { data, error } = await supabase?.from('user_quests')?.select('*')?.eq('user_id', userId)?.eq('status', 'active')?.gt('expires_at', new Date()?.toISOString())?.order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error getting active quests:', error);
      return { success: false, error: error?.message };
    }
  }

  /**
   * Get completed quests for user
   */
  async getCompletedQuests(userId, limit = 20) {
    try {
      const { data, error } = await supabase?.from('user_quests')?.select('*')?.eq('user_id', userId)?.eq('status', 'completed')?.order('completed_at', { ascending: false })?.limit(limit);

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error getting completed quests:', error);
      return { success: false, error: error?.message };
    }
  }

  /**
   * Update quest progress
   */
  async updateQuestProgress(questId, progress) {
    try {
      const updates = {
        progress,
        updated_at: new Date()?.toISOString()
      };

      // Mark as completed if progress reaches 100
      if (progress >= 100) {
        updates.status = 'completed';
        updates.completed_at = new Date()?.toISOString();
      }

      const { data, error } = await supabase?.from('user_quests')?.update(updates)?.eq('id', questId)?.select()?.single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating quest progress:', error);
      return { success: false, error: error?.message };
    }
  }

  /**
   * Claim quest rewards
   */
  async claimQuestRewards(userId, questId) {
    try {
      // Get quest details
      const { data: quest, error: questError } = await supabase?.from('user_quests')?.select('*')?.eq('id', questId)?.eq('user_id', userId)?.single();

      if (questError) throw questError;

      if (quest?.status !== 'completed') {
        throw new Error('Quest not completed');
      }

      if (quest?.rewards_claimed) {
        throw new Error('Rewards already claimed');
      }

      // Award VP points and XP
      const rewards = quest?.rewards;
      
      // Mark rewards as claimed
      const { error: updateError } = await supabase?.from('user_quests')?.update({ rewards_claimed: true, claimed_at: new Date()?.toISOString() })?.eq('id', questId);

      if (updateError) throw updateError;

      return { 
        success: true, 
        data: {
          vpPoints: rewards?.vpPoints || 0,
          xpBonus: rewards?.xpBonus || 0,
          badgeEligible: rewards?.badgeEligible || false
        }
      };
    } catch (error) {
      console.error('Error claiming quest rewards:', error);
      return { success: false, error: error?.message };
    }
  }

  /**
   * Get quest recommendations
   */
  async getQuestRecommendations(userId, count = 3) {
    try {
      const userContext = await this.getUserContext(userId);
      
      const recommendations = [];
      const difficulties = ['easy', 'medium', 'hard'];
      
      for (let i = 0; i < count; i++) {
        const difficulty = difficulties?.[i % difficulties?.length];
        const quest = await this.createQuestWithOpenAI(userContext, 'daily', difficulty);
        recommendations?.push(quest);
      }

      return { success: true, data: recommendations };
    } catch (error) {
      console.error('Error getting quest recommendations:', error);
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
        totalQuests: allQuests?.length || 0,
        completedQuests: allQuests?.filter(q => q?.status === 'completed')?.length || 0,
        activeQuests: allQuests?.filter(q => q?.status === 'active')?.length || 0,
        totalVPEarned: allQuests
          ?.filter(q => q?.rewards_claimed)
          ?.reduce((sum, q) => sum + (q?.rewards?.vpPoints || 0), 0) || 0,
        totalXPEarned: allQuests
          ?.filter(q => q?.rewards_claimed)
          ?.reduce((sum, q) => sum + (q?.rewards?.xpBonus || 0), 0) || 0,
        completionRate: allQuests?.length > 0 
          ? ((allQuests?.filter(q => q?.status === 'completed')?.length / allQuests?.length) * 100)?.toFixed(1)
          : 0
      };

      return { success: true, data: stats };
    } catch (error) {
      console.error('Error getting quest statistics:', error);
      return { success: false, error: error?.message };
    }
  }
}

export default new OpenAIQuestGenerationService();

/**
 * OPTIMIZED: Daily challenge generation with edge case handling
 * Resolves issues with user behavior, difficulty scaling, and fallback mechanisms
 */

const CHALLENGE_TEMPLATES = [
  {
    id: 'vote_streak',
    title: 'Vote {count} times today',
    description: 'Cast your vote in {count} different elections',
    type: 'voting',
    minCount: 3,
    maxCount: 10,
    reward: 50,
    difficulty: 'easy'
  },
  {
    id: 'prediction_accuracy',
    title: 'Make {count} accurate predictions',
    description: 'Predict election outcomes with at least 70% accuracy',
    type: 'prediction',
    minCount: 2,
    maxCount: 5,
    reward: 100,
    difficulty: 'medium'
  },
  {
    id: 'social_engagement',
    title: 'Engage with {count} posts',
    description: 'Comment on or react to {count} different posts',
    type: 'social',
    minCount: 5,
    maxCount: 15,
    reward: 75,
    difficulty: 'easy'
  },
  {
    id: 'election_creation',
    title: 'Create {count} quality elections',
    description: 'Create elections that receive at least 10 votes each',
    type: 'creation',
    minCount: 1,
    maxCount: 3,
    reward: 150,
    difficulty: 'hard'
  }
];

/**
 * Generate daily challenges with comprehensive edge case handling
 */
export const generateDailyChallengesOptimized = async (userId) => {
  try {
    // Step 1: Validate user exists and get behavior data
    const { data: userProfile, error: profileError } = await supabase?.from('user_profiles')?.select('*, user_behavior(*)')?.eq('user_id', userId)?.single();
    
    if (profileError || !userProfile) {
      throw new Error('User profile not found');
    }
    
    // Step 2: Check if challenges already generated today
    const today = new Date()?.toISOString()?.split('T')?.[0];
    const { data: existingChallenges } = await supabase?.from('daily_challenges')?.select('*')?.eq('user_id', userId)?.gte('created_at', `${today}T00:00:00Z`)?.lte('created_at', `${today}T23:59:59Z`);
    
    if (existingChallenges && existingChallenges?.length > 0) {
      return {
        success: true,
        challenges: existingChallenges,
        message: 'Challenges already generated for today'
      };
    }
    
    // Step 3: Analyze user behavior for personalization
    const userBehavior = analyzeUserBehavior(userProfile);
    
    // Step 4: Determine difficulty level based on user level
    const difficultyLevel = determineDifficultyLevel(userProfile?.level || 1);
    
    // Step 5: Select appropriate challenge templates
    const selectedTemplates = selectChallengeTemplates(userBehavior, difficultyLevel);
    
    // Step 6: Generate challenges with AI (with fallback)
    let generatedChallenges;
    
    try {
      // Try AI generation first
      generatedChallenges = await generateChallengesWithAI(userId, userBehavior, selectedTemplates);
    } catch (aiError) {
      console.warn('AI challenge generation failed, using fallback:', aiError);
      // Fallback to template-based generation
      generatedChallenges = generateChallengesFromTemplates(selectedTemplates, userBehavior);
    }
    
    // Step 7: Validate and sanitize challenges
    const validatedChallenges = validateChallenges(generatedChallenges, userProfile);
    
    // Step 8: Insert challenges into database
    const { data: insertedChallenges, error: insertError } = await supabase?.from('daily_challenges')?.insert(
        validatedChallenges?.map(challenge => ({
          user_id: userId,
          title: challenge?.title,
          description: challenge?.description,
          type: challenge?.type,
          target_count: challenge?.targetCount,
          current_count: 0,
          reward_vp: challenge?.reward,
          difficulty: challenge?.difficulty,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)?.toISOString(),
          status: 'active'
        }))
      )?.select();
    
    if (insertError) throw insertError;
    
    // Step 9: Log generation success
    await supabase?.from('challenge_generation_logs')?.insert({
      user_id: userId,
      challenges_generated: insertedChallenges?.length,
      generation_method: generatedChallenges?.method || 'ai',
      user_level: userProfile?.level,
      difficulty: difficultyLevel,
      created_at: new Date()?.toISOString()
    });
    
    return {
      success: true,
      challenges: insertedChallenges,
      message: 'Daily challenges generated successfully'
    };
    
  } catch (error) {
    console.error('Generate daily challenges error:', error);
    
    // Ultimate fallback: Generate basic challenges
    try {
      const fallbackChallenges = generateBasicFallbackChallenges(userId);
      
      const { data: insertedChallenges } = await supabase?.from('daily_challenges')?.insert(fallbackChallenges)?.select();
      
      return {
        success: true,
        challenges: insertedChallenges,
        message: 'Generated fallback challenges',
        fallback: true
      };
    } catch (fallbackError) {
      console.error('Fallback challenge generation failed:', fallbackError);
      throw new Error('Failed to generate daily challenges');
    }
  }
};

/**
 * Analyze user behavior for personalization
 */
const analyzeUserBehavior = (userProfile) => {
  return {
    votingFrequency: userProfile?.total_votes_cast || 0,
    predictionAccuracy: userProfile?.prediction_accuracy || 0,
    socialEngagement: userProfile?.social_engagement_score || 0,
    creationActivity: userProfile?.total_elections_created || 0,
    preferredCategories: userProfile?.preferred_categories || [],
    activityLevel: calculateActivityLevel(userProfile)
  };
};

/**
 * Calculate user activity level
 */
const calculateActivityLevel = (userProfile) => {
  const totalActivity = 
    (userProfile?.total_votes_cast || 0) +
    (userProfile?.total_elections_created || 0) * 5 +
    (userProfile?.social_engagement_score || 0);
  
  if (totalActivity < 10) return 'beginner';
  if (totalActivity < 50) return 'intermediate';
  if (totalActivity < 200) return 'advanced';
  return 'expert';
};

/**
 * Determine difficulty level based on user level
 */
const determineDifficultyLevel = (userLevel) => {
  if (userLevel <= 3) return 'easy';
  if (userLevel <= 7) return 'medium';
  return 'hard';
};

/**
 * Select appropriate challenge templates
 */
const selectChallengeTemplates = (userBehavior, difficultyLevel) => {
  // Filter templates by difficulty
  let availableTemplates = CHALLENGE_TEMPLATES?.filter(
    template => template?.difficulty === difficultyLevel
  );
  
  // If no templates for difficulty, use all templates
  if (availableTemplates?.length === 0) {
    availableTemplates = CHALLENGE_TEMPLATES;
  }
  
  // Prioritize based on user behavior
  const prioritized = availableTemplates?.map(template => {
    let priority = 1;
    
    if (template?.type === 'voting' && userBehavior?.votingFrequency > 10) priority += 2;
    if (template?.type === 'prediction' && userBehavior?.predictionAccuracy > 0.7) priority += 2;
    if (template?.type === 'social' && userBehavior?.socialEngagement > 5) priority += 2;
    if (template?.type === 'creation' && userBehavior?.creationActivity > 0) priority += 2;
    
    return { ...template, priority };
  });
  
  // Sort by priority and select top 3
  return prioritized?.sort((a, b) => b?.priority - a?.priority)?.slice(0, 3);
};

/**
 * Generate challenges with AI
 */
const generateChallengesWithAI = async (userId, userBehavior, templates) => {
  try {
    const response = await fetch(
      `${import.meta.env?.VITE_API_URL}/functions/v1/ai-proxy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase?.auth?.getSession())?.data?.session?.access_token}`
        },
        body: JSON.stringify({
          provider: 'openai',
          action: 'generate_challenges',
          params: {
            userId,
            userBehavior,
            templates,
            count: 3
          }
        })
      }
    );
    
    if (!response?.ok) {
      throw new Error('AI generation failed');
    }
    
    const data = await response?.json();
    return { ...data, method: 'ai' };
  } catch (error) {
    console.error('AI challenge generation error:', error);
    throw error;
  }
};

/**
 * Generate challenges from templates (fallback)
 */
const generateChallengesFromTemplates = (templates, userBehavior) => {
  return templates?.map(template => {
    const count = Math.floor(
      Math.random() * (template?.maxCount - template?.minCount + 1) + template?.minCount
    );
    
    return {
      title: template?.title?.replace('{count}', count),
      description: template?.description?.replace('{count}', count),
      type: template?.type,
      targetCount: count,
      reward: template?.reward,
      difficulty: template?.difficulty,
      method: 'template'
    };
  });
};

/**
 * Validate challenges
 */
const validateChallenges = (challenges, userProfile) => {
  return challenges?.map(challenge => {
    // Ensure target count is reasonable
    if (challenge?.targetCount < 1) challenge.targetCount = 1;
    if (challenge?.targetCount > 20) challenge.targetCount = 20;
    
    // Ensure reward is reasonable
    if (challenge?.reward < 10) challenge.reward = 10;
    if (challenge?.reward > 500) challenge.reward = 500;
    
    // Adjust difficulty based on user level
    if (userProfile?.level < 3 && challenge?.difficulty === 'hard') {
      challenge.difficulty = 'medium';
      challenge.targetCount = Math.ceil(challenge?.targetCount * 0.7);
    }
    
    return challenge;
  });
};

/**
 * Generate basic fallback challenges
 */
const generateBasicFallbackChallenges = (userId) => {
  return [
    {
      user_id: userId,
      title: 'Vote 3 times today',
      description: 'Cast your vote in 3 different elections',
      type: 'voting',
      target_count: 3,
      current_count: 0,
      reward_vp: 50,
      difficulty: 'easy',
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)?.toISOString(),
      status: 'active'
    },
    {
      user_id: userId,
      title: 'Engage with 5 posts',
      description: 'Comment on or react to 5 different posts',
      type: 'social',
      target_count: 5,
      current_count: 0,
      reward_vp: 75,
      difficulty: 'easy',
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)?.toISOString(),
      status: 'active'
    },
    {
      user_id: userId,
      title: 'Make 2 predictions',
      description: 'Predict the outcome of 2 elections',
      type: 'prediction',
      target_count: 2,
      current_count: 0,
      reward_vp: 100,
      difficulty: 'easy',
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)?.toISOString(),
      status: 'active'
    }
  ];
};

/**
 * Update challenge progress with edge case handling
 */
export const updateChallengeProgressOptimized = async (userId, challengeType, increment = 1) => {
  try {
    // Get active challenges for user
    const { data: challenges, error } = await supabase?.from('daily_challenges')?.select('*')?.eq('user_id', userId)?.eq('type', challengeType)?.eq('status', 'active')?.gt('expires_at', new Date()?.toISOString());
    
    if (error) throw error;
    if (!challenges || challenges?.length === 0) return { updated: 0 };
    
    const updates = [];
    
    for (const challenge of challenges) {
      const newCount = challenge?.current_count + increment;
      const isCompleted = newCount >= challenge?.target_count;
      
      updates?.push(
        supabase?.from('daily_challenges')?.update({
            current_count: newCount,
            status: isCompleted ? 'completed' : 'active',
            completed_at: isCompleted ? new Date()?.toISOString() : null
          })?.eq('id', challenge?.id)
      );
      
      // Award VP if completed
      if (isCompleted) {
        updates?.push(
          supabase?.from('user_vp_transactions')?.insert({
            user_id: userId,
            amount: challenge?.reward_vp,
            transaction_type: 'quest_completion',
            reference_id: challenge?.id,
            description: `Completed challenge: ${challenge?.title}`
          })
        );
      }
    }
    
    await Promise.all(updates);
    
    return { updated: challenges?.length };
  } catch (error) {
    console.error('Update challenge progress error:', error);
    throw error;
  }
};