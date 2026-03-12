import React from 'react';
import Icon from '../../../components/AppIcon';

const PrivacyMetricsPanel = ({ metrics }) => {
  return (
    <div className="space-y-6">
      {/* Privacy Statistics */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="Eye" size={20} color="var(--color-success)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Privacy Metrics</h3>
            <p className="text-sm text-muted-foreground">Anonymity effectiveness measurements</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Anonymity Set Size</p>
            <p className="text-2xl font-bold text-foreground">{metrics?.anonymitySetSize?.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-success/10 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Mixing Effectiveness</p>
            <p className="text-2xl font-bold text-success">{metrics?.mixingEffectiveness}%</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">De-anonymization Resistance</p>
            <p className="text-lg font-bold text-foreground">{metrics?.deAnonymizationResistance}</p>
          </div>
          <div className="p-4 bg-success/10 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Unlinkability Score</p>
            <p className="text-2xl font-bold text-success">{metrics?.unlinkabilityScore}%</p>
          </div>
        </div>
      </div>

      {/* Statistical Privacy Guarantees */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="BarChart" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Statistical Privacy Guarantees</h3>
            <p className="text-sm text-muted-foreground">Mathematical privacy assurances</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">Differential Privacy</span>
              <span className="text-sm font-medium text-success">ε = 0.1</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-success h-2 rounded-full" style={{ width: '95%' }} />
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">K-Anonymity</span>
              <span className="text-sm font-medium text-success">k = 1000</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-success h-2 rounded-full" style={{ width: '98%' }} />
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">L-Diversity</span>
              <span className="text-sm font-medium text-success">l = 50</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-success h-2 rounded-full" style={{ width: '92%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Anonymity Set Analysis */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Users" size={20} color="var(--color-secondary)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Anonymity Set Analysis</h3>
            <p className="text-sm text-muted-foreground">Voter indistinguishability metrics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">Current Set Size</p>
            <p className="text-2xl font-bold text-foreground">{metrics?.anonymitySetSize?.toLocaleString()}</p>
            <p className="text-xs text-success mt-2">Optimal for privacy</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">Minimum Threshold</p>
            <p className="text-2xl font-bold text-foreground">100</p>
            <p className="text-xs text-muted-foreground mt-2">Required for mixing</p>
          </div>
          <div className="p-4 bg-success/10 rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">Privacy Level</p>
            <p className="text-2xl font-bold text-success">Maximum</p>
            <p className="text-xs text-success mt-2">Threshold exceeded</p>
          </div>
        </div>
      </div>

      {/* De-anonymization Resistance */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Shield" size={20} color="var(--color-accent)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">De-anonymization Resistance</h3>
            <p className="text-sm text-muted-foreground">Attack resistance measurements</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-success/10 rounded-lg">
            <Icon name="Check" size={20} className="text-success" />
            <div>
              <p className="text-sm font-medium text-foreground">Timing Attack Resistant</p>
              <p className="text-xs text-muted-foreground">Obfuscated processing times</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-success/10 rounded-lg">
            <Icon name="Check" size={20} className="text-success" />
            <div>
              <p className="text-sm font-medium text-foreground">Traffic Analysis Resistant</p>
              <p className="text-xs text-muted-foreground">Encrypted communication channels</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-success/10 rounded-lg">
            <Icon name="Check" size={20} className="text-success" />
            <div>
              <p className="text-sm font-medium text-foreground">Correlation Attack Resistant</p>
              <p className="text-xs text-muted-foreground">Multi-layer shuffling</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-success/10 rounded-lg">
            <Icon name="Check" size={20} className="text-success" />
            <div>
              <p className="text-sm font-medium text-foreground">Sybil Attack Resistant</p>
              <p className="text-xs text-muted-foreground">Identity verification required</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyMetricsPanel;