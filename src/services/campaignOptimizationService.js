

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toCamelCase);

  return Object.keys(obj)?.reduce((acc, key) => {
    const camelKey = key?.replace(/_([a-z])/g, (_, letter) => letter?.toUpperCase());
    acc[camelKey] = toCamelCase(obj?.[key]);
    return acc;
  }, {});
};

export const campaignOptimizationService = {
  /**
   * Analyzes campaign performance and generates budget reallocation recommendations
   */
  async analyzeBudgetReallocation(campaignId, timeRange = '24h') {
    try {
      // Mock ML-powered budget analysis
      const recommendations = [
        {
          id: 1,
          campaignId,
          type: 'budget_reallocation',
          priority: 'high',
          title: 'Reallocate Budget to High-Performing Zones',
          description: 'Zone 3 shows 28% higher ROI. Shift $5,200 from underperforming Zone 6 to maximize returns.',
          currentAllocation: { zone3: 12000, zone6: 8500 },
          recommendedAllocation: { zone3: 17200, zone6: 3300 },
          projectedImpact: '+12.5% ROI',
          confidence: 94,
          status: 'pending',
          createdAt: new Date()?.toISOString()
        },
        {
          id: 2,
          campaignId,
          type: 'budget_reallocation',
          priority: 'medium',
          title: 'Increase Evening Time Slot Budget',
          description: 'Evening slots (7-10 PM) generate 35% more engagement. Reallocate 20% of daytime budget.',
          currentAllocation: { morning: 8000, afternoon: 7000, evening: 5000 },
          recommendedAllocation: { morning: 6000, afternoon: 6000, evening: 8000 },
          projectedImpact: '+8.3% Engagement',
          confidence: 89,
          status: 'pending',
          createdAt: new Date()?.toISOString()
        }
      ];

      return { data: toCamelCase(recommendations), error: null };
    } catch (error) {
      console.error('Error analyzing budget reallocation:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Generates audience expansion recommendations based on performance data
   */
  async analyzeAudienceExpansion(campaignId, currentAudience) {
    try {
      const expansionRecommendations = [
        {
          id: 1,
          campaignId,
          type: 'audience_expansion',
          priority: 'high',
          title: 'Expand to Adjacent Age Group 35-44',
          description: 'Similar engagement patterns detected in 35-44 demographic. Potential reach increase of 18,500 users.',
          currentAudience: { ageRange: '25-34', size: 45000 },
          recommendedAudience: { ageRange: '25-44', size: 63500 },
          projectedReach: '+18,500 users',
          projectedCost: '+$2,400',
          projectedROI: '+15.2%',
          confidence: 91,
          status: 'pending',
          createdAt: new Date()?.toISOString()
        },
        {
          id: 2,
          campaignId,
          type: 'audience_expansion',
          priority: 'medium',
          title: 'Geographic Expansion to Zone 5',
          description: 'Zone 5 shows similar demographic profile with 22% lower competition. Expand targeting.',
          currentZones: [1, 2, 3, 4],
          recommendedZones: [1, 2, 3, 4, 5],
          projectedReach: '+12,300 users',
          projectedCost: '+$1,800',
          projectedROI: '+9.8%',
          confidence: 86,
          status: 'pending',
          createdAt: new Date()?.toISOString()
        },
        {
          id: 3,
          campaignId,
          type: 'audience_expansion',
          priority: 'medium',
          title: 'Interest-Based Targeting Expansion',
          description: 'Users interested in "technology" and "innovation" show 40% higher engagement. Add these interests.',
          currentInterests: ['politics', 'social-issues'],
          recommendedInterests: ['politics', 'social-issues', 'technology', 'innovation'],
          projectedReach: '+8,700 users',
          projectedEngagement: '+40%',
          confidence: 88,
          status: 'pending',
          createdAt: new Date()?.toISOString()
        }
      ];

      return { data: toCamelCase(expansionRecommendations), error: null };
    } catch (error) {
      console.error('Error analyzing audience expansion:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Analyzes creative performance and recommends rotation strategies
   */
  async analyzeCreativeRotation(campaignId) {
    try {
      const creativeRecommendations = [
        {
          id: 1,
          campaignId,
          type: 'creative_rotation',
          priority: 'high',
          title: 'Rotate to Video Format for Better Engagement',
          description: 'Video creatives show 52% higher engagement than static images. Rotate 60% of impressions to video.',
          currentMix: { video: 30, image: 50, text: 20 },
          recommendedMix: { video: 60, image: 25, text: 15 },
          projectedImpact: '+52% Engagement',
          confidence: 93,
          status: 'pending',
          createdAt: new Date()?.toISOString()
        },
        {
          id: 2,
          campaignId,
          type: 'creative_rotation',
          priority: 'high',
          title: 'Update Creative Assets - Performance Decline Detected',
          description: 'Current creative showing 18% engagement decline over 7 days. Rotate to fresh assets immediately.',
          currentPerformance: { ctr: 3.2, engagement: 1850 },
          projectedPerformance: { ctr: 4.5, engagement: 2600 },
          projectedImpact: '+40% CTR',
          confidence: 90,
          status: 'pending',
          urgency: 'immediate',
          createdAt: new Date()?.toISOString()
        },
        {
          id: 3,
          campaignId,
          type: 'creative_rotation',
          priority: 'medium',
          title: 'A/B Test New Headline Variations',
          description: 'Question-based headlines outperform statement headlines by 25%. Test 3 new variations.',
          currentHeadline: 'Vote in Our Election Today',
          recommendedHeadlines: [
            'Ready to Make Your Voice Heard?',
            'What\'s Your Choice? Vote Now',
            'Will You Join Thousands of Voters?'
          ],
          projectedImpact: '+25% CTR',
          confidence: 85,
          status: 'pending',
          createdAt: new Date()?.toISOString()
        }
      ];

      return { data: toCamelCase(creativeRecommendations), error: null };
    } catch (error) {
      console.error('Error analyzing creative rotation:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Monitors campaign performance against thresholds and triggers automated actions
   */
  async monitorPerformanceThresholds(campaignId) {
    try {
      const thresholds = [
        {
          id: 1,
          metric: 'roi',
          threshold: 150,
          currentValue: 185,
          status: 'above_threshold',
          action: 'increase_budget',
          triggered: true,
          recommendation: 'ROI exceeds target by 23%. Consider increasing budget by 15% to maximize returns.'
        },
        {
          id: 2,
          metric: 'cost_per_engagement',
          threshold: 2.5,
          currentValue: 1.8,
          status: 'below_threshold',
          action: 'expand_audience',
          triggered: true,
          recommendation: 'Cost per engagement is 28% below target. Opportunity to expand audience reach.'
        },
        {
          id: 3,
          metric: 'engagement_rate',
          threshold: 5.0,
          currentValue: 3.2,
          status: 'below_threshold',
          action: 'rotate_creative',
          triggered: true,
          recommendation: 'Engagement rate declining. Rotate creative assets immediately.'
        },
        {
          id: 4,
          metric: 'conversion_rate',
          threshold: 8.0,
          currentValue: 9.5,
          status: 'above_threshold',
          action: 'maintain',
          triggered: false,
          recommendation: 'Conversion rate performing well. Maintain current strategy.'
        }
      ];

      return { data: toCamelCase(thresholds), error: null };
    } catch (error) {
      console.error('Error monitoring performance thresholds:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Applies optimization recommendation automatically
   */
  async applyOptimization(recommendationId, campaignId) {
    try {
      // Mock application of optimization
      const result = {
        success: true,
        recommendationId,
        campaignId,
        appliedAt: new Date()?.toISOString(),
        status: 'applied',
        message: 'Optimization applied successfully. Changes will take effect within 15 minutes.'
      };

      return { data: toCamelCase(result), error: null };
    } catch (error) {
      console.error('Error applying optimization:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Gets comprehensive optimization dashboard data
   */
  async getOptimizationDashboard(timeRange = '24h') {
    try {
      const [budgetResult, audienceResult, creativeResult, thresholdsResult] = await Promise.all([
        this.analyzeBudgetReallocation('campaign-1', timeRange),
        this.analyzeAudienceExpansion('campaign-1', { ageRange: '25-34' }),
        this.analyzeCreativeRotation('campaign-1'),
        this.monitorPerformanceThresholds('campaign-1')
      ]);

      const allRecommendations = [
        ...(budgetResult?.data || []),
        ...(audienceResult?.data || []),
        ...(creativeResult?.data || [])
      ];

      const summary = {
        totalRecommendations: allRecommendations?.length,
        highPriority: allRecommendations?.filter(r => r?.priority === 'high')?.length,
        mediumPriority: allRecommendations?.filter(r => r?.priority === 'medium')?.length,
        lowPriority: allRecommendations?.filter(r => r?.priority === 'low')?.length,
        avgConfidence: (allRecommendations?.reduce((sum, r) => sum + r?.confidence, 0) / allRecommendations?.length)?.toFixed(1),
        triggeredThresholds: thresholdsResult?.data?.filter(t => t?.triggered)?.length || 0,
        potentialROIIncrease: '+23.8%',
        estimatedImpact: '$12,400'
      };

      return {
        data: {
          summary: toCamelCase(summary),
          budgetRecommendations: budgetResult?.data,
          audienceRecommendations: audienceResult?.data,
          creativeRecommendations: creativeResult?.data,
          performanceThresholds: thresholdsResult?.data
        },
        error: null
      };
    } catch (error) {
      console.error('Error loading optimization dashboard:', error);
      return { data: null, error: { message: error?.message } };
    }
  }
};