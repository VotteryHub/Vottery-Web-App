import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { alertService } from '../../../services/alertService';

const AlertRulesPanel = ({ rules, onRefresh }) => {
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState(null);

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'fraud_detection', label: 'Fraud Detection' },
    { value: 'policy_violation', label: 'Policy Violation' },
    { value: 'performance_anomaly', label: 'Performance Anomaly' },
    { value: 'security_event', label: 'Security Event' },
    { value: 'system_health', label: 'System Health' }
  ];

  const filteredRules = filter === 'all' 
    ? rules 
    : rules?.filter(rule => rule?.category === filter);

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

  const getCategoryIcon = (category) => {
    const icons = {
      fraud_detection: 'Shield',
      policy_violation: 'AlertTriangle',
      performance_anomaly: 'Activity',
      security_event: 'Lock',
      system_health: 'Heart'
    };
    return icons?.[category] || 'Bell';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Select
            options={categoryOptions}
            value={filter}
            onChange={setFilter}
            className="w-64"
          />
          <span className="text-sm text-muted-foreground">
            {filteredRules?.length} {filteredRules?.length === 1 ? 'rule' : 'rules'}
          </span>
        </div>
        <Button variant="primary" size="sm" iconName="Plus">
          Create Rule
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredRules?.map((rule) => (
          <div key={rule?.id} className={`card border-l-4 ${
            rule?.isEnabled ? 'border-l-green-500' : 'border-l-gray-300'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  getSeverityColor(rule?.severity)?.split(' ')?.[1]
                }`}>
                  <Icon 
                    name={getCategoryIcon(rule?.category)} 
                    size={20} 
                    className={getSeverityColor(rule?.severity)?.split(' ')?.[0]} 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">{rule?.ruleName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getSeverityColor(rule?.severity)}`}>
                      {rule?.severity?.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{rule?.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon name="Tag" size={12} />
                      {rule?.category?.replace(/_/g, ' ')}
                    </span>
                    {rule?.autoResponseEnabled && (
                      <span className="flex items-center gap-1 text-primary">
                        <Icon name="Zap" size={12} />
                        Auto-response enabled
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Icon name="Clock" size={12} />
                      Created {new Date(rule?.createdAt)?.toLocaleDateString()}
                    </span>
                  </div>
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
                <Button variant="outline" size="sm" iconName="Settings">
                  Configure
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRules?.length === 0 && (
        <div className="card text-center py-12">
          <Icon name="Settings" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-heading font-semibold text-foreground mb-2">No alert rules found</h3>
          <p className="text-sm text-muted-foreground mb-4">Create your first alert rule to start monitoring</p>
          <Button variant="primary" iconName="Plus">
            Create Alert Rule
          </Button>
        </div>
      )}
    </div>
  );
};

export default AlertRulesPanel;