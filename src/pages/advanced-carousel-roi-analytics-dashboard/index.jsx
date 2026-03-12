import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RevenueOverviewPanel from './components/RevenueOverviewPanel';
import SponsorshipPerformancePanel from './components/SponsorshipPerformancePanel';
import CreatorPayoutPanel from './components/CreatorPayoutPanel';
import CarouselMonetizationPanel from './components/CarouselMonetizationPanel';
import SponsorshipROIPanel from './components/SponsorshipROIPanel';
import ZoneOptimizationPanel from './components/ZoneOptimizationPanel';
import { carouselROIAnalyticsService } from '../../services/carouselROIAnalyticsService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const AdvancedCarouselROIAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [roiData, setRoiData] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadROIData();

    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        loadROIData();
      }, 30000); // Refresh every 30 seconds
    }

    analytics?.trackEvent('carousel_roi_analytics_viewed', {
      active_tab: activeTab,
      time_range: timeRange,
      timestamp: new Date()?.toISOString()
    });

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timeRange, autoRefresh, activeTab]);

  const loadROIData = async () => {
    try {
      setLoading(true);

      const [revenueResult, sponsorshipResult, payoutsResult, monetizationResult, roiResult, optimizationResult] = await Promise.all([
        carouselROIAnalyticsService?.getRevenueByContentType(timeRange),
        carouselROIAnalyticsService?.getSponsorshipPerformance(timeRange),
        carouselROIAnalyticsService?.getCreatorPayoutsByZone(timeRange),
        carouselROIAnalyticsService?.getCarouselMonetizationComparison(timeRange),
        carouselROIAnalyticsService?.getSponsorshipROI(timeRange),
        carouselROIAnalyticsService?.getZoneOptimizationRecommendations()
      ]);

      setRoiData({
        revenue: revenueResult?.data,
        sponsorship: sponsorshipResult?.data,
        payouts: payoutsResult?.data,
        monetization: monetizationResult?.data,
        roi: roiResult?.data,
        optimization: optimizationResult?.data
      });
    } catch (error) {
      console.error('Error loading ROI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Revenue Overview', icon: 'DollarSign' },
    { id: 'sponsorship', label: 'Sponsorship Performance', icon: 'TrendingUp' },
    { id: 'payouts', label: 'Creator Payouts', icon: 'Users' },
    { id: 'monetization', label: 'Carousel Monetization', icon: 'BarChart3' },
    { id: 'roi', label: 'Sponsorship ROI', icon: 'Target' },
    { id: 'optimization', label: 'Zone Optimization', icon: 'Sparkles' }
  ];

  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ];

  return (
    <>
      <Helmet>
        <title>Advanced Carousel ROI Analytics Dashboard | Vottery</title>
        <meta name="description" content="Comprehensive revenue intelligence tracking monetization performance across all carousel types" />
      </Helmet>
      <div className="flex h-screen bg-background">
        <LeftSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <HeaderNavigation />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Advanced Carousel ROI Analytics Dashboard</h1>
                    <p className="text-muted-foreground">Revenue intelligence with zone-specific optimization across eight purchasing power zones</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg">
                      {timeRanges?.map(range => (
                        <button
                          key={range?.value}
                          onClick={() => setTimeRange(range?.value)}
                          className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                            timeRange === range?.value
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {range?.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg">
                      <Icon name={autoRefresh ? 'RefreshCw' : 'Pause'} size={18} className={autoRefresh ? 'text-green-500 animate-spin' : 'text-muted-foreground'} />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setAutoRefresh(!autoRefresh)}
                      >
                        {autoRefresh ? 'Pause' : 'Resume'}
                      </Button>
                    </div>
                    <Button onClick={loadROIData} disabled={loading}>
                      <Icon name="RefreshCw" size={18} className={loading ? 'animate-spin' : ''} />
                      Refresh
                    </Button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <Icon name="DollarSign" size={24} className="text-green-500" />
                      <span className="text-xs font-medium text-green-600 bg-green-500/20 px-2 py-1 rounded">Total</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">${roiData?.revenue?.total?.toLocaleString() || '0'}</p>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <Icon name="TrendingUp" size={24} className="text-blue-500" />
                      <span className="text-xs font-medium text-blue-600 bg-blue-500/20 px-2 py-1 rounded">CPM</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">${roiData?.sponsorship?.cpm || '0.00'}</p>
                    <p className="text-sm text-muted-foreground">Cost Per Mille</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <Icon name="Users" size={24} className="text-purple-500" />
                      <span className="text-xs font-medium text-purple-600 bg-purple-500/20 px-2 py-1 rounded">8 Zones</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{Object.keys(roiData?.payouts || {})?.length}</p>
                    <p className="text-sm text-muted-foreground">Active Zones</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <Icon name="Target" size={24} className="text-yellow-500" />
                      <span className="text-xs font-medium text-yellow-600 bg-yellow-500/20 px-2 py-1 rounded">ROI</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{roiData?.roi?.roi || '0'}%</p>
                    <p className="text-sm text-muted-foreground">Sponsorship ROI</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-6 overflow-x-auto">
                {tabs?.map(tab => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                      activeTab === tab?.id
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-card text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon name={tab?.icon} size={18} />
                    {tab?.label}
                  </button>
                ))}
              </div>

              {/* Content Panels */}
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Icon name="Loader2" size={48} className="animate-spin text-primary" />
                </div>
              ) : (
                <>
                  {activeTab === 'overview' && <RevenueOverviewPanel data={roiData} timeRange={timeRange} />}
                  {activeTab === 'sponsorship' && <SponsorshipPerformancePanel data={roiData} timeRange={timeRange} />}
                  {activeTab === 'payouts' && <CreatorPayoutPanel data={roiData} timeRange={timeRange} />}
                  {activeTab === 'monetization' && <CarouselMonetizationPanel data={roiData} timeRange={timeRange} />}
                  {activeTab === 'roi' && <SponsorshipROIPanel data={roiData} timeRange={timeRange} />}
                  {activeTab === 'optimization' && <ZoneOptimizationPanel data={roiData} timeRange={timeRange} />}
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AdvancedCarouselROIAnalyticsDashboard;