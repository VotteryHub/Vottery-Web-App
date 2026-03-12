import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';


const QuickActionsPanel = () => {
  const quickActions = [
    {
      label: 'Create Election',
      icon: 'Plus',
      path: '/election-creation-studio',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Vote Now',
      icon: 'Vote',
      path: '/secure-voting-interface',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'Verify Vote',
      icon: 'ShieldCheck',
      path: '/vote-verification-portal',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      label: 'View Audit',
      icon: 'FileSearch',
      path: '/blockchain-audit-portal',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  return (
    <div className="card mb-4 md:mb-6">
      <h2 className="text-lg md:text-xl font-heading font-bold text-foreground mb-4 md:mb-6">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {quickActions?.map((action) => (
          <Link
            key={action?.path}
            to={action?.path}
            className="flex flex-col items-center gap-2 md:gap-3 p-4 md:p-6 rounded-xl border border-border hover:border-primary/50 hover:shadow-democratic-md transition-all duration-250"
          >
            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${action?.bgColor} flex items-center justify-center`}>
              <Icon name={action?.icon} size={28} strokeWidth={2.5} className={action?.color} />
            </div>
            <span className="text-xs md:text-sm font-medium text-foreground text-center">
              {action?.label}
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-heading font-semibold text-foreground">
            Your Stats
          </h3>
          <Icon name="TrendingUp" size={16} className="text-success" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs md:text-sm text-muted-foreground">Votes Cast</span>
            <span className="font-data font-semibold text-sm md:text-base text-foreground">47</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs md:text-sm text-muted-foreground">Elections Created</span>
            <span className="font-data font-semibold text-sm md:text-base text-foreground">12</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs md:text-sm text-muted-foreground">Verifications</span>
            <span className="font-data font-semibold text-sm md:text-base text-foreground">23</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPanel;