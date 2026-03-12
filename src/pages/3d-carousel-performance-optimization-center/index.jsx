import React, { useState, useEffect } from 'react';
import { Activity, Zap, Cpu, Gauge, TrendingUp, Settings } from 'lucide-react';
import FrameRateStabilizationPanel from './components/FrameRateStabilizationPanel';
import MemoryPoolingEnginePanel from './components/MemoryPoolingEnginePanel';
import RenderingBatchingPanel from './components/RenderingBatchingPanel';
import TouchGestureDebouncePanel from './components/TouchGestureDebouncePanel';
import PerformanceMetricsPanel from './components/PerformanceMetricsPanel';
import AdvancedOptimizationPanel from './components/AdvancedOptimizationPanel';
import Icon from '../../components/AppIcon';


const ThreeDCarouselPerformanceOptimizationCenter = () => {
  const [activeTab, setActiveTab] = useState('metrics');
  const [performanceData, setPerformanceData] = useState({
    currentFPS: 60,
    targetFPS: 60,
    memoryUsage: 45,
    renderCalls: 120,
    gestureLatency: 8
  });

  useEffect(() => {
    // Simulate real-time performance monitoring
    const interval = setInterval(() => {
      setPerformanceData(prev => ({
        currentFPS: Math.max(30, Math.min(60, prev?.currentFPS + (Math.random() - 0.5) * 5)),
        targetFPS: 60,
        memoryUsage: Math.max(20, Math.min(80, prev?.memoryUsage + (Math.random() - 0.5) * 3)),
        renderCalls: Math.floor(Math.random() * 50) + 100,
        gestureLatency: Math.max(5, Math.min(20, prev?.gestureLatency + (Math.random() - 0.5) * 2))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'metrics', label: 'Performance Metrics', icon: Activity },
    { id: 'framerate', label: 'Frame Rate Stabilization', icon: Gauge },
    { id: 'memory', label: 'Memory Pooling', icon: Cpu },
    { id: 'rendering', label: 'Rendering Batching', icon: Zap },
    { id: 'gestures', label: 'Touch Gestures', icon: TrendingUp },
    { id: 'advanced', label: 'Advanced Settings', icon: Settings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'metrics':
        return <PerformanceMetricsPanel performanceData={performanceData} />;
      case 'framerate':
        return <FrameRateStabilizationPanel performanceData={performanceData} />;
      case 'memory':
        return <MemoryPoolingEnginePanel />;
      case 'rendering':
        return <RenderingBatchingPanel />;
      case 'gestures':
        return <TouchGestureDebouncePanel />;
      case 'advanced':
        return <AdvancedOptimizationPanel />;
      default:
        return <PerformanceMetricsPanel performanceData={performanceData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          3D Carousel Performance Optimization Center
        </h1>
        <p className="text-slate-300">
          Comprehensive performance monitoring and optimization controls for Kinetic Spindle, Isometric Deck, and Liquid Horizon
        </p>
      </div>

      {/* Performance Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Current FPS</span>
            <Gauge className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{performanceData?.currentFPS?.toFixed(1) || '0'}</div>
          <div className="text-xs text-slate-400 mt-1">Target: {performanceData?.targetFPS || 60} FPS</div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Memory Usage</span>
            <Cpu className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{performanceData?.memoryUsage?.toFixed(1) || '0'}%</div>
          <div className="text-xs text-slate-400 mt-1">Optimized pooling</div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Render Calls</span>
            <Zap className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-white">{performanceData?.renderCalls || 0}</div>
          <div className="text-xs text-slate-400 mt-1">Per frame</div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Gesture Latency</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{performanceData?.gestureLatency?.toFixed(1) || '0'}ms</div>
          <div className="text-xs text-slate-400 mt-1">Debounced</div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Overall Status</span>
            <Activity className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400">Optimal</div>
          <div className="text-xs text-slate-400 mt-1">All systems go</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg mb-6">
        <div className="flex overflow-x-auto">
          {tabs?.map((tab) => {
            const Icon = tab?.icon;
            return (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'bg-purple-600 text-white border-b-2 border-purple-400' :'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {tab?.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ThreeDCarouselPerformanceOptimizationCenter;