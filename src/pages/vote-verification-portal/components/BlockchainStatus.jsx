import React from 'react';
import Icon from '../../../components/AppIcon';

const BlockchainStatus = ({ isConnected, blockHeight, networkName }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
          Blockchain Network Status
        </h3>
        <div className={`crypto-indicator ${isConnected ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success' : 'bg-warning'} animate-pulse`} />
          <span className="text-xs font-medium">{isConnected ? 'Connected' : 'Connecting...'}</span>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">Network</span>
          <span className="text-sm font-data font-medium text-foreground">{networkName}</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">Current Block</span>
          <span className="text-sm font-data font-medium text-foreground">#{blockHeight?.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-muted-foreground">Verification Method</span>
          <span className="text-sm font-medium text-foreground">Zero-Knowledge Proof</span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-start gap-2">
          <Icon name="Shield" size={16} className="text-success flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            All verifications are performed on-chain with cryptographic proof validation
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlockchainStatus;