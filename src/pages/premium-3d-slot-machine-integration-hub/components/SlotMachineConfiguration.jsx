import React, { useState } from 'react';


export default function SlotMachineConfiguration() {
  const [config, setConfig] = useState({
    reelCount: 5,
    reelDesign: 'classic',
    metallicTexture: true,
    ambientLighting: 'warm',
    spinSpeed: 'medium',
    spinDuration: 3,
    soundEffects: true,
    hapticFeedback: true,
    autoSpin: false
  });

  const reelDesigns = [
    { id: 'classic', label: 'Classic', description: 'Traditional slot machine look' },
    { id: 'modern', label: 'Modern', description: 'Sleek contemporary design' },
    { id: 'luxury', label: 'Luxury', description: 'Premium gold and crystal' },
    { id: 'neon', label: 'Neon', description: 'Vibrant glowing effects' }
  ];

  const lightingOptions = [
    { id: 'warm', label: 'Warm', color: 'from-yellow-600 to-orange-600' },
    { id: 'cool', label: 'Cool', color: 'from-blue-600 to-cyan-600' },
    { id: 'neutral', label: 'Neutral', color: 'from-gray-600 to-gray-400' },
    { id: 'dramatic', label: 'Dramatic', color: 'from-purple-600 to-pink-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Reel Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Reel Configuration
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of Reels: {config?.reelCount}
            </label>
            <input
              type="range"
              min="3"
              max="7"
              value={config?.reelCount}
              onChange={(e) => setConfig(prev => ({ ...prev, reelCount: parseInt(e?.target?.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>3</span>
              <span>5</span>
              <span>7</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reel Design
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {reelDesigns?.map(design => (
                <button
                  key={design?.id}
                  onClick={() => setConfig(prev => ({ ...prev, reelDesign: design?.id }))}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    config?.reelDesign === design?.id
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' :'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{design?.label}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{design?.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Effects */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Visual Effects
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Metallic Texture</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Realistic metal surface rendering</p>
            </div>
            <button
              onClick={() => setConfig(prev => ({ ...prev, metallicTexture: !prev?.metallicTexture }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config?.metallicTexture ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config?.metallicTexture ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ambient Lighting
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {lightingOptions?.map(option => (
                <button
                  key={option?.id}
                  onClick={() => setConfig(prev => ({ ...prev, ambientLighting: option?.id }))}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    config?.ambientLighting === option?.id
                      ? 'border-purple-600' :'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                  }`}
                >
                  <div className={`h-8 rounded bg-gradient-to-r ${option?.color} mb-2`} />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{option?.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Physics & Mechanics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Physics & Mechanics
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Spin Speed
            </label>
            <select
              value={config?.spinSpeed}
              onChange={(e) => setConfig(prev => ({ ...prev, spinSpeed: e?.target?.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="slow">Slow (Dramatic)</option>
              <option value="medium">Medium (Balanced)</option>
              <option value="fast">Fast (Exciting)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Spin Duration: {config?.spinDuration} seconds
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={config?.spinDuration}
              onChange={(e) => setConfig(prev => ({ ...prev, spinDuration: parseFloat(e?.target?.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Audio & Haptics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Audio & Haptic Feedback
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Sound Effects</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Spinning and winning sounds</p>
            </div>
            <button
              onClick={() => setConfig(prev => ({ ...prev, soundEffects: !prev?.soundEffects }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config?.soundEffects ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config?.soundEffects ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Haptic Feedback</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Vibration on mobile devices</p>
            </div>
            <button
              onClick={() => setConfig(prev => ({ ...prev, hapticFeedback: !prev?.hapticFeedback }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config?.hapticFeedback ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config?.hapticFeedback ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Save Configuration
        </button>
      </div>
    </div>
  );
}