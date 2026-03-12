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

export const contentSafetyService = {
  async screenContent(contentData) {
    try {
      const { contentType, contentText, sourceEntityType, sourceEntityId, submittedBy } = contentData;

      const prompt = `You are an expert content moderation AI specializing in election integrity, policy compliance, and user safety.

Analyze this ${contentType} content for policy violations:

Content: "${contentText}"

Evaluate for:
1. Hate speech or discriminatory language
2. Misinformation or false claims
3. Spam or manipulative content
4. Violence, threats, or harassment
5. Adult or inappropriate content
6. Election interference attempts
7. Fraudulent or deceptive practices

Provide analysis as JSON with:
- isViolation (boolean)
- policyViolations (array of violation types)
- riskScore (0-100)
- confidenceScore (0-100)
- flaggedKeywords (array)
- recommendedAction ("approve", "flag", "block", "review")
- reasoning (string explaining the decision)
- severity ("critical", "high", "medium", "low", "none")`;

      const response = await claude?.messages?.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 1024,
        messages: [
          { role: 'user', content: prompt }
        ]
      });

      const content = response?.content?.[0]?.text;
      let analysis;

      try {
        analysis = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse AI analysis response');
        }
      }

      const { data, error } = await supabase
        ?.from('content_screening_queue')
        ?.insert({
          content_type: contentType,
          content_text: contentText,
          source_entity_type: sourceEntityType,
          source_entity_id: sourceEntityId,
          submitted_by: submittedBy,
          screening_status: analysis?.recommendedAction === 'approve' ? 'approved' : 
                           analysis?.recommendedAction === 'block' ? 'blocked' : 
                           analysis?.recommendedAction === 'flag' ? 'flagged' : 'under_review',
          ai_analysis_result: analysis,
          policy_violations: analysis?.policyViolations || [],
          risk_score: analysis?.riskScore || 0,
          confidence_score: analysis?.confidenceScore || 0,
          flagged_keywords: analysis?.flaggedKeywords || [],
          recommended_action: analysis?.recommendedAction
        })
        ?.select()
        ?.single();

      if (error) throw error;

      analytics?.trackEvent('content_screened', {
        content_type: contentType,
        screening_status: data?.screening_status,
        risk_score: analysis?.riskScore
      });

      return { data: toCamelCase({ ...data, analysis }), error: null };
    } catch (error) {
      const errorInfo = getErrorMessage(error?.status, error);
      if (!errorInfo?.isInternal) {
        console.error('Error screening content:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async getScreeningQueue(filters = {}) {
    try {
      let query = supabase
        ?.from('content_screening_queue')
        ?.select(`
          *,
          submitter:submitted_by(id, name, username, email),
          reviewer:reviewed_by(id, name, username, email)
        `)
        ?.order('created_at', { ascending: false });

      if (filters?.status && filters?.status !== 'all') {
        query = query?.eq('screening_status', filters?.status);
      }

      if (filters?.contentType && filters?.contentType !== 'all') {
        query = query?.eq('content_type', filters?.contentType);
      }

      if (filters?.minRiskScore) {
        query = query?.gte('risk_score', filters?.minRiskScore);
      }

      const { data, error } = await query?.limit(filters?.limit || 50);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async reviewScreenedContent(screeningId, reviewData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('content_screening_queue')
        ?.update({
          screening_status: reviewData?.status,
          reviewed_by: user?.id,
          reviewed_at: new Date()?.toISOString(),
          review_notes: reviewData?.notes
        })
        ?.eq('id', screeningId)
        ?.select()
        ?.single();

      if (error) throw error;

      analytics?.trackEvent('content_reviewed', {
        screening_id: screeningId,
        new_status: reviewData?.status
      });

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getContentSafetyPolicies() {
    try {
      const { data, error } = await supabase
        ?.from('content_safety_policies')
        ?.select('*')
        ?.order('severity', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getScreeningStatistics(timeRange = '30d') {
    try {
      const now = new Date();
      let startDate = new Date();
      
      switch(timeRange) {
        case '7d':
          startDate?.setDate(now?.getDate() - 7);
          break;
        case '30d':
          startDate?.setDate(now?.getDate() - 30);
          break;
        case '90d':
          startDate?.setDate(now?.getDate() - 90);
          break;
        default:
          startDate?.setDate(now?.getDate() - 30);
      }

      const { data, error } = await supabase
        ?.from('content_screening_queue')
        ?.select('*')
        ?.gte('created_at', startDate?.toISOString());

      if (error) throw error;

      const statistics = {
        totalScreened: data?.length || 0,
        approved: data?.filter(item => item?.screening_status === 'approved')?.length || 0,
        flagged: data?.filter(item => item?.screening_status === 'flagged')?.length || 0,
        blocked: data?.filter(item => item?.screening_status === 'blocked')?.length || 0,
        underReview: data?.filter(item => item?.screening_status === 'under_review')?.length || 0,
        averageRiskScore: data?.reduce((sum, item) => sum + (parseFloat(item?.risk_score) || 0), 0) / (data?.length || 1),
        highRiskCount: data?.filter(item => parseFloat(item?.risk_score) >= 70)?.length || 0,
        policyViolationBreakdown: this.calculateViolationBreakdown(data)
      };

      return { data: statistics, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  calculateViolationBreakdown(screeningData) {
    const breakdown = {};
    screeningData?.forEach(item => {
      const violations = item?.policy_violations || [];
      violations?.forEach(violation => {
        breakdown[violation] = (breakdown?.[violation] || 0) + 1;
      });
    });
    return breakdown;
  }
};