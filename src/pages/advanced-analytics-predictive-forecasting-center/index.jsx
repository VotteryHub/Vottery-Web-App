import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PredictiveAnalyticsPanel from './components/PredictiveAnalyticsPanel';
import CreatorRevenueOptimizationPanel from './components/CreatorRevenueOptimizationPanel';
import AdvancedForecastingEnginePanel from './components/AdvancedForecastingEnginePanel';
import PerformanceIntelligencePanel from './components/PerformanceIntelligencePanel';
import InteractiveDrillDownPanel from './components/InteractiveDrillDownPanel';
import ScenarioModelingPanel from './components/ScenarioModelingPanel';
import { enhancedAnalyticsService } from '../../services/enhancedAnalyticsService';
import { claudeAnalyticsService } from '../../services/claudeAnalyticsService';
import { creatorEarningsService } from '../../services/creatorEarningsService';
import { useAuth } from '../../contexts/AuthContext';
import { analytics } from '../../hooks/useGoogleAnalytics';

const AdvancedAnalyticsPredictiveForecastingCenter = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('predictive');
  const [timeframe, setTimeframe] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [analyticsData, setAnalyticsData] = useState({
    predictiveMetrics: null,
    revenueOptimization: null,
    forecastingData: null,
    performanceIntelligence: null
  });

  useEffect(() => {
    loadAnalyticsData();
    
    const interval = setInterval(() => {
      refreshData();
    }, 90000);

    return () => clearInterval(interval);
  }, [timeframe]);

  useEffect(() => {
    analytics?.trackEvent('advanced_analytics_viewed', {
      timeframe,
      tab: activeTab,
      timestamp: new Date()?.toISOString()
    });
  }, [timeframe, activeTab]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const [predictiveResult, revenueResult, claudeResult] = await Promise.all([
        enhancedAnalyticsService?.getPredictiveEngagementMetrics(timeframe),
        creatorEarningsService?.getCreatorEarningsOverview(user?.id),
        claudeAnalyticsService?.generatePredictiveInsights()
      ]);

      setAnalyticsData({
        predictiveMetrics: predictiveResult?.data,
        revenueOptimization: revenueResult?.data,
        forecastingData: claudeResult?.data,
        performanceIntelligence: predictiveResult?.data
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

  const tabs = [
    { id: 'predictive', label: 'Predictive Analytics', icon: 'TrendingUp' },
    { id: 'revenue', label: 'Revenue Optimization', icon: 'DollarSign' },
    { id: 'forecasting', label: 'Advanced Forecasting', icon: 'Activity' },
    { id: 'intelligence', label: 'Performance Intelligence', icon: 'Brain' },
    { id: 'drilldown', label: 'Interactive Drill-Down', icon: 'Search' },
    { id: 'scenarios', label: 'Scenario Modeling', icon: 'GitBranch' }
  ];

  const timeframeOptions = [
    { value: '30d', label: '30 Days' },
    { value: '60d', label: '60 Days' },
    { value: '90d', label: '90 Days' }
  ];

  return (
    <>
      <Helmet>
        <title>Advanced Analytics & Predictive Forecasting Center - Vottery</title>
        <meta name="description" content="Comprehensive platform intelligence with machine learning-powered predictions, creator revenue optimization, and strategic decision support across all Vottery operations." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1600px] mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Advanced Analytics & Predictive Forecasting Center
                </h1>
                <p className="text-sm text-muted-foreground">
                  Comprehensive platform intelligence with ML-powered predictions and strategic decision support
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
              <span className="text-sm text-muted-foreground">Forecast Timeframe:</span>
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

          <div className="mb-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab?.id
                      ? 'bg-primary text-white' :'bg-card border border-border text-foreground hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  {tab?.label}
                </button>
              ))}
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
              {activeTab === 'predictive' && (
                <PredictiveAnalyticsPanel 
                  data={analyticsData?.predictiveMetrics} 
                  timeframe={timeframe}
                />
              )}

              {activeTab === 'revenue' && (
                <CreatorRevenueOptimizationPanel 
                  data={analyticsData?.revenueOptimization} 
                  timeframe={timeframe}
                />
              )}

              {activeTab === 'forecasting' && (
                <AdvancedForecastingEnginePanel 
                  data={analyticsData?.forecastingData} 
                  timeframe={timeframe}
                />
              )}

              {activeTab === 'intelligence' && (
                <PerformanceIntelligencePanel 
                  data={analyticsData?.performanceIntelligence} 
                  timeframe={timeframe}
                />
              )}

              {activeTab === 'drilldown' && (
                <InteractiveDrillDownPanel 
                  timeframe={timeframe}
                />
              )}

              {activeTab === 'scenarios' && (
                <ScenarioModelingPanel 
                  timeframe={timeframe}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default AdvancedAnalyticsPredictiveForecastingCenter;