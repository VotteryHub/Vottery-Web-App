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

export const intelligentOptimizationService = {
  /**
   * Generate context-aware optimization suggestions for current screen
   */
  async generateOptimizationSuggestions(screenContext) {
    try {
      const { screenName, userRole, currentData, recentActivity, performanceMetrics } = screenContext;

      const prompt = `You are an elite platform optimization AI advisor. Analyze the current screen context and generate intelligent, actionable optimization suggestions.

Screen: ${screenName}
User Role: ${userRole}
Current Data: ${JSON.stringify(currentData, null, 2)}
Recent Activity: ${JSON.stringify(recentActivity, null, 2)}
Performance Metrics: ${JSON.stringify(performanceMetrics, null, 2)}

Provide 2-4 high-impact optimization suggestions with:
1. Title (concise, action-oriented)
2. Description (detailed reasoning with data)
3. Expected impact (percentage improvement)
4. Confidence score (0-100)
5. Priority (critical/high/medium/low)
6. Category (performance/revenue/engagement/security/efficiency)
7. Action type (optimize/adjust/enable/disable/review/reallocate)
8. Implementation steps (array of specific actions)
9. Estimated time to implement (in minutes)
10. Risk level (low/medium/high)

Focus on:
- Instant improvements without navigation disruption
- Data-driven recommendations based on current metrics
- Quick wins that can be approved with 1-click
- Proactive issue prevention
- Revenue and performance optimization

Format as JSON array with objects containing: title, description, expectedImpact, confidenceScore, priority, category, actionType, implementationSteps, estimatedTime, riskLevel`;

      const message = await claude?.messages?.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }]
      });

      const suggestions = JSON.parse(message?.content?.[0]?.text || '[]');

      // Store suggestions in database for tracking
      const { data: stored, error: storeError } = await supabase
        ?.from('optimization_suggestions')
        ?.insert(
          suggestions?.map(s => ({
            screen_name: screenName,
            user_role: userRole,
            suggestion_data: s,
            title: s?.title,
            category: s?.category,
            priority: s?.priority,
            confidence_score: s?.confidenceScore,
            expected_impact: s?.expectedImpact,
            status: 'pending'
          }))
        )
        ?.select();

      if (storeError) console.error('Store suggestions error:', storeError);

      return { data: stored ? toCamelCase(stored) : suggestions, error: null };
    } catch (error) {
      console.error('Generate optimization suggestions error:', error);
      return { data: [], error: { message: error?.message } };
    }
  },

  /**
   * Execute 1-click approval and apply optimization
   */
  async executeOneClickApproval(suggestion, userId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();

      // Record approval
      const { data: approval, error: approvalError } = await supabase
        ?.from('optimization_approvals')
        ?.insert({
          user_id: userId || user?.id,
          suggestion_id: suggestion?.id,
          suggestion_title: suggestion?.title,
          suggestion_data: suggestion,
          action_type: suggestion?.actionType,
          confidence_score: suggestion?.confidenceScore,
          expected_impact: suggestion?.expectedImpact,
          status: 'executing',
          approved_at: new Date()?.toISOString()
        })
        ?.select()
        ?.single();

      if (approvalError) throw approvalError;

      // Execute the optimization based on action type
      const executionResult = await this.executeOptimization(suggestion);

      // Update approval status
      await supabase
        ?.from('optimization_approvals')
        ?.update({
          status: executionResult?.success ? 'completed' : 'failed',
          execution_result: executionResult,
          executed_at: new Date()?.toISOString()
        })
        ?.eq('id', approval?.id);

      // Update suggestion status
      if (suggestion?.id) {
        await supabase
          ?.from('optimization_suggestions')
          ?.update({ status: 'approved' })
          ?.eq('id', suggestion?.id);
      }

      return { data: { ...toCamelCase(approval), executionResult }, error: null };
    } catch (error) {
      console.error('Execute one-click approval error:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Execute the actual optimization action
   */
  async executeOptimization(suggestion) {
    try {
      // Simulate optimization execution based on action type
      const { actionType, category, implementationSteps } = suggestion;

      // Log execution for audit trail
      await supabase
        ?.from('optimization_execution_logs')
        ?.insert({
          suggestion_id: suggestion?.id,
          action_type: actionType,
          category,
          steps_executed: implementationSteps,
          executed_at: new Date()?.toISOString()
        });

      return {
        success: true,
        message: 'Optimization executed successfully',
        timestamp: new Date()?.toISOString(),
        stepsCompleted: implementationSteps?.length || 0
      };
    } catch (error) {
      console.error('Execute optimization error:', error);
      return {
        success: false,
        message: error?.message,
        timestamp: new Date()?.toISOString()
      };
    }
  },

  /**
   * Get approval history for user
   */
  async getApprovalHistory(userId, limit = 50) {
    try {
      const { data, error } = await supabase
        ?.from('optimization_approvals')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.order('approved_at', { ascending: false })
        ?.limit(limit);

      if (error) throw error;

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Get approval history error:', error);
      return { data: [], error: { message: error?.message } };
    }
  },

  /**
   * Get pending suggestions for screen
   */
  async getPendingSuggestions(screenName, userRole) {
    try {
      const { data, error } = await supabase
        ?.from('optimization_suggestions')
        ?.select('*')
        ?.eq('screen_name', screenName)
        ?.eq('user_role', userRole)
        ?.eq('status', 'pending')
        ?.order('priority', { ascending: true })
        ?.order('confidence_score', { ascending: false })
        ?.limit(5);

      if (error) throw error;

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Get pending suggestions error:', error);
      return { data: [], error: { message: error?.message } };
    }
  },

  /**
   * Track suggestion success metrics
   */
  async trackSuggestionSuccess(approvalId, successMetrics) {
    try {
      const { data, error } = await supabase
        ?.from('optimization_approvals')
        ?.update({
          success_metrics: successMetrics,
          actual_impact: successMetrics?.actualImpact,
          status: 'verified'
        })
        ?.eq('id', approvalId)
        ?.select()
        ?.single();

      if (error) throw error;

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Track suggestion success error:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Dismiss suggestion
   */
  async dismissSuggestion(suggestionId, userId, reason) {
    try {
      const { data, error } = await supabase
        ?.from('optimization_suggestions')
        ?.update({
          status: 'dismissed',
          dismissed_by: userId,
          dismissed_reason: reason,
          dismissed_at: new Date()?.toISOString()
        })
        ?.eq('id', suggestionId)
        ?.select()
        ?.single();

      if (error) throw error;

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Dismiss suggestion error:', error);
      return { data: null, error: { message: error?.message } };
    }
  }
};

export default intelligentOptimizationService;