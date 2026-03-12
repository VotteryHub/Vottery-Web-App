import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import SentimentTrendsPanel from './components/SentimentTrendsPanel';
import CampaignInsightsPanel from './components/CampaignInsightsPanel';
import EngagementPredictionsPanel from './components/EngagementPredictionsPanel';
import FraudDetectionPanel from './components/FraudDetectionPanel';
import StrategicRecommendations from './components/StrategicRecommendations';
import { aiSentimentService } from '../../services/aiSentimentService';
import { aiFraudDetectionService } from '../../services/aiFraudDetectionService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const AISentimentStrategyAnalytics = () => {
  const [activeTab, setActiveTab] = useState('sentiment');
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [analyticsData, setAnalyticsData] = useState({
    sentiment: null,
    campaignReactions: null,
    engagementPredictions: null,
    fraudAnalysis: null,
    strategicInsights: null
  });

  useEffect(() => {
    loadAnalyticsData();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      refreshData();
    }, 60000);

    return () => clearInterval(interval);
  }, [timeRange]);

  useEffect(() => {
    // Track AI analytics page view
    analytics?.trackEvent('ai_analytics_viewed', {
      has_sentiment_data: !!analyticsData?.sentiment,
      has_fraud_data: !!analyticsData?.fraudAnalysis,
      timestamp: new Date()?.toISOString()
    });
  }, [analyticsData?.sentiment, analyticsData?.fraudAnalysis]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Using mock data for demo - replace with actual API calls when OpenAI key is configured
      const [sentimentResult, reactionsResult, predictionsResult, fraudResult] = await Promise.all([
        aiSentimentService?.getMockSentimentData(),
        aiSentimentService?.getMockCampaignReactions(),
        aiSentimentService?.getMockEngagementPredictions(),
        aiFraudDetectionService?.getMockFraudAnalysis()
      ]);

      // Generate strategic insights based on all data
      const insightsResult = await aiSentimentService?.generateStrategicInsights({
        sentiment: sentimentResult?.data,
        reactions: reactionsResult?.data,
        predictions: predictionsResult?.data
      })?.catch(() => ({
        data: {
          contentOptimization: ['Increase video content by 30%', 'Focus on interactive elements'],
          targetingStrategy: ['Target 18-34 demographic', 'Expand to underserved regions'],
          timingRecommendations: ['Peak posting: 6-8 PM weekdays', 'Weekend engagement windows'],
          budgetAllocation: ['Allocate 40% to video production', '30% to targeted ads'],
          riskFactors: ['Monitor for coordinated manipulation', 'Watch for sentiment shifts']
        },
        error: null
      }));

      setAnalyticsData({
        sentiment: sentimentResult?.data,
        campaignReactions: reactionsResult?.data,
        engagementPredictions: predictionsResult?.data,
        fraudAnalysis: fraudResult?.data,
        strategicInsights: insightsResult?.data
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

  const timeRangeOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ];

  const tabs = [
    { id: 'sentiment', label: 'Voter Sentiment', icon: 'TrendingUp' },
    { id: 'campaigns', label: 'Campaign Insights', icon: 'Target' },
    { id: 'predictions', label: 'Engagement Predictions', icon: 'Activity' },
    { id: 'fraud', label: 'Fraud Detection', icon: 'Shield' },
    { id: 'strategy', label: 'Strategic Insights', icon: 'Lightbulb' }
  ];

  return (
    <>
      <Helmet>
        <title>AI Sentiment & Strategy Analytics | VoteChain</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground flex items-center gap-3">
                <Icon name="Brain" size={32} className="text-primary" />
                AI Sentiment & Strategy Analytics
              </h1>
              <p className="text-muted-foreground mt-2">
                AI-powered voter sentiment analysis, campaign insights, and predictive fraud detection
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Time Range Selector */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e?.target?.value)}
                className="px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {timeRangeOptions?.map(option => (
                  <option key={option?.value} value={option?.value}>
                    {option?.label}
                  </option>
                ))}
              </select>

              {/* Refresh Button */}
              <Button
                onClick={refreshData}
                disabled={refreshing}
                className="flex items-center gap-2"
              >
                <Icon 
                  name="RefreshCw" 
                  size={16} 
                  className={refreshing ? 'animate-spin' : ''} 
                />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>

          {/* Last Updated */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Icon name="Clock" size={14} />
            <span>Last updated: {lastUpdated?.toLocaleTimeString()}</span>
          </div>

          {/* Tabs Navigation */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-border pb-4">
            {tabs?.map(tab => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab?.id
                    ? 'bg-primary text-white' :'bg-card text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={tab?.icon} size={18} />
                <span className="font-medium">{tab?.label}</span>
              </button>
            ))}
          </div>

          {/* Content Panels */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Icon name="Loader" size={40} className="animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              {activeTab === 'sentiment' && (
                <SentimentTrendsPanel data={analyticsData?.sentiment} />
              )}
              {activeTab === 'campaigns' && (
                <CampaignInsightsPanel data={analyticsData?.campaignReactions} />
              )}
              {activeTab === 'predictions' && (
                <EngagementPredictionsPanel data={analyticsData?.engagementPredictions} />
              )}
              {activeTab === 'fraud' && (
                <FraudDetectionPanel data={analyticsData?.fraudAnalysis} />
              )}
              {activeTab === 'strategy' && (
                <StrategicRecommendations data={analyticsData?.strategicInsights} />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AISentimentStrategyAnalytics;