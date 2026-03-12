import React from 'react';
import Icon from '../../../components/AppIcon';

const HorizontalSnapConfig = ({ config, onChange }) => {
  const updateConfig = (key, value) => {
    onChange({ ...config, [key]: value });
  };

  const updateSnapPhysics = (key, value) => {
    onChange({ 
      ...config, 
      snapPhysics: { ...config?.snapPhysics, [key]: value } 
    });
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="ArrowLeftRight" size={24} className="text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Horizontal Snap Configuration</h2>
          <p className="text-sm text-muted-foreground">Configure PageView with premium snap physics and parallax effects</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card Dimensions */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Card Width (px)</label>
          <input
            type="number"
            value={config?.cardWidth}
            onChange={(e) => updateConfig('cardWidth', parseInt(e?.target?.value))}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            min="200"
            max="500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Card Gap (px)</label>
          <input
            type="number"
            value={config?.cardGap}
            onChange={(e) => updateConfig('cardGap', parseInt(e?.target?.value))}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            min="8"
            max="32"
          />
        </div>

        {/* Snap Physics */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Snap Stiffness</label>
          <input
            type="number"
            value={config?.snapPhysics?.stiffness}
            onChange={(e) => updateSnapPhysics('stiffness', parseInt(e?.target?.value))}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            min="100"
            max="800"
          />
          <p className="text-xs text-muted-foreground mt-1">Higher = faster snap (100-800)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Snap Damping</label>
          <input
            type="number"
            value={config?.snapPhysics?.damping}
            onChange={(e) => updateSnapPhysics('damping', parseInt(e?.target?.value))}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            min="10"
            max="100"
          />
          <p className="text-xs text-muted-foreground mt-1">Higher = less bounce (10-100)</p>
        </div>

        {/* Feature Toggles */}
        <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
          <div>
            <p className="font-medium text-foreground">Enable Parallax</p>
            <p className="text-xs text-muted-foreground">Subtle vertical offset on scroll</p>
          </div>
          <button
            onClick={() => updateConfig('enableParallax', !config?.enableParallax)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
              config?.enableParallax ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
              config?.enableParallax ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
          <div>
            <p className="font-medium text-foreground">Enable Haptic Feedback</p>
            <p className="text-xs text-muted-foreground">Vibration on snap and click</p>
          </div>
          <button
            onClick={() => updateConfig('enableHaptic', !config?.enableHaptic)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
              config?.enableHaptic ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
              config?.enableHaptic ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
          <div>
            <p className="font-medium text-foreground">Casino Theme</p>
            <p className="text-xs text-muted-foreground">Gold ring and glow on center card</p>
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
      </div>
      {/* Content Type Routing */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Content Type Routing</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">This carousel displays 4 content types:</p>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
              <li><strong>Live Elections:</strong> video_url, thumbnail, totalVoters, prizePool</li>
              <li><strong>Jolts (Videos):</strong> video_url, thumbnail, creator, hashtags, views, likes</li>
              <li><strong>Live Moments (Stories):</strong> expires_at countdown, moments_count, interactive indicator</li>
              <li><strong>Creator Spotlights:</strong> spotlight_reason, featured content, followers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalSnapConfig;