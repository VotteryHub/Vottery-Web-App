import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { carousel3DOptimizationService } from '../../services/carousel3DOptimizationService';

ChartJS?.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const MobileOptimizedPremium2DCarouselEngine = () => {
  const [activeTab, setActiveTab] = useState('performance');
  const [loading, setLoading] = useState(true);

  // Mobile Performance Metrics
  const [mobileMetrics, setMobileMetrics] = useState({
    touchResponseTime: 12, // ms
    gestureAccuracy: 98.5, // %
    batteryUsage: 2.3, // %/hour
    frameRate: 60,
    memoryUsage: 45 // MB
  });

  // Touch Gesture Optimization
  const [gestureConfig, setGestureConfig] = useState({
    velocityThreshold: 500,
    momentumDecay: 0.95,
    touchDebounce: 16, // ms
    hapticIntensity: 'medium',
    swipeThreshold: 50 // px
  });

  // Responsive Performance Settings
  const [performanceSettings, setPerformanceSettings] = useState({
    adaptiveQuality: true,
    batteryOptimization: true,
    gpuAcceleration: true,
    cssContainment: true,
    reducedMotion: false
  });

  // Device-Specific Breakpoints
  const [breakpoints, setBreakpoints] = useState({
    horizontal: {
      mobile: { cardWidth: 280, cardGap: 12, parallax: false },
      tablet: { cardWidth: 320, cardGap: 16, parallax: true },
      desktop: { cardWidth: 360, cardGap: 20, parallax: true }
    },
    vertical: {
      mobile: { stackOffset: 10, swipeThreshold: 120 },
      tablet: { stackOffset: 15, swipeThreshold: 150 },
      desktop: { stackOffset: 20, swipeThreshold: 180 }
    },
    gradient: {
      mobile: { blobWidth: 80, metaballs: false },
      tablet: { blobWidth: 100, metaballs: true },
      desktop: { blobWidth: 120, metaballs: true }
    }
  });

  // Performance Monitoring
  const [performanceData, setPerformanceData] = useState({
    fps: [],
    touchLatency: [],
    batteryDrain: []
  });

  useEffect(() => {
    startPerformanceMonitoring();
    return () => {
      carousel3DOptimizationService?.stopFrameRateMonitoring();
    };
  }, []);

  const startPerformanceMonitoring = () => {
    carousel3DOptimizationService?.startFrameRateMonitoring((fps) => {
      setPerformanceData(prev => ({
        ...prev,
        fps: [...prev?.fps?.slice(-59), fps]
      }));
      setMobileMetrics(prev => ({ ...prev, frameRate: fps }));
    });

    // Simulate touch latency monitoring
    const latencyInterval = setInterval(() => {
      const latency = Math.random() * 5 + 10; // 10-15ms
      setPerformanceData(prev => ({
        ...prev,
        touchLatency: [...prev?.touchLatency?.slice(-59), latency]
      }));
      setMobileMetrics(prev => ({ ...prev, touchResponseTime: latency?.toFixed(1) }));
    }, 1000);

    setLoading(false);

    return () => clearInterval(latencyInterval);
  };

  const handleGestureConfigChange = (key, value) => {
    setGestureConfig(prev => ({ ...prev, [key]: value }));
  };

  const handlePerformanceToggle = (key) => {
    setPerformanceSettings(prev => ({ ...prev, [key]: !prev?.[key] }));
  };

  const fpsChartData = {
    labels: Array.from({ length: 60 }, (_, i) => `${i}s`),
    datasets: [{
      label: 'Frame Rate (FPS)',
      data: performanceData?.fps,
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4
    }]
  };

  const touchLatencyChartData = {
    labels: Array.from({ length: 60 }, (_, i) => `${i}s`),
    datasets: [{
      label: 'Touch Response Time (ms)',
      data: performanceData?.touchLatency,
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    }]
  };

  return (
    <div className="flex h-screen bg-background">
      <Helmet>
        <title>Mobile-Optimized Premium 2D Carousel Engine | Vottery</title>
      </Helmet>
      <LeftSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderNavigation />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Mobile-Optimized Premium 2D Carousel Engine</h1>
              <p className="text-muted-foreground">Touch-optimized performance with velocity-based gesture controls and adaptive quality degradation</p>
            </div>

            {/* Mobile Performance Indicators */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              <div className="bg-card rounded-xl shadow-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-medium text-muted-foreground">Touch Response</h3>
                  <Icon name="Smartphone" size={16} className="text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-foreground">{mobileMetrics?.touchResponseTime}ms</p>
                <p className="text-xs text-green-500 mt-1">Excellent</p>
              </div>
              <div className="bg-card rounded-xl shadow-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-medium text-muted-foreground">Gesture Accuracy</h3>
                  <Icon name="Target" size={16} className="text-green-500" />
                </div>
                <p className="text-2xl font-bold text-foreground">{mobileMetrics?.gestureAccuracy}%</p>
                <p className="text-xs text-green-500 mt-1">Optimal</p>
              </div>
              <div className="bg-card rounded-xl shadow-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-medium text-muted-foreground">Battery Usage</h3>
                  <Icon name="Battery" size={16} className="text-yellow-500" />
                </div>
                <p className="text-2xl font-bold text-foreground">{mobileMetrics?.batteryUsage}%/h</p>
                <p className="text-xs text-green-500 mt-1">Efficient</p>
              </div>
              <div className="bg-card rounded-xl shadow-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-medium text-muted-foreground">Frame Rate</h3>
                  <Icon name="Zap" size={16} className="text-purple-500" />
                </div>
                <p className="text-2xl font-bold text-foreground">{mobileMetrics?.frameRate} FPS</p>
                <p className="text-xs text-green-500 mt-1">Smooth</p>
              </div>
              <div className="bg-card rounded-xl shadow-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-medium text-muted-foreground">Memory</h3>
                  <Icon name="HardDrive" size={16} className="text-pink-500" />
                </div>
                <p className="text-2xl font-bold text-foreground">{mobileMetrics?.memoryUsage}MB</p>
                <p className="text-xs text-green-500 mt-1">Low</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-card rounded-xl shadow-lg mb-6">
              <div className="flex border-b border-border">
                {['performance', 'gestures', 'breakpoints', 'optimization']?.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? 'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab?.charAt(0)?.toUpperCase() + tab?.slice(1)}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Performance Monitoring */}
                {activeTab === 'performance' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                        <Icon name="Activity" size={24} className="text-green-500" />
                        Real-Time Mobile Performance
                      </h2>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="bg-muted/30 rounded-lg p-4">
                          <h3 className="text-sm font-medium text-muted-foreground mb-3">Frame Rate Monitoring</h3>
                          <div className="h-[200px]">
                            <Line data={fpsChartData} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { min: 0, max: 70 } } }} />
                          </div>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-4">
                          <h3 className="text-sm font-medium text-muted-foreground mb-3">Touch Latency</h3>
                          <div className="h-[200px]">
                            <Line data={touchLatencyChartData} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { min: 0, max: 20 } } }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                        <Icon name="Cpu" size={24} className="text-blue-500" />
                        Device Performance Adaptation
                      </h2>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-green-500/10 rounded-lg p-4 border-2 border-green-500">
                          <h3 className="text-sm font-medium text-foreground mb-2">High-End Devices</h3>
                          <p className="text-xs text-muted-foreground mb-3">Full quality, all effects enabled</p>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-2">
                              <Icon name="Check" size={12} className="text-green-500" />
                              <span>60 FPS target</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Icon name="Check" size={12} className="text-green-500" />
                              <span>Parallax effects</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Icon name="Check" size={12} className="text-green-500" />
                              <span>Metaball animations</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-yellow-500/10 rounded-lg p-4 border-2 border-yellow-500">
                          <h3 className="text-sm font-medium text-foreground mb-2">Mid-Range Devices</h3>
                          <p className="text-xs text-muted-foreground mb-3">Balanced quality and performance</p>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-2">
                              <Icon name="Check" size={12} className="text-yellow-500" />
                              <span>54+ FPS target</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Icon name="Check" size={12} className="text-yellow-500" />
                              <span>Reduced animations</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Icon name="X" size={12} className="text-red-500" />
                              <span>No metaballs</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-red-500/10 rounded-lg p-4 border-2 border-red-500">
                          <h3 className="text-sm font-medium text-foreground mb-2">Low-End Devices</h3>
                          <p className="text-xs text-muted-foreground mb-3">Performance-first mode</p>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-2">
                              <Icon name="Check" size={12} className="text-red-500" />
                              <span>30+ FPS target</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Icon name="X" size={12} className="text-red-500" />
                              <span>No parallax</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Icon name="X" size={12} className="text-red-500" />
                              <span>Minimal effects</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Touch Gesture Optimization */}
                {activeTab === 'gestures' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                        <Icon name="Hand" size={24} className="text-purple-500" />
                        Velocity-Based Gesture Controls
                      </h2>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="bg-muted/30 rounded-lg p-4">
                          <label className="block text-sm font-medium text-foreground mb-2">Velocity Threshold (px/s)</label>
                          <input
                            type="range"
                            min="100"
                            max="1000"
                            step="50"
                            value={gestureConfig?.velocityThreshold}
                            onChange={(e) => handleGestureConfigChange('velocityThreshold', parseInt(e?.target?.value))}
                            className="w-full"
                          />
                          <p className="text-lg font-bold text-foreground mt-2">{gestureConfig?.velocityThreshold} px/s</p>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-4">
                          <label className="block text-sm font-medium text-foreground mb-2">Momentum Decay</label>
                          <input
                            type="range"
                            min="0.8"
                            max="0.99"
                            step="0.01"
                            value={gestureConfig?.momentumDecay}
                            onChange={(e) => handleGestureConfigChange('momentumDecay', parseFloat(e?.target?.value))}
                            className="w-full"
                          />
                          <p className="text-lg font-bold text-foreground mt-2">{gestureConfig?.momentumDecay}</p>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-4">
                          <label className="block text-sm font-medium text-foreground mb-2">Touch Debounce (ms)</label>
                          <input
                            type="range"
                            min="8"
                            max="32"
                            step="4"
                            value={gestureConfig?.touchDebounce}
                            onChange={(e) => handleGestureConfigChange('touchDebounce', parseInt(e?.target?.value))}
                            className="w-full"
                          />
                          <p className="text-lg font-bold text-foreground mt-2">{gestureConfig?.touchDebounce} ms</p>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-4">
                          <label className="block text-sm font-medium text-foreground mb-2">Haptic Intensity</label>
                          <select
                            value={gestureConfig?.hapticIntensity}
                            onChange={(e) => handleGestureConfigChange('hapticIntensity', e?.target?.value)}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                          >
                            <option value="light">Light</option>
                            <option value="medium">Medium</option>
                            <option value="heavy">Heavy</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                        <Icon name="Gauge" size={24} className="text-blue-500" />
                        Momentum Scrolling Physics
                      </h2>
                      <div className="bg-muted/30 rounded-lg p-6">
                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Spring Stiffness</p>
                            <p className="text-2xl font-bold text-foreground">400</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Damping</p>
                            <p className="text-2xl font-bold text-foreground">35</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Mass</p>
                            <p className="text-2xl font-bold text-foreground">1.2</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mobile Breakpoints */}
                {activeTab === 'breakpoints' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                        <Icon name="Layout" size={24} className="text-yellow-500" />
                        Device-Specific Carousel Adaptations
                      </h2>
                      <div className="space-y-4">
                        {['horizontal', 'vertical', 'gradient']?.map(type => (
                          <div key={type} className="bg-muted/30 rounded-lg p-4">
                            <h3 className="text-sm font-bold text-foreground mb-3 capitalize">{type} Carousel</h3>
                            <div className="grid grid-cols-3 gap-4">
                              {Object.entries(breakpoints?.[type])?.map(([device, config]) => (
                                <div key={device} className="bg-card rounded-lg p-3">
                                  <p className="text-xs font-medium text-muted-foreground mb-2 capitalize">{device}</p>
                                  <div className="space-y-1 text-xs">
                                    {Object.entries(config)?.map(([key, value]) => (
                                      <div key={key} className="flex justify-between">
                                        <span className="text-muted-foreground">{key}:</span>
                                        <span className="font-bold text-foreground">{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Performance Optimization */}
                {activeTab === 'optimization' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                        <Icon name="Settings" size={24} className="text-green-500" />
                        Battery-Efficient Rendering
                      </h2>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(performanceSettings)?.map(([key, value]) => (
                          <div key={key} className="bg-muted/30 rounded-lg p-4 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-foreground capitalize">{key?.replace(/([A-Z])/g, ' $1')}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {key === 'adaptiveQuality' && 'Automatically adjust quality based on device performance'}
                                {key === 'batteryOptimization' && 'Reduce animations when battery is low'}
                                {key === 'gpuAcceleration' && 'Use hardware acceleration for smooth rendering'}
                                {key === 'cssContainment' && 'Optimize layout and paint containment'}
                                {key === 'reducedMotion' && 'Respect user motion preferences'}
                              </p>
                            </div>
                            <button
                              onClick={() => handlePerformanceToggle(key)}
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                value
                                  ? 'bg-green-600 text-white' :'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {value ? 'ON' : 'OFF'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                        <Icon name="Layers" size={24} className="text-purple-500" />
                        CSS Containment Integration
                      </h2>
                      <div className="bg-muted/30 rounded-lg p-6">
                        <div className="grid grid-cols-3 gap-6">
                          <div className="text-center">
                            <Icon name="Box" size={32} className="text-blue-500 mx-auto mb-2" />
                            <p className="text-sm font-medium text-foreground">Layout Containment</p>
                            <p className="text-xs text-muted-foreground mt-1">Isolate layout calculations</p>
                          </div>
                          <div className="text-center">
                            <Icon name="Palette" size={32} className="text-green-500 mx-auto mb-2" />
                            <p className="text-sm font-medium text-foreground">Style Containment</p>
                            <p className="text-xs text-muted-foreground mt-1">Prevent style recalculation</p>
                          </div>
                          <div className="text-center">
                            <Icon name="Paintbrush" size={32} className="text-purple-500 mx-auto mb-2" />
                            <p className="text-sm font-medium text-foreground">Paint Containment</p>
                            <p className="text-xs text-muted-foreground mt-1">Optimize rendering layers</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MobileOptimizedPremium2DCarouselEngine;