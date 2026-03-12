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

export const creatorBrandPartnershipService = {
  // Brand Discovery
  async discoverOpportunities(filters = {}) {
    try {
      let query = supabase?.from('partnership_opportunities')?.select(`
          *,
          brand_profiles!inner(*)
        `)?.eq('status', 'active');

      if (filters?.industry) {
        query = query?.eq('brand_profiles.industry', filters?.industry);
      }

      if (filters?.contentType) {
        query = query?.eq('content_type', filters?.contentType);
      }

      if (filters?.minBudget) {
        query = query?.gte('budget_min', filters?.minBudget);
      }

      const { data, error } = await query?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error discovering opportunities:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async getOpportunityDetails(opportunityId) {
    try {
      const { data, error } = await supabase?.from('partnership_opportunities')?.select(`
          *,
          brand_profiles(*)
        `)?.eq('id', opportunityId)?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error getting opportunity details:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Proposal Workflows
  async submitProposal(proposalData) {
    try {
      const { data: opportunity } = await supabase?.from('partnership_opportunities')?.select('brand_id')?.eq('id', proposalData?.opportunityId)?.single();

      const { data, error } = await supabase?.from('partnership_proposals')?.insert(toSnakeCase({
          ...proposalData,
          brandId: opportunity?.brand_id,
          status: 'pending'
        }))?.select()?.single();

      if (error) throw error;

      // Update applications count
      await supabase?.from('partnership_opportunities')?.update({ applications_count: supabase?.raw('applications_count + 1') })?.eq('id', proposalData?.opportunityId);

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error submitting proposal:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async getCreatorProposals(creatorId) {
    try {
      const { data, error } = await supabase?.from('partnership_proposals')?.select(`
          *,
          partnership_opportunities(*),
          brand_profiles(*)
        `)?.eq('creator_id', creatorId)?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error getting creator proposals:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async getBrandProposals(brandId) {
    try {
      const { data, error } = await supabase?.from('partnership_proposals')?.select(`
          *,
          partnership_opportunities(*),
          user_profiles!partnership_proposals_creator_id_fkey(*)
        `)?.eq('brand_id', brandId)?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error getting brand proposals:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async updateProposalStatus(proposalId, status, brandResponse = null) {
    try {
      const updateData = {
        status,
        responded_at: new Date()?.toISOString()
      };

      if (brandResponse) {
        updateData.brand_response = brandResponse;
      }

      const { data, error } = await supabase?.from('partnership_proposals')?.update(toSnakeCase(updateData))?.eq('id', proposalId)?.select()?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error updating proposal status:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Revenue Share Negotiations
  async proposeRevenueShare(negotiationData) {
    try {
      const { data, error } = await supabase?.from('revenue_share_negotiations')?.insert(toSnakeCase(negotiationData))?.select()?.single();

      if (error) throw error;

      // Update proposal status to negotiating
      await supabase?.from('partnership_proposals')?.update({ status: 'negotiating' })?.eq('id', negotiationData?.proposalId);

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error proposing revenue share:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async getNegotiations(proposalId) {
    try {
      const { data, error } = await supabase?.from('revenue_share_negotiations')?.select('*')?.eq('proposal_id', proposalId)?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error getting negotiations:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async acceptNegotiation(negotiationId) {
    try {
      const { data, error } = await supabase?.from('revenue_share_negotiations')?.update({ status: 'agreed' })?.eq('id', negotiationId)?.select()?.single();

      if (error) throw error;

      // Create contract
      const contract = await this.createContract(data);

      return { data: toCamelCase(data), contract, error: null };
    } catch (error) {
      console.error('Error accepting negotiation:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async counterOfferNegotiation(negotiationId, counterOfferData) {
    try {
      // Mark previous as counter_offered
      await supabase?.from('revenue_share_negotiations')?.update({ status: 'counter_offered' })?.eq('id', negotiationId);

      // Create new negotiation with counter offer
      const { data: previousNegotiation } = await supabase?.from('revenue_share_negotiations')?.select('*')?.eq('id', negotiationId)?.single();

      const { data, error } = await supabase?.from('revenue_share_negotiations')?.insert({
          proposal_id: previousNegotiation?.proposal_id,
          creator_id: previousNegotiation?.creator_id,
          brand_id: previousNegotiation?.brand_id,
          ...toSnakeCase(counterOfferData),
          status: 'proposed'
        })?.select()?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error counter offering:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Contract Management
  async createContract(negotiationData) {
    try {
      const contractData = {
        proposal_id: negotiationData?.proposal_id,
        negotiation_id: negotiationData?.id,
        creator_id: negotiationData?.creator_id,
        brand_id: negotiationData?.brand_id,
        contract_terms: negotiationData?.payment_terms || {},
        total_value: negotiationData?.total_budget,
        revenue_split: {
          creator: negotiationData?.creator_share_percentage,
          brand: negotiationData?.brand_share_percentage,
          platform: negotiationData?.platform_fee_percentage
        },
        deliverables: negotiationData?.milestones || [],
        start_date: new Date()?.toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)?.toISOString(), // 30 days default
        status: 'active'
      };

      const { data, error } = await supabase?.from('partnership_contracts')?.insert(contractData)?.select()?.single();

      if (error) throw error;

      // Update proposal status
      await supabase?.from('partnership_proposals')?.update({ status: 'accepted' })?.eq('id', negotiationData?.proposal_id);

      // Twilio SMS: notify creator that partnership was accepted
      const creatorId = negotiationData?.creator_id;
      if (creatorId) {
        try {
          const { data: brand } = await supabase?.from('brand_profiles')?.select('brand_name')?.eq('id', negotiationData?.brand_id)?.single();
          const { smsAlertService } = await import('./smsAlertService');
          await smsAlertService?.sendPartnershipAcceptedAlert?.(creatorId, brand?.brand_name || 'A brand');
        } catch (e) {
          console.warn('Creator SMS (partnership accepted) skipped:', e?.message);
        }
      }

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error creating contract:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async getCreatorContracts(creatorId) {
    try {
      const { data, error } = await supabase?.from('partnership_contracts')?.select(`
          *,
          brand_profiles(*),
          partnership_deliverables(*)
        `)?.eq('creator_id', creatorId)?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error getting creator contracts:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async signContract(contractId, party) {
    try {
      const updateData = party === 'creator' 
        ? { creator_signed: true, creator_signed_at: new Date()?.toISOString() }
        : { brand_signed: true, brand_signed_at: new Date()?.toISOString() };

      const { data, error } = await supabase?.from('partnership_contracts')?.update(updateData)?.eq('id', contractId)?.select()?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error signing contract:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Deliverables
  async submitDeliverable(deliverableId, submissionUrl) {
    try {
      const { data, error } = await supabase?.from('partnership_deliverables')?.update({
          status: 'submitted',
          submission_url: submissionUrl,
          submitted_at: new Date()?.toISOString()
        })?.eq('id', deliverableId)?.select()?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error submitting deliverable:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async reviewDeliverable(deliverableId, approved, reviewNotes) {
    try {
      const { data, error } = await supabase?.from('partnership_deliverables')?.update({
          status: approved ? 'approved' : 'rejected',
          review_notes: reviewNotes,
          reviewed_at: new Date()?.toISOString()
        })?.eq('id', deliverableId)?.select()?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error reviewing deliverable:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Analytics
  async getPartnershipAnalytics(creatorId) {
    try {
      const [proposals, contracts, earnings] = await Promise.all([
        supabase?.from('partnership_proposals')?.select('*')?.eq('creator_id', creatorId),
        supabase?.from('partnership_contracts')?.select('*')?.eq('creator_id', creatorId),
        supabase?.from('partnership_deliverables')?.select('payment_amount')?.eq('payment_status', 'paid')?.in('contract_id', 
            supabase?.from('partnership_contracts')?.select('id')?.eq('creator_id', creatorId)
          )
      ]);

      const totalEarnings = earnings?.data?.reduce((sum, d) => sum + (parseFloat(d?.payment_amount) || 0), 0) || 0;
      const activeContracts = contracts?.data?.filter(c => c?.status === 'active')?.length || 0;
      const pendingProposals = proposals?.data?.filter(p => p?.status === 'pending')?.length || 0;

      return {
        data: {
          totalProposals: proposals?.data?.length || 0,
          acceptedProposals: proposals?.data?.filter(p => p?.status === 'accepted')?.length || 0,
          activeContracts,
          totalEarnings,
          pendingProposals
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting partnership analytics:', error);
      return { data: null, error: { message: error?.message } };
    }
  }
};