import React from 'react';
import Icon from '../../../components/AppIcon';

const AutomatedActionPanel = ({ screeningStats }) => {
  const automationRules = [
    {
      id: 1,
      name: 'High Confidence Block',
      condition: 'Confidence > 95% AND Severity = Critical',
      action: 'Automatic Block',
      status: 'active',
      triggered: 234
    },
    {
      id: 2,
      name: 'Moderate Risk Flag',
      condition: 'Confidence > 80% AND Severity = High',
      action: 'Flag for Review',
      status: 'active',
      triggered: 567
    },
    {
      id: 3,
      name: 'Low Confidence Review',
      condition: 'Confidence < 70%',
      action: 'Human Review Required',
      status: 'active',
      triggered: 123
    },
    {
      id: 4,
      name: 'Edge Case Escalation',
      condition: 'Edge Case Complexity > 60%',
      action: 'Escalate to Senior Moderator',
      status: 'active',
      triggered: 89
    }
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Automated Action Coordination
          </h2>
          <p className="text-sm text-muted-foreground">
            Intelligent escalation workflows and confidence-based automation
          </p>
        </div>
        <Icon name="Zap" size={24} className="text-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-success/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="CheckCircle" size={18} className="text-success" />
            <span className="text-sm text-muted-foreground">Auto-Approved</span>
          </div>
          <p className="text-3xl font-heading font-bold text-foreground">
            {screeningStats?.approved || 0}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs text-success">
              {screeningStats?.approvalRate || 0}% approval rate
            </span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-warning/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Flag" size={18} className="text-warning" />
            <span className="text-sm text-muted-foreground">Auto-Flagged</span>
          </div>
          <p className="text-3xl font-heading font-bold text-foreground">
            {screeningStats?.flagged || 0}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs text-warning">
              {screeningStats?.flagRate || 0}% flag rate
            </span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Users" size={18} className="text-primary" />
            <span className="text-sm text-muted-foreground">Human Review</span>
          </div>
          <p className="text-3xl font-heading font-bold text-foreground">
            {screeningStats?.underReview || 0}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs text-primary">Pending review</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Active Automation Rules
        </h3>
        <div className="space-y-3">
          {automationRules?.map((rule) => (
            <div key={rule?.id} className="p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-foreground mb-1">{rule?.name}</h4>
                  <p className="text-sm text-muted-foreground">{rule?.condition}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  rule?.status === 'active' ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
                }`}>
                  {rule?.status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="Zap" size={14} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    Action: {rule?.action}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Triggered: {rule?.triggered} times
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-primary/10">
          <div className="flex items-start gap-3">
            <Icon name="Brain" size={18} className="text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground mb-1">Learning from Decisions</h4>
              <p className="text-sm text-muted-foreground">
                System learns from human moderator decisions and appeal outcomes to improve accuracy
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-success/10">
          <div className="flex items-start gap-3">
            <Icon name="Shield" size={18} className="text-success mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground mb-1">Bias Detection</h4>
              <p className="text-sm text-muted-foreground">
                Continuous monitoring for bias in AI analysis with comprehensive audit trails
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 rounded-lg bg-warning/10 border border-warning">
        <div className="flex items-start gap-3">
          <Icon name="AlertCircle" size={18} className="text-warning mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-1">Human Oversight Required</h4>
            <p className="text-sm text-muted-foreground mb-2">
              The following scenarios always require human review:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Confidence score below 70%</li>
              <li>• Edge case complexity above 60%</li>
              <li>• Conflicting policy interpretations</li>
              <li>• Appeals from content creators</li>
              <li>• High-profile or sensitive content</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomatedActionPanel;