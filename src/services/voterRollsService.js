import { supabase } from '../lib/supabase';

export const voterRollsService = {
  async getVoterRoll(electionId) {
    try {
      const { data, error } = await supabase
        ?.from('election_voter_rolls')
        ?.select('*')
        ?.eq('election_id', electionId)
        ?.order('created_at', { ascending: false });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async importVoterRoll(electionId, voters) {
    try {
      const rows = voters?.map((v) => ({
        election_id: electionId,
        email: v?.email?.trim()?.toLowerCase(),
        name: v?.name?.trim() || '',
        verified: false,
      }));
      const { data, error } = await supabase
        ?.from('election_voter_rolls')
        ?.upsert(rows, { onConflict: 'election_id,email' })
        ?.select();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async verifyVoter(electionId, email) {
    try {
      const { data, error } = await supabase
        ?.from('election_voter_rolls')
        ?.select('id, email, verified')
        ?.eq('election_id', electionId)
        ?.eq('email', email?.trim()?.toLowerCase())
        ?.maybeSingle();
      if (error) throw error;
      return { data, isEligible: !!data, error: null };
    } catch (error) {
      return { data: null, isEligible: false, error: { message: error?.message } };
    }
  },

  async removeVoter(rollEntryId) {
    try {
      const { error } = await supabase
        ?.from('election_voter_rolls')
        ?.delete()
        ?.eq('id', rollEntryId);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  },

  parseCSV(csvText) {
    const lines = csvText?.split('\n')?.filter((l) => l?.trim());
    const header = lines?.[0]?.toLowerCase();
    const hasHeader = header?.includes('email') || header?.includes('name');
    const dataLines = hasHeader ? lines?.slice(1) : lines;
    return dataLines?.map((line) => {
      const parts = line?.split(',')?.map((p) => p?.trim()?.replace(/^"|"$/g, ''));
      return { email: parts?.[0] || '', name: parts?.[1] || '' };
    })?.filter((v) => v?.email);
  },
};

export default voterRollsService;
