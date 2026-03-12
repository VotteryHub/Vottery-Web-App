import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AdvancedParametersPanel = () => {
  const [parameters, setParameters] = useState({
    diversityWeight: 15,
    freshnessWeight: 10,
    personalizedWeight: 75,
    explorationRate: 20,
    confidenceThreshold: 70,
    abTestingEnabled: true,
    learningRate: 'Medium'
  });

  const handleParameterChange = (param, value) => {
    setParameters(prev => ({ ...prev, [param]: value }));
  };

  const handleSave = () => {
    console.log('Saving parameters:', parameters);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
            Advanced Recommendation Parameters
          </h2>
          <p className="text-sm text-muted-foreground">
            Fine-tune Claude AI's recommendation engine for optimal performance
          </p>
        </div>
        <Button onClick={handleSave}>
          <Icon name="Save" size={16} />
          Save Changes
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Content Mix Parameters</h3>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">Diversity Weight</label>
              <span className="text-sm font-bold text-primary">{parameters?.diversityWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={parameters?.diversityWeight}
              onChange={(e) => handleParameterChange('diversityWeight', parseInt(e?.target?.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-muted-foreground mt-1">Higher values increase content variety</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">Freshness Weight</label>
              <span className="text-sm font-bold text-primary">{parameters?.freshnessWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={parameters?.freshnessWeight}
              onChange={(e) => handleParameterChange('freshnessWeight', parseInt(e?.target?.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-muted-foreground mt-1">Higher values prioritize recent content</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">Personalization Weight</label>
              <span className="text-sm font-bold text-primary">{parameters?.personalizedWeight}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              value={parameters?.personalizedWeight}
              onChange={(e) => handleParameterChange('personalizedWeight', parseInt(e?.target?.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-muted-foreground mt-1">Higher values increase personalization depth</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Learning & Optimization</h3>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">Exploration Rate</label>
              <span className="text-sm font-bold text-primary">{parameters?.explorationRate}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={parameters?.explorationRate}
              onChange={(e) => handleParameterChange('explorationRate', parseInt(e?.target?.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-muted-foreground mt-1">Percentage of recommendations for discovering new interests</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">Confidence Threshold</label>
              <span className="text-sm font-bold text-primary">{parameters?.confidenceThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={parameters?.confidenceThreshold}
              onChange={(e) => handleParameterChange('confidenceThreshold', parseInt(e?.target?.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-muted-foreground mt-1">Minimum confidence score for recommendations</p>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Learning Rate</label>
            <select
              value={parameters?.learningRate}
              onChange={(e) => handleParameterChange('learningRate', e?.target?.value)}
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Low">Low - Stable, slower adaptation</option>
              <option value="Medium">Medium - Balanced approach</option>
              <option value="High">High - Fast adaptation, more volatile</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1">How quickly the model adapts to preference changes</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Experimental Features</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium text-foreground">A/B Testing</p>
              <p className="text-xs text-muted-foreground mt-1">Test different ranking algorithms automatically</p>
            </div>
            <button
              onClick={() => handleParameterChange('abTestingEnabled', !parameters?.abTestingEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                parameters?.abTestingEnabled ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  parameters?.abTestingEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-warning/10 rounded-xl border border-warning/20 p-6">
        <div className="flex items-start gap-3">
          <Icon name="AlertTriangle" size={20} className="text-warning mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Parameter Tuning Notice</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Adjusting these parameters will affect your recommendation quality. Changes take effect immediately 
              and may require 24-48 hours for the model to fully adapt. We recommend making small adjustments 
              and monitoring performance before making further changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedParametersPanel;