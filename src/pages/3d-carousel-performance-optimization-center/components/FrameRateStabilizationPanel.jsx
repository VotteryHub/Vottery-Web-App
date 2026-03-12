import React, { useState } from 'react';
import { Gauge, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const FrameRateStabilizationPanel = ({ performanceData }) => {
  const [settings, setSettings] = useState({
    targetFPS: 60,
    adaptiveQuality: true,
    autoLOD: true,
    performanceThreshold: 55
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Frame Rate Stabilization</h2>
        <p className="text-slate-400 mb-6">
          Adaptive quality scaling and automatic LOD adjustments for 60fps maintenance
        </p>
      </div>

      {/* Current Status */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Gauge className="w-5 h-5 text-green-400" />
          Current Performance Status
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-slate-400 text-sm mb-2">Current FPS</div>
            <div className="text-3xl font-bold text-white mb-1">{performanceData?.currentFPS?.toFixed(1) || 60}</div>
            <div className="flex items-center gap-1 text-xs">
              {(performanceData?.currentFPS || 60) >= settings?.targetFPS ? (
                <><CheckCircle className="w-3 h-3 text-green-400" /><span className="text-green-400">On Target</span></>
              ) : (
                <><AlertCircle className="w-3 h-3 text-yellow-400" /><span className="text-yellow-400">Below Target</span></>
              )}
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-slate-400 text-sm mb-2">Frame Time</div>
            <div className="text-3xl font-bold text-white mb-1">
              {(1000 / (performanceData?.currentFPS || 60))?.toFixed(2)}ms
            </div>
            <div className="text-xs text-slate-400">Target: 16.67ms</div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-slate-400 text-sm mb-2">Stability Score</div>
            <div className="text-3xl font-bold text-white mb-1">98%</div>
            <div className="text-xs text-green-400">Excellent</div>
          </div>
        </div>
      </div>

      {/* Stabilization Settings */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Stabilization Settings</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-slate-300 mb-2">Target FPS</label>
            <input
              type="range"
              min="30"
              max="60"
              step="5"
              value={settings?.targetFPS}
              onChange={(e) => handleSettingChange('targetFPS', parseInt(e?.target?.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-slate-400 mt-1">
              <span>30 FPS</span>
              <span className="text-white font-semibold">{settings?.targetFPS} FPS</span>
              <span>60 FPS</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-2">Performance Threshold</label>
            <input
              type="range"
              min="30"
              max="60"
              value={settings?.performanceThreshold}
              onChange={(e) => handleSettingChange('performanceThreshold', parseInt(e?.target?.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-slate-400 mt-1">
              <span>30 FPS</span>
              <span className="text-white font-semibold">{settings?.performanceThreshold} FPS</span>
              <span>60 FPS</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Trigger optimization when FPS drops below this threshold</p>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
            <div>
              <div className="text-white font-medium">Adaptive Quality Scaling</div>
              <div className="text-sm text-slate-400">Automatically adjust quality based on performance</div>
            </div>
            <button
              onClick={() => handleSettingChange('adaptiveQuality', !settings?.adaptiveQuality)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings?.adaptiveQuality ? 'bg-green-500' : 'bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings?.adaptiveQuality ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
            <div>
              <div className="text-white font-medium">Automatic LOD Adjustments</div>
              <div className="text-sm text-slate-400">Dynamic level of detail optimization</div>
            </div>
            <button
              onClick={() => handleSettingChange('autoLOD', !settings?.autoLOD)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings?.autoLOD ? 'bg-green-500' : 'bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings?.autoLOD ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Optimization Algorithms */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          Real-Time Optimization Algorithms
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <span className="text-slate-300">Dynamic Resolution Scaling</span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">ACTIVE</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <span className="text-slate-300">Texture Quality Adjustment</span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">ACTIVE</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <span className="text-slate-300">Shadow Quality Optimization</span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">ACTIVE</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <span className="text-slate-300">Particle System Throttling</span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameRateStabilizationPanel;