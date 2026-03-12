import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const BlockchainMonitor = ({ transactions }) => {
  const getTransactionIcon = (type) => {
    const icons = {
      vote: 'Vote',
      election: 'FileText',
      verification: 'ShieldCheck',
      audit: 'FileSearch',
      lottery: 'Trophy',
    };
    return icons?.[type] || 'Activity';
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'text-success',
      pending: 'text-warning',
      failed: 'text-destructive',
    };
    return colors?.[status] || 'text-muted-foreground';
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={20} color="var(--color-success)" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Network Status</p>
              <p className="text-lg font-heading font-semibold text-success">Healthy</p>
            </div>
          </div>
          <div className="crypto-indicator mt-3">
            <Icon name="Activity" size={14} />
            <span className="text-xs font-medium">Connected</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Transactions/Sec</p>
              <p className="text-lg font-heading font-semibold text-foreground font-data">1,247</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">Average: 1,180 TPS</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="Clock" size={20} color="var(--color-warning)" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Block Time</p>
              <p className="text-lg font-heading font-semibold text-foreground font-data">2.3s</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">Target: 2.0s</p>
        </div>
      </div>
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-foreground">Recent Transactions</h3>
          <Button variant="outline" size="sm" iconName="RefreshCw">
            Refresh
          </Button>
        </div>

        <div className="space-y-3">
          {transactions?.map((tx) => (
            <div
              key={tx?.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border hover:bg-muted/30 transition-all duration-200"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={getTransactionIcon(tx?.type)} size={20} color="var(--color-primary)" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-foreground truncate">{tx?.description}</p>
                    <span className={`text-xs font-medium ${getStatusColor(tx?.status)}`}>
                      {tx?.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-data truncate">
                    Hash: {tx?.hash}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon name="Clock" size={12} />
                      {tx?.timestamp}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Layers" size={12} />
                      Block: {tx?.blockNumber}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Zap" size={12} />
                      Gas: {tx?.gasUsed}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" iconName="ExternalLink">
                View
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlockchainMonitor;