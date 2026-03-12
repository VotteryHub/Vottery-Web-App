import React, { useState } from 'react';
import { Hand, Zap, TrendingDown, Settings } from 'lucide-react';

const TouchGestureDebouncePanel = () => {
  const [debounceSettings, setDebounceSettings] = useState({
    swipeDebounce: 50,
    tapDebounce: 100,
    pinchDebounce: 30,
    rotateDebounce: 40
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Touch Gesture Debouncing</h2>
        <p className="text-slate-400 mb-6">
          Input lag reduction, gesture recognition accuracy, and haptic feedback optimization
        </p>
      </div>

      {/* Gesture Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Hand className="w-4 h-4 text-purple-400" />
            <span className="text-slate-400 text-sm">Input Latency</span>
          </div>
          <div className="text-3xl font-bold text-white">8ms</div>
          <div className="text-xs text-green-400 mt-1">Excellent</div>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-slate-400 text-sm">Recognition Rate</span>
          </div>
          <div className="text-3xl font-bold text-white">98%</div>
          <div className="text-xs text-green-400 mt-1">High accuracy</div>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-green-400" />
            <span className="text-slate-400 text-sm">False Positives</span>
          </div>
          <div className="text-3xl font-bold text-white">2%</div>
          <div className="text-xs text-green-400 mt-1">Minimal</div>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-4 h-4 text-blue-400" />
            <span className="text-slate-400 text-sm">Haptic Delay</span>
          </div>
          <div className="text-3xl font-bold text-white">12ms</div>
          <div className="text-xs text-slate-400 mt-1">Optimized</div>
        </div>
      </div>

      {/* Gesture Debounce Settings */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Debounce Configuration</h3>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-300">Swipe Gesture Debounce</label>
              <span className="text-white font-semibold">{debounceSettings?.swipeDebounce}ms</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={debounceSettings?.swipeDebounce}
              onChange={(e) => setDebounceSettings(prev => ({ ...prev, swipeDebounce: parseInt(e?.target?.value) }))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>10ms (Fast)</span>
              <span>100ms (Slow)</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-300">Tap Gesture Debounce</label>
              <span className="text-white font-semibold">{debounceSettings?.tapDebounce}ms</span>
            </div>
            <input
              type="range"
              min="50"
              max="200"
              step="10"
              value={debounceSettings?.tapDebounce}
              onChange={(e) => setDebounceSettings(prev => ({ ...prev, tapDebounce: parseInt(e?.target?.value) }))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>50ms (Fast)</span>
              <span>200ms (Slow)</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-300">Pinch Gesture Debounce</label>
              <span className="text-white font-semibold">{debounceSettings?.pinchDebounce}ms</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={debounceSettings?.pinchDebounce}
              onChange={(e) => setDebounceSettings(prev => ({ ...prev, pinchDebounce: parseInt(e?.target?.value) }))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>10ms (Fast)</span>
              <span>100ms (Slow)</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-300">Rotate Gesture Debounce</label>
              <span className="text-white font-semibold">{debounceSettings?.rotateDebounce}ms</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={debounceSettings?.rotateDebounce}
              onChange={(e) => setDebounceSettings(prev => ({ ...prev, rotateDebounce: parseInt(e?.target?.value) }))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>10ms (Fast)</span>
              <span>100ms (Slow)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Device-Specific Calibration */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Device-Specific Calibration</h3>
        
        <div className="space-y-3">
          {[
            { device: 'High-End Mobile', latency: 6, accuracy: 99 },
            { device: 'Mid-Range Mobile', latency: 8, accuracy: 98 },
            { device: 'Budget Mobile', latency: 12, accuracy: 95 },
            { device: 'Tablet', latency: 7, accuracy: 98 }
          ]?.map((device, index) => (
            <div key={index} className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-medium">{device?.device}</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                  CALIBRATED
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Latency:</span>
                  <span className="text-white font-semibold ml-2">{device?.latency}ms</span>
                </div>
                <div>
                  <span className="text-slate-400">Accuracy:</span>
                  <span className="text-white font-semibold ml-2">{device?.accuracy}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Haptic Feedback Optimization */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Haptic Feedback Optimization</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-slate-400 text-sm mb-2">Feedback Intensity</div>
            <div className="text-2xl font-bold text-white mb-1">Medium</div>
            <div className="text-xs text-slate-400">Balanced response</div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-slate-400 text-sm mb-2">Feedback Duration</div>
            <div className="text-2xl font-bold text-white mb-1">15ms</div>
            <div className="text-xs text-slate-400">Optimal timing</div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <span className="text-slate-300">Swipe Feedback</span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">ENABLED</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <span className="text-slate-300">Tap Feedback</span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">ENABLED</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <span className="text-slate-300">Long Press Feedback</span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">ENABLED</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TouchGestureDebouncePanel;