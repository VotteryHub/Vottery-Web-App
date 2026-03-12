import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DistributionControlPanel = ({ settings, onUpdate }) => {
  const [electionPercentage, setElectionPercentage] = useState(50);
  const [socialMediaPercentage, setSocialMediaPercentage] = useState(50);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (settings) {
      setElectionPercentage(settings?.electionContentPercentage || 50);
      setSocialMediaPercentage(settings?.socialMediaPercentage || 50);
    }
  }, [settings]);

  const handleElectionChange = (value) => {
    const newElection = parseInt(value);
    const newSocial = 100 - newElection;
    setElectionPercentage(newElection);
    setSocialMediaPercentage(newSocial);
    setHasChanges(true);
  };

  const handleSocialMediaChange = (value) => {
    const newSocial = parseInt(value);
    const newElection = 100 - newSocial;
    setSocialMediaPercentage(newSocial);
    setElectionPercentage(newElection);
    setHasChanges(true);
  };

  const handleApply = () => {
    onUpdate?.(electionPercentage, socialMediaPercentage);
    setHasChanges(false);
  };

  const handleReset = () => {
    setElectionPercentage(settings?.electionContentPercentage || 50);
    setSocialMediaPercentage(settings?.socialMediaPercentage || 50);
    setHasChanges(false);
  };

  const presets = [
    { name: 'Balanced', election: 50, social: 50 },
    { name: 'Election Focus', election: 70, social: 30 },
    { name: 'Social Focus', election: 30, social: 70 },
    { name: 'Heavy Election', election: 85, social: 15 },
    { name: 'Heavy Social', election: 15, social: 85 }
  ];

  const applyPreset = (preset) => {
    setElectionPercentage(preset?.election);
    setSocialMediaPercentage(preset?.social);
    setHasChanges(true);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Distribution Control
          </h2>
          <p className="text-sm text-muted-foreground">
            Adjust content distribution percentages with real-time preview
          </p>
        </div>
        <Icon name="Sliders" size={24} className="text-primary" />
      </div>

      {/* Visual Distribution Preview */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-foreground">Current Distribution</span>
          {hasChanges && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
              Unsaved Changes
            </span>
          )}
        </div>
        <div className="flex h-12 rounded-lg overflow-hidden border border-border">
          <div
            className="bg-primary flex items-center justify-center text-white font-semibold transition-all duration-300"
            style={{ width: `${electionPercentage}%` }}
          >
            {electionPercentage > 15 && `${electionPercentage}%`}
          </div>
          <div
            className="bg-secondary flex items-center justify-center text-white font-semibold transition-all duration-300"
            style={{ width: `${socialMediaPercentage}%` }}
          >
            {socialMediaPercentage > 15 && `${socialMediaPercentage}%`}
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary" />
            <span className="text-xs text-muted-foreground">Election Content</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-secondary" />
            <span className="text-xs text-muted-foreground">Social Media Content</span>
          </div>
        </div>
      </div>

      {/* Election Content Slider */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Icon name="Vote" size={16} className="text-primary" />
            Election/Voting Content
          </label>
          <span className="text-2xl font-bold text-primary font-data">{electionPercentage}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={electionPercentage}
          onChange={(e) => handleElectionChange(e?.target?.value)}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">0%</span>
          <span className="text-xs text-muted-foreground">50%</span>
          <span className="text-xs text-muted-foreground">100%</span>
        </div>
      </div>

      {/* Social Media Content Slider */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Icon name="MessageCircle" size={16} className="text-secondary" />
            Social Media Content
          </label>
          <span className="text-2xl font-bold text-secondary font-data">{socialMediaPercentage}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={socialMediaPercentage}
          onChange={(e) => handleSocialMediaChange(e?.target?.value)}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-secondary"
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">0%</span>
          <span className="text-xs text-muted-foreground">50%</span>
          <span className="text-xs text-muted-foreground">100%</span>
        </div>
      </div>

      {/* Preset Templates */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-foreground mb-3">Quick Presets</h3>
        <div className="grid grid-cols-5 gap-2">
          {presets?.map((preset) => (
            <button
              key={preset?.name}
              onClick={() => applyPreset(preset)}
              className="p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 text-center"
            >
              <p className="text-xs font-medium text-foreground mb-1">{preset?.name}</p>
              <p className="text-xs text-muted-foreground">
                {preset?.election}/{preset?.social}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button
          variant="default"
          size="md"
          iconName="Check"
          onClick={handleApply}
          disabled={!hasChanges}
          fullWidth
        >
          Apply Changes
        </Button>
        <Button
          variant="outline"
          size="md"
          iconName="RotateCcw"
          onClick={handleReset}
          disabled={!hasChanges}
        >
          Reset
        </Button>
      </div>

      {/* Impact Preview */}
      <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-primary mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-foreground mb-1">Impact Preview</h4>
            <p className="text-xs text-muted-foreground">
              Changes will take effect immediately across all user feeds. The algorithm will automatically
              balance content distribution to match your target percentages while maintaining engagement quality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributionControlPanel;