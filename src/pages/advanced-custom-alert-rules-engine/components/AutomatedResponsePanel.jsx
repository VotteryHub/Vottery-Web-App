import React from 'react';
import Icon from '../../../components/AppIcon';

const AutomatedResponsePanel = ({ rules }) => {
  const rulesWithAutoResponse = rules?.filter(r => r?.autoResponseEnabled);

  return (
    <div className="card p-6">
      <h2 className="text-xl font-heading font-bold text-foreground mb-4">
        Automated Response Workflows
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Configure automated actions for compliance submissions, incident escalations, and stakeholder notifications
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-background rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="FileText" size={20} className="text-primary" />
            <p className="text-sm font-medium text-foreground">Compliance</p>
          </div>
          <p className="text-2xl font-bold text-foreground">3</p>
          <p className="text-xs text-muted-foreground mt-1">Auto-submissions</p>
        </div>
        <div className="bg-background rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="AlertTriangle" size={20} className="text-red-600" />
            <p className="text-sm font-medium text-foreground">Incidents</p>
          </div>
          <p className="text-2xl font-bold text-foreground">5</p>
          <p className="text-xs text-muted-foreground mt-1">Auto-escalations</p>
        </div>
        <div className="bg-background rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Bell" size={20} className="text-blue-600" />
            <p className="text-sm font-medium text-foreground">Notifications</p>
          </div>
          <p className="text-2xl font-bold text-foreground">12</p>
          <p className="text-xs text-muted-foreground mt-1">Auto-alerts</p>
        </div>
        <div className="bg-background rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Shield" size={20} className="text-green-600" />
            <p className="text-sm font-medium text-foreground">Fraud</p>
          </div>
          <p className="text-2xl font-bold text-foreground">7</p>
          <p className="text-xs text-muted-foreground mt-1">Auto-investigations</p>
        </div>
      </div>

      {rulesWithAutoResponse?.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
          <Icon name="Zap" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2">No automated response workflows configured</p>
          <p className="text-sm text-muted-foreground">
            Create rules with auto-response actions to see them here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {rulesWithAutoResponse?.map((rule, index) => (
            <div key={index} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">{rule?.ruleName}</h3>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  Auto-Response Enabled
                </span>
              </div>
              <div className="space-y-2">
                {rule?.autoResponseActions?.map((action, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-foreground bg-background rounded-lg p-2">
                    <Icon name="Zap" size={16} className="text-primary" />
                    <span className="capitalize">{action?.type?.replace(/_/g, ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutomatedResponsePanel;