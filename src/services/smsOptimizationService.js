import { generateContent } from './geminiChatService';
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

export const smsOptimizationService = {
  // Optimize SMS content using Gemini
  async optimizeSMSContent(content, options = {}) {
    try {
      const { maxLength = 160, tone = 'professional', includePersonalization = true } = options;

      const systemPrompt = `You are an expert SMS content optimizer. Your job is to:
1. Shorten messages to fit within ${maxLength} characters
2. Maintain a ${tone} tone
3. Preserve the core message and urgency
4. ${includePersonalization ? 'Add personalization variables like {{name}}, {{date}}, {{amount}} where appropriate' : 'Do not add personalization variables'}
5. Never include gamification, lottery, prize, or winner content

Return ONLY the optimized message text, nothing else.`;

      const response = await generateContent(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Optimize this SMS message (max ${maxLength} chars):\n\n${content}` }
        ],
        { max_completion_tokens: 200 }
      );

      const optimizedContent = response?.choices?.[0]?.message?.content?.trim() || content;

      // Log optimization to database
      try {
        await supabase?.from('sms_optimization_history')?.insert({
          original_content: content,
          optimized_content: optimizedContent,
          original_length: content?.length,
          optimized_length: optimizedContent?.length,
          optimization_type: 'gemini',
          parameters: { maxLength, tone, includePersonalization },
          created_at: new Date()?.toISOString()
        });
      } catch (logError) {
        console.warn('Failed to log optimization:', logError?.message);
      }

      return {
        data: {
          original: content,
          optimized: optimizedContent,
          originalLength: content?.length,
          optimizedLength: optimizedContent?.length,
          saved: content?.length - optimizedContent?.length,
          withinLimit: optimizedContent?.length <= maxLength
        },
        error: null
      };
    } catch (error) {
      console.error('Error optimizing SMS content:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Batch optimize multiple SMS messages
  async batchOptimize(messages, options = {}) {
    try {
      const results = await Promise.allSettled(
        messages?.map(msg => this.optimizeSMSContent(msg, options))
      );

      return {
        data: results?.map((result, index) => ({
          index,
          original: messages?.[index],
          ...(result?.status === 'fulfilled' ? result?.value?.data : { error: result?.reason?.message })
        })),
        error: null
      };
    } catch (error) {
      console.error('Error batch optimizing SMS:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Generate personalized SMS from template
  async generatePersonalizedSMS(template, recipientData, options = {}) {
    try {
      const { maxLength = 160, tone = 'professional' } = options;

      const systemPrompt = `You are an SMS personalization expert. Generate a personalized SMS message based on the template and recipient data. Keep it under ${maxLength} characters with a ${tone} tone. Never include gamification, lottery, prize, or winner content.`;

      const userPrompt = `Template: ${template}\n\nRecipient Data: ${JSON.stringify(recipientData)}\n\nGenerate a personalized SMS (max ${maxLength} chars):`;

      const response = await generateContent(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        { max_completion_tokens: 200 }
      );

      const personalizedContent = response?.choices?.[0]?.message?.content?.trim() || template;

      return {
        data: {
          personalized: personalizedContent,
          length: personalizedContent?.length,
          withinLimit: personalizedContent?.length <= maxLength
        },
        error: null
      };
    } catch (error) {
      console.error('Error generating personalized SMS:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Analyze SMS engagement potential
  async analyzeEngagement(content) {
    try {
      const systemPrompt = `You are an SMS engagement analyst. Analyze the given SMS message and return a JSON object with:
- engagementScore (0-100): predicted engagement level
- clarity (0-100): message clarity score
- urgency (0-100): urgency level
- callToAction (boolean): whether it has a clear CTA
- suggestions (array of strings): improvement suggestions

Return ONLY valid JSON, no other text.`;

      const response = await generateContent(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this SMS message:\n\n${content}` }
        ],
        {
          max_completion_tokens: 300,
          response_format: { type: 'json_object' }
        }
      );

      const analysisText = response?.choices?.[0]?.message?.content?.trim();
      let analysis;
      try {
        analysis = JSON.parse(analysisText);
      } catch {
        analysis = {
          engagementScore: 50,
          clarity: 50,
          urgency: 50,
          callToAction: false,
          suggestions: ['Unable to analyze message']
        };
      }

      return { data: analysis, error: null };
    } catch (error) {
      console.error('Error analyzing SMS engagement:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get optimization history
  async getOptimizationHistory(filters = {}) {
    try {
      let query = supabase
        ?.from('sms_optimization_history')
        ?.select('*')
        ?.order('created_at', { ascending: false });

      if (filters?.limit) {
        query = query?.limit(filters?.limit);
      }

      if (filters?.startDate) {
        query = query?.gte('created_at', filters?.startDate);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error getting optimization history:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get optimization statistics
  async getOptimizationStats(timeRange = '7d') {
    try {
      const now = new Date();
      let startDate = new Date();

      switch (timeRange) {
        case '24h': startDate?.setHours(now?.getHours() - 24); break;
        case '7d': startDate?.setDate(now?.getDate() - 7); break;
        case '30d': startDate?.setDate(now?.getDate() - 30); break;
        default: startDate?.setDate(now?.getDate() - 7);
      }

      const { data, error } = await supabase
        ?.from('sms_optimization_history')
        ?.select('original_length, optimized_length, optimization_type')
        ?.gte('created_at', startDate?.toISOString());

      if (error) throw error;

      const totalOptimized = data?.length || 0;
      const avgSaved = totalOptimized > 0
        ? data?.reduce((sum, r) => sum + ((r?.original_length || 0) - (r?.optimized_length || 0)), 0) / totalOptimized
        : 0;
      const withinLimit = data?.filter(r => (r?.optimized_length || 0) <= 160)?.length;

      return {
        data: {
          totalOptimized,
          avgCharactersSaved: Math.round(avgSaved),
          withinLimitRate: totalOptimized > 0 ? ((withinLimit / totalOptimized) * 100)?.toFixed(1) : 0,
          timeRange
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting optimization stats:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Generate email subject A/B variants with predicted open rates.
  async generateEmailSubjectVariants(subject, options = {}) {
    try {
      const { variantCount = 3, audience = 'general', tone = 'professional' } = options;
      const prompt = `You optimize email subject lines for open rates.
Generate ${variantCount} variants for this subject: "${subject}".
Audience: ${audience}
Tone: ${tone}
Return ONLY valid JSON:
{
  "variants": [
    { "subject": "...", "predictedOpenRate": 0-100, "reason": "..." }
  ]
}`;

      const response = await generateContent(
        [
          { role: 'system', content: 'You are an expert in lifecycle messaging optimization.' },
          { role: 'user', content: prompt }
        ],
        { max_completion_tokens: 300, response_format: { type: 'json_object' } }
      );

      const parsed = parseJsonObject(response?.choices?.[0]?.message?.content);
      const variants = Array.isArray(parsed?.variants) ? parsed.variants : [];
      return { data: variants.slice(0, variantCount), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Select statistically strongest variant by predicted score.
  async selectBestEmailSubjectVariant(subject, options = {}) {
    const { data, error } = await this.generateEmailSubjectVariants(subject, options);
    if (error) return { data: null, error };
    const ranked = [...(data || [])].sort((a, b) => (b?.predictedOpenRate || 0) - (a?.predictedOpenRate || 0));
    return {
      data: {
        best: ranked[0] || null,
        alternatives: ranked.slice(1),
      },
      error: null
    };
  }
};

function parseJsonObject(value) {
  if (!value || typeof value !== 'string') return null;
  try {
    return JSON.parse(value);
  } catch {
    const match = value.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

export default smsOptimizationService;
