import axios from 'axios';

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
   * Mock data for threat scenarios
   */
  async getThreatScenarios() {
    return [
      {
        id: 'TS-2024-001',
        name: 'Coordinated Account Takeover Campaign',
        severity: 'critical',
        forecastHorizon: '60 days',
        confidence: 87,
        affectedDomains: ['authentication', 'payments', 'user_behavior'],
        predictedImpact: 'High - potential 2,500+ accounts at risk',
        mitigationStatus: 'in_progress',
      },
      {
        id: 'TS-2024-002',
        name: 'Emerging Payment Fraud Pattern',
        severity: 'high',
        forecastHorizon: '90 days',
        confidence: 72,
        affectedDomains: ['payments', 'compliance'],
        predictedImpact: 'Medium - estimated $45K exposure',
        mitigationStatus: 'monitoring',
      },
      {
        id: 'TS-2024-003',
        name: 'Cross-Platform Bot Network',
        severity: 'medium',
        forecastHorizon: '75 days',
        confidence: 65,
        affectedDomains: ['content_moderation', 'elections', 'user_behavior'],
        predictedImpact: 'Medium - election integrity concerns',
        mitigationStatus: 'planned',
      },
    ];
  },

  /**
   * Mock data for compliance forecasts
   */
  async getComplianceForecasts() {
    return [
      {
        jurisdiction: 'EU',
        regulationType: 'Data Privacy',
        predictedChange: 'Enhanced AI transparency requirements',
        effectiveDate: '2024-06-01',
        riskLevel: 'high',
        preparednessScore: 68,
        recommendedActions: ['Update privacy policies', 'Implement AI disclosure', 'Train compliance team'],
      },
      {
        jurisdiction: 'US',
        regulationType: 'Financial Services',
        predictedChange: 'Stricter KYC verification for digital platforms',
        effectiveDate: '2024-08-15',
        riskLevel: 'medium',
        preparednessScore: 82,
        recommendedActions: ['Enhance identity verification', 'Update onboarding flow'],
      },
    ];
  },

  /**
   * Mock data for cross-domain correlations
   */
  async getCrossDomainCorrelations() {
    return [
      {
        correlationId: 'COR-2024-001',
        domains: ['payments', 'user_behavior', 'elections'],
        pattern: 'Suspicious voting patterns linked to payment anomalies',
        strength: 0.84,
        detectedAt: '2024-01-20T12:00:00Z',
        affectedUsers: 127,
        status: 'investigating',
      },
      {
        correlationId: 'COR-2024-002',
        domains: ['content_moderation', 'compliance'],
        pattern: 'Policy violations clustering in specific jurisdictions',
        strength: 0.76,
        detectedAt: '2024-01-19T08:30:00Z',
        affectedUsers: 89,
        status: 'mitigated',
      },
    ];
  },
};

export default perplexityThreatIntelligenceService;