import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="mb-6 md:mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground">
          Step {currentStep} of {totalSteps}
        </h2>
        <span className="text-sm text-muted-foreground">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </span>
      </div>
      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-10" />
        <div
          className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500 -z-10"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />

        <div className="flex justify-between">
          {steps?.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <div key={step?.id} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-250 ${
                    isCompleted
                      ? 'bg-primary text-primary-foreground'
                      : isCurrent
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isCompleted ? (
                    <Icon name="Check" size={20} />
                  ) : (
                    <span className="text-sm font-heading font-semibold">
                      {stepNumber}
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs mt-2 text-center hidden md:block ${
                    isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground'
                  }`}
                >
                  {step?.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="md:hidden mt-4 text-center">
        <p className="text-sm font-medium text-foreground">
          {steps?.[currentStep - 1]?.label}
        </p>
      </div>
    </div>
  );
};

export default ProgressIndicator;