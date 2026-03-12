import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ElectionApprovalCard = ({ election, onApprove, onReject }) => {
  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-warning/10', text: 'text-warning', label: 'Pending Review' },
      approved: { bg: 'bg-success/10', text: 'text-success', label: 'Approved' },
      rejected: { bg: 'bg-destructive/10', text: 'text-destructive', label: 'Rejected' },
      active: { bg: 'bg-primary/10', text: 'text-primary', label: 'Active' },
    };
    const badge = badges?.[status] || badges?.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge?.bg} ${badge?.text}`}>
        {badge?.label}
      </span>
    );
  };

  return (
    <div className="card hover:shadow-democratic-md transition-all duration-250">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={election?.coverImage}
            alt={election?.coverImageAlt}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-heading font-semibold text-foreground truncate mb-1">
                {election?.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {election?.description}
              </p>
            </div>
            {getStatusBadge(election?.status)}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Icon name="User" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Creator</p>
                <p className="text-sm font-medium text-foreground truncate">{election?.creator}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Calendar" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Start Date</p>
                <p className="text-sm font-medium text-foreground font-data">{election?.startDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Users" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Participants</p>
                <p className="text-sm font-medium text-foreground font-data">{election?.participants}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="DollarSign" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Fee Type</p>
                <p className="text-sm font-medium text-foreground">{election?.feeType}</p>
              </div>
            </div>
          </div>

          {election?.status === 'pending' && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="success"
                size="sm"
                iconName="Check"
                iconPosition="left"
                onClick={() => onApprove(election?.id)}
              >
                Approve
              </Button>
              <Button
                variant="destructive"
                size="sm"
                iconName="X"
                iconPosition="left"
                onClick={() => onReject(election?.id)}
              >
                Reject
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Eye"
                iconPosition="left"
              >
                Review Details
              </Button>
            </div>
          )}

          {election?.status === 'active' && (
            <div className="flex items-center gap-2">
              <div className="crypto-indicator">
                <Icon name="Activity" size={14} />
                <span className="text-xs font-medium">Live Voting</span>
              </div>
              <Button variant="outline" size="sm" iconName="BarChart3">
                View Analytics
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ElectionApprovalCard;