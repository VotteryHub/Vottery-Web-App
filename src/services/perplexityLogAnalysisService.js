import { aiProxyService } from './aiProxyService';

/**
 * Perplexity extended reasoning on fraud patterns from logs and threat detections
 * Used by fraud dashboards for deeper pattern analysis
 */
export const perplexityLogAnalysisService = {
  async analyzeFraudPatterns(fraudLogs, threatDetections, options = {}) {
    try {
      const { data, error } = await aiProxyService?.callPerplexity?.(
        [
          {
            role: 'system',
            content: `You are a fraud intelligence analyst. Analyze fraud logs and threat detections using extended reasoning.
Return JSON only with: patterns (array of { name, frequency, severity, indicators }), correlationClusters (array of related incidents),
rootCauseHypotheses (array of strings), recommendedPreventionRules (array of { condition, action, priority }), confidenceScore (0-1),
reasoning (concise extended analysis summary).`
          },
          {
            role: 'user',
            content: `Analyze these fraud patterns:\n\nFraud Logs: ${JSON.stringify(fraudLogs?.slice?.(0, 50) || [])}\n\nThreat Detections: ${JSON.stringify(threatDetections?.slice?.(0, 30) || [])}\n\nProvide extended reasoning and actionable insights. Return valid JSON only.`
          }
        ],
        { model: 'sonar-reasoning-pro', maxTokens: 1500, temperature: 0.2 }
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
