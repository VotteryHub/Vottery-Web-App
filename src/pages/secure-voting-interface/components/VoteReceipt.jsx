import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VoteReceipt = ({ receipt, election }) => {
  const navigate = useNavigate();

  const handleVerifyVote = () => {
    navigate('/vote-verification-portal', { state: { voteId: receipt?.voteId } });
  };

  const handleViewAudit = () => {
    navigate('/blockchain-audit-portal', { state: { transactionHash: receipt?.blockchainHash } });
  };

  const handleBackToDashboard = () => {
    navigate('/elections-dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="bg-success/10 border-b border-success/20 p-6 md:p-8 text-center">
          <div className="w-20 h-20 bg-success text-success-foreground rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle" size={40} />
          </div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
            Vote Successfully Cast!
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Your vote has been encrypted, signed, and recorded on the blockchain
          </p>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Election</p>
                <p className="font-heading font-semibold text-foreground">{election?.title}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">Timestamp</p>
                <p className="font-data text-sm text-foreground">{receipt?.timestamp}</p>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Vote ID</p>
                <div className="flex items-center gap-2">
                  <code className="font-data text-sm text-foreground break-all">
                    {receipt?.voteId}
                  </code>
                  <button
                    onClick={() => navigator.clipboard?.writeText(receipt?.voteId)}
                    className="w-8 h-8 flex-shrink-0 rounded-lg hover:bg-muted flex items-center justify-center transition-all duration-250"
                  >
                    <Icon name="Copy" size={16} />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Blockchain Transaction Hash</p>
                <div className="flex items-center gap-2">
                  <code className="font-data text-sm text-foreground break-all">
                    {receipt?.blockchainHash}
                  </code>
                  <button
                    onClick={() => navigator.clipboard?.writeText(receipt?.blockchainHash)}
                    className="w-8 h-8 flex-shrink-0 rounded-lg hover:bg-muted flex items-center justify-center transition-all duration-250"
                  >
                    <Icon name="Copy" size={16} />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Vote Hash (SHA-256)</p>
                <code className="font-data text-sm text-foreground break-all block">
                  {receipt?.voteHash}
                </code>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary/10 rounded-lg p-4 text-center">
                <Icon name="Lock" size={24} color="var(--color-primary)" className="mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">Encryption</p>
                <p className="font-data font-semibold text-foreground">RSA-2048</p>
              </div>

              <div className="bg-secondary/10 rounded-lg p-4 text-center">
                <Icon name="FileSignature" size={24} color="var(--color-secondary)" className="mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">Signature</p>
                <p className="font-data font-semibold text-foreground">Verified</p>
              </div>

              <div className="bg-success/10 rounded-lg p-4 text-center">
                <Icon name="Database" size={24} color="var(--color-success)" className="mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">Blockchain</p>
                <p className="font-data font-semibold text-foreground">Confirmed</p>
              </div>
            </div>
          </div>

          {election?.isLotterized && (
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Icon name="Trophy" size={24} color="var(--color-accent)" />
                <div>
                  <h3 className="font-heading font-semibold text-foreground mb-1">
                    Lottery Entry Confirmed
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Your vote has automatically entered you into the lottery draw for a chance to win from the prize pool of {election?.prizePool}.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Lottery Ticket ID:</span>
                      <code className="font-data text-xs text-foreground bg-muted px-2 py-1 rounded">{receipt?.lotteryTicketId}</code>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Voter ID:</span>
                      <code className="font-data text-xs text-foreground bg-muted px-2 py-1 rounded">{receipt?.voteId}</code>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-accent/20">
                    <p className="text-xs text-muted-foreground mb-2">
                      <Icon name="Info" size={12} className="inline mr-1" />
                      Winners will be notified automatically via platform messaging
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <Icon name="Users" size={12} className="text-accent" />
                      <span className="text-muted-foreground">Total Winners:</span>
                      <span className="font-semibold text-foreground">{election?.numberOfWinners}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon name="AlertCircle" size={20} color="var(--color-warning)" />
              <div>
                <p className="text-sm text-foreground font-medium mb-1">
                  Important: Save Your Vote ID
                </p>
                <p className="text-xs text-muted-foreground">
                  Keep your Vote ID safe. You'll need it to verify your vote on the blockchain and ensure it was counted correctly.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="default"
              fullWidth
              iconName="ShieldCheck"
              iconPosition="left"
              onClick={handleVerifyVote}
            >
              Verify My Vote
            </Button>
            <Button
              variant="outline"
              fullWidth
              iconName="FileSearch"
              iconPosition="left"
              onClick={handleViewAudit}
            >
              View Blockchain Audit
            </Button>
          </div>

          <Button
            variant="ghost"
            fullWidth
            iconName="ArrowLeft"
            iconPosition="left"
            onClick={handleBackToDashboard}
          >
            Back to Elections Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VoteReceipt;