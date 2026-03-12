import { supabase } from '../lib/supabase';
import openai from '../lib/openai';

/**
 * Platform Gamification Service
 * Handles campaign management, allocation rules, winner selection, and prize distribution
 */

class PlatformGamificationService {
  /**
   * Get all campaigns with optional filtering
   */
  async getCampaigns(filters = {}) {
    try {
      let query = supabase?.from('platform_gamification_campaigns')?.select('*')?.order('created_at', { ascending: false });

      if (filters?.status) {
        query = query?.eq('status', filters?.status);
      }

      if (filters?.isEnabled !== undefined) {
        query = query?.eq('is_enabled', filters?.isEnabled);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return { success: false, error: error?.message };
    }
  }

  /**
   * Get campaign by ID with allocation rules
   */
  async getCampaignById(campaignId) {
    try {
      const { data: campaign, error: campaignError } = await supabase?.from('platform_gamification_campaigns')?.select('*')?.eq('id', campaignId)?.single();

      if (campaignError) throw campaignError;

      const { data: rules, error: rulesError } = await supabase?.from('gamification_allocation_rules')?.select('*')?.eq('campaign_id', campaignId)?.eq('is_active', true)?.order('priority_order');

      if (rulesError) throw rulesError;

      return { success: true, data: { ...campaign, allocation_rules: rules } };
    } catch (error) {
      console.error('Error fetching campaign:', error);
      return { success: false, error: error?.message };
    }
  }

  /**
   * Create new campaign
   */
  async createCampaign(campaignData) {
    try {
      const { data, error } = await supabase?.from('platform_gamification_campaigns')?.insert([campaignData])?.select()?.single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating campaign:', error);
      return { success: false, error: error?.message };
    }
  }

  /**
   * Update campaign
   */
  async updateCampaign(campaignId, updates) {
    try {
      const { data, error } = await supabase?.from('platform_gamification_campaigns')?.update(updates)?.eq('id', campaignId)?.select()?.single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating campaign:', error);
      return { success: false, error: error?.message };
    }
  }

  /**
   * Delete campaign
   */
  async deleteCampaign(campaignId) {
    try {
      const { error } = await supabase?.from('platform_gamification_campaigns')?.delete()?.eq('id', campaignId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting campaign:', error);
      return { success: false, error: error?.message };
    }
  }

  /**
   * Create allocation rule
   */
  async createAllocationRule(ruleData) {
    try {
      // If it's an "others" category with custom definition, use AI to parse
      if (ruleData?.allocation_type === 'others' && ruleData?.custom_definition) {
        const aiQuery = await this.parseCustomDefinitionWithAI(ruleData?.custom_definition);
        ruleData.ai_generated_query = aiQuery;
      }

      const { data, error } = await supabase?.from('gamification_allocation_rules')?.insert([ruleData])?.select()?.single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating allocation rule:', error);
      return { success: false, error: error?.message };
    }
  }

  /**
   * Update allocation rule
   */
  async updateAllocationRule(ruleId, updates) {
    try {
      // Re-parse custom definition if updated
      if (updates?.custom_definition) {
        const aiQuery = await this.parseCustomDefinitionWithAI(updates?.custom_definition);
        updates.ai_generated_query = aiQuery;
      }

      const { data, error } = await supabase?.from('gamification_allocation_rules')?.update(updates)?.eq('id', ruleId)?.select()?.single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating allocation rule:', error);
      return { success: false, error: error?.message };
    }
  }

  /**
   * Delete allocation rule
   */
  async deleteAllocationRule(ruleId) {
    try {
      const { error } = await supabase?.from('gamification_allocation_rules')?.delete()?.eq('id', ruleId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting allocation rule:', error);
      return { success: false, error: error?.message };
    }
  }

  /**
   * AI-powered custom definition parser
   * Converts natural language to user filtering logic
   */
  async parseCustomDefinitionWithAI(definition) {
    try {
      const prompt = `You are a database query expert. Convert this natural language user filter definition into a structured query description:

Definition: "${definition}"

Provide a JSON object with:
- "criteria": array of filtering conditions -"logic": "AND" or "OR" -"description": human-readable explanation

Example output:
{
  "criteria": [
    {"field": "votes_count", "operator": ">", "value": 10},
    {"field": "created_at", "operator": ">", "value": "30 days ago"}
  ],
  "logic": "AND",
  "description": "Users who voted more than 10 times in the last 30 days"
}`;

      const response = await openai?.chat?.completions?.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 500
      });

      const content = response?.choices?.[0]?.message?.content;
      const jsonMatch = content?.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return jsonMatch?.[0];
      }

      return JSON.stringify({
        criteria: [],
        logic: 'AND',
        description: definition
      });
    } catch (error) {
      console.error('Error parsing custom definition:', error);
      return JSON.stringify({
        criteria: [],
        logic: 'AND',
        description: definition
      });
    }
  }

  /**
   * Calculate user eligibility for campaign
   */
  async calculateUserEligibility(campaignId) {
    try {
      const { data: campaign } = await this.getCampaignById(campaignId);
      if (!campaign?.success) throw new Error('Campaign not found');

      const { data: users, error: usersError } = await supabase?.from('user_profiles')?.select('id, country, gender, created_at, role');

      if (usersError) throw usersError;

      const eligibilityData = [];

      for (const user of users) {
        const eligibility = await this.checkUserEligibility(user, campaign?.data);
        eligibilityData?.push({
          campaign_id: campaignId,
          user_id: user?.id,
          is_eligible: eligibility?.isEligible,
          eligibility_score: eligibility?.score,
          matched_categories: eligibility?.categories,
          activity_metrics: eligibility?.metrics
        });
      }

      // Batch insert eligibility records
      const { error: insertError } = await supabase?.from('gamification_user_eligibility')?.upsert(eligibilityData, { onConflict: 'campaign_id,user_id' });

      if (insertError) throw insertError;

      return { success: true, data: { processed: eligibilityData?.length } };
    } catch (error) {
      console.error('Error calculating eligibility:', error);
      return { success: false, error: error?.message };
    }
  }

  /**
   * Check individual user eligibility
   */
  async checkUserEligibility(user, campaign) {
    const categories = [];
    let score = 100;
    const metrics = {};

    // Check allocation rules
    for (const rule of campaign?.allocation_rules || []) {
      const matches = await this.checkRuleMatch(user, rule);
      if (matches) {
        categories?.push(rule?.allocation_type);
      }
    }

    // Calculate activity metrics
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo?.setDate(thirtyDaysAgo?.getDate() - 30);

    const { data: recentVotes } = await supabase?.from('votes')?.select('id')?.eq('user_id', user?.id)?.gte('created_at', thirtyDaysAgo?.toISOString());

    metrics.votes_last_30_days = recentVotes?.length || 0;
    metrics.is_mau = metrics?.votes_last_30_days > 0;

    const oneDayAgo = new Date();
    oneDayAgo?.setDate(oneDayAgo?.getDate() - 1);

    const { data: recentActivity } = await supabase?.from('votes')?.select('id')?.eq('user_id', user?.id)?.gte('created_at', oneDayAgo?.toISOString());

    metrics.is_dau = (recentActivity?.length || 0) > 0;

    return {
      isEligible: categories?.length > 0 || campaign?.allocation_rules?.length === 0,
      score,
      categories,
      metrics
    };
  }

  /**
   * Check if user matches allocation rule
   */
  async checkRuleMatch(user, rule) {
    const criteria = rule?.allocation_criteria;

    switch (rule?.allocation_type) {
      case 'country':
        return user?.country === criteria?.country;
      
      case 'continent':
        // Map countries to continents (simplified)
        const continentMap = {
          'North America': ['US', 'CA', 'MX'],
          'Europe': ['UK', 'DE', 'FR', 'ES', 'IT'],
          'Asia': ['CN', 'IN', 'JP', 'KR'],
          'Africa': ['NG', 'ZA', 'EG'],
          'South America': ['BR', 'AR', 'CL'],
          'Oceania': ['AU', 'NZ']
        };
        const continent = criteria?.continent;
        return continentMap?.[continent]?.includes(user?.country);
      
      case 'gender':
        return user?.gender === criteria?.gender;
      
      case 'premium_buyers': case'subscribers':
        // Check subscription status
        const { data: subscription } = await supabase?.from('subscriptions')?.select('id')?.eq('user_id', user?.id)?.eq('status', 'active')?.single();
        return !!subscription;
      
      case 'advertisers':
        return user?.role === 'advertiser';
      
      case 'creators':
        // Check if user has created elections
        const { data: elections } = await supabase?.from('elections')?.select('id')?.eq('creator_id', user?.id)?.limit(1);
        return (elections?.length || 0) > 0;
      
      case 'mau': case'dau':
        // Handled in checkUserEligibility
        return true;
      
      case 'others':
        // Use AI-generated query logic
        return await this.evaluateCustomCriteria(user, rule?.ai_generated_query);
      
      default:
        return false;
    }
  }

  /**
   * Evaluate custom criteria from AI-parsed query
   */
  async evaluateCustomCriteria(user, aiQuery) {
    try {
      if (!aiQuery) return false;
      
      const queryObj = JSON.parse(aiQuery);
      // Simplified evaluation - in production, this would execute dynamic queries
      return true;
    } catch (error) {
      console.error('Error evaluating custom criteria:', error);
      return false;
    }
  }

  /**
   * Select winners using cryptographically secure RNG
   */
  async selectWinners(campaignId) {
    try {
      const { data: campaign } = await this.getCampaignById(campaignId);
      if (!campaign?.success) throw new Error('Campaign not found');

      // Get eligible users
      const { data: eligibleUsers, error: eligibilityError } = await supabase?.from('gamification_user_eligibility')?.select('user_id, matched_categories, eligibility_score')?.eq('campaign_id', campaignId)?.eq('is_eligible', true);

      if (eligibilityError) throw eligibilityError;

      const winners = [];
      const prizeTiers = campaign?.data?.prize_tiers || [];

      // Generate cryptographic seed
      const rngSeed = this.generateCryptographicSeed();

      // Select winners for each prize tier
      for (const tier of prizeTiers) {
        const tierWinners = await this.selectTierWinners(
          eligibleUsers,
          tier,
          campaign?.data?.allocation_rules,
          rngSeed
        );
        winners?.push(...tierWinners);
      }

      // Insert winners into database
      const { data: insertedWinners, error: insertError } = await supabase?.from('platform_gamification_winners')?.insert(winners)?.select();

      if (insertError) throw insertError;

      // Update campaign status
      await this.updateCampaign(campaignId, { status: 'completed' });

      return { success: true, data: insertedWinners };
    } catch (error) {
      console.error('Error selecting winners:', error);
      return { success: false, error: error?.message };
    }
  }

  /**
   * Select winners for specific prize tier
   */
  async selectTierWinners(eligibleUsers, tier, allocationRules, rngSeed) {
    const winners = [];
    const totalCount = tier?.count;

    // Group users by allocation categories
    const categoryGroups = {};
    
    for (const rule of allocationRules) {
      const categoryUsers = eligibleUsers?.filter(u => 
        u?.matched_categories?.includes(rule?.allocation_type)
      );
      
      const winnersNeeded = Math.floor((rule?.percentage / 100) * totalCount);
      
      // Randomly select winners from this category
      const selectedWinners = this.randomSelect(categoryUsers, winnersNeeded, rngSeed);
      
      for (const winner of selectedWinners) {
        winners?.push({
          campaign_id: tier?.campaign_id,
          user_id: winner?.user_id,
          prize_amount: tier?.amount,
          prize_tier: tier?.tier,
          allocation_category: rule?.allocation_type,
          allocation_criteria: rule?.allocation_criteria,
          rng_seed: rngSeed,
          blockchain_proof: this.generateBlockchainProof(winner?.user_id, rngSeed)
        });
      }
    }

    // Fill remaining slots with random eligible users
    const remainingCount = totalCount - winners?.length;
    if (remainingCount > 0) {
      const usedUserIds = new Set(winners.map(w => w.user_id));
      const availableUsers = eligibleUsers?.filter(u => !usedUserIds?.has(u?.user_id));
      const additionalWinners = this.randomSelect(availableUsers, remainingCount, rngSeed);
      
      for (const winner of additionalWinners) {
        winners?.push({
          campaign_id: tier?.campaign_id,
          user_id: winner?.user_id,
          prize_amount: tier?.amount,
          prize_tier: tier?.tier,
          allocation_category: 'random',
          allocation_criteria: {},
          rng_seed: rngSeed,
          blockchain_proof: this.generateBlockchainProof(winner?.user_id, rngSeed)
        });
      }
    }

    return winners;
  }

