/**
 * Unified AI client: routes chat to Gemini via ai-proxy (replaces OpenAI/GPT).
 * Embeddings use Gemini via geminiRecommendationService (client-side).
 * @see aiProxyService.callGemini, geminiRecommendationService.getEmbedding
 */

import { aiProxyService } from '../services/aiProxyService';
import { getEmbedding } from '../services/geminiRecommendationService';

const GEMINI_MODEL = 'gemini-1.5-flash';
function toGeminiModel(openAiModel) {
  if (!openAiModel || /gpt|openai/i.test(openAiModel)) return GEMINI_MODEL;
  if (/gemini/i.test(openAiModel)) return openAiModel;
  return GEMINI_MODEL;
}

export default {
  chat: {
    completions: {
      create: async (options) => {
        const { data, error } = await aiProxyService?.callGemini(options?.messages, {
          model: toGeminiModel(options?.model) || GEMINI_MODEL,
          maxTokens: options?.max_tokens ?? 1000,
          temperature: options?.temperature,
          responseMimeType: options?.response_format?.type === 'json_schema' ? 'application/json' : undefined,
        });
        if (error) throw new Error(error.message);
        return data;
      }
    }
  },
  embeddings: {
    create: async ({ model, input }) => {
      const texts = Array.isArray(input) ? input : [input];
      const vectors = await Promise.all(texts.map((text) => getEmbedding(text)));
      return {
        data: vectors.map((values, i) => ({ embedding: values, index: i })),
        usage: { total_tokens: 0 }
      };
    }
  }
};