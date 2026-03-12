import claude from '../lib/claude';
import openai from '../lib/openai';
import perplexityClient from '../lib/perplexity';
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

export const multiAIPredictionService = {
  async analyzeWithClaude(contextData) {
    try {
      const systemPrompt = `You are an expert AI analyst specializing in predictive analytics and pattern recognition. Analyze the provided context and deliver:
- Confidence score (0-100) for your prediction
- Pattern analysis and trend identification
- Risk assessment and opportunity detection
- Actionable recommendations
- Decision rationale

Always include your confidence score in the format: "Confidence: XX%"`;

      const userPrompt = `Analyze this context:

Type: ${contextData?.type}
Description: ${contextData?.description}
Data: ${JSON.stringify(contextData?.data)}
Context: ${JSON.stringify(contextData?.context)}

Provide:
1. Confidence score (0-100)
2. Predictive analysis
3. Pattern identification
4. Risk/opportunity assessment
5. Recommended actions`;

      const response = await claude?.messages?.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        temperature: 0.3,
        messages: [
          {
            role: 'user',
            content: `${systemPrompt}\n\n${userPrompt}`
          }
        ],
      });

      return {
        analysis: response?.content?.[0]?.text,
        usage: response?.usage,
        id: response?.id,
        model: 'claude-3-5-sonnet',
      };
    } catch (error) {
      console.error('Claude analysis error:', error);
      throw new Error(error?.message || 'Claude analysis failed');
    }
  },

  async analyzeWithOpenAI(contextData) {
    try {
      const systemPrompt = `You are an expert AI analyst specializing in predictive analytics and pattern recognition. Analyze the provided context and deliver:
- Confidence score (0-100) for your prediction
- Pattern analysis and trend identification
- Risk assessment and opportunity detection
- Actionable recommendations
- Decision rationale

Always include your confidence score in the format: "Confidence: XX%"`;

      const userPrompt = `Analyze this context:

Type: ${contextData?.type}
Description: ${contextData?.description}
Data: ${JSON.stringify(contextData?.data)}
Context: ${JSON.stringify(contextData?.context)}

Provide:
1. Confidence score (0-100)
2. Predictive analysis
3. Pattern identification
4. Risk/opportunity assessment
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
        model: 'gpt-4o',
      };
    } catch (error) {
      console.error('OpenAI analysis error:', error);
      throw new Error(error?.message || 'OpenAI analysis failed');
    }
  },

  async analyzeWithPerplexity(contextData) {
    try {
      const systemMessage = `You are an expert AI analyst specializing in predictive analytics and pattern recognition. Analyze the provided context and deliver:
- Confidence score (0-100) for your prediction
- Pattern analysis and trend identification
- Risk assessment and opportunity detection
- Actionable recommendations
- Decision rationale

Always include your confidence score in the format: "Confidence: XX%"`;

      const userMessage = `Analyze this context:

Type: ${contextData?.type}
Description: ${contextData?.description}
Data: ${JSON.stringify(contextData?.data)}
Context: ${JSON.stringify(contextData?.context)}

Provide:
1. Confidence score (0-100)
2. Predictive analysis
3. Pattern identification
4. Risk/opportunity assessment
5. Recommended actions`;

      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-reasoning-pro',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage }
        ],
        maxTokens: 3072,
        temperature: 0.3,
        returnRelatedQuestions: true,
      });

      return {
        analysis: response?.choices?.[0]?.message?.content,
        usage: response?.usage,
        searchResults: response?.search_results || [],
        relatedQuestions: response?.related_questions || [],
        model: 'sonar-reasoning-pro',
      };
    } catch (error) {
      console.error('Perplexity analysis error:', error);
      throw new Error(error?.message || 'Perplexity analysis failed');
    }
  },

  async analyzeWithAnthropic(contextData) {
    try {
      const systemPrompt = `You are an expert AI analyst specializing in predictive analytics and pattern recognition. Analyze the provided context and deliver:
- Confidence score (0-100) for your prediction
- Pattern analysis and trend identification
- Risk assessment and opportunity detection
- Actionable recommendations
- Decision rationale

Always include your confidence score in the format: "Confidence: XX%"`;

      const userPrompt = `Analyze this context:

Type: ${contextData?.type}
Description: ${contextData?.description}
Data: ${JSON.stringify(contextData?.data)}
Context: ${JSON.stringify(contextData?.context)}

Provide:
1. Confidence score (0-100)
2. Predictive analysis
3. Pattern identification
4. Risk/opportunity assessment
5. Recommended actions`;

      const response = await claude?.messages?.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 2048,
        temperature: 0.3,
        messages: [
          {
            role: 'user',
            content: `${systemPrompt}\n\n${userPrompt}`
          }
        ],
      });

      return {
        analysis: response?.content?.[0]?.text,
        usage: response?.usage,
        id: response?.id,
        model: 'claude-3-opus',
      };
    } catch (error) {
      console.error('Anthropic analysis error:', error);
      throw new Error(error?.message || 'Anthropic analysis failed');
    }
  },

  extractConfidenceScore(analysis) {
    if (!analysis) return 75;
    const text = typeof analysis === 'string' ? analysis : analysis?.analysis || '';
    const match = text?.match(/confidence[:\s]*(\d+)%?/i) || text?.match(/(\d+)%/i);
    return match ? parseInt(match?.[1]) : 75;
  },

  async getMultiAIPredictions(contextData) {
    try {
      const [claudeResult, openaiResult, perplexityResult, anthropicResult] = await Promise.all([
        this.analyzeWithClaude(contextData)?.catch(err => ({ error: err?.message, model: 'claude-3-5-sonnet' })),
        this.analyzeWithOpenAI(contextData)?.catch(err => ({ error: err?.message, model: 'gpt-4o' })),
        this.analyzeWithPerplexity(contextData)?.catch(err => ({ error: err?.message, model: 'sonar-reasoning-pro' })),
        this.analyzeWithAnthropic(contextData)?.catch(err => ({ error: err?.message, model: 'claude-3-opus' })),
      ]);

      const predictions = {
        claude: claudeResult,
        openai: openaiResult,
        perplexity: perplexityResult,
        anthropic: anthropicResult,
      };

      const confidenceScores = {
        claude: this.extractConfidenceScore(claudeResult?.analysis),
        openai: this.extractConfidenceScore(openaiResult?.analysis),
        perplexity: this.extractConfidenceScore(perplexityResult?.analysis),
        anthropic: this.extractConfidenceScore(anthropicResult?.analysis),
      };

      const selectedModel = this.selectBestModel(confidenceScores, predictions);
      const consensus = this.generateConsensus(predictions, confidenceScores);

      return {
        data: {
          predictions,
          confidenceScores,
          selectedModel,
          consensus,
          timestamp: new Date()?.toISOString(),
        },
        error: null,
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  selectBestModel(confidenceScores, predictions) {
    const validScores = Object.entries(confidenceScores)
      ?.filter(([model, score]) => !predictions?.[model]?.error && score > 0)
      ?.sort((a, b) => b?.[1] - a?.[1]);

    if (validScores?.length === 0) {
      return {
        model: 'none',
        confidence: 0,
        reason: 'All models failed to provide predictions',
      };
    }

    const [bestModel, bestScore] = validScores?.[0];
    const modelNames = {
      claude: 'Claude 3.5 Sonnet',
      openai: 'GPT-4o',
      perplexity: 'Sonar Reasoning Pro',
      anthropic: 'Claude 3 Opus',
    };

    return {
      model: bestModel,
      modelName: modelNames?.[bestModel],
      confidence: bestScore,
      reason: `Highest confidence score (${bestScore}%) among all models`,
      prediction: predictions?.[bestModel],
    };
  },

  generateConsensus(predictions, confidenceScores) {
    const validPredictions = Object.entries(predictions)
      ?.filter(([model, pred]) => !pred?.error)
      ?.map(([model, pred]) => ({
        model,
        confidence: confidenceScores?.[model],
        analysis: pred?.analysis,
      }));

    if (validPredictions?.length === 0) {
      return {
        hasConsensus: false,
        averageConfidence: 0,
        agreement: 'none',
        summary: 'No valid predictions available',
      };
    }

    const avgConfidence = validPredictions?.reduce((sum, p) => sum + p?.confidence, 0) / validPredictions?.length;
    const maxScore = Math.max(...validPredictions?.map(p => p?.confidence));
    const minScore = Math.min(...validPredictions?.map(p => p?.confidence));
    const variance = maxScore - minScore;

    return {
      hasConsensus: variance <= 15,
      averageConfidence: parseFloat(avgConfidence?.toFixed(2)),
      variance,
      agreement: variance <= 10 ? 'strong' : variance <= 20 ? 'moderate' : 'weak',
      summary: this.generateConsensusSummary(validPredictions, avgConfidence, variance),
      modelCount: validPredictions?.length,
    };
  },

  generateConsensusSummary(predictions, avgConfidence, variance) {
    if (variance <= 10) {
      return `Strong consensus across ${predictions?.length} models with ${avgConfidence?.toFixed(1)}% average confidence. All models agree on the prediction.`;
    } else if (variance <= 20) {
      return `Moderate consensus across ${predictions?.length} models with ${avgConfidence?.toFixed(1)}% average confidence. Minor differences in model predictions.`;
    } else {
      return `Weak consensus across ${predictions?.length} models with ${avgConfidence?.toFixed(1)}% average confidence. Significant divergence in model predictions.`;
    }
  },

  async savePredictionAnalysis(analysisData) {
    try {
      const { data, error } = await supabase
        ?.from('orchestration_workflows')
        ?.insert(toSnakeCase({
          workflowType: 'multi_ai_prediction',
          triggerConditions: analysisData?.context,
          automatedActions: analysisData?.predictions,
          status: 'completed',
          confidenceScore: analysisData?.consensus?.averageConfidence || 0,
          executionMetadata: {
            selectedModel: analysisData?.selectedModel,
            consensus: analysisData?.consensus,
            timestamp: new Date()?.toISOString(),
          },
        }))
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getPredictionHistory(filters = {}) {
    try {
      let query = supabase
        ?.from('orchestration_workflows')
        ?.select('*')
        ?.eq('workflow_type', 'multi_ai_prediction')
        ?.order('created_at', { ascending: false })
        ?.limit(filters?.limit || 50);

      if (filters?.startDate) {
        query = query?.gte('created_at', filters?.startDate);
      }

      if (filters?.endDate) {
        query = query?.lte('created_at', filters?.endDate);
      }

      const { data, error } = await query;
      if (error) throw error;

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getModelPerformanceMetrics() {
    try {
      const { data: workflows } = await supabase
        ?.from('orchestration_workflows')
        ?.select('*')
        ?.eq('workflow_type', 'multi_ai_prediction')
        ?.gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)?.toISOString());

      const modelStats = {
        claude: { total: 0, avgConfidence: 0, selected: 0 },
        openai: { total: 0, avgConfidence: 0, selected: 0 },
        perplexity: { total: 0, avgConfidence: 0, selected: 0 },
        anthropic: { total: 0, avgConfidence: 0, selected: 0 },
      };

      workflows?.forEach(workflow => {
        const metadata = workflow?.execution_metadata;
        if (metadata?.selectedModel?.model) {
          const model = metadata?.selectedModel?.model;
          if (modelStats?.[model]) {
            modelStats[model].selected++;
          }
        }
      });

      return {
        data: {
          modelStats,
          totalPredictions: workflows?.length || 0,
          period: '30 days',
        },
        error: null,
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },
};