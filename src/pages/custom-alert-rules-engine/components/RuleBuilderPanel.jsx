import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const RuleBuilderPanel = ({ onCreateRule, onRefresh }) => {
  const [ruleName, setRuleName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('fraud_detection');
  const [severity, setSeverity] = useState('high');
  const [conditionLogic, setConditionLogic] = useState({
    operator: 'AND',
    conditions: [],
    nestedGroups: []
  });
  const [thresholdConfig, setThresholdConfig] = useState({});
  const [autoResponseEnabled, setAutoResponseEnabled] = useState(false);
  const [autoResponseActions, setAutoResponseActions] = useState([]);
  const [creating, setCreating] = useState(false);

  const categoryOptions = [
    { value: 'fraud_detection', label: 'Fraud Detection' },
    { value: 'policy_violation', label: 'Policy Violation' },
    { value: 'performance_anomaly', label: 'Performance Anomaly' },
    { value: 'security_event', label: 'Security Event' },
    { value: 'system_health', label: 'System Health' }
  ];

  const severityOptions = [
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
    { value: 'info', label: 'Info' }
  ];

  const operatorOptions = [
    { value: 'AND', label: 'AND (All conditions must be true)' },
    { value: 'OR', label: 'OR (Any condition can be true)' },
    { value: 'NOT', label: 'NOT (Negate condition)' }
  ];

  const comparisonOperators = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'greater_than_or_equal', label: 'Greater Than or Equal' },
    { value: 'less_than_or_equal', label: 'Less Than or Equal' },
    { value: 'contains', label: 'Contains' },
    { value: 'not_contains', label: 'Does Not Contain' },
    { value: 'in_range', label: 'In Range' },
    { value: 'threshold_exceeded', label: 'Threshold Exceeded' }
  ];

  const addCondition = () => {
    setConditionLogic(prev => ({
      ...prev,
      conditions: [
        ...prev?.conditions,
        { field: '', operator: 'equals', value: '', dataSource: '' }
      ]
    }));
  };

  const updateCondition = (index, field, value) => {
    setConditionLogic(prev => ({
      ...prev,
      conditions: prev?.conditions?.map((cond, idx) =>
        idx === index ? { ...cond, [field]: value } : cond
      )
    }));
  };

  const removeCondition = (index) => {
    setConditionLogic(prev => ({
      ...prev,
      conditions: prev?.conditions?.filter((_, idx) => idx !== index)
    }));
  };

  const addNestedGroup = () => {
    setConditionLogic(prev => ({
      ...prev,
      nestedGroups: [
        ...prev?.nestedGroups,
        { operator: 'AND', conditions: [] }
      ]
    }));
  };

  const handleCreateRule = async () => {
    if (!ruleName || !description) {
      alert('Please fill in rule name and description');
      return;
    }

    if (conditionLogic?.conditions?.length === 0 && conditionLogic?.nestedGroups?.length === 0) {
      alert('Please add at least one condition');
      return;
    }

    try {
      setCreating(true);
      const result = await onCreateRule({
        ruleName,
        description,
        category,
        severity,
        conditionLogic,
        thresholdConfig,
        autoResponseEnabled,
        autoResponseActions,
        isEnabled: true
      });

      if (result?.success) {
        alert('Rule created successfully!');
        setRuleName('');
        setDescription('');
        setConditionLogic({ operator: 'AND', conditions: [], nestedGroups: [] });
        setThresholdConfig({});
        setAutoResponseActions([]);
        await onRefresh();
      } else {
        alert(`Failed to create rule: ${result?.error?.message}`);
      }
    } catch (error) {
      alert(`Error: ${error?.message}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="FileText" size={20} />
          Rule Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Rule Name"
            value={ruleName}
            onChange={(e) => setRuleName(e?.target?.value)}
            placeholder="Enter rule name"
          />
          <Select
            label="Category"
            options={categoryOptions}
            value={category}
            onChange={setCategory}
          />
          <div className="md:col-span-2">
            <Input
              label="Description"
              value={description}
              onChange={(e) => setDescription(e?.target?.value)}
              placeholder="Describe what this rule detects"
            />
          </div>
          <Select
            label="Severity"
            options={severityOptions}
            value={severity}
            onChange={setSeverity}
          />
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="GitBranch" size={20} />
          Boolean Logic Builder
        </h3>
        <div className="mb-4">
          <Select
            label="Logic Operator"
            options={operatorOptions}
            value={conditionLogic?.operator}
            onChange={(value) => setConditionLogic(prev => ({ ...prev, operator: value }))}
          />
        </div>

        <div className="space-y-4">
          {conditionLogic?.conditions?.map((condition, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground">Condition {index + 1}</span>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Trash2"
                  onClick={() => removeCondition(index)}
                >
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Input
                  placeholder="Field name"
                  value={condition?.field}
                  onChange={(e) => updateCondition(index, 'field', e?.target?.value)}
                />
                <Select
                  options={comparisonOperators}
                  value={condition?.operator}
                  onChange={(value) => updateCondition(index, 'operator', value)}
                />
                <Input
                  placeholder="Value"
                  value={condition?.value}
                  onChange={(e) => updateCondition(index, 'value', e?.target?.value)}
                />
                <Input
                  placeholder="Data source (optional)"
                  value={condition?.dataSource}
                  onChange={(e) => updateCondition(index, 'dataSource', e?.target?.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="outline" iconName="Plus" onClick={addCondition}>
            Add Condition
          </Button>
          <Button variant="outline" iconName="GitBranch" onClick={addNestedGroup}>
            Add Nested Group
          </Button>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Zap" size={20} />
          Automated Response
        </h3>
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setAutoResponseEnabled(!autoResponseEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              autoResponseEnabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                autoResponseEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="text-sm text-foreground">Enable automated response actions</span>
        </div>
        {autoResponseEnabled && (
          <p className="text-sm text-muted-foreground">
            Configure automated actions in the Cross-System Integration panel
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => {
          setRuleName('');
          setDescription('');
          setConditionLogic({ operator: 'AND', conditions: [], nestedGroups: [] });
        }}>
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
  );
};

export default RuleBuilderPanel;