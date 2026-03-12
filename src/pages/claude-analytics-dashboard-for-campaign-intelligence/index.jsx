import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import CampaignPerformancePanel from './components/CampaignPerformancePanel';
import AllocationOptimizationPanel from './components/AllocationOptimizationPanel';
import StrategicRecommendationsPanel from './components/StrategicRecommendationsPanel';
import UserSegmentAnalysisPanel from './components/UserSegmentAnalysisPanel';
import PredictiveInsightsPanel from './components/PredictiveInsightsPanel';
import { claudeAnalyticsService } from '../../services/claudeAnalyticsService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const ClaudeAnalyticsDashboardForCampaignIntelligence = () => {
  const [activeTab, setActiveTab] = useState('performance');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    campaignAnalysis: null,
    recommendations: [],
    userSegments: [],
    predictions: null
  });
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    loadAnalyticsData();
    analytics?.trackEvent('claude_analytics_dashboard_viewed', {
      active_tab: activeTab
    });

    const interval = setInterval(() => {
      refreshData();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const [campaignResult, recommendationsResult, segmentsResult, predictionsResult] = await Promise.all([
        claudeAnalyticsService?.analyzeCampaignPerformance(),
        claudeAnalyticsService?.generateStrategicRecommendations(),
        claudeAnalyticsService?.analyzeUserSegments(),
        claudeAnalyticsService?.generatePredictiveInsights()
      ]);

      setAnalyticsData({
        campaignAnalysis: campaignResult?.data,
        recommendations: recommendationsResult?.data || [],
        userSegments: segmentsResult?.data || [],
        predictions: predictionsResult?.data
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

  const handleGenerateAnalysis = async () => {
    try {
      setRefreshing(true);
      await claudeAnalyticsService?.generateFullAnalysis();
      await loadAnalyticsData();
    } catch (error) {
      console.error('Failed to generate analysis:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const tabs = [
    { id: 'performance', label: 'Campaign Performance', icon: 'BarChart' },
    { id: 'optimization', label: 'Allocation Optimization', icon: 'Target' },
    { id: 'recommendations', label: 'Strategic Recommendations', icon: 'Lightbulb' },
    { id: 'segments', label: 'User Segment Analysis', icon: 'Users' },
    { id: 'predictions', label: 'Predictive Insights', icon: 'TrendingUp' }
  ];

  return (
    <>
      <Helmet>
        <title>Claude Analytics Dashboard for Campaign Intelligence - Vottery</title>
        <meta name="description" content="Leverage Claude AI to analyze campaign performance patterns, predict optimal allocation adjustments, and generate strategic recommendations for prize distribution across user segments." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Claude Analytics Dashboard for Campaign Intelligence
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  AI-powered campaign performance analysis and strategic recommendations for optimal prize distribution
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Updated {lastUpdated?.toLocaleTimeString()}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  iconName={refreshing ? "Loader" : "RefreshCw"}
                  onClick={refreshData}
                  disabled={refreshing}
                  className={refreshing ? 'animate-spin' : ''}
                >
                  Refresh
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  iconName="Sparkles"
                  onClick={handleGenerateAnalysis}
                  disabled={refreshing}
                >
                  Generate Analysis
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-250 ${
                    activeTab === tab?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-foreground hover:bg-muted border border-border'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  {tab?.label}
                </button>
              ))}
            </div>
          </div>

          {loading && activeTab === 'performance' ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Icon name="Loader" size={48} className="text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading analytics data...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {activeTab === 'performance' && <CampaignPerformancePanel analysis={analyticsData?.campaignAnalysis} onRefresh={loadAnalyticsData} />}
              {activeTab === 'optimization' && <AllocationOptimizationPanel analysis={analyticsData?.campaignAnalysis} onRefresh={loadAnalyticsData} />}
              {activeTab === 'recommendations' && <StrategicRecommendationsPanel recommendations={analyticsData?.recommendations} />}
              {activeTab === 'segments' && <UserSegmentAnalysisPanel segments={analyticsData?.userSegments} />}
              {activeTab === 'predictions' && <PredictiveInsightsPanel predictions={analyticsData?.predictions} />}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default ClaudeAnalyticsDashboardForCampaignIntelligence;