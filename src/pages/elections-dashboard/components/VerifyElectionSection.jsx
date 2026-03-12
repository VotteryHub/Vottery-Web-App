import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const VerifyElectionSection = () => {
  const [voteId, setVoteId] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const recentVerifications = [
    {
      id: 1,
      voteId: "VT-2026-0122-8A4F",
      electionTitle: "Community Budget Allocation 2026",
      timestamp: "Jan 22, 2026 03:45 PM",
      status: "verified",
      blockchainHash: "0x7d8f9a2b3c4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a"
    },
    {
      id: 2,
      voteId: "VT-2026-0121-3B9E",
      electionTitle: "Best Local Restaurant Award",
      timestamp: "Jan 21, 2026 11:20 AM",
      status: "verified",
      blockchainHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b"
    },
    {
      id: 3,
      voteId: "VT-2026-0120-7C2D",
      electionTitle: "School Board Election District 5",
      timestamp: "Jan 20, 2026 09:15 AM",
      status: "verified",
      blockchainHash: "0x9f0e1d2c3b4a5968778695a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4"
    }
  ];

  const handleVerify = () => {
    if (!voteId?.trim()) return;

    setIsVerifying(true);
    setTimeout(() => {
      setVerificationResult({
        voteId: voteId,
        status: 'verified',
        electionTitle: 'Community Budget Allocation 2026',
        timestamp: 'Jan 22, 2026 03:45 PM',
        blockchainHash: '0x7d8f9a2b3c4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a',
        voterHash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
        encryptionMethod: 'RSA-2048',
        signatureValid: true,
        blockNumber: 15847392,
        confirmations: 1247
      });
      setIsVerifying(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
          Verify Your Vote
        </h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Enter your vote ID to verify it on the blockchain
        </p>
      </div>
      <div className="card p-6 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Input
              label="Vote ID"
              type="text"
              placeholder="Enter your vote ID (e.g., VT-2026-0122-8A4F)"
              value={voteId}
              onChange={(e) => setVoteId(e?.target?.value)}
              description="You received this ID after casting your vote"
            />
          </div>
          <Button
            variant="default"
            size="lg"
            fullWidth
            loading={isVerifying}
            iconName="ShieldCheck"
            iconPosition="left"
            onClick={handleVerify}
            disabled={!voteId?.trim()}
          >
            {isVerifying ? 'Verifying...' : 'Verify Vote'}
          </Button>
        </div>
      </div>
      {verificationResult && (
        <div className="card p-6 md:p-8 border-2 border-success">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
              <Icon name="CheckCircle" size={28} color="var(--color-success)" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-2">
                Vote Verified Successfully
              </h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Your vote has been confirmed on the blockchain
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Vote ID</p>
                <p className="text-sm font-data font-medium text-foreground">{verificationResult?.voteId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Election</p>
                <p className="text-sm font-medium text-foreground">{verificationResult?.electionTitle}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Timestamp</p>
                <p className="text-sm font-data font-medium text-foreground">{verificationResult?.timestamp}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Block Number</p>
                <p className="text-sm font-data font-medium text-foreground">{verificationResult?.blockNumber?.toLocaleString()}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Blockchain Hash</p>
              <div className="bg-muted rounded-lg p-3 overflow-x-auto">
                <code className="text-xs font-data text-foreground break-all">
                  {verificationResult?.blockchainHash}
                </code>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Voter Hash (Anonymous)</p>
              <div className="bg-muted rounded-lg p-3 overflow-x-auto">
                <code className="text-xs font-data text-foreground break-all">
                  {verificationResult?.voterHash}
                </code>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-2">
                <Icon name="Lock" size={16} className="text-success" />
                <div>
                  <p className="text-xs text-muted-foreground">Encryption</p>
                  <p className="text-sm font-medium text-foreground">{verificationResult?.encryptionMethod}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <div>
                  <p className="text-xs text-muted-foreground">Signature</p>
                  <p className="text-sm font-medium text-success">Valid</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Shield" size={16} className="text-success" />
                <div>
                  <p className="text-xs text-muted-foreground">Confirmations</p>
                  <p className="text-sm font-data font-medium text-foreground">{verificationResult?.confirmations?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div>
        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4">
          Recent Verifications
        </h3>
        <div className="space-y-3">
          {recentVerifications?.map((verification) => (
            <div
              key={verification?.id}
              className="card p-4 hover:shadow-democratic-md transition-all duration-250"
            >
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="CheckCircle" size={16} className="text-success" />
                    <span className="text-sm font-data font-medium text-foreground">
                      {verification?.voteId}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1 truncate">
                    {verification?.electionTitle}
                  </p>
                  <p className="text-xs text-muted-foreground">{verification?.timestamp}</p>
                </div>
                <Button variant="ghost" size="sm" iconName="Eye">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VerifyElectionSection;