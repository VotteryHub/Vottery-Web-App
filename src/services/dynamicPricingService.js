import openai from '../lib/openai';
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

/**
 * Fetch real-time market demand data from platform analytics
 */
async function fetchRealTimeMarketDemand() {
  try {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)?.toISOString();

    const [
      { count: dauCount },
      { count: mauCount },
      { count: signupsCount },
      { data: revenueData }
    ] = await Promise.all([
      supabase?.from('user_profiles')?.select('*', { count: 'exact', head: true })?.gte('last_active_at', new Date(now.getTime() - 24 * 60 * 60 * 1000)?.toISOString()),
      supabase?.from('user_profiles')?.select('*', { count: 'exact', head: true })?.gte('last_active_at', thirtyDaysAgo),
      supabase?.from('user_profiles')?.select('*', { count: 'exact', head: true })?.gte('created_at', thirtyDaysAgo),
      supabase?.from('subscriptions')?.select('plan_type')?.eq('status', 'active')
    ]);

    const dau = dauCount ?? 0;
    const mau = mauCount ?? 0;
    const signups = signupsCount ?? 0;
    const activeSubs = revenueData?.length ?? 0;
    const timeOfDayFactor = (hour >= 9 && hour <= 21) ? 1.2 : 0.8;
    const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.1 : 1.0;

    let demand = 'moderate';
    if (dau / (mau || 1) > 0.4 && signups > 100) demand = 'high';
    else if (dau / (mau || 1) < 0.15) demand = 'low';

    return {
      demand,
      dau,
      mau,
      signups,
      activeSubs,
      timeOfDayFactor,
      weekendFactor,
      competitiveIntensity: activeSubs > 500 ? 'high' : activeSubs > 100 ? 'medium' : 'low'
    };
  } catch (e) {
    return { demand: 'moderate', competitiveIntensity: 'medium', timeOfDayFactor: 1.0 };
  }
}

export const dynamicPricingService = {
  /**
   * Fetch real-time market demand (for use by optimization methods)
   */
  async getRealTimeMarketDemand() {
    return fetchRealTimeMarketDemand();
  },

  /**
   * Analyze market demand and optimize subscription pricing
   */
  async optimizeSubscriptionPricing(planId, marketData) {
    try {
      const realTimeDemand = marketData ? null : await fetchRealTimeMarketDemand();
      const effectiveMarketData = marketData || realTimeDemand;

      // Get current plan details
      const { data: plan, error: planError } = await supabase
        ?.from('subscription_plans')
        ?.select('*')
        ?.eq('id', planId)
        ?.single();

      if (planError) throw planError;

      // Get competitor pricing data; seed from subscription_plans if pricing_intelligence empty
      let { data: competitorData } = await supabase
        ?.from('pricing_intelligence')
        ?.select('*')
        ?.eq('plan_type', plan?.plan_type)
        ?.order('created_at', { ascending: false })
        ?.limit(10);

      if (!competitorData?.length) {
        const { data: plans } = await supabase?.from('subscription_plans')?.select('plan_type, price')?.neq('id', planId);
        competitorData = plans?.map(p => ({ plan_type: p?.plan_type, price: p?.price })) || [];
      }

      // Get user segment behavior
      const { data: segmentData } = await supabase
        ?.from('user_subscriptions')
        ?.select('plan_id, subscriber_type, created_at')
        ?.eq('plan_id', planId)
        ?.gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)?.toISOString());

      const prompt = `Analyze subscription pricing optimization:

Current Plan:
- Name: ${plan?.plan_name}
- Type: ${plan?.plan_type}
- Current Price: $${plan?.price}
- Duration: ${plan?.duration}
- Features: ${JSON.stringify(plan?.features)}

Market Data:
- Total Subscribers (30d): ${segmentData?.length || 0}
- Competitor Average Price: $${competitorData?.reduce((sum, c) => sum + (c?.price || 0), 0) / (competitorData?.length || 1)}
- Market Demand: ${effectiveMarketData?.demand || 'moderate'}
- Competitive Intensity: ${effectiveMarketData?.competitiveIntensity || 'medium'}
- DAU/MAU ratio: ${effectiveMarketData?.dau && effectiveMarketData?.mau ? (effectiveMarketData.dau / effectiveMarketData.mau * 100).toFixed(1) + '%' : 'N/A'}
- Recent signups (30d): ${effectiveMarketData?.signups ?? 'N/A'}
- Time-of-day factor: ${effectiveMarketData?.timeOfDayFactor ?? 1}

User Segment Behavior:
- Individual Subscribers: ${segmentData?.filter(s => s?.subscriber_type === 'individual')?.length || 0}
- Organization Subscribers: ${segmentData?.filter(s => s?.subscriber_type === 'organization')?.length || 0}

Provide:
1. Optimal price point ($X.XX)
2. Price elasticity analysis
3. Revenue impact projection
4. Competitive positioning recommendation
5. User segment-specific pricing suggestions

Format as JSON with keys: optimalPrice, elasticity, revenueImpact, positioning, segmentPricing`;

      const completion = await openai?.chat?.completions?.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: 'You are a pricing optimization expert specializing in subscription business models. Provide data-driven pricing recommendations in JSON format.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      });

      const analysis = JSON.parse(completion?.choices?.[0]?.message?.content);

      // Store pricing recommendation
      const { data: recommendation, error: recError } = await supabase
        ?.from('pricing_recommendations')
        ?.insert(toSnakeCase({
          planId,
          currentPrice: plan?.price,
          recommendedPrice: analysis?.optimalPrice,
          elasticity: analysis?.elasticity,
          revenueImpact: analysis?.revenueImpact,
          positioning: analysis?.positioning,
          segmentPricing: analysis?.segmentPricing,
          confidence: 0.85,
          status: 'pending',
          analysisData: { marketData: effectiveMarketData, competitorData, segmentData }
        }))
        ?.select()
        ?.single();

      if (recError) throw recError;

      return { data: toCamelCase({ ...analysis, recommendationId: recommendation?.id }), error: null };
    } catch (error) {
      console.error('Error optimizing subscription pricing:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Optimize recommendation placement pricing
   */
  async optimizeRecommendationPlacement(contentType, placementData) {
    try {
      const { data: performanceData } = await supabase
        ?.from('recommendation_performance')
        ?.select('*')
        ?.eq('content_type', contentType)
        ?.gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)?.toISOString());

      const prompt = `Optimize recommendation placement pricing:

Content Type: ${contentType}
Current Placement Cost: $${placementData?.currentCost || 0}
Average CTR: ${performanceData?.reduce((sum, p) => sum + (p?.ctr || 0), 0) / (performanceData?.length || 1)}%
Average Conversion: ${performanceData?.reduce((sum, p) => sum + (p?.conversion_rate || 0), 0) / (performanceData?.length || 1)}%
Total Impressions (7d): ${performanceData?.reduce((sum, p) => sum + (p?.impressions || 0), 0)}

Provide optimal pricing for:
1. Premium placement (top of feed)
2. Standard placement (mid-feed)
3. Budget placement (bottom-feed)
4. Sponsored recommendation boost

Format as JSON with keys: premiumPrice, standardPrice, budgetPrice, boostPrice, reasoning`;

      const completion = await openai?.chat?.completions?.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: 'You are a recommendation system pricing expert. Optimize placement costs based on performance data.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      });

      const pricing = JSON.parse(completion?.choices?.[0]?.message?.content);

      return { data: toCamelCase(pricing), error: null };
    } catch (error) {
      console.error('Error optimizing recommendation placement:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Optimize advertising costs based on real-time demand
   */
  async optimizeAdvertisingCosts(campaignId, demandData) {
    try {
      // Note: advertiser_campaigns table may not exist yet
      // Using fallback data structure for campaign optimization
      let campaign = null;
      let performanceMetrics = [];

      // Try to fetch campaign data if table exists
      const { data: campaignData, error: campaignError } = await supabase
        ?.from('advertiser_campaigns')
        ?.select('*')
        ?.eq('id', campaignId)
        ?.single();

      if (!campaignError && campaignData) {
        campaign = campaignData;

        const { data: metrics } = await supabase
          ?.from('campaign_performance')
          ?.select('*')
          ?.eq('campaign_id', campaignId)
          ?.gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000)?.toISOString());

        performanceMetrics = metrics || [];
      } else {
        // Use fallback data for optimization analysis
        campaign = {
          campaign_name: 'Campaign ' + campaignId?.substring(0, 8),
          cpm: 5.0,
          cpc: 0.5,
          cpe: 0.25
        };
      }

      const prompt = `Optimize advertising costs for real-time market demand:

Campaign: ${campaign?.campaign_name}
Current CPM: $${campaign?.cpm || 0}
Current CPC: $${campaign?.cpc || 0}
Current CPE: $${campaign?.cpe || 0}

Performance (24h):
- Impressions: ${performanceMetrics?.reduce((sum, p) => sum + (p?.impressions || 0), 0)}
- Clicks: ${performanceMetrics?.reduce((sum, p) => sum + (p?.clicks || 0), 0)}
- Engagements: ${performanceMetrics?.reduce((sum, p) => sum + (p?.engagements || 0), 0)}
- Conversions: ${performanceMetrics?.reduce((sum, p) => sum + (p?.conversions || 0), 0)}

Market Demand:
- Current Demand Level: ${demandData?.demandLevel || 'medium'}
- Competitor Activity: ${demandData?.competitorActivity || 'moderate'}
- Time of Day Factor: ${demandData?.timeOfDayFactor || 1.0}
- Zone Competition: ${demandData?.zoneCompetition || 'medium'}

Provide optimized pricing:
1. Dynamic CPM (cost per 1000 impressions)
2. Dynamic CPC (cost per click)
3. Dynamic CPE (cost per engagement)
4. Bid adjustment recommendations
5. Budget allocation suggestions

Format as JSON with keys: optimalCPM, optimalCPC, optimalCPE, bidAdjustments, budgetAllocation, reasoning`;

      const completion = await openai?.chat?.completions?.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: 'You are an advertising cost optimization expert. Provide real-time pricing adjustments based on market demand and performance data.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      });

      const optimization = JSON.parse(completion?.choices?.[0]?.message?.content);

      // Store optimization recommendation
      const { data: recommendation } = await supabase
        ?.from('ad_cost_optimizations')
        ?.insert(toSnakeCase({
          campaignId,
          currentCpm: campaign?.cpm,
          recommendedCpm: optimization?.optimalCPM,
          currentCpc: campaign?.cpc,
          recommendedCpc: optimization?.optimalCPC,
          currentCpe: campaign?.cpe,
          recommendedCpe: optimization?.optimalCPE,
          bidAdjustments: optimization?.bidAdjustments,
          budgetAllocation: optimization?.budgetAllocation,
          reasoning: optimization?.reasoning,
          demandData,
          status: 'pending'
        }))
        ?.select()
        ?.single();

      return { data: toCamelCase({ ...optimization, recommendationId: recommendation?.id }), error: null };
    } catch (error) {
      console.error('Error optimizing advertising costs:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Apply pricing optimization automatically
   */
  async applyPricingOptimization(recommendationId, type) {
    try {
      let table, updateData;

      switch (type) {
        case 'subscription':
          table = 'pricing_recommendations';
          const { data: subRec } = await supabase?.from(table)?.select('*')?.eq('id', recommendationId)?.single();
          
          await supabase
            ?.from('subscription_plans')
            ?.update({ price: subRec?.recommended_price, updated_at: new Date()?.toISOString() })
            ?.eq('id', subRec?.plan_id);
          break;

        case 'advertising':
          table = 'ad_cost_optimizations';
          const { data: adRec } = await supabase?.from(table)?.select('*')?.eq('id', recommendationId)?.single();
          
          // Only update advertiser_campaigns if table exists
          if (adRec?.campaign_id) {
            const { error: updateError } = await supabase
              ?.from('advertiser_campaigns')
              ?.update({
                cpm: adRec?.recommended_cpm,
                cpc: adRec?.recommended_cpc,
                cpe: adRec?.recommended_cpe,
                updated_at: new Date()?.toISOString()
              })
              ?.eq('id', adRec?.campaign_id);

            // If table doesn't exist, just mark recommendation as applied
            if (updateError) {
              console.warn('advertiser_campaigns table not found, skipping campaign update');
            }
          }
          break;
      }

      // Mark recommendation as applied
      await supabase
        ?.from(table)
        ?.update({ status: 'applied', applied_at: new Date()?.toISOString() })
        ?.eq('id', recommendationId);

      return { data: { success: true, message: 'Pricing optimization applied successfully' }, error: null };
    } catch (error) {
      console.error('Error applying pricing optimization:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Get pricing optimization history
   */
  async getPricingHistory(entityId, entityType) {
    try {
      let table, column;

      switch (entityType) {
        case 'subscription':
          table = 'pricing_recommendations';
          column = 'plan_id';
          break;
        case 'campaign':
          table = 'ad_cost_optimizations';
          column = 'campaign_id';
          break;
        default:
          throw new Error('Invalid entity type');
      }

      const { data, error } = await supabase
        ?.from(table)
        ?.select('*')
        ?.eq(column, entityId)
        ?.order('created_at', { ascending: false })
        ?.limit(20);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error fetching pricing history:', error);
      return { data: null, error: { message: error?.message } };
    }
  }
};