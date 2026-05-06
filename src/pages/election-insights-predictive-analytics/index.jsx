import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import VotingTrendsForecast from './components/VotingTrendsForecast';
import DemographicAnalysis from './components/DemographicAnalysis';
import OutcomeProbabilities from './components/OutcomeProbabilities';
import StrategicInsights from './components/StrategicInsights';
import { insightsService } from '../../services/insightsService';

const ElectionInsightsPredictiveAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [insightsData, setInsightsData] = useState({
    votingTrends: null,
    demographics: null,
    outcomes: null,
    participation: null,
    geographic: null,
    recommendations: null,
    summary: null
  });

  useEffect(() => {
    loadInsightsData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, [timeRange]);

  const loadInsightsData = async () => {
    try {
      setLoading(true);
      const [trendsResult, demographicsResult, outcomesResult, participationResult, geographicResult, recommendationsResult, summaryResult] = await Promise.all([
        insightsService?.getVotingTrendForecasts(timeRange),
        insightsService?.getDemographicShiftPatterns(),
        insightsService?.getElectionOutcomeProbabilities(),
        insightsService?.getParticipationRatePredictions(),
        insightsService?.getGeographicVotingPatterns(),
        insightsService?.getStrategicRecommendations(),
        insightsService?.getInsightsSummary()
      ]);

      setInsightsData({
        votingTrends: trendsResult?.data,
        demographics: demographicsResult?.data,
        outcomes: outcomesResult?.data,
        participation: participationResult?.data,
        geographic: geographicResult?.data,
        recommendations: recommendationsResult?.data,
        summary: summaryResult?.data
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load insights data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadInsightsData();
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

  const summaryMetrics = [
    {
      label: 'Elections Analyzed',
      value: insightsData?.summary?.totalElectionsAnalyzed?.toLocaleString() || '0',
      icon: 'BarChart3',
      bgColor: 'bg-primary/10',
      iconColor: 'var(--color-primary)'
    },
    {
      label: 'Prediction Accuracy',
      value: `${insightsData?.summary?.predictionAccuracy || 0}%`,
      icon: 'Target',
      bgColor: 'bg-success/10',
      iconColor: 'var(--color-success)'
    },
    {
      label: 'Trending Demographic',
      value: insightsData?.summary?.trendingDemographic || 'N/A',
      icon: 'TrendingUp',
      bgColor: 'bg-accent/10',
      iconColor: 'var(--color-accent)'
    },
    {
      label: 'Fastest Growing Zone',
      value: insightsData?.summary?.fastestGrowingZone || 'N/A',
      icon: 'Zap',
      bgColor: 'bg-warning/10',
      iconColor: 'var(--color-warning)'
    }
  ];

  return (
    <GeneralPageLayout title="Election Insights" showSidebar={true}>
      <Helmet>
        <title>Election Insights & Predictive Analytics - Vottery</title>
        <meta name="description" content="Comprehensive forecasting and trend analysis showing voting trend forecasts, demographic shift patterns, and election outcome probabilities for strategic planning." />
      </Helmet>

      <div className="w-full py-0">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Election Insights & Predictive Analytics
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Machine learning-powered forecasting for strategic election planning
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
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-foreground">Forecast Period:</span>
              <div className="flex gap-2">
                {timeRangeOptions?.map((option) => (
                  <button
                    key={option?.value}
                    onClick={() => setTimeRange(option?.value)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-250 ${
                      timeRange === option?.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-foreground hover:bg-muted border border-border'
                    }`}
                  >
                    {option?.label}
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm" iconName="Download" className="ml-auto">
                Export Report
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Icon name="Loader" size={48} className="text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading predictive analytics...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryMetrics?.map((metric, index) => (
                  <div key={index} className="card">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${metric?.bgColor}`}>
                        <Icon name={metric?.icon} size={20} color={metric?.iconColor} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground">{metric?.label}</p>
                        <p className="text-xl font-heading font-bold text-foreground font-data truncate">{metric?.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <VotingTrendsForecast
                trends={insightsData?.votingTrends}
                timeRange={timeRange}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DemographicAnalysis
                  demographics={insightsData?.demographics}
                  participation={insightsData?.participation}
                  geographic={insightsData?.geographic}
                />

                <OutcomeProbabilities
                  outcomes={insightsData?.outcomes}
                />
              </div>

              <StrategicInsights
                recommendations={insightsData?.recommendations}
              />
            </div>
          )}
      </div>
    </GeneralPageLayout>
  );
};

export default ElectionInsightsPredictiveAnalytics;