import { supabase } from '../lib/supabase';

/**
 * Online Nominations Service
 * Allows voters to nominate candidates/products/services for elections that have allow_nominations enabled.
 */
export const nominationsService = {
  async getByElection(electionId) {
    try {
      const { data, error } = await supabase
        ?.from('election_nominations')
        ?.select('*')
        ?.eq('election_id', electionId)
        ?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: { message: error?.message } };
    }
  },

  async create(electionId, { nomineeName, nomineeDescription, nomineeImageUrl }) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('election_nominations')
        ?.insert({
          election_id: electionId,
          nominator_id: user?.id,
          nominee_name: nomineeName,
          nominee_description: nomineeDescription || null,
          nominee_image_url: nomineeImageUrl || null,
          status: 'pending',
        })
        ?.select()
        ?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async updateStatus(nominationId, status) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('election_nominations')
        ?.update({ status, updated_at: new Date()?.toISOString() })
        ?.eq('id', nominationId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },
};
