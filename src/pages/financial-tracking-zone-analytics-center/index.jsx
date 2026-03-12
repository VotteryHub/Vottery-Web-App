import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import FinancialOverviewPanel from './components/FinancialOverviewPanel';
import ZonePerformancePanel from './components/ZonePerformancePanel';
import ForecastingEnginePanel from './components/ForecastingEnginePanel';
import FinancialOptimizationPanel from './components/FinancialOptimizationPanel';
import AdvancedReportingPanel from './components/AdvancedReportingPanel';
import RealTimeAlertsPanel from './components/RealTimeAlertsPanel';
import { financialTrackingService } from '../../services/financialTrackingService';
import { supabase } from '../../lib/supabase';
import { analytics } from '../../hooks/useGoogleAnalytics';

const FinancialTrackingZoneAnalyticsCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [financialData, setFinancialData] = useState({
    overview: null,
    zonePerformance: [],
    forecasts: [],
    recommendations: []
  });

  useEffect(() => {
    loadFinancialData();
    analytics?.trackEvent('financial_tracking_viewed', {
      active_tab: activeTab,
      time_range: timeRange
    });

    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    // Subscribe to real-time financial tracking updates
    const financialChannel = supabase
      ?.channel('financial_tracking_real_time')
      ?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'financial_tracking' },
        (payload) => {
          console.log('Financial tracking update:', payload);
          refreshData();
        }
      )
      ?.subscribe();

    const forecastChannel = supabase
      ?.channel('financial_forecasts_real_time')
      ?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'financial_forecasts' },
        (payload) => {
          console.log('Financial forecast update:', payload);
          refreshData();
        }
      )
      ?.subscribe();

    return () => {
      clearInterval(interval);
      if (financialChannel) {
        supabase?.removeChannel(financialChannel);
      }
      if (forecastChannel) {
        supabase?.removeChannel(forecastChannel);
      }
    };
  }, [timeRange]);

  const loadFinancialData = async () => {
    try {
      setLoading(true);
      const [overviewResult, zoneResult, forecastsResult, recommendationsResult] = await Promise.all([
        financialTrackingService?.getFinancialOverview(timeRange),
        financialTrackingService?.getZonePerformance(timeRange),
        financialTrackingService?.getFinancialForecasts(),
        financialTrackingService?.getOptimizationRecommendations()
      ]);

      setFinancialData({
        overview: overviewResult?.data,
        zonePerformance: zoneResult?.data || [],
        forecasts: forecastsResult?.data || [],
        recommendations: recommendationsResult?.data || []
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadFinancialData();
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

  const tabs = [
    { id: 'overview', label: 'Financial Overview', icon: 'DollarSign' },
    { id: 'zones', label: 'Zone Performance', icon: 'MapPin' },
    { id: 'forecasting', label: 'Forecasting Engine', icon: 'TrendingUp' },
    { id: 'optimization', label: 'Optimization', icon: 'Target' },
    { id: 'reporting', label: 'Advanced Reporting', icon: 'FileText' },
    { id: 'alerts', label: 'Real-Time Alerts', icon: 'Bell' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <FinancialOverviewPanel overview={financialData?.overview} timeRange={timeRange} loading={loading} />;
      case 'zones':
        return <ZonePerformancePanel zoneData={financialData?.zonePerformance} timeRange={timeRange} loading={loading} />;
      case 'forecasting':
        return <ForecastingEnginePanel forecasts={financialData?.forecasts} loading={loading} />;
      case 'optimization':
        return <FinancialOptimizationPanel recommendations={financialData?.recommendations} loading={loading} />;
      case 'reporting':
        return <AdvancedReportingPanel timeRange={timeRange} loading={loading} />;
      case 'alerts':
        return <RealTimeAlertsPanel loading={loading} />;
      default:
        return <FinancialOverviewPanel overview={financialData?.overview} timeRange={timeRange} loading={loading} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Financial Tracking & Zone Analytics Center - Vottery</title>
        <meta name="description" content="Comprehensive financial oversight across prize pools, participation fees, advertiser spending, and ROI analytics with zone-specific performance tracking and predictive forecasting." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Financial Tracking & Zone Analytics Center
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Comprehensive financial oversight with zone-specific performance tracking and predictive forecasting
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
              <Button variant="outline" size="sm" iconName="Download" className="ml-auto">
                Export Financial Report
              </Button>
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

          {loading && activeTab === 'overview' ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Icon name="Loader" size={48} className="text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading financial data...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {renderTabContent()}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default FinancialTrackingZoneAnalyticsCenter;