import { supabase } from '../lib/supabase';
import { eventBus, EVENTS } from '../lib/eventBus';
import { normalizeVotingType } from '../lib/votingTypeUtils';


// Convert snake_case to camelCase
const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toCamelCase);

  return Object.keys(obj)?.reduce((acc, key) => {
    const camelKey = key?.replace(/_([a-z])/g, (_, letter) => letter?.toUpperCase());
    let value = toCamelCase(obj?.[key]);
    
    // Standardize voting type at the source
    if (camelKey === 'votingType' && typeof value === 'string') {
      value = normalizeVotingType(value);
    }
    
    acc[camelKey] = value;
    return acc;
  }, {});
};

// Convert camelCase to snake_case
const toSnakeCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toSnakeCase);

  return Object.keys(obj)?.reduce((acc, key) => {
    const snakeKey = key?.replace(/[A-Z]/g, letter => `_${letter?.toLowerCase()}`);
    acc[snakeKey] = toSnakeCase(obj?.[key]);
    return acc;
  }, {});
};

export const electionsService = {
  async getAll(filters = {}) {
    try {
      // Use a simple select without FK hint — Supabase auto-resolves the join.
      // An incorrect FK hint causes the entire query to hang or error silently.
      let query = supabase?.from('elections')?.select(`
          *,
          election_options(*),
          user_profiles(name, username, avatar)
        `)?.order('created_at', { ascending: false });

      if (filters?.status) {
        query = query?.eq('status', filters?.status);
      }

      if (filters?.category) {
        query = query?.eq('category', filters?.category);
      }

      if (filters?.votingType) {
        query = query?.eq('voting_type', filters?.votingType);
      }

      // Cursor-based pagination
      if (filters?.cursor) {
        query = query?.lt('created_at', filters?.cursor);
      }
      const pageSize = filters?.pageSize || 20;
      query = query?.limit(pageSize);

      const { data, error } = await query;
      if (error) throw error;

      const camelData = toCamelCase(data);
      const nextCursor = camelData?.length === pageSize ? camelData?.[camelData?.length - 1]?.createdAt : null;

      return { data: camelData, nextCursor, hasMore: !!nextCursor, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getById(electionId) {
    try {
      const { data, error } = await supabase?.from('elections')?.select(`
          *,
          election_options(*),
          user_profiles(name, username, avatar, verified)
        `)?.eq('id', electionId)?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async create(electionData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const uniqueElectionId = `ELEC-${new Date()?.getFullYear()}-${Math.floor(Math.random() * 999999)?.toString()?.padStart(6, '0')}`;
      const electionUrl = `https://vottery.com/vote/${uniqueElectionId}`;

      const dbData = toSnakeCase({
        ...electionData,
        createdBy: user?.id,
        uniqueElectionId,
        electionUrl,
        qrCodeData: electionUrl
      });

      const { data, error } = await supabase?.from('elections')?.insert(dbData)?.select()?.single();

      if (error) throw error;

      // Emit election_created event
      eventBus.emit(EVENTS.ELECTION_CREATED, {
        id: data?.id,
        title: data?.title,
        userId: user?.id,
        category: data?.category,
        isLotterized: data?.is_lotterized
      });

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async update(electionId, updates) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: existing } = await supabase?.from('elections')?.select('vote_count, created_by, show_live_results, live_results_locked_at')?.eq('id', electionId)?.single();
      if (!existing) throw new Error('Election not found');
      if (existing?.created_by !== user?.id) throw new Error('Only the creator can update this election');

      const hasVotes = (existing?.vote_count || 0) > 0;
      let allowedUpdates = { ...updates };

      if (hasVotes) {
        const allowedKeys = new Set([
          'endDate', 'end_date', 'showLiveResults', 'show_live_results', 'liveResultsLockedAt', 'live_results_locked_at',
          'creatorCanSeeTotals', 'creator_can_see_totals',
          'rewardAmount', 'reward_amount', 'prizeAmount', 'prize_amount', 'prizePool', 'prize_pool',
          'voteVisibility', 'vote_visibility', 'voteVisibilityChangedAt', 'vote_visibility_changed_at'
        ]);
        allowedUpdates = Object.keys(updates).reduce((acc, key) => {
          const snake = key?.replace(/[A-Z]/g, l => `_${l?.toLowerCase()}`);
          if (allowedKeys.has(key) || allowedKeys.has(snake)) acc[key] = updates[key];
          return acc;
        }, {});

        // LIVE RESULTS VISIBILITY RULES
        // 1. Once showLiveResults is TRUE, it cannot be set back to FALSE
        if (existing?.show_live_results === true && (allowedUpdates?.showLiveResults === false || allowedUpdates?.show_live_results === false)) {
          delete allowedUpdates.showLiveResults;
          delete allowedUpdates.show_live_results;
        }

        // 2. Once voteVisibility is 'visible', it cannot be set back to 'hidden'
        if (existing?.vote_visibility === 'visible' && (allowedUpdates?.voteVisibility === 'hidden' || allowedUpdates?.vote_visibility === 'hidden')) {
          delete allowedUpdates.voteVisibility;
          delete allowedUpdates.vote_visibility;
        }

        if (allowedUpdates?.showLiveResults === true || allowedUpdates?.show_live_results === true) {
          if (!existing?.live_results_locked_at) {
            allowedUpdates.liveResultsLockedAt = new Date().toISOString();
          }
        }
      }

      const dbData = toSnakeCase(allowedUpdates);
      const { data, error } = await supabase?.from('elections')?.update(dbData)?.eq('id', electionId)?.eq('created_by', user?.id)?.select()?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async delete(electionId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: row } = await supabase?.from('elections')?.select('vote_count, created_by')?.eq('id', electionId)?.single();
      if (row?.created_by !== user?.id) throw new Error('Only the creator can delete this election');
      if ((row?.vote_count || 0) > 0) throw new Error('Cannot delete election after voting has started. You can only extend the end date (max 6 months).');

      const { error } = await supabase?.from('elections')?.delete()?.eq('id', electionId)?.eq('created_by', user?.id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  },

  /**
   * Clone/Copy an election – creates a new draft with same config, questions, options.
   * Votes and winners are not copied.
   */
  async clone(electionId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: source, error: fetchError } = await supabase
        ?.from('elections')
        ?.select('*, election_options(*)')
        ?.eq('id', electionId)
        ?.single();

      if (fetchError || !source) throw new Error('Election not found');

      if (source?.created_by !== user?.id) throw new Error('Only the creator can clone this election');

      const uniqueElectionId = `ELEC-${new Date()?.getFullYear()}-${Math.floor(Math.random() * 999999)?.toString()?.padStart(6, '0')}`;
      const electionUrl = `https://vottery.com/vote/${uniqueElectionId}`;

      const { id: _id, created_at, updated_at, vote_count, status, unique_election_id, election_url, qr_code_data, ...clonePayload } = source;
      const newElection = {
        ...clonePayload,
        created_by: user?.id,
        unique_election_id: uniqueElectionId,
        election_url: electionUrl,
        qr_code_data: electionUrl,
        status: 'draft',
        vote_count: 0,
        title: `${source?.title || 'Election'} (Copy)`,
        winner_notifications: null,
        winners_announced: false,
      };

      const { data: created, error: createError } = await supabase
        ?.from('elections')
        ?.insert(newElection)
        ?.select()
        ?.single();

      if (createError) throw createError;

      const options = source?.election_options || [];
      if (options?.length > 0) {
        const newOptions = options?.map(o => {
          const { id, election_id, ...opt } = o;
          return { ...opt, election_id: created?.id };
        });
        await supabase?.from('election_options')?.insert(newOptions);
      }

      return { data: toCamelCase(created), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  /** Clone as run-off with only the given option IDs (creator only). */
  async cloneRunoff(electionId, optionIds = []) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: source, error: fetchError } = await supabase
        ?.from('elections')
        ?.select('*, election_options(*)')
        ?.eq('id', electionId)
        ?.single();

      if (fetchError || !source) throw new Error('Election not found');
      if (source?.created_by !== user?.id) throw new Error('Only the creator can create a run-off');

      const allOptions = source?.election_options || [];
      const idsSet = new Set(optionIds?.map(String) || []);
      const optionsToClone = idsSet?.size > 0 ? allOptions?.filter(o => idsSet?.has(String(o?.id))) : allOptions;
      if (optionsToClone?.length === 0) throw new Error('No options selected for run-off');

      const uniqueElectionId = `ELEC-${new Date()?.getFullYear()}-${Math.floor(Math.random() * 999999)?.toString()?.padStart(6, '0')}`;
      const electionUrl = `https://vottery.com/vote/${uniqueElectionId}`;

      const { id: _id, created_at, updated_at, vote_count, status, unique_election_id, election_url, qr_code_data, election_options, ...clonePayload } = source;
      const newElection = {
        ...clonePayload,
        created_by: user?.id,
        unique_election_id: uniqueElectionId,
        election_url: electionUrl,
        qr_code_data: electionUrl,
        status: 'draft',
        vote_count: 0,
        title: `Run-off: ${source?.title || 'Election'}`,
        winner_notifications: null,
        winners_announced: false,
      };

      const { data: created, error: createError } = await supabase
        ?.from('elections')
        ?.insert(newElection)
        ?.select()
        ?.single();

      if (createError) throw createError;

      const newOptions = optionsToClone?.map(o => {
        const { id, election_id, ...opt } = o;
        return { ...opt, election_id: created?.id, vote_count: 0 };
      });
      if (newOptions?.length > 0) {
        await supabase?.from('election_options')?.insert(newOptions);
      }

      return { data: toCamelCase(created), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getUserElections(userId) {
    try {
      const { data, error } = await supabase?.from('elections')?.select('*')?.eq('created_by', userId)?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getAdminControls() {
    try {
      const { data, error } = await supabase?.from('admin_participation_controls')?.select('*');
      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async updateAdminControl(featureName, updates) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbData = toSnakeCase({ ...updates, updatedBy: user?.id });

      const { data, error } = await supabase?.from('admin_participation_controls')?.update(dbData)?.eq('feature_name', featureName)?.select()?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async selectWinners(electionId, numberOfWinners) {
    try {
      const { data: votes, error: votesError } = await supabase?.from('votes')?.select('id, user_id, lottery_ticket_id, user_profiles!votes_user_id_fkey(name, username, avatar)')?.eq('election_id', electionId)?.not('lottery_ticket_id', 'is', null);

      if (votesError) throw votesError;
      if (!votes || votes?.length === 0) throw new Error('No votes found for this election');

      const shuffled = votes?.sort(() => 0.5 - Math.random());
      const winners = shuffled?.slice(0, numberOfWinners);

      const winnerNotifications = winners?.map((winner, index) => ({
        rank: index + 1,
        userId: winner?.user_id,
        userName: winner?.user_profiles?.name,
        userAvatar: winner?.user_profiles?.avatar,
        lotteryTicketId: winner?.lottery_ticket_id,
        selectedAt: new Date()?.toISOString()
      }));

      const { data, error } = await supabase?.from('elections')?.update({
        winner_notifications: winnerNotifications,
        winners_announced: true
      })?.eq('id', electionId)?.select()?.single();

      if (error) throw error;
      return { data: toCamelCase(data), winners: winnerNotifications, error: null };
    } catch (error) {
      return { data: null, winners: null, error: { message: error?.message } };
    }
  },

  async getElectionWinners(electionId) {
    try {
      const { data, error } = await supabase?.from('election_winners')?.select(`
          *,
          election_options(*),
          user_profiles(*)
        `)?.eq('election_id', electionId)?.order('rank_position', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async announceWinners(electionId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase?.rpc('calculate_election_winners', {
        p_election_id: electionId
      });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async selectLotteryWinners(electionId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase?.rpc('select_lottery_winners', {
        p_election_id: electionId
      });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getPrizeDistributions(status = 'all') {
    try {
      let query = supabase?.from('prize_distributions')?.select(`
          *,
          elections(id, title, created_by),
          user_profiles(*),
          election_winners(*)
        `)?.order('created_at', { ascending: false });

      if (status !== 'all') {
        query = query?.eq('distribution_status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async updatePrizeDistribution(distributionId, updates) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbData = toSnakeCase(updates);

      const { data, error } = await supabase?.from('prize_distributions')?.update(dbData)?.eq('id', distributionId)?.select()?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Permission check: can edit/delete only if no votes
  async canEditElection(electionId) {
    try {
      const { data, error } = await supabase
        ?.from('elections')
        ?.select('id, vote_count, created_by')
        ?.eq('id', electionId)
        ?.single();
      if (error) throw error;
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user || data?.created_by !== user?.id) return { canEdit: false, reason: 'Not the creator' };
      if ((data?.vote_count || 0) > 0) return { canEdit: false, reason: 'Cannot edit after voting has started' };
      return { canEdit: true, reason: null };
    } catch (error) {
      return { canEdit: false, reason: error?.message };
    }
  },

  // Extend election end date (max 6 months from now)
  async extendEndDate(electionId, newEndDate) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const maxDate = new Date();
      maxDate?.setMonth(maxDate?.getMonth() + 6);
      const requestedDate = new Date(newEndDate);

      if (requestedDate > maxDate) {
        return { data: null, error: { message: 'End date cannot be more than 6 months from today' } };
      }

      // Verify creator and that election exists
      const { data: election, error: fetchError } = await supabase
        ?.from('elections')
        ?.select('id, created_by, end_date')
        ?.eq('id', electionId)
        ?.single();

      if (fetchError) throw fetchError;
      if (election?.created_by !== user?.id) throw new Error('Only the creator can extend the end date');

      const { data, error } = await supabase
        ?.from('elections')
        ?.update({ end_date: requestedDate?.toISOString(), updated_at: new Date()?.toISOString() })
        ?.eq('id', electionId)
        ?.eq('created_by', user?.id)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Trigger refunds for all completed participation fee transactions
   * for a given election by calling the refund-election-participation-fees
   * Edge Function. Intended to be used when an election is canceled or fails.
   */
  async refundParticipationFees(electionId, { reason = 'canceled' } = {}) {
    try {
      if (!electionId) throw new Error('electionId is required');

      const { data, error } = await supabase.functions.invoke('refund-election-participation-fees', {
        body: { electionId, reason },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Admin-only: cancel an election and trigger participation fee refunds.
   * Sets status to 'canceled' and then calls the refund-election-participation-fees
   * Edge Function via refundParticipationFees.
   */
  async cancelElectionAndRefund(electionId, { reason = 'canceled' } = {}) {
    try {
      if (!electionId) throw new Error('electionId is required');

      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      // Ensure caller is admin/manager
      const { data: profile, error: profileError } = await supabase
        ?.from('user_profiles')
        ?.select('role')
        ?.eq('id', user?.id)
        ?.single();

      if (profileError || !profile || !['admin', 'manager'].includes(profile?.role)) {
        throw new Error('Only admins can cancel elections');
      }

      const { data: election, error: updateError } = await supabase
        ?.from('elections')
        ?.update({
          status: 'canceled',
          updated_at: new Date()?.toISOString()
        })
        ?.eq('id', electionId)
        ?.select()
        ?.single();

      if (updateError) throw updateError;

      const refundResult = await electionsService.refundParticipationFees(electionId, { reason });
      if (refundResult?.error) {
        throw new Error(refundResult?.error?.message || 'Refund failed');
      }

      // Emit admin_election_rejected/canceled event (Admin Action)
      eventBus.emit(EVENTS.ADMIN_ELECTION_REJECTED, {
        entityId: electionId,
        entityType: 'election',
        description: `Election was canceled and refunded: ${reason}`,
        severity: 'critical',
        metadata: { reason, refundId: refundResult?.data?.id }
      });


      return {
        data: {
          election: toCamelCase(election),
          refund: refundResult?.data
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Edit prize amount (allowed even after voting starts)
  async editPrizeAmount(electionId, prizeData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const updates = {};
      if (prizeData?.prizePool !== undefined) updates.prize_pool = prizeData?.prizePool;
      if (prizeData?.prizeType !== undefined) updates.prize_type = prizeData?.prizeType;
      if (prizeData?.voucherDescription !== undefined) updates.voucher_description = prizeData?.voucherDescription;
      if (prizeData?.projectedRevenue !== undefined) updates.projected_revenue = prizeData?.projectedRevenue;
      updates.updated_at = new Date()?.toISOString();

      const { data, error } = await supabase
        ?.from('elections')
        ?.update(updates)
        ?.eq('id', electionId)
        ?.eq('created_by', user?.id)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Pause high-risk elections during load threshold events
   * Called automatically by load testing suite when concurrent users exceed 750K
   */
  async pauseHighRiskElections({ reason = 'manual', concurrentUsers = 0 } = {}) {
    try {
      const { data, error } = await supabase
        ?.from('elections')
        ?.update({
          status: 'paused',
          pause_reason: reason,
          paused_at: new Date()?.toISOString(),
          pause_metadata: { concurrentUsers, autoTriggered: true, triggeredAt: new Date()?.toISOString() }
        })
        ?.eq('status', 'active')
        ?.eq('is_high_risk', true)
        ?.select();

      if (error) {
        // Graceful fallback — log but don't throw
        console.warn('[ElectionsService] pauseHighRiskElections:', error?.message);
        return { data: null, error };
      }

      console.info(`[ElectionsService] Paused ${data?.length || 0} high-risk elections. Reason: ${reason}`);

      // Emit admin_config_changed event for system-wide pause
      eventBus.emit(EVENTS.ADMIN_CONFIG_CHANGED, {
        description: `High-risk elections paused due to load: ${reason}`,
        entityType: 'system_configuration',
        severity: 'high',
        metadata: { concurrentUsers, electionCount: data?.length }
      });

      return { data, error: null };

    } catch (err) {
      console.warn('[ElectionsService] pauseHighRiskElections failed:', err?.message);
      return { data: null, error: { message: err?.message } };
    }
  },

  subscribeToElections(callback) {
    const channel = supabase?.channel('elections-changes')?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'elections' },
        (payload) => {
          callback(toCamelCase(payload));
        }
      )?.subscribe();

    return () => supabase?.removeChannel(channel);
  }
};