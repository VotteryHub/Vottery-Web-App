import React from 'react';
import Icon from '../../../components/AppIcon';

const GradientFlowConfig = ({ config, onChange }) => {
  const updateConfig = (key, value) => {
    onChange({ ...config, [key]: value });
  };

  const updateViscousPhysics = (key, value) => {
    onChange({ 
      ...config, 
      viscousPhysics: { ...config?.viscousPhysics, [key]: value } 
    });
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
          <Icon name="Waves" size={24} className="text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gradient Flow Configuration</h2>
          <p className="text-sm text-muted-foreground">Configure viscous scroll physics and glassmorphism effects</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Blob Dimensions */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Blob Width (px)</label>
          <input
            type="number"
            value={config?.blobWidth}
            onChange={(e) => updateConfig('blobWidth', parseInt(e?.target?.value))}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            min="80"
            max="200"
          />
        </div>

        {/* Viscous Physics */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Scroll Stiffness</label>
          <input
            type="number"
            value={config?.viscousPhysics?.stiffness}
            onChange={(e) => updateViscousPhysics('stiffness', parseInt(e?.target?.value))}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            min="40"
            max="200"
          />
          <p className="text-xs text-muted-foreground mt-1">Lower = more viscous (40-200)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Scroll Damping</label>
          <input
            type="number"
            value={config?.viscousPhysics?.damping}
            onChange={(e) => updateViscousPhysics('damping', parseInt(e?.target?.value))}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            min="20"
            max="80"
          />
          <p className="text-xs text-muted-foreground mt-1">Higher = less momentum (20-80)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Scroll Mass</label>
          <input
            type="number"
            value={config?.viscousPhysics?.mass}
            onChange={(e) => updateViscousPhysics('mass', parseInt(e?.target?.value))}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            min="1"
            max="5"
          />
          <p className="text-xs text-muted-foreground mt-1">Higher = heavier feel (1-5)</p>
        </div>

        {/* Feature Toggles */}
        <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
          <div>
            <p className="font-medium text-foreground">Enable Haptic Feedback</p>
            <p className="text-xs text-muted-foreground">Light vibration on scroll</p>
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
            <p className="font-medium text-foreground">Enable Metaballs</p>
            <p className="text-xs text-muted-foreground">Animated organic background blobs</p>
          </div>
          <button
            onClick={() => updateConfig('enableMetaballs', !config?.enableMetaballs)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
              config?.enableMetaballs ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
              config?.enableMetaballs ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>
      {/* Gradient Colors */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-foreground mb-2">Gradient Background Colors</label>
        <div className="flex items-center gap-2">
          {config?.gradientColors?.map((color, index) => (
            <input
              key={index}
              type="text"
              value={color}
              onChange={(e) => {
                const newColors = [...config?.gradientColors];
                newColors[index] = e?.target?.value;
                updateConfig('gradientColors', newColors);
              }}
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Tailwind class"
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1">Use Tailwind gradient classes (e.g., from-purple-900/40)</p>
      </div>
      {/* Content Type Routing */}
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-green-600 dark:text-green-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">Content Type Routing</h3>
            <p className="text-sm text-green-700 dark:text-green-300 mb-2">This carousel displays 4 content types:</p>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1 list-disc list-inside">
              <li><strong>Recent Winners:</strong> prize_amount, user profile, trophy badge</li>
              <li><strong>Trending Topics:</strong> trend_score, growth_rate, post_count, hashtag</li>
              <li><strong>Top Earners:</strong> earnings_this_month, rank badges (gold/silver/bronze), growth percentage</li>
              <li><strong>Prediction Accuracy Champions:</strong> accuracy_score, winning_streak, total_predictions, specialization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradientFlowConfig;