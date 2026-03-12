import { supabase } from '../lib/supabase';
import claude from '../lib/claude';

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

export const claudeAnalyticsService = {
  async analyzeCampaignPerformance() {
    try {
      const { data: campaigns } = await supabase
        ?.from('platform_gamification_campaigns')
        ?.select(`
          *,
          allocation_rules:gamification_allocation_rules(*),
          winners:platform_gamification_winners(*)
        `)
        ?.order('created_at', { ascending: false })
        ?.limit(10);

      const campaignData = campaigns?.map(c => ({
        name: c?.campaign_name,
        prizePool: c?.prize_pool_amount,
        frequency: c?.frequency,
        status: c?.status,
        allocationRules: c?.allocation_rules?.length || 0,
        winnersCount: c?.winners?.length || 0
      }));

      const prompt = `Analyze the following gamification campaign performance data and provide insights:

${JSON.stringify(campaignData, null, 2)}

Provide:
1. Overall campaign performance assessment
2. Key performance indicators
3. Trends and patterns
4. Areas for improvement

Format your response as JSON with keys: summary, kpis (array), trends (array), improvements (array)`;

      const message = await claude?.messages?.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }]
      });

      const analysis = JSON.parse(message?.content?.[0]?.text || '{}');

      return { data: analysis, error: null };
    } catch (error) {
      console.error('Claude analytics error:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async generateStrategicRecommendations() {
    try {
      const { data: allocationRules } = await supabase
        ?.from('gamification_allocation_rules')
        ?.select('*')
        ?.order('created_at', { ascending: false });

      const { data: winners } = await supabase
        ?.from('platform_gamification_winners')
        ?.select('*')
        ?.order('winner_selected_at', { ascending: false })
        ?.limit(100);

      const prompt = `Based on the following allocation rules and winner distribution data, generate strategic recommendations for optimizing prize distribution:

Allocation Rules: ${JSON.stringify(allocationRules?.slice(0, 20), null, 2)}
Recent Winners: ${winners?.length} winners across various categories

Provide strategic recommendations for:
1. Optimal allocation percentages by user segment
2. Prize tier adjustments
3. Frequency optimization
4. User engagement strategies

Format as JSON array with objects containing: title, description, impact (high/medium/low), category`;

      const message = await claude?.messages?.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }]
      });

      const recommendations = JSON.parse(message?.content?.[0]?.text || '[]');

      return { data: recommendations, error: null };
    } catch (error) {
      console.error('Claude recommendations error:', error);
      return { data: [], error: { message: error?.message } };
    }
  },

  async analyzeUserSegments() {
    try {
      const { data: users } = await supabase
        ?.from('user_profiles')
        ?.select('country, gender, age, created_at')
        ?.limit(1000);

      const segmentData = {
        byCountry: {},
        byGender: {},
        byAge: {}
      };

      users?.forEach(user => {
        segmentData.byCountry[user?.country] = (segmentData?.byCountry?.[user?.country] || 0) + 1;
        segmentData.byGender[user?.gender] = (segmentData?.byGender?.[user?.gender] || 0) + 1;
        const ageGroup = user?.age < 25 ? '18-24' : user?.age < 35 ? '25-34' : user?.age < 45 ? '35-44' : '45+';
        segmentData.byAge[ageGroup] = (segmentData?.byAge?.[ageGroup] || 0) + 1;
      });

      const prompt = `Analyze the following user segment distribution and provide insights for prize allocation optimization:

${JSON.stringify(segmentData, null, 2)}

Provide:
1. Segment analysis with engagement potential
2. Recommended allocation percentages
3. Growth opportunities
4. Risk factors

Format as JSON array with objects containing: segment, size, recommendedAllocation (percentage), reasoning`;

      const message = await claude?.messages?.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }]
      });

      const segments = JSON.parse(message?.content?.[0]?.text || '[]');

      return { data: segments, error: null };
    } catch (error) {
      console.error('Claude segment analysis error:', error);
      return { data: [], error: { message: error?.message } };
    }
  },

  async generatePredictiveInsights() {
    try {
      const { data: campaigns } = await supabase
        ?.from('platform_gamification_campaigns')
        ?.select('*')
        ?.order('created_at', { ascending: false })
        ?.limit(5);

      const prompt = `Based on recent campaign data, generate predictive insights for the next 30-90 days:

${JSON.stringify(campaigns, null, 2)}

Predict:
1. Expected participation rates
2. Optimal prize pool sizing
3. Winner distribution patterns
4. Engagement trends

Format as JSON with keys: participationForecast, prizingRecommendations, distributionPredictions, engagementTrends`;

      const message = await claude?.messages?.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }]
      });

      const predictions = JSON.parse(message?.content?.[0]?.text || '{}');

      return { data: predictions, error: null };
    } catch (error) {
      console.error('Claude predictions error:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async generateFullAnalysis() {
    try {
      const [performance, recommendations, segments, predictions] = await Promise.all([
        this.analyzeCampaignPerformance(),
        this.generateStrategicRecommendations(),
        this.analyzeUserSegments(),
        this.generatePredictiveInsights()
      ]);

      const { data: { user } } = await supabase?.auth?.getUser();

      await supabase
        ?.from('claude_analytics_reports')
        ?.insert({
          generated_by: user?.id,
          report_type: 'full_analysis',
          analysis_data: {
            performance: performance?.data,
            recommendations: recommendations?.data,
            segments: segments?.data,
            predictions: predictions?.data
          },
          generated_at: new Date()?.toISOString()
        });

      return { success: true, error: null };
    } catch (error) {
      console.error('Full analysis generation error:', error);
      return { success: false, error: { message: error?.message } };
    }
  }
};

export default claudeAnalyticsService;