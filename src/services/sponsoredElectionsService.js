import { supabase } from '../lib/supabase';

export const sponsoredElectionsService = {
  // Create sponsored election
  async createSponsoredElection(electionId, sponsoredData) {
    const { data, error } = await supabase?.from('sponsored_elections')?.insert({
        election_id: electionId,
        brand_id: sponsoredData?.brandId,
        ad_format_type: sponsoredData?.adFormatType,
        budget_total: sponsoredData?.budgetTotal,
        cost_per_vote: sponsoredData?.costPerVote,
        reward_multiplier: sponsoredData?.rewardMultiplier || 2.0,
        target_audience_tags: sponsoredData?.targetAudienceTags || [],
        zone_targeting: sponsoredData?.zoneTargeting || [],
        auction_bid_amount: sponsoredData?.auctionBidAmount,
        frequency_cap: sponsoredData?.frequencyCap || 3,
        conversion_pixel_url: sponsoredData?.conversionPixelUrl
      })?.select()?.single();

    if (error) throw error;
    return data;
  },

  // Get sponsored election by ID
  async getSponsoredElection(electionId) {
    const { data, error } = await supabase?.from('sponsored_elections')?.select(`
        *,
        election:elections(*),
        brand:user_profiles!brand_id(*)
      `)?.eq('election_id', electionId)?.single();

    if (error && error?.code !== 'PGRST116') throw error;
    return data;
  },

  // Get brand's sponsored elections
  async getBrandSponsoredElections(brandId) {
    const { data, error } = await supabase?.from('sponsored_elections')?.select(`*,election:elections(*)`)?.eq('brand_id', brandId)?.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get all active sponsored elections
  async getActiveSponsoredElections() {
    const { data, error } = await supabase?.from('sponsored_elections')?.select(`*,election:elections(*)`)?.eq('status', 'ACTIVE')?.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Update sponsored election
  async updateSponsoredElection(id, updates) {
    const { data, error } = await supabase?.from('sponsored_elections')?.update({
        ...updates,
        updated_at: new Date()?.toISOString()
      })?.eq('id', id)?.select()?.single();

    if (error) throw error;
    return data;
  },

  // Pause/Resume sponsored election
  async toggleSponsoredElectionStatus(id, status) {
    return this.updateSponsoredElection(id, { status });
  },

  // Get CPE pricing zones
  async getCPEPricingZones() {
    const { data, error } = await supabase?.from('cpe_pricing_zones')?.select('*')?.order('purchasing_power_index', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Calculate recommended CPE for zone
  async getRecommendedCPE(zoneCode, adFormatType) {
    const { data, error } = await supabase?.from('cpe_pricing_zones')?.select('*')?.eq('zone_code', zoneCode)?.single();

    if (error) throw error;

    let formatMultiplier = 1.0;
    switch (adFormatType) {
      case 'MARKET_RESEARCH':
        formatMultiplier = 1.2; // Higher value for market research
        break;
      case 'HYPE_PREDICTION':
        formatMultiplier = 1.0;
        break;
      case 'CSR':
        formatMultiplier = 0.8; // Lower cost for CSR campaigns
        break;
    }

    return {
      zone: data,
      recommendedCPE: (data?.base_cpe * data?.premium_multiplier * formatMultiplier)?.toFixed(2)
    };
  },

  // Get revenue report for sponsored election
  async getRevenueReport(electionId) {
    const { data: sponsored, error: sponsoredError } = await supabase?.from('sponsored_elections')?.select(`
        *,
        election:elections(title, created_at)
      `)?.eq('election_id', electionId)?.single();

    if (sponsoredError) throw sponsoredError;

    const { data: votes, error: votesError } = await supabase?.from('votes')?.select('created_at')?.eq('election_id', electionId);

    if (votesError) throw votesError;

    const engagementRate = sponsored?.total_impressions > 0
      ? (sponsored?.total_engagements / sponsored?.total_impressions * 100)?.toFixed(2)
      : 0;

    const roi = sponsored?.budget_spent > 0
      ? ((sponsored?.generated_revenue - sponsored?.budget_spent) / sponsored?.budget_spent * 100)?.toFixed(2)
      : 0;

    return {
      ...sponsored,
      totalVotes: votes?.length || 0,
      engagementRate: parseFloat(engagementRate),
      roi: parseFloat(roi),
      costPerEngagement: sponsored?.total_engagements > 0
        ? (sponsored?.budget_spent / sponsored?.total_engagements)?.toFixed(2)
        : 0,
      budgetRemaining: (sponsored?.budget_total - sponsored?.budget_spent)?.toFixed(2),
      budgetUtilization: ((sponsored?.budget_spent / sponsored?.budget_total) * 100)?.toFixed(2)
    };
  },

  // Get comprehensive revenue analytics
  async getRevenueAnalytics(brandId, startDate, endDate) {
    const { data, error } = await supabase?.from('sponsored_elections')?.select(`
        *,
        election:elections(title, category)
      `)?.eq('brand_id', brandId)?.gte('created_at', startDate)?.lte('created_at', endDate);

    if (error) throw error;

    const analytics = {
      totalCampaigns: data?.length || 0,
      totalSpent: 0,
      totalRevenue: 0,
      totalEngagements: 0,
      totalImpressions: 0,
      averageCPE: 0,
      averageEngagementRate: 0,
      byFormat: {
        MARKET_RESEARCH: { count: 0, revenue: 0, engagements: 0 },
        HYPE_PREDICTION: { count: 0, revenue: 0, engagements: 0 },
        CSR: { count: 0, revenue: 0, engagements: 0 }
      }
    };

    data?.forEach(campaign => {
      analytics.totalSpent += parseFloat(campaign?.budget_spent || 0);
      analytics.totalRevenue += parseFloat(campaign?.generated_revenue || 0);
      analytics.totalEngagements += campaign?.total_engagements || 0;
      analytics.totalImpressions += campaign?.total_impressions || 0;

      const format = campaign?.ad_format_type;
      if (analytics?.byFormat?.[format]) {
        analytics.byFormat[format].count++;
        analytics.byFormat[format].revenue += parseFloat(campaign?.generated_revenue || 0);
        analytics.byFormat[format].engagements += campaign?.total_engagements || 0;
      }
    });

    analytics.averageCPE = analytics?.totalEngagements > 0
      ? (analytics?.totalSpent / analytics?.totalEngagements)?.toFixed(2)
      : 0;

    analytics.averageEngagementRate = analytics?.totalImpressions > 0
      ? ((analytics?.totalEngagements / analytics?.totalImpressions) * 100)?.toFixed(2)
      : 0;

    return analytics;
  },

  // Record ad impression
  async recordImpression(sponsoredElectionId, userId) {
    // Check frequency cap
    const { data: freqCap, error: freqError } = await supabase?.from('ad_frequency_caps')?.select('*')?.eq('sponsored_election_id', sponsoredElectionId)?.eq('user_id', userId)?.single();

    if (freqError && freqError?.code !== 'PGRST116') throw freqError;

    const { data: sponsored } = await supabase?.from('sponsored_elections')?.select('frequency_cap')?.eq('id', sponsoredElectionId)?.single();

    if (freqCap && freqCap?.impression_count >= (sponsored?.frequency_cap || 3)) {
      return { shown: false, reason: 'frequency_cap_reached' };
    }

    // Update or insert frequency cap
    await supabase?.from('ad_frequency_caps')?.upsert({
        sponsored_election_id: sponsoredElectionId,
        user_id: userId,
        impression_count: (freqCap?.impression_count || 0) + 1,
        last_shown_at: new Date()?.toISOString()
      });

    // Update sponsored election impressions
    await supabase?.from('sponsored_elections')?.update({
        total_impressions: supabase?.raw('total_impressions + 1')
      })?.eq('id', sponsoredElectionId);

    return { shown: true };
  },

  // Get ad format statistics
  async getAdFormatStatistics() {
    const { data, error } = await supabase?.from('sponsored_elections')?.select('ad_format_type, total_engagements, total_impressions, generated_revenue');

    if (error) throw error;

    const stats = {
      MARKET_RESEARCH: { campaigns: 0, engagements: 0, impressions: 0, revenue: 0 },
      HYPE_PREDICTION: { campaigns: 0, engagements: 0, impressions: 0, revenue: 0 },
      CSR: { campaigns: 0, engagements: 0, impressions: 0, revenue: 0 }
    };

    data?.forEach(campaign => {
      const format = campaign?.ad_format_type;
      if (stats?.[format]) {
        stats[format].campaigns++;
        stats[format].engagements += campaign?.total_engagements || 0;
        stats[format].impressions += campaign?.total_impressions || 0;
        stats[format].revenue += parseFloat(campaign?.generated_revenue || 0);
      }
    });

    return stats;
  }
};