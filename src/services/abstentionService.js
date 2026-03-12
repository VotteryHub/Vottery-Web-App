import { supabase } from '../lib/supabase';

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    acc[camelKey] = toCamelCase(obj[key]);
    return acc;
  }, {});
};

/** Record abstention. source: 'viewed_no_vote' | 'explicit' */
export const abstentionService = {
  async recordAbstention(electionId, userId, source = 'viewed_no_vote', reason = null) {
    if (!electionId || !userId) return { data: null, error: { message: 'electionId and userId required' } };
    try {
      const { data, error } = await supabase
        .from('vote_abstentions')
        .upsert(
          {
            election_id: electionId,
            user_id: userId,
            source: source === 'explicit' ? 'explicit' : 'viewed_no_vote',
            abstention_reason: reason || null
          },
          { onConflict: 'election_id,user_id', ignoreDuplicates: false }
        )
        .select()
        .single();
      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (err) {
      return { data: null, error: { message: err?.message } };
    }
  },

  /** Check if user already abstained (or voted) so we don't double-record on leave */
  async hasAbstained(electionId, userId) {
    if (!electionId || !userId) return { data: false, error: null };
    try {
      const { data, error } = await supabase
        .from('vote_abstentions')
        .select('id')
        .eq('election_id', electionId)
        .eq('user_id', userId)
        .maybeSingle();
      if (error) throw error;
      return { data: !!data, error: null };
    } catch (err) {
      return { data: false, error: { message: err?.message } };
    }
  },

  /** Abstention report for one election (creator or admin) */
  async getReportForElection(electionId) {
    try {
      const { data, error } = await supabase
        .from('vote_abstentions')
        .select('id, user_id, source, abstention_reason, created_at, user_profiles(name, username, email)')
        .eq('election_id', electionId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      const bySource = (data || []).reduce((acc, row) => {
        const s = row?.source || 'viewed_no_vote';
        acc[s] = (acc[s] || 0) + 1;
        return acc;
      }, {});
      return {
        data: {
          list: toCamelCase(data || []),
          total: (data || []).length,
          bySource
        },
        error: null
      };
    } catch (err) {
      return { data: null, error: { message: err?.message } };
    }
  },

  /** Admin: all abstentions across elections (paginated) */
  async getReportForAdmin(filters = {}) {
    try {
      let query = supabase
        .from('vote_abstentions')
        .select('id, election_id, user_id, source, abstention_reason, created_at, elections(title, status), user_profiles(name, email)', { count: 'exact' })
        .order('created_at', { ascending: false });
      if (filters.electionId) query = query.eq('election_id', filters.electionId);
      if (filters.source) query = query.eq('source', filters.source);
      const pageSize = filters.pageSize || 50;
      query = query.limit(pageSize);
      if (filters.cursor) query = query.lt('created_at', filters.cursor);
      const { data, error, count } = await query;
      if (error) throw error;
      const nextCursor = data?.length === pageSize ? data[data.length - 1]?.created_at : null;
      return { data: toCamelCase(data || []), nextCursor, total: count ?? 0, error: null };
    } catch (err) {
      return { data: [], nextCursor: null, total: 0, error: { message: err?.message } };
    }
  }
};
