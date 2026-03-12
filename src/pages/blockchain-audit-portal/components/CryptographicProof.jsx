import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CryptographicProof = ({ proofData }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  if (!proofData) return null;

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: 'vote-encryption',
      title: 'Vote Encryption Proof',
      icon: 'Lock',
      color: 'var(--color-primary)',
      data: proofData?.encryption
    },
    {
      id: 'digital-signature',
      title: 'Digital Signature Verification',
      icon: 'FileSignature',
      color: 'var(--color-secondary)',
      data: proofData?.signature
    },
    {
      id: 'hash-validation',
      title: 'Hash Chain Validation',
      icon: 'Link',
      color: 'var(--color-success)',
      data: proofData?.hashChain
    },
    {
      id: 'rng-proof',
      title: 'RNG Draw Authenticity',
      icon: 'Shuffle',
      color: 'var(--color-accent)',
      data: proofData?.rng
    }
  ];

  return (
    <div className="bg-card rounded-xl p-4 md:p-6 border border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="ShieldCheck" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
            Cryptographic Proof Validation
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">
            Zero-knowledge proof verification results
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {sections?.map((section) => (
          <div 
            key={section?.id}
            className="border border-border rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleSection(section?.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-all duration-250"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                  <Icon name={section?.icon} size={16} color={section?.color} />
                </div>
                <div className="text-left">
                  <h4 className="text-sm md:text-base font-heading font-semibold text-foreground">
                    {section?.title}
                  </h4>
                  <p className={`text-xs font-medium ${
                    section?.data?.valid ? 'text-success' : 'text-error'
                  }`}>
                    {section?.data?.valid ? 'Verified' : 'Failed'}
                  </p>
                </div>
              </div>
              <Icon 
                name="ChevronDown" 
                size={20} 
                className={`transition-transform duration-250 ${
                  expandedSection === section?.id ? 'rotate-180' : ''
                }`}
              />
            </button>

            {expandedSection === section?.id && (
              <div className="p-4 bg-muted/20 border-t border-border space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-card rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Algorithm</p>
                    <p className="text-sm font-data font-medium text-foreground">
                      {section?.data?.algorithm}
                    </p>
                  </div>
                  <div className="p-3 bg-card rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Key Length</p>
                    <p className="text-sm font-data font-medium text-foreground">
                      {section?.data?.keyLength} bits
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-card rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground">Proof Hash</p>
                    <Button variant="ghost" size="xs" iconName="Copy">
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs font-data text-foreground break-all">
                    {section?.data?.proofHash}
                  </p>
                </div>

                <div className="p-3 bg-card rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Verification Details</p>
                  <div className="space-y-2">
                    {section?.data?.details?.map((detail, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Icon 
                          name={detail?.passed ? 'Check' : 'X'} 
                          size={14} 
                          className={detail?.passed ? 'text-success' : 'text-error'}
                        />
                        <span className="text-xs text-foreground">{detail?.message}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-card rounded-lg">
                  <Icon name="Clock" size={14} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Verified at: {section?.data?.timestamp}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptographicProof;