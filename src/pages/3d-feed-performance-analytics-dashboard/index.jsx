import React, { useState, useEffect } from 'react';
import { Activity, Zap, TrendingUp, Settings, BarChart3, Gauge } from 'lucide-react';
import KineticSpindleAnalytics from './components/KineticSpindleAnalytics';
import IsometricDeckPerformance from './components/IsometricDeckPerformance';
import LiquidHorizonMetrics from './components/LiquidHorizonMetrics';
import DevicePerformanceMonitor from './components/DevicePerformanceMonitor';
import PerformanceOptimizationControls from './components/PerformanceOptimizationControls';
import RealTimeMetricsOverview from './components/RealTimeMetricsOverview';

const ThreeDFeedPerformanceAnalyticsDashboard = () => {
  const [performanceData, setPerformanceData] = useState({
    kineticSpindle: {
      rotationCompletionRate: 0,
      avgTimeToInteraction: 0,
      hapticTriggerSuccess: 0,
      engagementDepth: 0,
      gestureAccuracy: 0
    },
    isometricDeck: {
      navigationEfficiency: 0,
      depthPerceptionUtilization: 0,
      spatialInteractionSuccess: 0,
      carouselEngagement: 0
    },
    liquidHorizon: {
      fluidAnimationPerformance: 0,
      visualAppealCorrelation: 0,
      immersiveExperienceScore: 0,
      retentionImpact: 0
    },
    device: {
      gpuUtilization: 0,
      frameDrops: 0,
      thermalThrottling: false,
      qualityLevel: 'high',
      adaptiveRenderingActive: false
    }
  });

  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [autoOptimization, setAutoOptimization] = useState(true);

  useEffect(() => {
    // Simulate real-time performance data updates
    const interval = setInterval(() => {
      setPerformanceData(prev => ({
        kineticSpindle: {
          rotationCompletionRate: Math.min(100, prev?.kineticSpindle?.rotationCompletionRate + Math.random() * 5 - 2),
          avgTimeToInteraction: Math.max(0.5, prev?.kineticSpindle?.avgTimeToInteraction + Math.random() * 0.2 - 0.1),
          hapticTriggerSuccess: Math.min(100, prev?.kineticSpindle?.hapticTriggerSuccess + Math.random() * 3 - 1),
          engagementDepth: Math.min(100, prev?.kineticSpindle?.engagementDepth + Math.random() * 4 - 2),
          gestureAccuracy: Math.min(100, prev?.kineticSpindle?.gestureAccuracy + Math.random() * 2 - 1)
        },
        isometricDeck: {
          navigationEfficiency: Math.min(100, prev?.isometricDeck?.navigationEfficiency + Math.random() * 3 - 1.5),
          depthPerceptionUtilization: Math.min(100, prev?.isometricDeck?.depthPerceptionUtilization + Math.random() * 4 - 2),
          spatialInteractionSuccess: Math.min(100, prev?.isometricDeck?.spatialInteractionSuccess + Math.random() * 3 - 1),
          carouselEngagement: Math.min(100, prev?.isometricDeck?.carouselEngagement + Math.random() * 5 - 2)
        },
        liquidHorizon: {
          fluidAnimationPerformance: Math.min(100, prev?.liquidHorizon?.fluidAnimationPerformance + Math.random() * 3 - 1),
          visualAppealCorrelation: Math.min(100, prev?.liquidHorizon?.visualAppealCorrelation + Math.random() * 2 - 1),
          immersiveExperienceScore: Math.min(100, prev?.liquidHorizon?.immersiveExperienceScore + Math.random() * 4 - 2),
          retentionImpact: Math.min(100, prev?.liquidHorizon?.retentionImpact + Math.random() * 3 - 1.5)
        },
        device: {
          gpuUtilization: Math.min(100, Math.max(0, prev?.device?.gpuUtilization + Math.random() * 10 - 5)),
          frameDrops: Math.max(0, prev?.device?.frameDrops + Math.floor(Math.random() * 3 - 1)),
          thermalThrottling: prev?.device?.gpuUtilization > 85,
          qualityLevel: prev?.device?.gpuUtilization > 85 ? 'medium' : prev?.device?.gpuUtilization > 95 ? 'low' : 'high',
          adaptiveRenderingActive: prev?.device?.gpuUtilization > 80
        }
      }));
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  // Initialize with realistic starting values
  useEffect(() => {
    setPerformanceData({
      kineticSpindle: {
        rotationCompletionRate: 87.5,
        avgTimeToInteraction: 1.8,
        hapticTriggerSuccess: 92.3,
        engagementDepth: 78.6,
        gestureAccuracy: 94.1
      },
      isometricDeck: {
        navigationEfficiency: 85.2,
        depthPerceptionUtilization: 76.8,
        spatialInteractionSuccess: 89.4,
        carouselEngagement: 81.7
      },
      liquidHorizon: {
        fluidAnimationPerformance: 91.3,
        visualAppealCorrelation: 88.5,
        immersiveExperienceScore: 84.9,
        retentionImpact: 79.2
      },
      device: {
        gpuUtilization: 62.4,
        frameDrops: 3,
        thermalThrottling: false,
        qualityLevel: 'high',
        adaptiveRenderingActive: false
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  3D Feed Performance Analytics
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Real-time monitoring of Kinetic Spindle, Isometric Deck, and Liquid Horizon engagement metrics
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                  Live • Updates every {refreshInterval / 1000}s
                </span>
              </div>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Real-Time Metrics Overview */}
        <RealTimeMetricsOverview performanceData={performanceData} />

        {/* Device Performance Monitor */}
        <DevicePerformanceMonitor 
          deviceData={performanceData?.device}
          autoOptimization={autoOptimization}
        />

        {/* Performance Optimization Controls */}
        <PerformanceOptimizationControls
          autoOptimization={autoOptimization}
          setAutoOptimization={setAutoOptimization}
          refreshInterval={refreshInterval}
          setRefreshInterval={setRefreshInterval}
          deviceData={performanceData?.device}
        />

        {/* 3D Component Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kinetic Spindle Analytics */}
          <KineticSpindleAnalytics data={performanceData?.kineticSpindle} />

          {/* Isometric Deck Performance */}
          <IsometricDeckPerformance data={performanceData?.isometricDeck} />

          {/* Liquid Horizon Metrics */}
          <LiquidHorizonMetrics data={performanceData?.liquidHorizon} />
        </div>

        {/* Advanced Analytics Section */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Predictive Performance Modeling
              </h2>
            </div>
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium">
              Generate Report
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Cross-Device Compatibility</span>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">96.8%</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Optimal across all platforms</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Automated Quality Adjustments</span>
                <Zap className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">247</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Optimizations in last 24h</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Performance Score</span>
                <Gauge className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">A+</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Excellent 3D rendering</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeDFeedPerformanceAnalyticsDashboard;