import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

export default function RealTimeRendering() {
  const [metrics, setMetrics] = useState({
    fps: 60,
    frameTime: 16.67,
    gpuUsage: 45,
    memoryUsage: 128,
    renderQuality: 'high',
    deviceCompatibility: 'excellent'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        fps: Math.max(30, Math.min(60, prev?.fps + (Math.random() * 4 - 2))),
        frameTime: Math.max(16, Math.min(33, prev?.frameTime + (Math.random() * 2 - 1))),
        gpuUsage: Math.max(20, Math.min(80, prev?.gpuUsage + (Math.random() * 10 - 5))),
        memoryUsage: Math.max(100, Math.min(200, prev?.memoryUsage + (Math.random() * 10 - 5)))
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Live Performance Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Live 3D Performance Metrics
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Live</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Frame Rate</span>
              <Icon name="Activity" className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {metrics?.fps?.toFixed(0)}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">FPS</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Frame Time</span>
              <Icon name="Clock" className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {metrics?.frameTime?.toFixed(1)}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">ms</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">GPU Usage</span>
              <Icon name="Cpu" className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {metrics?.gpuUsage?.toFixed(0)}%
            </p>
            <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${metrics?.gpuUsage}%` }}
              />
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Memory</span>
              <Icon name="Database" className="w-4 h-4 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {metrics?.memoryUsage?.toFixed(0)}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">MB</p>
          </div>
        </div>
      </div>

      {/* Frame Rate Optimization */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Frame Rate Optimization
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <Icon name="CheckCircle" className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Optimal Performance</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Maintaining 60 FPS with current settings. All systems operating efficiently.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Zap" className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Hardware Acceleration</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">GPU rendering enabled</p>
            </div>

            <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Layers" className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Render Pipeline</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Optimized for WebGL 2.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Device Compatibility */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Device Compatibility Indicators
        </h3>
        <div className="space-y-3">
          {[
            { device: 'Desktop (High-End)', compatibility: 100, quality: 'Ultra', color: 'green' },
            { device: 'Desktop (Mid-Range)', compatibility: 90, quality: 'High', color: 'green' },
            { device: 'Laptop', compatibility: 85, quality: 'High', color: 'blue' },
            { device: 'Tablet (iPad Pro)', compatibility: 80, quality: 'Medium', color: 'blue' },
            { device: 'Mobile (Flagship)', compatibility: 75, quality: 'Medium', color: 'yellow' },
            { device: 'Mobile (Budget)', compatibility: 60, quality: 'Low', color: 'yellow' }
          ]?.map(({ device, compatibility, quality, color }) => (
            <div key={device} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{device}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{quality} Quality</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`bg-${color}-600 h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${compatibility}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                {compatibility}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Automatic Quality Scaling */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Automatic Quality Scaling
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="Settings" className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white mb-2">Adaptive Quality System</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatically adjusts rendering quality based on device capabilities and performance metrics.
                  Ensures smooth experience across all devices.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
              <Icon name="Smartphone" className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">Mobile</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Optimized textures</p>
            </div>
            <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
              <Icon name="Tablet" className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">Tablet</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Balanced quality</p>
            </div>
            <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
              <Icon name="Monitor" className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">Desktop</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Maximum quality</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}