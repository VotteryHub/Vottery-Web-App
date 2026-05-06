import { geminiChatService } from './geminiChatService';
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
  async analyzeWithGemini(contextData) {
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

      const response = await geminiChatService.generateContent([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ], {
        temperature: 0.3,
        maxTokens: 2048,
      });

      return {
        analysis: response?.choices?.[0]?.message?.content,
        usage: response?.usage,
        id: response?.id,
      };
    } catch (error) {
      console.error('Gemini analysis error:', error);
      throw new Error(error?.message || 'Gemini analysis failed');
    }
  },

  async analyzeWithOpenAI(contextData) {
    // Backward-compatible alias; Batch-1 policy routes this through Gemini adapter.
    return this.analyzeWithGemini(contextData);
  },

  async getMultiAIConsensus(analysisData) {
    try {
      const { claudeAnalysis, geminiAnalysis } = analysisData;

      const confidenceScores = {
        claude: this.extractConfidenceScore(claudeAnalysis),
        gemini: this.extractConfidenceScore(geminiAnalysis),
      };

      const averageConfidence = (
        (confidenceScores?.claude + confidenceScores?.gemini) / 2
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
    const { claudeAnalysis, geminiAnalysis } = analysisData;
    return {
      action: 'Execute automated response',
      priority: 'high',
      reasoning: 'Gemini and Claude recommend immediate action based on threat analysis',
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

  async improveDescription(rawDescription, title = '') {
    try {
      const systemPrompt = `You are an expert election communication strategist for Vottery. Your goal is to improve election descriptions to be:
- Clear and professional
- Compelling and engaging
- Completely unbiased and neutral
- Structured for readability
- Highlighting the purpose and voting process

Original Title: ${title}
Maintain the original intent but enhance the professional tone.`;

      const userPrompt = `Improve this election description:
"${rawDescription}"

Provide only the improved description text, no preamble or extra commentary.`;

      const response = await geminiChatService.generateContent([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ], {
        temperature: 0.7,
        maxTokens: 1000,
      });

      return response?.choices?.[0]?.message?.content?.trim();
    } catch (error) {
      console.error('AI description improvement error:', error);
      throw error;
    }
  },

  async categorizeElection(title, description) {
    try {
      const categories = ['political', 'community', 'corporate', 'educational', 'social', 'entertainment', 'sports', 'other'];
      const systemPrompt = `You are an election categorization expert. Categorize the following election into EXACTLY ONE of these categories: ${categories.join(', ')}.
Output ONLY the category name in lowercase.`;

      const userPrompt = `Title: ${title}
Description: ${description}`;

      const response = await geminiChatService.generateContent([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ], {
        temperature: 0,
        maxTokens: 20,
      });

      const category = response?.choices?.[0]?.message?.content?.trim()?.toLowerCase();
      return categories?.includes(category) ? category : 'other';
    } catch (error) {
      console.error('AI categorization error:', error);
      return 'other';
    }
  },

  async generateQuizFromContent(title, description) {
    try {
      const systemPrompt = `You are an educational quiz designer. Based on the provided election title and description, generate 3-5 multiple choice questions to test the voter's understanding.
Output EXACTLY a JSON array of objects with this structure:
[
  {
    "questionText": "string",
    "options": ["string", "string", "string", "string"],
    "correctAnswerIndex": number,
    "explanation": "string",
    "difficulty": "easy" | "medium" | "hard"
  }
]
Maintain a neutral, informative tone. Ensure questions are directly relevant to the election context.`;

      const userPrompt = `Title: ${title}
Description: ${description}`;

      const response = await geminiChatService.generateContent([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ], {
        temperature: 0.7,
        maxTokens: 2000,
        responseMimeType: "application/json"
      });

      const content = response?.choices?.[0]?.message?.content;
      const parsed = JSON.parse(content);
      // Handle cases where AI wraps the array in an object (e.g. { "questions": [...] })
      return Array.isArray(parsed) ? parsed : (parsed?.questions || parsed?.quiz || []);
    } catch (error) {
      console.error('AI quiz generation error:', error);
      return [];
    }
  }
};