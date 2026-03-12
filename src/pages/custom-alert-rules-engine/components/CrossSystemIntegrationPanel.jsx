import React from 'react';
import Icon from '../../../components/AppIcon';

const CrossSystemIntegrationPanel = () => {
  const integrationSystems = [
    {
      id: 'team_collaboration',
      name: 'Team Collaboration Center',
      icon: 'Users',
      status: 'connected',
      triggers: ['task_created', 'discussion_started', 'goal_updated'],
      actions: ['create_task', 'send_notification', 'update_status']
    },
    {
      id: 'financial_tracking',
      name: 'Financial Tracking Center',
      icon: 'DollarSign',
      status: 'connected',
      triggers: ['transaction_anomaly', 'threshold_exceeded', 'forecast_alert'],
      actions: ['freeze_account', 'send_alert', 'create_report']
    },
    {
      id: 'fraud_detection',
      name: 'Fraud Detection Center',
      icon: 'Shield',
      status: 'connected',
      triggers: ['fraud_detected', 'threat_identified', 'pattern_matched'],
      actions: ['block_transaction', 'escalate_incident', 'trigger_investigation']
    },
    {
      id: 'compliance',
      name: 'Compliance Dashboard',
      icon: 'FileText',
      status: 'connected',
      triggers: ['policy_violation', 'regulatory_flag', 'audit_required'],
      actions: ['generate_report', 'notify_stakeholders', 'create_submission']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="card bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Icon name="Share2" size={20} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Cross-System Integration</p>
            <p className="text-xs text-muted-foreground">
              Configure alert rules to trigger actions across multiple platform systems with automated correlation analysis and cascading workflows.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrationSystems?.map((system) => (
          <div key={system?.id} className="card border border-border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon name={system?.icon} size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{system?.name}</h3>
                  <span className={`inline-flex items-center gap-1 text-xs ${
                    system?.status === 'connected' ?'text-green-600' :'text-gray-600'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      system?.status === 'connected' ? 'bg-green-600' : 'bg-gray-600'
                    }`} />
                    {system?.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-foreground mb-2 flex items-center gap-1">
                  <Icon name="Zap" size={12} />
                  Available Triggers
                </p>
                <div className="flex flex-wrap gap-1">
                  {system?.triggers?.map((trigger, idx) => (
                    <span key={idx} className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground">
                      {trigger}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-foreground mb-2 flex items-center gap-1">
                  <Icon name="Play" size={12} />
                  Available Actions
                </p>
                <div className="flex flex-wrap gap-1">
                  {system?.actions?.map((action, idx) => (
                    <span key={idx} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                      {action}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="GitBranch" size={20} />
          Cascading Workflow Example
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-red-600">1</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-1">Fraud Detection Trigger</p>
              <p className="text-xs text-muted-foreground">High-risk transaction detected with fraud score &gt; 85</p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Icon name="ArrowDown" size={20} className="text-muted-foreground" />
          </div>

          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-orange-600">2</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-1">Financial Tracking Action</p>
              <p className="text-xs text-muted-foreground">Automatically freeze account and block transaction</p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Icon name="ArrowDown" size={20} className="text-muted-foreground" />
          </div>

          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-yellow-600">3</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-1">Team Collaboration Notification</p>
              <p className="text-xs text-muted-foreground">Create investigation task and notify security team</p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Icon name="ArrowDown" size={20} className="text-muted-foreground" />
          </div>

          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-green-600">4</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-1">Compliance Report Generation</p>
              <p className="text-xs text-muted-foreground">Generate incident report and prepare regulatory submission</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossSystemIntegrationPanel;