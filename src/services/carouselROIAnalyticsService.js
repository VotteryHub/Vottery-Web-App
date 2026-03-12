import { supabase } from '../lib/supabase';

import claudeClient from '../lib/claude';

class CarouselROIAnalyticsService {
  constructor() {
    this.purchasingPowerZones = [
      { name: 'USA', multiplier: 1.0, currency: 'USD' },
      { name: 'Western Europe', multiplier: 0.95, currency: 'EUR' },
      { name: 'Eastern Europe', multiplier: 0.45, currency: 'EUR' },
      { name: 'India', multiplier: 0.25, currency: 'INR' },
      { name: 'Latin America', multiplier: 0.35, currency: 'USD' },
      { name: 'Africa', multiplier: 0.20, currency: 'USD' },
      { name: 'Middle East/Asia', multiplier: 0.60, currency: 'USD' },
      { name: 'Australasia', multiplier: 0.90, currency: 'AUD' }
    ];
  }

  /**
   * Get revenue analysis per content type
   */
  async getRevenueByContentType(timeRange = '30d') {
    try {
      const startDate = this.getStartDate(timeRange);

      // Jolts revenue
      const { data: joltsRevenue } = await supabase?.from('wallet_transactions')?.select('amount, created_at')?.eq('transaction_type', 'jolt_revenue')?.gte('created_at', startDate?.toISOString());

      // Elections sponsorship
      const { data: electionsRevenue } = await supabase?.from('wallet_transactions')?.select('amount, created_at')?.eq('transaction_type', 'election_sponsorship')?.gte('created_at', startDate?.toISOString());

      // Group promotions
      const { data: groupsRevenue } = await supabase?.from('wallet_transactions')?.select('amount, created_at')?.eq('transaction_type', 'group_promotion')?.gte('created_at', startDate?.toISOString());

      const joltsTotal = joltsRevenue?.reduce((sum, t) => sum + parseFloat(t?.amount), 0) || 0;
      const electionsTotal = electionsRevenue?.reduce((sum, t) => sum + parseFloat(t?.amount), 0) || 0;
      const groupsTotal = groupsRevenue?.reduce((sum, t) => sum + parseFloat(t?.amount), 0) || 0;

      return {
        data: {
          jolts: { revenue: joltsTotal, transactions: joltsRevenue?.length || 0 },
          elections: { revenue: electionsTotal, transactions: electionsRevenue?.length || 0 },
          groups: { revenue: groupsTotal, transactions: groupsRevenue?.length || 0 },
          total: joltsTotal + electionsTotal + groupsTotal
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting revenue by content type:', error);
      return { data: null, error: { message: error?.message } };
    }
  }

  /**
   * Get sponsorship performance metrics with CPM/CPC analysis
   */
  async getSponsorshipPerformance(timeRange = '30d') {
    try {
      const startDate = this.getStartDate(timeRange);

      const { data: sponsorships } = await supabase?.from('sponsored_elections')?.select('*, elections(*)')?.gte('created_at', startDate?.toISOString());

      const performanceData = sponsorships?.map(sponsorship => {
        const impressions = sponsorship?.elections?.views || 0;
        const clicks = sponsorship?.elections?.clicks || 0;
        const cost = parseFloat(sponsorship?.total_cost || 0);
        
        const cpm = impressions > 0 ? (cost / impressions) * 1000 : 0;
        const cpc = clicks > 0 ? cost / clicks : 0;
        const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;

        return {
          id: sponsorship?.id,
          electionTitle: sponsorship?.elections?.title,
          impressions,
          clicks,
          cost,
          cpm: cpm?.toFixed(2),
          cpc: cpc?.toFixed(2),
          ctr: ctr?.toFixed(2)
        };
      }) || [];

      const avgCPM = performanceData?.reduce((sum, s) => sum + parseFloat(s?.cpm), 0) / performanceData?.length || 0;
      const avgCPC = performanceData?.reduce((sum, s) => sum + parseFloat(s?.cpc), 0) / performanceData?.length || 0;
      const avgCTR = performanceData?.reduce((sum, s) => sum + parseFloat(s?.ctr), 0) / performanceData?.length || 0;

      return {
        data: {
          sponsorships: performanceData,
          averages: {
            cpm: avgCPM?.toFixed(2),
            cpc: avgCPC?.toFixed(2),
            ctr: avgCTR?.toFixed(2)
          }
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting sponsorship performance:', error);
      return { data: null, error: { message: error?.message } };
    }
  }

  /**
   * Get creator payout distribution across 8 purchasing power zones
   */
  async getCreatorPayoutsByZone(timeRange = '30d') {
    try {
      const startDate = this.getStartDate(timeRange);

      const { data: payouts } = await supabase?.from('prize_redemptions')?.select('*, user:user_id(country, total_earnings)')?.eq('status', 'completed')?.gte('created_at', startDate?.toISOString());

      const zonePayouts = this.purchasingPowerZones?.map(zone => {
        const zoneData = payouts?.filter(p => this.getZoneForCountry(p?.user?.country) === zone?.name) || [];
        const totalPayout = zoneData?.reduce((sum, p) => sum + parseFloat(p?.final_amount), 0);
        const avgPayout = zoneData?.length > 0 ? totalPayout / zoneData?.length : 0;
        
        return {
          zone: zone?.name,
          totalPayout: totalPayout?.toFixed(2),
          avgPayout: avgPayout?.toFixed(2),
          creatorCount: zoneData?.length,
          multiplier: zone?.multiplier,
          currency: zone?.currency
        };
      });

      return { data: zonePayouts, error: null };
    } catch (error) {
      console.error('Error getting creator payouts by zone:', error);
      return { data: null, error: { message: error?.message } };
    }
  }

  /**
   * Zone-specific optimization recommendations using Claude
   */
  async getZoneOptimizationRecommendations(zoneData) {
    try {
      const response = await claudeClient?.messages?.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: `Analyze carousel monetization performance across 8 purchasing power zones and provide zone-specific optimization recommendations. Zone Data: ${JSON.stringify(zoneData)}. Provide: 1) Zone-specific pricing strategies, 2) Content type recommendations per zone, 3) Payout optimization strategies, 4) Revenue growth opportunities. Return JSON with: recommendations (array of objects with zone, strategy, expectedImpact, implementation), overallStrategy (string), priorityZones (array).`
          }
        ]
      });

      const content = response?.content?.[0]?.text;
      let recommendations;

      try {
        recommendations = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          recommendations = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse Claude response');
        }
      }

      return { data: recommendations, error: null };
    } catch (error) {
      console.error('Error getting zone optimization recommendations:', error);
      return { data: null, error: { message: error?.message } };
    }
  }

  /**
   * Carousel monetization comparison graphs
   */
  async getCarouselMonetizationComparison(timeRange = '30d') {
    try {
      const startDate = this.getStartDate(timeRange);

      const carouselTypes = ['horizontal', 'vertical', 'gradient'];
      const comparisonData = [];

      for (const type of carouselTypes) {
        const { data: revenue } = await supabase?.from('carousel_revenue_tracking')?.select('amount, created_at')?.eq('carousel_type', type)?.gte('created_at', startDate?.toISOString());

        const totalRevenue = revenue?.reduce((sum, r) => sum + parseFloat(r?.amount), 0) || 0;
        const avgRevenue = revenue?.length > 0 ? totalRevenue / revenue?.length : 0;

        comparisonData?.push({
          carouselType: type,
          totalRevenue: totalRevenue?.toFixed(2),
          avgRevenue: avgRevenue?.toFixed(2),
          transactionCount: revenue?.length || 0
        });
      }

      return { data: comparisonData, error: null };
    } catch (error) {
      console.error('Error getting carousel monetization comparison:', error);
      return { data: null, error: { message: error?.message } };
    }
  }

  /**
   * Revenue attribution by carousel type
   */
  async getRevenueAttribution(timeRange = '30d') {
    try {
      const startDate = this.getStartDate(timeRange);

      const { data: attributions } = await supabase?.from('carousel_revenue_tracking')?.select('carousel_type, content_type, amount, created_at')?.gte('created_at', startDate?.toISOString());

      const attributionMap = {};

      attributions?.forEach(attr => {
        const key = `${attr?.carousel_type}_${attr?.content_type}`;
        if (!attributionMap?.[key]) {
          attributionMap[key] = {
            carouselType: attr?.carousel_type,
            contentType: attr?.content_type,
            revenue: 0,
            count: 0
          };
        }
        attributionMap[key].revenue += parseFloat(attr?.amount);
        attributionMap[key].count += 1;
      });

      const attributionData = Object.values(attributionMap)?.map(attr => ({
        ...attr,
        revenue: attr?.revenue?.toFixed(2),
        avgRevenue: (attr?.revenue / attr?.count)?.toFixed(2)
      }));

      return { data: attributionData, error: null };
    } catch (error) {
      console.error('Error getting revenue attribution:', error);
      return { data: null, error: { message: error?.message } };
    }
  }

  /**
   * Sponsorship ROI tracking with conversion funnels
   */
  async getSponsorshipROI(sponsorshipId) {
    try {
      const { data: sponsorship } = await supabase?.from('sponsored_elections')?.select('*, elections(*)')?.eq('id', sponsorshipId)?.single();

      const impressions = sponsorship?.elections?.views || 0;
      const clicks = sponsorship?.elections?.clicks || 0;
      const conversions = sponsorship?.elections?.participants || 0;
      const cost = parseFloat(sponsorship?.total_cost || 0);
      const revenue = parseFloat(sponsorship?.generated_revenue || 0);

      const roi = cost > 0 ? ((revenue - cost) / cost) * 100 : 0;
      const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;

      const funnel = [
        { stage: 'Impressions', count: impressions, percentage: 100 },
        { stage: 'Clicks', count: clicks, percentage: impressions > 0 ? (clicks / impressions) * 100 : 0 },
        { stage: 'Conversions', count: conversions, percentage: clicks > 0 ? (conversions / clicks) * 100 : 0 }
      ];

      return {
        data: {
          sponsorshipId,
          cost,
          revenue,
          roi: roi?.toFixed(2),
          conversionRate: conversionRate?.toFixed(2),
          funnel
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting sponsorship ROI:', error);
      return { data: null, error: { message: error?.message } };
    }
  }

  /**
   * Helper: Get zone for country
   */
  getZoneForCountry(country) {
    const zoneMapping = {
      'United States': 'USA',
      'Canada': 'USA',
      'United Kingdom': 'Western Europe',
      'Germany': 'Western Europe',
      'France': 'Western Europe',
      'Poland': 'Eastern Europe',
      'Romania': 'Eastern Europe',
      'India': 'India',
      'Brazil': 'Latin America',
      'Mexico': 'Latin America',
      'Nigeria': 'Africa',
      'South Africa': 'Africa',
      'UAE': 'Middle East/Asia',
      'Singapore': 'Middle East/Asia',
      'Australia': 'Australasia',
      'New Zealand': 'Australasia'
    };

    return zoneMapping?.[country] || 'USA';
  }

  /**
   * Helper: Get start date for time range
   */
  getStartDate(timeRange) {
    const now = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case '7d':
        startDate?.setDate(now?.getDate() - 7);
        break;
      case '30d':
        startDate?.setDate(now?.getDate() - 30);
        break;
      case '90d':
        startDate?.setDate(now?.getDate() - 90);
        break;
      default:
        startDate?.setDate(now?.getDate() - 30);
    }

    return startDate;
  }
}

export const carouselROIAnalyticsService = new CarouselROIAnalyticsService();
export default carouselROIAnalyticsService;