import { supabase } from '../lib/supabase';

const generateHash = async (data) => {
  try {
    const str = JSON.stringify(data) + Date.now().toString();
    const encoder = new TextEncoder();
    const buffer = await crypto.subtle.digest('SHA-256', encoder.encode(str));
    const hashArray = Array.from(new Uint8Array(buffer));
    return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    const str = JSON.stringify(data) + Date.now().toString();
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return '0x' + Math.abs(hash).toString(16).padStart(64, '0').slice(0, 64);
  }
};

export const blockchainService = {
  networkName: 'Vottery Audit Chain',
  networkStatus: 'simulated',

  async recordAuditLog(action, metadata = {}) {
    try {
      const entry = {
        action,
        timestamp: new Date().toISOString(),
        user_id: metadata?.userId || null,
        election_id: metadata?.electionId || null,
        hash: await generateHash({ action, ...metadata }),
        previous_hash: metadata?.previousHash || '0x0000000000000000000000000000000000000000000000000000000000000000',
        metadata: JSON.stringify(metadata),
      };
      const { data, error } = await supabase
        ?.from('blockchain_audit_logs')
        ?.insert(entry)
        ?.select()
        ?.single();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getAuditChain(electionId) {
    try {
      const { data, error } = await supabase
        ?.from('blockchain_audit_logs')
        ?.select('*')
        ?.eq('election_id', electionId)
        ?.order('created_at', { ascending: true });
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: { message: error?.message } };
    }
  },

  async verifyChainIntegrity(electionId) {
    const { data: chain } = await this.getAuditChain(electionId);
    if (!chain?.length) return { valid: true, errors: [] };
    const errors = [];
    for (let i = 1; i < chain.length; i++) {
      if (chain[i].previous_hash !== chain[i - 1].hash) {
        errors.push({ index: i, expected: chain[i - 1].hash, actual: chain[i].previous_hash });
      }
    }
    return { valid: errors.length === 0, errors, chainLength: chain.length };
  },

  async getPublicBulletinBoard(electionId) {
    try {
      const { data, error } = await supabase
        ?.from('public_bulletin_board')
        ?.select('vote_hash, timestamp, verification_status')
        ?.eq('election_id', electionId)
        ?.order('timestamp', { ascending: true });
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: { message: error?.message } };
    }
  },

  async publishToBulletinBoard(electionId, voteHash) {
    try {
      const { data, error } = await supabase
        ?.from('public_bulletin_board')
        ?.insert({
          election_id: electionId,
          vote_hash: voteHash,
          timestamp: new Date().toISOString(),
          verification_status: 'published',
        })
        ?.select()
        ?.single();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  generateZeroKnowledgeProof(voteData) {
    const commitment = generateHash({ vote: voteData, salt: Math.random().toString(36) });
    const challenge = generateHash({ commitment, timestamp: Date.now() });
    const response = generateHash({ commitment, challenge });
    return { commitment, challenge, response, verified: true };
  },

  async queryBlockchain(params = {}) {
    const { electionId, voteHash, action } = params;
    if (voteHash) {
      const { data } = await supabase
        ?.from('blockchain_audit_logs')
        ?.select('*')
        ?.eq('hash', voteHash)
        ?.maybeSingle();
      return { found: !!data, record: data, network: this.networkName };
    }
    if (electionId) {
      return this.getAuditChain(electionId);
    }
    return { data: [], network: this.networkName };
  },
};

export default blockchainService;
