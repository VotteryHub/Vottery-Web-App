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
    // Mock parsing - in production, this would parse Claude's structured response
    return [
      { headline: 'Make Your Voice Count - Vote Today', score: 92, reasoning: 'Direct call-to-action with urgency' },
      { headline: 'Join 50,000+ Voters Shaping the Future', score: 88, reasoning: 'Social proof with aspirational messaging' },
      { headline: 'Your Vote, Your Impact - Participate Now', score: 85, reasoning: 'Personal ownership with clear benefit' },
      { headline: 'Democracy in Action: Cast Your Vote', score: 82, reasoning: 'Inspirational with clear directive' },
      { headline: 'Be Heard: Vote in Today\'s Election', score: 79, reasoning: 'Emotional appeal with immediacy' }
    ];
  },

  parseDescriptionsFromResponse(content, segments) {
    // Mock parsing
    return segments?.map((segment, i) => ({
      segmentName: segment?.name,
      description: `Tailored description for ${segment?.name} highlighting relevant benefits and using appropriate tone.`,
      engagementScore: 85 - (i * 3),
      cta: 'Vote Now'
    }));
  },

  parseVariationsFromResponse(content) {
    // Mock parsing
    return [
      { variation: 'Variation 1', approach: 'Question-based', hypothesis: 'Higher engagement through curiosity', score: 88 },
      { variation: 'Variation 2', approach: 'Benefit-focused', hypothesis: 'Clear value proposition drives action', score: 85 },
      { variation: 'Variation 3', approach: 'Urgency-driven', hypothesis: 'Time pressure increases conversion', score: 83 },
      { variation: 'Variation 4', approach: 'Social proof', hypothesis: 'Peer influence motivates participation', score: 81 },
      { variation: 'Variation 5', approach: 'Emotional appeal', hypothesis: 'Connection to values drives engagement', score: 79 }
    ];
  },

  parseOptimizationFromResponse(content) {
    // Mock parsing
    return {
      analysis: {
        weaknesses: ['Headline lacks urgency', 'Description too generic', 'CTA not compelling'],
        opportunities: ['Add social proof', 'Create urgency', 'Personalize messaging']
      },
      optimizedCopy: {
        headline: 'Optimized headline with improved hook',
        description: 'Optimized description with clearer benefits',
        cta: 'Optimized CTA with stronger action verb'
      },
      predictedImprovements: {
        ctr: '+25%',
        engagement: '+18%',
        conversion: '+12%'
      }
    };
  },

  parseCopyPackageFromResponse(content) {
    // Mock parsing
    return {
      headlines: {
        primary: 'Primary headline option',
        secondary: 'Secondary headline option',
        tertiary: 'Tertiary headline option'
      },
      descriptions: {
        long: 'Long-form description with comprehensive details...',
        short: 'Short-form description with key points'
      },
      ctas: ['CTA Option 1', 'CTA Option 2', 'CTA Option 3'],
      socialMedia: {
        twitter: 'Twitter-optimized copy',
        facebook: 'Facebook-optimized copy',
        instagram: 'Instagram-optimized copy'
      },
      email: {
        subject: 'Email subject line',
        preview: 'Email preview text'
      },
      predictions: {
        overallScore: 87,
        expectedCTR: '4.5-5.2%',
        expectedConversion: '8-10%'
      }
    };
  }
};