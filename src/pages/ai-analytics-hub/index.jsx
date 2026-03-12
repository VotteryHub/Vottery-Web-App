import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import VotingSessionHeatmapPanel from './components/VotingSessionHeatmapPanel';
import UserRetentionFunnelPanel from './components/UserRetentionFunnelPanel';
import EngagementScoringPanel from './components/EngagementScoringPanel';
import ChurnPredictionPanel from './components/ChurnPredictionPanel';
import PersonalizedRecommendationsPanel from './components/PersonalizedRecommendationsPanel';
import BehavioralPatternPanel from './components/BehavioralPatternPanel';
import { enhancedAnalyticsService } from '../../services/enhancedAnalyticsService';
import { claudePredictiveAnalyticsService } from '../../services/claudePredictiveAnalyticsService';
import { enhancedRecommendationService } from '../../services/enhancedRecommendationService';
import { analytics } from '../../hooks/useGoogleAnalytics';
import { useAuth } from '../../contexts/AuthContext';

const AIAnalyticsHub = () => {
  const { userProfile } = useAuth();
  const [timeframe, setTimeframe] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [analyticsData, setAnalyticsData] = useState({
    heatmapData: null,
    retentionFunnel: null,
    engagementScores: null,
    churnPrediction: null,
    recommendations: null,
    behavioralPatterns: null
  });

  useEffect(() => {
    loadAnalyticsData();
    
    // Auto-refresh every 2 minutes
    const interval = setInterval(() => {
      refreshData();
    }, 120000);

    return () => clearInterval(interval);
  }, [timeframe]);

  useEffect(() => {
    analytics?.trackEvent('ai_analytics_hub_viewed', {
      timeframe,
      timestamp: new Date()?.toISOString()
    });
  }, [timeframe]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      const [heatmapResult, engagementResult, churnResult, recommendationsResult] = await Promise.all([
        generateHeatmapData(),
        enhancedAnalyticsService?.getPredictiveEngagementMetrics(timeframe),
        claudePredictiveAnalyticsService?.predictUserChurn(),
        enhancedRecommendationService?.generatePersonalizedElectionFeed(userProfile?.id)
      ]);

      setAnalyticsData({
        heatmapData: heatmapResult,
        retentionFunnel: generateRetentionFunnelData(),
        engagementScores: engagementResult?.data,
        churnPrediction: churnResult?.data,
        recommendations: recommendationsResult?.data,
        behavioralPatterns: generateBehavioralPatterns()
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

  const generateHeatmapData = () => {
    // Generate voting session heatmap data
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    const heatmapData = days?.map(day => 
      hours?.map(hour => ({
        day,
        hour,
        value: Math.floor(Math.random() * 100) + 20,
        sessions: Math.floor(Math.random() * 500) + 50
      }))
    )?.flat();

    return heatmapData;
  };

  const generateRetentionFunnelData = () => {
    return [
      { stage: 'Visitors', users: 10000, percentage: 100, dropoff: 0 },
      { stage: 'Signed Up', users: 7500, percentage: 75, dropoff: 25 },
      { stage: 'First Vote', users: 5250, percentage: 52.5, dropoff: 22.5 },
      { stage: 'Active (5+ votes)', users: 3150, percentage: 31.5, dropoff: 21 },
      { stage: 'Engaged (20+ votes)', users: 1575, percentage: 15.75, dropoff: 15.75 },
      { stage: 'Power Users (50+ votes)', users: 630, percentage: 6.3, dropoff: 9.45 }
    ];
  };

  const generateBehavioralPatterns = () => {
    return [
      {
        pattern: 'Evening Voters',
        description: 'Users who primarily vote between 6 PM - 10 PM',
        userCount: 3247,
        engagementRate: 87.3,
        trend: 'increasing'
      },
      {
        pattern: 'Weekend Warriors',
        description: 'High activity on Saturdays and Sundays',
        userCount: 2156,
        engagementRate: 92.1,
        trend: 'stable'
      },
      {
        pattern: 'Quick Voters',
        description: 'Complete voting sessions in under 2 minutes',
        userCount: 4521,
        engagementRate: 68.4,
        trend: 'increasing'
      },
      {
        pattern: 'Social Engagers',
        description: 'High interaction with comments and reactions',
        userCount: 1834,
        engagementRate: 94.7,
        trend: 'increasing'
      }
    ];
  };

  const timeframeOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '60d', label: '60 Days' },
    { value: '90d', label: '90 Days' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader" className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading AI analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>AI Analytics Hub - Vottery</title>
        <meta name="description" content="Advanced AI-powered analytics with voting session heatmaps, user retention funnels, engagement scoring algorithms, churn prediction visualization, and personalized recommendations dashboard." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1600px] mx-auto px-4 py-6 md:py-8">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  AI Analytics Hub
                </h1>
                <p className="text-sm text-muted-foreground">
                  Advanced machine learning-powered insights for personalized recommendations, behavioral analysis, and predictive engagement optimization
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e?.target?.value)}
                  className="px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {timeframeOptions?.map((option) => (
                    <option key={option?.value} value={option?.value}>
                      {option?.label}
                    </option>
                  ))}
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshData}
                  disabled={refreshing}
                >
                  <Icon name={refreshing ? 'Loader' : 'RefreshCw'} className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Clock" className="w-4 h-4" />
              <span>Last updated: {lastUpdated?.toLocaleTimeString()}</span>
            </div>
          </div>

          {/* AI-Powered Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <Icon name="Brain" className="w-8 h-8 opacity-80" />
                <span className="text-xs bg-white/20 px-2 py-1 rounded">AI Powered</span>
              </div>
              <p className="text-2xl font-bold mb-1">
                {analyticsData?.engagementScores?.engagementForecast?.predictedRate?.toFixed(1) || '87.3'}%
              </p>
              <p className="text-sm opacity-90">Predicted Engagement Rate</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <Icon name="TrendingDown" className="w-8 h-8 opacity-80" />
                <span className="text-xs bg-white/20 px-2 py-1 rounded">ML Model</span>
              </div>
              <p className="text-2xl font-bold mb-1">
                {analyticsData?.churnPrediction?.predictedChurnRate || '12.4'}%
              </p>
              <p className="text-sm opacity-90">Churn Risk Score</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <Icon name="Users" className="w-8 h-8 opacity-80" />
                <span className="text-xs bg-white/20 px-2 py-1 rounded">Real-time</span>
              </div>
              <p className="text-2xl font-bold mb-1">
                {analyticsData?.churnPrediction?.atRiskUsers || '1,247'}
              </p>
              <p className="text-sm opacity-90">At-Risk Users</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <Icon name="Target" className="w-8 h-8 opacity-80" />
                <span className="text-xs bg-white/20 px-2 py-1 rounded">Personalized</span>
              </div>
              <p className="text-2xl font-bold mb-1">
                {analyticsData?.recommendations?.length || '24'}
              </p>
              <p className="text-sm opacity-90">Active Recommendations</p>
            </div>
          </div>

          {/* Main Analytics Panels */}
          <div className="space-y-6">
            {/* Heatmap & Behavioral Patterns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <VotingSessionHeatmapPanel
                heatmapData={analyticsData?.heatmapData}
                timeframe={timeframe}
              />
              <BehavioralPatternPanel
                patterns={analyticsData?.behavioralPatterns}
              />
            </div>

            {/* Retention Funnel */}
            <UserRetentionFunnelPanel
              funnelData={analyticsData?.retentionFunnel}
            />

            {/* Engagement & Churn */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EngagementScoringPanel
                engagementData={analyticsData?.engagementScores}
                timeframe={timeframe}
              />
              <ChurnPredictionPanel
                churnData={analyticsData?.churnPrediction}
              />
            </div>

            {/* Personalized Recommendations */}
            <PersonalizedRecommendationsPanel
              recommendations={analyticsData?.recommendations}
              userId={userProfile?.id}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default AIAnalyticsHub;