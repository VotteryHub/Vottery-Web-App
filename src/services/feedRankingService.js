import { supabase } from '../lib/supabase';
import openai from '../lib/openai';


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

export const feedRankingService = {
  async getRankingConfig() {
    try {
      const { data, error } = await supabase
        ?.from('feed_ranking_config')
        ?.select('*')
        ?.eq('is_active', true)
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async generateSemanticEmbedding(text) {
    try {
      const response = await openai?.embeddings?.create({
        model: 'text-embedding-3-small',
        input: text,
      });

      return { data: response?.data?.[0]?.embedding, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async calculateSemanticSimilarity(text1, text2) {
    try {
      const [embedding1Result, embedding2Result] = await Promise.all([
        this.generateSemanticEmbedding(text1),
        this.generateSemanticEmbedding(text2)
      ]);

      if (embedding1Result?.error || embedding2Result?.error) {
        throw new Error('Failed to generate embeddings');
      }

      const embedding1 = embedding1Result?.data;
      const embedding2 = embedding2Result?.data;

      // Calculate cosine similarity
      let dotProduct = 0;
      let magnitude1 = 0;
      let magnitude2 = 0;

      for (let i = 0; i < embedding1?.length; i++) {
        dotProduct += embedding1?.[i] * embedding2?.[i];
        magnitude1 += embedding1?.[i] * embedding1?.[i];
        magnitude2 += embedding2?.[i] * embedding2?.[i];
      }

      const similarity = dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
      return { data: similarity, error: null };
    } catch (error) {
      return { data: 0, error: { message: error?.message } };
    }
  },

  async generatePersonalizedFeed(userId, contentMix = { elections: 6, posts: 10, ads: 2 }) {
    try {
      // Get user preferences and voting history
      const { data: preferences } = await supabase
        ?.from('user_topic_preferences')
        ?.select('*, topic_categories(*)')
        ?.eq('user_id', userId)
        ?.order('preference_score', { ascending: false });

      const { data: votingHistory } = await supabase
        ?.from('votes')
        ?.select('*, elections(*)')
        ?.eq('user_id', userId)
        ?.order('created_at', { ascending: false })
        ?.limit(50);

      // Get user's Moment interactions
      const { data: momentInteractions } = await supabase
        ?.from('reactions')
        ?.select('*, posts(*)')
        ?.eq('user_id', userId)
        ?.order('created_at', { ascending: false })
        ?.limit(50);

      // Use OpenAI to analyze user behavior and generate personalized recommendations
      const userBehaviorSummary = `
User Preferences: ${preferences?.map(p => p?.topicCategories?.displayName)?.join(', ')}
Recent Votes: ${votingHistory?.map(v => v?.elections?.title)?.slice(0, 10)?.join(', ')}
Moment Interactions: ${momentInteractions?.map(m => m?.posts?.content?.substring(0, 50))?.slice(0, 10)?.join(', ')}
      `;

      const openaiModule = await import('../lib/openai');
      const openai = openaiModule?.default;

      const response = await openai?.chat?.completions?.create({
        model: 'gpt-5-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a content recommendation engine. Analyze user behavior and suggest relevant election topics and content themes. Return JSON only.'
          },
          {
            role: 'user',
            content: `Based on this user behavior, suggest 5 election topics and 5 content themes they would enjoy:\n${userBehaviorSummary}`
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'personalized_recommendations',
            schema: {
              type: 'object',
              properties: {
                electionTopics: { type: 'array', items: { type: 'string' } },
                contentThemes: { type: 'array', items: { type: 'string' } }
              },
              required: ['electionTopics', 'contentThemes'],
              additionalProperties: false
            }
          }
        },
        reasoning_effort: 'low',
        verbosity: 'low'
      });

      const recommendations = JSON.parse(response?.choices?.[0]?.message?.content);

      // Fetch content based on AI recommendations
      const [electionsResult, postsResult] = await Promise.all([
        supabase?.from('elections')?.select('*')?.eq('status', 'active')?.limit(20),
        supabase?.from('posts')?.select('*')?.order('created_at', { ascending: false })?.limit(20)
      ]);

      const elections = electionsResult?.data || [];
      const posts = postsResult?.data || [];

      // Score content using AI recommendations
      const rankedContent = [];

      for (const election of elections?.slice(0, contentMix?.elections)) {
        let score = await this.calculateAIEnhancedScore(
          election,
          'election',
          recommendations?.electionTopics,
          preferences,
          votingHistory
        );
        rankedContent?.push({
          ...election,
          contentType: 'election',
          rankingScore: score,
          contentItemId: election?.id
        });
      }

      for (const post of posts?.slice(0, contentMix?.posts)) {
        let score = await this.calculateAIEnhancedScore(
          post,
          'post',
          recommendations?.contentThemes,
          preferences,
          momentInteractions
        );
        rankedContent?.push({
          ...post,
          contentType: 'post',
          rankingScore: score,
          contentItemId: post?.id
        });
      }

      // Sort by ranking score
      rankedContent?.sort((a, b) => b?.rankingScore - a?.rankingScore);

      return { data: rankedContent, error: null };
    } catch (error) {
      console.error('AI personalization error, falling back to standard ranking:', error);
      return await this.generateFeedRankings(userId, contentMix);
    }
  },

  async calculateAIEnhancedScore(content, contentType, aiRecommendations, preferences, history) {
    try {
      let score = 0.5; // Base score

      // AI recommendation matching
      const contentText = (content?.title || content?.content || content?.description || '')?.toLowerCase();
      for (const recommendation of aiRecommendations || []) {
        if (contentText?.includes(recommendation?.toLowerCase())) {
          score += 0.25;
        }
      }

      // User preference matching
      if (preferences && preferences?.length > 0) {
        for (const pref of preferences?.slice(0, 3)) {
          const topicName = pref?.topicCategories?.displayName || '';
          if (contentText?.includes(topicName?.toLowerCase())) {
            score += pref?.preferenceScore * 0.2;
          }
        }
      }

      // Historical engagement
      if (history && history?.length > 0) {
        const engagementRate = history?.length / 50;
        score += engagementRate * 0.15;
      }

      // Freshness factor
      const createdAt = new Date(content?.created_at || content?.createdAt);
      const hoursSinceCreation = (Date.now() - createdAt?.getTime()) / (1000 * 60 * 60);
      const freshnessFactor = Math.max(0, 1 - (hoursSinceCreation / 24));
      score += freshnessFactor * 0.1;

      return Math.min(1, Math.max(0, score));
    } catch (error) {
      return 0.5;
    }
  },

  async generateFeedRankings(userId, contentMix = { elections: 6, posts: 2, ads: 2 }) {
    try {
      // Get user preferences
      const { data: preferences } = await supabase
        ?.from('user_topic_preferences')
        ?.select('*, topic_categories(*)')
        ?.eq('user_id', userId)
        ?.order('preference_score', { ascending: false });

      // Get swipe history for behavioral analysis
      const { data: swipeHistory } = await supabase
        ?.from('swipe_history')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.order('created_at', { ascending: false })
        ?.limit(100);

      // Get ranking config
      const { data: config } = await this.getRankingConfig();

      // Fetch content from different sources
      const [electionsResult, postsResult] = await Promise.all([
        supabase?.from('elections')?.select('*')?.eq('status', 'active')?.limit(20),
        supabase?.from('posts')?.select('*')?.order('created_at', { ascending: false })?.limit(20)
      ]);

      const elections = electionsResult?.data || [];
      const posts = postsResult?.data || [];

      // Score and rank content
      const rankedContent = [];

      // Process elections
      for (const election of elections?.slice(0, contentMix?.elections)) {
        let score = await this.calculateContentScore(
          election,
          'election',
          preferences,
          swipeHistory,
          config
        );
        rankedContent?.push({
          ...election,
          contentType: 'election',
          rankingScore: score,
          contentItemId: election?.id
        });
      }

      // Process posts
      for (const post of posts?.slice(0, contentMix?.posts)) {
        let score = await this.calculateContentScore(
          post,
          'post',
          preferences,
          swipeHistory,
          config
        );
        rankedContent?.push({
          ...post,
          contentType: 'post',
          rankingScore: score,
          contentItemId: post?.id
        });
      }

      // Sort by ranking score
      rankedContent?.sort((a, b) => b?.rankingScore - a?.rankingScore);

      // Store rankings in database
      await this.storeRankings(userId, rankedContent, config?.id);

      return { data: rankedContent, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async calculateContentScore(content, contentType, preferences, swipeHistory, config) {
    try {
      let score = 0.5; // Base score

      // Topic relevance scoring
      if (preferences && preferences?.length > 0) {
        const topPreferences = preferences?.slice(0, 3);
        const contentText = content?.title || content?.content || content?.description || '';

        for (const pref of topPreferences) {
          const topicName = pref?.topicCategories?.displayName || '';
          if (contentText?.toLowerCase()?.includes(topicName?.toLowerCase())) {
            score += pref?.preferenceScore * 0.3;
          }
        }
      }

      // Engagement prediction based on swipe patterns
      if (swipeHistory && swipeHistory?.length > 0) {
        const recentSwipes = swipeHistory?.slice(0, 20);
        const positiveSwipes = recentSwipes?.filter(s => s?.swipe_direction === 'right' || s?.swipe_direction === 'up')?.length;
        const engagementRate = positiveSwipes / recentSwipes?.length;
        score += engagementRate * 0.2;
      }

      // Freshness factor
      const createdAt = new Date(content?.created_at || content?.createdAt);
      const hoursSinceCreation = (Date.now() - createdAt?.getTime()) / (1000 * 60 * 60);
      const freshnessDecay = config?.freshnessDecayHours || 24;
      const freshnessFactor = Math.max(0, 1 - (hoursSinceCreation / freshnessDecay));
      score += freshnessFactor * 0.15;

      // Content type weighting
      if (contentType === 'election') {
        score *= config?.electionWeight || 0.4;
      } else if (contentType === 'post') {
        score *= config?.postWeight || 0.4;
      } else if (contentType === 'ad') {
        score *= config?.adWeight || 0.2;
      }

      return Math.min(1, Math.max(0, score));
    } catch (error) {
      return 0.5; // Default score on error
    }
  },

  async storeRankings(userId, rankedContent, configId) {
    try {
      const rankings = rankedContent?.map((item, index) => ({
        user_id: userId,
        content_item_id: item?.contentItemId,
        content_item_type: item?.contentType,
        ranking_score: item?.rankingScore,
        ranking_position: index + 1,
        config_id: configId,
        expires_at: new Date(Date.now() + 15 * 60 * 1000)?.toISOString() // 15 minutes
      }));

      // Delete old rankings
      await supabase
        ?.from('feed_rankings')
        ?.delete()
        ?.eq('user_id', userId)
        ?.lt('expires_at', new Date()?.toISOString());

      // Insert new rankings
      const { error } = await supabase
        ?.from('feed_rankings')
        ?.insert(rankings);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  },

  async getUserFeedRankings(userId) {
    try {
      const { data, error } = await supabase
        ?.from('feed_rankings')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.gt('expires_at', new Date()?.toISOString())
        ?.order('ranking_position', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async recordEngagementSignal(engagementData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbData = toSnakeCase({
        ...engagementData,
        userId: user?.id,
        createdAt: new Date()?.toISOString()
      });

      const { data, error } = await supabase
        ?.from('user_engagement_signals')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  subscribeToFeedRankings(userId, callback) {
    const channel = supabase
      ?.channel(`feed-rankings-${userId}`)
      ?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'feed_rankings', filter: `user_id=eq.${userId}` },
        (payload) => {
          callback(toCamelCase(payload));
        }
      )
      ?.subscribe();

    return () => supabase?.removeChannel(channel);
  },

  // ============ OPENAI FEED PERSONALIZATION ============
  
  async generateSemanticEmbedding(text) {
    try {
      const response = await openai?.embeddings?.create({
        model: 'text-embedding-3-small',
        input: text,
      });

      return { data: response?.data?.[0]?.embedding, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async calculateSemanticSimilarity(text1, text2) {
    try {
      const [embedding1Result, embedding2Result] = await Promise.all([
        this.generateSemanticEmbedding(text1),
        this.generateSemanticEmbedding(text2)
      ]);

      if (embedding1Result?.error || embedding2Result?.error) {
        throw new Error('Failed to generate embeddings');
      }

      const embedding1 = embedding1Result?.data;
      const embedding2 = embedding2Result?.data;

      // Calculate cosine similarity
      let dotProduct = 0;
      let magnitude1 = 0;
      let magnitude2 = 0;

      for (let i = 0; i < embedding1?.length; i++) {
        dotProduct += embedding1?.[i] * embedding2?.[i];
        magnitude1 += embedding1?.[i] * embedding1?.[i];
        magnitude2 += embedding2?.[i] * embedding2?.[i];
      }

      const similarity = dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
      return { data: similarity, error: null };
    } catch (error) {
      return { data: 0, error: { message: error?.message } };
    }
  },

  async generateSemanticRecommendations(userContext, contentMix) {
    try {
      const prompt = `Based on this user's preferences and behavior, recommend content topics and themes:

User Context:
- Top Preferences: ${userContext?.topPreferences?.join(', ')}
- Recent Voting Topics: ${userContext?.recentVotingTopics?.join(', ')}
- Engaged Content Themes: ${userContext?.engagedContent?.join('; ')}

Provide 10 specific content recommendations that would interest this user. Return as JSON array of strings.`;

      const response = await openai?.chat?.completions?.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a content recommendation engine. Analyze user behavior and suggest relevant content topics.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const recommendations = JSON.parse(response?.choices?.[0]?.message?.content);
      return { data: recommendations, error: null };
    } catch (error) {
      return { data: [], error: { message: error?.message } };
    }
  },

  async calculateAIContentScore(content, contentType, userContext, recommendations) {
    try {
      let score = 0.5; // Base score

      const contentText = content?.title || content?.content || content?.description || '';

      // Check if content matches AI recommendations
      const matchCount = recommendations?.filter((rec) =>
        contentText?.toLowerCase()?.includes(rec?.toLowerCase())
      )?.length;

      score += (matchCount / recommendations?.length) * 0.4;

      // Semantic similarity using embeddings
      const userPreferencesText = userContext?.topPreferences?.join(' ');
      if (userPreferencesText) {
        const { data: similarity } = await this.calculateSemanticSimilarity(
          contentText,
          userPreferencesText
        );
        score += similarity * 0.3;
      }

      // Engagement prediction
      const engagementScore = await this.predictEngagement(content, userContext);
      score += engagementScore * 0.3;

      return Math.min(1, Math.max(0, score));
    } catch (error) {
      return 0.5; // Default score on error
    }
  },

  async predictEngagement(content, userContext) {
    try {
      // Simple engagement prediction based on user's past behavior
      const recentTopics = userContext?.recentVotingTopics || [];
      const contentCategory = content?.category || content?.type || '';

      if (recentTopics?.includes(contentCategory)) {
        return 0.8;
      }

      return 0.4;
    } catch (error) {
      return 0.5;
    }
  },

  async learnFromUserInteraction(userId, contentId, contentType, interactionType) {
    try {
      // Store interaction for learning
      const { error } = await supabase?.from('user_interactions')?.insert({
        user_id: userId,
        content_id: contentId,
        content_type: contentType,
        interaction_type: interactionType,
        created_at: new Date()?.toISOString()
      });

      if (error) throw error;

      // Update user preferences based on interaction
      if (interactionType === 'vote' || interactionType === 'like') {
        // Positive interaction - boost related topics
        await this.updateUserPreferences(userId, contentId, contentType, 0.1);
      }

      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  },

  async updateUserPreferences(userId, contentId, contentType, boost) {
    try {
      // Implementation for updating user preferences
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  }
};