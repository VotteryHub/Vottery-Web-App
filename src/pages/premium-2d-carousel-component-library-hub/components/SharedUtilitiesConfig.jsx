import React from 'react';
import Icon from '../../../components/AppIcon';
import { hapticFeedbackService } from '../../../services/hapticFeedbackService';

const SharedUtilitiesConfig = ({ config, onChange }) => {
  const updateConfig = (key, value) => {
    onChange({ ...config, [key]: value });
  };

  const updateHapticPattern = (intensity, pattern) => {
    onChange({ 
      ...config, 
      hapticPatterns: { ...config?.hapticPatterns, [intensity]: pattern } 
    });
  };

  const testHaptic = (intensity) => {
    hapticFeedbackService?.trigger(intensity);
  };

  return (
    <div className="space-y-6">
      {/* Haptic Feedback Configuration */}
      <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Vibrate" size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Haptic Feedback Patterns</h2>
            <p className="text-sm text-muted-foreground">Configure vibration patterns for different interaction types</p>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(config?.hapticPatterns || {})?.map(([intensity, pattern]) => (
            <div key={intensity} className="p-4 bg-background rounded-lg border border-border">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground capitalize">{intensity}</h3>
                  <p className="text-xs text-muted-foreground">Pattern: [{pattern?.join(', ')}]</p>
                </div>
                <button
                  onClick={() => testHaptic(intensity)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 flex items-center gap-2"
                >
                  <Icon name="Play" size={16} />
                  <span>Test</span>
                </button>
              </div>
              <input
                type="text"
                value={pattern?.join(', ')}
                onChange={(e) => {
                  const newPattern = e?.target?.value?.split(',')?.map(v => parseInt(v?.trim()))?.filter(v => !isNaN(v));
                  updateHapticPattern(intensity, newPattern);
                }}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter comma-separated values (e.g., 10, 5, 10)"
              />
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={20} className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">Pattern Format</h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">Values are in milliseconds. Alternates between vibrate and pause. Example: [10, 5, 10] = vibrate 10ms, pause 5ms, vibrate 10ms</p>
            </div>
          </div>
        </div>
      </div>
      {/* Parallax Configuration */}
      <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Move" size={24} className="text-secondary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Parallax Effect Configuration</h2>
            <p className="text-sm text-muted-foreground">Configure scroll-based transform effects</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Parallax Speed</label>
            <input
              type="number"
              step="0.1"
              value={config?.parallaxSpeed}
              onChange={(e) => updateConfig('parallaxSpeed', parseFloat(e?.target?.value))}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              min="0.1"
              max="2.0"
            />
            <p className="text-xs text-muted-foreground mt-1">Multiplier for scroll offset (0.1 - 2.0)</p>
          </div>

          <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
            <div>
              <p className="font-medium text-foreground">Enable Parallax Globally</p>
              <p className="text-xs text-muted-foreground">Apply to all carousels</p>
            </div>
            <button
              onClick={() => updateConfig('parallaxEnabled', !config?.parallaxEnabled)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                config?.parallaxEnabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                config?.parallaxEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      </div>
      {/* Casino Theme Configuration */}
      <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Sparkles" size={24} className="text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Casino Aesthetic Theme</h2>
            <p className="text-sm text-muted-foreground">Configure gold/neon colors and shadow styles</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
            <div>
              <p className="font-medium text-foreground">Enable Casino Theme Globally</p>
              <p className="text-xs text-muted-foreground">Gold rings, neon glows, and shadow effects</p>
            </div>
            <button
              onClick={() => updateConfig('casinoTheme', !config?.casinoTheme)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                config?.casinoTheme ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                config?.casinoTheme ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg text-center">
              <p className="text-xs font-semibold text-yellow-900 mb-1">Gold Shimmer</p>
              <p className="text-[10px] text-yellow-800">#FFD700</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg text-center">
              <p className="text-xs font-semibold text-white mb-1">Neon Pink</p>
              <p className="text-[10px] text-pink-100">#FF10F0</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg text-center">
              <p className="text-xs font-semibold text-white mb-1">Neon Blue</p>
              <p className="text-[10px] text-blue-100">#00F0FF</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg text-center">
              <p className="text-xs font-semibold text-white mb-1">Neon Green</p>
              <p className="text-[10px] text-green-100">#39FF14</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedUtilitiesConfig;