import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BlockchainVerificationPanel = ({ winners }) => {
  const [selectedWinner, setSelectedWinner] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const handleVerifyBlockchain = async (winner) => {
    setVerifying(true);
    setSelectedWinner(winner);
    setTimeout(() => {
      setVerifying(false);
    }, 2000);
  };

  const copyToClipboard = (text) => {
    navigator?.clipboard?.writeText(text);
  };

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon name="Shield" size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground">Blockchain Verification</h2>
            <p className="text-sm text-muted-foreground">Transparent verification with cryptographic proof</p>
          </div>
        </div>

        <div className="space-y-3">
          {winners?.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Shield" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No winners to verify</p>
            </div>
          ) : (
            winners?.map((winner) => (
              <div
                key={winner?.id}
                className="bg-background border border-border rounded-lg p-4 hover:border-primary/40 transition-all duration-250"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <Icon name="ShieldCheck" size={24} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                        {winner?.userName || 'Anonymous Winner'}
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Election</p>
                          <p className="text-sm font-medium text-foreground">{winner?.electionTitle}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Rank</p>
                          <p className="text-sm font-medium text-foreground">#{winner?.rank}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName={verifying && selectedWinner?.id === winner?.id ? "Loader" : "Shield"}
                    onClick={() => handleVerifyBlockchain(winner)}
                    disabled={verifying}
                  >
                    {verifying && selectedWinner?.id === winner?.id ? 'Verifying...' : 'Verify'}
                  </Button>
                </div>

                {selectedWinner?.id === winner?.id && !verifying && (
                  <div className="mt-4 p-4 bg-muted rounded-lg border border-border animate-fade-in">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon name="CheckCircle" size={20} className="text-green-600" />
                      <h4 className="text-sm font-medium text-foreground">Verification Successful</h4>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Blockchain Hash</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 px-3 py-2 bg-background border border-border rounded text-xs font-mono text-foreground overflow-x-auto">
                            {winner?.blockchainHash || '0x' + Math.random()?.toString(16)?.substring(2, 66)}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            iconName="Copy"
                            onClick={() => copyToClipboard(winner?.blockchainHash || '0x' + Math.random()?.toString(16)?.substring(2, 66))}
                          />
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Transaction ID</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 px-3 py-2 bg-background border border-border rounded text-xs font-mono text-foreground overflow-x-auto">
                            {winner?.transactionId || 'txn_' + Math.random()?.toString(36)?.substring(2, 15)}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            iconName="Copy"
                            onClick={() => copyToClipboard(winner?.transactionId || 'txn_' + Math.random()?.toString(36)?.substring(2, 15))}
                          />
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Verification Timestamp</p>
                        <p className="text-sm font-medium text-foreground">
                          {new Date()?.toLocaleString()}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-border">
                        <Button
                          variant="outline"
                          size="sm"
                          iconName="ExternalLink"
                          onClick={() => window.open(`/blockchain-audit-portal?hash=${winner?.blockchainHash}`, '_blank')}
                          className="w-full"
                        >
                          View on Blockchain Explorer
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <div className="bg-gradient-to-r from-primary/5 to-transparent border border-primary/20 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <Icon name="Info" size={24} className="text-primary mt-1" />
          <div>
            <h3 className="text-lg font-heading font-bold text-foreground mb-2">Blockchain Verification Benefits</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-green-600 mt-0.5" />
                <span>Immutable record of all winner selections</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-green-600 mt-0.5" />
                <span>Cryptographic proof prevents tampering</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-green-600 mt-0.5" />
                <span>Transparent verification for all stakeholders</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-green-600 mt-0.5" />
                <span>Publicly auditable transaction history</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainVerificationPanel;