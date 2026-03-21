import axios from 'axios';
import { supabase } from '../lib/supabase';

const apiKey = import.meta.env?.VITE_PERPLEXITY_API_KEY;
const baseURL = 'https://api.perplexity.ai';

/**
 * Maps Perplexity API error status codes to user-friendly error messages.
 */
function getErrorMessage(error) {
  if (!error?.response && error?.message?.includes('API key')) {
    return { isInternal: true, message: 'There\'s an issue with your API key.' };
  }

  if (!error?.response?.status) {
    return { isInternal: false, message: error?.message || 'An unexpected error occurred' };
  }

  const status = error?.response?.status;
  const errorData = error?.response?.data;

  if (status === 401) {
    return { isInternal: true, message: 'There\'s an issue with your API key.' };
  } else if (status === 403) {
    return { isInternal: true, message: 'Your API key does not have permission to use the specified resource.' };
  } else if (status === 404) {
    return { isInternal: true, message: 'The requested resource was not found.' };
  } else if (status === 429) {
    return { isInternal: true, message: 'Your account has hit a rate limit.' };
  } else if (status >= 500) {
    return { isInternal: true, message: 'An unexpected error has occurred.' };
  } else {
    return { isInternal: false, message: errorData?.error?.message || errorData?.message || `HTTP error! status: ${status}` };
  }
}

const perplexityThreatIntelligenceService = {
  /**
   * Performs deep-dive threat pattern analysis with extended reasoning
   */
  async analyzeDeepThreatPatterns(threatData) {
    if (!apiKey) {
      throw new Error('Perplexity API key is missing. Please configure VITE_PERPLEXITY_API_KEY.');
    }

    const systemMessage = `You are an advanced threat intelligence analyst specializing in:
- Behavioral pattern evolution analysis
- Multi-vector attack prediction
- 60-90 day forecasting horizons
- Cross-domain threat correlation
- Regulatory compliance forecasting

Provide extended reasoning with step-by-step analysis, evidence correlation, and predictive modeling.`;

    const userMessage = `Analyze these threat patterns:

Threat Type: ${threatData?.type}
Observed Patterns: ${JSON.stringify(threatData?.patterns)}
Historical Data: ${JSON.stringify(threatData?.historical)}
Current Indicators: ${JSON.stringify(threatData?.indicators)}

Provide:
1. Pattern evolution analysis
2. 60-90 day threat forecast
3. Multi-vector attack scenarios
4. Confidence intervals
5. Mitigation strategies`;

    try {
      const response = await axios?.post(
        `${baseURL}/chat/completions`,
        {
          model: 'sonar-reasoning-pro',
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: userMessage }
          ],
          max_tokens: 4096,
          temperature: 0.4,
          return_related_questions: true,
          search_recency_filter: 'month',
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        analysis: response?.data?.choices?.[0]?.message?.content,
        usage: response?.data?.usage,
        searchResults: response?.data?.search_results || [],
        relatedQuestions: response?.data?.related_questions || [],
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      const err = new Error(errorInfo.message);
      err.statusCode = error?.response?.status;
      
      if (!errorInfo?.isInternal) {
        console.error('Perplexity threat analysis error:', err);
      }
      throw err;
    }
  },

  /**
   * Performs cross-domain correlation analysis
   */
  async analyzeCrossDomainCorrelation(domains) {
    if (!apiKey) {
      throw new Error('Perplexity API key is missing. Please configure VITE_PERPLEXITY_API_KEY.');
    }

    const systemMessage = `You are a cross-domain threat correlation specialist. Analyze patterns across:
- Financial systems
- User behavior analytics
- Compliance monitoring
- Payment processing
- Content moderation

Identify hidden correlations, shared indicators, and coordinated threat patterns.`;

    const userMessage = `Correlate threat patterns across domains:

Domains: ${JSON.stringify(domains)}

Provide:
1. Cross-domain correlation matrix
2. Shared threat indicators
3. Coordinated attack patterns
4. Real-time pattern matching
5. Automated threat intelligence sharing recommendations`;

    try {
      const response = await axios?.post(
        `${baseURL}/chat/completions`,
        {
          model: 'sonar-reasoning-pro',
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: userMessage }
          ],
          max_tokens: 3072,
          temperature: 0.3,
          return_related_questions: true,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        correlation: response?.data?.choices?.[0]?.message?.content,
        usage: response?.data?.usage,
        searchResults: response?.data?.search_results || [],
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      const err = new Error(errorInfo.message);
      err.statusCode = error?.response?.status;
      
      if (!errorInfo?.isInternal) {
        console.error('Perplexity correlation analysis error:', err);
      }
      throw err;
    }
  },

  /**
   * Forecasts regulatory compliance changes
   */
  async forecastRegulatoryCompliance(jurisdiction) {
    if (!apiKey) {
      throw new Error('Perplexity API key is missing. Please configure VITE_PERPLEXITY_API_KEY.');
    }

    const systemMessage = `You are a regulatory compliance forecasting specialist. Analyze:
- Upcoming regulatory changes
- Compliance risk assessments
- Jurisdiction-specific intelligence
- Automated policy adjustment recommendations
- Industry trend analysis`;

    const userMessage = `Forecast regulatory compliance for:

Jurisdiction: ${jurisdiction}
Current Compliance Status: Active monitoring

Provide:
1. Predicted regulatory changes (next 90 days)
2. Compliance risk assessment
3. Policy adjustment recommendations
4. Industry-specific intelligence
5. Proactive mitigation strategies`;

    try {
      const response = await axios?.post(
        `${baseURL}/chat/completions`,
        {
          model: 'sonar-pro',
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: userMessage }
          ],
          max_tokens: 2048,
          temperature: 0.3,
          search_recency_filter: 'month',
          return_related_questions: true,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        forecast: response?.data?.choices?.[0]?.message?.content,
        usage: response?.data?.usage,
        searchResults: response?.data?.search_results || [],
        relatedQuestions: response?.data?.related_questions || [],
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      const err = new Error(errorInfo.message);
      err.statusCode = error?.response?.status;
      
      if (!errorInfo?.isInternal) {
        console.error('Perplexity compliance forecast error:', err);
      }
      throw err;
    }
  },

  /**
   * Performs automated threat hunting
   */
  async performThreatHunting(huntingQuery) {
    if (!apiKey) {
      throw new Error('Perplexity API key is missing. Please configure VITE_PERPLEXITY_API_KEY.');
    }

    try {
      const response = await axios?.post(
        `${baseURL}/search`,
        {
          query: huntingQuery,
          max_results: 15,
          max_tokens: 30000,
          search_recency_filter: 'week',
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response?.data?.results;
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      const err = new Error(errorInfo.message);
      err.statusCode = error?.response?.status;
      
      if (!errorInfo?.isInternal) {
        console.error('Perplexity threat hunting error:', err);
      }
      throw err;
    }
  },

  /**
   * Threat scenarios derived from fraud alerts, moderation flags, and system failures (Supabase).
   */
  async getThreatScenarios() {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    try {
      const [fraudRes, flagsRes, failuresRes] = await Promise.all([
        supabase
          ?.from('fraud_alerts')
          ?.select('id, alert_type, severity, description, status, metadata, created_at')
          ?.gte('created_at', since)
          ?.order('created_at', { ascending: false })
          ?.limit(25),
        supabase
          ?.from('content_flags')
          ?.select('id, violation_type, severity, status, content_snippet, created_at')
          ?.in('status', ['pending_review', 'under_review', 'escalated'])
          ?.gte('created_at', since)
          ?.order('created_at', { ascending: false })
          ?.limit(25),
        supabase
          ?.from('system_failures')
          ?.select('id, failure_type, severity, description, created_at')
          ?.gte('created_at', since)
          ?.order('created_at', { ascending: false })
          ?.limit(15),
      ]);

      if (fraudRes?.error) throw fraudRes.error;
      if (flagsRes?.error) throw flagsRes.error;
      if (failuresRes?.error) throw failuresRes.error;

      const scenarios = [];

      (fraudRes?.data || []).forEach((row) => {
        const conf = row?.metadata?.confidence != null
          ? Math.round(Number(row.metadata.confidence) * 100)
          : severityToConfidence(row?.severity);
        scenarios.push({
          id: `TS-FRA-${row?.id}`,
          name: row?.description || `${row?.alert_type || 'Fraud'} alert`,
          severity: row?.severity || 'medium',
          forecastHorizon: '30 days',
          confidence: Math.min(100, Math.max(0, conf)),
          affectedDomains: row?.metadata?.domains || ['payments', 'user_behavior'],
          predictedImpact: `Open cases in fraud pipeline — status: ${row?.status || 'open'}`,
          mitigationStatus: row?.status === 'resolved' ? 'mitigated' : 'monitoring',
        });
      });

      (flagsRes?.data || []).forEach((row) => {
        scenarios.push({
          id: `TS-MOD-${row?.id}`,
          name: row?.content_snippet?.slice(0, 80) || `${row?.violation_type || 'Moderation'} queue item`,
          severity: row?.severity || 'medium',
          forecastHorizon: '30 days',
          confidence: severityToConfidence(row?.severity),
          affectedDomains: ['content_moderation', 'compliance', 'elections'],
          predictedImpact: `Moderation pipeline — ${row?.status || 'pending'}`,
          mitigationStatus: row?.status === 'escalated' ? 'in_progress' : 'monitoring',
        });
      });

      (failuresRes?.data || []).forEach((row) => {
        scenarios.push({
          id: `TS-SYS-${row?.id}`,
          name: row?.description || `${row?.failure_type || 'System'} failure`,
          severity: row?.severity || 'medium',
          forecastHorizon: '14 days',
          confidence: severityToConfidence(row?.severity),
          affectedDomains: ['platform_health', 'operations'],
          predictedImpact: 'Infrastructure / reliability signal',
          mitigationStatus: 'investigating',
        });
      });

      return scenarios.sort(
        (a, b) => (b.confidence || 0) - (a.confidence || 0),
      );
    } catch (e) {
      console.error('getThreatScenarios:', e);
      return [];
    }
  },

  /**
   * Compliance-oriented signals from moderation and revenue anomaly tables (Supabase).
   */
  async getComplianceForecasts() {
    const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    try {
      const [flagsRes, anomaliesRes] = await Promise.all([
        supabase
          ?.from('content_flags')
          ?.select('violation_type, severity, status, created_at')
          ?.gte('created_at', since),
        supabase
          ?.from('revenue_anomalies')
          ?.select('anomaly_type, severity, amount, description, created_at')
          ?.gte('created_at', since),
      ]);

      if (flagsRes?.error) throw flagsRes.error;
      if (anomaliesRes?.error) throw anomaliesRes.error;

      const byViolation = {};
      (flagsRes?.data || []).forEach((row) => {
        const k = row?.violation_type || 'other';
        byViolation[k] = (byViolation[k] || 0) + 1;
      });

      const forecasts = Object.entries(byViolation).map(([violationType, count]) => {
        const risk = count > 20 ? 'high' : count > 5 ? 'medium' : 'low';
        const prep = Math.max(40, 100 - Math.min(60, count * 2));
        return {
          jurisdiction: 'Global',
          regulationType: `Content & integrity — ${violationType.replace(/_/g, ' ')}`,
          predictedChange: `${count} flagged items in the last 90 days — prioritize policy review`,
          effectiveDate: null,
          riskLevel: risk,
          preparednessScore: prep,
          recommendedActions: [
            'Review moderation queue for this violation type',
            'Update playbooks and moderator guidance',
            'Export audit sample for legal/compliance review',
          ],
        };
      });

      const revenueRows = anomaliesRes?.data || [];
      if (revenueRows.length > 0) {
        const total = revenueRows.length;
        const high = revenueRows.filter((r) => r?.severity === 'high' || r?.severity === 'critical').length;
        forecasts.push({
          jurisdiction: 'Global',
          regulationType: 'Financial reconciliation',
          predictedChange: `${total} revenue anomaly records — ${high} high/critical severity`,
          effectiveDate: null,
          riskLevel: high > 3 ? 'high' : 'medium',
          preparednessScore: Math.max(35, 95 - total),
          recommendedActions: [
            'Reconcile FX and payout records',
            'Validate anomaly metadata with finance ops',
          ],
        });
      }

      return forecasts;
    } catch (e) {
      console.error('getComplianceForecasts:', e);
      return [];
    }
  },

  /**
   * Cross-domain correlations from overlapping user activity (fraud alerts × votes) and moderation × flags volume.
   */
  async getCrossDomainCorrelations() {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    try {
      const [fraudRes, votesRes, modRes] = await Promise.all([
        supabase
          ?.from('fraud_alerts')
          ?.select('user_id, created_at')
          ?.not('user_id', 'is', null)
          ?.gte('created_at', since),
        supabase
          ?.from('votes')
          ?.select('user_id, created_at')
          ?.gte('created_at', since)
          ?.limit(5000),
        supabase
          ?.from('content_moderation_results')
          ?.select('id, auto_removed, created_at')
          ?.gte('created_at', since),
      ]);

      if (fraudRes?.error) throw fraudRes.error;
      if (votesRes?.error) throw votesRes.error;
      if (modRes?.error) throw modRes.error;

      const fraudUsers = new Set(
        (fraudRes?.data || []).map((r) => r?.user_id).filter(Boolean),
      );
      let overlapVotes = 0;
      const overlapUserSet = new Set();
      (votesRes?.data || []).forEach((v) => {
        if (v?.user_id && fraudUsers.has(v.user_id)) {
          overlapVotes += 1;
          overlapUserSet.add(v.user_id);
        }
      });

      const correlations = [];
      const voteCount = votesRes?.data?.length || 0;
      if (overlapUserSet.size > 0) {
        const strength = Math.min(
          0.98,
          overlapVotes / Math.max(voteCount, 1),
        );
        correlations.push({
          correlationId: `COR-VOTE-${Date.now()}`,
          domains: ['user_behavior', 'elections', 'payments'],
          pattern:
            `${overlapUserSet.size} user(s) had fraud alerts and recent vote activity (${overlapVotes} overlapping vote events)`,
          strength: Number(strength.toFixed(3)),
          detectedAt: new Date().toISOString(),
          affectedUsers: overlapUserSet.size,
          status: overlapVotes > 10 ? 'investigating' : 'monitoring',
        });
      }

      const modRows = modRes?.data || [];
      const removals = modRows.filter((r) => r?.auto_removed === true).length;
      if (modRows.length > 0) {
        const strength = removals / modRows.length;
        correlations.push({
          correlationId: `COR-MOD-${Date.now()}`,
          domains: ['content_moderation', 'compliance'],
          pattern: `Automated moderation load: ${removals} auto-removals of ${modRows.length} scored items`,
          strength: Number(Math.min(0.98, strength + 0.1).toFixed(3)),
          detectedAt: new Date().toISOString(),
          affectedUsers: modRows.length,
          status: strength > 0.4 ? 'investigating' : 'mitigated',
        });
      }

      return correlations;
    } catch (e) {
      console.error('getCrossDomainCorrelations:', e);
      return [];
    }
  },
};

function severityToConfidence(severity) {
  const s = String(severity || '').toLowerCase();
  if (s === 'critical') return 92;
  if (s === 'high') return 78;
  if (s === 'medium') return 62;
  if (s === 'low') return 45;
  return 55;
}

export default perplexityThreatIntelligenceService;