import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ActiveUsersPanel from './components/ActiveUsersPanel';
import ConcurrentElectionsPanel from './components/ConcurrentElectionsPanel';
import RevenueStreamsPanel from './components/RevenueStreamsPanel';
import AdPerformancePanel from './components/AdPerformancePanel';
import { analyticsService } from '../../services/analyticsService';

const LivePlatformMonitoringDashboard = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [metricsData, setMetricsData] = useState({
    activeUsers: null,
    elections: null,
    revenue: null,
    adPerformance: null
  });

  useEffect(() => {
    loadPlatformMetrics();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, [timeRange]);

  const loadPlatformMetrics = async () => {
    try {
      setLoading(true);
      const [engagementResult, electionsResult, revenueResult, adROIResult] = await Promise.all([
        analyticsService?.getEngagementMetrics(timeRange),
        analyticsService?.getElectionPerformance(timeRange),
        analyticsService?.getRevenueMetrics(timeRange),
        analyticsService?.getAdROIMetrics(timeRange)
      ]);

      setMetricsData({
        activeUsers: engagementResult?.data,
        elections: electionsResult?.data,
        revenue: revenueResult?.data,
        adPerformance: adROIResult?.data
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load platform metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadPlatformMetrics();
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

  return (
    <>
      <Helmet>
        <title>Live Platform Monitoring Dashboard - Vottery</title>
        <meta name="description" content="Real-time platform monitoring with 30-second refresh intervals for active users, concurrent elections, revenue streams, and ad campaign performance." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Live Platform Monitoring
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Real-time system oversight with 30-second refresh intervals
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs text-muted-foreground">
                    Live • Updated {lastUpdated?.toLocaleTimeString()}
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
                Export Report
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Icon name="Loader" size={48} className="text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading platform metrics...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <ActiveUsersPanel data={metricsData?.activeUsers} timeRange={timeRange} />

              <ConcurrentElectionsPanel data={metricsData?.elections} timeRange={timeRange} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueStreamsPanel data={metricsData?.revenue} timeRange={timeRange} />
                <AdPerformancePanel data={metricsData?.adPerformance} timeRange={timeRange} />
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default LivePlatformMonitoringDashboard;