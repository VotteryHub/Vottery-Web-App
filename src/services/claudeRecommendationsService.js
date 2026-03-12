import claude from '../lib/claude';
import { supabase } from '../lib/supabase';

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

export const claudeRecommendationsService = {
  async generateContextualRecommendations(screenContext) {
    try {
      const { screenName, userRole, currentData, recentActivity } = screenContext;

      const prompt = `You are an expert platform optimization advisor. Based on the current screen context, generate actionable optimization recommendations.

Screen: ${screenName}
User Role: ${userRole}
Current Data: ${JSON.stringify(currentData, null, 2)}
Recent Activity: ${JSON.stringify(recentActivity, null, 2)}

Provide 3-5 high-impact recommendations with:
1. Title (concise action)
2. Description (detailed reasoning)
3. Expected impact (percentage improvement)
4. Confidence score (0-100)
5. Priority (high/medium/low)
6. Category (campaign/moderation/engagement/revenue/performance)
7. Action type (optimize/adjust/enable/disable/review)

Format as JSON array with objects containing: title, description, expectedImpact, confidenceScore, priority, category, actionType, implementationSteps (array)`;

      const message = await claude?.messages?.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 3072,
        messages: [{ role: 'user', content: prompt }]
      });

      const recommendations = JSON.parse(message?.content?.[0]?.text || '[]');

      return { data: recommendations, error: null };
    } catch (error) {
      console.error('Claude recommendations error:', error);
      return { data: [], error: { message: error?.message } };
    }
  },

  async executeOneClickApproval(recommendation, userId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();

      const { data, error } = await supabase
        ?.from('claude_recommendation_approvals')
        ?.insert({
          user_id: userId || user?.id,
          recommendation_title: recommendation?.title,
          recommendation_data: recommendation,
          action_type: recommendation?.actionType,
          confidence_score: recommendation?.confidenceScore,
          expected_impact: recommendation?.expectedImpact,
          status: 'approved',
          executed_at: new Date()?.toISOString()
        })
        ?.select()
        ?.single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Approval execution error:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async getApprovalHistory(userId, limit = 50) {
    try {
      const { data, error } = await supabase
        ?.from('claude_recommendation_approvals')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.order('executed_at', { ascending: false })
        ?.limit(limit);

      if (error) throw error;

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Approval history error:', error);
      return { data: [], error: { message: error?.message } };
    }
  },

  async trackRecommendationSuccess(approvalId, successMetrics) {
    try {
      const { data, error } = await supabase
        ?.from('claude_recommendation_approvals')
        ?.update({
          success_metrics: successMetrics,
          actual_impact: successMetrics?.actualImpact,
          status: 'completed'
        })
        ?.eq('id', approvalId)
        ?.select()
        ?.single();

      if (error) throw error;

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Success tracking error:', error);
      return { data: null, error: { message: error?.message } };
    }
  }
};

export default claudeRecommendationsService;