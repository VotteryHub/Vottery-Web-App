import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DisputeResolutionPanel = ({ tickets, onRefresh }) => {
  const [selectedDispute, setSelectedDispute] = useState(null);

  const disputeWorkflow = [
    { step: 1, label: 'Evidence Collection', icon: 'FileText', status: 'completed' },
    { step: 2, label: 'Investigation', icon: 'Search', status: 'in_progress' },
    { step: 3, label: 'Decision', icon: 'Scale', status: 'pending' },
    { step: 4, label: 'Resolution', icon: 'CheckCircle', status: 'pending' }
  ];

  const getStepColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'in_progress': return 'bg-blue-500 text-white';
      case 'pending': return 'bg-gray-300 text-gray-600';
      default: return 'bg-gray-300 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-1">
              Dispute Resolution Workflow
            </h2>
            <p className="text-sm text-muted-foreground">
              Structured workflows for payment disputes and policy violations
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
            <Icon name="AlertCircle" size={16} className="text-red-500" />
            <span className="text-sm font-medium text-red-500">
              {tickets?.length || 0} Active Disputes
            </span>
          </div>
        </div>

        {tickets?.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="CheckCircle" size={48} className="text-green-500 mx-auto mb-4" />
            <p className="text-muted-foreground">No active disputes at this time</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets?.map((dispute) => (
              <div key={dispute?.id} className="bg-background rounded-lg border border-red-500/20 p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-muted-foreground">{dispute?.ticketNumber}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 font-medium">
                        Billing Dispute
                      </span>
                      {dispute?.evidenceAttached && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-medium">
                          Evidence Attached
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-1">{dispute?.subject}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{dispute?.description}</p>
                    {dispute?.disputeAmount && (
                      <div className="flex items-center gap-2">
                        <Icon name="DollarSign" size={14} className="text-red-500" />
                        <span className="text-sm font-bold text-red-500">
                          Disputed Amount: ${dispute?.disputeAmount?.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDispute(dispute)}
                  >
                    Review
                  </Button>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Icon name="User" size={12} />
                      <span>{dispute?.createdBy}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Clock" size={12} />
                      <span>Opened {new Date(dispute?.createdAt)?.toLocaleDateString()}</span>
                    </div>
                    {dispute?.assignedTo && (
                      <div className="flex items-center gap-1">
                        <Icon name="UserCheck" size={12} />
                        <span>Assigned to {dispute?.assignedTo}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" iconName="MessageSquare">
                      Contact Customer
                    </Button>
                    <Button variant="outline" size="sm" iconName="FileText">
                      View Evidence
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-heading font-bold text-foreground mb-4">
          Dispute Resolution Process
        </h3>
        <div className="flex items-center justify-between mb-6">
          {disputeWorkflow?.map((step, index) => (
            <React.Fragment key={step?.step}>
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full ${getStepColor(step?.status)} flex items-center justify-center mb-2`}>
                  <Icon name={step?.icon} size={20} />
                </div>
                <p className="text-xs font-medium text-foreground text-center">{step?.label}</p>
                <p className="text-xs text-muted-foreground capitalize">{step?.status?.replace('_', ' ')}</p>
              </div>
              {index < disputeWorkflow?.length - 1 && (
                <div className="flex-1 h-0.5 bg-border mx-2 mt-6" />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Icon name="Info" size={20} className="text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-500 mb-1">Evidence Collection</p>
              <p className="text-xs text-muted-foreground">
                Gather all relevant documentation, transaction records, and customer communications.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <Icon name="Search" size={20} className="text-purple-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-purple-500 mb-1">Investigation</p>
              <p className="text-xs text-muted-foreground">
                Review evidence, verify claims, and consult with relevant teams for accurate assessment.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <Icon name="Scale" size={20} className="text-orange-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-orange-500 mb-1">Decision Making</p>
              <p className="text-xs text-muted-foreground">
                Determine resolution based on evidence, policy guidelines, and fair business practices.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <Icon name="CheckCircle" size={20} className="text-green-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-500 mb-1">Resolution & Communication</p>
              <p className="text-xs text-muted-foreground">
                Implement decision, process refunds if applicable, and communicate outcome to customer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisputeResolutionPanel;