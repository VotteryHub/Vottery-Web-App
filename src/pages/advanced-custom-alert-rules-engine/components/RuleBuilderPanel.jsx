import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RuleBuilderPanel = ({ onCreateRule, templates, onRefresh }) => {
  const [ruleName, setRuleName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('cross_system');
  const [severity, setSeverity] = useState('high');
  const [conditions, setConditions] = useState([]);
  const [operator, setOperator] = useState('AND');
  const [autoResponseEnabled, setAutoResponseEnabled] = useState(true);
  const [selectedActions, setSelectedActions] = useState([]);
  const [creating, setCreating] = useState(false);

  const handleAddCondition = () => {
    setConditions([...conditions, {
      field: '',
      operator: 'greater_than',
      value: '',
      dataSource: 'fraud'
    }]);
  };

  const handleRemoveCondition = (index) => {
    setConditions(conditions?.filter((_, i) => i !== index));
  };

  const handleConditionChange = (index, field, value) => {
    const updated = [...conditions];
    updated[index][field] = value;
    setConditions(updated);
  };

  const handleAddAction = (actionType) => {
    setSelectedActions([...selectedActions, { type: actionType, config: {} }]);
  };

  const handleRemoveAction = (index) => {
    setSelectedActions(selectedActions?.filter((_, i) => i !== index));
  };

  const handleCreateRule = async () => {
    if (!ruleName || conditions?.length === 0) {
      alert('Please provide rule name and at least one condition');
      return;
    }

    setCreating(true);
    const ruleConfig = {
      ruleName,
      description,
      category,
      severity,
      conditionLogic: {
        operator,
        conditions
      },
      autoResponseEnabled,
      autoResponseActions: selectedActions
    };

    const result = await onCreateRule(ruleConfig);
    if (result?.success) {
      setRuleName('');
      setDescription('');
      setConditions([]);
      setSelectedActions([]);
      alert('Rule created successfully!');
      onRefresh();
    } else {
      alert(`Failed to create rule: ${result?.error?.message}`);
    }
    setCreating(false);
  };

  const handleUseTemplate = (template) => {
    setRuleName(template?.name);
    setDescription(template?.description);
    setCategory(template?.category);
    setSeverity(template?.severity);
    setConditions(template?.conditionLogic?.conditions || []);
    setOperator(template?.conditionLogic?.operator || 'AND');
    setSelectedActions(template?.autoResponseActions || []);
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-xl font-heading font-bold text-foreground mb-4">
          Build Custom Alert Rule
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Rule Name *
              </label>
              <input
                type="text"
                value={ruleName}
                onChange={(e) => setRuleName(e?.target?.value)}
                placeholder="e.g., High Fraud + Low ROI Alert"
                className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e?.target?.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e?.target?.value)}
              placeholder="Describe when this rule should trigger..."
              rows={3}
              className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-foreground">
                Conditions *
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={operator}
                  onChange={(e) => setOperator(e?.target?.value)}
                  className="px-3 py-1 border border-border rounded-lg bg-card text-foreground text-sm"
                >
                  <option value="AND">AND (All conditions)</option>
                  <option value="OR">OR (Any condition)</option>
                </select>
                <Button
                  variant="secondary"
                  iconName="Plus"
                  onClick={handleAddCondition}
                  size="sm"
                >
                  Add Condition
                </Button>
              </div>
            </div>

            {conditions?.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                <Icon name="Plus" size={32} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No conditions added yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {conditions?.map((condition, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-background rounded-lg">
                    <select
                      value={condition?.dataSource}
                      onChange={(e) => handleConditionChange(index, 'dataSource', e?.target?.value)}
                      className="px-3 py-2 border border-border rounded-lg bg-card text-foreground text-sm"
                    >
                      <option value="fraud">Fraud Data</option>
                      <option value="financial">Financial Data</option>
                      <option value="compliance">Compliance Data</option>
                    </select>
                    <input
                      type="text"
                      value={condition?.field}
                      onChange={(e) => handleConditionChange(index, 'field', e?.target?.value)}
                      placeholder="Field name"
                      className="flex-1 px-3 py-2 border border-border rounded-lg bg-card text-foreground text-sm"
                    />
                    <select
                      value={condition?.operator}
                      onChange={(e) => handleConditionChange(index, 'operator', e?.target?.value)}
                      className="px-3 py-2 border border-border rounded-lg bg-card text-foreground text-sm"
                    >
                      <option value="equals">Equals</option>
                      <option value="not_equals">Not Equals</option>
                      <option value="greater_than">Greater Than</option>
                      <option value="less_than">Less Than</option>
                      <option value="contains">Contains</option>
                    </select>
                    <input
                      type="text"
                      value={condition?.value}
                      onChange={(e) => handleConditionChange(index, 'value', e?.target?.value)}
                      placeholder="Value"
                      className="w-32 px-3 py-2 border border-border rounded-lg bg-card text-foreground text-sm"
                    />
                    <button
                      onClick={() => handleRemoveCondition(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Icon name="Trash2" size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-foreground">
                Automated Response Actions
              </label>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={autoResponseEnabled}
                    onChange={(e) => setAutoResponseEnabled(e?.target?.checked)}
                    className="rounded"
                  />
                  Enable Auto-Response
                </label>
              </div>
            </div>

            {autoResponseEnabled && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    iconName="Plus"
                    onClick={() => handleAddAction('trigger_fraud_investigation')}
                    size="sm"
                  >
                    Fraud Investigation
                  </Button>
                  <Button
                    variant="secondary"
                    iconName="Plus"
                    onClick={() => handleAddAction('create_compliance_submission')}
                    size="sm"
                  >
                    Compliance Submission
                  </Button>
                  <Button
                    variant="secondary"
                    iconName="Plus"
                    onClick={() => handleAddAction('notify_stakeholders')}
                    size="sm"
                  >
                    Notify Stakeholders
                  </Button>
                  <Button
                    variant="secondary"
                    iconName="Plus"
                    onClick={() => handleAddAction('pause_election')}
                    size="sm"
                  >
                    Pause Election
                  </Button>
                </div>

                {selectedActions?.length > 0 && (
                  <div className="space-y-2">
                    {selectedActions?.map((action, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg">
                        <span className="text-sm text-foreground capitalize">
                          {action?.type?.replace(/_/g, ' ')}
                        </span>
                        <button
                          onClick={() => handleRemoveAction(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Icon name="X" size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              variant="secondary"
              onClick={() => {
                setRuleName('');
                setDescription('');
                setConditions([]);
                setSelectedActions([]);
              }}
            >
              Reset
            </Button>
            <Button
              variant="primary"
              iconName="Save"
              onClick={handleCreateRule}
              disabled={creating}
            >
              {creating ? 'Creating...' : 'Create Rule'}
            </Button>
          </div>
        </div>
      </div>
      {templates?.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-heading font-bold text-foreground mb-4">
            Rule Templates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates?.map((template, index) => (
              <div key={index} className="border border-border rounded-lg p-4 hover:bg-card-hover transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-foreground">{template?.name}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    template?.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    template?.severity === 'high'? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {template?.severity}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{template?.description}</p>
                <Button
                  variant="secondary"
                  iconName="Copy"
                  onClick={() => handleUseTemplate(template)}
                  size="sm"
                  className="w-full"
                >
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RuleBuilderPanel;