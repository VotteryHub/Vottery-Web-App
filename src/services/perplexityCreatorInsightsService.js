import { aiProxyService } from './aiProxyService';

/**
 * Perplexity-powered creator ROI projections and insights for Predictive Creator Insights Dashboard
 */
export const perplexityCreatorInsightsService = {
  async getROIProjection(creatorData) {
    try {
      const { data, error } = await aiProxyService?.callPerplexity?.(
        [
          {
            role: 'system',
            content: 'You are a creator economy analyst. Return JSON only with: projectedRevenue30d, projectedRevenue60d, projectedRevenue90d (numbers), confidence (0-100), keyDrivers (array of strings), riskFactors (array of strings), recommendedActions (array of strings).'
          },
          {
            role: 'user',
            content: `Based on creator performance data, project ROI for 30/60/90 days: ${JSON.stringify(creatorData || {})}. Return valid JSON only.`
          }
        ],
        { model: 'sonar-pro', maxTokens: 800, temperature: 0.3 }
      );
      if (error) return { data: null, error };
      let parsed = null;
      try {
        const content = data?.choices?.[0]?.message?.content || data?.content || '';
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
      } catch (_) {}
      return { data: parsed, error: null };
    } catch (err) {
      return { data: null, error: { message: err?.message } };
    }
  }
};
