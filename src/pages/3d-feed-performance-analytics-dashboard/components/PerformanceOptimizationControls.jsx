import React from 'react';
import { Settings, Zap, RefreshCw, Sliders, CheckCircle } from 'lucide-react';

const PerformanceOptimizationControls = ({ 
  autoOptimization, 
  setAutoOptimization, 
  refreshInterval, 
  setRefreshInterval,
  deviceData 
}) => {
  const qualityPresets = [
    { label: 'Low', value: 'low', description: 'Maximum performance' },
    { label: 'Medium', value: 'medium', description: 'Balanced' },
    { label: 'High', value: 'high', description: 'Best quality' },
    { label: 'Auto', value: 'auto', description: 'Adaptive' }
  ];

  const refreshOptions = [
    { label: '1s', value: 1000 },
    { label: '5s', value: 5000 },
    { label: '10s', value: 10000 },
    { label: '30s', value: 30000 }
  ];

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Settings className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Performance Optimization Controls
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <div>
                <div className="text-sm font-medium text-slate-900 dark:text-white">Auto-Optimization</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Adaptive quality adjustment</div>
              </div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={autoOptimization}
                onChange={(e) => setAutoOptimization(e?.target?.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </div>
          </label>
          {autoOptimization && (
            <div className="flex items-center space-x-2 text-xs text-green-600 dark:text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span>Active - Monitoring GPU</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-3 mb-2">
            <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <div className="text-sm font-medium text-slate-900 dark:text-white">Refresh Interval</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Data update frequency</div>
            </div>
          </div>
          <div className="flex space-x-2">
            {refreshOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => setRefreshInterval(option?.value)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  refreshInterval === option?.value
                    ? 'bg-blue-600 text-white' :'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {option?.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-3 mb-2">
            <Sliders className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <div>
              <div className="text-sm font-medium text-slate-900 dark:text-white">Rendering Quality</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Manual quality override</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {qualityPresets?.map((preset) => (
              <button
                key={preset?.value}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  deviceData?.qualityLevel === preset?.value
                    ? 'bg-purple-600 text-white' :'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                <div>{preset?.label}</div>
                <div className="text-xs opacity-75">{preset?.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
          💡 Optimization Recommendations
        </h3>
        <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
          {deviceData?.gpuUtilization > 80 && (
            <li>• GPU utilization high - Consider reducing quality or enabling auto-optimization</li>
          )}
          {deviceData?.frameDrops > 10 && (
            <li>• Frame drops detected - Lower rendering quality for smoother performance</li>
          )}
          {deviceData?.thermalThrottling && (
            <li>• Thermal throttling active - System automatically reducing quality to prevent overheating</li>
          )}
          {deviceData?.gpuUtilization < 50 && deviceData?.qualityLevel !== 'high' && (
            <li>• GPU headroom available - You can safely increase rendering quality</li>
          )}
          {!autoOptimization && (
            <li>• Enable auto-optimization for best balance between quality and performance</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PerformanceOptimizationControls;