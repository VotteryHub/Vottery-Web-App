import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PerformanceOverview from './components/PerformanceOverview';
import CostAnalysis from './components/CostAnalysis';
import ConversionTracking from './components/ConversionTracking';
import ZoneReachAnalytics from './components/ZoneReachAnalytics';
import GeoReachAnalytics from './components/GeoReachAnalytics';
import CampaignComparison from './components/CampaignComparison';
import { advertiserAnalyticsService } from '../../services/advertiserAnalyticsService';
import { analytics } from '../../hooks/useGoogleAnalytics';
import {
  CAMPAIGN_MANAGEMENT_ROUTE,
  CAMPAIGN_TEMPLATE_GALLERY_ROUTE,
  PARTICIPATORY_ADS_STUDIO_ROUTE,
  VOTTERY_ADS_ROUTE,
} from '../../constants/votteryAdsConstants';

const AdvertiserAnalyticsROIDashboard = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [analyticsData, setAnalyticsData] = useState({
    performance: null,
    costAnalysis: null,
    conversion: null,
    zoneReach: null,
    geoReach: null,
    comparison: null
  });

  useEffect(() => {
    loadAnalyticsData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const [performanceResult, costResult, conversionResult, zoneResult, geoResult, comparisonResult] = await Promise.all([
        advertiserAnalyticsService?.getAdvertiserPerformance(timeRange),
        advertiserAnalyticsService?.getCostAnalysis(timeRange),
        advertiserAnalyticsService?.getConversionTracking(timeRange),
        advertiserAnalyticsService?.getZoneReachMetrics(timeRange),
        advertiserAnalyticsService?.getGeoReachMetrics(timeRange),
        advertiserAnalyticsService?.getAdvertiserPerformance(timeRange)
      ]);

      setAnalyticsData({
        performance: performanceResult?.data,
        costAnalysis: costResult?.data,
        conversion: conversionResult?.data,
        zoneReach: zoneResult?.data,
        geoReach: geoResult?.data,
        comparison: comparisonResult?.data
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

  const handleExportReport = (format = 'json') => {
    try {
      const report = {
        exportedAt: new Date().toISOString(),
        timeRange,
        performance: analyticsData?.performance,
        costAnalysis: analyticsData?.costAnalysis,
        conversion: analyticsData?.conversion,
        zoneReach: analyticsData?.zoneReach,
        geoReach: analyticsData?.geoReach,
        comparison: analyticsData?.comparison
      };
      if (format === 'csv') {
        const rows = [
          ['Metric', 'Value'],
          ['Exported At', report.exportedAt],
          ['Time Range', report.timeRange],
          ['Cost Per Participant', report.costAnalysis?.costPerParticipant ?? ''],
          ['Total Spend', report.costAnalysis?.totalSpend ?? ''],
          ['Conversion Rate', report.conversion?.conversionRate ?? ''],
          ['Total Conversions', report.conversion?.totalConversions ?? '']
        ];
        const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `advertiser-roi-report-${timeRange}-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `advertiser-roi-report-${timeRange}-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const timeRangeOptions = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' }
  ];

  return (
    <>
      <Helmet>
        <title>Advertiser Analytics & ROI Dashboard - Vottery</title>
        <meta name="description" content="Comprehensive performance insights with cost-per-participant tracking, conversion analysis, zone-specific reach metrics, and detailed ROI breakdowns for campaign comparison." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Advertiser Analytics & ROI Dashboard
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Comprehensive performance insights and ROI analysis for campaign optimization
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

          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground font-medium">Related tools</span>
            <span className="text-muted-foreground hidden sm:inline">·</span>
            <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
              <Link to={CAMPAIGN_MANAGEMENT_ROUTE}>Campaign management</Link>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
              <Link to={VOTTERY_ADS_ROUTE}>Vottery Ads Studio</Link>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
              <Link to={PARTICIPATORY_ADS_STUDIO_ROUTE}>Participatory Ads</Link>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
              <Link to={CAMPAIGN_TEMPLATE_GALLERY_ROUTE}>Template gallery</Link>
            </Button>
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
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                  onClick={() => handleExportReport('json')}
                >
                  Export JSON
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="FileText"
                  onClick={() => handleExportReport('csv')}
                >
                  Export CSV
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Icon name="Loader" size={48} className="text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading analytics data...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <PerformanceOverview data={analyticsData?.performance} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CostAnalysis data={analyticsData?.costAnalysis} />
                <ConversionTracking data={analyticsData?.conversion} />
              </div>
              <ZoneReachAnalytics data={analyticsData?.zoneReach} />
              <GeoReachAnalytics data={analyticsData?.geoReach} />
              <CampaignComparison data={analyticsData?.comparison} />
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default AdvertiserAnalyticsROIDashboard;