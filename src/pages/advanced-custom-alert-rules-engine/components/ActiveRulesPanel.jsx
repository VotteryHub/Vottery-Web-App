import React from 'react';
import Icon from '../../../components/AppIcon';

const ActiveRulesPanel = ({ rules }) => {
  const crossSystemRules = rules?.filter(r => r?.category === 'cross_system');

  return (
    <div className="card p-6">
      <h2 className="text-xl font-heading font-bold text-foreground mb-4">
        Active Alert Rules
      </h2>

      {crossSystemRules?.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="AlertCircle" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No active cross-system rules</p>
        </div>
      ) : (
        <div className="space-y-4">
          {crossSystemRules?.map((rule, index) => (
            <div key={index} className="border border-border rounded-lg p-4 hover:bg-card-hover transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">{rule?.ruleName}</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    rule?.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    rule?.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                    rule?.severity === 'medium'? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {rule?.severity}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    rule?.isEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {rule?.isEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{rule?.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Icon name="GitBranch" size={16} />
                  {rule?.conditionLogic?.conditions?.length || 0} conditions
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Icon name="Zap" size={16} />
                  {rule?.autoResponseActions?.length || 0} actions
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveRulesPanel;