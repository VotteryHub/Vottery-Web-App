import { supabase } from '../lib/supabase';

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

export const suggestedContentService = {
  async getSuggestions(type) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) return { data: [], error: null };

      switch (type) {
        case 'elections':
          return await this.getSuggestedElections(user?.id);
        case 'friends':
          return await this.getSuggestedFriends(user?.id);
        case 'pages':
          return await this.getSuggestedPages(user?.id);
        case 'groups':
          return await this.getSuggestedGroups(user?.id);
        case 'events':
          return await this.getSuggestedEvents(user?.id);
        default:
          return { data: [], error: null };
      }
    } catch (error) {
      return { data: [], error: { message: error?.message } };
    }
  },

  async getSuggestedElections(userId) {
    try {
      // Get user's voting history to find similar elections
      const { data: votingHistory } = await supabase
        ?.from('votes')
        ?.select('election_id, elections(category, voting_type)')
        ?.eq('user_id', userId)
        ?.limit(10);

      const categories = votingHistory?.map(v => v?.elections?.category)?.filter(Boolean) || [];
      const votingTypes = votingHistory?.map(v => v?.elections?.voting_type)?.filter(Boolean) || [];

      // Find elections in similar categories that user hasn't voted in
      let query = supabase
        ?.from('elections')
        ?.select('*')
        ?.eq('status', 'active')
        ?.not('created_by', 'eq', userId);

      if (categories?.length > 0) {
        query = query?.in('category', categories);
      }

      const { data, error } = await query?.limit(10);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: [], error: { message: error?.message } };
    }
  },

  async getSuggestedFriends(userId) {
    try {
      // Get friends of friends (mutual connections)
      const { data: myFriends } = await supabase
        ?.from('friendships')
        ?.select('friend_id')
        ?.eq('user_id', userId)
        ?.eq('status', 'accepted');

      const friendIds = myFriends?.map(f => f?.friend_id) || [];

      if (friendIds?.length === 0) {
        // If no friends, suggest popular users
        const { data, error } = await supabase
          ?.from('user_profiles')
          ?.select('*')
          ?.not('id', 'eq', userId)
          ?.order('reputation_score', { ascending: false })
          ?.limit(10);

        if (error) throw error;
        return { data: toCamelCase(data), error: null };
      }

      // Get friends of friends
      const { data, error } = await supabase
        ?.from('friendships')
        ?.select('friend_id, user_profiles!friendships_friend_id_fkey(*)')
        ?.in('user_id', friendIds)
        ?.eq('status', 'accepted')
        ?.not('friend_id', 'eq', userId)
        ?.not('friend_id', 'in', `(${friendIds?.join(',')})`)
        ?.limit(10);

      if (error) throw error;

      const suggestions = data?.map(item => ({
        ...item?.user_profiles,
        mutualFriends: 1 // Simplified - would need complex query for accurate count
      }));

      return { data: toCamelCase(suggestions), error: null };
    } catch (error) {
      return { data: [], error: { message: error?.message } };
    }
  },

  async getSuggestedPages(userId) {
    try {
      // Mock data for pages - would integrate with actual pages table
      const mockPages = [
        { id: 1, name: 'Democratic Voices', category: 'Politics', followers: 15420 },
        { id: 2, name: 'Tech Innovation Hub', category: 'Technology', followers: 8932 },
        { id: 3, name: 'Environmental Action', category: 'Environment', followers: 12105 },
        { id: 4, name: 'Community Development', category: 'Social', followers: 6847 },
        { id: 5, name: 'Youth Empowerment', category: 'Education', followers: 9234 }
      ];

      return { data: mockPages, error: null };
    } catch (error) {
      return { data: [], error: { message: error?.message } };
    }
  },

  async getSuggestedGroups(userId) {
    try {
      // Mock data for groups - would integrate with actual groups table
      const mockGroups = [
        { id: 1, name: 'Election Enthusiasts', privacy: 'Public', members: 2341 },
        { id: 2, name: 'Voting Rights Advocates', privacy: 'Public', members: 1876 },
        { id: 3, name: 'Political Debate Club', privacy: 'Private', members: 892 },
        { id: 4, name: 'Community Organizers', privacy: 'Public', members: 3421 },
        { id: 5, name: 'Youth Voters Network', privacy: 'Public', members: 1654 }
      ];

      return { data: mockGroups, error: null };
    } catch (error) {
      return { data: [], error: { message: error?.message } };
    }
  },

  async getSuggestedEvents(userId) {
    try {
      // Mock data for events - would integrate with actual events table
      const mockEvents = [
        { 
          id: 1, 
          name: 'Virtual Town Hall Meeting', 
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)?.toISOString(), 
          location: 'Online', 
          interested: 342 
        },
        { 
          id: 2, 
          name: 'Election Results Watch Party', 
          date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)?.toISOString(), 
          location: 'Community Center', 
          interested: 567 
        },
        { 
          id: 3, 
          name: 'Voter Registration Drive', 
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)?.toISOString(), 
          location: 'City Park', 
          interested: 234 
        },
        { 
          id: 4, 
          name: 'Political Debate Forum', 
          date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)?.toISOString(), 
          location: 'University Auditorium', 
          interested: 789 
        },
        { 
          id: 5, 
          name: 'Community Voting Workshop', 
          date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)?.toISOString(), 
          location: 'Library', 
          interested: 156 
        }
      ];

      return { data: mockEvents, error: null };
    } catch (error) {
      return { data: [], error: { message: error?.message } };
    }
  },

  async follow(itemId, type) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      // Implementation would depend on the type
      // For friends, create friendship request
      // For pages/groups/events, create follow/join record
      
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  }
};

export default suggestedContentService;