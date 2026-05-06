import { supabase } from '../lib/supabase';
import { integrationHealthService, AI_PROVIDERS } from './integrationHealthService';

/**
 * OPTIMIZED: AI performance optimization with caching and request batching
 * Reduces API calls and improves response times
 */

const aiResponseCache = new Map();
const AI_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const requestBatchQueue = [];
let batchProcessingTimeout = null;

/**
 * Process batched AI requests
 */
const processBatchQueue = async () => {
  if (batchProcessingTimeout) {
    clearTimeout(batchProcessingTimeout);
    batchProcessingTimeout = null;
  }
  
  if (requestBatchQueue?.length === 0) return;
  
  const batch = requestBatchQueue?.splice(0, 10); // Process up to 10 at a time
  
  // Group by provider
  const groupedByProvider = batch?.reduce((acc, req) => {
    if (!acc?.[req?.provider]) acc[req.provider] = [];
    acc?.[req?.provider]?.push(req);
    return acc;
  }, {});
  
  // Process each provider's requests
  for (const [provider, requests] of Object.entries(groupedByProvider)) {
    try {
      // Check cache first
      const cachedResults = [];
      const uncachedRequests = [];
      
      for (const req of requests) {
        const cacheKey = generateCacheKey(req?.provider, req?.action, req?.params);
        const cached = getCachedResponse(cacheKey);
        
        if (cached) {
          cachedResults?.push({ req, result: cached });
        } else {
          uncachedRequests?.push(req);
        }
      }
      
      // Resolve cached requests immediately
      cachedResults?.forEach(({ req, result }) => req?.resolve(result));
      
      // Process uncached requests
      if (uncachedRequests?.length > 0) {
        const results = await processProviderBatch(provider, uncachedRequests);
        
        results?.forEach((result, index) => {
          const req = uncachedRequests?.[index];
          
          if (result?.success) {
            const cacheKey = generateCacheKey(req?.provider, req?.action, req?.params);
            setCachedResponse(cacheKey, result?.data);
            req?.resolve(result?.data);
          } else {
            req?.reject(new Error(result.error));
          }
        });
      }
    } catch (error) {
      // Reject all requests in this provider group
      requests?.forEach(req => req?.reject(error));
    }
  }
};

/**
 * Cache AI responses
 */
const getCachedResponse = (cacheKey) => {
  const cached = aiResponseCache?.get(cacheKey);
  
  if (cached && Date.now() - cached?.timestamp < AI_CACHE_TTL) {
    return cached?.data;
  }
  
  return null;
};

const setCachedResponse = (cacheKey, data) => {
  aiResponseCache?.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
  
  // Clean up old cache entries
  if (aiResponseCache?.size > 1000) {
    const oldestKey = Array.from(aiResponseCache?.keys())?.[0];
    aiResponseCache?.delete(oldestKey);
  }
};

/**
 * Generate cache key for AI requests
 */
const generateCacheKey = (provider, action, params) => {
  return `${provider}-${action}-${JSON.stringify(params)}`;
};

/**
 * Batch AI requests for efficiency
 */
const batchAIRequest = (provider, action, params) => {
  return new Promise((resolve, reject) => {
    requestBatchQueue.push({
      provider,
      action,
      params,
      resolve,
      reject,
      timestamp: Date.now()
    });
    
    // Process batch after 100ms or when queue reaches 10 requests
    if (requestBatchQueue.length >= 10) {
      processBatchQueue();
    } else if (!batchProcessingTimeout) {
      batchProcessingTimeout = setTimeout(processBatchQueue, 100);
    }
  });
};

/**
 * Process batch for specific provider
 */
const processProviderBatch = async (provider, requests) => {
  try {
    const response = await fetch(
      `${import.meta.env?.VITE_API_URL}/functions/v1/ai-proxy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase?.auth?.getSession())?.data?.session?.access_token}`
        },
        body: JSON.stringify({
          provider,
          batch: requests?.map(req => ({
            action: req?.action,
            params: req?.params
          }))
        })
      }
    );
    
    if (!response?.ok) {
      throw new Error(`AI proxy error: ${response.statusText}`);
    }
    
    const data = await response?.json();
    return data?.results || [];
  } catch (error) {
    console.error('Provider batch processing error:', error);
    return requests?.map(() => ({ success: false, error: error?.message }));
  }
};

/**
 * Optimized AI quest generation with caching
 */
export const generateQuestOptimized = async (userId, userBehavior) => {
  const cacheKey = generateCacheKey('gemini', 'generate_quest', { userId, behavior: userBehavior?.slice(0, 5) });
  const cached = getCachedResponse(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  try {
    const result = await batchAIRequest('gemini', 'generate_quest', {
      userId,
      userBehavior,
      timestamp: Date.now()
    });
    
    return result;
  } catch (error) {
    console.error('Generate quest error:', error);
    throw error;
  }
};

/**
 * Optimized fraud detection with caching
 */
export const detectFraudOptimized = async (transactionData) => {
  const cacheKey = generateCacheKey('gemini', 'detect_fraud', {
    type: transactionData?.type,
    amount: transactionData?.amount
  });
  const cached = getCachedResponse(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  try {
    const result = await batchAIRequest('gemini', 'detect_fraud', transactionData);
    return result;
  } catch (error) {
    console.error('Detect fraud error:', error);
    throw error;
  }
};

/**
 * Optimized content analysis with caching
 */
export const analyzeContentOptimized = async (content) => {
  const cacheKey = generateCacheKey('anthropic', 'analyze_content', {
    contentHash: content?.substring(0, 100)
  });
  const cached = getCachedResponse(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  try {
    const result = await batchAIRequest('anthropic', 'analyze_content', { content });
    return result;
  } catch (error) {
    console.error('Analyze content error:', error);
    throw error;
  }
};

/**
 * Clear AI cache
 */
export const clearAICache = () => {
  aiResponseCache?.clear();
};

/**
 * Get AI cache statistics
 */
export const getAICacheStats = () => {
  return {
    size: aiResponseCache?.size,
    hitRate: calculateCacheHitRate(),
    avgResponseTime: calculateAvgResponseTime()
  };
};

let cacheHits = 0;
let cacheMisses = 0;

const calculateCacheHitRate = () => {
  const total = cacheHits + cacheMisses;
  return total > 0 ? (cacheHits / total) * 100 : 0;
};

const calculateAvgResponseTime = () => {
  // Placeholder - implement actual tracking
  return 0;
};

export const aiProxyService = {
  /**
   * Resilient AI call that respects health status and fallbacks
   */
  async callAI(messages, options = {}) {
    const preferred = options?.provider?.toUpperCase() || 'GEMINI';
    const healthyProvider = integrationHealthService.getHealthyAIProvider(preferred);

    if (!healthyProvider) {
      console.error('❌ [AIProxy] No healthy AI providers available (Gemini and Claude are both offline/missing keys).');
      return { data: null, error: { message: 'AI services are currently unavailable. Please check your API keys.' } };
    }

    try {
      const { data: { session } } = await supabase?.auth?.getSession();
      if (!session) throw new Error('Not authenticated');

      const payload = {
        messages,
        model: options?.model,
        max_tokens: options?.maxTokens || 1000,
        temperature: options?.temperature ?? 0.7,
        response_mime_type: options?.responseMimeType,
      };

      // Default models if not provided
      if (healthyProvider === 'gemini' && !payload.model) payload.model = 'gemini-1.5-flash';
      if (healthyProvider === 'claude' && !payload.model) payload.model = 'claude-3-5-sonnet-20241022';

      const { data, error } = await supabase?.functions?.invoke('ai-proxy', {
        body: {
          provider: healthyProvider,
          method: healthyProvider === 'claude' ? 'messages' : 'chat',
          payload
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      // If the specific call failed, we could try one more fallback here if not already tried
      return { data: null, error: { message: error?.message } };
    }
  },

  async callOpenAI(messages, options = {}) {
    return this.callAI(messages, { ...options, provider: 'GEMINI' });
  },

  async callAnthropic(messages, options = {}) {
    return this.callAI(messages, { ...options, provider: 'CLAUDE' });
  },

  async callPerplexity(messages, options = {}) {
    // V1 Compliance: Perplexity removed. Falling back to Gemini sonar-like search or Claude.
    return this.callAI(messages, { ...options, provider: 'GEMINI' });
  },

  async callGemini(messages, options = {}) {
    return this.callAI(messages, { ...options, provider: 'GEMINI' });
  }
};