import React from 'react';
import Icon from '../../../components/AppIcon';
import { format } from 'date-fns';

const TransactionMonitoring = ({ data }) => {
  const liveMetrics = [
    { label: 'Transactions/Min', value: '24.5', icon: 'Activity', color: 'bg-primary/10 text-primary' },
    { label: 'Success Rate', value: '99.2%', icon: 'CheckCircle', color: 'bg-success/10 text-success' },
    { label: 'Avg Response Time', value: '1.8s', icon: 'Zap', color: 'bg-accent/10 text-accent' },
    { label: 'Failed (24h)', value: '8', icon: 'AlertCircle', color: 'bg-destructive/10 text-destructive' }
  ];

  const transactionFlow = [
    { stage: 'Initiated', count: 1247, percentage: 100, color: 'bg-blue-500' },
    { stage: 'Validated', count: 1238, percentage: 99.3, color: 'bg-purple-500' },
    { stage: 'Processing', count: 1230, percentage: 98.6, color: 'bg-yellow-500' },
    { stage: 'Completed', count: 1222, percentage: 98.0, color: 'bg-green-500' }
  ];

  const failureAnalysis = [
    { reason: 'Insufficient Funds', count: 3, percentage: 37.5 },
    { reason: 'Invalid Card', count: 2, percentage: 25.0 },
    { reason: 'Network Timeout', count: 2, percentage: 25.0 },
    { reason: 'Bank Declined', count: 1, percentage: 12.5 }
  ];

  const retryQueue = [
    { id: 1, transaction: 'TXN-2026-4521', type: 'Prize Payout', amount: 1250, attempts: 1, nextRetry: '5 min', reason: 'Network Timeout' },
    { id: 2, transaction: 'TXN-2026-4518', type: 'Participation Fee', amount: 50, attempts: 2, nextRetry: '15 min', reason: 'Bank Declined' },
    { id: 3, transaction: 'TXN-2026-4512', type: 'Advertiser Billing', amount: 12600, attempts: 1, nextRetry: '10 min', reason: 'Insufficient Funds' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {liveMetrics?.map((metric, index) => (
          <div key={index} className="card p-6">
            <div className={`w-12 h-12 rounded-full ${metric?.color} flex items-center justify-center mb-4`}>
              <Icon name={metric?.icon} size={24} />
            </div>
            <p className="text-sm text-muted-foreground mb-1">{metric?.label}</p>
            <p className="text-3xl font-heading font-bold text-foreground font-data">
              {metric?.value}
            </p>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Live Payment Flow
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Real-time monitoring</span>
          </div>
        </div>
        <div className="space-y-4">
          {transactionFlow?.map((stage, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{stage?.stage}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground font-data">{stage?.count} transactions</span>
                  <span className="text-sm font-semibold text-foreground font-data">{stage?.percentage}%</span>
                </div>
              </div>
              <div className="w-full bg-border rounded-full h-3">
                <div
                  className={`${stage?.color} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${stage?.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-semibold text-foreground">
              Failure Analysis
            </h2>
            <Icon name="AlertTriangle" size={24} className="text-destructive" />
          </div>
          <div className="space-y-3">
            {failureAnalysis?.map((failure, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{failure?.reason}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground font-data">{failure?.count} failures</span>
                    <span className="text-sm font-semibold text-foreground font-data">{failure?.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div
                    className="bg-destructive h-2 rounded-full"
                    style={{ width: `${failure?.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-semibold text-foreground">
              Automated Retry Queue
            </h2>
            <Icon name="RotateCw" size={24} className="text-accent" />
          </div>
          <div className="space-y-3">
            {retryQueue?.map((item) => (
              <div key={item?.id} className="p-4 rounded-lg border border-border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-foreground">{item?.transaction}</span>
                  <span className="text-sm font-bold text-foreground font-data">${item?.amount}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>{item?.type}</span>
                  <span>Attempt {item?.attempts}/3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-destructive">{item?.reason}</span>
                  <span className="text-xs text-muted-foreground">Next retry: {item?.nextRetry}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Detailed Error Logging
          </h2>
          <Icon name="FileText" size={24} className="text-primary" />
          </div>
        <div className="space-y-2">
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-start gap-3">
              <Icon name="XCircle" size={16} className="text-destructive mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-foreground">TXN-2026-4521</span>
                  <span className="text-xs text-muted-foreground">{format(new Date(), 'HH:mm:ss')}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">Network timeout during payout processing</p>
                <p className="text-xs text-destructive">Error Code: NET_TIMEOUT_001 • Retry scheduled</p>
              </div>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-yellow-100/50 border border-yellow-200">
            <div className="flex items-start gap-3">
              <Icon name="AlertCircle" size={16} className="text-yellow-700 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-foreground">TXN-2026-4518</span>
                  <span className="text-xs text-muted-foreground">{format(new Date(Date.now() - 120000), 'HH:mm:ss')}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">Bank declined transaction - insufficient funds</p>
                <p className="text-xs text-yellow-700">Error Code: BANK_DECLINED_002 • User notified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionMonitoring;