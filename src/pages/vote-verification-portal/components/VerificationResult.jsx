import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VerificationResult = ({ result, onDownloadProof, onReportIssue }) => {
  if (!result) return null;

  const { status, voteId, transactionHash, blockNumber, timestamp, electionTitle, zkProofValid, hashChainValid } = result;

  const isVerified = status === 'verified';

  return (
    <div className={`card ${isVerified ? 'border-success' : 'border-destructive'}`}>
      <div className="flex items-start gap-4 mb-6">
        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isVerified ? 'bg-success/10' : 'bg-destructive/10'
        }`}>
          <Icon 
            name={isVerified ? 'CheckCircle' : 'XCircle'} 
            size={32} 
            color={isVerified ? 'var(--color-success)' : 'var(--color-destructive)'} 
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-xl md:text-2xl font-heading font-bold mb-2 ${
            isVerified ? 'text-success' : 'text-destructive'
          }`}>
            {isVerified ? 'Vote Successfully Verified' : 'Verification Failed'}
          </h3>
          <p className="text-sm md:text-base text-muted-foreground">
            {isVerified 
              ? 'Your vote has been confirmed on the blockchain with valid cryptographic proofs' :'Unable to verify this vote. Please check your Vote ID or contact support.'
            }
          </p>
        </div>
      </div>
      {isVerified && (
        <>
          <div className="space-y-4 mb-6">
            <div className="bg-muted rounded-lg p-4">
              <h4 className="text-sm font-heading font-semibold text-foreground mb-3">
                Election Details
              </h4>
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-muted-foreground">Election</span>
                  <span className="text-sm font-medium text-foreground text-right">{electionTitle}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-muted-foreground">Vote Cast</span>
                  <span className="text-sm font-data font-medium text-foreground">{timestamp}</span>
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <h4 className="text-sm font-heading font-semibold text-foreground mb-3">
                Blockchain Confirmation
              </h4>
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-muted-foreground">Transaction Hash</span>
                  <button 
                    onClick={() => window.open(`https://etherscan.io/tx/${transactionHash}`, '_blank')}
                    className="text-sm font-data font-medium text-primary hover:underline text-right break-all"
                  >
                    {transactionHash?.substring(0, 10)}...{transactionHash?.substring(transactionHash?.length - 8)}
                  </button>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-muted-foreground">Block Number</span>
                  <span className="text-sm font-data font-medium text-foreground">#{blockNumber?.toLocaleString()}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-muted-foreground">Vote ID</span>
                  <span className="text-sm font-data font-medium text-foreground break-all text-right">
                    {voteId?.substring(0, 16)}...
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <h4 className="text-sm font-heading font-semibold text-foreground mb-3">
                Cryptographic Validation
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Zero-Knowledge Proof</span>
                  <div className="flex items-center gap-2">
                    <Icon name={zkProofValid ? 'CheckCircle' : 'XCircle'} size={16} color={zkProofValid ? 'var(--color-success)' : 'var(--color-destructive)'} />
                    <span className={`text-sm font-medium ${zkProofValid ? 'text-success' : 'text-destructive'}`}>
                      {zkProofValid ? 'Valid' : 'Invalid'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Hash Chain Integrity</span>
                  <div className="flex items-center gap-2">
                    <Icon name={hashChainValid ? 'CheckCircle' : 'XCircle'} size={16} color={hashChainValid ? 'var(--color-success)' : 'var(--color-destructive)'} />
                    <span className={`text-sm font-medium ${hashChainValid ? 'text-success' : 'text-destructive'}`}>
                      {hashChainValid ? 'Valid' : 'Invalid'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="default"
              iconName="Download"
              iconPosition="left"
              onClick={onDownloadProof}
              fullWidth
              className="sm:flex-1"
            >
              Download Verification Proof
            </Button>
            <Button
              variant="outline"
              iconName="ExternalLink"
              iconPosition="right"
              onClick={() => window.open(`https://etherscan.io/tx/${transactionHash}`, '_blank')}
              className="sm:w-auto"
            >
              View on Explorer
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-start gap-3">
              <Icon name="Lock" size={18} className="text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Privacy Guarantee:</span> This verification confirms your vote was recorded without revealing your choices. The zero-knowledge proof validates authenticity while maintaining complete ballot secrecy.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
      {!isVerified && (
        <div className="space-y-4">
          <div className="bg-destructive/10 rounded-lg p-4">
            <h4 className="text-sm font-heading font-semibold text-destructive mb-2">
              Possible Reasons for Failure
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Icon name="Dot" size={16} className="flex-shrink-0 mt-0.5" />
                <span>Incorrect Vote ID format or typo</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Dot" size={16} className="flex-shrink-0 mt-0.5" />
                <span>Vote not yet confirmed on blockchain (wait 2-3 minutes)</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Dot" size={16} className="flex-shrink-0 mt-0.5" />
                <span>Network connectivity issues</span>
              </li>
            </ul>
          </div>

          <Button
            variant="destructive"
            iconName="AlertTriangle"
            iconPosition="left"
            onClick={onReportIssue}
            fullWidth
          >
            Report Verification Issue
          </Button>
        </div>
      )}
    </div>
  );
};

export default VerificationResult;