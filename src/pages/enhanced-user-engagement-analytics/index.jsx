import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import VotingSessionHeatmapsPanel from './components/VotingSessionHeatmapsPanel';
import UserRetentionFunnelPanel from './components/UserRetentionFunnelPanel';
import EngagementScoringPanel from './components/EngagementScoringPanel';
import ChurnPredictionVisualizationPanel from './components/ChurnPredictionVisualizationPanel';
import PersonalizedRecommendationsPanel from './components/PersonalizedRecommendationsPanel';
import { enhancedAnalyticsService } from '../../services/enhancedAnalyticsService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const EnhancedUserEngagementAnalytics = () => {
  const [timeframe, setTimeframe] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [analyticsData, setAnalyticsData] = useState({
    heatmaps: null,
    retentionFunnel: null,
    engagementScoring: null,
    churnPrediction: null,
    recommendations: null
  });

  useEffect(() => {
    loadAnalyticsData();

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      refreshData();
    }, 60000);

    return () => clearInterval(interval);
  }, [timeframe]);

  useEffect(() => {
    analytics?.trackEvent('enhanced_engagement_analytics_viewed', {
      timeframe,
      timestamp: new Date()?.toISOString()
    });
  }, [timeframe]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);

      const [predictiveResult, behaviorResult] = await Promise.all([
        enhancedAnalyticsService?.getPredictiveEngagementMetrics(timeframe),
        enhancedAnalyticsService?.getUserBehaviorForecasting(timeframe)
      ]);

      // Mock data for heatmaps and advanced analytics
      const mockHeatmaps = {
        votingZones: [
          { x: 25, y: 20, intensity: 92, label: 'Vote Button', clicks: 3421 },
          { x: 60, y: 30, intensity: 85, label: 'Election Card', clicks: 2847 },
          { x: 45, y: 55, intensity: 68, label: 'Navigation', clicks: 1923 },
          { x: 75, y: 65, intensity: 54, label: 'Sidebar', clicks: 1245 },
          { x: 30, y: 85, intensity: 42, label: 'Footer', clicks: 876 }
        ],
        sessionMetrics: {
          averageTimeOnTask: '2m 34s',
          interactionSequences: 8.4,
          attentionScore: 87
        }
      };

      const mockRetentionFunnel = {
        stages: [
          { stage: 'Registration', users: 10000, percentage: 100, dropoff: 0 },
          { stage: 'First Vote', users: 7500, percentage: 75, dropoff: 25 },
          { stage: 'Second Vote', users: 5200, percentage: 52, dropoff: 23 },
          { stage: 'Active Voter (5+ votes)', users: 3800, percentage: 38, dropoff: 14 },
          { stage: 'Power User (20+ votes)', users: 1900, percentage: 19, dropoff: 19 }
        ],
        conversionRate: 19,
        averageTimeToConversion: '14 days'
      };

      const mockEngagementScoring = {
        overallScore: 78,
        scoreDistribution: [
          { range: 'High (80-100)', count: 3247, percentage: 32 },
          { range: 'Medium (50-79)', count: 4821, percentage: 48 },
          { range: 'Low (0-49)', count: 1932, percentage: 20 }
        ],
        scoringFactors: [
          { factor: 'Voting Frequency', weight: 35, impact: 'High' },
          { factor: 'Session Duration', weight: 25, impact: 'High' },
          { factor: 'Social Engagement', weight: 20, impact: 'Medium' },
          { factor: 'Content Creation', weight: 15, impact: 'Medium' },
          { factor: 'Streak Maintenance', weight: 5, impact: 'Low' }
        ]
      };

      const mockRecommendations = [
        {
          id: 'rec1',
          title: 'Increase Daily Quest Difficulty',
          category: 'Engagement',
          priority: 'High',
          expectedImpact: '+12% retention',
          confidence: 0.87,
          reasoning: 'Users with higher difficulty quests show 23% better retention rates'
        },
        {
          id: 'rec2',
          title: 'Implement Social Voting Challenges',
          category: 'Social',
          priority: 'High',
          expectedImpact: '+18% engagement',
          confidence: 0.82,
          reasoning: 'Social features correlate with 2.3x higher engagement scores'
        },
        {
          id: 'rec3',
          title: 'Optimize Onboarding Flow',
          category: 'Retention',
          priority: 'Medium',
          expectedImpact: '+8% conversion',
          confidence: 0.75,
          reasoning: 'Current 25% drop-off at first vote stage can be reduced'
        }
      ];

      setAnalyticsData({
        heatmaps: mockHeatmaps,
        retentionFunnel: mockRetentionFunnel,
        engagementScoring: mockEngagementScoring,
        churnPrediction: behaviorResult?.data?.churnPrediction,
        recommendations: mockRecommendations,
        predictiveMetrics: predictiveResult?.data
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadAnalyticsData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const timeframeOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ];

  return (
    <>
      <Helmet>
        <title>Enhanced User Engagement Analytics - Vottery</title>
        <meta name="description" content="Comprehensive behavioral intelligence with voting session heatmaps, retention funnel analysis, and predictive engagement scoring for strategic platform optimization." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Enhanced User Engagement Analytics
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Comprehensive behavioral intelligence with voting session heatmaps and predictive engagement scoring
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Updated {lastUpdated?.toLocaleTimeString()}
                  </span>
                </div>
                <Button
                  onClick={refreshData}
                  disabled={refreshing}
                  iconName={refreshing ? 'Loader' : 'RefreshCw'}
                  className="flex items-center gap-2"
                >
                  <span className="hidden md:inline">Refresh</span>
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">Analysis Timeframe:</span>
              <div className="flex gap-2">
                {timeframeOptions?.map((option) => (
                  <button
                    key={option?.value}
                    onClick={() => setTimeframe(option?.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      timeframe === option?.value
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-card border border-border text-foreground hover:bg-muted/50'
                    }`}
                  >
                    {option?.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="card p-12 text-center">
              <Icon name="Loader" size={48} className="mx-auto text-primary mb-4 animate-spin" />
              <p className="text-muted-foreground">Loading engagement analytics...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <VotingSessionHeatmapsPanel 
                data={analyticsData?.heatmaps}
                timeframe={timeframe}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UserRetentionFunnelPanel 
                  data={analyticsData?.retentionFunnel}
                  timeframe={timeframe}
                />
                <EngagementScoringPanel 
                  data={analyticsData?.engagementScoring}
                  timeframe={timeframe}
                />
              </div>

              <ChurnPredictionVisualizationPanel 
                data={analyticsData?.churnPrediction}
                predictiveMetrics={analyticsData?.predictiveMetrics}
                timeframe={timeframe}
              />

              <PersonalizedRecommendationsPanel 
                recommendations={analyticsData?.recommendations}
                onRefresh={refreshData}
              />
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default EnhancedUserEngagementAnalytics;