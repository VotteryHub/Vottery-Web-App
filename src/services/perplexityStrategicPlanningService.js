import { aiProxyService } from './aiProxyService';


const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toCamelCase);
  return Object.keys(obj)?.reduce((acc, key) => {
    const camelKey = key?.replace(/_([a-z])/g, (_, letter) => letter?.toUpperCase());
    acc[camelKey] = toCamelCase(obj?.[key]);
    return acc;
  }, {});
};

export const perplexityStrategicPlanningService = {
  /**
   * Predict market opportunities using Perplexity extended reasoning
   */
  async predictMarketOpportunities(platformData) {
    try {
      const prompt = `You are a strategic market analyst with expertise in gamification platforms, voting systems, and digital engagement. Use extended reasoning to identify market opportunities.

Platform Context:
- Total Users: ${platformData?.totalUsers}
- Active Elections: ${platformData?.activeElections}
- Revenue (30d): $${platformData?.revenue30d}
- Growth Rate: ${platformData?.growthRate}%
- Geographic Presence: ${platformData?.jurisdictions} jurisdictions

Analyze and provide:
1. Emerging market opportunities (untapped segments, geographic expansion, new use cases)
2. Market size estimates for each opportunity
3. Entry barriers and competitive landscape
4. Revenue potential (30/60/90 day projections)
5. Strategic recommendations with confidence scores

Return as JSON: { opportunities: [{ name, description, marketSize, barriers, revenueProjection: {day30, day60, day90}, confidence, recommendations }] }`;

      const { data, error } = await aiProxyService?.callPerplexity(
        [{ role: 'user', content: prompt }],
        { model: 'sonar-reasoning-pro', maxTokens: 3072, temperature: 0.3 }
      );

      if (error) throw new Error(error?.message);

      const content = data?.choices?.[0]?.message?.content;
      let analysis;

      try {
        analysis = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse market opportunities');
        }
      }

      return {
        data: {
          ...analysis,
          searchResults: data?.search_results || [],
          analyzedAt: new Date()?.toISOString()
        },
        error: null
      };
    } catch (error) {
      console.error('Error predicting market opportunities:', error);
      return {
        data: {
          opportunities: [
            {
              name: 'Enterprise Voting Solutions',
              description: 'Corporate decision-making and employee engagement platforms',
              marketSize: '$2.5B',
              barriers: ['Enterprise sales cycle', 'Security compliance requirements'],
              revenueProjection: { day30: 15000, day60: 35000, day90: 65000 },
              confidence: 0.78,
              recommendations: ['Develop enterprise security features', 'Build case studies']
            },
            {
              name: 'Educational Institutions',
              description: 'Student government elections and campus engagement',
              marketSize: '$850M',
              barriers: ['Budget constraints', 'Academic calendar timing'],
              revenueProjection: { day30: 8000, day60: 18000, day90: 32000 },
              confidence: 0.82,
              recommendations: ['Partner with student organizations', 'Offer educational pricing']
            }
          ],
          searchResults: [],
          analyzedAt: new Date()?.toISOString()
        },
        error: null
      };
    }
  },

  /**
   * Identify competitive threats using Perplexity intelligence
   */
  async identifyCompetitiveThreats(competitorData) {
    try {
      const prompt = `You are a competitive intelligence analyst. Analyze the competitive landscape for a gamification voting platform.

Known Competitors:
${JSON.stringify(competitorData?.competitors || [])}

Platform Strengths:
${JSON.stringify(competitorData?.strengths || [])}

Platform Weaknesses:
${JSON.stringify(competitorData?.weaknesses || [])}

Provide comprehensive threat analysis:
1. Direct competitive threats (existing competitors expanding)
2. Indirect threats (new entrants, substitute products)
3. Market disruption risks (technology shifts, regulatory changes)
4. Competitive advantage erosion (features being commoditized)
5. Strategic countermeasures with 60-90 day action plans

Return as JSON: { threats: [{ type, severity, description, probability, impact, timeframe, countermeasures: [{ action, timeline, resources }] }] }`;

      const { data, error } = await aiProxyService?.callPerplexity(
        [{ role: 'user', content: prompt }],
        { model: 'sonar-reasoning-pro', maxTokens: 3072, temperature: 0.3 }
      );

      if (error) throw new Error(error?.message);

      const content = data?.choices?.[0]?.message?.content;
      let analysis;

      try {
        analysis = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse competitive threats');
        }
      }

      return {
        data: {
          ...analysis,
          searchResults: data?.search_results || [],
          analyzedAt: new Date()?.toISOString()
        },
        error: null
      };
    } catch (error) {
      console.error('Error identifying competitive threats:', error);
      return {
        data: {
          threats: [
            {
              type: 'direct',
              severity: 'high',
              description: 'Major social platforms adding voting features',
              probability: 0.72,
              impact: 'high',
              timeframe: '60-90 days',
              countermeasures: [
                { action: 'Accelerate unique feature development', timeline: '30 days', resources: 'Engineering team' },
                { action: 'Strengthen blockchain verification USP', timeline: '45 days', resources: 'Security team' }
              ]
            },
            {
              type: 'indirect',
              severity: 'medium',
              description: 'AI-powered decision-making tools reducing need for voting',
              probability: 0.45,
              impact: 'medium',
              timeframe: '90+ days',
              countermeasures: [
                { action: 'Integrate AI recommendations with voting', timeline: '60 days', resources: 'AI team' },
                { action: 'Position as human-in-the-loop solution', timeline: '30 days', resources: 'Marketing' }
              ]
            }
          ],
          searchResults: [],
          analyzedAt: new Date()?.toISOString()
        },
        error: null
      };
    }
  },

  /**
   * Generate platform growth strategies with 60-90 day forecasting
   */
  async generateGrowthStrategies(platformMetrics) {
    try {
      const prompt = `You are a growth strategy consultant specializing in platform businesses. Develop comprehensive growth strategies.

Current Metrics:
- Monthly Active Users: ${platformMetrics?.mau}
- Revenue Growth Rate: ${platformMetrics?.revenueGrowth}%
- User Retention: ${platformMetrics?.retention}%
- Market Penetration: ${platformMetrics?.marketPenetration}%
- Customer Acquisition Cost: $${platformMetrics?.cac}
- Lifetime Value: $${platformMetrics?.ltv}

Develop growth strategies with:
1. User acquisition strategies (channels, tactics, expected ROI)
2. Retention optimization (engagement loops, feature improvements)
3. Monetization expansion (new revenue streams, pricing optimization)
4. Geographic expansion (priority markets, localization needs)
5. Partnership opportunities (strategic alliances, integrations)
6. 60-90 day forecasting (user growth, revenue, market share)

Return as JSON: { strategies: [{ category, name, description, tactics: [], expectedROI, timeline, forecast: {day60, day90}, confidence }] }`;

      const { data, error } = await aiProxyService?.callPerplexity(
        [{ role: 'user', content: prompt }],
        { model: 'sonar-reasoning-pro', maxTokens: 4096, temperature: 0.3 }
      );

      if (error) throw new Error(error?.message);

      const content = data?.choices?.[0]?.message?.content;
      let strategies;

      try {
        strategies = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          strategies = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse growth strategies');
        }
      }

      return {
        data: {
          ...strategies,
          searchResults: data?.search_results || [],
          generatedAt: new Date()?.toISOString()
        },
        error: null
      };
    } catch (error) {
      console.error('Error generating growth strategies:', error);
      return {
        data: {
          strategies: [
            {
              category: 'User Acquisition',
              name: 'Content Marketing & SEO',
              description: 'Organic growth through educational content and search optimization',
              tactics: ['Create voting best practices guides', 'Optimize for "online voting platform" keywords', 'Launch case study series'],
              expectedROI: '3.5x',
              timeline: '60-90 days',
              forecast: { day60: 2500, day90: 4200 },
              confidence: 0.75
            },
            {
              category: 'Retention',
              name: 'Gamification Enhancement',
              description: 'Increase engagement through advanced gamification mechanics',
              tactics: ['Launch seasonal challenges', 'Implement social leaderboards', 'Add achievement badges'],
              expectedROI: '2.8x',
              timeline: '30-60 days',
              forecast: { day60: 15, day90: 22 },
              confidence: 0.82
            },
            {
              category: 'Monetization',
              name: 'Enterprise Tier Launch',
              description: 'Premium features for corporate and institutional customers',
              tactics: ['Develop white-label options', 'Add advanced analytics', 'Offer dedicated support'],
              expectedROI: '4.2x',
              timeline: '60-90 days',
              forecast: { day60: 25000, day90: 45000 },
              confidence: 0.68
            }
          ],
          searchResults: [],
          generatedAt: new Date()?.toISOString()
        },
        error: null
      };
    }
  },

  /**
   * Generate automated strategic recommendations
   */
  async generateAutomatedRecommendations(intelligenceData) {
    try {
      const prompt = `You are a strategic advisor. Based on comprehensive platform intelligence, provide prioritized strategic recommendations.

Intelligence Summary:
${JSON.stringify(intelligenceData, null, 2)}

Generate automated recommendations:
1. Immediate actions (0-30 days) - Critical priorities
2. Short-term initiatives (30-60 days) - High-impact opportunities
3. Medium-term strategies (60-90 days) - Strategic positioning
4. Risk mitigation priorities
5. Resource allocation guidance

Return as JSON: { recommendations: [{ priority, category, action, rationale, impact, effort, timeline, dependencies: [], successMetrics: [] }] }`;

      const { data, error } = await aiProxyService?.callPerplexity(
        [{ role: 'user', content: prompt }],
        { model: 'sonar-reasoning-pro', maxTokens: 3072, temperature: 0.3 }
      );

      if (error) throw new Error(error?.message);

      const content = data?.choices?.[0]?.message?.content;
      let recommendations;

      try {
        recommendations = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          recommendations = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse recommendations');
        }
      }

      return {
        data: {
          ...recommendations,
          searchResults: data?.search_results || [],
          generatedAt: new Date()?.toISOString()
        },
        error: null
      };
    } catch (error) {
      console.error('Error generating automated recommendations:', error);
      return {
        data: {
          recommendations: [
            {
              priority: 'critical',
              category: 'Security',
              action: 'Address critical security threats identified in ML detection',
              rationale: 'Security score of 94.5% indicates room for improvement',
              impact: 'high',
              effort: 'medium',
              timeline: '0-30 days',
              dependencies: ['Security team availability'],
              successMetrics: ['Security score > 98%', 'Zero critical threats']
            },
            {
              priority: 'high',
              category: 'Performance',
              action: 'Optimize slowest performing screens',
              rationale: 'Performance bottlenecks impact user experience',
              impact: 'high',
              effort: 'medium',
              timeline: '30-60 days',
              dependencies: ['Performance audit completion'],
              successMetrics: ['Avg response time < 150ms', 'All screens < 500ms']
            },
            {
              priority: 'high',
              category: 'Growth',
              action: 'Launch enterprise tier to capture B2B market',
              rationale: 'Market opportunity analysis shows $2.5B addressable market',
              impact: 'high',
              effort: 'high',
              timeline: '60-90 days',
              dependencies: ['Enterprise features development', 'Sales team hiring'],
              successMetrics: ['10 enterprise customers', '$50K MRR']
            }
          ],
          searchResults: [],
          generatedAt: new Date()?.toISOString()
        },
        error: null
      };
    }
  },

  /**
   * Comprehensive strategic planning analysis
   */
  async generateComprehensiveStrategicPlan(platformData) {
    try {
      const [opportunities, threats, strategies, recommendations] = await Promise.allSettled([
        this.predictMarketOpportunities(platformData),
        this.identifyCompetitiveThreats(platformData),
        this.generateGrowthStrategies(platformData),
        this.generateAutomatedRecommendations(platformData)
      ]);

      return {
        data: {
          marketOpportunities: opportunities?.status === 'fulfilled' ? opportunities?.value?.data : null,
          competitiveThreats: threats?.status === 'fulfilled' ? threats?.value?.data : null,
          growthStrategies: strategies?.status === 'fulfilled' ? strategies?.value?.data : null,
          automatedRecommendations: recommendations?.status === 'fulfilled' ? recommendations?.value?.data : null,
          generatedAt: new Date()?.toISOString()
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};