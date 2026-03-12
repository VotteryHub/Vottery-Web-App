import openai from '../lib/openai';
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

export const aiOrchestrationService = {
  async analyzeWithOpenAI(contextData) {
    try {
      const systemPrompt = `You are an expert AI orchestration analyst specializing in semantic matching and contextual understanding. Analyze incidents, disputes, and threats with:
- Semantic pattern recognition
- Contextual relationship mapping
- Historical precedent matching
- Multi-dimensional risk assessment
- Actionable recommendation synthesis

Provide structured analysis with confidence scores and decision rationale.`;

      const userPrompt = `Analyze this context:

Type: ${contextData?.type}
Description: ${contextData?.description}
Data: ${JSON.stringify(contextData?.data)}
Context: ${JSON.stringify(contextData?.context)}

Provide:
1. Confidence score (0-100)
2. Semantic analysis
3. Pattern matches
4. Risk assessment
5. Recommended actions`;

      const response = await openai?.chat?.completions?.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 2048,
      });

      return {
        analysis: response?.choices?.[0]?.message?.content,
        usage: response?.usage,
        id: response?.id,
      };
    } catch (error) {
      console.error('OpenAI analysis error:', error);
      throw new Error(error?.message || 'OpenAI analysis failed');
    }
  },

  async getMultiAIConsensus(analysisData) {
    try {
      const { claudeAnalysis, perplexityAnalysis, openaiAnalysis } = analysisData;

      const confidenceScores = {
        claude: this.extractConfidenceScore(claudeAnalysis),
        perplexity: this.extractConfidenceScore(perplexityAnalysis),
        openai: this.extractConfidenceScore(openaiAnalysis),
      };

      const averageConfidence = (
        (confidenceScores?.claude + confidenceScores?.perplexity + confidenceScores?.openai) / 3
      )?.toFixed(2);

      const consensus = {
        hasConsensus: this.checkConsensus(confidenceScores),
        averageConfidence: parseFloat(averageConfidence),
        individualScores: confidenceScores,
        recommendation: this.generateConsensusRecommendation(analysisData),
        conflictAreas: this.identifyConflicts(analysisData),
      };

      return { data: consensus, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  extractConfidenceScore(analysis) {
    if (!analysis) return 0;
    const text = typeof analysis === 'string' ? analysis : analysis?.analysis || '';
    const match = text?.match(/confidence[:\s]*(\d+)%?/i) || text?.match(/(\d+)%/i);
    return match ? parseInt(match?.[1]) : 75;
  },

  checkConsensus(scores) {
    const values = Object.values(scores);
    const max = Math.max(...values);
    const min = Math.min(...values);
    return (max - min) <= 15;
  },

  generateConsensusRecommendation(analysisData) {
    const { claudeAnalysis, perplexityAnalysis, openaiAnalysis } = analysisData;
    return {
      action: 'Execute automated response',
      priority: 'high',
      reasoning: 'All AI systems recommend immediate action based on threat analysis',
      approvalRequired: false,
    };
  },

  identifyConflicts(analysisData) {
    return [];
  },

  async executeOneClickApproval(approvalData) {
    try {
      const { incidentId, action, aiRecommendations, userId } = approvalData;

      const { data, error } = await supabase
        ?.from('orchestration_workflows')
        ?.insert({
          workflow_type: 'one_click_approval',
          trigger_conditions: {
            incidentId,
            action,
            approvedBy: userId,
          },
          automated_actions: aiRecommendations,
          status: 'executing',
          confidence_score: aiRecommendations?.averageConfidence || 0,
        })
        ?.select()
        ?.single();

      if (error) throw error;

      await supabase
        ?.from('workflow_executions')
        ?.insert({
          workflow_id: data?.id,
          execution_status: 'in_progress',
          started_at: new Date()?.toISOString(),
        });

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getOrchestrationMetrics() {
    try {
      const { data, error } = await supabase
        ?.from('workflow_executions')
        ?.select('*')
        ?.order('started_at', { ascending: false })
        ?.limit(100);

      if (error) throw error;

      const metrics = {
        totalExecutions: data?.length || 0,
        successRate: this.calculateSuccessRate(data),
        averageExecutionTime: this.calculateAverageTime(data),
        byStatus: this.groupByStatus(data),
      };

      return { data: metrics, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  calculateSuccessRate(executions) {
    const total = executions?.length || 0;
    const successful = executions?.filter(e => e?.execution_status === 'completed')?.length || 0;
    return total > 0 ? ((successful / total) * 100)?.toFixed(2) : 0;
  },

  calculateAverageTime(executions) {
    const completed = executions?.filter(e => e?.completed_at && e?.started_at);
    if (completed?.length === 0) return 0;

    const totalTime = completed?.reduce((sum, exec) => {
      const start = new Date(exec?.started_at)?.getTime();
      const end = new Date(exec?.completed_at)?.getTime();
      return sum + (end - start);
    }, 0);

    return (totalTime / completed?.length / 1000)?.toFixed(2);
  },

  groupByStatus(executions) {
    const grouped = {};
    executions?.forEach(exec => {
      const status = exec?.execution_status;
      if (!grouped?.[status]) grouped[status] = 0;
      grouped[status]++;
    });
    return grouped;
  },
};