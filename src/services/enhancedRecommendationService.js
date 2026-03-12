import perplexityClient from '../lib/perplexity';
import { supabase } from '../lib/supabase';
import { feedRankingService } from './feedRankingService';
import { aiProxyService } from './aiProxyService';


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

export const enhancedRecommendationService = {
  /**
   * Generate personalized election feed with Perplexity contextual reasoning
   */
  async generatePersonalizedElectionFeed(userId, options = {}) {
    try {
      // Get base feed rankings from existing service
      const { data: baseFeed } = await feedRankingService?.getUserFeedRankings(userId);

      // Get user profile and behavior data
      const { data: userProfile } = await supabase
        ?.from('user_profiles')
        ?.select('*')
        ?.eq('id', userId)
        ?.single();

      const { data: votingHistory } = await supabase
        ?.from('votes')
        ?.select('election_id, elections(title, category, voting_type, description)')
        ?.eq('user_id', userId)
        ?.order('created_at', { ascending: false })
        ?.limit(20);

      const { data: topicPreferences } = await supabase
        ?.from('user_topic_preferences')
        ?.select('*, topic_categories(name, description)')
        ?.eq('user_id', userId)
        ?.order('preference_score', { ascending: false });

      // Use Perplexity for contextual reasoning
      const contextPrompt = `Analyze user voting behavior and provide personalized election recommendations:

User Profile:
- Reputation Score: ${userProfile?.reputation_score || 0}
- Total Votes: ${votingHistory?.length || 0}
- Active Since: ${userProfile?.created_at}

Voting History:
${votingHistory?.slice(0, 10)?.map(v => `- ${v?.elections?.title} (${v?.elections?.category})`)?.join('\n')}

Topic Preferences:
${topicPreferences?.slice(0, 5)?.map(p => `- ${p?.topic_categories?.name}: ${p?.preference_score}%`)?.join('\n')}

Provide:
1. Top 3 election categories this user would engage with
2. Voting type preferences (ranked_choice, approval, plurality, plus_minus)
3. Content themes to prioritize
4. Engagement patterns (time of day, frequency)
5. Similar user segments for collaborative filtering

Format as JSON with keys: topCategories, votingTypePreferences, contentThemes, engagementPatterns, similarSegments`;

      let insights = null;
      try {
        const perplexityResponse = await perplexityClient?.createChatCompletion({
          model: 'sonar-pro',
          messages: [
            { role: 'system', content: 'You are an expert in behavioral pattern analysis and recommendation systems. Provide insights in JSON format.' },
            { role: 'user', content: contextPrompt }
          ],
          temperature: 0.4,
          maxTokens: 2000
        });
        insights = JSON.parse(perplexityResponse?.choices?.[0]?.message?.content || '{}');
      } catch (perplexityError) {
        console.warn('Perplexity feed ranking failed, falling back to Claude:', perplexityError?.message);
        const { data: claudeData, error: claudeError } = await aiProxyService?.callAnthropic?.(
          [
            { role: 'user', content: 'You are an expert in behavioral pattern analysis and recommendation systems. Provide insights in JSON format.\n\n' + contextPrompt }
          ],
          { model: 'claude-3-5-sonnet-20241022', maxTokens: 2000, temperature: 0.4 }
        );
        if (claudeError) throw new Error(claudeError?.message || 'Claude fallback failed');
        const text = claudeData?.content?.[0]?.text || claudeData?.choices?.[0]?.message?.content || '';
        try {
          insights = typeof text === 'string' && text?.trim() ? JSON.parse(text) : {};
        } catch {
          insights = {};
        }
      }
      if (!insights) insights = {};

      // Enhance base feed with Perplexity insights
      const enhancedFeed = await this.applyContextualReasoning(baseFeed, insights, userId);

      // Store recommendation insights
      await supabase
        ?.from('recommendation_insights')
        ?.insert(toSnakeCase({
          userId,
          insightType: 'election_feed',
          insights,
          appliedAt: new Date()?.toISOString()
        }));

      return { data: toCamelCase(enhancedFeed), error: null };
    } catch (error) {
      console.error('Error generating personalized election feed:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Apply contextual reasoning to enhance feed rankings
   */
  async applyContextualReasoning(baseFeed, insights, userId) {
    const enhancedFeed = baseFeed?.map(item => {
      let boostScore = 0;

      // Boost based on category match
      if (insights?.topCategories?.includes(item?.category)) {
        boostScore += 15;
      }

      // Boost based on voting type preference
      if (insights?.votingTypePreferences?.includes(item?.votingType)) {
        boostScore += 10;
      }

      // Boost based on content theme match
      const themeMatch = insights?.contentThemes?.some(theme => 
        item?.title?.toLowerCase()?.includes(theme?.toLowerCase()) ||
        item?.description?.toLowerCase()?.includes(theme?.toLowerCase())
      );
      if (themeMatch) {
        boostScore += 12;
      }

      return {
        ...item,
        rankingScore: (item?.rankingScore || 0) + boostScore,
        perplexityBoost: boostScore,
        reasoningApplied: true
      };
    });

    // Re-sort by enhanced score
    return enhancedFeed?.sort((a, b) => (b?.rankingScore || 0) - (a?.rankingScore || 0));
  },

  /**
   * Discover creators with Perplexity-powered matching
   */
  async discoverCreators(userId, preferences = {}) {
    try {
      // Get user's current interests
      const { data: userInterests } = await supabase
        ?.from('user_topic_preferences')
        ?.select('topic_categories(name)')
        ?.eq('user_id', userId);

      const { data: followedCreators } = await supabase
        ?.from('friendships')
        ?.select('friend_id')
        ?.eq('user_id', userId)
        ?.eq('status', 'accepted');

      // Get creator candidates
      const { data: creators } = await supabase
        ?.from('user_profiles')
        ?.select('id, name, reputation_score, bio')
        ?.gt('reputation_score', 500)
        ?.not('id', 'in', `(${[userId, ...followedCreators?.map(f => f?.friend_id)]?.join(',')})`)
        ?.limit(50);

      // Use Perplexity for creator matching
      const matchingPrompt = `Match creators to user interests:

User Interests:
${userInterests?.map(i => `- ${i?.topic_categories?.name}`)?.join('\n')}

Creator Candidates:
${creators?.slice(0, 20)?.map(c => `ID: ${c?.id}, Name: ${c?.name}, Bio: ${c?.bio}, Reputation: ${c?.reputation_score}`)?.join('\n')}

Rank top 10 creators by:
1. Content alignment with user interests
2. Engagement potential
3. Content quality indicators
4. Audience compatibility

Format as JSON array with keys: creatorId, matchScore, matchReason`;

      const perplexityResponse = await perplexityClient?.createChatCompletion({
        model: 'sonar-pro',
        messages: [
          { role: 'system', content: 'You are a creator discovery expert. Match creators to users based on interests and engagement potential.' },
          { role: 'user', content: matchingPrompt }
        ],
        temperature: 0.5,
        maxTokens: 1500
      });

      const matches = JSON.parse(perplexityResponse?.choices?.[0]?.message?.content);

      // Enrich matches with creator data
      const enrichedMatches = matches?.map(match => {
        const creator = creators?.find(c => c?.id === match?.creatorId);
        return {
          ...creator,
          matchScore: match?.matchScore,
          matchReason: match?.matchReason,
          recommendationType: 'perplexity_discovery'
        };
      });

      return { data: toCamelCase(enrichedMatches), error: null };
    } catch (error) {
      console.error('Error discovering creators:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Suggest advertiser campaigns with behavioral pattern matching
   */
  async suggestAdvertiserCampaigns(advertiserId, targetAudience = {}) {
    try {
      // Get advertiser's past campaign performance
      const { data: pastCampaigns } = await supabase
        ?.from('advertiser_campaigns')
        ?.select('*')
        ?.eq('advertiser_id', advertiserId)
        ?.order('created_at', { ascending: false })
        ?.limit(10);

      // Get platform audience data
      const { data: audienceSegments } = await supabase
        ?.from('user_profiles')
        ?.select('id, age_range, location, interests')
        ?.limit(1000);

      // Use Perplexity for campaign suggestions
      const suggestionPrompt = `Suggest optimal advertising campaigns:

Advertiser Past Performance:
${pastCampaigns?.map(c => `- ${c?.campaign_name}: CTR ${c?.ctr}%, Conversions ${c?.conversions}, ROI ${c?.roi}%`)?.join('\n')}

Target Audience Preferences:
- Age Range: ${targetAudience?.ageRange || 'All'}
- Location: ${targetAudience?.location || 'All zones'}
- Interests: ${targetAudience?.interests?.join(', ') || 'General'}

Available Audience Segments: ${audienceSegments?.length} users

Provide:
1. Top 5 campaign themes with highest engagement potential
2. Optimal targeting parameters
3. Recommended budget allocation
4. Expected performance metrics
5. Creative direction suggestions

Format as JSON array with keys: campaignTheme, targetingParams, budgetAllocation, expectedMetrics, creativeDirection`;

      const perplexityResponse = await perplexityClient?.createChatCompletion({
        model: 'sonar-pro',
        messages: [
          { role: 'system', content: 'You are an advertising campaign strategist. Provide data-driven campaign suggestions.' },
          { role: 'user', content: suggestionPrompt }
        ],
        temperature: 0.6,
        maxTokens: 2000
      });

      const suggestions = JSON.parse(perplexityResponse?.choices?.[0]?.message?.content);

      // Store campaign suggestions
      await supabase
        ?.from('campaign_suggestions')
        ?.insert(
          suggestions?.map(s => toSnakeCase({
            advertiserId,
            campaignTheme: s?.campaignTheme,
            targetingParams: s?.targetingParams,
            budgetAllocation: s?.budgetAllocation,
            expectedMetrics: s?.expectedMetrics,
            creativeDirection: s?.creativeDirection,
            status: 'pending'
          }))
        );

      return { data: toCamelCase(suggestions), error: null };
    } catch (error) {
      console.error('Error suggesting advertiser campaigns:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Get recommendation performance metrics
   */
  async getRecommendationPerformance(userId, dateRange = '7d') {
    try {
      const daysAgo = parseInt(dateRange?.replace('d', ''));
      const startDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)?.toISOString();

      const { data: insights } = await supabase
        ?.from('recommendation_insights')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.gte('applied_at', startDate);

      const { data: engagements } = await supabase
        ?.from('feed_rankings')
        ?.select('content_type, ranking_score, user_id')
        ?.eq('user_id', userId)
        ?.gte('created_at', startDate);

      const performance = {
        totalRecommendations: insights?.length || 0,
        engagementRate: engagements?.length / (insights?.length || 1),
        averageRankingScore: engagements?.reduce((sum, e) => sum + (e?.ranking_score || 0), 0) / (engagements?.length || 1),
        perplexityBoostImpact: this.calculateBoostImpact(engagements),
        topPerformingCategories: this.getTopCategories(engagements)
      };

      return { data: toCamelCase(performance), error: null };
    } catch (error) {
      console.error('Error fetching recommendation performance:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  calculateBoostImpact(engagements) {
    const boosted = engagements?.filter(e => e?.perplexity_boost > 0);
    const avgBoostedScore = boosted?.reduce((sum, e) => sum + (e?.ranking_score || 0), 0) / (boosted?.length || 1);
    const avgNormalScore = engagements?.filter(e => !e?.perplexity_boost)?.reduce((sum, e) => sum + (e?.ranking_score || 0), 0) / (engagements?.length || 1);
    return ((avgBoostedScore - avgNormalScore) / avgNormalScore) * 100;
  },

  getTopCategories(engagements) {
    const categories = {};
    engagements?.forEach(e => {
      const cat = e?.category || 'uncategorized';
      categories[cat] = (categories?.[cat] || 0) + 1;
    });
    return Object.entries(categories)
      ?.sort((a, b) => b?.[1] - a?.[1])
      ?.slice(0, 5)
      ?.map(([category, count]) => ({ category, count }));
  }
};