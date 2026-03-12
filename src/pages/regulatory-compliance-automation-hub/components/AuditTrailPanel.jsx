import React from 'react';
import Icon from '../../../components/AppIcon';

const AuditTrailPanel = ({ filings, loading }) => {
  if (loading) {
    return <div className="bg-card border border-border rounded-lg p-6 animate-pulse"><div className="h-64 bg-muted rounded"></div></div>;
  }

  const recentActivity = filings?.slice(0, 10)?.map(filing => ({
    id: filing?.id,
    action: `Filing ${filing?.status}`,
    filingType: filing?.filingType,
    jurisdiction: filing?.jurisdiction,
    timestamp: filing?.submissionDate || filing?.createdAt,
    status: filing?.status
  }));

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted':
        return 'Send';
      case 'approved':
        return 'CheckCircle';
      case 'rejected':
        return 'XCircle';
      default:
        return 'FileText';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="FileText" size={20} />
        Compliance Audit Trail
      </h3>
      <div className="space-y-3">
        {recentActivity?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="FileText" size={48} className="mx-auto mb-4" />
            <p>No activity recorded</p>
          </div>
        ) : (
          recentActivity?.map((activity) => (
            <div key={activity?.id} className="flex items-start gap-3 p-4 border border-border rounded-lg">
              <Icon name={getStatusIcon(activity?.status)} className="text-primary mt-1" size={16} />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{activity?.action}</p>
                <p className="text-xs text-muted-foreground">
                  {activity?.filingType?.replace('_', ' ')} - {activity?.jurisdiction}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activity?.timestamp ? new Date(activity?.timestamp)?.toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AuditTrailPanel;