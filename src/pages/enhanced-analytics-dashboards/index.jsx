import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PredictiveOverviewPanel from './components/PredictiveOverviewPanel';
import RealTimeForecastingPanel from './components/RealTimeForecastingPanel';
import UserBehaviorAnalyticsPanel from './components/UserBehaviorAnalyticsPanel';
import CampaignPerformancePanel from './components/CampaignPerformancePanel';
import ScenarioModelingPanel from './components/ScenarioModelingPanel';
import MultiVariateAnalysisPanel from './components/MultiVariateAnalysisPanel';
import { enhancedAnalyticsService } from '../../services/enhancedAnalyticsService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const EnhancedAnalyticsDashboards = () => {
  const [timeframe, setTimeframe] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [analyticsData, setAnalyticsData] = useState({
    predictiveMetrics: null,
    userBehavior: null,
    campaignPredictions: null
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
    analytics?.trackEvent('enhanced_analytics_viewed', {
      timeframe,
      timestamp: new Date()?.toISOString()
    });
  }, [timeframe]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const [predictiveResult, behaviorResult, campaignResult] = await Promise.all([
        enhancedAnalyticsService?.getPredictiveEngagementMetrics(timeframe),
        enhancedAnalyticsService?.getUserBehaviorForecasting(timeframe),
        enhancedAnalyticsService?.getCampaignPerformancePredictions()
      ]);

      setAnalyticsData({
        predictiveMetrics: predictiveResult?.data,
        userBehavior: behaviorResult?.data,
        campaignPredictions: campaignResult?.data
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
    { value: '60d', label: '60 Days' }
  ];

  return (
    <>
      <Helmet>
        <title>Enhanced Analytics Dashboards - Vottery</title>
        <meta name="description" content="Advanced real-time engagement forecasting and predictive analytics with machine learning-powered insights across all platform operations." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Enhanced Analytics Dashboards
                </h1>
                <p className="text-sm text-muted-foreground">
                  Advanced predictive analytics with real-time engagement forecasting and ML-powered insights
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
                  className="flex items-center gap-2"
                >
                  <Icon 
                    name="RefreshCw" 
                    size={16} 
                    className={refreshing ? 'animate-spin' : ''} 
                  />
                  <span className="hidden md:inline">Refresh</span>
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">Prediction Timeframe:</span>
              <div className="flex gap-2">
                {timeframeOptions?.map((option) => (
                  <button
                    key={option?.value}
                    onClick={() => setTimeframe(option?.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      timeframe === option?.value
                        ? 'bg-primary text-white' :'bg-card border border-border text-foreground hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {option?.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Icon name="Loader" size={40} className="animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Loading predictive analytics...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <PredictiveOverviewPanel 
                data={analyticsData?.predictiveMetrics} 
                timeframe={timeframe}
              />

              <RealTimeForecastingPanel 
                data={analyticsData?.predictiveMetrics} 
                timeframe={timeframe}
              />

              <UserBehaviorAnalyticsPanel 
                data={analyticsData?.userBehavior} 
                timeframe={timeframe}
              />

              <CampaignPerformancePanel 
                data={analyticsData?.campaignPredictions} 
                timeframe={timeframe}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ScenarioModelingPanel />
                <MultiVariateAnalysisPanel />
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default EnhancedAnalyticsDashboards;