import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const AutomatedActionPanel = () => {
  const [automationData] = useState({
    automationRules: [
      {
        id: 1,
        name: 'High Confidence Misinformation Block',
        trigger: 'Misinformation confidence > 95%',
        action: 'Automatic block + notification',
        status: 'Active',
        executionCount: 234,
        accuracy: 98.7
      },
      {
        id: 2,
        name: 'Edge Case Human Review',
        trigger: 'Edge case complexity > 70%',
        action: 'Queue for human review',
        status: 'Active',
        executionCount: 456,
        accuracy: 96.2
      },
      {
        id: 3,
        name: 'Low Severity Warning',
        trigger: 'Policy violation severity: low',
        action: 'Issue warning + educational content',
        status: 'Active',
        executionCount: 1234,
        accuracy: 94.3
      }
    ],
    escalationWorkflow: {
      autoResolved: 78.3,
      humanReview: 18.4,
      escalatedToAdmin: 3.3
    },
    auditTrail: [
      {
        id: 1,
        timestamp: '2 hours ago',
        action: 'Blocked misinformation',
        confidence: 97.8,
        outcome: 'Successful',
        appealStatus: 'None'
      },
      {
        id: 2,
        timestamp: '5 hours ago',
        action: 'Queued for review',
        confidence: 72.3,
        outcome: 'Pending',
        appealStatus: 'Under review'
      }
    ]
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
          Automated Action Coordination
        </h2>
        <p className="text-sm text-muted-foreground">
          Intelligent escalation workflows and confidence-based automation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-card rounded-lg border border-border">
          <Icon name="Zap" size={24} className="text-success mb-2" />
          <p className="text-2xl font-bold text-foreground mb-1">{automationData?.escalationWorkflow?.autoResolved}%</p>
          <p className="text-sm text-muted-foreground">Auto-Resolved</p>
        </div>
        <div className="p-6 bg-card rounded-lg border border-border">
          <Icon name="Users" size={24} className="text-warning mb-2" />
          <p className="text-2xl font-bold text-foreground mb-1">{automationData?.escalationWorkflow?.humanReview}%</p>
          <p className="text-sm text-muted-foreground">Human Review</p>
        </div>
        <div className="p-6 bg-card rounded-lg border border-border">
          <Icon name="AlertCircle" size={24} className="text-destructive mb-2" />
          <p className="text-2xl font-bold text-foreground mb-1">{automationData?.escalationWorkflow?.escalatedToAdmin}%</p>
          <p className="text-sm text-muted-foreground">Admin Escalation</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Active Automation Rules</h3>
        <div className="space-y-3">
          {automationData?.automationRules?.map((rule) => (
            <div key={rule?.id} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{rule?.name}</h4>
                  <p className="text-sm text-muted-foreground">Trigger: {rule?.trigger}</p>
                  <p className="text-sm text-muted-foreground">Action: {rule?.action}</p>
                </div>
                <span className="px-3 py-1 text-xs font-medium bg-success/10 text-success rounded-md">
                  {rule?.status}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Executions</p>
                  <p className="text-sm font-bold text-foreground">{rule?.executionCount}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Accuracy</p>
                  <p className="text-sm font-bold text-success">{rule?.accuracy}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Audit Trail</h3>
        <div className="space-y-3">
          {automationData?.auditTrail?.map((entry) => (
            <div key={entry?.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">{entry?.action}</p>
                <p className="text-xs text-muted-foreground mt-1">{entry?.timestamp} • Confidence: {entry?.confidence}%</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 text-xs font-medium rounded-md ${
                  entry?.outcome === 'Successful' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                }`}>
                  {entry?.outcome}
                </span>
                {entry?.appealStatus !== 'None' && (
                  <span className="px-3 py-1 text-xs font-medium bg-blue-500/10 text-blue-600 rounded-md">
                    {entry?.appealStatus}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutomatedActionPanel;