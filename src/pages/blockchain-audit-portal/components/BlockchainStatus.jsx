import React from 'react';
import Icon from '../../../components/AppIcon';

const BlockchainStatus = ({ isConnected, networkName, blockHeight, lastSync }) => {
  return (
    <div className="bg-card rounded-xl p-4 md:p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isConnected ? 'bg-success/10' : 'bg-error/10'
          }`}>
            <Icon 
              name={isConnected ? 'Wifi' : 'WifiOff'} 
              size={20} 
              color={isConnected ? 'var(--color-success)' : 'var(--color-error)'} 
            />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
              Blockchain Status
            </h3>
            <p className={`text-xs md:text-sm font-medium ${
              isConnected ? 'text-success' : 'text-error'
            }`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </p>
          </div>
        </div>
        <div className={`crypto-indicator ${!isConnected && 'opacity-50'}`}>
          <Icon name="Lock" size={14} />
          <span className="text-xs font-medium">Secure</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="Network" size={14} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Network</span>
          </div>
          <p className="text-sm md:text-base font-data font-medium text-foreground">
            {networkName}
          </p>
        </div>

        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="Box" size={14} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Block Height</span>
          </div>
          <p className="text-sm md:text-base font-data font-medium text-foreground">
            {blockHeight?.toLocaleString()}
          </p>
        </div>

        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="Clock" size={14} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Last Sync</span>
          </div>
          <p className="text-sm md:text-base font-data font-medium text-foreground">
            {lastSync}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlockchainStatus;