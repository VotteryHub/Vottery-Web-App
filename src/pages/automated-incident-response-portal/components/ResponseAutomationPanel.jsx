import React from 'react';
import Icon from '../../../components/AppIcon';

const ResponseAutomationPanel = ({ incidents }) => {
  const automationStats = {
    totalAutomatedActions: incidents?.reduce((sum, i) => sum + (i?.automatedActionsTaken?.length || 0), 0),
    accountsFrozen: incidents?.filter(i => i?.automatedActionsTaken?.some(a => a?.action === 'freeze_account'))?.length || 0,
    transactionsBlocked: incidents?.filter(i => i?.automatedActionsTaken?.some(a => a?.action === 'block_transactions'))?.length || 0,
    alertsDistributed: incidents?.reduce((sum, i) => sum + (i?.stakeholdersNotified?.length || 0), 0)
  };

  const automationRules = [
    {
      trigger: 'Fraud Detection - High Risk',
      actions: ['Freeze Account', 'Block Transactions', 'Notify Security Team'],
      status: 'active',
      executionCount: 12
    },
    {
      trigger: 'Coordinated Attack Detected',
      actions: ['Rate Limit Enforcement', 'IP Blocking', 'Alert Distribution'],
      status: 'active',
      executionCount: 8
    },
    {
      trigger: 'Account Compromise',
      actions: ['Force Logout', 'Password Reset Required', 'Notify User'],
      status: 'active',
      executionCount: 5
    },
    {
      trigger: 'Payment Fraud',
      actions: ['Transaction Hold', 'Verification Required', 'Compliance Alert'],
      status: 'active',
      executionCount: 15
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Zap" size={24} className="text-yellow-600" />
            <span className="text-xs text-muted-foreground">Total</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{automationStats?.totalAutomatedActions}</p>
          <p className="text-sm text-muted-foreground">Automated Actions</p>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Lock" size={24} className="text-red-600" />
            <span className="text-xs text-muted-foreground">Frozen</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{automationStats?.accountsFrozen}</p>
          <p className="text-sm text-muted-foreground">Accounts Frozen</p>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Ban" size={24} className="text-orange-600" />
            <span className="text-xs text-muted-foreground">Blocked</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{automationStats?.transactionsBlocked}</p>
          <p className="text-sm text-muted-foreground">Transactions Blocked</p>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Bell" size={24} className="text-blue-600" />
            <span className="text-xs text-muted-foreground">Sent</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{automationStats?.alertsDistributed}</p>
          <p className="text-sm text-muted-foreground">Alerts Distributed</p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-heading font-bold text-foreground mb-4">Automation Rules</h2>
        <div className="space-y-3">
          {automationRules?.map((rule, index) => (
            <div key={index} className="p-4 border border-border rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">{rule?.trigger}</h3>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded text-xs font-medium">
                      {rule?.status?.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Executed {rule?.executionCount} times in the last 30 days
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {rule?.actions?.map((action, idx) => (
                      <span key={idx} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium flex items-center gap-1">
                        <Icon name="Zap" size={12} />
                        {action}
                      </span>
                    ))}
                  </div>
                </div>
                <Icon name="Settings" size={20} className="text-muted-foreground cursor-pointer hover:text-foreground" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-heading font-bold text-foreground mb-4">Workflow Orchestration</h2>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">Automated Response Workflow</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  When a high-severity incident is detected, the system automatically executes coordinated response actions:
                </p>
                <ol className="text-sm text-foreground space-y-2 list-decimal list-inside">
                  <li>Immediate threat containment (account freeze, transaction block)</li>
                  <li>Stakeholder notification (security team, compliance officer, executives)</li>
                  <li>Evidence collection and timeline reconstruction</li>
                  <li>Escalation to appropriate response team</li>
                  <li>Remediation tracking and effectiveness monitoring</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponseAutomationPanel;