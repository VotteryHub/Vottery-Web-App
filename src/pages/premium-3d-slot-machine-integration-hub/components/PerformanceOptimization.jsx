import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

export default function PerformanceOptimization() {
  const [optimizationSettings, setOptimizationSettings] = useState({
    textureCompression: true,
    levelOfDetail: true,
    frustumCulling: true,
    occlusionCulling: false,
    batchRendering: true,
    instancedRendering: true,
    asyncLoading: true,
    memoryPooling: true
  });

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg shadow p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Icon name="Zap" className="w-8 h-8" />
          <h2 className="text-xl font-bold">Performance Optimization</h2>
        </div>
        <p className="text-green-100">
          Advanced optimization techniques for smooth 60 FPS rendering across all device capabilities
          with automatic quality scaling and efficient resource management.
        </p>
      </div>

      {/* Optimization Techniques */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Optimization Techniques
        </h3>
        <div className="space-y-3">
          {[
            { key: 'textureCompression', label: 'Texture Compression', description: 'Reduce memory usage with compressed textures', impact: 'High' },
            { key: 'levelOfDetail', label: 'Level of Detail (LOD)', description: 'Adjust model complexity based on distance', impact: 'High' },
            { key: 'frustumCulling', label: 'Frustum Culling', description: 'Skip rendering objects outside view', impact: 'Medium' },
            { key: 'occlusionCulling', label: 'Occlusion Culling', description: 'Skip rendering hidden objects', impact: 'Medium' },
            { key: 'batchRendering', label: 'Batch Rendering', description: 'Combine multiple draw calls', impact: 'High' },
            { key: 'instancedRendering', label: 'Instanced Rendering', description: 'Efficiently render multiple copies', impact: 'High' },
            { key: 'asyncLoading', label: 'Async Asset Loading', description: 'Load resources without blocking', impact: 'Medium' },
            { key: 'memoryPooling', label: 'Memory Pooling', description: 'Reuse allocated memory', impact: 'Medium' }
          ]?.map(({ key, label, description, impact }) => (
            <div key={key} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    impact === 'High' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {impact} Impact
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
              </div>
              <button
                onClick={() => setOptimizationSettings(prev => ({ ...prev, [key]: !prev?.[key] }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ml-4 flex-shrink-0 ${
                  optimizationSettings?.[key] ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    optimizationSettings?.[key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performance Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Avg Frame Rate</span>
              <Icon name="TrendingUp" className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">58.7 FPS</p>
            <p className="text-xs text-green-600 mt-1">+5% from baseline</p>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Memory Usage</span>
              <Icon name="Database" className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">142 MB</p>
            <p className="text-xs text-blue-600 mt-1">-18% optimized</p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Draw Calls</span>
              <Icon name="Layers" className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
            <p className="text-xs text-purple-600 mt-1">-60% batched</p>
          </div>
        </div>
      </div>

      {/* Device-Specific Optimization */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Device-Specific Optimization Profiles
        </h3>
        <div className="space-y-3">
          {[
            { device: 'Desktop High-End', settings: 'Ultra quality, all effects enabled', performance: '60 FPS' },
            { device: 'Desktop Mid-Range', settings: 'High quality, selective effects', performance: '60 FPS' },
            { device: 'Laptop', settings: 'Medium quality, optimized effects', performance: '55-60 FPS' },
            { device: 'Tablet', settings: 'Medium quality, reduced particles', performance: '50-55 FPS' },
            { device: 'Mobile Flagship', settings: 'Low-medium quality, essential effects', performance: '45-50 FPS' },
            { device: 'Mobile Budget', settings: 'Low quality, minimal effects', performance: '30-40 FPS' }
          ]?.map(({ device, settings, performance }) => (
            <div key={device} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900 dark:text-white">{device}</span>
                <span className="text-sm text-green-600 font-medium">{performance}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{settings}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Comprehensive Analytics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Comprehensive Analytics for Engagement Tracking
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">User Engagement Metrics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Animation Completion Rate</span>
                <span className="font-medium text-gray-900 dark:text-white">94.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Avg Watch Time</span>
                <span className="font-medium text-gray-900 dark:text-white">8.3s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Social Shares</span>
                <span className="font-medium text-gray-900 dark:text-white">1,247</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Technical Performance</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Load Time</span>
                <span className="font-medium text-gray-900 dark:text-white">1.2s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Error Rate</span>
                <span className="font-medium text-gray-900 dark:text-white">0.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Device Coverage</span>
                <span className="font-medium text-gray-900 dark:text-white">98.7%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Apply Optimization Settings
        </button>
      </div>
    </div>
  );
}