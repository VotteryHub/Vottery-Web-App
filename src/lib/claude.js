/**
 * DEPRECATED: Direct Anthropic Claude client usage
 * 
 * This file has been deprecated for security reasons.
 * API keys should NEVER be exposed in client-side code.
 * 
 * Use aiProxyService instead:
 * import { aiProxyService } from '../services/aiProxyService';
 * const response = await aiProxyService.callAnthropic(messages, options);
 * 
 * @deprecated Use aiProxyService.callAnthropic() instead
 */

import { aiProxyService } from '../services/aiProxyService';

export default {
  messages: {
    create: async (options) => {
      console.warn('Direct Anthropic usage is deprecated. Using secure proxy instead.');
      const { data, error } = await aiProxyService?.callAnthropic(options?.messages, {
        model: options?.model,
        maxTokens: options?.max_tokens,
        temperature: options?.temperature,
      });
      if (error) throw new Error(error.message);
      return data;
    }
  }
};