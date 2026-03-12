import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ThresholdManagementPanel = ({ campaigns, onRefresh }) => {
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [thresholds, setThresholds] = useState({
    warning: 75,
    critical: 90,
    pause: 95
  });

  const handleSaveThresholds = (campaignId) => {
    // Save threshold configuration
    console.log('Saving thresholds for campaign:', campaignId, thresholds);
    setEditingCampaign(null);
    onRefresh?.();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon name="Sliders" className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Threshold Management</h2>
          <p className="text-sm text-muted-foreground">Adjust alert thresholds and automated responses</p>
        </div>
      </div>
      <div className="space-y-4">
        {campaigns?.slice(0, 3)?.map((campaign) => (
          <div
            key={campaign?.id}
            className="bg-background border border-border rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-foreground">{campaign?.name}</h4>
              <Button
                onClick={() => setEditingCampaign(editingCampaign === campaign?.id ? null : campaign?.id)}
                size="sm"
                variant="outline"
              >
                <Icon name="Settings" className="w-3 h-3 mr-1" />
                {editingCampaign === campaign?.id ? 'Cancel' : 'Configure'}
              </Button>
            </div>

            {editingCampaign === campaign?.id ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Warning Threshold (%)</label>
                  <Input
                    type="number"
                    value={thresholds?.warning}
                    onChange={(e) => setThresholds({ ...thresholds, warning: parseInt(e?.target?.value) })}
                    min="50"
                    max="100"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Critical Threshold (%)</label>
                  <Input
                    type="number"
                    value={thresholds?.critical}
                    onChange={(e) => setThresholds({ ...thresholds, critical: parseInt(e?.target?.value) })}
                    min="50"
                    max="100"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Auto-Pause Threshold (%)</label>
                  <Input
                    type="number"
                    value={thresholds?.pause}
                    onChange={(e) => setThresholds({ ...thresholds, pause: parseInt(e?.target?.value) })}
                    min="50"
                    max="100"
                  />
                </div>
                <Button
                  onClick={() => handleSaveThresholds(campaign?.id)}
                  className="w-full"
                >
                  Save Configuration
                </Button>
              </div>
            ) : (
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Warning: 75% | Critical: 90% | Auto-Pause: 95%</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThresholdManagementPanel;