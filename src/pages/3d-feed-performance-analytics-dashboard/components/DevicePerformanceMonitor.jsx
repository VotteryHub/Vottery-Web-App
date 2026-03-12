import React from 'react';
import { Cpu, AlertTriangle, Zap, Activity, CheckCircle } from 'lucide-react';

const DevicePerformanceMonitor = ({ deviceData, autoOptimization }) => {
  const getQualityColor = (level) => {
    switch(level) {
      case 'high': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-red-600 dark:text-red-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getGPUStatus = (utilization) => {
    if (utilization < 60) return { status: 'Optimal', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' };
    if (utilization < 80) return { status: 'Good', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' };
    if (utilization < 90) return { status: 'High', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30' };
    return { status: 'Critical', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' };
  };

  const gpuStatus = getGPUStatus(deviceData?.gpuUtilization);

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Cpu className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Device Performance Monitoring
          </h2>
        </div>
        {autoOptimization && (
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">Auto-Optimization Active</span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* GPU Utilization */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">GPU Utilization</span>
            <span className={`text-xs font-medium px-2 py-1 rounded ${gpuStatus?.bg} ${gpuStatus?.color}`}>
              {gpuStatus?.status}
            </span>
          </div>
          <div className="relative">
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {deviceData?.gpuUtilization?.toFixed(1)}%
            </div>
            <div className="mt-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  deviceData?.gpuUtilization < 60 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                  deviceData?.gpuUtilization < 80 ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
                  deviceData?.gpuUtilization < 90 ? 'bg-gradient-to-r from-yellow-500 to-orange-600': 'bg-gradient-to-r from-red-500 to-pink-600'
                }`}
                style={{ width: `${deviceData?.gpuUtilization}%` }}
              />
            </div>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            Target: &lt;80% • Real-time monitoring
          </div>
        </div>

        {/* Frame Drops */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Frame Drops</span>
            {deviceData?.frameDrops > 10 && (
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
            )}
          </div>
          <div className="relative">
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {deviceData?.frameDrops}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              in last 60s
            </div>
          </div>
          <div className={`text-xs font-medium ${
            deviceData?.frameDrops < 5 ? 'text-green-600 dark:text-green-400' :
            deviceData?.frameDrops < 15 ? 'text-yellow-600 dark:text-yellow-400': 'text-red-600 dark:text-red-400'
          }`}>
            {deviceData?.frameDrops < 5 ? '✓ Smooth rendering' :
             deviceData?.frameDrops < 15 ? '⚠ Minor drops detected': '✗ Performance degradation'}
          </div>
        </div>

        {/* Thermal Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Thermal Status</span>
            {deviceData?.thermalThrottling && (
              <AlertTriangle className="w-4 h-4 text-red-600" />
            )}
          </div>
          <div className="relative">
            <div className={`text-2xl font-bold ${
              deviceData?.thermalThrottling ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
            }`}>
              {deviceData?.thermalThrottling ? 'Throttling' : 'Normal'}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {deviceData?.thermalThrottling ? 'Reducing quality' : 'Optimal temp'}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className={`w-4 h-4 ${
              deviceData?.thermalThrottling ? 'text-red-600' : 'text-green-600'
            }`} />
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {deviceData?.thermalThrottling ? 'Auto-cooling active' : 'Temperature stable'}
            </span>
          </div>
        </div>

        {/* Quality Level */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Rendering Quality</span>
            {deviceData?.adaptiveRenderingActive && (
              <Zap className="w-4 h-4 text-yellow-600" />
            )}
          </div>
          <div className="relative">
            <div className={`text-2xl font-bold uppercase ${getQualityColor(deviceData?.qualityLevel)}`}>
              {deviceData?.qualityLevel}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {deviceData?.adaptiveRenderingActive ? 'Adaptive mode' : 'Fixed quality'}
            </div>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            {deviceData?.qualityLevel === 'high' && '✓ Maximum visual fidelity'}
            {deviceData?.qualityLevel === 'medium' && '⚠ Balanced performance'}
            {deviceData?.qualityLevel === 'low' && '⚡ Performance priority'}
          </div>
        </div>
      </div>
      {/* Adaptive Rendering Alert */}
      {deviceData?.adaptiveRenderingActive && (
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                Adaptive Rendering Active
              </h3>
              <p className="text-xs text-yellow-800 dark:text-yellow-300">
                System automatically adjusting 3D rendering quality to maintain smooth performance. 
                GPU utilization: {deviceData?.gpuUtilization?.toFixed(1)}% • Target: &lt;80%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevicePerformanceMonitor;