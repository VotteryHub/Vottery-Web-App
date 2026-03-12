import React, { useState, useEffect } from 'react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { getChatCompletion } from '../../services/aiIntegrations/chatCompletion';
import claudeClient from '../../lib/claude';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';

ChartJS?.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const CreatorCarouselOptimizationStudio = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [swipePatterns, setSwipePatterns] = useState({
    left: 3456,
    right: 5678,
    leftPercentage: 37.8,
    rightPercentage: 62.2
  });
  const [engagementHeatmap, setEngagementHeatmap] = useState({
    timeOfDay: [],
    geographic: [],
    audienceActivity: []
  });
  const [contentPerformance, setContentPerformance] = useState({
    horizontal: { engagement: 0, avgDwellTime: 0, conversionRate: 0 },
    vertical: { engagement: 0, avgDwellTime: 0, conversionRate: 0 },
    gradient: { engagement: 0, avgDwellTime: 0, conversionRate: 0 }
  });
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [optimalPostingTimes, setOptimalPostingTimes] = useState([]);
  const [contentTypeRecommendations, setContentTypeRecommendations] = useState([]);
  const [biddingCalculator, setBiddingCalculator] = useState({
    basePrice: 100,
    competitiveMultiplier: 1.2,
    projectedROI: 0,
    recommendedBid: 0
  });

  useEffect(() => {
    loadSwipePatternAnalysis();
    loadEngagementHeatmaps();
    loadContentPerformance();
    generateAIRecommendations();
  }, [user]);

  const loadSwipePatternAnalysis = async () => {
    try {
      // Simulate swipe pattern data (in production, fetch from Supabase)
      const leftSwipes = Math.floor(Math.random() * 5000) + 2000;
      const rightSwipes = Math.floor(Math.random() * 7000) + 4000;
      const total = leftSwipes + rightSwipes;

      setSwipePatterns({
        left: leftSwipes,
        right: rightSwipes,
        leftPercentage: ((leftSwipes / total) * 100)?.toFixed(1),
        rightPercentage: ((rightSwipes / total) * 100)?.toFixed(1)
      });
    } catch (error) {
      console.error('Error loading swipe patterns:', error);
    }
  };

  const loadEngagementHeatmaps = async () => {
    try {
      // Time-of-day engagement
      const timeOfDay = Array.from({ length: 24 }, (_, hour) => {
        const peakHours = [12, 13, 18, 19, 20, 21];
        const isPeak = peakHours?.includes(hour);
        return {
          hour,
          engagement: isPeak ? Math.floor(Math.random() * 500) + 800 : Math.floor(Math.random() * 300) + 200
        };
      });

      // Geographic engagement
      const geographic = [
        { country: 'United States', engagement: 45678, lat: 37.0902, lng: -95.7129 },
        { country: 'United Kingdom', engagement: 23456, lat: 55.3781, lng: -3.4360 },
        { country: 'India', engagement: 34567, lat: 20.5937, lng: 78.9629 },
        { country: 'Brazil', engagement: 19870, lat: -14.2350, lng: -51.9253 },
        { country: 'Australia', engagement: 15670, lat: -25.2744, lng: 133.7751 }
      ];

      // Audience activity correlation
      const audienceActivity = Array.from({ length: 7 }, (_, day) => ({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']?.[day],
        engagement: Math.floor(Math.random() * 3000) + 2000
      }));

      setEngagementHeatmap({ timeOfDay, geographic, audienceActivity });
    } catch (error) {
      console.error('Error loading engagement heatmaps:', error);
    }
  };

  const loadContentPerformance = async () => {
    try {
      setContentPerformance({
        horizontal: {
          engagement: (Math.random() * 30 + 50)?.toFixed(1),
          avgDwellTime: (Math.random() * 3 + 3)?.toFixed(1),
          conversionRate: (Math.random() * 5 + 5)?.toFixed(1)
        },
        vertical: {
          engagement: (Math.random() * 30 + 45)?.toFixed(1),
          avgDwellTime: (Math.random() * 4 + 4)?.toFixed(1),
          conversionRate: (Math.random() * 5 + 4)?.toFixed(1)
        },
        gradient: {
          engagement: (Math.random() * 25 + 40)?.toFixed(1),
          avgDwellTime: (Math.random() * 2 + 2)?.toFixed(1),
          conversionRate: (Math.random() * 4 + 3)?.toFixed(1)
        }
      });
    } catch (error) {
      console.error('Error loading content performance:', error);
    }
  };

  const generateAIRecommendations = async () => {
    try {
      setLoading(true);

      // OpenAI for featured placement optimization
      const openAIResponse = await getChatCompletion(
        'OPEN_AI',
        'gpt-4o',
        [
          {
            role: 'system',
            content: 'You are a carousel optimization expert. Analyze creator performance data and provide actionable recommendations for featured placement optimization, optimal posting times, and content strategy.'
          },
          {
            role: 'user',
            content: `Analyze creator carousel performance and provide optimization recommendations. Swipe Patterns: ${JSON.stringify(swipePatterns)}. Content Performance: ${JSON.stringify(contentPerformance)}. Return JSON with: featuredPlacementStrategy (string), optimalPostingTimes (array of objects with hour, day, reasoning), contentTypeRecommendations (array of objects with type, priority, reasoning), biddingStrategy (object with recommendedBid, competitiveAnalysis, expectedROI).`
          }
        ],
        {
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'carousel_optimization',
              schema: {
                type: 'object',
                properties: {
                  featuredPlacementStrategy: { type: 'string' },
                  optimalPostingTimes: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        hour: { type: 'number' },
                        day: { type: 'string' },
                        reasoning: { type: 'string' }
                      },
                      required: ['hour', 'day', 'reasoning']
                    }
                  },
                  contentTypeRecommendations: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        type: { type: 'string' },
                        priority: { type: 'string' },
                        reasoning: { type: 'string' }
                      },
                      required: ['type', 'priority', 'reasoning']
                    }
                  },
                  biddingStrategy: {
                    type: 'object',
                    properties: {
                      recommendedBid: { type: 'number' },
                      competitiveAnalysis: { type: 'string' },
                      expectedROI: { type: 'number' }
                    },
                    required: ['recommendedBid', 'competitiveAnalysis', 'expectedROI']
                  }
                },
                required: ['featuredPlacementStrategy', 'optimalPostingTimes', 'contentTypeRecommendations', 'biddingStrategy'],
                additionalProperties: false
              }
            }
          },
          max_completion_tokens: 2000
        }
      );

      const openAIData = JSON.parse(openAIResponse?.choices?.[0]?.message?.content);

      // Claude for audience preference analysis
      const claudeResponse = await claudeClient?.messages?.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: `Analyze audience preferences for carousel content optimization. Engagement Heatmap: ${JSON.stringify(engagementHeatmap)}. Provide: 1) Audience behavior patterns, 2) Content timing strategies, 3) Geographic targeting recommendations, 4) Engagement optimization tactics. Return JSON with: audienceInsights (array), timingStrategy (object), geographicRecommendations (array), optimizationTactics (array).`
          }
        ]
      });

      const claudeContent = claudeResponse?.content?.[0]?.text;
      let claudeData;

      try {
        claudeData = JSON.parse(claudeContent);
      } catch (parseError) {
        const jsonMatch = claudeContent?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          claudeData = JSON.parse(jsonMatch?.[0]);
        }
      }

      // Combine recommendations
      const combinedRecommendations = [
        { source: 'OpenAI', type: 'Featured Placement', recommendation: openAIData?.featuredPlacementStrategy },
        ...openAIData?.contentTypeRecommendations?.map(rec => ({
          source: 'OpenAI',
          type: 'Content Type',
          recommendation: `${rec?.type} (${rec?.priority}): ${rec?.reasoning}`
        })),
        ...(claudeData?.optimizationTactics?.map(tactic => ({
          source: 'Claude',
          type: 'Optimization',
          recommendation: tactic
        })) || [])
      ];

      setAiRecommendations(combinedRecommendations);
      setOptimalPostingTimes(openAIData?.optimalPostingTimes);
      setContentTypeRecommendations(openAIData?.contentTypeRecommendations);
      setBiddingCalculator({
        basePrice: 100,
        competitiveMultiplier: 1.2,
        projectedROI: openAIData?.biddingStrategy?.expectedROI,
        recommendedBid: openAIData?.biddingStrategy?.recommendedBid
      });
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const swipePatternChartData = {
    labels: ['Left Swipes', 'Right Swipes'],
    datasets: [
      {
        data: [swipePatterns?.left, swipePatterns?.right],
        backgroundColor: ['rgba(239, 68, 68, 0.8)', 'rgba(34, 197, 94, 0.8)'],
        borderColor: ['rgb(239, 68, 68)', 'rgb(34, 197, 94)'],
        borderWidth: 2
      }
    ]
  };

  const timeOfDayChartData = {
    labels: engagementHeatmap?.timeOfDay?.map(d => `${d?.hour}:00`),
    datasets: [
      {
        label: 'Engagement',
        data: engagementHeatmap?.timeOfDay?.map(d => d?.engagement),
        borderColor: 'rgb(255, 215, 0)',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const contentPerformanceChartData = {
    labels: ['Horizontal Snap', 'Vertical Stack', 'Gradient Flow'],
    datasets: [
      {
        label: 'Engagement Rate (%)',
        data: [
          parseFloat(contentPerformance?.horizontal?.engagement),
          parseFloat(contentPerformance?.vertical?.engagement),
          parseFloat(contentPerformance?.gradient?.engagement)
        ],
        backgroundColor: 'rgba(255, 215, 0, 0.8)'
      },
      {
        label: 'Conversion Rate (%)',
        data: [
          parseFloat(contentPerformance?.horizontal?.conversionRate),
          parseFloat(contentPerformance?.vertical?.conversionRate),
          parseFloat(contentPerformance?.gradient?.conversionRate)
        ],
        backgroundColor: 'rgba(34, 197, 94, 0.8)'
      }
    ]
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <LeftSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderNavigation />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Creator Carousel Optimization Studio</h1>
            <p className="text-muted-foreground">AI-powered insights for maximizing carousel content effectiveness and audience engagement</p>
          </div>

          {/* Swipe Pattern Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-card rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Swipe Pattern Analysis</h2>
                <Icon name="trending-up" className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="h-64">
                <Doughnut data={swipePatternChartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-red-500/10 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Left Swipes</p>
                  <p className="text-2xl font-bold text-red-500">{swipePatterns?.leftPercentage}%</p>
                  <p className="text-xs text-muted-foreground">{swipePatterns?.left?.toLocaleString()} swipes</p>
                </div>
                <div className="bg-green-500/10 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Right Swipes</p>
                  <p className="text-2xl font-bold text-green-500">{swipePatterns?.rightPercentage}%</p>
                  <p className="text-xs text-muted-foreground">{swipePatterns?.right?.toLocaleString()} swipes</p>
                </div>
              </div>
            </div>

            {/* Engagement Velocity */}
            <div className="bg-card rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Engagement Velocity Metrics</h2>
                <Icon name="zap" className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Swipes/Second</p>
                    <p className="text-2xl font-bold text-foreground">2.4</p>
                  </div>
                  <div className="text-green-500 text-sm font-semibold">+12% vs avg</div>
                </div>
                <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">User Interaction Depth</p>
                    <p className="text-2xl font-bold text-foreground">78%</p>
                  </div>
                  <div className="text-green-500 text-sm font-semibold">+8% vs avg</div>
                </div>
                <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Demographic Segmentation</p>
                    <p className="text-lg font-bold text-foreground">5 Active Segments</p>
                  </div>
                  <Icon name="users" className="w-5 h-5 text-yellow-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Engagement Heatmaps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-card rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Time-of-Day Engagement</h2>
                <Icon name="clock" className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="h-64">
                <Line data={timeOfDayChartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
              </div>
              <div className="mt-4 p-4 bg-yellow-400/10 rounded-lg">
                <p className="text-sm font-semibold text-yellow-400 mb-1">Peak Engagement Hours</p>
                <p className="text-foreground">12-1 PM, 6-9 PM</p>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Geographic Engagement Hotspots</h2>
                <Icon name="map-pin" className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="space-y-3">
                {engagementHeatmap?.geographic?.map((geo, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <span className="text-foreground font-medium">{geo?.country}</span>
                    </div>
                    <span className="text-muted-foreground">{geo?.engagement?.toLocaleString()} engagements</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Performance Breakdown */}
          <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Content Performance by Carousel Type</h2>
              <Icon name="bar-chart" className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="h-80 mb-4">
              <Bar data={contentPerformanceChartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-background rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Horizontal Snap</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">Engagement: <span className="text-foreground font-semibold">{contentPerformance?.horizontal?.engagement}%</span></p>
                  <p className="text-muted-foreground">Avg Dwell Time: <span className="text-foreground font-semibold">{contentPerformance?.horizontal?.avgDwellTime}s</span></p>
                  <p className="text-muted-foreground">Conversion: <span className="text-foreground font-semibold">{contentPerformance?.horizontal?.conversionRate}%</span></p>
                </div>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Vertical Stack</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">Engagement: <span className="text-foreground font-semibold">{contentPerformance?.vertical?.engagement}%</span></p>
                  <p className="text-muted-foreground">Avg Dwell Time: <span className="text-foreground font-semibold">{contentPerformance?.vertical?.avgDwellTime}s</span></p>
                  <p className="text-muted-foreground">Conversion: <span className="text-foreground font-semibold">{contentPerformance?.vertical?.conversionRate}%</span></p>
                </div>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Gradient Flow</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">Engagement: <span className="text-foreground font-semibold">{contentPerformance?.gradient?.engagement}%</span></p>
                  <p className="text-muted-foreground">Avg Dwell Time: <span className="text-foreground font-semibold">{contentPerformance?.gradient?.avgDwellTime}s</span></p>
                  <p className="text-muted-foreground">Conversion: <span className="text-foreground font-semibold">{contentPerformance?.gradient?.conversionRate}%</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* AI-Powered Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-card rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">AI-Powered Recommendations</h2>
                <div className="flex items-center gap-2">
                  <Icon name="sparkles" className="w-5 h-5 text-yellow-400" />
                  <span className="text-xs text-muted-foreground">OpenAI + Claude</span>
                </div>
              </div>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {aiRecommendations?.map((rec, index) => (
                    <div key={index} className="p-4 bg-background rounded-lg border-l-4 border-yellow-400">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-yellow-400">{rec?.source}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{rec?.type}</span>
                      </div>
                      <p className="text-sm text-foreground">{rec?.recommendation}</p>
                    </div>
                  ))}
                </div>
              )}
              <Button onClick={generateAIRecommendations} className="w-full mt-4" disabled={loading}>
                <Icon name="refresh-cw" className="w-4 h-4 mr-2" />
                Regenerate Recommendations
              </Button>
            </div>

            <div className="bg-card rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Optimal Posting Times</h2>
                <Icon name="calendar" className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="space-y-3">
                {optimalPostingTimes?.map((time, index) => (
                  <div key={index} className="p-4 bg-background rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground">{time?.day} at {time?.hour}:00</span>
                      <Icon name="check-circle" className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-sm text-muted-foreground">{time?.reasoning}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Carousel Placement Bidding Calculator */}
          <div className="bg-card rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Carousel Placement Bidding Calculator</h2>
              <Icon name="dollar-sign" className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-background rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Base Price</p>
                <p className="text-2xl font-bold text-foreground">${biddingCalculator?.basePrice}</p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Competitive Multiplier</p>
                <p className="text-2xl font-bold text-yellow-400">{biddingCalculator?.competitiveMultiplier}x</p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Recommended Bid</p>
                <p className="text-2xl font-bold text-green-500">${biddingCalculator?.recommendedBid}</p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Projected ROI</p>
                <p className="text-2xl font-bold text-green-500">{biddingCalculator?.projectedROI}%</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-yellow-400/10 rounded-lg">
              <p className="text-sm font-semibold text-yellow-400 mb-2">Competitive Analysis</p>
              <p className="text-sm text-foreground">Based on current market conditions and your content performance, bidding ${biddingCalculator?.recommendedBid} will position you in the top 15% of featured placements with an expected ROI of {biddingCalculator?.projectedROI}%.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreatorCarouselOptimizationStudio;