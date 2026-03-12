import axios from 'axios';
import { supabase } from '../lib/supabase';
import openai from '../lib/openai';

const perplexityApiKey = import.meta.env?.VITE_PERPLEXITY_API_KEY;
const claudeApiKey = import.meta.env?.VITE_ANTHROPIC_API_KEY;

function getPerplexityErrorMessage(error) {
  if (!error?.response && error?.message?.includes('API key')) {
    return { isInternal: true, message: 'There\'s an issue with your API key.' };
  }
  if (!error?.response?.status) {
    return { isInternal: false, message: error?.message || 'An unexpected error occurred' };
  }
  const status = error?.response?.status;
  if (status === 401 || status === 403 || status === 404 || status === 429 || status >= 500) {
    return { isInternal: true, message: 'There\'s an issue with the Perplexity service.' };
  }
  return { isInternal: false, message: error?.response?.data?.error?.message || `HTTP error! status: ${status}` };
}

function getClaudeErrorMessage(statusCode, errorData) {
  if (statusCode === 401 || statusCode === 403 || statusCode === 404 || statusCode === 429 || statusCode === 500 || statusCode === 529) {
    return { isInternal: true, message: 'There\'s an issue with the Claude service.' };
  }
  return { isInternal: false, message: errorData?.error?.message || 'An unexpected error occurred.' };
}

function getOpenAIErrorMessage(error) {
  if (error?.status === 401 || error?.status === 403 || error?.status === 429 || error?.status >= 500) {
    return { isInternal: true, message: 'There\'s an issue with the OpenAI service.' };
  }
  return { isInternal: false, message: error?.message || 'An unexpected error occurred.' };
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

export const crossDomainIntelligenceService = {
  async consolidateIntelligence(domains) {
    const results = await Promise.allSettled([
      this.getPerplexityThreatIntelligence(domains),
      this.getClaudeDisputePatterns(domains),
      this.getOpenAISemanticMatching(domains),
      this.getPlatformAnalytics(domains),
    ]);

    const intelligence = {
      perplexityInsights: results?.[0]?.status === 'fulfilled' ? results?.[0]?.value : null,
      claudeInsights: results?.[1]?.status === 'fulfilled' ? results?.[1]?.value : null,
      openaiInsights: results?.[2]?.status === 'fulfilled' ? results?.[2]?.value : null,
      platformInsights: results?.[3]?.status === 'fulfilled' ? results?.[3]?.value : null,
      consolidatedAt: new Date()?.toISOString(),
    };

    return intelligence;
  },

  async getPerplexityThreatIntelligence(domains) {
    if (!perplexityApiKey) {
      throw new Error('Perplexity API key is missing.');
    }

    const systemMessage = `You are a threat intelligence analyst. Analyze threat patterns across multiple domains:
- Financial systems security
- User behavior anomalies
- Payment fraud patterns
- Compliance risks

Provide consolidated threat intelligence with confidence scores.`;

    const userMessage = `Analyze threat patterns across these domains:

Domains: ${JSON.stringify(domains)}

Provide:
1. Cross-domain threat correlations
2. Emerging threat patterns
3. Risk severity assessments
4. Predictive threat forecasting (30-90 days)
5. Mitigation recommendations`;

    try {
      const response = await axios?.post(
        'https://api.perplexity.ai/chat/completions',
        {
          model: 'sonar-reasoning-pro',
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: userMessage }
          ],
          max_tokens: 3072,
          temperature: 0.4,
          return_related_questions: true,
        },
        {
          headers: {
            'Authorization': `Bearer ${perplexityApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        source: 'perplexity',
        analysis: response?.data?.choices?.[0]?.message?.content,
        confidence: 0.85,
        searchResults: response?.data?.search_results || [],
      };
    } catch (error) {
      const errorInfo = getPerplexityErrorMessage(error);
      if (!errorInfo?.isInternal) {
        console.error('Perplexity intelligence error:', error);
      }
      throw new Error(errorInfo.message);
    }
  },

  async getClaudeDisputePatterns(domains) {
    if (!claudeApiKey) {
      throw new Error('Claude API key is missing.');
    }

    const systemPrompt = `You are a dispute resolution analyst. Analyze patterns across:
- Payment disputes
- Policy violations
- Compliance conflicts
- User behavior patterns

Provide nuanced insights with reasoning chains.`;

    const userPrompt = `Analyze dispute and decision patterns:

Domains: ${JSON.stringify(domains)}

Provide:
1. Dispute pattern analysis
2. Decision accuracy trends
3. Compliance risk indicators
4. Fairness assessments
5. Strategic recommendations`;

    try {
      const response = await axios?.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-sonnet-4-5-20250929',
          messages: [{ role: 'user', content: userPrompt }],
          system: systemPrompt,
          max_tokens: 2048,
          temperature: 0.3,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': claudeApiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
        }
      );

      return {
        source: 'claude',
        analysis: response?.data?.content?.[0]?.text,
        confidence: 0.88,
      };
    } catch (error) {
      const errorInfo = getClaudeErrorMessage(error?.response?.status, error?.response?.data);
      if (!errorInfo?.isInternal) {
        console.error('Claude intelligence error:', error);
      }
      throw new Error(errorInfo.message);
    }
  },

  async getOpenAISemanticMatching(domains) {
    try {
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-5-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a semantic analysis expert. Analyze content patterns and user behavior correlations across multiple domains.'
          },
          {
            role: 'user',
            content: `Analyze semantic patterns across domains: ${JSON.stringify(domains)}\n\nProvide:\n1. Content pattern analysis\n2. User behavior correlations\n3. Engagement predictions\n4. Recommendation optimization\n5. Strategic insights`
          }
        ],
        reasoning_effort: 'medium',
        verbosity: 'medium',
      });

      return {
        source: 'openai',
        analysis: response?.choices?.[0]?.message?.content,
        confidence: 0.82,
      };
    } catch (error) {
      const errorInfo = getOpenAIErrorMessage(error);
      if (!errorInfo?.isInternal) {
        console.error('OpenAI intelligence error:', error);
      }
      throw new Error(errorInfo.message);
    }
  },

  async getPlatformAnalytics(domains) {
    try {
      const queries = domains?.map(domain => {
        switch (domain) {
          case 'financial':
            return supabase?.from('financial_tracking')?.select('*')?.limit(100);
          case 'user_behavior':
            return supabase?.from('user_engagement_signals')?.select('*')?.limit(100);
          case 'compliance':
            return supabase?.from('policy_violations')?.select('*')?.limit(100);
          case 'incidents':
            return supabase?.from('incident_response_workflows')?.select('*')?.limit(100);
          default:
            return null;
        }
      })?.filter(Boolean);

      const results = await Promise.allSettled(queries);
      const data = results?.map((r, i) => ({
        domain: domains?.[i],
        data: r?.status === 'fulfilled' ? toCamelCase(r?.value?.data) : [],
      }));

      return {
        source: 'platform',
        data,
        confidence: 0.95,
      };
    } catch (error) {
      console.error('Platform analytics error:', error);
      throw error;
    }
  },

  async generateStrategicRecommendations(intelligence) {
    const allInsights = [
      intelligence?.perplexityInsights?.analysis,
      intelligence?.claudeInsights?.analysis,
      intelligence?.openaiInsights?.analysis,
    ]?.filter(Boolean)?.join('\n\n');

    try {
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-5',
        messages: [
          {
            role: 'system',
            content: 'You are a strategic intelligence analyst. Synthesize insights from multiple AI services into actionable strategic recommendations.'
          },
          {
            role: 'user',
            content: `Synthesize these intelligence insights into strategic recommendations:\n\n${allInsights}\n\nProvide:\n1. Key findings summary\n2. Strategic recommendations\n3. Risk mitigation strategies\n4. Optimization opportunities\n5. Implementation priorities`
          }
        ],
        reasoning_effort: 'high',
        verbosity: 'high',
      });

      return {
        recommendations: response?.choices?.[0]?.message?.content,
        generatedAt: new Date()?.toISOString(),
      };
    } catch (error) {
      const errorInfo = getOpenAIErrorMessage(error);
      if (!errorInfo?.isInternal) {
        console.error('Strategic recommendations error:', error);
      }
      throw new Error(errorInfo.message);
    }
  },
};