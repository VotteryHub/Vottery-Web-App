import { aiProxyService } from './aiProxyService';
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

export const revenueSplitForecastingService = {
  // Generate revenue forecast using Gemini (replaces OpenAI)
  async generateOpenAIForecast(splitScenarios) {
    try {
      const prompt = `You are an expert revenue analyst. Analyze these revenue split scenarios and provide detailed forecasts:

Scenarios:
${JSON.stringify(splitScenarios, null, 2)}

Provide:
1. Projected creator earnings for each scenario (30, 60, 90 days)
2. Projected platform revenue for each scenario
3. Creator satisfaction predictions (0-100 score)
4. Revenue impact analysis
5. Confidence levels for each projection

Format as JSON with keys: scenarios (array with scenarioName, projections, satisfaction, confidence), summary, recommendations`;

      const { data, error } = await aiProxyService?.callGemini(
        [{ role: 'user', content: prompt }],
        { model: 'gemini-1.5-flash', maxTokens: 4096 }
      );

      if (error) throw new Error(error?.message);

      const forecast = JSON.parse(data?.choices?.[0]?.message?.content || '{}');
      return { data: forecast, error: null };
    } catch (error) {
      console.error('Gemini forecast error:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Generate optimization suggestions using Anthropic Claude
  async generateClaudeOptimizations(currentSplit, historicalData) {
    try {
      const prompt = `You are a strategic revenue optimization expert. Analyze the current revenue split and historical performance data to provide actionable optimization suggestions.

Current Split:
Creator: ${currentSplit?.creatorPercentage}%
Platform: ${currentSplit?.platformPercentage}%

Historical Performance:
${JSON.stringify(historicalData, null, 2)}

Provide:
1. Optimal revenue split recommendations with reasoning
2. Strategic timing for split changes
3. Creator morale impact predictions
4. Platform sustainability analysis
5. Risk assessment for each recommendation
6. Implementation roadmap

Format as JSON with keys: recommendations (array with title, newSplit, reasoning, impact, risk, confidence), strategicTiming, implementationSteps`;

      const { data, error } = await aiProxyService?.callAnthropic(
        [{ role: 'user', content: prompt }],
        { model: 'claude-sonnet-4-5-20250929', maxTokens: 4096 }
      );

      if (error) throw new Error(error?.message);

      const optimizations = JSON.parse(data?.content?.[0]?.text || '{}');
      return { data: optimizations, error: null };
    } catch (error) {
      console.error('Claude optimization error:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Generate scenario comparison using both AI providers
  async generateScenarioComparison(scenarios) {
    try {
      const [openAIResult, claudeResult] = await Promise.all([
        this.generateOpenAIForecast(scenarios),
        this.generateClaudeOptimizations(
          scenarios?.[0],
          { scenarios }
        )
      ]);

      return {
        data: {
          openAIForecast: openAIResult?.data,
          claudeOptimizations: claudeResult?.data,
          consensus: this.calculateConsensus(
            openAIResult?.data,
            claudeResult?.data
          )
        },
        error: null
      };
    } catch (error) {
      console.error('Scenario comparison error:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Calculate AI consensus
  calculateConsensus(openAIData, claudeData) {
    if (!openAIData || !claudeData) return null;

    const recommendations = [];

    if (openAIData?.recommendations && claudeData?.recommendations) {
      const avgConfidence = (
        (openAIData?.recommendations?.reduce((sum, r) => sum + (r?.confidence || 0), 0) /
          openAIData?.recommendations?.length) +
        (claudeData?.recommendations?.reduce((sum, r) => sum + (r?.confidence || 0), 0) /
          claudeData?.recommendations?.length)
      ) / 2;

      recommendations?.push({
        type: 'consensus',
        confidence: avgConfidence,
        message: avgConfidence > 80
          ? 'Both AI models strongly agree on these recommendations'
          : avgConfidence > 60
          ? 'AI models show moderate agreement' :'AI models have divergent recommendations - proceed with caution'
      });
    }

    return {
      recommendations,
      openAIConfidence: openAIData?.summary?.confidence || 0,
      claudeConfidence: claudeData?.recommendations?.[0]?.confidence || 0
    };
  },

  // Generate creator impact analysis
  async analyzeCreatorImpact(splitChange, creatorData) {
    try {
      const prompt = `Analyze the impact of this revenue split change on creator satisfaction and retention:

Split Change:
From: ${splitChange?.from?.creatorPercentage}% creator / ${splitChange?.from?.platformPercentage}% platform
To: ${splitChange?.to?.creatorPercentage}% creator / ${splitChange?.to?.platformPercentage}% platform

Creator Data:
${JSON.stringify(creatorData, null, 2)}

Provide:
1. Creator satisfaction impact score (-100 to +100)
2. Predicted retention rate change
3. Revenue per creator projections
4. Morale and motivation analysis
5. Churn risk assessment

Format as JSON with keys: satisfactionImpact, retentionChange, revenueProjections, moraleAnalysis, churnRisk`;

      const { data, error } = await aiProxyService?.callGemini(
        [{ role: 'user', content: prompt }],
        { model: 'gemini-1.5-flash', maxTokens: 2048 }
      );

      if (error) throw new Error(error?.message);

      const impact = JSON.parse(data?.choices?.[0]?.message?.content || '{}');
      return { data: impact, error: null };
    } catch (error) {
      console.error('Creator impact analysis error:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Generate platform sustainability analysis
  async analyzePlatformSustainability(splitScenario, platformMetrics) {
    try {
      const prompt = `Analyze platform financial sustainability under this revenue split scenario:

Revenue Split:
Creator: ${splitScenario?.creatorPercentage}%
Platform: ${splitScenario?.platformPercentage}%

Platform Metrics:
${JSON.stringify(platformMetrics, null, 2)}

Provide:
1. Platform revenue sufficiency analysis
2. Operating cost coverage assessment
3. Growth investment capacity
4. Long-term sustainability score (0-100)
5. Risk factors and mitigation strategies

Format as JSON with keys: revenueSufficiency, costCoverage, investmentCapacity, sustainabilityScore, risks, mitigations`;

      const { data, error } = await aiProxyService?.callAnthropic(
        [{ role: 'user', content: prompt }],
        { model: 'claude-sonnet-4-5-20250929', maxTokens: 2048 }
      );

      if (error) throw new Error(error?.message);

      const sustainability = JSON.parse(data?.content?.[0]?.text || '{}');
      return { data: sustainability, error: null };
    } catch (error) {
      console.error('Platform sustainability analysis error:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Store forecast results
  async storeForecastResults(forecastData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('revenue_split_projections')
        ?.insert({
          config_id: forecastData?.configId,
          campaign_id: forecastData?.campaignId,
          projection_period: forecastData?.projectionPeriod,
          projected_creator_earnings: forecastData?.projectedCreatorEarnings,
          projected_platform_revenue: forecastData?.projectedPlatformRevenue,
          projected_total_revenue: forecastData?.projectedTotalRevenue,
          creator_satisfaction_score: forecastData?.creatorSatisfactionScore,
          retention_rate_estimate: forecastData?.retentionRateEstimate,
          confidence_level: forecastData?.confidenceLevel,
          calculation_methodology: forecastData?.calculationMethodology
        })
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Store forecast error:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get historical forecasts
  async getHistoricalForecasts(configId) {
    try {
      const { data, error } = await supabase
        ?.from('revenue_split_projections')
        ?.select('*')
        ?.eq('config_id', configId)
        ?.order('created_at', { ascending: false })
        ?.limit(10);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};