import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ComplianceScreeningPanel = ({ formData, onChange, errors }) => {
  const startBackgroundCheck = () => {
    onChange('backgroundCheckStatus', 'processing');
    setTimeout(() => {
      onChange('backgroundCheckStatus', 'approved');
    }, 3000);
  };

  const startSanctionsCheck = () => {
    onChange('sanctionsCheckStatus', 'processing');
    setTimeout(() => {
      onChange('sanctionsCheckStatus', 'approved');
    }, 3000);
  };

  const startRegulatoryApproval = () => {
    onChange('regulatoryApprovalStatus', 'processing');
    setTimeout(() => {
      onChange('regulatoryApprovalStatus', 'approved');
    }, 4000);
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: 'bg-muted text-muted-foreground', icon: 'Clock', label: 'Pending', bgColor: 'bg-muted/30' },
      processing: { color: 'bg-warning/10 text-warning', icon: 'Loader2', label: 'Processing', bgColor: 'bg-warning/5' },
      approved: { color: 'bg-success/10 text-success', icon: 'CheckCircle', label: 'Approved', bgColor: 'bg-success/5' },
      rejected: { color: 'bg-destructive/10 text-destructive', icon: 'XCircle', label: 'Rejected', bgColor: 'bg-destructive/5' },
      review: { color: 'bg-accent/10 text-accent', icon: 'AlertCircle', label: 'Under Review', bgColor: 'bg-accent/5' }
    };
    return configs?.[status] || configs?.pending;
  };

  const getStatusBadge = (status) => {
    const config = getStatusConfig(status);
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={14} />
        {config?.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-2">
          Compliance Screening
        </h3>
        <p className="text-sm md:text-base text-muted-foreground">
          Automated compliance checks and regulatory approval workflows
        </p>
      </div>

      <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Automated Screening Process</p>
            <p className="text-xs text-muted-foreground">
              Our system performs comprehensive background checks, sanctions list verification, and regulatory compliance screening. This process typically takes 2-5 minutes.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className={`rounded-lg border border-border p-6 ${getStatusConfig(formData?.backgroundCheckStatus)?.bgColor}`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="FileSearch" size={20} className="text-primary" />
              </div>
              <div>
                <h4 className="text-base font-heading font-semibold text-foreground mb-1">
                  Background Check
                </h4>
                <p className="text-sm text-muted-foreground">
                  Comprehensive business and representative background verification
                </p>
              </div>
            </div>
            {getStatusBadge(formData?.backgroundCheckStatus)}
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Check" size={16} className="text-success" />
              <span>Business registration verification</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Check" size={16} className="text-success" />
              <span>Corporate history review</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Check" size={16} className="text-success" />
              <span>Representative credentials check</span>
            </div>
          </div>

          {formData?.backgroundCheckStatus === 'pending' && (
            <Button onClick={startBackgroundCheck} iconName="Play" size="sm">
              Start Background Check
            </Button>
          )}

          {formData?.backgroundCheckStatus === 'processing' && (
            <div className="flex items-center gap-2 text-sm text-warning">
              <Icon name="Loader2" size={16} className="animate-spin" />
              <span>Processing background check...</span>
            </div>
          )}

          {formData?.backgroundCheckStatus === 'approved' && (
            <div className="flex items-center gap-2 text-sm text-success">
              <Icon name="CheckCircle" size={16} />
              <span>Background check completed successfully</span>
            </div>
          )}
        </div>

        <div className={`rounded-lg border border-border p-6 ${getStatusConfig(formData?.sanctionsCheckStatus)?.bgColor}`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} className="text-warning" />
              </div>
              <div>
                <h4 className="text-base font-heading font-semibold text-foreground mb-1">
                  Sanctions List Verification
                </h4>
                <p className="text-sm text-muted-foreground">
                  Cross-reference against international sanctions databases
                </p>
              </div>
            </div>
            {getStatusBadge(formData?.sanctionsCheckStatus)}
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Check" size={16} className="text-success" />
              <span>OFAC sanctions list screening</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Check" size={16} className="text-success" />
              <span>UN sanctions database check</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Check" size={16} className="text-success" />
              <span>EU sanctions list verification</span>
            </div>
          </div>

          {formData?.sanctionsCheckStatus === 'pending' && (
            <Button onClick={startSanctionsCheck} iconName="Play" size="sm">
              Start Sanctions Check
            </Button>
          )}

          {formData?.sanctionsCheckStatus === 'processing' && (
            <div className="flex items-center gap-2 text-sm text-warning">
              <Icon name="Loader2" size={16} className="animate-spin" />
              <span>Verifying sanctions lists...</span>
            </div>
          )}

          {formData?.sanctionsCheckStatus === 'approved' && (
            <div className="flex items-center gap-2 text-sm text-success">
              <Icon name="CheckCircle" size={16} />
              <span>No sanctions matches found</span>
            </div>
          )}
        </div>

        <div className={`rounded-lg border border-border p-6 ${getStatusConfig(formData?.regulatoryApprovalStatus)?.bgColor}`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Icon name="Shield" size={20} className="text-success" />
              </div>
              <div>
                <h4 className="text-base font-heading font-semibold text-foreground mb-1">
                  Regulatory Approval
                </h4>
                <p className="text-sm text-muted-foreground">
                  Compliance with advertising and data protection regulations
                </p>
              </div>
            </div>
            {getStatusBadge(formData?.regulatoryApprovalStatus)}
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Check" size={16} className="text-success" />
              <span>GDPR compliance verification</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Check" size={16} className="text-success" />
              <span>Advertising standards review</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Check" size={16} className="text-success" />
              <span>Industry-specific regulations check</span>
            </div>
          </div>

          {formData?.regulatoryApprovalStatus === 'pending' && (
            <Button onClick={startRegulatoryApproval} iconName="Play" size="sm">
              Start Regulatory Review
            </Button>
          )}

          {formData?.regulatoryApprovalStatus === 'processing' && (
            <div className="flex items-center gap-2 text-sm text-warning">
              <Icon name="Loader2" size={16} className="animate-spin" />
              <span>Reviewing regulatory compliance...</span>
            </div>
          )}

          {formData?.regulatoryApprovalStatus === 'approved' && (
            <div className="flex items-center gap-2 text-sm text-success">
              <Icon name="CheckCircle" size={16} />
              <span>Regulatory approval granted</span>
            </div>
          )}
        </div>
      </div>

      <div className="pt-6 border-t border-border">
        <label className="block text-sm font-medium text-foreground mb-2">
          Compliance Notes (Optional)
        </label>
        <textarea
          value={formData?.complianceNotes}
          onChange={(e) => onChange('complianceNotes', e?.target?.value)}
          placeholder="Add any additional compliance information or notes..."
          className="input min-h-[100px] resize-y"
          maxLength={1000}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {formData?.complianceNotes?.length || 0}/1000 characters
        </p>
      </div>
    </div>
  );
};

export default ComplianceScreeningPanel;