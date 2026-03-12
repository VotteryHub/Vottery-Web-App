/**
 * Unified Prevention Service
 * Wires Anthropic Claude security reasoning to automated prevention rules
 * with Perplexity 24-48hr threat forecasting for unified predictive fraud prevention.
 */
import { anthropicSecurityReasoningService } from './anthropicSecurityReasoningService';
import { perplexityThreatService } from './perplexityThreatService';
import { incidentResponseService } from './incidentResponseService';
import { discordWebhookService } from './discordWebhookService';
import { analytics } from '../hooks/useGoogleAnalytics';

const PREVENTION_RULES = [
  { id: 'fraud_pattern_spike', threshold: 75, action: 'activate_enhanced_fraud_detection', severity: 'high' },
  { id: 'auth_anomaly', threshold: 60, action: 'enable_step_up_auth', severity: 'medium' },
  { id: 'payment_risk', threshold: 80, action: 'pause_large_payouts', severity: 'high' },
  { id: 'vote_manipulation', threshold: 70, action: 'activate_vote_integrity_checks', severity: 'critical' },
  { id: 'ai_service_overload', threshold: 85, action: 'enable_gemini_failover', severity: 'medium' },
];

export const unifiedPreventionService = {
  /**
   * Run full unified prevention analysis:
   * 1. Perplexity 24-48hr threat forecast
   * 2. Anthropic security reasoning on detected threats
   * 3. Apply automated prevention rules
   */
  async runUnifiedAnalysis(currentMetrics = {}) {
    const results = {
      perplexityForecast: null,
      anthropicReasoning: null,
      preventionRulesTriggered: [],
      actionsExecuted: [],
      timestamp: new Date()?.toISOString(),
    };

    try {
      // Step 1: Perplexity 24-48hr threat forecast
      const threatResult = await perplexityThreatService?.analyzeThreatIntelligence({
        analysisType: 'unified_prevention_forecast',
        timeHorizon: '48h',
        currentMetrics,
        requestedBy: 'unified_prevention_service',
      });

      if (threatResult?.data) {
        results.perplexityForecast = threatResult?.data;

        // Step 2: If threat score is high, run Anthropic deep reasoning
        if (threatResult?.data?.threatScore >= 60) {
          const anthropicResult = await anthropicSecurityReasoningService?.analyzeSecurityIncident({
            id: `unified_${Date.now()}`,
            type: 'predictive_threat',
            severity: threatResult?.data?.threatLevel || 'medium',
            description: `Perplexity forecast: ${threatResult?.data?.reasoning || 'Elevated threat patterns detected'}`,
            affectedSystems: threatResult?.data?.attackVectors?.map(v => v?.vector) || [],
            detectionMethod: 'unified_prevention_service',
            timestamp: new Date()?.toISOString(),
            evidence: { threatPatterns: threatResult?.data?.threatPatterns, threatScore: threatResult?.data?.threatScore },
          });

          if (anthropicResult) {
            results.anthropicReasoning = anthropicResult;
          }
        }

        // Step 3: Apply automated prevention rules based on threat score
        const triggeredRules = PREVENTION_RULES?.filter(rule => {
          const score = threatResult?.data?.threatScore || 0;
          return score >= rule?.threshold;
        });

        for (const rule of triggeredRules) {
          results?.preventionRulesTriggered?.push(rule);
          const actionResult = await this.executePreventionAction(rule, threatResult?.data);
          results?.actionsExecuted?.push({ rule: rule?.id, action: rule?.action, result: actionResult });
        }
      }

      analytics?.trackEvent('unified_prevention_analysis_run', {
        threat_score: results?.perplexityForecast?.threatScore || 0,
        rules_triggered: results?.preventionRulesTriggered?.length,
        actions_executed: results?.actionsExecuted?.length,
      });

    } catch (error) {
      console.warn('[UnifiedPrevention] Analysis error:', error?.message);
      results.error = error?.message;
    }

    return results;
  },

  /**
   * Execute a specific prevention action
   */
  async executePreventionAction(rule, threatData) {
    try {
      switch (rule?.action) {
        case 'activate_enhanced_fraud_detection':
          // Create incident to trigger enhanced fraud detection
          await incidentResponseService?.createIncident({
            incidentType: 'fraud_detection',
            description: `Automated: Enhanced fraud detection activated. Threat score: ${threatData?.threatScore}`,
            threatLevel: rule?.severity,
            enableThreatAnalysis: false,
            autoTriggered: true,
          });
          break;

        case 'enable_gemini_failover':
          // Signal AI failover (logged for monitoring)
          console.info('[UnifiedPrevention] Gemini failover signaled due to AI service overload prediction');
          break;

        default:
          console.info(`[UnifiedPrevention] Action ${rule?.action} logged for manual review`);
      }

      // Notify via Discord if configured
      if (rule?.severity === 'critical' || rule?.severity === 'high') {
        await discordWebhookService?.sendSystemAlert({
          title: `Prevention Rule Triggered: ${rule?.id}`,
          message: `Action: ${rule?.action} | Threat Score: ${threatData?.threatScore || 'N/A'}`,
          type: 'Prevention',
          severity: rule?.severity,
        });
      }

      return { success: true, action: rule?.action };
    } catch (error) {
      console.warn(`[UnifiedPrevention] Failed to execute ${rule?.action}:`, error?.message);
      return { success: false, error: error?.message };
    }
  },

  /**
   * Get prevention rules configuration
   */
  getPreventionRules() {
    return PREVENTION_RULES;
  },

  /**
   * Validate all required services are configured
   */
  validateConfiguration() {
    return {
      perplexity: !!import.meta.env?.VITE_PERPLEXITY_API_KEY,
      anthropic: !!import.meta.env?.VITE_ANTHROPIC_API_KEY,
      discord: discordWebhookService?.isConfigured(),
      rulesCount: PREVENTION_RULES?.length,
    };
  },
};

export default unifiedPreventionService;