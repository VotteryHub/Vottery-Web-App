import claude from '../lib/claude';
import { supabase } from '../lib/supabase';
import { analytics } from '../hooks/useGoogleAnalytics';

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

export const anthropicContentAnalysisService = {
  async analyzeContextAwareHateSpeech(contentData) {
    try {
      const { content, context, culturalContext } = contentData;

      const prompt = `You are an expert content moderation AI with deep understanding of cultural context, sarcasm, and implicit bias.

Analyze this content for hate speech considering cultural nuances:

Content: "${content}"
Context: ${context || 'No additional context provided'}
Cultural Context: ${culturalContext || 'General'}

Evaluate for:
1. Explicit hate speech and slurs
2. Implicit bias and coded language
3. Sarcasm and irony that may mask hate speech
4. Cultural context that affects interpretation
5. Dog whistles and euphemisms
6. Targeted harassment patterns

Provide analysis as JSON with:
- isHateSpeech (boolean)
- confidenceScore (0-100)
- hateSpeechType (array: explicit, implicit, coded, sarcastic, cultural)
- targetedGroups (array)
- culturalConsiderations (string)
- reasoningChain (array of reasoning steps)
- severity (critical, high, medium, low, none)
- recommendedAction (block, review, flag, allow)
- explanation (detailed reasoning)`;

      const response = await claude?.messages?.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }]
      });

      const content_text = response?.content?.[0]?.text;
      let analysis;

      try {
        analysis = JSON.parse(content_text);
      } catch (parseError) {
        const jsonMatch = content_text?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse AI analysis response');
        }
      }

      analytics?.trackEvent('hate_speech_analysis_completed', {
        confidence: analysis?.confidenceScore,
        is_violation: analysis?.isHateSpeech,
        severity: analysis?.severity
      });

      return { data: analysis, error: null };
    } catch (error) {
      if (error?.status) {
        const errorInfo = getErrorMessage(error?.status, error);
        const err = new Error(errorInfo?.message);
        err.statusCode = error?.status;
        if (!errorInfo?.isInternal) {
          console.error('Anthropic API error:', err);
        }
        throw err;
      }
      throw error;
    }
  },

  async detectMisinformation(contentData) {
    try {
      const { content, contentType, electionContext } = contentData;

      const prompt = `You are an expert fact-checker and misinformation detection AI specializing in election content.

Analyze this ${contentType} for misinformation:

Content: "${content}"
Election Context: ${electionContext || 'General election content'}

Evaluate for:
1. Factual accuracy and verifiable claims
2. Source credibility and citation quality
3. Narrative manipulation and framing bias
4. Deepfakes and synthetic media indicators
5. Coordinated disinformation campaigns
6. Election interference patterns
7. Misleading statistics or data visualization

Provide analysis as JSON with:
- isMisinformation (boolean)
- confidenceScore (0-100)
- misinformationType (array: false_claim, misleading_context, manipulated_media, conspiracy_theory)
- factCheckResults (array of claim verifications)
- sourceCredibility (0-100)
- narrativeManipulation (string)
- reasoningChain (array of reasoning steps)
- severity (critical, high, medium, low, none)
- recommendedAction (block, fact_check_label, review, allow)
- explanation (detailed reasoning)
- suggestedCorrection (string)`;

      const response = await claude?.messages?.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }]
      });

      const content_text = response?.content?.[0]?.text;
      let analysis;

      try {
        analysis = JSON.parse(content_text);
      } catch (parseError) {
        const jsonMatch = content_text?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse AI analysis response');
        }
      }

      analytics?.trackEvent('misinformation_analysis_completed', {
        confidence: analysis?.confidenceScore,
        is_misinformation: analysis?.isMisinformation,
        severity: analysis?.severity
      });

      return { data: analysis, error: null };
    } catch (error) {
      if (error?.status) {
        const errorInfo = getErrorMessage(error?.status, error);
        const err = new Error(errorInfo?.message);
        err.statusCode = error?.status;
        if (!errorInfo?.isInternal) {
          console.error('Anthropic API error:', err);
        }
        throw err;
      }
      throw error;
    }
  },

  async assessPolicyViolation(contentData) {
    try {
      const { content, policyType, edgeCaseScenario } = contentData;

      const prompt = `You are an expert policy enforcement AI with nuanced understanding of edge cases and contextual decision-making.

Analyze this content for policy violations:

Content: "${content}"
Policy Type: ${policyType}
Edge Case Scenario: ${edgeCaseScenario || 'Standard evaluation'}

Evaluate for:
1. Clear policy violations
2. Edge cases requiring human judgment
3. Contextual factors affecting interpretation
4. Intent vs. impact analysis
5. Precedent-based decision making
6. Proportional response assessment

Provide analysis as JSON with:
- isPolicyViolation (boolean)
- confidenceScore (0-100)
- violationType (array)
- edgeCaseComplexity (0-100)
- contextualFactors (array)
- reasoningChain (array of detailed reasoning steps)
- humanReviewRequired (boolean)
- severity (critical, high, medium, low, none)
- recommendedAction (block, warn, review, allow)
- explanation (human-readable detailed explanation)
- precedentCases (array of similar cases)`;

      const response = await claude?.messages?.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }]
      });

      const content_text = response?.content?.[0]?.text;
      let analysis;

      try {
        analysis = JSON.parse(content_text);
      } catch (parseError) {
        const jsonMatch = content_text?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse AI analysis response');
        }
      }

      analytics?.trackEvent('policy_violation_analysis_completed', {
        confidence: analysis?.confidenceScore,
        is_violation: analysis?.isPolicyViolation,
        human_review_required: analysis?.humanReviewRequired
      });

      return { data: analysis, error: null };
    } catch (error) {
      if (error?.status) {
        const errorInfo = getErrorMessage(error?.status, error);
        const err = new Error(errorInfo?.message);
        err.statusCode = error?.status;
        if (!errorInfo?.isInternal) {
          console.error('Anthropic API error:', err);
        }
        throw err;
      }
      throw error;
    }
  },

  async getAnalyticsDashboard() {
    try {
      const [screeningData, performanceData] = await Promise.all([
        supabase
          ?.from('content_screening_queue')
          ?.select('*')
          ?.order('created_at', { ascending: false })
          ?.limit(100),
        supabase
          ?.from('ml_model_performance')
          ?.select('*')
          ?.eq('model_name', 'claude-sonnet-4-5')
          ?.order('evaluation_date', { ascending: false })
          ?.limit(1)
      ]);

      const screeningStats = this.calculateScreeningStats(screeningData?.data || []);
      const modelPerformance = toCamelCase(performanceData?.data?.[0] || {});

      return {
        data: {
          screeningStats,
          modelPerformance,
          recentAnalyses: toCamelCase(screeningData?.data?.slice(0, 10) || [])
        },
        error: null
      };
    } catch (error) {
      console.error('Failed to get analytics dashboard:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  calculateScreeningStats(data) {
    const total = data?.length || 0;
    const approved = data?.filter(d => d?.screening_status === 'approved')?.length || 0;
    const flagged = data?.filter(d => d?.screening_status === 'flagged')?.length || 0;
    const blocked = data?.filter(d => d?.screening_status === 'blocked')?.length || 0;
    const underReview = data?.filter(d => d?.screening_status === 'under_review')?.length || 0;

    const avgRiskScore = total > 0
      ? data?.reduce((sum, d) => sum + parseFloat(d?.risk_score || 0), 0) / total
      : 0;

    const avgConfidence = total > 0
      ? data?.reduce((sum, d) => sum + parseFloat(d?.confidence_score || 0), 0) / total
      : 0;

    return {
      total,
      approved,
      flagged,
      blocked,
      underReview,
      avgRiskScore: avgRiskScore?.toFixed(2),
      avgConfidence: avgConfidence?.toFixed(2),
      approvalRate: total > 0 ? ((approved / total) * 100)?.toFixed(2) : 0,
      flagRate: total > 0 ? ((flagged / total) * 100)?.toFixed(2) : 0
    };
  }
};

export default anthropicContentAnalysisService;