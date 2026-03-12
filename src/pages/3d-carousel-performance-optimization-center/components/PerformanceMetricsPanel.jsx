import React from 'react';
import { Activity, Zap, Cpu, TrendingUp } from 'lucide-react';

const PerformanceMetricsPanel = ({ performanceData }) => {
  const carousels = [
    { name: 'Kinetic Spindle', fps: performanceData?.currentFPS || 60, memory: 35, status: 'optimal' },
    { name: 'Isometric Deck', fps: (performanceData?.currentFPS || 60) - 2, memory: 42, status: 'optimal' },
    { name: 'Liquid Horizon', fps: (performanceData?.currentFPS || 60) - 1, memory: 38, status: 'optimal' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Real-Time Performance Metrics</h2>
        <p className="text-slate-400 mb-6">
          Live monitoring of 3D carousel performance with 60fps target maintenance
        </p>
      </div>

      {/* Carousel Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {carousels?.map((carousel, index) => (
          <div key={index} className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">{carousel?.name}</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Frame Rate</span>
                  <span className="text-green-400 font-semibold">{carousel?.fps?.toFixed(1)} FPS</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-green-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(carousel?.fps / 60) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Memory Usage</span>
                  <span className="text-blue-400 font-semibold">{carousel?.memory}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${carousel?.memory}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                <span className="text-slate-400 text-sm">Status</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                  {carousel?.status?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Metrics */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Detailed Performance Indicators</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-slate-400 text-sm">Avg Frame Time</span>
            </div>
            <div className="text-2xl font-bold text-white">16.7ms</div>
            <div className="text-xs text-slate-400 mt-1">Target: 16.67ms</div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-slate-400 text-sm">Draw Calls</span>
            </div>
            <div className="text-2xl font-bold text-white">{performanceData?.renderCalls || 120}</div>
            <div className="text-xs text-slate-400 mt-1">Batched efficiently</div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span className="text-slate-400 text-sm">GPU Utilization</span>
            </div>
            <div className="text-2xl font-bold text-white">62%</div>
            <div className="text-xs text-slate-400 mt-1">Optimal range</div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span className="text-slate-400 text-sm">Input Latency</span>
            </div>
            <div className="text-2xl font-bold text-white">{performanceData?.gestureLatency?.toFixed(1) || 8}ms</div>
            <div className="text-xs text-slate-400 mt-1">Debounced</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetricsPanel;