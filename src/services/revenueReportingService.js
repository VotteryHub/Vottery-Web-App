import { supabase } from '../lib/supabase';

/**
 * Revenue Reporting Service
 * Implements SQL queries for brand ROI calculations and participatory advertising metrics
 */

class RevenueReportingService {
  /**
   * Query 1: Calculate Total Revenue and Engagement Metrics per Sponsored Election
   * Returns: brand_id, election_title, unit_price, total_engagements, generated_revenue, engagement_rate
   */
  async getSponsoredElectionRevenue(brandId = null) {
    try {
      let query = `
        SELECT 
          se.brand_id,
          se.id as sponsored_election_id,
          e.title AS election_title,
          se.cost_per_vote AS unit_price,
          se.total_engagements,
          se.budget_spent AS generated_revenue,
          ROUND((se.total_engagements::float / NULLIF(se.total_impressions, 0)) * 100, 2) AS engagement_rate_pct,
          se.ad_format,
          se.status,
          se.budget_total,
          se.reward_multiplier,
          se.created_at
        FROM sponsored_elections se
        JOIN elections e ON se.election_id = e.id
      `;

      if (brandId) {
        query += ` WHERE se.brand_id = '${brandId}'`;
      }

      query += ` ORDER BY generated_revenue DESC`;

      const { data, error } = await supabase?.rpc('execute_sql', { query });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching sponsored election revenue:', error);
      return { success: false, error: error?.message };
    }
  }

  /**
   * Query 2: Brand Performance Summary
   * Aggregates all campaigns for a brand with ROI metrics
   */
  async getBrandPerformanceSummary(brandId) {
    try {
      const { data, error } = await supabase?.from('brand_revenue_summary')?.select(`
          *,
          elections:election_id (
            title,
            category,
            created_at
          )
        `)?.eq('brand_id', brandId)?.order('total_spent', { ascending: false });

      if (error) throw error;

      // Calculate aggregate metrics
      const summary = {
        total_campaigns: data?.length,
        total_spent: data?.reduce((sum, item) => sum + parseFloat(item?.total_spent || 0), 0),
        total_engagements: data?.reduce((sum, item) => sum + (item?.total_engagements || 0), 0),
        avg_engagement_rate: data?.length > 0 
          ? data?.reduce((sum, item) => sum + parseFloat(item?.engagement_rate || 0), 0) / data?.length 
          : 0,
        avg_cpe: data?.length > 0
          ? data?.reduce((sum, item) => sum + parseFloat(item?.avg_cpe || 0), 0) / data?.length
          : 0,
        campaigns: data
      };

      return { success: true, data: summary };
    } catch (error) {
      console.error('Error fetching brand performance summary:', error);
      return { success: false, error: error?.message };
    }
  }

  /**
   * Query 3: Real-Time Budget Monitoring
   * Returns campaigns approaching budget limits (90% threshold)
   */
  async getLowBudgetCampaigns(threshold = 0.90) {
    try {
      const { data, error } = await supabase?.from('sponsored_elections')?.select(`
          *,
          elections:election_id (
            title,
            category
          )
        `)?.gte('budget_spent', supabase?.raw(`budget_total * ${threshold}`))?.eq('status', 'active')?.order('budget_spent', { ascending: false });

      if (error) throw error;

      const enrichedData = data?.map(campaign => ({
        ...campaign,
        budget_usage_pct: ((campaign?.budget_spent / campaign?.budget_total) * 100)?.toFixed(2),
        remaining_budget: (campaign?.budget_total - campaign?.budget_spent)?.toFixed(2),
        estimated_remaining_votes: Math.floor((campaign?.budget_total - campaign?.budget_spent) / campaign?.cost_per_vote)
      }));

      return { success: true, data: enrichedData };
    } catch (error) {
      console.error('Error fetching low budget campaigns:', error);
      return { success: false, error: error?.message };
    }
  }

  /**
   * Query 4: Audience DNA Analysis
   * Returns voter demographics and gamification stats for a sponsored election
   */
  async getAudienceDNA(sponsoredElectionId) {
    try {
      // Get voters for this election
      const { data: sponsoredData, error: seError } = await supabase?.from('sponsored_elections')?.select('election_id')?.eq('id', sponsoredElectionId)?.single();

      if (seError) throw seError;

      const { data: votes, error: votesError } = await supabase?.from('votes')?.select(`
          user_id,
          created_at
        `)?.eq('election_id', sponsoredData?.election_id)?.eq('is_sponsored', true);

      if (votesError) throw votesError;

      // Get gamification data for these users
      const userIds = votes?.map(v => v?.user_id);
      
      const { data: gamificationData, error: gamError } = await supabase?.from('user_gamification')?.select(`
          user_id,
          level,
          current_xp,
          streak_count,
          total_votes
        `)?.in('user_id', userIds);

      if (gamError) throw gamError;

      // Get badges for these users
      const { data: badgesData, error: badgesError } = await supabase?.from('user_badges')?.select(`
          user_id,
          badges:badge_id (
            name,
            rarity_level
          )
        `)?.in('user_id', userIds);

      if (badgesError) throw badgesError;

      // Calculate aggregate metrics
      const avgLevel = gamificationData?.length > 0
        ? gamificationData?.reduce((sum, u) => sum + u?.level, 0) / gamificationData?.length
        : 0;

      const avgStreak = gamificationData?.length > 0
        ? gamificationData?.reduce((sum, u) => sum + u?.streak_count, 0) / gamificationData?.length
        : 0;

      const levelDistribution = gamificationData?.reduce((acc, u) => {
        const levelBucket = Math.floor(u?.level / 10) * 10;
        acc[`${levelBucket}-${levelBucket + 9}`] = (acc?.[`${levelBucket}-${levelBucket + 9}`] || 0) + 1;
        return acc;
      }, {});

      const badgeDistribution = badgesData?.reduce((acc, ub) => {
        if (ub?.badges) {
          acc[ub.badges.name] = (acc?.[ub?.badges?.name] || 0) + 1;
        }
        return acc;
      }, {});

      return {
        success: true,
        data: {
          total_voters: votes?.length,
          avg_level: avgLevel?.toFixed(2),
          avg_streak: avgStreak?.toFixed(2),
          level_distribution: levelDistribution,
          top_badges: Object.entries(badgeDistribution)?.sort((a, b) => b?.[1] - a?.[1])?.slice(0, 5)?.map(([name, count]) => ({ name, count })),
          high_value_users: gamificationData?.filter(u => u?.level >= 20)?.length,
          engagement_champions: gamificationData?.filter(u => u?.total_votes >= 100)?.length
        }
      };
    } catch (error) {
      console.error('Error fetching audience DNA:', error);
      return { success: false, error: error?.message };
    }
  }

  /**
   * Query 5: Vote Sentiment Analysis
   * Returns breakdown of vote choices for market research elections
   */
  async getVoteSentiment(sponsoredElectionId) {
    try {
      const { data: sponsoredData, error: seError } = await supabase?.from('sponsored_elections')?.select('election_id')?.eq('id', sponsoredElectionId)?.single();

      if (seError) throw seError;

      // Get election details
      const { data: election, error: electionError } = await supabase?.from('elections')?.select('id, title, options')?.eq('id', sponsoredData?.election_id)?.single();

      if (electionError) throw electionError;

      // Get vote distribution
      const { data: votes, error: votesError } = await supabase?.from('votes')?.select('choice, created_at')?.eq('election_id', sponsoredData?.election_id)?.eq('is_sponsored', true);

      if (votesError) throw votesError;

      // Calculate sentiment distribution
      const choiceDistribution = votes?.reduce((acc, vote) => {
        acc[vote.choice] = (acc?.[vote?.choice] || 0) + 1;
        return acc;
      }, {});

      const totalVotes = votes?.length;
      const sentimentData = Object.entries(choiceDistribution)?.map(([choice, count]) => ({
        choice,
        count,
        percentage: ((count / totalVotes) * 100)?.toFixed(2)
      }))?.sort((a, b) => b?.count - a?.count);

      // Time-based trend
      const votesByHour = votes?.reduce((acc, vote) => {
        const hour = new Date(vote.created_at)?.getHours();
        acc[hour] = (acc?.[hour] || 0) + 1;
        return acc;
      }, {});

      return {
        success: true,
        data: {
          election_title: election?.title,
          total_votes: totalVotes,
          sentiment_breakdown: sentimentData,
          winning_choice: sentimentData?.[0],
          votes_by_hour: votesByHour
        }
      };
    } catch (error) {
      console.error('Error fetching vote sentiment:', error);
      return { success: false, error: error?.message };
    }
  }

