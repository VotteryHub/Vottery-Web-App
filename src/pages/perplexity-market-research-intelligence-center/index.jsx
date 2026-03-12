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
      
      const mockElectionData = {
        totalVotes: 15420,
        elections: 87,
        avgEngagement: 68.5,
        topCategories: ['Politics', 'Entertainment', 'Sports']
      };

      const mockBrandData = {
        brandName: 'Sample Brand',
        marketShare: 23.5,
        recentCampaigns: 12,
        avgROI: 3.2
      };

      const mockCompetitors = [
        { name: 'Competitor A', marketShare: 28.3 },
        { name: 'Competitor B', marketShare: 19.7 },
        { name: 'Competitor C', marketShare: 15.2 }
      ];

      const mockHistoricalData = {
        pastMonths: 6,
        growthRate: 12.5,
        seasonalTrends: ['Q4 peak', 'Summer dip']
      };

      const mockMultiPlatformData = {
        platforms: ['Vottery', 'Social Media', 'Forums'],
        totalMentions: 45230,
        sentimentScore: 0.72
      };

      const mockRealTimeData = {
        activeUsers: 3420,
        liveElections: 23,
        trendingTopics: ['Election Reform', 'Brand Voting']
      };

      const [sentimentResult, competitiveResult, trendsResult, crossPlatformResult, pulseResult] = await Promise.all([
        perplexityMarketResearchService?.analyzeVotingSentiment(mockElectionData, timeRange),
        perplexityMarketResearchService?.generateCompetitiveIntelligence(mockBrandData, mockCompetitors),
        perplexityMarketResearchService?.forecastTrends(mockHistoricalData, '90d'),
        perplexityMarketResearchService?.analyzeCrossPlatformSentiment(mockMultiPlatformData),
        perplexityMarketResearchService?.generateMarketPulse(mockRealTimeData)
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