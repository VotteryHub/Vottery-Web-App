import React from 'react';
import Icon from '../../../components/AppIcon';

const AttemptTracker = ({ currentAttempt, maxAttempts, passingScore }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="RefreshCw" size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Attempt {currentAttempt} of {maxAttempts}</p>
            <p className="text-xs text-muted-foreground">Passing score: {passingScore}%</p>
          </div>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: maxAttempts })?.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < currentAttempt - 1 ? 'bg-red-400' :
                i === currentAttempt - 1 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttemptTracker;