  /**
   * Query 6: CPX (Cost Per XP) Calculation
   * Calculates how much it costs a brand to grant 1,000 XP to the community
   */
  async calculateCPX(sponsoredElectionId) {
    try {
      const { data: sponsored, error: seError } = await supabase?.from('sponsored_elections')?.select('*')?.eq('id', sponsoredElectionId)?.single();

      if (seError) throw seError;

      // Calculate total XP granted
      const baseXP = 10; // Base XP per vote
      const totalXPGranted = sponsored?.total_engagements * baseXP * sponsored?.reward_multiplier;

      // Calculate CPX
      const cpx = totalXPGranted > 0 
        ? (sponsored?.budget_spent / totalXPGranted) * 1000 
        : 0;

      return {
        success: true,
        data: {
          sponsored_election_id: sponsoredElectionId,
          budget_spent: sponsored?.budget_spent,
          total_engagements: sponsored?.total_engagements,
          reward_multiplier: sponsored?.reward_multiplier,
          total_xp_granted: totalXPGranted,
          cpx: cpx?.toFixed(2),
          brand_sentiment_score: this.calculateBrandSentiment(sponsored)
        }
      };
    } catch (error) {
      console.error('Error calculating CPX:', error);
      return { success: false, error: error?.message };
    }
  }

  /**
   * Helper: Calculate Brand Sentiment Score
   */
  calculateBrandSentiment(sponsored) {
    const engagementRate = sponsored?.total_impressions > 0
      ? (sponsored?.total_engagements / sponsored?.total_impressions) * 100
      : 0;

    // Higher engagement rate = better sentiment
    if (engagementRate >= 10) return 'Excellent';
    if (engagementRate >= 5) return 'Good';
    if (engagementRate >= 2) return 'Average';
    return 'Needs Improvement';
  }

  /**
   * Query 7: Conversion Attribution
   * Links sponsored election engagement to conversion events
   */
  async getConversionAttribution(sponsoredElectionId) {
    try {
      const { data, error } = await supabase?.from('conversion_pixels')?.select('*')?.eq('sponsored_election_id', sponsoredElectionId)?.order('tracked_at', { ascending: false });

      if (error) throw error;

      const conversionSummary = {
        total_conversions: data?.length,
        total_value: data?.reduce((sum, c) => sum + parseFloat(c?.conversion_value || 0), 0),
        conversions_by_type: data?.reduce((acc, c) => {
          acc[c.event_type] = (acc?.[c?.event_type] || 0) + 1;
          return acc;
        }, {}),
        recent_conversions: data?.slice(0, 10)
      };

      return { success: true, data: conversionSummary };
    } catch (error) {
      console.error('Error fetching conversion attribution:', error);
      return { success: false, error: error?.message };
    }
  }

  /**
   * Query 8: Frequency Cap Analysis
   * Monitors ad fatigue and impression distribution
   */
  async getFrequencyAnalysis(sponsoredElectionId) {
    try {
      const { data, error } = await supabase?.from('user_ad_impressions')?.select('*')?.eq('sponsored_election_id', sponsoredElectionId);

      if (error) throw error;

      const impressionDistribution = data?.reduce((acc, imp) => {
        acc[imp.impression_count] = (acc?.[imp?.impression_count] || 0) + 1;
        return acc;
      }, {});

      const engagedUsers = data?.filter(imp => imp?.engaged)?.length;
      const totalUsers = data?.length;

      return {
        success: true,
        data: {
          total_users_reached: totalUsers,
          engaged_users: engagedUsers,
          engagement_rate: ((engagedUsers / totalUsers) * 100)?.toFixed(2),
          impression_distribution: impressionDistribution,
          avg_impressions_per_user: data?.reduce((sum, imp) => sum + imp?.impression_count, 0) / totalUsers
        }
      };
    } catch (error) {
      console.error('Error fetching frequency analysis:', error);
      return { success: false, error: error?.message };
    }
  }
}

export default new RevenueReportingService();