import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { mixnetService } from '../../../services/mixnetService';

const VoteAnonymizationPanel = () => {
  const [anonymizing, setAnonymizing] = useState(false);
  const [anonymizationResult, setAnonymizationResult] = useState(null);
  const [testVote, setTestVote] = useState('');

  const handleAnonymizeVote = async () => {
    if (!testVote) return;
    
    setAnonymizing(true);
    const { data } = await mixnetService?.anonymizeVote(testVote);
    setAnonymizationResult(data);
    setAnonymizing(false);
  };

  return (
    <div className="space-y-6">
      {/* Real-time Ballot Processing */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Shuffle" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Vote Anonymization</h3>
            <p className="text-sm text-muted-foreground">Real-time ballot processing through mixing layers</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Test Vote (Encrypted)</label>
            <input
              type="text"
              value={testVote}
              onChange={(e) => setTestVote(e?.target?.value)}
              placeholder="Enter encrypted vote data..."
              className="w-full px-4 py-2 bg-muted/30 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <Button onClick={handleAnonymizeVote} disabled={!testVote || anonymizing} iconName="Shuffle">
            {anonymizing ? 'Anonymizing...' : 'Anonymize Vote'}
          </Button>

          {anonymizationResult && (
            <div className="p-4 bg-success/10 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="CheckCircle" size={20} className="text-success" />
                <span className="text-sm font-medium text-success">Vote Anonymized Successfully</span>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Original Hash (First 16 chars)</p>
                  <p className="text-xs font-data text-foreground">{anonymizationResult?.originalHash}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Anonymized Vote</p>
                  <p className="text-xs font-data text-foreground break-all">{anonymizationResult?.anonymizedVote}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Shuffle Proof</p>
                  <p className="text-xs font-data text-foreground break-all">{anonymizationResult?.shuffleProof}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Anonymity Set ID</p>
                    <p className="text-xs font-medium text-foreground">{anonymizationResult?.anonymitySetId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Mixing Layers</p>
                    <p className="text-xs font-medium text-foreground">{anonymizationResult?.mixingLayers}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cryptographic Shuffling */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Repeat" size={20} color="var(--color-secondary)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Cryptographic Shuffling</h3>
            <p className="text-sm text-muted-foreground">Multi-layer mixing operations</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-primary">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Initial Encryption</p>
                <p className="text-xs text-muted-foreground">Vote encrypted with election public key</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-primary">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Mixnet Entry</p>
                <p className="text-xs text-muted-foreground">Vote enters distributed mixing network</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-primary">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Re-encryption Cascade</p>
                <p className="text-xs text-muted-foreground">Multiple re-encryption layers break linkability</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-success/10 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                <Icon name="Check" size={14} className="text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Anonymized Output</p>
                <p className="text-xs text-muted-foreground">Vote completely unlinkable from voter identity</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unlinkability Verification */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="ShieldCheck" size={20} color="var(--color-accent)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Unlinkability Verification</h3>
            <p className="text-sm text-muted-foreground">Zero-knowledge proof integration</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-success/10 rounded-lg">
            <Icon name="Check" size={20} className="text-success" />
            <div>
              <p className="text-sm font-medium text-foreground">Vote-Voter Separation</p>
              <p className="text-xs text-muted-foreground">Cryptographically guaranteed</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-success/10 rounded-lg">
            <Icon name="Check" size={20} className="text-success" />
            <div>
              <p className="text-sm font-medium text-foreground">Verifiable Shuffle</p>
              <p className="text-xs text-muted-foreground">ZK proofs included</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-success/10 rounded-lg">
            <Icon name="Check" size={20} className="text-success" />
            <div>
              <p className="text-sm font-medium text-foreground">Traffic Analysis Resistant</p>
              <p className="text-xs text-muted-foreground">Timing obfuscation</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-success/10 rounded-lg">
            <Icon name="Check" size={20} className="text-success" />
            <div>
              <p className="text-sm font-medium text-foreground">Democratic Transparency</p>
              <p className="text-xs text-muted-foreground">Verifiable without privacy loss</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoteAnonymizationPanel;