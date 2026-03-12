import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustIndicators = () => {
  const indicators = [
    {
      icon: 'Shield',
      label: 'End-to-End Encrypted',
      description: 'AES-256 encryption protects all data'
    },
    {
      icon: 'Lock',
      label: 'Blockchain Secured',
      description: 'Immutable ledger prevents tampering'
    },
    {
      icon: 'Eye',
      label: 'Zero-Knowledge Proofs',
      description: 'Verify without revealing vote contents'
    },
    {
      icon: 'CheckCircle',
      label: 'Independently Audited',
      description: 'Third-party security verification'
    }
  ];

  return (
    <div className="card">
      <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-4">
        Security & Trust
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {indicators?.map((indicator, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name={indicator?.icon} size={16} color="var(--color-success)" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground mb-1">
                {indicator?.label}
              </p>
              <p className="text-xs text-muted-foreground">
                {indicator?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Security Certifications</span>
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 bg-muted rounded text-xs font-medium text-foreground">
              ISO 27001
            </div>
            <div className="px-2 py-1 bg-muted rounded text-xs font-medium text-foreground">
              SOC 2 Type II
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustIndicators;