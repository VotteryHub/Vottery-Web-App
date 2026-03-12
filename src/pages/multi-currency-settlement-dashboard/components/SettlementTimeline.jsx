import React from 'react';
import Icon from '../../../components/AppIcon';

const SettlementTimeline = ({ timelines }) => {
  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: 'bg-muted text-muted-foreground', icon: 'Clock', label: 'Pending' },
      processing: { color: 'bg-warning/10 text-warning', icon: 'Loader2', label: 'Processing' },
      completed: { color: 'bg-success/10 text-success', icon: 'CheckCircle', label: 'Completed' },
      failed: { color: 'bg-destructive/10 text-destructive', icon: 'XCircle', label: 'Failed' }
    };
    return configs?.[status] || configs?.pending;
  };

  const getStageLabel = (stage) => {
    const stages = {
      initiated: 'Initiated',
      bank_transfer: 'Bank Transfer',
      confirmed: 'Confirmed',
      completed: 'Completed'
    };
    return stages?.[stage] || stage;
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-1">
            Settlement Timeline
          </h3>
          <p className="text-sm text-muted-foreground">
            Processing stages and estimated completion
          </p>
        </div>
        <Icon name="Clock" size={24} className="text-primary" />
      </div>

      <div className="space-y-4">
        {timelines?.map((settlement) => {
          const statusConfig = getStatusConfig(settlement?.status);
          return (
            <div key={settlement?.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-foreground">
                      {settlement?.region}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig?.color}`}>
                      <Icon name={statusConfig?.icon} size={12} />
                      {statusConfig?.label}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(settlement?.amount, settlement?.currency)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">Est. Completion</p>
                  <p className="text-sm font-medium text-foreground">
                    {formatDate(settlement?.estimatedCompletion)}
                  </p>
                </div>
              </div>

              <div className="relative pt-4">
                <div className="absolute top-4 left-0 right-0 h-1 bg-muted rounded-full" />
                <div className="absolute top-4 left-0 h-1 bg-primary rounded-full transition-all duration-500"
                  style={{ 
                    width: settlement?.status === 'completed' ? '100%' : 
                           settlement?.status === 'processing' ? '66%' : '33%' 
                  }}
                />
                <div className="relative flex justify-between">
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${
                      settlement?.status !== 'pending' ? 'bg-primary' : 'bg-muted'
                    } mb-2`} />
                    <span className="text-xs text-muted-foreground">Initiated</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${
                      settlement?.status === 'processing' || settlement?.status === 'completed' ? 'bg-primary' : 'bg-muted'
                    } mb-2`} />
                    <span className="text-xs text-muted-foreground">Processing</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${
                      settlement?.status === 'completed' ? 'bg-primary' : 'bg-muted'
                    } mb-2`} />
                    <span className="text-xs text-muted-foreground">Confirmed</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Current Stage: <span className="font-medium text-foreground">{getStageLabel(settlement?.stage)}</span>
                </span>
                <button className="text-xs text-primary hover:underline font-medium">
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors">
          <Icon name="Plus" size={18} className="text-primary" />
          <span className="text-sm font-medium text-primary">View All Settlements</span>
        </button>
      </div>
    </div>
  );
};

export default SettlementTimeline;