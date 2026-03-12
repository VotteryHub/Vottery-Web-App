import React from 'react';
import Icon from '../../../components/AppIcon';

const VerticalStackConfig = ({ config, onChange }) => {
  const updateConfig = (key, value) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
          <Icon name="Layers" size={24} className="text-secondary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Vertical Stack Configuration</h2>
          <p className="text-sm text-muted-foreground">Configure Tinder-style swipe mechanics and card exit animations</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Swipe Mechanics */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Swipe Threshold (px)</label>
          <input
            type="number"
            value={config?.swipeThreshold}
            onChange={(e) => updateConfig('swipeThreshold', parseInt(e?.target?.value))}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            min="50"
            max="300"
          />
          <p className="text-xs text-muted-foreground mt-1">Distance to trigger swipe action (50-300)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Card Stack Offset (px)</label>
          <input
            type="number"
            value={config?.cardStackOffset}
            onChange={(e) => updateConfig('cardStackOffset', parseInt(e?.target?.value))}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            min="5"
            max="30"
          />
          <p className="text-xs text-muted-foreground mt-1">Diagonal offset between stacked cards (5-30)</p>
        </div>

        {/* Exit Animation */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Exit Animation</label>
          <select
            value={config?.exitAnimation}
            onChange={(e) => updateConfig('exitAnimation', e?.target?.value)}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="tinder">Tinder (Rotate + Slide)</option>
            <option value="fade">Fade Out</option>
            <option value="scale">Scale Down</option>
            <option value="flip">Flip Card</option>
          </select>
        </div>

        {/* Feature Toggles */}
        <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
          <div>
            <p className="font-medium text-foreground">Enable Haptic Feedback</p>
            <p className="text-xs text-muted-foreground">Vibration on swipe</p>
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
            <p className="font-medium text-foreground">Enable Particle Effects</p>
            <p className="text-xs text-muted-foreground">Gold shimmer dust on swipe</p>
          </div>
          <button
            onClick={() => updateConfig('enableParticles', !config?.enableParticles)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
              config?.enableParticles ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
              config?.enableParticles ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>
      {/* Content Type Routing */}
      <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-purple-600 dark:text-purple-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">Content Type Routing</h3>
            <p className="text-sm text-purple-700 dark:text-purple-300 mb-2">This carousel displays 4 content types:</p>
            <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1 list-disc list-inside">
              <li><strong>Suggested Connections:</strong> mutual_members, followers, posts, bio</li>
              <li><strong>Recommended Groups:</strong> member_count, mutual_members, active_elections, top topics</li>
              <li><strong>Recommended Elections:</strong> match_score, prize_pool, time_remaining, why_recommended</li>
              <li><strong>Creator Marketplace Services:</strong> service_type, price_range, rating, completed_projects</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerticalStackConfig;