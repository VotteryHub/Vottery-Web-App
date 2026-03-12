import React from 'react';
import Icon from '../../../components/AppIcon';

const AuditTrailPanel = ({ auditTrail }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Audit Trail</h3>
      <div className="space-y-3">
        {auditTrail?.map((entry) => (
          <div key={entry?.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <Icon name="Shield" size={16} className="text-primary mt-1" />
            <div className="flex-1">
              <p className="text-sm text-foreground font-medium">{entry?.actionDescription}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(entry?.createdAt)?.toLocaleString()} • {entry?.adminProfile?.name || 'System'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditTrailPanel;