import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ComplianceAuditTrailPanel = ({ auditTrail, onRefresh }) => {
  const [filterActionType, setFilterActionType] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'high':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getActionIcon = (actionType) => {
    const icons = {
      user_management: 'Users',
      election_approval: 'Vote',
      election_rejection: 'XCircle',
      content_moderation: 'Shield',
      system_configuration: 'Settings',
      security_event: 'Lock',
      data_export: 'Download',
      policy_update: 'FileText'
    };
    return icons?.[actionType] || 'Activity';
  };

  const filteredAuditTrail = auditTrail?.filter(entry => {
    if (filterActionType !== 'all' && entry?.actionType !== filterActionType) return false;
    if (filterSeverity !== 'all' && entry?.severity !== filterSeverity) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-1">
              Compliance Audit Trail
            </h2>
            <p className="text-sm text-muted-foreground">
              Complete audit trail of all compliance-relevant administrative actions
            </p>
          </div>
          <Button variant="outline" size="sm" iconName="Download">
            Export Audit Log
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Select
            value={filterActionType}
            onChange={(e) => setFilterActionType(e?.target?.value)}
          >
            <option value="all">All Action Types</option>
            <option value="user_management">User Management</option>
            <option value="election_approval">Election Approval</option>
            <option value="content_moderation">Content Moderation</option>
            <option value="system_configuration">System Configuration</option>
            <option value="security_event">Security Event</option>
            <option value="policy_update">Policy Update</option>
          </Select>

          <Select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e?.target?.value)}
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
        </div>

        <div className="space-y-2">
          {filteredAuditTrail?.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="History" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No audit trail entries found</p>
            </div>
          ) : (
            filteredAuditTrail?.map((entry, index) => (
              <div key={entry?.id || index} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="relative">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name={getActionIcon(entry?.actionType)} size={20} className="text-primary" />
                  </div>
                  {index < filteredAuditTrail?.length - 1 && (
                    <div className="absolute top-10 left-5 w-0.5 h-4 bg-border" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-foreground">
                          {entry?.actionType?.replace('_', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                        </p>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(entry?.severity)}`}>
                          {entry?.severity?.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {entry?.actionDescription}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                      {new Date(entry?.createdAt)?.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon name="User" size={12} />
                      {entry?.admin?.name || 'System'}
                    </span>
                    {entry?.affectedEntityType && (
                      <span className="flex items-center gap-1">
                        <Icon name="Target" size={12} />
                        {entry?.affectedEntityType}
                      </span>
                    )}
                    {entry?.ipAddress && (
                      <span className="flex items-center gap-1">
                        <Icon name="Globe" size={12} />
                        {entry?.ipAddress}
                      </span>
                    )}
                  </div>

                  {(entry?.beforeState || entry?.afterState) && (
                    <div className="mt-3 p-3 bg-background rounded-lg border border-border">
                      <p className="text-xs font-medium text-foreground mb-2">State Changes</p>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        {entry?.beforeState && (
                          <div>
                            <p className="text-muted-foreground mb-1">Before:</p>
                            <code className="text-foreground bg-muted px-2 py-1 rounded">
                              {JSON.stringify(entry?.beforeState)?.substring(0, 50)}...
                            </code>
                          </div>
                        )}
                        {entry?.afterState && (
                          <div>
                            <p className="text-muted-foreground mb-1">After:</p>
                            <code className="text-foreground bg-muted px-2 py-1 rounded">
                              {JSON.stringify(entry?.afterState)?.substring(0, 50)}...
                            </code>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplianceAuditTrailPanel;