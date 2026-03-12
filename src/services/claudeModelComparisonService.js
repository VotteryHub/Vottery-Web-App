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

const MODELS = {
  SONNET: 'claude-3-5-sonnet-20241022',
  OPUS: 'claude-3-opus-20240229'
};

export const claudeModelComparisonService = {
  async runABTest(taskData, taskType) {
    try {
      const startTime = Date.now();

      const prompt = this.buildPromptForTaskType(taskType, taskData);

      const [sonnetResult, opusResult] = await Promise.all([
        this.executeWithModel(MODELS?.SONNET, prompt),
        this.executeWithModel(MODELS?.OPUS, prompt)
      ]);

      const endTime = Date.now();

      const comparison = {
        taskType,
        sonnet: {
          model: MODELS?.SONNET,
          response: sonnetResult?.response,
          responseTime: sonnetResult?.responseTime,
          tokensUsed: sonnetResult?.usage?.total_tokens,
          inputTokens: sonnetResult?.usage?.input_tokens,
          outputTokens: sonnetResult?.usage?.output_tokens,
          cost: this.calculateCost(MODELS?.SONNET, sonnetResult?.usage)
        },
        opus: {
          model: MODELS?.OPUS,
          response: opusResult?.response,
          responseTime: opusResult?.responseTime,
          tokensUsed: opusResult?.usage?.total_tokens,
          inputTokens: opusResult?.usage?.input_tokens,
          outputTokens: opusResult?.usage?.output_tokens,
          cost: this.calculateCost(MODELS?.OPUS, opusResult?.usage)
        },
        totalTime: endTime - startTime,
        timestamp: new Date()?.toISOString()
      };

      await this.storeComparisonResult(comparison);

      return { data: comparison, error: null };
    } catch (error) {
      console.error('A/B test error:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async executeWithModel(model, prompt) {
    const startTime = Date.now();

    try {
      const message = await claude?.messages?.create({
        model,
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }]
      });

      const endTime = Date.now();

      return {
        response: message?.content?.[0]?.text,
        usage: message?.usage,
        responseTime: endTime - startTime
      };
    } catch (error) {
      console.error(`Model ${model} execution error:`, error);
      throw error;
    }
  },

  buildPromptForTaskType(taskType, taskData) {
    const prompts = {
      fraud_detection: `Analyze the following transaction data for fraud indicators:

${JSON.stringify(taskData, null, 2)}

Provide:
1. Fraud risk score (0-100)
2. Key risk indicators
3. Recommended actions
4. Confidence level

Format as JSON.`,
      content_moderation: `Review the following content for policy violations:

Content: ${taskData?.content}
Context: ${JSON.stringify(taskData?.context, null, 2)}

Provide:
1. Violation severity (none/low/medium/high/critical)
2. Policy categories violated
3. Recommended action (approve/flag/remove)
4. Reasoning

Format as JSON.`,
      dispute_resolution: `Analyze the following dispute and provide resolution recommendation:

Dispute: ${JSON.stringify(taskData, null, 2)}

Provide:
1. Resolution recommendation
2. Reasoning chain
3. Confidence score
4. Alternative approaches

Format as JSON.`,
      strategic_planning: `Generate strategic recommendations based on:

${JSON.stringify(taskData, null, 2)}

Provide:
1. Top 5 strategic priorities
2. Expected impact for each
3. Implementation timeline
4. Risk factors

Format as JSON.`
    };

    return prompts?.[taskType] || `Analyze: ${JSON.stringify(taskData, null, 2)}`;
  },

  calculateCost(model, usage) {
    const pricing = {
      [MODELS?.SONNET]: { input: 0.003, output: 0.015 },
      [MODELS?.OPUS]: { input: 0.015, output: 0.075 }
    };

    const modelPricing = pricing?.[model];
    const inputCost = (usage?.input_tokens / 1000) * modelPricing?.input;
    const outputCost = (usage?.output_tokens / 1000) * modelPricing?.output;

    return parseFloat((inputCost + outputCost)?.toFixed(6));
  },

  async storeComparisonResult(comparison) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();

      const { error } = await supabase
        ?.from('claude_model_comparisons')
        ?.insert({
          user_id: user?.id,
          task_type: comparison?.taskType,
          sonnet_data: comparison?.sonnet,
          opus_data: comparison?.opus,
          total_time: comparison?.totalTime,
          created_at: comparison?.timestamp
        });

      if (error) throw error;
    } catch (error) {
      console.error('Store comparison error:', error);
    }
  },

  async getComparisonHistory(taskType = null, limit = 50) {
    try {
      let query = supabase
        ?.from('claude_model_comparisons')
        ?.select('*')
        ?.order('created_at', { ascending: false })
        ?.limit(limit);

      if (taskType) {
        query = query?.eq('task_type', taskType);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Comparison history error:', error);
      return { data: [], error: { message: error?.message } };
    }
  },

  async getPerformanceMetrics(taskType = null) {
    try {
      const { data: comparisons, error } = await this.getComparisonHistory(taskType, 100);

      if (error) throw error;

      const metrics = {
        sonnet: {
          avgResponseTime: 0,
          avgCost: 0,
          avgTokens: 0,
          totalTests: comparisons?.length
        },
        opus: {
          avgResponseTime: 0,
          avgCost: 0,
          avgTokens: 0,
          totalTests: comparisons?.length
        }
      };

      comparisons?.forEach(comp => {
        metrics.sonnet.avgResponseTime += comp?.sonnetData?.responseTime || 0;
        metrics.sonnet.avgCost += comp?.sonnetData?.cost || 0;
        metrics.sonnet.avgTokens += comp?.sonnetData?.tokensUsed || 0;

        metrics.opus.avgResponseTime += comp?.opusData?.responseTime || 0;
        metrics.opus.avgCost += comp?.opusData?.cost || 0;
        metrics.opus.avgTokens += comp?.opusData?.tokensUsed || 0;
      });

      const count = comparisons?.length || 1;
      metrics.sonnet.avgResponseTime = Math.round(metrics?.sonnet?.avgResponseTime / count);
      metrics.sonnet.avgCost = parseFloat((metrics?.sonnet?.avgCost / count)?.toFixed(6));
      metrics.sonnet.avgTokens = Math.round(metrics?.sonnet?.avgTokens / count);

      metrics.opus.avgResponseTime = Math.round(metrics?.opus?.avgResponseTime / count);
      metrics.opus.avgCost = parseFloat((metrics?.opus?.avgCost / count)?.toFixed(6));
      metrics.opus.avgTokens = Math.round(metrics?.opus?.avgTokens / count);

      return { data: metrics, error: null };
    } catch (error) {
      console.error('Performance metrics error:', error);
      return { data: null, error: { message: error?.message } };
    }
  }
};

export default claudeModelComparisonService;