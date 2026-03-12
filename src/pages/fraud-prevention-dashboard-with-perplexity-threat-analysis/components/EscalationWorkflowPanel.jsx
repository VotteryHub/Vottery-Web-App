import React from 'react';
import Icon from '../../../components/AppIcon';

const EscalationWorkflowPanel = ({ escalations, onRefresh }) => {
  if (!escalations || escalations?.length === 0) {
    return (
      <div className="card p-8 text-center">
        <Icon name="CheckCircle" size={48} className="mx-auto text-green-500 mb-4" />
        <p className="text-muted-foreground">No active escalations</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="ArrowUp" size={20} className="text-primary" />
          Active Escalation Workflows
        </h3>
        <div className="space-y-4">
          {escalations?.map((escalation) => (
            <div key={escalation?.id} className="p-4 bg-muted/50 rounded-lg border-l-4 border-red-500">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-foreground">{escalation?.type}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  escalation?.priority === 'critical' ? 'bg-red-100 text-red-700' :
                  escalation?.priority === 'high'? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                }`}>
                  {escalation?.priority} priority
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium text-foreground capitalize">{escalation?.status}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Assigned To</p>
                  <p className="font-medium text-foreground">{escalation?.assignedTo}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium text-foreground">{escalation?.createdAt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EscalationWorkflowPanel;