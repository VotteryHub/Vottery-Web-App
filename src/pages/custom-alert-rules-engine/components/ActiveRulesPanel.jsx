import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { alertService } from '../../../services/alertService';

const ActiveRulesPanel = ({ rules, onRefresh }) => {
  const [updating, setUpdating] = React.useState(null);

  const handleToggleRule = async (ruleId, currentStatus) => {
    try {
      setUpdating(ruleId);
      const { error } = await alertService?.updateAlertRule(ruleId, { isEnabled: !currentStatus });
      if (error) throw new Error(error.message);
      await onRefresh();
    } catch (err) {
      console.error('Failed to toggle rule:', err);
    } finally {
      setUpdating(null);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200',
      high: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200',
      medium: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200',
      low: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200',
      info: 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 border-gray-200'
    };
    return colors?.[severity] || colors?.info;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {rules?.length} active {rules?.length === 1 ? 'rule' : 'rules'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {rules?.map((rule) => (
          <div key={rule?.id} className={`card border-l-4 ${
            rule?.isEnabled ? 'border-l-green-500' : 'border-l-gray-300'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-foreground">{rule?.ruleName}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getSeverityColor(rule?.severity)}`}>
                    {rule?.severity?.toUpperCase()}
                  </span>
                  {rule?.autoResponseEnabled && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                      <Icon name="Zap" size={12} />
                      Auto-response
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{rule?.description}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Icon name="Tag" size={12} />
                    {rule?.category?.replace(/_/g, ' ')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="GitBranch" size={12} />
                    {rule?.conditionLogic?.operator} logic
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="List" size={12} />
                    {rule?.conditionLogic?.conditions?.length || 0} conditions
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleToggleRule(rule?.id, rule?.isEnabled)}
                  disabled={updating === rule?.id}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    rule?.isEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  } ${updating === rule?.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      rule?.isEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <Button variant="outline" size="sm" iconName="Edit">
                  Edit
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {rules?.length === 0 && (
        <div className="card text-center py-12">
          <Icon name="Settings" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-heading font-semibold text-foreground mb-2">No active rules</h3>
          <p className="text-sm text-muted-foreground mb-4">Create your first custom alert rule to get started</p>
        </div>
      )}
    </div>
  );
};

export default ActiveRulesPanel;