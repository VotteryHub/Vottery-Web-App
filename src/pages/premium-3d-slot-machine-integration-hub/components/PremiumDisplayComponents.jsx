import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

export default function PremiumDisplayComponents() {
  const [components, setComponents] = useState({
    particleEffects: true,
    goldenAnimations: true,
    celebratorySequences: true,
    winnerAnnouncements: true,
    confettiExplosion: true,
    lightRays: true,
    sparkles: true,
    socialSharing: true
  });

  const [intensitySettings, setIntensitySettings] = useState({
    particles: 75,
    confetti: 100,
    lightIntensity: 80,
    animationSpeed: 100
  });

  return (
    <div className="space-y-6">
      {/* Premium Effects Overview */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg shadow p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Icon name="Sparkles" className="w-8 h-8" />
          <h2 className="text-xl font-bold">Premium Display Components</h2>
        </div>
        <p className="text-yellow-100">
          Enhanced visual elements including particle effects, golden animations, celebratory sequences,
          and winner announcement ceremonies with haptic feedback integration.
        </p>
      </div>

      {/* Component Toggles */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Premium Components
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'particleEffects', label: 'Particle Effects', description: 'Floating particles around winners', icon: 'Sparkles' },
            { key: 'goldenAnimations', label: 'Golden Animations', description: 'Luxurious gold shimmer effects', icon: 'Award' },
            { key: 'celebratorySequences', label: 'Celebratory Sequences', description: 'Multi-stage celebration animations', icon: 'PartyPopper' },
            { key: 'winnerAnnouncements', label: 'Winner Announcements', description: 'Dramatic winner reveal ceremonies', icon: 'Trophy' },
            { key: 'confettiExplosion', label: 'Confetti Explosion', description: 'Colorful confetti bursts', icon: 'Zap' },
            { key: 'lightRays', label: 'Light Rays', description: 'Radiant light beam effects', icon: 'Sun' },
            { key: 'sparkles', label: 'Sparkles', description: 'Twinkling star effects', icon: 'Star' },
            { key: 'socialSharing', label: 'Social Sharing', description: 'Instant share celebration moments', icon: 'Share2' }
          ]?.map(({ key, label, description, icon }) => (
            <div key={key} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-start gap-3">
                <Icon name={icon} className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
                </div>
              </div>
              <button
                onClick={() => setComponents(prev => ({ ...prev, [key]: !prev?.[key] }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                  components?.[key] ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    components?.[key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Intensity Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Effect Intensity Settings
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Particle Density
              </label>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {intensitySettings?.particles}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={intensitySettings?.particles}
              onChange={(e) => setIntensitySettings(prev => ({ ...prev, particles: parseInt(e?.target?.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Confetti Amount
              </label>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {intensitySettings?.confetti}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={intensitySettings?.confetti}
              onChange={(e) => setIntensitySettings(prev => ({ ...prev, confetti: parseInt(e?.target?.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Light Intensity
              </label>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {intensitySettings?.lightIntensity}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={intensitySettings?.lightIntensity}
              onChange={(e) => setIntensitySettings(prev => ({ ...prev, lightIntensity: parseInt(e?.target?.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Animation Speed
              </label>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {intensitySettings?.animationSpeed}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              value={intensitySettings?.animationSpeed}
              onChange={(e) => setIntensitySettings(prev => ({ ...prev, animationSpeed: parseInt(e?.target?.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Effect Preview
        </h3>
        <div className="relative h-64 bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg overflow-hidden flex items-center justify-center">
          <div className="text-center">
            <Icon name="Trophy" className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-bounce" />
            <p className="text-2xl font-bold text-white mb-2">🎉 WINNER! 🎉</p>
            <p className="text-yellow-400 text-lg">$1,000,000</p>
          </div>
          {components?.sparkles && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(10)]?.map((_, i) => (
                <Icon
                  key={i}
                  name="Sparkles"
                  className="absolute text-yellow-400 animate-pulse"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Save Premium Settings
        </button>
      </div>
    </div>
  );
}