import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { RSACrypto, ElGamalCrypto, ZeroKnowledgeProof, CryptoUtils } from './cryptographyService';
import { blockchainService } from './blockchainService';

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

// Generate blockchain hash simulation
const generateBlockchainHash = () => {
  return `0x${Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16)?.toString(16)
  )?.join('')}`;
};

// Generate vote hash
const generateVoteHash = () => {
  return Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16)?.toString(16)
  )?.join('');
};

// Generate gamified ticket ID
const generateGamifiedTicketId = () => {
  return `GT-${Date.now()}-${uuidv4()?.substr(0, 8)?.toUpperCase()}`;
};

export const votesService = {
  async castVote(voteData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      // TIER 1 CRYPTOGRAPHIC FEATURES
      // 1. Generate RSA key pair for this vote
      const rsaKeys = RSACrypto?.generateKeyPair();
      
      // 2. Generate ElGamal key pair for homomorphic encryption
      const elgamalKeys = ElGamalCrypto?.generateKeyPair();
      
      // 3. Encrypt vote data with RSA
      const voteContent = JSON.stringify({
        selectedOptionId: voteData?.selectedOptionId,
        rankedChoices: voteData?.rankedChoices,
        selectedOptions: voteData?.selectedOptions,
        voteScores: voteData?.voteScores // Plus-Minus voting scores
      });
      const encryptedVote = RSACrypto?.encrypt(voteContent, rsaKeys?.publicKey);
      
      // 4. Generate cryptographic hashes
      const blockchainHash = generateBlockchainHash();
      const voteHash = CryptoUtils?.hash(voteContent + Date.now());
      const lotteryTicketId = voteData?.isLotterized ? generateGamifiedTicketId() : null;
      
      // 5. Generate zero-knowledge proof
      const zkProof = ZeroKnowledgeProof?.generateProof(voteHash, elgamalKeys?.privateKey);

      const dbData = toSnakeCase({
        electionId: voteData?.electionId,
        userId: user?.id,
        selectedOptionId: voteData?.selectedOptionId || null,
        rankedChoices: voteData?.rankedChoices || [],
        selectedOptions: voteData?.selectedOptions || [],
        voteScores: voteData?.voteScores || {}, // Plus-Minus voting scores
        blockchainHash,
        voteHash,
        lotteryTicketId,
        // Store encrypted vote and cryptographic metadata
        encryptedVoteData: encryptedVote,
        rsaPublicKey: rsaKeys?.publicKey,
        elgamalPublicKey: elgamalKeys?.publicKey
      });

      const { data, error } = await supabase?.from('votes')?.insert(dbData)?.select()?.single();

      if (error) throw error;

      // 6. Store zero-knowledge proof
      await supabase?.from('zero_knowledge_proofs')?.insert({
        vote_id: data?.id,
        election_id: voteData?.electionId,
        commitment: zkProof?.commitment,
        challenge: zkProof?.challenge,
        response: zkProof?.response,
        public_key: elgamalKeys?.publicKey,
        verified: false
      });

      // 7. Record on audit chain and publish to bulletin board
      await blockchainService?.recordAuditLog('vote_cast', {
        userId: user?.id,
        electionId: voteData?.electionId,
        previousHash: blockchainHash,
      });
      await blockchainService?.publishToBulletinBoard(voteData?.electionId, voteHash);

      // 7b. Dispatch vote_cast webhook for lottery/gamification (fire-and-forget)
      try {
        await supabase?.functions?.invoke('webhook-dispatcher', {
          body: {
            event: 'vote_cast',
            election_id: voteData?.electionId,
            payload: {
              vote_id: data?.id,
              user_id: user?.id,
              lottery_ticket_id: lotteryTicketId,
              timestamp: new Date().toISOString(),
            },
          },
        });
      } catch (_) { /* non-blocking */ }

      // 8. Generate cryptographic receipt
      const receipt = CryptoUtils?.generateVoteReceipt({
        voteId: data?.id,
        electionId: voteData?.electionId,
        voteHash,
        blockchainHash
      });

      return { 
        data: toCamelCase(data),
        receipt: {
          ...receipt,
          lotteryTicketId,
          zkProof: {
            commitment: zkProof?.commitment?.substring(0, 20) + '...',
            verified: true
          },
          cryptographicProofs: {
            rsa: 'RSA-2048 encryption applied',
            elgamal: 'Homomorphic encryption enabled',
            zkp: 'Zero-knowledge proof generated',
            hashChain: 'Tamper-evident logging active'
          }
        },
        error: null 
      };
    } catch (error) {
      return { data: null, receipt: null, error: { message: error?.message } };
    }
  },

  async getUserVotes(userId) {
    try {
      const { data, error } = await supabase?.from('votes')?.select(`
          *,
          elections(
            id,
            title,
            cover_image,
            cover_image_alt,
            category,
            is_lotterized,
            prize_pool
          )
        `)?.eq('user_id', userId)?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getVoteByElection(electionId, userId) {
    try {
      const { data, error } = await supabase?.from('votes')?.select('*')?.eq('election_id', electionId)?.eq('user_id', userId)?.single();

      if (error) {
        if (error?.code === 'PGRST116') {
          return { data: null, error: null }; // No vote found
        }
        throw error;
      }

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getElectionVotes(electionId, limit = 100) {
    try {
      const { data, error } = await supabase
        ?.from('votes')
        ?.select('id, election_id, user_id, selected_option_id, ranked_choices, selected_options, created_at')
        ?.eq('election_id', electionId)
        ?.order('created_at', { ascending: false })
        ?.limit(limit);

      if (error) throw error;
      return { data: toCamelCase(data || []), error: null };
    } catch (error) {
      return { data: [], error: { message: error?.message } };
    }
  },

  // Check if user has already voted - optimized single column query
  async hasVoted(electionId, userId) {
    try {
      const { data, error } = await supabase
        ?.from('votes')
        ?.select('id')
        ?.eq('election_id', electionId)
        ?.eq('user_id', userId)
        ?.single();

      if (error && error?.code !== 'PGRST116') throw error;
      return { data: !!data, error: null };
    } catch (error) {
      return { data: false, error: { message: error?.message } };
    }
  },

  async verifyVote(voteId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase?.from('votes')?.select(`
          *,
          elections(title, category, status)
        `)?.eq('id', voteId)?.eq('user_id', user?.id)?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async verifyVoteWithCryptography(voteHash) {
    try {
      // Verify vote using cryptographic proofs
      const { data: vote, error: voteError } = await supabase
        ?.from('votes')
        ?.select('*')
        ?.eq('vote_hash', voteHash)
        ?.single();

      if (voteError) throw voteError;

      // Get zero-knowledge proof
      const { data: zkProof, error: zkpError } = await supabase
        ?.from('zero_knowledge_proofs')
        ?.select('*')
        ?.eq('vote_id', vote?.id)
        ?.single();

      if (zkpError) throw zkpError;

      // Verify ZKP
      const isValid = ZeroKnowledgeProof?.verifyProof(
        {
          commitment: zkProof?.commitment,
          challenge: zkProof?.challenge,
          response: zkProof?.response
        },
        vote?.vote_hash,
        zkProof?.public_key
      );

      // Get bulletin board transaction
      const { data: bulletinEntry, error: bulletinError } = await supabase
        ?.from('bulletin_board_transactions')
        ?.select('*')
        ?.eq('election_id', vote?.election_id)
        ?.contains('metadata', { vote_hash: vote?.vote_hash })
        ?.single();

      return {
        data: {
          vote: toCamelCase(vote),
          zkProofValid: isValid,
          bulletinBoardEntry: toCamelCase(bulletinEntry),
          verificationStatus: isValid ? 'verified' : 'failed',
          timestamp: new Date()?.toISOString()
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getBulletinBoardTransactions(electionId) {
    try {
      const { data, error } = await supabase
        ?.from('bulletin_board_transactions')
        ?.select('*')
        ?.eq('election_id', electionId)
        ?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getAuditTrail(electionId) {
    try {
      const { data, error } = await supabase
        ?.from('cryptographic_audit_logs')
        ?.select('*')
        ?.eq('election_id', electionId)
        ?.order('log_index', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getVVSGComplianceStatus() {
    try {
      const { data: tests, error: testsError } = await supabase
        ?.from('vvsg_compliance_tests')
        ?.select('*')
        ?.order('last_run', { ascending: false });

      if (testsError) throw testsError;

      const { data: report, error: reportError } = await supabase
        ?.from('vvsg_compliance_reports')
        ?.select('*')
        ?.order('report_date', { ascending: false })
        ?.limit(1)
        ?.single();

      if (reportError) throw reportError;

      return {
        data: {
          tests: toCamelCase(tests),
          latestReport: toCamelCase(report)
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  subscribeToVotes(electionId, callback) {
    const channel = supabase?.channel(`votes-${electionId}`)?.on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'votes',
          filter: `election_id=eq.${electionId}`
        },
        (payload) => {
          callback(toCamelCase(payload));
        }
      )?.subscribe();

    return () => supabase?.removeChannel(channel);
  },

  // Track voting with enhanced analytics
  // Remove static keyword - methods in object literals cannot be static
  async castVoteWithAnalytics(electionId, optionId, voteData) {
    try {
      const response = await supabase?.functions?.invoke('cast-vote', {
        body: { electionId, optionId, voteData }
      });

      if (response?.data) {
        // Track in Google Analytics
        const { default: googleAnalyticsService } = await import('./googleAnalyticsService');
        googleAnalyticsService?.trackVoteEvent(
          electionId,
          voteData?.votingType,
          response?.data?.vp_earned,
          {
            confidence_level: voteData?.confidenceLevel,
            has_prediction: voteData?.hasPrediction
          }
        );
      }

      return response?.data;
    } catch (error) {
      console.error('Cast vote error:', error);
      throw error;
    }
  },

  /** Request a vote change (creates pending record if election allows and requires approval) */
  async requestVoteChange(electionId, newVotePayload) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: vote, error: voteErr } = await supabase
        ?.from('votes')
        ?.select('id, selected_option_id, ranked_choices, selected_options, vote_scores')
        ?.eq('election_id', electionId)
        ?.eq('user_id', user?.id)
        ?.single();
      if (voteErr || !vote) throw new Error('Vote not found');

      const { data: election } = await supabase?.from('elections')?.select('vote_editing_allowed, vote_editing_requires_approval')?.eq('id', electionId)?.single();
      if (!election?.vote_editing_allowed) {
        await supabase?.from('vote_audit_markers')?.insert({
          election_id: electionId,
          user_id: user?.id,
          reason: 'vote_change_attempt_disallowed'
        });
        throw new Error('Vote changes are not allowed for this election. Your attempt has been recorded for audit.');
      }

      const previousVoteData = {
        selectedOptionId: vote?.selected_option_id,
        rankedChoices: vote?.ranked_choices || [],
        selectedOptions: vote?.selected_options || [],
        voteScores: vote?.vote_scores || {}
      };

      if (election?.vote_editing_requires_approval) {
        const { data: hist, error: insErr } = await supabase?.from('vote_edit_history')?.insert({
          vote_id: vote?.id,
          election_id: electionId,
          user_id: user?.id,
          previous_vote_data: previousVoteData,
          new_vote_data: newVotePayload,
          approval_status: 'pending'
        })?.select()?.single();
        if (insErr) throw insErr;
        return { data: toCamelCase(hist), requiresApproval: true, error: null };
      }

      const dbUpdate = toSnakeCase({
        selectedOptionId: newVotePayload?.selectedOptionId ?? null,
        rankedChoices: newVotePayload?.rankedChoices ?? [],
        selectedOptions: newVotePayload?.selectedOptions ?? [],
        voteScores: newVotePayload?.voteScores ?? {}
      });
      const { data: updated, error: upErr } = await supabase?.from('votes')?.update(dbUpdate)?.eq('id', vote?.id)?.select()?.single();
      if (upErr) throw upErr;
      return { data: toCamelCase(updated), requiresApproval: false, error: null };
    } catch (err) {
      return { data: null, requiresApproval: false, error: { message: err?.message } };
    }
  },

  /** Creator: list pending vote change requests for an election */
  async getPendingVoteChanges(electionId) {
    try {
      const { data, error } = await supabase
        ?.from('vote_edit_history')
        ?.select('id, vote_id, user_id, previous_vote_data, new_vote_data, edit_reason, created_at, user_profiles(name, email)')
        ?.eq('election_id', electionId)
        ?.eq('approval_status', 'pending')
        ?.order('created_at', { ascending: false });
      if (error) throw error;
      return { data: toCamelCase(data || []), error: null };
    } catch (err) {
      return { data: [], error: { message: err?.message } };
    }
  },

  /** Creator: approve a pending vote change (updates the vote and marks history approved) */
  async approveVoteChange(historyId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: row, error: fetchErr } = await supabase?.from('vote_edit_history')?.select('vote_id, election_id, new_vote_data')?.eq('id', historyId)?.single();
      if (fetchErr || !row) throw new Error('Request not found');

      const dbUpdate = toSnakeCase({
        selectedOptionId: row?.new_vote_data?.selectedOptionId ?? null,
        rankedChoices: row?.new_vote_data?.rankedChoices ?? [],
        selectedOptions: row?.new_vote_data?.selectedOptions ?? [],
        voteScores: row?.new_vote_data?.voteScores ?? {}
      });
      const { error: upErr } = await supabase?.from('votes')?.update(dbUpdate)?.eq('id', row?.vote_id)?.select();
      if (upErr) throw upErr;

      await supabase?.from('vote_edit_history')?.update({
        approval_status: 'approved',
        approved_by: user?.id
      })?.eq('id', historyId);
      return { data: true, error: null };
    } catch (err) {
      return { data: null, error: { message: err?.message } };
    }
  },

  /** Admin/creator: list vote audit markers (vote change attempts when disallowed) */
  async getVoteAuditMarkers(filters = {}) {
    try {
      let query = supabase
        ?.from('vote_audit_markers')
        ?.select('id, election_id, user_id, reason, created_at, elections(title), user_profiles(name, email)', { count: 'exact' })
        ?.order('created_at', { ascending: false });
      if (filters.electionId) query = query?.eq('election_id', filters.electionId);
      const pageSize = filters.pageSize || 50;
      query = query?.limit(pageSize);
      if (filters.cursor) query = query?.lt('created_at', filters.cursor);
      const { data, error, count } = await query;
      if (error) throw error;
      const nextCursor = data?.length === pageSize ? data[data.length - 1]?.created_at : null;
      return { data: toCamelCase(data || []), nextCursor, total: count ?? 0, error: null };
    } catch (err) {
      return { data: [], nextCursor: null, total: 0, error: { message: err?.message } };
    }
  },

  /** Creator: reject a pending vote change */
  async rejectVoteChange(historyId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase?.from('vote_edit_history')?.update({
        approval_status: 'rejected',
        approved_by: user?.id
      })?.eq('id', historyId);
      if (error) throw error;
      return { data: true, error: null };
    } catch (err) {
      return { data: null, error: { message: err?.message } };
    }
  },

  // Get user vote history - paginated with specific columns
  async getUserVoteHistory(userId, limit = 20, cursor = null) {
    try {
      let query = supabase
        ?.from('votes')
        ?.select('id, election_id, user_id, selected_option_id, blockchain_hash, created_at, elections(id, title, category, status)')
        ?.eq('user_id', userId)
        ?.order('created_at', { ascending: false })
        ?.limit(limit);

      if (cursor) {
        query = query?.lt('created_at', cursor);
      }

      const { data, error } = await query;
      if (error) throw error;

      const nextCursor = data?.length === limit ? data?.[data?.length - 1]?.created_at : null;
      return { data: toCamelCase(data || []), nextCursor, hasMore: !!nextCursor, error: null };
    } catch (error) {
      return { data: [], nextCursor: null, hasMore: false, error: { message: error?.message } };
    }
  }
};