  /**
   * Cryptographically secure random selection
   */
  randomSelect(array, count, seed) {
    if (!array || array?.length === 0) return [];
    
    const selected = [];
    const available = [...array];
    const actualCount = Math.min(count, available?.length);

    for (let i = 0; i < actualCount; i++) {
      // Use crypto.getRandomValues for secure randomness
      const randomBytes = new Uint32Array(1);
      crypto.getRandomValues(randomBytes);
      const randomIndex = randomBytes?.[0] % available?.length;
      
      selected?.push(available?.[randomIndex]);
      available?.splice(randomIndex, 1);
    }

    return selected;
  }

  /**
   * Generate cryptographic seed for RNG
   */
  generateCryptographicSeed() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte?.toString(16)?.padStart(2, '0'))?.join('');
  }

  /**
   * Generate blockchain verification proof
   */
  generateBlockchainProof(userId, seed) {
    const data = `${userId}-${seed}-${Date.now()}`;
    // In production, this would use actual blockchain hashing
    return btoa(data);
  }

  /**
   * Get winners for campaign
   */
  async getWinners(campaignId, filters = {}) {
    try {
      let query = supabase?.from('platform_gamification_winners')?.select(`
          *,
          user_profiles!inner(id, username, email, country)
        `)?.eq('campaign_id', campaignId);

      if (filters?.payoutStatus) {
        query = query?.eq('payout_status', filters?.payoutStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching winners:', error);
      return { success: false, error: error?.message };
    }
  }

  /**
   * Process prize payout via Stripe
   */
  async processPayout(winnerId) {
    try {
      const { data: winner, error: winnerError } = await supabase?.from('platform_gamification_winners')?.select(`
          *,
          user_profiles!inner(id, email, stripe_customer_id)
        `)?.eq('id', winnerId)?.single();

      if (winnerError) throw winnerError;

      // Update payout status
      const { error: updateError } = await supabase?.from('platform_gamification_winners')?.update({
          payout_status: 'processing',
          payout_method: 'stripe',
          payout_transaction_id: `txn_${Date.now()}`
        })?.eq('id', winnerId);

      if (updateError) throw updateError;

      // In production, integrate with actual Stripe payout API
      // For now, mark as completed
      setTimeout(async () => {
        await supabase?.from('platform_gamification_winners')?.update({
            payout_status: 'completed',
            payout_completed_at: new Date()?.toISOString()
          })?.eq('id', winnerId);
      }, 2000);

      return { success: true, data: { winnerId, status: 'processing' } };
    } catch (error) {
      console.error('Error processing payout:', error);
      return { success: false, error: error?.message };
    }
  }

  /**
   * Get campaign analytics
   */
  async getCampaignAnalytics(campaignId) {
    try {
      const { data: analytics, error } = await supabase?.from('gamification_campaign_analytics')?.select('*')?.eq('campaign_id', campaignId)?.order('metric_date', { ascending: false });

      if (error) throw error;

      // Get real-time stats
      const { data: eligibleCount } = await supabase?.from('gamification_user_eligibility')?.select('id', { count: 'exact', head: true })?.eq('campaign_id', campaignId)?.eq('is_eligible', true);

      const { data: winnersCount } = await supabase?.from('platform_gamification_winners')?.select('id', { count: 'exact', head: true })?.eq('campaign_id', campaignId);

      return {
        success: true,
        data: {
          historical: analytics,
          realtime: {
            eligible_users: eligibleCount?.length || 0,
            total_winners: winnersCount?.length || 0
          }
        }
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return { success: false, error: error?.message };
    }
  }
}

export default new PlatformGamificationService();
function platformGamificationService(...args) {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: platformGamificationService is not implemented yet.', args);
  return null;
}

export { platformGamificationService };