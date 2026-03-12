import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const AlgorithmControlsPanel = ({ rankingConfig, onConfigUpdate }) => {
  const [localConfig, setLocalConfig] = useState(rankingConfig || {});
  const [saving, setSaving] = useState(false);

  const handleWeightChange = (key, value) => {
    const numValue = parseFloat(value) || 0;
    setLocalConfig((prev) => ({
      ...prev,
      [key]: Math.max(0, Math.min(1, numValue))
    }));
  };

  const handleToggle = (key) => {
    setLocalConfig((prev) => ({
      ...prev,
      [key]: !prev?.[key]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onConfigUpdate?.(localConfig);
    setSaving(false);
  };

  const totalWeight =
    (localConfig?.electionWeight || 0) + (localConfig?.postWeight || 0) + (localConfig?.adWeight || 0);
  const isWeightValid = Math.abs(totalWeight - 1.0) < 0.01;

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
          <Icon name="Settings" size={20} className="text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h2 className="text-lg font-heading font-bold text-foreground">Algorithm Controls</h2>
          <p className="text-sm text-muted-foreground">Fine-tune ranking parameters</p>
        </div>
      </div>

      {/* Algorithm Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">Algorithm Type</label>
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Icon name="Cpu" size={18} className="text-primary" />
            <span className="text-sm font-semibold text-foreground capitalize">
              {localConfig?.algorithmType || 'hybrid'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Combines collaborative filtering with content-based recommendations
          </p>
        </div>
      </div>

      {/* Content Weights */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-foreground">Content Type Weights</label>
          <span
            className={`text-xs font-semibold ${
              isWeightValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}
          >
            Total: {totalWeight?.toFixed(2)}
          </span>
        </div>

        <div className="space-y-3">
          {[
            { key: 'electionWeight', label: 'Elections', icon: 'Vote' },
            { key: 'postWeight', label: 'Posts', icon: 'FileText' },
            { key: 'adWeight', label: 'Ads', icon: 'Megaphone' }
          ]?.map((item) => (
            <div key={item?.key}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Icon name={item?.icon} size={16} className="text-muted-foreground" />
                  <span className="text-sm text-foreground">{item?.label}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={localConfig?.[item?.key] || 0}
                  onChange={(e) => handleWeightChange(item?.key, e?.target?.value)}
                  className="input w-20 text-center"
                />
              </div>
              <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-primary"
                  style={{ width: `${(localConfig?.[item?.key] || 0) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {!isWeightValid && (
          <div className="mt-2 flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
            <Icon name="AlertCircle" size={14} />
            <span>Weights must sum to 1.0</span>
          </div>
        )}
      </div>

      {/* Algorithm Features */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-3">Algorithm Features</label>
        <div className="space-y-3">
          {[
            {
              key: 'semanticMatchingEnabled',
              label: 'Semantic Matching',
              description: 'Use OpenAI embeddings for content similarity'
            },
            {
              key: 'collaborativeFilteringEnabled',
              label: 'Collaborative Filtering',
              description: 'Learn from similar user behaviors'
            }
          ]?.map((feature) => (
            <div
              key={feature?.key}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex-1">
                <div className="font-medium text-sm text-foreground">{feature?.label}</div>
                <div className="text-xs text-muted-foreground">{feature?.description}</div>
              </div>
              <button
                onClick={() => handleToggle(feature?.key)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  localConfig?.[feature?.key] ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    localConfig?.[feature?.key] ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Parameters */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-3">Advanced Parameters</label>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-foreground">Diversity Factor</span>
              <span className="text-sm text-muted-foreground">
                {localConfig?.diversityFactor?.toFixed(2) || '0.30'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={localConfig?.diversityFactor || 0.3}
              onChange={(e) => handleWeightChange('diversityFactor', e?.target?.value)}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-foreground">Personalization Strength</span>
              <span className="text-sm text-muted-foreground">
                {localConfig?.personalizationStrength?.toFixed(2) || '0.70'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={localConfig?.personalizationStrength || 0.7}
              onChange={(e) => handleWeightChange('personalizationStrength', e?.target?.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving || !isWeightValid}
        className="btn btn-primary w-full"
      >
        {saving ? (
          <>
            <Icon name="Loader" size={18} className="animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Icon name="Save" size={18} />
            Save Configuration
          </>
        )}
      </button>
    </div>
  );
};

export default AlgorithmControlsPanel;