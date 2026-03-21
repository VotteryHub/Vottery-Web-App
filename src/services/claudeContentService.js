import claude from '../lib/claude';

function getErrorMessage(statusCode, errorData) {
  if (statusCode === 401) {
    return { isInternal: true, message: 'Invalid API key or authentication failed. Please check your Anthropic API key.' };
  } else if (statusCode === 403) {
    return { isInternal: true, message: 'Permission denied. Your API key does not have access to the specified resource.' };
  } else if (statusCode === 404) {
    return { isInternal: true, message: 'Resource not found. The requested endpoint or model may not exist.' };
  } else if (statusCode === 429) {
    return { isInternal: true, message: 'Rate limit exceeded. You are sending requests too quickly. Please wait a moment and try again.' };
  } else if (statusCode === 500) {
    return { isInternal: true, message: 'Anthropic service error. An unexpected error occurred on their servers. Please try again later.' };
  } else if (statusCode === 529) {
    return { isInternal: true, message: 'Anthropic service is temporarily overloaded. Please try again in a few moments.' };
  } else {
    return { isInternal: false, message: errorData?.error?.message || 'An unexpected error occurred. Please try again.' };
  }
}

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toCamelCase);

  return Object.keys(obj)?.reduce((acc, key) => {
    const camelKey = key?.replace(/_([a-z])/g, (_, letter) => letter?.toUpperCase());
    acc[camelKey] = toCamelCase(obj?.[key]);
    return acc;
  }, {});
};

export const claudeContentService = {
  /**
   * Generates high-performing campaign headlines using Claude AI
   */
  async generateCampaignHeadlines(campaignContext) {
    try {
      const { campaignType, targetAudience, productService, tone, existingHeadlines } = campaignContext;

      const prompt = `You are an expert copywriter specializing in high-converting campaign headlines.

Campaign Context:
- Type: ${campaignType || 'General'}
- Target Audience: ${targetAudience || 'General public'}
- Product/Service: ${productService || 'Election participation'}
- Tone: ${tone || 'Professional and engaging'}
${existingHeadlines ? `- Existing Headlines (for reference): ${JSON.stringify(existingHeadlines)}` : ''}

Generate 5 high-performing headline variations optimized for maximum engagement and click-through rates. Each headline should:
1. Be concise (under 60 characters)
2. Include a clear value proposition
3. Create urgency or curiosity
4. Be tailored to the target audience
5. Use proven copywriting techniques

Provide the headlines with predicted performance scores (0-100) based on copywriting best practices.`;

      const response = await claude?.messages?.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 1024,
        messages: [
          { role: 'user', content: prompt }
        ]
      });

      const content = response?.content?.[0]?.text;
      
      // Parse the response to extract headlines
      const headlines = this.parseHeadlinesFromResponse(content);

      return { data: toCamelCase(headlines), error: null };
    } catch (error) {
      const errorInfo = getErrorMessage(error?.status, error);
      if (!errorInfo?.isInternal) {
        console.error('Error generating campaign headlines:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  /**
   * Generates campaign descriptions optimized for different audience segments
   */
  async generateCampaignDescriptions(campaignContext, audienceSegments) {
    try {
      const { campaignType, productService, keyBenefits, tone } = campaignContext;

      const prompt = `You are an expert marketing copywriter specializing in audience-specific messaging.

Campaign Context:
- Type: ${campaignType || 'General'}
- Product/Service: ${productService || 'Election participation'}
- Key Benefits: ${keyBenefits || 'Democratic participation, voice amplification, community impact'}
- Tone: ${tone || 'Professional and engaging'}

Audience Segments:
${audienceSegments?.map((seg, i) => `${i + 1}. ${seg?.name}: ${seg?.description}`)?.join('\n')}

Generate optimized campaign descriptions for each audience segment. Each description should:
1. Be 2-3 sentences (100-150 characters)
2. Highlight benefits relevant to that specific segment
3. Use language and tone that resonates with the segment
4. Include a clear call-to-action
5. Be persuasive and engaging

Provide descriptions with predicted engagement scores (0-100) for each segment.`;

      const response = await claude?.messages?.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2048,
        messages: [
          { role: 'user', content: prompt }
        ]
      });

      const content = response?.content?.[0]?.text;
      
      const descriptions = this.parseDescriptionsFromResponse(content, audienceSegments);

      return { data: toCamelCase(descriptions), error: null };
    } catch (error) {
      const errorInfo = getErrorMessage(error?.status, error);
      if (!errorInfo?.isInternal) {
        console.error('Error generating campaign descriptions:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  /**
   * Generates messaging variations for A/B testing
   */
  async generateMessagingVariations(baseMessage, variationCount = 5) {
    try {
      const prompt = `You are an expert A/B testing copywriter.

Base Message: "${baseMessage}"

Generate ${variationCount} high-performing variations of this message for A/B testing. Each variation should:
1. Maintain the core message intent
2. Test different copywriting approaches (question vs statement, benefit-focused vs feature-focused, etc.)
3. Vary in length and structure
4. Be optimized for different psychological triggers (urgency, curiosity, social proof, etc.)
5. Include predicted performance hypothesis

Provide variations with testing recommendations and expected performance indicators.`;

      const response = await claude?.messages?.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 1536,
        messages: [
          { role: 'user', content: prompt }
        ]
      });

      const content = response?.content?.[0]?.text;
      
      const variations = this.parseVariationsFromResponse(content);

      return { data: toCamelCase(variations), error: null };
    } catch (error) {
      const errorInfo = getErrorMessage(error?.status, error);
      if (!errorInfo?.isInternal) {
        console.error('Error generating messaging variations:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  /**
   * Optimizes existing copy based on performance data
   */
  async optimizeCampaignCopy(currentCopy, performanceData) {
    try {
      const { headline, description, cta, metrics } = currentCopy;

      const prompt = `You are an expert conversion rate optimization specialist.

Current Campaign Copy:
- Headline: "${headline}"
- Description: "${description}" - Call-to-Action:"${cta}"

Performance Metrics:
- Click-Through Rate: ${metrics?.ctr || 'N/A'}%
- Engagement Rate: ${metrics?.engagement || 'N/A'}%
- Conversion Rate: ${metrics?.conversion || 'N/A'}%
- Bounce Rate: ${metrics?.bounce || 'N/A'}%

Analyze the current copy and provide:
1. Specific weaknesses in the current copy
2. Optimized versions of headline, description, and CTA
3. Psychological principles applied in the optimization
4. Predicted performance improvements
5. A/B testing recommendations

Focus on data-driven improvements that address the performance gaps.`;

      const response = await claude?.messages?.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2048,
        messages: [
          { role: 'user', content: prompt }
        ]
      });

      const content = response?.content?.[0]?.text;
      
      const optimization = this.parseOptimizationFromResponse(content);

      return { data: toCamelCase(optimization), error: null };
    } catch (error) {
      const errorInfo = getErrorMessage(error?.status, error);
      if (!errorInfo?.isInternal) {
        console.error('Error optimizing campaign copy:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  /**
   * Generates complete campaign copy package
   */
  async generateCompleteCampaignCopy(campaignBrief) {
    try {
      const { 
        campaignName, 
        objective, 
        targetAudience, 
        productService, 
        keyBenefits, 
        tone,
        constraints 
      } = campaignBrief;

      const prompt = `You are an expert campaign strategist and copywriter.

Campaign Brief:
- Campaign Name: ${campaignName}
- Objective: ${objective}
- Target Audience: ${targetAudience}
- Product/Service: ${productService}
- Key Benefits: ${keyBenefits}
- Tone: ${tone}
- Constraints: ${constraints || 'None specified'}

Generate a complete campaign copy package including:
1. 3 headline options (primary, secondary, tertiary)
2. Long-form description (150-200 words)
3. Short-form description (50-75 words)
4. 3 call-to-action variations
5. Social media copy variations (Twitter, Facebook, Instagram)
6. Email subject line and preview text
7. Performance predictions for each element

Ensure all copy is cohesive, on-brand, and optimized for maximum conversion.`;

      const response = await claude?.messages?.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        messages: [
          { role: 'user', content: prompt }
        ]
      });

      const content = response?.content?.[0]?.text;
      
      const copyPackage = this.parseCopyPackageFromResponse(content);

      return { data: toCamelCase(copyPackage), error: null };
    } catch (error) {
      const errorInfo = getErrorMessage(error?.status, error);
      if (!errorInfo?.isInternal) {
        console.error('Error generating complete campaign copy:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  // Helper parsing methods
  parseHeadlinesFromResponse(content) {
    const parsed = extractJsonObject(content);
    const items = Array.isArray(parsed?.headlines)
      ? parsed.headlines
      : Array.isArray(parsed)
        ? parsed
        : [];
    if (!items.length) {
      return [
        {
          headline: String(content || 'Campaign headline').slice(0, 60),
          score: 60,
          reasoning: 'Fallback parse used due to unstructured model output',
        },
      ];
    }
    return items.map((item, idx) => ({
      headline: item?.headline || item?.title || `Headline ${idx + 1}`,
      score: Number(item?.score ?? item?.predictedScore ?? 70),
      reasoning: item?.reasoning || item?.why || 'Generated by Claude response parsing',
    }));
  },

  parseDescriptionsFromResponse(content, segments) {
    const parsed = extractJsonObject(content);
    const bySegment = Array.isArray(parsed?.descriptions) ? parsed.descriptions : [];
    return segments?.map((segment, i) => {
      const matched = bySegment?.find(
        (d) => d?.segmentName === segment?.name || d?.segment === segment?.name
      ) || bySegment?.[i];
      return {
        segmentName: segment?.name,
        description:
          matched?.description ||
          String(content || `Description for ${segment?.name}`).slice(0, 180),
        engagementScore: Number(matched?.engagementScore ?? matched?.score ?? 70),
        cta: matched?.cta || 'Learn More',
      };
    }) || [];
  },

  parseVariationsFromResponse(content) {
    const parsed = extractJsonObject(content);
    const items = Array.isArray(parsed?.variations)
      ? parsed.variations
      : Array.isArray(parsed)
        ? parsed
        : [];
    if (!items.length) {
      return [{ variation: String(content || 'Variation'), approach: 'general', hypothesis: 'Fallback parse', score: 60 }];
    }
    return items.map((item, idx) => ({
      variation: item?.variation || item?.copy || `Variation ${idx + 1}`,
      approach: item?.approach || 'general',
      hypothesis: item?.hypothesis || 'Expected to improve campaign performance',
      score: Number(item?.score ?? item?.predictedScore ?? 70),
    }));
  },

  parseOptimizationFromResponse(content) {
    const parsed = extractJsonObject(content);
    if (parsed) {
      return {
        analysis: {
          weaknesses: parsed?.analysis?.weaknesses || [],
          opportunities: parsed?.analysis?.opportunities || [],
        },
        optimizedCopy: {
          headline: parsed?.optimizedCopy?.headline || parsed?.headline || '',
          description: parsed?.optimizedCopy?.description || parsed?.description || '',
          cta: parsed?.optimizedCopy?.cta || parsed?.cta || '',
        },
        predictedImprovements: parsed?.predictedImprovements || {},
      };
    }
    return {
      analysis: {
        weaknesses: [],
        opportunities: []
      },
      optimizedCopy: {
        headline: '',
        description: '',
        cta: ''
      },
      predictedImprovements: {}
    };
  },

  parseCopyPackageFromResponse(content) {
    const parsed = extractJsonObject(content);
    if (parsed) return parsed;
    return {
      headlines: {
        primary: '',
        secondary: '',
        tertiary: ''
      },
      descriptions: {
        long: '',
        short: ''
      },
      ctas: [],
      socialMedia: {
        twitter: '',
        facebook: '',
        instagram: ''
      },
      email: {
        subject: '',
        preview: ''
      },
      predictions: {}
    };
  }
};

function extractJsonObject(text) {
  if (!text || typeof text !== 'string') return null;
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}