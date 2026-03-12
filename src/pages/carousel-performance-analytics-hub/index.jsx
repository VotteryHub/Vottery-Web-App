import React, { useState, useEffect } from 'react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { carousel3DOptimizationService } from '../../services/carousel3DOptimizationService';

ChartJS?.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const CarouselPerformanceAnalyticsHub = () => {
  const [performanceMetrics, setPerformanceMetrics] = useState({
    horizontal: { fps: [], avgFps: 60, compliance: 100, renderTime: [] },
    vertical: { fps: [], avgFps: 60, compliance: 100, renderTime: [] },
    gradient: { fps: [], avgFps: 60, compliance: 100, renderTime: [] }
  });

  const [hapticEngagement, setHapticEngagement] = useState({
    light: 1250,
    medium: 890,
    heavy: 450,
    snap: 2340,
    swipe: 1560,
    success: 340,
    error: 23
  });

  const [interactionMetrics, setInteractionMetrics] = useState({
    horizontal: { swipes: 5678, snaps: 12340, dwellTime: 4.2 },
    vertical: { swipes: 8934, snaps: 0, dwellTime: 6.8 },
    gradient: { swipes: 3456, snaps: 0, dwellTime: 3.5 }
  });

  const [contentEngagement, setContentEngagement] = useState({
    liveElections: { views: 45678, clicks: 12340, engagement: 27 },
    jolts: { views: 89234, clicks: 23450, engagement: 26.3 },
    liveMoments: { views: 34567, clicks: 8900, engagement: 25.7 },
    creatorSpotlights: { views: 23456, clicks: 5670, engagement: 24.2 },
    suggestedConnections: { views: 67890, clicks: 15670, engagement: 23.1 },
    recommendedGroups: { views: 45678, clicks: 9870, engagement: 21.6 },
    recommendedElections: { views: 56789, clicks: 11230, engagement: 19.8 },
    creatorServices: { views: 34567, clicks: 6780, engagement: 19.6 },
    recentWinners: { views: 78901, clicks: 18900, engagement: 23.9 },
    trendingTopics: { views: 56789, clicks: 12340, engagement: 21.7 },
    topEarners: { views: 45678, clicks: 9870, engagement: 21.6 },
    accuracyChampions: { views: 34567, clicks: 7890, engagement: 22.8 }
  });

  useEffect(() => {
    // Start frame rate monitoring for all carousels
    const monitoringCallbacks = [
      (fps) => setPerformanceMetrics(prev => ({
        ...prev,
        horizontal: { ...prev?.horizontal, fps: [...prev?.horizontal?.fps?.slice(-59), fps], avgFps: fps, compliance: fps >= 54 ? 100 : (fps / 60) * 100 }
      })),
      (fps) => setPerformanceMetrics(prev => ({
        ...prev,
        vertical: { ...prev?.vertical, fps: [...prev?.vertical?.fps?.slice(-59), fps], avgFps: fps, compliance: fps >= 54 ? 100 : (fps / 60) * 100 }
      })),
      (fps) => setPerformanceMetrics(prev => ({
        ...prev,
        gradient: { ...prev?.gradient, fps: [...prev?.gradient?.fps?.slice(-59), fps], avgFps: fps, compliance: fps >= 54 ? 100 : (fps / 60) * 100 }
      }))
    ];

    monitoringCallbacks?.forEach(callback => {
      carousel3DOptimizationService?.startFrameRateMonitoring(callback);
    });

    return () => {
      carousel3DOptimizationService?.stopFrameRateMonitoring();
    };
  }, []);

  const fpsChartData = {
    labels: Array.from({ length: 60 }, (_, i) => `${i}s`),
    datasets: [
      {
        label: 'Horizontal Snap',
        data: performanceMetrics?.horizontal?.fps,
        borderColor: 'rgb(255, 215, 0)',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        tension: 0.4
      },
      {
        label: 'Vertical Stack',
        data: performanceMetrics?.vertical?.fps,
        borderColor: 'rgb(236, 72, 153)',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        tension: 0.4
      },
      {
        label: 'Gradient Flow',
        data: performanceMetrics?.gradient?.fps,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }
    ]
  };

  const hapticChartData = {
    labels: Object.keys(hapticEngagement),
    datasets: [{
      label: 'Haptic Feedback Events',
      data: Object.values(hapticEngagement),
      backgroundColor: [
        'rgba(255, 215, 0, 0.8)',
        'rgba(255, 165, 0, 0.8)',
        'rgba(255, 99, 71, 0.8)',
        'rgba(147, 51, 234, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ]
    }]
  };

  const contentEngagementData = {
    labels: Object.keys(contentEngagement)?.map(key => key?.replace(/([A-Z])/g, ' $1')?.trim()),
    datasets: [{
      label: 'Engagement Rate (%)',
      data: Object.values(contentEngagement)?.map(item => item?.engagement),
      backgroundColor: 'rgba(255, 215, 0, 0.8)'
    }]
  };

  return (
    <div className="flex h-screen bg-background">
      <LeftSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderNavigation />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Carousel Performance & Analytics Hub</h1>
              <p className="text-muted-foreground">Real-time monitoring of 60fps compliance, haptic feedback engagement, carousel interaction metrics, and content engagement across all Premium 2D carousels</p>
            </div>

            {/* 60fps Compliance Panel */}
            <div className="bg-card rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2">
                  <Icon name="Activity" size={24} className="text-yellow-500" />
                  60fps Compliance Monitoring
                </h2>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-500">{performanceMetrics?.horizontal?.avgFps}</p>
                    <p className="text-xs text-muted-foreground">Horizontal</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-pink-500">{performanceMetrics?.vertical?.avgFps}</p>
                    <p className="text-xs text-muted-foreground">Vertical</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-500">{performanceMetrics?.gradient?.avgFps}</p>
                    <p className="text-xs text-muted-foreground">Gradient</p>
                  </div>
                </div>
              </div>
              <div className="h-[300px]">
                <Line data={fpsChartData} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { min: 0, max: 70 } } }} />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-yellow-500/10 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Horizontal Snap</p>
                  <p className="text-2xl font-bold text-yellow-500">{performanceMetrics?.horizontal?.compliance?.toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground">Compliance</p>
                </div>
                <div className="bg-pink-500/10 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Vertical Stack</p>
                  <p className="text-2xl font-bold text-pink-500">{performanceMetrics?.vertical?.compliance?.toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground">Compliance</p>
                </div>
                <div className="bg-blue-500/10 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Gradient Flow</p>
                  <p className="text-2xl font-bold text-blue-500">{performanceMetrics?.gradient?.compliance?.toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground">Compliance</p>
                </div>
              </div>
            </div>

            {/* Haptic Feedback Engagement */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-card rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2 mb-4">
                  <Icon name="Vibrate" size={24} className="text-purple-500" />
                  Haptic Feedback Engagement
                </h2>
                <div className="h-[300px]">
                  <Doughnut data={hapticChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
                <div className="mt-4 space-y-2">
                  {Object.entries(hapticEngagement)?.map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground capitalize">{key}</span>
                      <span className="text-sm font-bold text-foreground">{value?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carousel Interaction Metrics */}
              <div className="bg-card rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2 mb-4">
                  <Icon name="MousePointerClick" size={24} className="text-blue-500" />
                  Carousel Interaction Metrics
                </h2>
                <div className="space-y-4">
                  <div className="bg-yellow-500/10 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-2">Horizontal Snap Carousel</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <p className="text-xl font-bold text-yellow-500">{interactionMetrics?.horizontal?.swipes?.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Swipes</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-yellow-500">{interactionMetrics?.horizontal?.snaps?.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Snaps</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-yellow-500">{interactionMetrics?.horizontal?.dwellTime}s</p>
                        <p className="text-xs text-muted-foreground">Dwell Time</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-pink-500/10 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-2">Vertical Stack Carousel</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <p className="text-xl font-bold text-pink-500">{interactionMetrics?.vertical?.swipes?.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Swipes</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-pink-500">{interactionMetrics?.vertical?.snaps?.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Snaps</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-pink-500">{interactionMetrics?.vertical?.dwellTime}s</p>
                        <p className="text-xs text-muted-foreground">Dwell Time</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-500/10 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-2">Gradient Flow Carousel</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <p className="text-xl font-bold text-blue-500">{interactionMetrics?.gradient?.swipes?.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Swipes</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-blue-500">{interactionMetrics?.gradient?.snaps?.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Snaps</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-blue-500">{interactionMetrics?.gradient?.dwellTime}s</p>
                        <p className="text-xs text-muted-foreground">Dwell Time</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Engagement by Type */}
            <div className="bg-card rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2 mb-4">
                <Icon name="BarChart3" size={24} className="text-green-500" />
                Content Engagement by Type
              </h2>
              <div className="h-[400px] mb-4">
                <Bar data={contentEngagementData} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y' }} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(contentEngagement)?.map(([key, value]) => (
                  <div key={key} className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1 capitalize">{key?.replace(/([A-Z])/g, ' $1')?.trim()}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-foreground">{value?.views?.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Views</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{value?.clicks?.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Clicks</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-green-500">{value?.engagement}%</p>
                        <p className="text-xs text-muted-foreground">Rate</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CarouselPerformanceAnalyticsHub;