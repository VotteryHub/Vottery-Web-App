import { supabase } from '../lib/supabase';
import { aiProxyService } from './aiProxyService';

class AdvancedSearchService {
  // Unified search across all content types
  static async unifiedSearch(query, filters = {}) {
    try {
      const {
        contentTypes = ['posts', 'users', 'groups', 'elections'],
        dateRange = null,
        engagementLevel = null,
        geographicRegion = null,
        sortBy = 'relevance',
        limit = 50,
        offset = 0
      } = filters;

      const results = {
        posts: [],
        users: [],
        groups: [],
        elections: [],
        totalResults: 0,
        searchTime: 0
      };

      const startTime = performance.now();

      // Search posts
      if (contentTypes?.includes('posts')) {
        const postsQuery = supabase?.from('posts')?.select(`
            *,
            user_profiles!posts_user_id_fkey(id, username, name, avatar),
            reactions:reactions(count),
            comments:comments(count)
          `)?.or(`title.ilike.%${query}%,content.ilike.%${query}%`)?.limit(limit);

        if (dateRange) {
          postsQuery?.gte('created_at', dateRange?.start)?.lte('created_at', dateRange?.end);
        }

        const { data: posts } = await postsQuery;
        results.posts = posts || [];
      }

      // Search users
      if (contentTypes?.includes('users')) {
        const usersQuery = supabase?.from('user_profiles')?.select('*')?.or(`username.ilike.%${query}%,name.ilike.%${query}%,bio.ilike.%${query}%`)?.limit(limit);

        const { data: users } = await usersQuery;
        results.users = users || [];
      }

      // Search groups
      if (contentTypes?.includes('groups')) {
        const groupsQuery = supabase?.from('groups')?.select(`
            *,
            members:group_members(count)
          `)?.or(`name.ilike.%${query}%,description.ilike.%${query}%`)?.limit(limit);

        const { data: groups } = await groupsQuery;
        results.groups = groups || [];
      }

      // Search elections
      if (contentTypes?.includes('elections')) {
        const electionsQuery = supabase?.from('elections')?.select(`
            *,
            user_profiles!elections_created_by_fkey(id, username, name, avatar),
            votes:votes(count)
          `)?.or(`title.ilike.%${query}%,description.ilike.%${query}%`)?.in('status', ['active', 'upcoming', 'completed'])?.limit(limit);

        if (dateRange) {
          electionsQuery?.gte('created_at', dateRange?.start)?.lte('created_at', dateRange?.end);
        }

        const { data: elections } = await electionsQuery;
        results.elections = elections || [];
      }

      results.totalResults = 
        results?.posts?.length + 
        results?.users?.length + 
        results?.groups?.length + 
        results?.elections?.length;

      results.searchTime = performance.now() - startTime;

      // Apply AI-assisted ranking if requested
      if (sortBy === 'relevance') {
        results.rankedResults = await this.applyAIRanking(query, results);
      }

      return results;
    } catch (error) {
      console.error('Unified search error:', error);
      throw error;
    }
  }

  // AI-assisted result ranking
  static async applyAIRanking(query, results) {
    try {
      const allResults = [
        ...results?.posts?.map(p => ({ ...p, type: 'post' })),
        ...results?.users?.map(u => ({ ...u, type: 'user' })),
        ...results?.groups?.map(g => ({ ...g, type: 'group' })),
        ...results?.elections?.map(e => ({ ...e, type: 'election' }))
      ];

      // Use AI to rank results by relevance
      const rankingPrompt = `
Rank these search results by relevance to the query: "${query}"

Results:
${JSON.stringify(allResults?.map(r => ({
  type: r?.type,
  title: r?.title || r?.name || r?.username,
  description: r?.description || r?.bio || r?.content
})))}

Return a JSON array of result indices sorted by relevance (most relevant first).
Consider: semantic similarity, engagement metrics, recency, and user intent.
`;

      const { data: aiData, error: aiError } = await aiProxyService?.callGemini?.(
        [{ role: 'user', content: rankingPrompt }],
        { model: 'gemini-1.5-flash', maxTokens: 500, temperature: 0.3 }
      );
      const content = aiData?.choices?.[0]?.message?.content || aiData?.content?.[0]?.text || '[]';
      let rankedIndices = [];
      try {
        const jsonMatch = content?.match(/\[[\s\S]*?\]/);
        if (jsonMatch) rankedIndices = JSON.parse(jsonMatch[0]);
      } catch (_) {}
      return Array.isArray(rankedIndices) && rankedIndices?.length > 0
        ? rankedIndices?.map(idx => allResults?.[idx])?.filter(Boolean)
        : [
            ...results?.posts?.map(p => ({ ...p, type: 'post' })),
            ...results?.elections?.map(e => ({ ...e, type: 'election' })),
            ...results?.groups?.map(g => ({ ...g, type: 'group' })),
            ...results?.users?.map(u => ({ ...u, type: 'user' }))
          ];
    } catch (error) {
      console.error('AI ranking error:', error);
      // Fallback to default ordering
      return [
        ...results?.posts?.map(p => ({ ...p, type: 'post' })),
        ...results?.elections?.map(e => ({ ...e, type: 'election' })),
        ...results?.groups?.map(g => ({ ...g, type: 'group' })),
        ...results?.users?.map(u => ({ ...u, type: 'user' }))
      ];
    }
  }

  // Auto-complete suggestions
  static async getAutocompleteSuggestions(query) {
    try {
      const { data: suggestions } = await supabase?.rpc('get_search_suggestions', {
        search_query: query,
        suggestion_limit: 10
      });

      return suggestions || [];
    } catch (error) {
      console.error('Autocomplete error:', error);
      return [];
    }
  }

  // Trending searches
  static async getTrendingSearches(limit = 10) {
    try {
      const { data: trending } = await supabase?.from('search_analytics')?.select('query, search_count')?.order('search_count', { ascending: false })?.gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000)?.toISOString())?.limit(limit);

      return trending || [];
    } catch (error) {
      console.error('Trending searches error:', error);
      return [];
    }
  }

  // Save search
  static async saveSearch(userId, query, filters) {
    try {
      const { data, error } = await supabase?.from('saved_searches')?.insert({
          user_id: userId,
          query: query,
          filters: filters,
          created_at: new Date()?.toISOString()
        })?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Save search error:', error);
      throw error;
    }
  }

  // Get saved searches
  static async getSavedSearches(userId) {
    try {
      const { data, error } = await supabase?.from('saved_searches')?.select('*')?.eq('user_id', userId)?.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get saved searches error:', error);
      return [];
    }
  }

  // Delete saved search
  static async deleteSavedSearch(searchId) {
    try {
      const { error } = await supabase?.from('saved_searches')?.delete()?.eq('id', searchId);

      if (error) throw error;
    } catch (error) {
      console.error('Delete saved search error:', error);
      throw error;
    }
  }

  // Track search analytics
  static async trackSearch(query, userId, resultsCount) {
    try {
      await supabase?.from('search_analytics')?.insert({
          query: query,
          user_id: userId,
          results_count: resultsCount,
          created_at: new Date()?.toISOString()
        });
    } catch (error) {
      console.error('Track search error:', error);
    }
  }

  // Get search analytics
  static async getSearchAnalytics(dateRange = 7) {
    try {
      const { data, error } = await supabase?.from('search_analytics')?.select('*')?.gte('created_at', new Date(Date.now() - dateRange * 24 * 60 * 60 * 1000)?.toISOString())?.order('created_at', { ascending: false });

      if (error) throw error;

      // Aggregate analytics
      const analytics = {
        totalSearches: data?.length || 0,
        uniqueQueries: new Set(data?.map(d => d.query))?.size,
        avgResultsPerSearch: data?.reduce((acc, d) => acc + (d?.results_count || 0), 0) / (data?.length || 1),
        topQueries: this.getTopQueries(data),
        searchesByDay: this.groupSearchesByDay(data)
      };

      return analytics;
    } catch (error) {
      console.error('Get search analytics error:', error);
      return null;
    }
  }

  static getTopQueries(data) {
    const queryCounts = {};
    data?.forEach(d => {
      queryCounts[d.query] = (queryCounts?.[d?.query] || 0) + 1;
    });

    return Object.entries(queryCounts)?.sort((a, b) => b?.[1] - a?.[1])?.slice(0, 10)?.map(([query, count]) => ({ query, count }));
  }

  static groupSearchesByDay(data) {
    const byDay = {};
    data?.forEach(d => {
      const day = new Date(d.created_at)?.toISOString()?.split('T')?.[0];
      byDay[day] = (byDay?.[day] || 0) + 1;
    });

    return Object.entries(byDay)?.map(([date, count]) => ({ date, count }));
  }
}

export default AdvancedSearchService;