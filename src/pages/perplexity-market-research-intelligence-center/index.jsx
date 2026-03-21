import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import VotingSentimentPanel from './components/VotingSentimentPanel';
import CompetitiveIntelligencePanel from './components/CompetitiveIntelligencePanel';
import TrendForecastingPanel from './components/TrendForecastingPanel';
import CrossPlatformAnalysisPanel from './components/CrossPlatformAnalysisPanel';
import MarketPulsePanel from './components/MarketPulsePanel';
import { perplexityMarketResearchService } from '../../services/perplexityMarketResearchService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const PerplexityMarketResearchIntelligenceCenter = () => {
  const [activeTab, setActiveTab] = useState('sentiment');
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [researchData, setResearchData] = useState({
    sentiment: null,
    competitive: null,
    trends: null,
    crossPlatform: null,
    marketPulse: null
  });
  const [internalSnapshot, setInternalSnapshot] = useState(null);
  const [payloadErrors, setPayloadErrors] = useState(null);

  useEffect(() => {
    loadResearchData();
    
    const interval = setInterval(() => {
      refreshData();
    }, 120000);

    return () => clearInterval(interval);
  }, [timeRange]);

  useEffect(() => {
    analytics?.trackEvent('market_research_viewed', {
      active_tab: activeTab,
      time_range: timeRange,
      timestamp: new Date()?.toISOString()
    });
  }, [activeTab, timeRange]);

  const loadResearchData = async () => {
    try {
      setLoading(true);
      
      const payloads = await perplexityMarketResearchService?.buildMarketResearchPromptInputsFromSupabase({
        timeRange
      });
      setInternalSnapshot(payloads?.internalMarketResearchContext || null);
      setPayloadErrors(payloads?.errors || null);

      const electionData = payloads?.electionData || {};
      const brandData = payloads?.brandData || { brandName: 'n/a' };
      const competitors = payloads?.competitors || [];
      const historicalData = payloads?.historicalData || {};
      const multiPlatformData = payloads?.multiPlatformData || {};
      const realTimeData = payloads?.realTimeData || {};

      const [sentimentResult, competitiveResult, trendsResult, crossPlatformResult, pulseResult] = await Promise.all([
        perplexityMarketResearchService?.analyzeVotingSentiment(electionData, timeRange),
        perplexityMarketResearchService?.generateCompetitiveIntelligence(brandData, competitors),
        perplexityMarketResearchService?.forecastTrends(historicalData, '90d'),
        perplexityMarketResearchService?.analyzeCrossPlatformSentiment(multiPlatformData),
        perplexityMarketResearchService?.generateMarketPulse(realTimeData)
      ]);

      setResearchData({
        sentiment: sentimentResult?.data,
        competitive: competitiveResult?.data,
        trends: trendsResult?.data,
        crossPlatform: crossPlatformResult?.data,
        marketPulse: pulseResult?.data
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load research data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadResearchData();
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
    { id: 'sentiment', label: 'Voting Sentiment', icon: 'TrendingUp' },
    { id: 'competitive', label: 'Competitive Intelligence', icon: 'Target' },
    { id: 'trends', label: 'Trend Forecasting', icon: 'Activity' },
    { id: 'crossPlatform', label: 'Cross-Platform Analysis', icon: 'Network' },
    { id: 'pulse', label: 'Market Pulse', icon: 'Zap' }
  ];

  return (
    <>
      <Helmet>
        <title>Perplexity Market Research Intelligence Center - Vottery</title>
        <meta name="description" content="AI-powered market research with voting sentiment analysis, competitive intelligence, and trend forecasting for brand advertisers." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
            <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Perplexity Market Research Intelligence Center
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  AI-powered voting sentiment analysis and competitive market intelligence for brand advertisers
                </p>
                {internalSnapshot?.success && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Internal snapshot ({internalSnapshot.windowDays}d): fraud alerts {internalSnapshot.fraudAlerts}, votes{' '}
                    {internalSnapshot.votes}, moderation rows {internalSnapshot.moderationResults}, content flags{' '}
                    {internalSnapshot.contentFlags}.
                  </p>
                )}
                {payloadErrors && Object.values(payloadErrors).some(Boolean) && (
                  <p className="text-xs text-amber-700 dark:text-amber-200 mt-2">
                    Some Supabase slices failed to load (RLS/schema):{' '}
                    {JSON.stringify(payloadErrors)}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
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
                <div className="text-sm text-muted-foreground">
                  <Icon name="Clock" size={14} className="inline mr-1" />
                  Updated {lastUpdated?.toLocaleTimeString()}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  iconName={refreshing ? 'Loader' : 'RefreshCw'}
                  onClick={refreshData}
                  disabled={refreshing}
                >
                  {refreshing ? 'Refreshing...' : 'Refresh'}
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
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                    activeTab === tab?.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-card text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="card p-12 text-center">
              <Icon name="Loader" size={48} className="mx-auto text-primary mb-4 animate-spin" />
              <p className="text-muted-foreground">Loading market research intelligence...</p>
            </div>
          ) : (
            <div>
              {activeTab === 'sentiment' && (
                <VotingSentimentPanel 
                  sentimentData={researchData?.sentiment}
                  timeRange={timeRange}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'competitive' && (
                <CompetitiveIntelligencePanel 
                  competitiveData={researchData?.competitive}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'trends' && (
                <TrendForecastingPanel 
                  trendsData={researchData?.trends}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'crossPlatform' && (
                <CrossPlatformAnalysisPanel 
                  crossPlatformData={researchData?.crossPlatform}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'pulse' && (
                <MarketPulsePanel 
                  pulseData={researchData?.marketPulse}
                  onRefresh={refreshData}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default PerplexityMarketResearchIntelligenceCenter;