import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RuleTemplatesPanel = ({ templates, onUseTemplate }) => {
  const [using, setUsing] = React.useState(null);

  const handleUseTemplate = async (template) => {
    try {
      setUsing(template?.id);
      const result = await onUseTemplate({
        ruleName: template?.name,
        description: template?.description,
        category: template?.category,
        severity: template?.severity,
        conditionLogic: template?.conditionLogic,
        thresholdConfig: template?.thresholdConfig,
        isEnabled: false
      });

      if (result?.success) {
        alert('Template applied successfully! You can now customize it.');
      } else {
        alert(`Failed to apply template: ${result?.error?.message}`);
      }
    } catch (error) {
      alert(`Error: ${error?.message}`);
    } finally {
      setUsing(null);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'text-red-600 bg-red-50 dark:bg-red-900/20',
      high: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
      medium: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
      low: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
    };
    return colors?.[severity] || colors?.medium;
  };

  return (
    <div className="space-y-4">
      <div className="card bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Pre-built Rule Templates</p>
            <p className="text-xs text-muted-foreground">
              Use these templates as starting points for common alert scenarios. You can customize them after applying.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates?.map((template) => (
          <div key={template?.id} className="card border border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-foreground">{template?.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getSeverityColor(template?.severity)}`}>
                    {template?.severity?.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{template?.description}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon name="Tag" size={12} />
                <span>{template?.category?.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon name="GitBranch" size={12} />
                <span>{template?.conditionLogic?.operator} logic</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon name="List" size={12} />
                <span>
                  {(template?.conditionLogic?.conditions?.length || 0) + 
                   (template?.conditionLogic?.nestedGroups?.length || 0)} conditions
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              iconName="Download"
              onClick={() => handleUseTemplate(template)}
              disabled={using === template?.id}
              className="w-full"
            >
              {using === template?.id ? 'Applying...' : 'Use Template'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RuleTemplatesPanel;