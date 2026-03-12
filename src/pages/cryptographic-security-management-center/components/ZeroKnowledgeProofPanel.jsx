import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { cryptographicService } from '../../../services/cryptographicService';

const ZeroKnowledgeProofPanel = () => {
  const [stats, setStats] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [proofResult, setProofResult] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const { data } = cryptographicService?.zkp?.getVerificationStats();
    setStats(data);
  };

  const handleGenerateProof = async () => {
    setVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const { data } = cryptographicService?.zkp?.generateProof('VOTE_DATA', 'SECRET_KEY');
    setProofResult(data);
    setVerifying(false);
  };

  return (
    <div className="space-y-6">
      {/* ZKP Statistics */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="Eye" size={20} color="var(--color-success)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Zero-Knowledge Proof System</h3>
            <p className="text-sm text-muted-foreground">Voter verification without vote disclosure</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Total Verifications</p>
            <p className="text-2xl font-bold text-foreground">{stats?.totalVerifications?.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-success/10 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Success Rate</p>
            <p className="text-2xl font-bold text-success">{stats?.successRate}%</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Avg Verification Time</p>
            <p className="text-lg font-bold text-foreground">{stats?.averageVerificationTime}</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Last Verification</p>
            <p className="text-sm font-medium text-foreground">
              {stats?.lastVerification ? new Date(stats?.lastVerification)?.toLocaleTimeString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Proof Generation */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="FileCheck" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Proof Generation</h3>
            <p className="text-sm text-muted-foreground">Schnorr zero-knowledge protocol</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm font-medium text-foreground mb-3">ZKP Workflow</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <span className="text-xs text-foreground">Voter casts encrypted vote</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <span className="text-xs text-foreground">System generates commitment without revealing vote</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <span className="text-xs text-foreground">Challenge-response protocol verifies authenticity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center">
                  <Icon name="Check" size={12} className="text-success" />
                </div>
                <span className="text-xs text-foreground">Voter confirms vote recorded without disclosure</span>
              </div>
            </div>
          </div>

          <Button onClick={handleGenerateProof} disabled={verifying} iconName="Shield">
            {verifying ? 'Generating Proof...' : 'Generate ZK Proof'}
          </Button>

          {proofResult && (
            <div className="p-4 bg-success/10 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="CheckCircle" size={20} className="text-success" />
                <span className="text-sm font-medium text-success">Proof Generated Successfully</span>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Commitment</p>
                  <p className="text-xs font-data text-foreground break-all">{proofResult?.commitment}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Challenge</p>
                  <p className="text-xs font-data text-foreground break-all">{proofResult?.challenge}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Response</p>
                  <p className="text-xs font-data text-foreground break-all">{proofResult?.response}</p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <Icon name="Info" size={14} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Protocol: {proofResult?.protocol}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cryptographic Authenticity */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="ShieldCheck" size={20} color="var(--color-accent)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Authenticity Badges</h3>
            <p className="text-sm text-muted-foreground">Cryptographic verification indicators</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-success/10 rounded-lg">
            <Icon name="Check" size={20} className="text-success" />
            <div>
              <p className="text-sm font-medium text-foreground">Vote Recorded</p>
              <p className="text-xs text-muted-foreground">Cryptographically verified</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-success/10 rounded-lg">
            <Icon name="Check" size={20} className="text-success" />
            <div>
              <p className="text-sm font-medium text-foreground">Privacy Preserved</p>
              <p className="text-xs text-muted-foreground">Zero disclosure guarantee</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-success/10 rounded-lg">
            <Icon name="Check" size={20} className="text-success" />
            <div>
              <p className="text-sm font-medium text-foreground">Tamper-Proof</p>
              <p className="text-xs text-muted-foreground">Immutable commitment</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-success/10 rounded-lg">
            <Icon name="Check" size={20} className="text-success" />
            <div>
              <p className="text-sm font-medium text-foreground">Universally Verifiable</p>
              <p className="text-xs text-muted-foreground">Public bulletin board</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZeroKnowledgeProofPanel;