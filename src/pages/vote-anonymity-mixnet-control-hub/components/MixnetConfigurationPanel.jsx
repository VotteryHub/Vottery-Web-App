import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { mixnetService } from '../../../services/mixnetService';

const MixnetConfigurationPanel = ({ nodes }) => {
  const [config, setConfig] = useState(null);
  const [updating, setUpdating] = useState(false);

  React.useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const { data } = mixnetService?.getMixingConfig();
    setConfig(data);
  };

  const handleUpdateConfig = async () => {
    setUpdating(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await mixnetService?.updateMixingConfig(config);
    setUpdating(false);
    alert('Configuration updated successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Node Status */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Server" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Distributed Mixing Nodes</h3>
            <p className="text-sm text-muted-foreground">Global mixnet infrastructure status</p>
          </div>
        </div>

        <div className="space-y-3">
          {nodes?.map((node) => (
            <div key={node?.id} className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    node?.status === 'active' ? 'bg-success' : 'bg-muted-foreground'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{node?.id}</p>
                    <p className="text-xs text-muted-foreground">{node?.location}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  node?.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                }`}>
                  {node?.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Throughput</p>
                  <p className="text-sm font-medium text-foreground">{node?.throughput}/s</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Uptime</p>
                  <p className="text-sm font-medium text-foreground">{node?.uptime}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mixing Configuration */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Settings" size={20} color="var(--color-secondary)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Mixing Parameters</h3>
            <p className="text-sm text-muted-foreground">Configure anonymization protocols</p>
          </div>
        </div>

        {config && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Minimum Anonymity Set</label>
              <input
                type="number"
                value={config?.minAnonymitySet}
                onChange={(e) => setConfig({ ...config, minAnonymitySet: parseInt(e?.target?.value) })}
                className="w-full px-4 py-2 bg-muted/30 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Mixing Layers</label>
              <input
                type="number"
                value={config?.mixingLayers}
                onChange={(e) => setConfig({ ...config, mixingLayers: parseInt(e?.target?.value) })}
                className="w-full px-4 py-2 bg-muted/30 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Re-encryption Rounds</label>
              <input
                type="number"
                value={config?.reencryptionRounds}
                onChange={(e) => setConfig({ ...config, reencryptionRounds: parseInt(e?.target?.value) })}
                className="w-full px-4 py-2 bg-muted/30 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config?.nodeFailoverEnabled}
                onChange={(e) => setConfig({ ...config, nodeFailoverEnabled: e?.target?.checked })}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <label className="text-sm text-foreground">Enable Node Failover</label>
            </div>

            <Button onClick={handleUpdateConfig} disabled={updating} iconName="Save">
              {updating ? 'Updating...' : 'Update Configuration'}
            </Button>
          </div>
        )}
      </div>

      {/* Shuffle Protocol */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Shuffle" size={20} color="var(--color-accent)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Shuffle Protocol</h3>
            <p className="text-sm text-muted-foreground">Cryptographic vote shuffling algorithm</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground">Algorithm</span>
              <span className="text-sm font-medium text-foreground">{config?.shuffleAlgorithm}</span>
            </div>
          </div>
          <div className="p-3 bg-success/10 rounded-lg">
            <div className="flex items-center gap-2">
              <Icon name="Check" size={16} className="text-success" />
              <span className="text-sm text-foreground">Verifiable shuffle with zero-knowledge proofs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MixnetConfigurationPanel;