import { getChatCompletion } from './aiIntegrations/chatCompletion';
import { supabase } from '../lib/supabase';

class CreatorRevenueForecastingService {
  constructor() {
    this.purchasingPowerZones = [
      { name: 'USA', multiplier: 1.0, currency: 'USD' },
      { name: 'Western Europe', multiplier: 0.95, currency: 'EUR' },
      { name: 'Eastern Europe', multiplier: 0.45, currency: 'EUR' },
      { name: 'India', multiplier: 0.25, currency: 'INR' },
      { name: 'Latin America', multiplier: 0.35, currency: 'USD' },
      { name: 'Africa', multiplier: 0.20, currency: 'USD' },
      { name: 'Middle East/Asia', multiplier: 0.60, currency: 'USD' },
      { name: 'Australasia', multiplier: 0.90, currency: 'AUD' }
    ];
  }

  /**
   * Get historical carousel earnings data for creator
   */
  async getHistoricalEarnings(creatorId, timeRange = '90d') {
    try {
      const startDate = this.getStartDate(timeRange);

      const { data: earnings } = await supabase
        ?.from('wallet_transactions')
        ?.select('amount, created_at, metadata')
        ?.eq('user_id', creatorId)
        ?.eq('transaction_type', 'carousel_revenue')
        ?.gte('created_at', startDate?.toISOString())
        ?.order('created_at', { ascending: true });

      return { data: earnings || [], error: null };
    } catch (error) {
      console.error('Error getting historical earnings:', error);
      return { data: null, error: { message: error?.message } };
    }
  }

  /**
   * Get carousel performance metrics
   */
  async getCarouselPerformanceMetrics(creatorId, timeRange = '90d') {
    try {
      const startDate = this.getStartDate(timeRange);

      const { data: metrics } = await supabase
        ?.from('content_distribution_metrics')
        ?.select('*')
        ?.eq('creator_id', creatorId)
        ?.gte('timestamp', startDate?.toISOString());

      const carouselTypes = ['horizontal', 'vertical', 'gradient'];
      const performanceByType = {};

      carouselTypes?.forEach(type => {
        const typeMetrics = metrics?.filter(m => m?.carousel_type === type) || [];
        const totalViews = typeMetrics?.reduce((sum, m) => sum + (m?.views || 0), 0);
        const totalClicks = typeMetrics?.reduce((sum, m) => sum + (m?.clicks || 0), 0);
        const totalRevenue = typeMetrics?.reduce((sum, m) => sum + parseFloat(m?.revenue || 0), 0);

        performanceByType[type] = {
          views: totalViews,
          clicks: totalClicks,
          revenue: totalRevenue,
          engagementRate: totalViews > 0 ? ((totalClicks / totalViews) * 100)?.toFixed(2) : 0,
          revenuePerView: totalViews > 0 ? (totalRevenue / totalViews)?.toFixed(4) : 0
        };
      });

      return { data: performanceByType, error: null };
    } catch (error) {
      console.error('Error getting carousel performance metrics:', error);
      return { data: null, error: { message: error?.message } };
    }
  }

  /**
   * Generate 30-90 day revenue projections using OpenAI GPT-4o
   */
  async generate30To90DayProjections(creatorId) {
    try {
      if (!creatorId) {
        throw new Error('Creator ID is required');
      }

      const [historicalEarnings, performanceMetrics] = await Promise.all([
        this.getHistoricalEarnings(creatorId, '90d'),
        this.getCarouselPerformanceMetrics(creatorId, '90d')
      ]);

      if (historicalEarnings?.error || performanceMetrics?.error) {
        throw new Error('Failed to fetch historical data');
      }

      const earnings = historicalEarnings?.data || [];
      const metrics = performanceMetrics?.data || {};
      const hasAnyMetricData = Object.values(metrics)?.some((m) =>
        (m?.views || 0) > 0 || (m?.clicks || 0) > 0 || Number(m?.revenue || 0) > 0
      );
      if (earnings?.length === 0 && !hasAnyMetricData) {
        return {
          data: null,
          error: { message: 'Insufficient historical data to generate forecast yet.' }
        };
      }

      const analysisData = {
        historicalEarnings: earnings,
        performanceMetrics: metrics,
        purchasingPowerZones: this.purchasingPowerZones
      };

      const response = await getChatCompletion(
        'OPEN_AI',
        'gpt-4o',
        [
          {
            role: 'system',
            content: 'You are an advanced revenue forecasting AI specializing in carousel earnings prediction, zone-specific payout optimization, and creator monetization strategies. Analyze historical performance data and provide accurate 30-90 day revenue projections with confidence intervals.'
          },
          {
            role: 'user',
            content: `Analyze this creator's carousel earnings data and generate 30-90 day revenue projections with zone-specific payout optimization: ${JSON.stringify(analysisData)}. Provide: 1) 30-day revenue projection with confidence interval, 2) 60-day projection, 3) 90-day projection, 4) Zone-specific payout optimization recommendations for all 8 purchasing power zones, 5) Growth factors and risk factors, 6) Recommended actions for revenue maximization.`
          }
        ],
        {
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'revenue_forecasting',
              schema: {
                type: 'object',
                properties: {
                  projections: {
                    type: 'object',
                    properties: {
                      day30: {
                        type: 'object',
                        properties: {
                          projected: { type: 'number' },
                          confidenceInterval: {
                            type: 'object',
                            properties: {
                              low: { type: 'number' },
                              high: { type: 'number' }
                            },
                            required: ['low', 'high']
                          },
                          confidence: { type: 'number' }
                        },
                        required: ['projected', 'confidenceInterval', 'confidence']
                      },
                      day60: {
                        type: 'object',
                        properties: {
                          projected: { type: 'number' },
                          confidenceInterval: {
                            type: 'object',
                            properties: {
                              low: { type: 'number' },
                              high: { type: 'number' }
                            },
                            required: ['low', 'high']
                          },
                          confidence: { type: 'number' }
                        },
                        required: ['projected', 'confidenceInterval', 'confidence']
                      },
                      day90: {
                        type: 'object',
                        properties: {
                          projected: { type: 'number' },
                          confidenceInterval: {
                            type: 'object',
                            properties: {
                              low: { type: 'number' },
                              high: { type: 'number' }
                            },
                            required: ['low', 'high']
                          },
                          confidence: { type: 'number' }
                        },
                        required: ['projected', 'confidenceInterval', 'confidence']
                      }
                    },
                    required: ['day30', 'day60', 'day90']
                  },
                  zoneOptimization: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        zone: { type: 'string' },
                        currentPayout: { type: 'number' },
                        optimizedPayout: { type: 'number' },
                        expectedIncrease: { type: 'string' },
                        strategy: { type: 'string' },
                        priority: { type: 'string' }
                      },
                      required: ['zone', 'currentPayout', 'optimizedPayout', 'expectedIncrease', 'strategy', 'priority']
                    }
                  },
                  growthFactors: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  riskFactors: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  recommendations: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        action: { type: 'string' },
                        expectedImpact: { type: 'string' },
                        timeframe: { type: 'string' },
                        priority: { type: 'string' }
                      },
                      required: ['action', 'expectedImpact', 'timeframe', 'priority']
                    }
                  }
                },
                required: ['projections', 'zoneOptimization', 'growthFactors', 'riskFactors', 'recommendations'],
                additionalProperties: false
              }
            }
          },
          max_completion_tokens: 3000
        }
      );

      const raw = response?.choices?.[0]?.message?.content || '{}';
      const forecast = JSON.parse(raw);
      return { data: forecast, error: null };
    } catch (error) {
      console.error('Error generating revenue projections:', error);
      return { data: null, error: { message: error?.message } };
    }
  }

  /**
   * Get zone-specific payout optimization recommendations
   */
  async getZoneSpecificOptimization(creatorId) {
    try {
      const { data: payouts } = await supabase
        ?.from('prize_redemptions')
        ?.select('*, user:user_id(country, total_earnings)')
        ?.eq('creator_id', creatorId)
        ?.eq('status', 'completed')
        ?.gte('created_at', this.getStartDate('90d')?.toISOString());

      const zonePayouts = this.purchasingPowerZones?.map(zone => {
        const zoneData = payouts?.filter(p => this.getZoneForCountry(p?.user?.country) === zone?.name) || [];
        const totalPayout = zoneData?.reduce((sum, p) => sum + parseFloat(p?.final_amount), 0);
        const avgPayout = zoneData?.length > 0 ? totalPayout / zoneData?.length : 0;

        return {
          zone: zone?.name,
          totalPayout: totalPayout?.toFixed(2),
          avgPayout: avgPayout?.toFixed(2),
          transactionCount: zoneData?.length,
          multiplier: zone?.multiplier,
          currency: zone?.currency
        };
      });

      return { data: zonePayouts, error: null };
    } catch (error) {
      console.error('Error getting zone-specific optimization:', error);
      return { data: null, error: { message: error?.message } };
    }
  }

  /**
   * Helper: Get zone for country
   */
  getZoneForCountry(country) {
    const zoneMapping = {
      'US': 'USA',
      'CA': 'USA',
      'GB': 'Western Europe',
      'DE': 'Western Europe',
      'FR': 'Western Europe',
      'PL': 'Eastern Europe',
      'RO': 'Eastern Europe',
      'IN': 'India',
      'BR': 'Latin America',
      'MX': 'Latin America',
      'NG': 'Africa',
      'ZA': 'Africa',
      'AE': 'Middle East/Asia',
      'SA': 'Middle East/Asia',
      'AU': 'Australasia',
      'NZ': 'Australasia'
    };
    return zoneMapping?.[country] || 'USA';
  }

  /**
   * Helper: Get start date based on time range
   */
  getStartDate(timeRange) {
    const now = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case '7d':
        startDate?.setDate(now?.getDate() - 7);
        break;
      case '30d':
        startDate?.setDate(now?.getDate() - 30);
        break;
      case '60d':
        startDate?.setDate(now?.getDate() - 60);
        break;
      case '90d':
        startDate?.setDate(now?.getDate() - 90);
        break;
      default:
        startDate?.setDate(now?.getDate() - 30);
    }

    return startDate;
  }
}

export const creatorRevenueForecastingService = new CreatorRevenueForecastingService();
export default creatorRevenueForecastingService;