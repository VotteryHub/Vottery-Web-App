import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { cryptographicService } from '../../../services/cryptographicService';

const ThresholdCryptographyPanel = () => {
  const [trusteeStatus, setTrusteeStatus] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [shares, setShares] = useState(null);

  useEffect(() => {
    loadTrusteeStatus();
  }, []);

  const loadTrusteeStatus = async () => {
    const { data } = cryptographicService?.threshold?.getTrusteeStatus();
    setTrusteeStatus(data);
  };

  const handleGenerateShares = async () => {
    setGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const { data } = cryptographicService?.threshold?.generateShares('MASTER_SECRET', 3, 5);
    setShares(data);
    setGenerating(false);
  };

  return (
    <div className="space-y-6">
      {/* Trustee Status */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Users" size={20} color="var(--color-accent)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Threshold Cryptography</h3>
            <p className="text-sm text-muted-foreground">Distributed key management with multiple trustees</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Active Trustees</p>
            <p className="text-2xl font-bold text-foreground">{trusteeStatus?.activeTrustees}</p>
          </div>
          <div className="p-4 bg-primary/10 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Threshold Required</p>
            <p className="text-2xl font-bold text-primary">{trusteeStatus?.threshold}</p>
          </div>
          <div className="p-4 bg-success/10 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Consensus Status</p>
            <p className="text-sm font-medium text-success">
              {trusteeStatus?.consensusReached ? 'Reached' : 'Pending'}
            </p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Last Coordination</p>
            <p className="text-sm font-medium text-foreground">
              {trusteeStatus?.lastCoordination ? new Date(trusteeStatus?.lastCoordination)?.toLocaleTimeString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Secret Sharing */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Key" size={20} color="var(--color-secondary)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Secret Sharing Protocol</h3>
            <p className="text-sm text-muted-foreground">Shamir's Secret Sharing implementation</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm font-medium text-foreground mb-3">Threshold Configuration</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Total Trustees</span>
                <span className="text-xs font-medium text-foreground">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Threshold (Minimum Required)</span>
                <span className="text-xs font-medium text-primary">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Scheme</span>
                <span className="text-xs font-medium text-foreground">(3, 5) Threshold</span>
              </div>
            </div>
          </div>

          <Button onClick={handleGenerateShares} disabled={generating} iconName="Share2">
            {generating ? 'Generating Shares...' : 'Generate Secret Shares'}
          </Button>

          {shares && (
            <div className="p-4 bg-success/10 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="CheckCircle" size={20} className="text-success" />
                <span className="text-sm font-medium text-success">Secret Shares Generated</span>
              </div>
              <div className="space-y-2">
                {shares?.shares?.map((share, index) => (
                  <div key={index} className="p-3 bg-card rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-foreground">Trustee {share?.trusteeId}</span>
                      <span className="text-xs text-muted-foreground">Share {index + 1}/{shares?.totalTrustees}</span>
                    </div>
                    <p className="text-xs font-data text-muted-foreground break-all">{share?.share}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                <Icon name="Info" size={14} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Algorithm: {shares?.algorithm}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trustee Coordination */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Network" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Trustee Coordination</h3>
            <p className="text-sm text-muted-foreground">Distributed consensus mechanism</p>
          </div>
        </div>

        <div className="space-y-3">
          {[1, 2, 3, 4, 5]?.map((trusteeId) => (
            <div key={trusteeId} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <Icon name="User" size={14} color="var(--color-primary)" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Trustee {trusteeId}</p>
                  <p className="text-xs text-muted-foreground">Share holder</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  trusteeId <= trusteeStatus?.activeTrustees ? 'bg-success' : 'bg-muted-foreground'
                }`} />
                <span className="text-xs text-muted-foreground">
                  {trusteeId <= trusteeStatus?.activeTrustees ? 'Active' : 'Standby'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThresholdCryptographyPanel;