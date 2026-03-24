/**
 * DEPRECATED: Direct Perplexity AI client usage
 * 
 * This file has been deprecated for security reasons.
 * API keys should NEVER be exposed in client-side code.
 * 
 * Use aiProxyService instead:
 * import { aiProxyService } from '../services/aiProxyService';
 * const response = await aiProxyService.callPerplexity(messages, options);
 * 
 * @deprecated Use aiProxyService.callPerplexity() instead
 */

import { aiProxyService } from '../services/aiProxyService';
const ALLOW_LEGACY_AI = import.meta.env?.VITE_ALLOW_LEGACY_AI === 'true';

function assertPerplexityAllowed() {
  if (!ALLOW_LEGACY_AI) {
    throw new Error(
      'Perplexity is disabled by Batch-1 AI policy. Use Gemini/Anthropic routed services.'
    );
  }
}

export default {
  createChatCompletion: async (options) => {
    assertPerplexityAllowed();
    console.warn('Direct Perplexity usage is deprecated. Using secure proxy instead.');
    const { data, error } = await aiProxyService?.callPerplexity(options?.messages, {
      model: options?.model,
      maxTokens: options?.maxTokens,
      temperature: options?.temperature,
    });
    if (error) throw new Error(error.message);
    return data;
  },
  
  search: async (query, options = {}) => {
    assertPerplexityAllowed();
    console.warn('Direct Perplexity usage is deprecated. Using secure proxy instead.');
    const { data, error } = await aiProxyService?.callPerplexity(
      [{ role: 'user', content: query }],
      {
        model: options?.model || 'sonar-pro',
        maxTokens: options?.maxTokens,
        temperature: options?.temperature,
      }
    );
    if (error) throw new Error(error.message);
    return data;
  }
};