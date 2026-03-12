/**
 * Client-side Gemini chat — replaces OpenAI/Lambda for carousel ranking, SMS optimization, etc.
 * Uses same API key as geminiRecommendationService (VITE_GEMINI_API_KEY).
 * Returns OpenAI-shaped response: { choices: [{ message: { content } }], usage }.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env?.VITE_GEMINI_API_KEY;
const DEFAULT_MODEL = 'gemini-1.5-flash';

let genAI = null;
function getGenAI() {
  if (!GEMINI_API_KEY) throw new Error('VITE_GEMINI_API_KEY not configured');
  if (!genAI) genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  return genAI;
}

/**
 * Convert OpenAI-format messages to a single prompt for Gemini (no multi-turn in one call).
 */
function messagesToPrompt(messages) {
  return (messages || [])
    .map((m) => {
      const role = m.role === 'assistant' ? 'model' : 'user';
      return `${role}: ${m.content || ''}`;
    })
    .join('\n\n');
}

/**
 * Generate chat completion using Gemini. Returns OpenAI-shaped object.
 * @param {Array<{role: string, content: string}>} messages
 * @param {{ model?: string, maxTokens?: number, temperature?: number, responseMimeType?: string }} options
 */
export async function generateContent(messages, options = {}) {
  const model = options?.model || DEFAULT_MODEL;
  const maxTokens = options?.maxTokens ?? options?.max_completion_tokens ?? 1024;
  const temperature = options?.temperature ?? 0.7;
  const responseMimeType = options?.responseMimeType || options?.response_format?.type === 'json_object' ? 'application/json' : undefined;

  const gen = getGenAI();
  const geminiModel = gen.getGenerativeModel({
    model,
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature,
      ...(responseMimeType && { responseMimeType }),
    },
  });

  const prompt = messagesToPrompt(messages);
  const result = await geminiModel.generateContent(prompt);
  const response = result?.response;
  const text = response?.text?.() ?? '';
  const usage = response?.usageMetadata
    ? { total_tokens: response.usageMetadata.totalTokenCount || 0 }
    : { total_tokens: 0 };

  return {
    choices: [{ message: { role: 'assistant', content: text } }],
    usage,
  };
}

export const geminiChatService = { generateContent };
