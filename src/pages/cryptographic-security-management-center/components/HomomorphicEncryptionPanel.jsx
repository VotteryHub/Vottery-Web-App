import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { cryptographicService } from '../../../services/cryptographicService';

const HomomorphicEncryptionPanel = () => {
  const [status, setStatus] = useState(null);
  const [tallying, setTallying] = useState(false);
  const [tallyResult, setTallyResult] = useState(null);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    const { data } = cryptographicService?.elgamal?.getStatus();
    setStatus(data);
  };

  const handleTallyVotes = async () => {
    setTallying(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockResult = {
      totalVotes: 1547,
      tallyCompleted: true,
      privacyPreserved: true,
      timestamp: new Date()?.toISOString()
    };
    
    setTallyResult(mockResult);
    setTallying(false);
  };

  return (
    <div className="space-y-6">
      {/* ElGamal Status */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Shield" size={20} color="var(--color-secondary)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">ElGamal Homomorphic Encryption</h3>
            <p className="text-sm text-muted-foreground">Privacy-preserving vote tallying</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-success/10 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Readiness</p>
            <p className="text-lg font-bold text-success capitalize">{status?.readiness}</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Encrypted Votes</p>
            <p className="text-2xl font-bold text-foreground">{status?.encryptedVotes?.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Tally Operations</p>
            <p className="text-2xl font-bold text-foreground">{status?.tallyOperations}</p>
          </div>
          <div className="p-4 bg-success/10 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Privacy Guarantee</p>
            <p className="text-2xl font-bold text-success">{status?.privacyGuarantee}</p>
          </div>
        </div>
      </div>

      {/* Encrypted Vote Tallying */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Calculator" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Encrypted Vote Tallying</h3>
            <p className="text-sm text-muted-foreground">Homomorphic addition without decryption</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">Tally Process</span>
              <span className="text-xs text-muted-foreground">ElGamal-ECC</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon name="Check" size={14} className="text-success" />
                <span className="text-xs text-foreground">Votes remain encrypted during tallying</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Check" size={14} className="text-success" />
                <span className="text-xs text-foreground">Homomorphic addition preserves privacy</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Check" size={14} className="text-success" />
                <span className="text-xs text-foreground">Mathematical proof verification enabled</span>
              </div>
            </div>
          </div>

          <Button onClick={handleTallyVotes} disabled={tallying} iconName="Play">
            {tallying ? 'Tallying Encrypted Votes...' : 'Start Encrypted Tally'}
          </Button>

          {tallyResult && (
            <div className="p-4 bg-success/10 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="CheckCircle" size={20} className="text-success" />
                <span className="text-sm font-medium text-success">Tally Completed Successfully</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Total Votes Tallied</span>
                  <span className="text-xs font-medium text-foreground">{tallyResult?.totalVotes?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Privacy Preserved</span>
                  <span className="text-xs font-medium text-success">Yes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Completed At</span>
                  <span className="text-xs font-medium text-foreground">
                    {new Date(tallyResult?.timestamp)?.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Privacy Metrics */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Eye" size={20} color="var(--color-accent)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Privacy-Preserving Computation</h3>
            <p className="text-sm text-muted-foreground">Zero individual vote disclosure</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">Encryption Curve</p>
            <p className="text-sm font-medium text-foreground">secp256k1</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">Key Length</p>
            <p className="text-sm font-medium text-foreground">256 bits</p>
          </div>
          <div className="p-4 bg-success/10 rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">Privacy Level</p>
            <p className="text-sm font-medium text-success">Maximum</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomomorphicEncryptionPanel;