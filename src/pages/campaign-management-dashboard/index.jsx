import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import CampaignOverview from './components/CampaignOverview';
import CampaignList from './components/CampaignList';
import LiveMetrics from './components/LiveMetrics';
import ZonePerformance from './components/ZonePerformance';
import { analyticsService } from '../../services/analyticsService';
import { campaignOptimizationService } from '../../services/campaignOptimizationService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const CampaignManagementDashboard = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showOptimizations, setShowOptimizations] = useState(false);
  const [optimizationSummary, setOptimizationSummary] = useState(null);
  const [campaignData, setCampaignData] = useState({
    overview: null,
    campaigns: null,
    liveMetrics: null,
    zonePerformance: null
  });

  useEffect(() => {
    loadCampaignData();
    loadOptimizationSummary();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, [timeRange]);

  useEffect(() => {
    // Track campaign management dashboard view
    analytics?.trackEvent('campaign_dashboard_viewed', {
      active_campaigns: campaignData?.campaigns?.filter(c => c?.status === 'active')?.length || 0,
      total_campaigns: campaignData?.campaigns?.length || 0,
      timestamp: new Date()?.toISOString()
    });
  }, [campaignData?.campaigns]);

  const loadCampaignData = async () => {
    try {
      setLoading(true);
      const [overviewResult, campaignsResult, metricsResult, zoneResult] = await Promise.all([
        analyticsService?.getCampaignOverview(timeRange),
        analyticsService?.getSponsoredCampaigns(timeRange),
        analyticsService?.getLiveCampaignMetrics(timeRange),
        analyticsService?.getZonePerformance(timeRange)
      ]);

      setCampaignData({
        overview: overviewResult?.data,
        campaigns: campaignsResult?.data,
        liveMetrics: metricsResult?.data,
        zonePerformance: zoneResult?.data
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load campaign data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOptimizationSummary = async () => {
    try {
      const result = await campaignOptimizationService?.getOptimizationDashboard(timeRange);
      if (result?.data?.summary) {
        setOptimizationSummary(result?.data?.summary);
      }
    } catch (error) {
      console.error('Failed to load optimization summary:', error);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadCampaignData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const timeRangeOptions = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' }
  ];

  const handleExportReport = (format = 'csv') => {
    try {
      const report = {
        exportedAt: new Date().toISOString(),
        timeRange,
        overview: campaignData?.overview,
        campaigns: campaignData?.campaigns,
        liveMetrics: campaignData?.liveMetrics,
        zonePerformance: campaignData?.zonePerformance
      };
      if (format === 'csv') {
        const rows = [
          ['Metric', 'Value'],
          ['Time Range', timeRange],
          ['Exported At', report.exportedAt],
          ['Active Campaigns', campaignData?.campaigns?.filter(c => c?.status === 'active')?.length ?? 0],
          ['Total Campaigns', campaignData?.campaigns?.length ?? 0]
        ];
        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `campaign-report-${timeRange}-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(a.href);
      } else {
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `campaign-report-${timeRange}-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(a.href);
      }
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <>
      <Helmet>
        <title>Campaign Management Dashboard - Vottery</title>
        <meta name="description" content="Track all active sponsored elections with live status, pause/edit controls, and real-time engagement metrics for each campaign across zones." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Campaign Management Dashboard
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Monitor and control sponsored election campaigns with live metrics
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
              <span className="text-sm font-medium text-foreground">Time Range:</span>
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
              <div className="flex gap-2 ml-auto">
                <Button variant="outline" size="sm" iconName="Download" onClick={() => handleExportReport('csv')}>
                  Export CSV
                </Button>
                <Button variant="outline" size="sm" iconName="Download" onClick={() => handleExportReport('json')}>
                  Export JSON
                </Button>
              </div>
              {optimizationSummary && optimizationSummary?.totalRecommendations > 0 && (
                <Button 
                  variant="default" 
                  size="sm" 
                  iconName="Sparkles"
                  onClick={() => window.location.href = '/automated-campaign-optimization-dashboard'}
                >
                  {optimizationSummary?.totalRecommendations} AI Recommendations
                </Button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Icon name="Loader" size={48} className="text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading campaign data...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <CampaignOverview data={campaignData?.overview} />
              <CampaignList data={campaignData?.campaigns} onRefresh={refreshData} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LiveMetrics data={campaignData?.liveMetrics} />
                <ZonePerformance data={campaignData?.zonePerformance} />
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default CampaignManagementDashboard;