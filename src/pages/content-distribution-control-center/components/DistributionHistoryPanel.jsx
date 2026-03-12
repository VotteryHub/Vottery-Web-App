import React from 'react';
import Icon from '../../../components/AppIcon';

const DistributionHistoryPanel = ({ history }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionIcon = (actionType) => {
    switch (actionType) {
      case 'update':
        return 'Edit';
      case 'toggle':
        return 'Power';
      case 'freeze':
        return 'Lock';
      default:
        return 'Activity';
    }
  };

  const getActionColor = (actionType) => {
    switch (actionType) {
      case 'update':
        return 'primary';
      case 'toggle':
        return 'success';
      case 'freeze':
        return 'destructive';
      default:
        return 'muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
              Distribution Audit Trail
            </h2>
            <p className="text-sm text-muted-foreground">
              Complete history of all content distribution changes and modifications
            </p>
          </div>
          <Icon name="History" size={24} className="text-primary" />
        </div>
      </div>

      {/* Timeline */}
      <div className="card">
        {history && history?.length > 0 ? (
          <div className="space-y-4">
            {history?.map((entry, index) => (
              <div key={entry?.id || index} className="relative">
                {/* Timeline Line */}
                {index < history?.length - 1 && (
                  <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-border" />
                )}

                <div className="flex gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${getActionColor(entry?.actionType)}/10 flex-shrink-0 relative z-10`}>
                    <Icon
                      name={getActionIcon(entry?.actionType)}
                      size={20}
                      className={`text-${getActionColor(entry?.actionType)}`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all duration-200">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-sm font-heading font-semibold text-foreground mb-1">
                            Distribution Settings Updated
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(entry?.createdAt)}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${getActionColor(entry?.actionType)}/10 text-${getActionColor(entry?.actionType)}`}>
                          {entry?.actionType?.toUpperCase()}
                        </span>
                      </div>

                      {/* Changes */}
                      <div className="space-y-2">
                        {/* Percentage Changes */}
                        {entry?.previousElectionPercentage !== entry?.newElectionPercentage && (
                          <div className="flex items-center gap-2 text-sm">
                            <Icon name="Vote" size={14} className="text-primary" />
                            <span className="text-muted-foreground">Election Content:</span>
                            <span className="font-medium text-foreground font-data">
                              {entry?.previousElectionPercentage}%
                            </span>
                            <Icon name="ArrowRight" size={14} className="text-muted-foreground" />
                            <span className="font-semibold text-primary font-data">
                              {entry?.newElectionPercentage}%
                            </span>
                          </div>
                        )}

                        {entry?.previousSocialPercentage !== entry?.newSocialPercentage && (
                          <div className="flex items-center gap-2 text-sm">
                            <Icon name="MessageCircle" size={14} className="text-secondary" />
                            <span className="text-muted-foreground">Social Media:</span>
                            <span className="font-medium text-foreground font-data">
                              {entry?.previousSocialPercentage}%
                            </span>
                            <Icon name="ArrowRight" size={14} className="text-muted-foreground" />
                            <span className="font-semibold text-secondary font-data">
                              {entry?.newSocialPercentage}%
                            </span>
                          </div>
                        )}

                        {/* Toggle Changes */}
                        {entry?.previousEnabled !== entry?.newEnabled && (
                          <div className="flex items-center gap-2 text-sm">
                            <Icon name="Power" size={14} className="text-success" />
                            <span className="text-muted-foreground">System Status:</span>
                            <span className="font-medium text-foreground">
                              {entry?.previousEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                            <Icon name="ArrowRight" size={14} className="text-muted-foreground" />
                            <span className={`font-semibold ${
                              entry?.newEnabled ? 'text-success' : 'text-destructive'
                            }`}>
                              {entry?.newEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Changed By */}
                      {entry?.changedBy && (
                        <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
                          <Icon name="User" size={14} className="text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            Changed by: <span className="font-medium text-foreground">
                              {entry?.changedBy?.name || entry?.changedBy?.username || 'Admin'}
                            </span>
                          </span>
                        </div>
                      )}

                      {/* Reason */}
                      {entry?.reason && (
                        <div className="mt-2 p-2 rounded bg-muted/50">
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Reason:</span> {entry?.reason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Icon name="History" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No distribution history available</p>
          </div>
        )}
      </div>

      {/* Export Options */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-heading font-semibold text-foreground mb-1">
              Export Audit Trail
            </h3>
            <p className="text-xs text-muted-foreground">
              Download complete history for compliance and reporting
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 text-sm font-medium text-foreground">
              Export CSV
            </button>
            <button className="px-3 py-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 text-sm font-medium text-foreground">
              Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributionHistoryPanel;