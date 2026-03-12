import React from 'react';
import Icon from '../../../components/AppIcon';

const AuditTypeSelector = ({ selectedType, onTypeChange }) => {
  const auditTypes = [
    {
      id: 'hash-chain',
      label: 'Hash Chain Validation',
      description: 'Verify vote integrity through cryptographic hash chain',
      icon: 'Link',
      color: 'var(--color-primary)'
    },
    {
      id: 'smart-contract',
      label: 'Smart Contract Analysis',
      description: 'Validate smart contract execution and RNG draws',
      icon: 'FileCode',
      color: 'var(--color-secondary)'
    },
    {
      id: 'full-audit',
      label: 'Full Comprehensive Audit',
      description: 'Complete verification including all audit types',
      icon: 'ShieldCheck',
      color: 'var(--color-success)'
    }
  ];

  return (
    <div className="bg-card rounded-xl p-4 md:p-6 border border-border">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
          <Icon name="FileSearch" size={20} color="var(--color-secondary)" />
        </div>
        <div>
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
            Audit Type
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">
            Select verification method
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {auditTypes?.map((type) => (
          <button
            key={type?.id}
            onClick={() => onTypeChange(type?.id)}
            className={`p-4 rounded-lg border-2 transition-all duration-250 text-left ${
              selectedType === type?.id
                ? 'border-primary bg-primary/5' :'border-border hover:border-muted-foreground/30 hover:bg-muted/50'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                selectedType === type?.id ? 'bg-primary/10' : 'bg-muted'
              }`}>
                <Icon 
                  name={type?.icon} 
                  size={20} 
                  color={selectedType === type?.id ? type?.color : 'var(--color-muted-foreground)'} 
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm md:text-base font-heading font-semibold mb-1 ${
                  selectedType === type?.id ? 'text-primary' : 'text-foreground'
                }`}>
                  {type?.label}
                </h4>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {type?.description}
                </p>
              </div>
              {selectedType === type?.id && (
                <Icon name="CheckCircle" size={20} color="var(--color-primary)" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AuditTypeSelector;