import React from 'react';
import Icon from '../../../components/AppIcon';

const AuditProgress = ({ isRunning, progress, currentStep }) => {
  const steps = [
    { id: 1, label: 'Connecting to Blockchain', icon: 'Wifi' },
    { id: 2, label: 'Retrieving Transaction Data', icon: 'Download' },
    { id: 3, label: 'Validating Hash Chain', icon: 'Link' },
    { id: 4, label: 'Verifying Smart Contracts', icon: 'FileCode' },
    { id: 5, label: 'Generating Report', icon: 'FileText' }
  ];

  if (!isRunning) return null;

  return (
    <div className="bg-card rounded-xl p-4 md:p-6 border border-border">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
          <Icon name="Activity" size={20} color="var(--color-accent)" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
            Audit in Progress
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">
            {steps?.[currentStep - 1]?.label}
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="relative">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs font-data text-muted-foreground">0%</span>
            <span className="text-xs font-data font-medium text-foreground">{progress}%</span>
            <span className="text-xs font-data text-muted-foreground">100%</span>
          </div>
        </div>

        <div className="space-y-2">
          {steps?.map((step) => (
            <div 
              key={step?.id}
              className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-250 ${
                step?.id === currentStep 
                  ? 'bg-primary/10' 
                  : step?.id < currentStep 
                    ? 'bg-success/10' :'bg-muted/30'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                step?.id === currentStep 
                  ? 'bg-primary' 
                  : step?.id < currentStep 
                    ? 'bg-success' :'bg-muted'
              }`}>
                {step?.id < currentStep ? (
                  <Icon name="Check" size={14} color="white" />
                ) : step?.id === currentStep ? (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                ) : (
                  <span className="text-xs font-data text-muted-foreground">{step?.id}</span>
                )}
              </div>
              <span className={`text-xs md:text-sm font-medium ${
                step?.id <= currentStep ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step?.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuditProgress;