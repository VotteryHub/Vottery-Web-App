import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

export default function ThemeCustomization() {
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [customColors, setCustomColors] = useState({
    primary: '#9333ea',
    secondary: '#3b82f6',
    accent: '#f59e0b',
    background: '#ffffff'
  });

  const themes = [
    { id: 'default', name: 'Default', colors: ['#9333ea', '#3b82f6', '#f59e0b'], season: null },
    { id: 'christmas', name: 'Christmas', colors: ['#dc2626', '#16a34a', '#fbbf24'], season: 'winter' },
    { id: 'halloween', name: 'Halloween', colors: ['#f97316', '#000000', '#a855f7'], season: 'fall' },
    { id: 'valentines', name: 'Valentine\'s Day', colors: ['#ec4899', '#ef4444', '#fbbf24'], season: 'winter' },
    { id: 'summer', name: 'Summer Vibes', colors: ['#06b6d4', '#fbbf24', '#f97316'], season: 'summer' },
    { id: 'spring', name: 'Spring Bloom', colors: ['#22c55e', '#ec4899', '#a855f7'], season: 'spring' },
    { id: 'corporate', name: 'Corporate', colors: ['#1e40af', '#64748b', '#0ea5e9'], season: null },
    { id: 'luxury', name: 'Luxury Gold', colors: ['#fbbf24', '#000000', '#ffffff'], season: null }
  ];

  return (
    <div className="space-y-6">
      {/* Theme Gallery */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Theme Customization Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {themes?.map(theme => (
            <button
              key={theme?.id}
              onClick={() => setSelectedTheme(theme?.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedTheme === theme?.id
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' :'border-gray-200 dark:border-gray-700 hover:border-purple-300'
              }`}
            >
              <div className="flex gap-1 mb-3">
                {theme?.colors?.map((color, i) => (
                  <div
                    key={i}
                    className="flex-1 h-8 rounded"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">{theme?.name}</p>
              {theme?.season && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 capitalize">
                  {theme?.season} Theme
                </p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Seasonal Animation Variants */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Seasonal Animation Variants
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Snowflake" className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900 dark:text-white">Winter Wonderland</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Snowflakes, ice crystals, and frosty effects
            </p>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Flower" className="w-5 h-5 text-pink-600" />
              <span className="font-medium text-gray-900 dark:text-white">Spring Blossoms</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Flower petals, butterflies, and fresh colors
            </p>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Sun" className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-gray-900 dark:text-white">Summer Sunshine</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Bright rays, beach vibes, and tropical effects
            </p>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Leaf" className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-gray-900 dark:text-white">Autumn Leaves</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Falling leaves, warm tones, and harvest themes
            </p>
          </div>
        </div>
      </div>

      {/* Brand Integration */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Brand Integration Capabilities
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Primary Brand Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customColors?.primary}
                onChange={(e) => setCustomColors(prev => ({ ...prev, primary: e?.target?.value }))}
                className="w-16 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={customColors?.primary}
                onChange={(e) => setCustomColors(prev => ({ ...prev, primary: e?.target?.value }))}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Secondary Brand Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customColors?.secondary}
                onChange={(e) => setCustomColors(prev => ({ ...prev, secondary: e?.target?.value }))}
                className="w-16 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={customColors?.secondary}
                onChange={(e) => setCustomColors(prev => ({ ...prev, secondary: e?.target?.value }))}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Accent Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customColors?.accent}
                onChange={(e) => setCustomColors(prev => ({ ...prev, accent: e?.target?.value }))}
                className="w-16 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={customColors?.accent}
                onChange={(e) => setCustomColors(prev => ({ ...prev, accent: e?.target?.value }))}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Brand Logo Upload
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-purple-400 transition-colors cursor-pointer">
              <Icon name="Upload" className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click to upload brand logo for sponsored content
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Theme Preview
        </h3>
        <div
          className="relative h-64 rounded-lg overflow-hidden flex items-center justify-center"
          style={{ backgroundColor: customColors?.background }}
        >
          <div className="text-center">
            <div
              className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: customColors?.primary }}
            >
              <Icon name="Trophy" className="w-12 h-12 text-white" />
            </div>
            <p
              className="text-2xl font-bold mb-2"
              style={{ color: customColors?.primary }}
            >
              WINNER!
            </p>
            <p
              className="text-lg"
              style={{ color: customColors?.accent }}
            >
              $1,000,000
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Save Theme Settings
        </button>
      </div>
    </div>
  );
}