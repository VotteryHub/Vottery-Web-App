import React from 'react';
import Icon from '../../../components/AppIcon';

const ComplianceControlsPanel = () => {
  const complianceFeatures = [
    {
      standard: 'ISO/IEC 27566-1:2025',
      title: 'Age Assurance Systems',
      description: 'International standard for age verification and assurance systems',
      status: 'Compliant',
      features: [
        'Privacy-by-design architecture',
        'Data minimization protocols',
        'Audit trail requirements',
        'Security controls framework'
      ]
    },
    {
      standard: 'ISO/IEC 27001:2022',
      title: 'Information Security Management',
      description: 'Comprehensive information security management system',
      status: 'Certified',
      features: [
        'Risk assessment procedures',
        'Access control policies',
        'Incident response protocols',
        'Continuous monitoring'
      ]
    },
    {
      standard: 'GDPR',
      title: 'General Data Protection Regulation',
      description: 'EU data protection and privacy regulation',
      status: 'Compliant',
      features: [
        'Right to erasure (24-hour deletion)',
        'Data portability support',
        'Consent management',
        'Privacy impact assessments'
      ]
    },
    {
      standard: 'COPPA',
      title: 'Children\'s Online Privacy Protection Act',
      description: 'US federal law protecting children\'s online privacy',
      status: 'Compliant',
      features: [
        'Parental consent mechanisms',
        'Age-appropriate data collection',
        'Enhanced privacy protections',
        'Transparent privacy policies'
      ]
    }
  ];

  const securityMeasures = [
    { icon: 'Lock', label: 'End-to-End Encryption', description: 'AES-256 encryption for all verification data' },
    { icon: 'Shield', label: 'Zero-Knowledge Architecture', description: 'Verification without storing sensitive data' },
    { icon: 'Eye', label: 'Audit Logging', description: 'Comprehensive tamper-evident audit trails' },
    { icon: 'Clock', label: 'Automatic Deletion', description: 'Temporary data deleted within 24 hours' },
    { icon: 'Users', label: 'Access Controls', description: 'Role-based access with multi-factor authentication' },
    { icon: 'FileText', label: 'Compliance Reporting', description: 'Automated regulatory compliance reports' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Award" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">ISO 27001 Compliance Framework</h3>
            <p className="text-sm text-muted-foreground">
              Our age verification system adheres to international standards including ISO/IEC 27566-1:2025 for age assurance systems, 
              ISO/IEC 27001:2022 for information security management, and GDPR for data protection.
            </p>
          </div>
        </div>
      </div>

      {/* Compliance Standards */}
      <div className="space-y-4">
        {complianceFeatures?.map((compliance, index) => (
          <div key={index} className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-foreground">{compliance?.standard}</h3>
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-success/10 text-success">
                    {compliance?.status}
                  </span>
                </div>
                <p className="text-sm font-medium text-muted-foreground">{compliance?.title}</p>
              </div>
              <Icon name="CheckCircle" size={24} className="text-success" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">{compliance?.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {compliance?.features?.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <Icon name="Check" size={16} className="text-success flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Security Measures */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Security Measures</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {securityMeasures?.map((measure, index) => (
            <div key={index} className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name={measure?.icon} size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm mb-1">{measure?.label}</p>
                  <p className="text-xs text-muted-foreground">{measure?.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Retention Policy */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Data Retention & Deletion Policy</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <Icon name="Clock" size={18} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Temporary Verification Data</p>
              <p className="text-xs text-muted-foreground">
                Selfie images, ID documents, and biometric samples are automatically deleted within 24 hours after verification decision.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <Icon name="Database" size={18} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Verification Records</p>
              <p className="text-xs text-muted-foreground">
                Only binary "age verified" signal, verification method, and timestamp are retained for audit purposes. No personal identifiable information stored.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <Icon name="Trash2" size={18} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">User Rights</p>
              <p className="text-xs text-muted-foreground">
                Users can request complete deletion of all verification records at any time through account settings. GDPR "Right to Erasure" fully supported.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Trail */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Audit Trail & Transparency</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <span className="text-foreground font-medium">Verification Attempts Logged</span>
            <Icon name="Check" size={18} className="text-success" />
          </div>
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <span className="text-foreground font-medium">Tamper-Evident Logging</span>
            <Icon name="Check" size={18} className="text-success" />
          </div>
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <span className="text-foreground font-medium">Compliance Reports Generated</span>
            <Icon name="Check" size={18} className="text-success" />
          </div>
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <span className="text-foreground font-medium">User Access Transparency</span>
            <Icon name="Check" size={18} className="text-success" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceControlsPanel;