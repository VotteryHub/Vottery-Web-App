import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentVerifications = ({ verifications }) => {
  if (!verifications || verifications?.length === 0) {
    return null;
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
          Recent Verifications
        </h3>
        <button className="text-sm font-medium text-primary hover:underline">
          View All
        </button>
      </div>
      <div className="space-y-3">
        {verifications?.map((verification) => (
          <div 
            key={verification?.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-all duration-250 cursor-pointer"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              verification?.status === 'verified' ? 'bg-success/10' : 'bg-destructive/10'
            }`}>
              <Icon 
                name={verification?.status === 'verified' ? 'CheckCircle' : 'XCircle'} 
                size={16} 
                color={verification?.status === 'verified' ? 'var(--color-success)' : 'var(--color-destructive)'} 
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate mb-1">
                {verification?.electionTitle}
              </p>
              <p className="text-xs text-muted-foreground">
                Verified {verification?.timestamp}
              </p>
            </div>
            <Icon name="ChevronRight" size={16} className="text-muted-foreground flex-shrink-0 mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentVerifications;