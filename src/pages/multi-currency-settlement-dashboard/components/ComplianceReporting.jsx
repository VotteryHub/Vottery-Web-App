import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ComplianceReporting = ({ reports }) => {
  const getStatusConfig = (status) => {
    const configs = {
      passed: { color: 'bg-success/10 text-success', icon: 'CheckCircle', label: 'Passed' },
      warning: { color: 'bg-warning/10 text-warning', icon: 'AlertTriangle', label: 'Warning' },
      failed: { color: 'bg-destructive/10 text-destructive', icon: 'XCircle', label: 'Failed' },
      pending: { color: 'bg-muted text-muted-foreground', icon: 'Clock', label: 'Pending' }
    };
    return configs?.[status] || configs?.pending;
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-1">
            Compliance Reporting
          </h3>
          <p className="text-sm text-muted-foreground">
            Regulatory compliance tracking for international transfers
          </p>
        </div>
        <Button variant="outline" size="sm" iconName="Download">
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-success/5 rounded-lg border border-success/20 p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Shield" size={20} className="text-success" />
            <span className="text-sm font-medium text-success">Compliant</span>
          </div>
          <p className="text-2xl font-bold text-foreground">98.5%</p>
          <p className="text-xs text-muted-foreground mt-1">All regions</p>
        </div>

        <div className="bg-warning/5 rounded-lg border border-warning/20 p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="AlertTriangle" size={20} className="text-warning" />
            <span className="text-sm font-medium text-warning">Warnings</span>
          </div>
          <p className="text-2xl font-bold text-foreground">3</p>
          <p className="text-xs text-muted-foreground mt-1">Require attention</p>
        </div>

        <div className="bg-primary/5 rounded-lg border border-primary/20 p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="FileText" size={20} className="text-primary" />
            <span className="text-sm font-medium text-primary">Reports</span>
          </div>
          <p className="text-2xl font-bold text-foreground">24</p>
          <p className="text-xs text-muted-foreground mt-1">This month</p>
        </div>
      </div>

      <div className="space-y-3">
        {reports?.map((report) => {
          const statusConfig = getStatusConfig(report?.status);
          return (
            <div key={report?.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-10 h-10 rounded-lg ${statusConfig?.color} flex items-center justify-center`}>
                  <Icon name={statusConfig?.icon} size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground mb-1">
                    {report?.type}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon name="MapPin" size={12} />
                      {report?.region}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Calendar" size={12} />
                      {formatDate(report?.date)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig?.color}`}>
                  {statusConfig?.label}
                </span>
                <button className="text-primary hover:underline text-sm font-medium">
                  View
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={20} className="text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-2">Compliance Standards</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Icon name="Check" size={14} className="text-success" />
                  <span>AML/KYC Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Check" size={14} className="text-success" />
                  <span>GDPR Compliance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Check" size={14} className="text-success" />
                  <span>Tax Reporting</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Check" size={14} className="text-success" />
                  <span>Transfer Limits Monitoring</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceReporting;