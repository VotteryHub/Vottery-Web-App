import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

export default function AnimationControlEngine() {
  const [timingSettings, setTimingSettings] = useState({
    introDelay: 500,
    spinDuration: 3000,
    revealDelay: 1000,
    celebrationDuration: 5000,
    outroDelay: 2000
  });

  const [accessibilityOptions, setAccessibilityOptions] = useState({
    reducedMotion: false,
    skipAnimations: false,
    simplifiedEffects: false,
    highContrast: false
  });

  return (
    <div className="space-y-6">
      {/* Timing Adjustments */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Animation Timing Controls
        </h3>
        <div className="space-y-4">
          {[
            { key: 'introDelay', label: 'Intro Delay', min: 0, max: 2000, step: 100, unit: 'ms' },
            { key: 'spinDuration', label: 'Spin Duration', min: 1000, max: 10000, step: 500, unit: 'ms' },
            { key: 'revealDelay', label: 'Reveal Delay', min: 0, max: 3000, step: 100, unit: 'ms' },
            { key: 'celebrationDuration', label: 'Celebration Duration', min: 2000, max: 10000, step: 500, unit: 'ms' },
            { key: 'outroDelay', label: 'Outro Delay', min: 0, max: 5000, step: 500, unit: 'ms' }
          ]?.map(({ key, label, min, max, step, unit }) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {label}
                </label>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {timingSettings?.[key]}{unit}
                </span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={timingSettings?.[key]}
                onChange={(e) => setTimingSettings(prev => ({ ...prev, [key]: parseInt(e?.target?.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Visual Intensity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Visual Intensity Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Icon name="Zap" className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">Low Intensity</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Subtle animations</p>
          </button>

          <button className="p-4 border-2 border-purple-600 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <Icon name="Sparkles" className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">Medium Intensity</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Balanced effects</p>
          </button>

          <button className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300">
            <Icon name="Flame" className="w-6 h-6 mx-auto mb-2 text-orange-600" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">High Intensity</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Maximum effects</p>
          </button>
        </div>
      </div>

      {/* Accessibility Options */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Accessibility Options for Motion-Sensitive Users
        </h3>
        <div className="space-y-3">
          {[
            { key: 'reducedMotion', label: 'Reduced Motion', description: 'Minimize animation movement' },
            { key: 'skipAnimations', label: 'Skip Animations', description: 'Show results immediately' },
            { key: 'simplifiedEffects', label: 'Simplified Effects', description: 'Remove complex visual effects' },
            { key: 'highContrast', label: 'High Contrast Mode', description: 'Enhance visual clarity' }
          ]?.map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
              </div>
              <button
                onClick={() => setAccessibilityOptions(prev => ({ ...prev, [key]: !prev?.[key] }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  accessibilityOptions?.[key] ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    accessibilityOptions?.[key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Animation Preview Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Animation Timeline Preview
        </h3>
        <div className="space-y-3">
          {[
            { phase: 'Intro', duration: timingSettings?.introDelay, color: 'bg-blue-600' },
            { phase: 'Spin', duration: timingSettings?.spinDuration, color: 'bg-purple-600' },
            { phase: 'Reveal', duration: timingSettings?.revealDelay, color: 'bg-yellow-600' },
            { phase: 'Celebration', duration: timingSettings?.celebrationDuration, color: 'bg-green-600' },
            { phase: 'Outro', duration: timingSettings?.outroDelay, color: 'bg-gray-600' }
          ]?.map(({ phase, duration, color }) => (
            <div key={phase} className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-24">
                {phase}
              </span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative overflow-hidden">
                <div
                  className={`${color} h-full rounded-full flex items-center justify-end px-2 transition-all duration-300`}
                  style={{ width: `${(duration / 10000) * 100}%` }}
                >
                  <span className="text-xs text-white font-medium">{duration}ms</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Total Animation Duration: {Object.values(timingSettings)?.reduce((a, b) => a + b, 0)}ms
            ({(Object.values(timingSettings)?.reduce((a, b) => a + b, 0) / 1000)?.toFixed(1)}s)
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Save Animation Settings
        </button>
      </div>
    </div>
  );
}