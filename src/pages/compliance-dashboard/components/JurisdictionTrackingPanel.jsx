import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const JurisdictionTrackingPanel = ({ jurisdictions, onRefresh }) => {
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusConfig = (status) => {
    const configs = {
      compliant: { color: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400', icon: 'CheckCircle', label: 'Compliant' },
      warning: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400', icon: 'AlertTriangle', label: 'Warning' },
      non_compliant: { color: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400', icon: 'XCircle', label: 'Non-Compliant' },
      pending_review: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400', icon: 'Clock', label: 'Pending Review' },
      critical: { color: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400', icon: 'AlertOctagon', label: 'Critical' }
    };
    return configs?.[status] || configs?.pending_review;
  };

  const filteredJurisdictions = jurisdictions?.filter(jurisdiction => {
    if (filterStatus !== 'all' && jurisdiction?.complianceStatus !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-1">
              Multi-Jurisdiction Compliance Tracking
            </h2>
            <p className="text-sm text-muted-foreground">
              Monitor compliance status across all operating jurisdictions
            </p>
          </div>
          <Button variant="outline" size="sm" iconName="Download">
            Export Report
          </Button>
        </div>

        <div className="mb-6">
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e?.target?.value)}
            className="max-w-xs"
          >
            <option value="all">All Statuses</option>
            <option value="compliant">Compliant</option>
            <option value="warning">Warning</option>
            <option value="non_compliant">Non-Compliant</option>
            <option value="pending_review">Pending Review</option>
            <option value="critical">Critical</option>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredJurisdictions?.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <Icon name="Globe" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No jurisdictions found</p>
            </div>
          ) : (
            filteredJurisdictions?.map((jurisdiction) => {
              const statusConfig = getStatusConfig(jurisdiction?.complianceStatus);
              return (
                <div key={jurisdiction?.id} className="bg-muted/30 rounded-lg border border-border p-5 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg ${statusConfig?.color} flex items-center justify-center`}>
                        <Icon name={statusConfig?.icon} size={24} />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-foreground mb-1">
                          {jurisdiction?.jurisdiction}
                        </h3>
                        <p className="text-xs text-muted-foreground">{jurisdiction?.region}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig?.color}`}>
                      {statusConfig?.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-background rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Compliance Score</p>
                      <p className="text-2xl font-bold text-foreground">{jurisdiction?.complianceScore || 0}%</p>
                    </div>
                    <div className="bg-background rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Issues</p>
                      <p className="text-2xl font-bold text-foreground">
                        {jurisdiction?.issuesResolved || 0}/{jurisdiction?.issuesIdentified || 0}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Regulatory Framework</span>
                      <span className="text-foreground font-medium">{jurisdiction?.regulatoryFramework}</span>
                    </div>
                    {jurisdiction?.lastAuditDate && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Last Audit</span>
                        <span className="text-foreground font-medium">
                          {new Date(jurisdiction?.lastAuditDate)?.toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {jurisdiction?.nextAuditDate && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Next Audit</span>
                        <span className="text-foreground font-medium">
                          {new Date(jurisdiction?.nextAuditDate)?.toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {jurisdiction?.activeRegulations && (
                    <div className="border-t border-border pt-3">
                      <p className="text-xs text-muted-foreground mb-2">Active Regulations</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(jurisdiction?.activeRegulations)?.map(([key, value]) => (
                          value && (
                            <span key={key} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                              <Icon name="Check" size={12} />
                              {key?.replace('_', ' ')?.toUpperCase()}
                            </span>
                          )
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-2">
                    <Button variant="outline" size="sm" iconName="Eye" className="flex-1">
                      View Details
                    </Button>
                    <Button variant="ghost" size="sm" iconName="Edit2">
                      Edit
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default JurisdictionTrackingPanel;