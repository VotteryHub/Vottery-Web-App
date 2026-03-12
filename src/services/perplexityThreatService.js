import perplexityClient from '../lib/perplexity';
import { alertService } from './alertService';

function getErrorMessage(error) {
  if (!error?.response && error?.message?.includes('API key')) {
    return { isInternal: true, message: 'There\'s an issue with your Perplexity API key.' };
  }

  if (!error?.response?.status) {
    return { isInternal: false, message: error?.message || 'An unexpected error occurred' };
  }

  const status = error?.response?.status;

  if (status === 401) {
    return { isInternal: true, message: 'There\'s an issue with your Perplexity API key.' };
  } else if (status === 403) {
    return { isInternal: true, message: 'Your API key does not have permission to use the specified resource.' };
  } else if (status === 404) {
    return { isInternal: true, message: 'The requested resource was not found.' };
  } else if (status === 429) {
    return { isInternal: true, message: 'Your account has hit a rate limit.' };
  } else if (status >= 500) {
    return { isInternal: true, message: 'An unexpected error has occurred.' };
  } else {
    return { isInternal: false, message: error?.response?.data?.error?.message || `HTTP error! status: ${status}` };
  }
}

export const perplexityThreatService = {
  async analyzeThreatIntelligence(fraudData) {
    try {
      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-pro',
        messages: [
          {
            role: 'system',
            content: 'You are a cybersecurity threat intelligence expert specializing in real-time fraud detection and pattern analysis. Analyze fraud patterns, identify emerging threats, and provide actionable intelligence based on current threat landscape data.'
          },
          {
            role: 'user',
            content: `Analyze this fraud data for threat intelligence: ${JSON.stringify(fraudData)}. Identify threat patterns, emerging attack vectors, cross-platform correlations, and provide threat severity assessment with recommended countermeasures. Return response as JSON with fields: threatLevel (critical/high/medium/low), threatPatterns (array), attackVectors (array), crossPlatformIndicators (array), threatScore (0-100), confidence (0-1), countermeasures (array), threatIntelligenceSources (array), reasoning (string).`
          }
        ],
        temperature: 0.3,
        searchRecencyFilter: 'week',
        returnRelatedQuestions: true
      });

      const content = response?.choices?.[0]?.message?.content;
      let threatAnalysis;

      try {
        threatAnalysis = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          threatAnalysis = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse threat intelligence response');
        }
      }

      if (threatAnalysis?.threatScore >= 75) {
        await this.createThreatAlert(threatAnalysis, fraudData);
      }

      return {
        data: {
          ...threatAnalysis,
          searchResults: response?.search_results || [],
          relatedQuestions: response?.related_questions || []
        },
        error: null
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error analyzing threat intelligence:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async detectFraudPatterns(transactionData) {
    try {
      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-reasoning-pro',
        messages: [
          {
            role: 'system',
            content: 'You are an advanced fraud detection AI using chain-of-thought reasoning. Analyze transaction patterns for sophisticated fraud schemes, money laundering indicators, and coordinated attack patterns.'
          },
          {
            role: 'user',
            content: `Analyze these transactions for fraud patterns: ${JSON.stringify(transactionData)}. Identify behavioral anomalies, velocity patterns, geographic inconsistencies, and network-based fraud indicators. Return JSON with: fraudPatterns (array), anomalyTypes (array), riskScore (0-100), confidence (0-1), suspiciousIndicators (array), networkAnalysis (object), recommendedActions (array), reasoning (string).`
          }
        ],
        temperature: 0.2,
        searchRecencyFilter: 'day'
      });

      const content = response?.choices?.[0]?.message?.content;
      let patternAnalysis;

      try {
        patternAnalysis = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          patternAnalysis = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse fraud pattern response');
        }
      }

      return { data: patternAnalysis, error: null };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error detecting fraud patterns:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async searchThreatIntelligence(query, options = {}) {
    try {
      const response = await perplexityClient?.search(query, {
        maxResults: options?.maxResults || 10,
        searchRecencyFilter: options?.searchRecencyFilter || 'week',
        searchDomainFilter: options?.searchDomainFilter || [
          'cisa.gov',
          'us-cert.gov',
          'owasp.org',
          'krebsonsecurity.com',
          'threatpost.com'
        ]
      });

      return { data: response?.results || [], error: null };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error searching threat intelligence:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async createThreatAlert(threatAnalysis, fraudData) {
    try {
      const alertData = {
        title: `High Threat Detected: ${threatAnalysis?.threatLevel?.toUpperCase()}`,
        description: `Threat Score: ${threatAnalysis?.threatScore}/100. Patterns: ${threatAnalysis?.threatPatterns?.join(', ')}`,
        severity: threatAnalysis?.threatLevel === 'critical' ? 'critical' : 'high',
        category: 'fraud_detection',
        metadata: {
          threatAnalysis,
          fraudData,
          source: 'perplexity_threat_intelligence',
          detectionMethod: 'ai_threat_analysis'
        }
      };

      await alertService?.createSystemAlert(alertData);
    } catch (error) {
      console.error('Failed to create threat alert:', error);
    }
  },

  async analyzeAnomalyCorrelation(anomalyData) {
    try {
      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-pro',
        messages: [
          {
            role: 'system',
            content: 'You are an anomaly detection specialist. Analyze cross-platform anomalies and identify correlations that indicate coordinated fraud attempts or systemic vulnerabilities.'
          },
          {
            role: 'user',
            content: `Analyze these anomalies for correlations: ${JSON.stringify(anomalyData)}. Identify cross-platform patterns, temporal correlations, geographic clustering, and coordinated attack indicators. Return JSON with: correlationScore (0-100), correlatedAnomalies (array), attackCoordination (boolean), platformsAffected (array), temporalPattern (object), geographicClustering (object), confidence (0-1), recommendations (array).`
          }
        ],
        temperature: 0.4,
        searchRecencyFilter: 'month'
      });

      const content = response?.choices?.[0]?.message?.content;
      let correlationAnalysis;

      try {
        correlationAnalysis = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          correlationAnalysis = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse correlation response');
        }
      }

      return { data: correlationAnalysis, error: null };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error analyzing anomaly correlation:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  }
};