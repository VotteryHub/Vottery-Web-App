

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toCamelCase);

  return Object.keys(obj)?.reduce((acc, key) => {
    const camelKey = key?.replace(/_([a-z])/g, (_, letter) => letter?.toUpperCase());
    acc[camelKey] = toCamelCase(obj?.[key]);
    return acc;
  }, {});
};

export const insightsService = {
  async getVotingTrendForecasts(timeRange = '30d') {
    try {
      // Mock voting trend forecast data
      const data = [
        { date: '2026-01-15', actual: 12450, predicted: 12380, confidence: 0.92 },
        { date: '2026-01-16', actual: 13200, predicted: 13150, confidence: 0.91 },
        { date: '2026-01-17', actual: 14100, predicted: 14250, confidence: 0.89 },
        { date: '2026-01-18', actual: 15300, predicted: 15400, confidence: 0.88 },
        { date: '2026-01-19', actual: 16800, predicted: 16900, confidence: 0.87 },
        { date: '2026-01-20', actual: 18200, predicted: 18100, confidence: 0.86 },
        { date: '2026-01-21', actual: 19500, predicted: 19600, confidence: 0.85 },
        { date: '2026-01-22', actual: null, predicted: 21000, confidence: 0.84 },
        { date: '2026-01-23', actual: null, predicted: 22500, confidence: 0.82 },
        { date: '2026-01-24', actual: null, predicted: 24000, confidence: 0.80 }
      ];

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getDemographicShiftPatterns() {
    try {
      const data = [
        { ageGroup: '18-24', current: 18500, projected: 22000, growth: '+18.9%' },
        { ageGroup: '25-34', current: 28900, projected: 31500, growth: '+9.0%' },
        { ageGroup: '35-44', current: 24300, projected: 25800, growth: '+6.2%' },
        { ageGroup: '45-54', current: 19800, projected: 20500, growth: '+3.5%' },
        { ageGroup: '55-64', current: 14200, projected: 14800, growth: '+4.2%' },
        { ageGroup: '65+', current: 8900, projected: 9200, growth: '+3.4%' }
      ];

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getElectionOutcomeProbabilities() {
    try {
      const data = [
        { outcome: 'Option A Wins', probability: 42.5, confidence: 0.88, color: '#2563EB' },
        { outcome: 'Option B Wins', probability: 35.8, confidence: 0.85, color: '#7C3AED' },
        { outcome: 'Option C Wins', probability: 15.2, confidence: 0.79, color: '#F59E0B' },
        { outcome: 'Tie/Runoff', probability: 6.5, confidence: 0.72, color: '#059669' }
      ];

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getParticipationRatePredictions() {
    try {
      const data = [
        { zone: 'Zone 1 ($0-10k)', current: 68.5, predicted: 72.3, trend: 'increasing' },
        { zone: 'Zone 2 ($10-25k)', current: 71.2, predicted: 74.8, trend: 'increasing' },
        { zone: 'Zone 3 ($25-50k)', current: 75.8, predicted: 78.2, trend: 'increasing' },
        { zone: 'Zone 4 ($50-75k)', current: 79.3, predicted: 81.5, trend: 'stable' },
        { zone: 'Zone 5 ($75-100k)', current: 82.1, predicted: 83.9, trend: 'stable' },
        { zone: 'Zone 6 ($100-150k)', current: 84.6, predicted: 85.8, trend: 'stable' },
        { zone: 'Zone 7 ($150-250k)', current: 86.9, predicted: 87.5, trend: 'stable' },
        { zone: 'Zone 8 ($250k+)', current: 89.2, predicted: 89.8, trend: 'stable' }
      ];

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getGeographicVotingPatterns() {
    try {
      const data = [
        { region: 'Northeast', votes: 45200, growth: '+12%', dominantAge: '25-34', turnout: 78.5 },
        { region: 'Southeast', votes: 38900, growth: '+8%', dominantAge: '35-44', turnout: 72.3 },
        { region: 'Midwest', votes: 42100, growth: '+15%', dominantAge: '18-24', turnout: 81.2 },
        { region: 'Southwest', votes: 36800, growth: '+10%', dominantAge: '25-34', turnout: 75.8 },
        { region: 'West', votes: 51300, growth: '+18%', dominantAge: '18-24', turnout: 84.6 },
        { region: 'Northwest', votes: 29400, growth: '+6%', dominantAge: '45-54', turnout: 69.7 }
      ];

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getStrategicRecommendations() {
    try {
      const data = [
        {
          id: 1,
          category: 'Timing Optimization',
          recommendation: 'Launch major campaigns on weekday evenings (6-9 PM) for 23% higher engagement',
          impact: 'high',
          confidence: 0.91
        },
        {
          id: 2,
          category: 'Audience Targeting',
          recommendation: 'Focus on Zone 1-3 demographics showing 18% growth potential in next 30 days',
          impact: 'high',
          confidence: 0.87
        },
        {
          id: 3,
          category: 'Content Strategy',
          recommendation: 'Video content generates 2.4x more votes than text-only elections',
          impact: 'medium',
          confidence: 0.89
        },
        {
          id: 4,
          category: 'Geographic Expansion',
          recommendation: 'West and Midwest regions show highest growth trajectory (+18% and +15%)',
          impact: 'medium',
          confidence: 0.84
        }
      ];

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getInsightsSummary() {
    try {
      const data = {
        totalElectionsAnalyzed: 1247,
        predictionAccuracy: 87.3,
        trendingDemographic: '18-24 age group',
        fastestGrowingZone: 'Zone 1 ($0-10k)',
        projectedTurnoutIncrease: 12.5,
        highConfidencePredictions: 892,
        lastModelUpdate: new Date()?.toISOString()
      };

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};