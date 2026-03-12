import axios from 'axios';
import { supabase } from '../lib/supabase';

const apiKey = import.meta.env?.VITE_ANTHROPIC_API_KEY;
const baseURL = 'https://api.anthropic.com/v1/messages';

function getErrorMessage(statusCode, errorData) {
  if (statusCode === 401) {
    return { isInternal: true, message: 'Invalid API key or authentication failed. Please check your Anthropic API key.' };
  } else if (statusCode === 403) {
    return { isInternal: true, message: 'Permission denied. Your API key does not have access to the specified resource.' };
  } else if (statusCode === 404) {
    return { isInternal: true, message: 'Resource not found. The requested endpoint or model may not exist.' };
  } else if (statusCode === 429) {
    return { isInternal: true, message: 'Rate limit exceeded. You are sending requests too quickly. Please wait a moment and try again.' };
  } else if (statusCode === 500) {
    return { isInternal: true, message: 'Anthropic service error. An unexpected error occurred on their servers. Please try again later.' };
  } else if (statusCode === 529) {
    return { isInternal: true, message: 'Anthropic service is temporarily overloaded. Please try again in a few moments.' };
  } else {
    return { isInternal: false, message: errorData?.error?.message || 'An unexpected error occurred. Please try again.' };
  }
}

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

export const anthropicSecurityReasoningService = {
  async analyzeSecurityIncident(incidentData) {
    if (!apiKey) {
      throw new Error('Anthropic API key is missing. Please configure VITE_ANTHROPIC_API_KEY.');
    }

    const systemPrompt = `You are an advanced security incident analyst with expertise in sophisticated reasoning on complex security events. Analyze security incidents with:
- Multi-layered threat assessment
- Attack vector identification and correlation
- Impact analysis across systems and data
- Confidence-scored findings
- Evidence-based reasoning chains

Provide structured analysis with actionable intelligence for incident response teams.`;

    const userPrompt = `Analyze this security incident with sophisticated reasoning:

Incident ID: ${incidentData?.id}
Type: ${incidentData?.type}
Severity: ${incidentData?.severity}
Description: ${incidentData?.description}
Affected Systems: ${JSON.stringify(incidentData?.affectedSystems)}
Detection Method: ${incidentData?.detectionMethod}
Timestamp: ${incidentData?.timestamp}
Evidence: ${JSON.stringify(incidentData?.evidence)}

Provide JSON with:
- threatAssessment (object with severity, category, sophistication, confidence, description)
- attackVectors (array with vector, likelihood, exploitability, confidence, description)
- impactAnalysis (object with dataImpact, systemImpact, businessImpact, overallImpact, confidence)
- reasoningChain (array with step, finding, evidence, confidence)
- indicators (array with type, value, confidence, context)
- relatedThreats (array with threatId, similarity, description)
- confidenceScore (0-100)`;

    try {
      const response = await axios?.post(
        baseURL,
        {
          model: 'claude-sonnet-4-5-20250929',
          messages: [
            { role: 'user', content: userPrompt }
          ],
          system: systemPrompt,
          max_tokens: 4096,
          temperature: 0.2,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
        }
      );

      const content = response?.data?.content?.[0]?.text;
      let analysis;

      try {
        analysis = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse incident analysis');
        }
      }

      await this.storeIncidentAnalysis(incidentData?.id, analysis);

      return {
        data: {
          ...analysis,
          analysisId: response?.data?.id,
          analyzedAt: new Date()?.toISOString()
        },
        error: null
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error?.response?.status, error?.response?.data);
      if (!errorInfo?.isInternal) {
        console.error('Security incident analysis error:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async performRootCauseAnalysis(incidentData) {
    if (!apiKey) {
      throw new Error('Anthropic API key is missing. Please configure VITE_ANTHROPIC_API_KEY.');
    }

    const systemPrompt = `You are a root cause analysis specialist for security incidents. Perform systematic investigation to identify:
- Primary root causes
- Contributing factors
- Vulnerability chains
- System weaknesses
- Process failures

Provide evidence-based analysis with confidence scoring for each finding.`;

    const userPrompt = `Perform root cause analysis for this security incident:

Incident: ${JSON.stringify(incidentData)}

Provide JSON with:
- primaryRootCause (object with cause, description, evidence, confidence, severity)
- contributingFactors (array with factor, description, impact, confidence)
- vulnerabilityChain (array with step, vulnerability, exploited, confidence)
- systemWeaknesses (array with system, weakness, severity, confidence, remediation)
- processFailures (array with process, failure, impact, confidence)
- timeline (array with timestamp, event, significance, confidence)
- confidenceScore (0-100)`;

    try {
      const response = await axios?.post(
        baseURL,
        {
          model: 'claude-sonnet-4-5-20250929',
          messages: [
            { role: 'user', content: userPrompt }
          ],
          system: systemPrompt,
          max_tokens: 4096,
          temperature: 0.2,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
        }
      );

      const content = response?.data?.content?.[0]?.text;
      let analysis;

      try {
        analysis = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse root cause analysis');
        }
      }

      return {
        data: {
          ...analysis,
          analysisId: response?.data?.id,
          analyzedAt: new Date()?.toISOString()
        },
        error: null
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error?.response?.status, error?.response?.data);
      if (!errorInfo?.isInternal) {
        console.error('Root cause analysis error:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async generateRemediationStrategy(incidentData, rootCauseAnalysis) {
    if (!apiKey) {
      throw new Error('Anthropic API key is missing. Please configure VITE_ANTHROPIC_API_KEY.');
    }

    const systemPrompt = `You are a security remediation strategist. Generate comprehensive remediation strategies with:
- Immediate containment actions
- Short-term remediation steps
- Long-term preventive measures
- Resource requirements
- Implementation priorities
- Confidence-scored recommendations

Provide actionable, prioritized strategies with clear implementation guidance.`;

    const userPrompt = `Generate remediation strategy for this security incident:

Incident: ${JSON.stringify(incidentData)}
Root Cause Analysis: ${JSON.stringify(rootCauseAnalysis)}

Provide JSON with:
- immediateActions (array with action, priority, timeframe, resources, confidence)
- shortTermRemediation (array with action, priority, timeframe, resources, impact, confidence)
- longTermPrevention (array with measure, priority, timeframe, resources, effectiveness, confidence)
- automatedResponses (array with trigger, action, automation, confidence)
- resourceRequirements (object with personnel, tools, budget, timeline)
- implementationPlan (array with phase, actions, duration, dependencies, confidence)
- successMetrics (array with metric, target, measurement, confidence)
- overallConfidence (0-100)`;

    try {
      const response = await axios?.post(
        baseURL,
        {
          model: 'claude-sonnet-4-5-20250929',
          messages: [
            { role: 'user', content: userPrompt }
          ],
          system: systemPrompt,
          max_tokens: 4096,
          temperature: 0.3,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
        }
      );

      const content = response?.data?.content?.[0]?.text;
      let strategy;

      try {
        strategy = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          strategy = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse remediation strategy');
        }
      }

      return {
        data: {
          ...strategy,
          strategyId: response?.data?.id,
          generatedAt: new Date()?.toISOString()
        },
        error: null
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error?.response?.status, error?.response?.data);
      if (!errorInfo?.isInternal) {
        console.error('Remediation strategy generation error:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async getActiveIncidents() {
    try {
      const { data, error } = await supabase
        ?.from('security_incidents')
        ?.select('*')
        ?.in('status', ['open', 'investigating', 'in_progress'])
        ?.order('created_at', { ascending: false })
        ?.limit(50);

      if (error) throw error;

      return { data: toCamelCase(data) || [], error: null };
    } catch (error) {
      return { data: [], error: { message: error?.message } };
    }
  },

  async storeIncidentAnalysis(incidentId, analysis) {
    try {
      const { data, error } = await supabase
        ?.from('incident_analyses')
        ?.insert([toSnakeCase({
          incidentId,
          analysis,
          analyzedAt: new Date()?.toISOString()
        })])
        ?.select()
        ?.single();

      return { data: toCamelCase(data), error };
    } catch (error) {
      console.error('Failed to store incident analysis:', error);
      return { data: null, error };
    }
  },

  async getIncidentAnalysisHistory(incidentId) {
    try {
      const { data, error } = await supabase
        ?.from('incident_analyses')
        ?.select('*')
        ?.eq('incident_id', incidentId)
        ?.order('analyzed_at', { ascending: false });

      if (error) throw error;

      return { data: toCamelCase(data) || [], error: null };
    } catch (error) {
      return { data: [], error: { message: error?.message } };
    }
  }
};