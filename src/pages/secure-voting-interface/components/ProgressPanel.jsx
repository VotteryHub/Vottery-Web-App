import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressPanel = ({ currentStep, mediaCompleted, encryptionProgress }) => {
  const steps = [
    { id: 1, label: 'View Media', icon: 'Play', completed: mediaCompleted },
    { id: 2, label: 'Cast Vote', icon: 'Vote', completed: currentStep > 2 },
    { id: 3, label: 'Encrypt & Sign', icon: 'Lock', completed: encryptionProgress === 100 },
    { id: 4, label: 'Verify Receipt', icon: 'CheckCircle', completed: currentStep === 4 },
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-4 md:p-6 lg:p-8 sticky top-20">
      <h2 className="font-heading font-semibold text-foreground text-lg mb-6">
        Voting Progress
      </h2>
      <div className="space-y-4">
        {steps?.map((step, index) => {
          const isActive = currentStep === step?.id;
          const isCompleted = step?.completed;

          return (
            <div key={step?.id} className="relative">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-250 ${
                    isCompleted
                      ? 'bg-success text-success-foreground'
                      : isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isCompleted ? (
                    <Icon name="Check" size={24} />
                  ) : (
                    <Icon name={step?.icon} size={24} />
                  )}
                </div>

                <div className="flex-1">
                  <p
                    className={`font-medium transition-all duration-250 ${
                      isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {step?.label}
                  </p>
                  {isActive && step?.id === 3 && encryptionProgress > 0 && encryptionProgress < 100 && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Encrypting...</span>
                        <span className="text-xs font-data font-semibold text-foreground">
                          {encryptionProgress}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${encryptionProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {index < steps?.length - 1 && (
                <div
                  className={`absolute left-6 top-12 w-0.5 h-8 transition-all duration-250 ${
                    isCompleted ? 'bg-success' : 'bg-border'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-8 pt-6 border-t border-border space-y-4">
        <div className="crypto-indicator">
          <Icon name="Shield" size={14} />
          <span className="text-xs font-medium">End-to-End Encrypted</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon name="Lock" size={14} />
            <span>RSA-2048 Encryption</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon name="FileSignature" size={14} />
            <span>Digital Signature</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon name="Hash" size={14} />
            <span>SHA-256 Hashing</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon name="Eye" size={14} />
            <span>Voter Anonymity Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPanel;