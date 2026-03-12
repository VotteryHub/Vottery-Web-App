import React, { useState, useEffect } from 'react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { supabase } from '../../lib/supabase';
import toast, { Toaster } from 'react-hot-toast';

ChartJS?.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const RealTimeCarouselPerformanceMonitoringHub = () => {
  const [swipesPerSecond, setSwipesPerSecond] = useState({ horizontal: [], vertical: [], gradient: [] });
  const [engagementRates, setEngagementRates] = useState({
    jolts: 26.3,
    elections: 27.0,
    groups: 21.6,
    moments: 25.7,
    spotlights: 24.2
  });
  const [revenuePerCarousel, setRevenuePerCarousel] = useState({
    horizontal: 12450.50,
    vertical: 18920.75,
    gradient: 9340.25
  });
  const [userSegments, setUserSegments] = useState([
    { segment: '18-24', engagement: 32.5, avgDwell: 5.2 },
    { segment: '25-34', engagement: 28.7, avgDwell: 6.8 },
    { segment: '35-44', engagement: 24.3, avgDwell: 4.5 },
    { segment: '45+', engagement: 19.1, avgDwell: 3.9 }
  ]);
  const [geographicData, setGeographicData] = useState([
    { region: 'North America', engagement: 45.2, revenue: 25340.50 },
    { region: 'Europe', engagement: 38.7, revenue: 18920.75 },
    { region: 'Asia', engagement: 52.1, revenue: 32450.25 },
    { region: 'South America', engagement: 28.3, revenue: 12340.00 }
  ]);
  const [timeOfDayData, setTimeOfDayData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [alertThresholds, setAlertThresholds] = useState({
    swipesPerSecMin: 10,
    engagementRateMin: 20,
    revenueDropPercent: 15
  });

  const calculateSwipesPerSecond = (swipeData) => {
    const grouped = { horizontal: [], vertical: [], gradient: [] };
    const secondBuckets = {};

    swipeData?.forEach(swipe => {
      const second = Math.floor(new Date(swipe?.created_at)?.getTime() / 1000);
      const type = swipe?.carousel_type?.toLowerCase() || 'horizontal';
      
      if (!secondBuckets?.[second]) secondBuckets[second] = { horizontal: 0, vertical: 0, gradient: 0 };
      secondBuckets[second][type]++;
    });

    const seconds = Object.keys(secondBuckets)?.sort();
    seconds?.forEach(sec => {
      grouped?.horizontal?.push(secondBuckets?.[sec]?.horizontal);
      grouped?.vertical?.push(secondBuckets?.[sec]?.vertical);
      grouped?.gradient?.push(secondBuckets?.[sec]?.gradient);
    });

    setSwipesPerSecond({
      horizontal: grouped?.horizontal?.slice(-60),
      vertical: grouped?.vertical?.slice(-60),
      gradient: grouped?.gradient?.slice(-60)
    });
  };

  const processTimeOfDayData = (todData) => {
    const hourlyData = Array(24)?.fill(0)?.map((_, i) => ({ hour: i, engagement: 0, count: 0 }));
    
    todData?.forEach(item => {
      const hour = item?.hour || 0;
      hourlyData[hour].engagement += item?.engagement_rate || 0;
      hourlyData[hour].count++;
    });

    const processed = hourlyData?.map(h => ({
      hour: `${h?.hour}:00`,
      engagement: h?.count > 0 ? (h?.engagement / h?.count)?.toFixed(1) : 0
    }));

    setTimeOfDayData(processed);
  };

  const checkAlertThresholds = () => {
    const newAlerts = [];

    // Check swipes per second
    const avgSwipes = (swipesPerSecond?.horizontal?.slice(-10)?.reduce((a, b) => a + b, 0) / 10) || 0;
    if (avgSwipes < alertThresholds?.swipesPerSecMin) {
      newAlerts?.push({
        type: 'warning',
        message: `Low swipe rate detected: ${avgSwipes?.toFixed(1)} swipes/sec (threshold: ${alertThresholds?.swipesPerSecMin})`,
        timestamp: new Date()?.toISOString()
      });
    }

    // Check engagement rates
    const avgEngagement = Object.values(engagementRates)?.reduce((a, b) => a + b, 0) / Object.values(engagementRates)?.length;
    if (avgEngagement < alertThresholds?.engagementRateMin) {
      newAlerts?.push({
        type: 'critical',
        message: `Low engagement rate: ${avgEngagement?.toFixed(1)}% (threshold: ${alertThresholds?.engagementRateMin}%)`,
        timestamp: new Date()?.toISOString()
      });
    }

    if (newAlerts?.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev]?.slice(0, 20));
      newAlerts?.forEach(alert => {
        if (alert?.type === 'critical') {
          toast?.error(alert?.message);
        } else {
          toast?.warning(alert?.message);
        }
      });
    }
  };

  const loadRealtimeMetrics = async () => {
    try {
      // Load swipes per second data
      const { data: swipeData } = await supabase?.from('carousel_interactions')?.select('carousel_type, created_at')?.gte('created_at', new Date(Date.now() - 60000)?.toISOString())?.order('created_at', { ascending: true });

      if (swipeData) {
        calculateSwipesPerSecond(swipeData);
      }

      // Load time-of-day engagement
      const { data: todData } = await supabase?.from('carousel_analytics')?.select('hour, engagement_rate')?.gte('created_at', new Date(Date.now() - 86400000)?.toISOString());

      if (todData) {
        processTimeOfDayData(todData);
      }

      // Check alert thresholds
      checkAlertThresholds();
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  };

  const subscribeToCarouselMetrics = () => {
    const channel = supabase?.channel('carousel_metrics_updates')?.on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'carousel_analytics'
      }, () => {
        loadRealtimeMetrics();
      })?.subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  };

  useEffect(() => {
    loadRealtimeMetrics();
    const interval = setInterval(loadRealtimeMetrics, 15000); // Update every 15 seconds
    subscribeToCarouselMetrics();
    return () => clearInterval(interval);
  }, []);

  const swipesChartData = {
    labels: Array.from({ length: 60 }, (_, i) => `${i}s`),
    datasets: [
      {
        label: 'Horizontal Snap',
        data: swipesPerSecond?.horizontal,
        borderColor: 'rgb(255, 215, 0)',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        tension: 0.4
      },
      {
        label: 'Vertical Stack',
        data: swipesPerSecond?.vertical,
        borderColor: 'rgb(236, 72, 153)',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        tension: 0.4
      },
      {
        label: 'Gradient Flow',
        data: swipesPerSecond?.gradient,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }
    ]
  };

  const engagementChartData = {
    labels: Object.keys(engagementRates)?.map(k => k?.charAt(0)?.toUpperCase() + k?.slice(1)),
    datasets: [{
      label: 'Engagement Rate (%)',
      data: Object.values(engagementRates),
      backgroundColor: [
        'rgba(255, 215, 0, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(147, 51, 234, 0.8)',
        'rgba(34, 197, 94, 0.8)'
      ]
    }]
  };

  const timeOfDayChartData = {
    labels: timeOfDayData?.map(t => t?.hour),
    datasets: [{
      label: 'Engagement Rate (%)',
      data: timeOfDayData?.map(t => t?.engagement),
      borderColor: 'rgb(147, 51, 234)',
      backgroundColor: 'rgba(147, 51, 234, 0.1)',
      tension: 0.4
    }]
  };

  return (
    <div className="flex h-screen bg-background">
      <Toaster position="top-right" />
      <LeftSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderNavigation />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Real-Time Carousel Performance Monitoring Hub</h1>
              <p className="text-muted-foreground">Comprehensive admin dashboard with live carousel analytics, user segment analysis, and automated alerting (updates every 15 seconds)</p>
            </div>

            {/* Swipes Per Second - Real-Time Graph */}
            <div className="bg-card rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                <Icon name="Activity" size={24} className="text-yellow-500" />
                Swipes Per Second (Live)
              </h2>
              <div className="h-64">
                <Line data={swipesChartData} options={{ responsive: true, maintainAspectRatio: false, animation: { duration: 500 } }} />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {(swipesPerSecond?.horizontal?.slice(-10)?.reduce((a, b) => a + b, 0) / 10)?.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Horizontal Avg</div>
                </div>
                <div className="text-center p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                    {(swipesPerSecond?.vertical?.slice(-10)?.reduce((a, b) => a + b, 0) / 10)?.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Vertical Avg</div>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {(swipesPerSecond?.gradient?.slice(-10)?.reduce((a, b) => a + b, 0) / 10)?.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Gradient Avg</div>
                </div>
              </div>
            </div>

            {/* Engagement Rates by Content Type */}
            <div className="bg-card rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                <Icon name="BarChart" size={24} className="text-blue-500" />
                Engagement Rates by Content Type
              </h2>
              <div className="h-64">
                <Bar data={engagementChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>

            {/* Revenue Per Carousel Type */}
            <div className="bg-card rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                <Icon name="DollarSign" size={24} className="text-green-500" />
                Revenue Per Carousel Type
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                      ${revenuePerCarousel?.horizontal?.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Horizontal Snap</div>
                    <div className="mt-2 text-xs text-green-600 dark:text-green-400">↑ 12.5% vs last week</div>
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-2">
                      ${revenuePerCarousel?.vertical?.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Vertical Stack</div>
                    <div className="mt-2 text-xs text-green-600 dark:text-green-400">↑ 18.3% vs last week</div>
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      ${revenuePerCarousel?.gradient?.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Gradient Flow</div>
                    <div className="mt-2 text-xs text-green-600 dark:text-green-400">↑ 8.7% vs last week</div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Segment Performance Analysis */}
            <div className="bg-card rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                <Icon name="Users" size={24} className="text-purple-500" />
                User Segment Performance Analysis
              </h2>
              <div className="space-y-3">
                {userSegments?.map((segment, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{segment?.segment}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Age Group</div>
                    </div>
                    <div className="flex gap-8">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{segment?.engagement}%</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Engagement</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{segment?.avgDwell}s</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Avg Dwell</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Geographic Engagement Heatmap */}
            <div className="bg-card rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                <Icon name="Globe" size={24} className="text-blue-500" />
                Geographic Engagement Heatmap
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {geographicData?.map((region, i) => (
                  <div key={i} className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">{region?.region}</h3>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{region?.engagement}%</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Engagement Rate</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">${region?.revenue?.toLocaleString()}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Revenue</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time-of-Day Engagement Patterns */}
            <div className="bg-card rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                <Icon name="Clock" size={24} className="text-orange-500" />
                Time-of-Day Engagement Patterns
              </h2>
              <div className="h-64">
                <Line data={timeOfDayChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
              <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Peak Hours:</strong> 8-10 AM, 12-2 PM, 7-9 PM | <strong>Lowest:</strong> 2-5 AM
                </p>
              </div>
            </div>

            {/* Automated Alert System */}
            <div className="bg-card rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2">
                  <Icon name="Bell" size={24} className="text-red-500" />
                  Automated Alert System
                </h2>
                <button
                  onClick={() => setAlerts([])}
                  className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Clear Alerts
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Min Swipes/Sec
                  </label>
                  <input
                    type="number"
                    value={alertThresholds?.swipesPerSecMin}
                    onChange={(e) => setAlertThresholds(prev => ({ ...prev, swipesPerSecMin: parseFloat(e?.target?.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Min Engagement %
                  </label>
                  <input
                    type="number"
                    value={alertThresholds?.engagementRateMin}
                    onChange={(e) => setAlertThresholds(prev => ({ ...prev, engagementRateMin: parseFloat(e?.target?.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Revenue Drop %
                  </label>
                  <input
                    type="number"
                    value={alertThresholds?.revenueDropPercent}
                    onChange={(e) => setAlertThresholds(prev => ({ ...prev, revenueDropPercent: parseFloat(e?.target?.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
              {alerts?.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {alerts?.map((alert, i) => (
                    <div key={i} className={`p-4 rounded-lg border-l-4 ${
                      alert?.type === 'critical' ? 'bg-red-50 dark:bg-red-900/20 border-red-500' : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{alert?.message}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {new Date(alert.timestamp)?.toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          alert?.type === 'critical' ? 'bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100' : 'bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100'
                        }`}>
                          {alert?.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Icon name="CheckCircle" size={48} className="mx-auto mb-4 text-green-500" />
                  <p>All systems operating normally. No alerts.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RealTimeCarouselPerformanceMonitoringHub;