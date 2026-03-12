import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { carouselMonitoringService } from '../../services/carouselMonitoringService';
import { analytics } from '../../hooks/useGoogleAnalytics';

ChartJS?.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const RealTimeCarouselMonitoringHub = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [liveMetrics, setLiveMetrics] = useState({
    horizontal: { swipesPerSecond: '0.00', engagementRate: '0.0', totalSwipes: 0 },
    vertical: { swipesPerSecond: '0.00', engagementRate: '0.0', totalSwipes: 0 },
    gradient: { swipesPerSecond: '0.00', engagementRate: '0.0', totalSwipes: 0 }
  });
  const [engagementByType, setEngagementByType] = useState({});
  const [revenueData, setRevenueData] = useState({});
  const [userSegments, setUserSegments] = useState([]);
  const [geoData, setGeoData] = useState([]);
  const [timePatterns, setTimePatterns] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadDashboardData();

    // Start real-time monitoring
    carouselMonitoringService?.startMonitoring('horizontal', (metrics) => {
      setLiveMetrics(prev => ({ ...prev, horizontal: metrics }));
    });
    carouselMonitoringService?.startMonitoring('vertical', (metrics) => {
      setLiveMetrics(prev => ({ ...prev, vertical: metrics }));
    });
    carouselMonitoringService?.startMonitoring('gradient', (metrics) => {
      setLiveMetrics(prev => ({ ...prev, gradient: metrics }));
    });

    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        loadDashboardData();
      }, refreshInterval);
    }

    return () => {
      carouselMonitoringService?.stopMonitoring('horizontal');
      carouselMonitoringService?.stopMonitoring('vertical');
      carouselMonitoringService?.stopMonitoring('gradient');
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval]);

  useEffect(() => {
    analytics?.trackEvent('carousel_monitoring_viewed', {
      active_tab: activeTab,
      auto_refresh: autoRefresh,
      timestamp: new Date()?.toISOString()
    });
  }, [activeTab]);

  const loadDashboardData = async () => {
    const [engagementResult, revenueResult, segmentsResult, geoResult, timeResult] = await Promise.all([
      carouselMonitoringService?.getEngagementByContentType('24h'),
      carouselMonitoringService?.getRevenueByCarousel('24h'),
      carouselMonitoringService?.getUserSegmentPerformance('24h'),
      carouselMonitoringService?.getGeographicEngagement('24h'),
      carouselMonitoringService?.getTimeOfDayPatterns('7d')
    ]);

    if (engagementResult?.data) setEngagementByType(engagementResult?.data);
    if (revenueResult?.data) setRevenueData(revenueResult?.data);
    if (segmentsResult?.data) setUserSegments(segmentsResult?.data);
    if (geoResult?.data) setGeoData(geoResult?.data);
    if (timeResult?.data) setTimePatterns(timeResult?.data);
  };

  const handleExport = async (format) => {
    const data = await carouselMonitoringService?.exportMetrics(format, '24h');
    if (data) {
      const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `carousel-metrics-${Date.now()}.${format}`;
      a?.click();
    }
  };

  const swipesPerSecondChart = {
    labels: ['Horizontal Snap', 'Vertical Stack', 'Gradient Flow'],
    datasets: [{
      label: 'Swipes/Second',
      data: [
        parseFloat(liveMetrics?.horizontal?.swipesPerSecond),
        parseFloat(liveMetrics?.vertical?.swipesPerSecond),
        parseFloat(liveMetrics?.gradient?.swipesPerSecond)
      ],
      backgroundColor: ['rgba(255, 215, 0, 0.6)', 'rgba(236, 72, 153, 0.6)', 'rgba(59, 130, 246, 0.6)'],
      borderColor: ['rgb(255, 215, 0)', 'rgb(236, 72, 153)', 'rgb(59, 130, 246)'],
      borderWidth: 2
    }]
  };

  const engagementRateChart = {
    labels: ['Horizontal', 'Vertical', 'Gradient'],
    datasets: [{
      label: 'Engagement Rate (%)',
      data: [
        parseFloat(liveMetrics?.horizontal?.engagementRate),
        parseFloat(liveMetrics?.vertical?.engagementRate),
        parseFloat(liveMetrics?.gradient?.engagementRate)
      ],
      backgroundColor: 'rgba(34, 197, 94, 0.6)',
      borderColor: 'rgb(34, 197, 94)',
      borderWidth: 2
    }]
  };

  const timeOfDayChart = {
    labels: timePatterns?.map(t => `${t?.hour}:00`),
    datasets: [{
      label: 'Engagement',
      data: timePatterns?.map(t => t?.engagement),
      borderColor: 'rgb(168, 85, 247)',
      backgroundColor: 'rgba(168, 85, 247, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  return (
    <div className="flex h-screen bg-background">
      <Helmet>
        <title>Real-Time Carousel Monitoring Hub - Vottery</title>
      </Helmet>
      <LeftSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderNavigation />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Real-Time Carousel Monitoring Hub</h1>
                <p className="text-muted-foreground">Live performance metrics, engagement analytics, and automated alerting</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-foreground">Live</span>
                </div>
                <Button
                  variant={autoRefresh ? 'primary' : 'outline'}
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className="flex items-center gap-2"
                >
                  <Icon name={autoRefresh ? 'Pause' : 'Play'} size={16} />
                  {autoRefresh ? 'Auto-Refresh On' : 'Auto-Refresh Off'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExport('json')}
                  className="flex items-center gap-2"
                >
                  <Icon name="Download" size={16} />
                  Export Data
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-border">
              {['overview', 'engagement', 'revenue', 'segments', 'geographic', 'alerts']?.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeTab === tab
                      ? 'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab?.charAt(0)?.toUpperCase() + tab?.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Live Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                      <Icon name="ArrowLeftRight" size={24} className="text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Horizontal Snap</h3>
                      <p className="text-xs text-muted-foreground">PageView Carousel</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Swipes/Sec</span>
                      <span className="text-2xl font-bold text-foreground">{liveMetrics?.horizontal?.swipesPerSecond}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Engagement</span>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">{liveMetrics?.horizontal?.engagementRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Swipes</span>
                      <span className="text-lg font-bold text-foreground">{liveMetrics?.horizontal?.totalSwipes?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/20 rounded-lg flex items-center justify-center">
                      <Icon name="Layers" size={24} className="text-pink-600 dark:text-pink-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Vertical Stack</h3>
                      <p className="text-xs text-muted-foreground">Swipe Carousel</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Swipes/Sec</span>
                      <span className="text-2xl font-bold text-foreground">{liveMetrics?.vertical?.swipesPerSecond}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Engagement</span>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">{liveMetrics?.vertical?.engagementRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Swipes</span>
                      <span className="text-lg font-bold text-foreground">{liveMetrics?.vertical?.totalSwipes?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <Icon name="Waves" size={24} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Gradient Flow</h3>
                      <p className="text-xs text-muted-foreground">Smooth Scroll</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Swipes/Sec</span>
                      <span className="text-2xl font-bold text-foreground">{liveMetrics?.gradient?.swipesPerSecond}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Engagement</span>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">{liveMetrics?.gradient?.engagementRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Swipes</span>
                      <span className="text-lg font-bold text-foreground">{liveMetrics?.gradient?.totalSwipes?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-Time Graphs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                  <h3 className="text-xl font-bold text-foreground mb-4">Swipes Per Second</h3>
                  <Bar data={swipesPerSecondChart} options={{ responsive: true, maintainAspectRatio: true }} />
                </div>

                <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                  <h3 className="text-xl font-bold text-foreground mb-4">Engagement Rate by Carousel</h3>
                  <Bar data={engagementRateChart} options={{ responsive: true, maintainAspectRatio: true }} />
                </div>
              </div>

              {/* Time of Day Patterns */}
              <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                <h3 className="text-xl font-bold text-foreground mb-4">Time-of-Day Engagement Patterns</h3>
                <Line data={timeOfDayChart} options={{ responsive: true, maintainAspectRatio: true }} />
              </div>
            </div>
          )}

          {/* Engagement Tab */}
          {activeTab === 'engagement' && (
            <div className="space-y-6">
              <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                <h3 className="text-xl font-bold text-foreground mb-6">Engagement Rates by Content Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(engagementByType)?.map(([type, data]) => (
                    <div key={type} className="p-4 bg-background rounded-lg border border-border">
                      <h4 className="font-semibold text-foreground mb-3 capitalize">{type?.replace(/([A-Z])/g, ' $1')?.trim()}</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Views</span>
                          <span className="text-sm font-bold text-foreground">{data?.views?.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Clicks</span>
                          <span className="text-sm font-bold text-foreground">{data?.clicks?.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Engagement</span>
                          <span className="text-sm font-bold text-green-600 dark:text-green-400">{data?.engagementRate}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Dwell Time</span>
                          <span className="text-sm font-bold text-foreground">{data?.avgDwellTime}s</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Revenue Tab */}
          {activeTab === 'revenue' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(revenueData)?.map(([type, data]) => (
                  <div key={type} className="bg-card rounded-xl p-6 shadow-lg border border-border">
                    <h3 className="text-xl font-bold text-foreground mb-4 capitalize">{type} Carousel</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Revenue</span>
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">${data?.totalRevenue}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Avg/User</span>
                        <span className="text-lg font-bold text-foreground">${data?.avgRevenuePerUser}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Conversion</span>
                        <span className="text-lg font-bold text-foreground">{data?.conversionRate}%</span>
                      </div>
                      <div className="mt-4">
                        <p className="text-xs text-muted-foreground mb-2">Top Performing:</p>
                        <div className="space-y-1">
                          {data?.topPerformingContent?.map((content, i) => (
                            <div key={i} className="text-xs text-foreground bg-background px-2 py-1 rounded">{content}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Segments Tab */}
          {activeTab === 'segments' && (
            <div className="space-y-6">
              <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                <h3 className="text-xl font-bold text-foreground mb-6">User Segment Performance Analysis</h3>
                <div className="space-y-4">
                  {userSegments?.map((segment, index) => (
                    <div key={index} className="p-4 bg-background rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-foreground">{segment?.name}</h4>
                        <span className="text-sm text-muted-foreground">{segment?.engagement}% engagement</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Engagement Rate</p>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${segment?.engagement}%` }} />
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Conversion Rate</p>
                          <p className="text-lg font-bold text-foreground">{segment?.conversionRate}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Avg Revenue</p>
                          <p className="text-lg font-bold text-green-600 dark:text-green-400">${segment?.avgRevenue}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Geographic Tab */}
          {activeTab === 'geographic' && (
            <div className="space-y-6">
              <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                <h3 className="text-xl font-bold text-foreground mb-6">Geographic Engagement Heatmap</h3>
                <div className="space-y-3">
                  {geoData?.map((geo, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <Icon name="MapPin" size={20} className="text-primary" />
                        <span className="font-semibold text-foreground">{geo?.country}</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Engagement</p>
                          <p className="text-lg font-bold text-foreground">{geo?.engagement?.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Dwell Time</p>
                          <p className="text-lg font-bold text-foreground">{geo?.avgDwellTime}s</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Conversion</p>
                          <p className="text-lg font-bold text-green-600 dark:text-green-400">{geo?.conversionRate}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Alerts Tab */}
          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                <h3 className="text-xl font-bold text-foreground mb-6">Automated Performance Alerts</h3>
                {alerts?.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="CheckCircle" size={48} className="text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-foreground mb-2">All Systems Operational</p>
                    <p className="text-sm text-muted-foreground">No performance alerts detected</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {alerts?.map((alert, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${
                        alert?.severity === 'critical' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                        alert?.severity === 'warning'? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon name="AlertTriangle" size={20} className={alert?.severity === 'critical' ? 'text-red-600' : 'text-yellow-600'} />
                            <div>
                              <p className="font-semibold text-foreground">{alert?.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">{alert?.timestamp}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Investigate</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RealTimeCarouselMonitoringHub;
