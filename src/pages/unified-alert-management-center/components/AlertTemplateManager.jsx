import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AlertTemplateManager = ({ templates, onRefresh }) => {
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const typeOptions = [
    { value: 'all', label: 'All Templates' },
    { value: 'fraud_detection', label: 'Fraud Detection' },
    { value: 'payment', label: 'Payment Confirmation' },
    { value: 'milestone', label: 'Milestone Alert' },
    { value: 'compliance', label: 'Compliance Notification' }
  ];

  const templateCategories = [
    {
      id: 'fraud_detection',
      label: 'Fraud Detection Templates',
      icon: 'ShieldAlert',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      templates: [
        {
          name: 'Critical Fraud Alert - SMS',
          channel: 'SMS',
          variables: ['alertId', 'fraudScore', 'entityType', 'timestamp'],
          preview: '🚨 CRITICAL FRAUD ALERT\n\nFraud Score: {{fraudScore}}/100\nEntity: {{entityType}}\nTime: {{timestamp}}\n\nImmediate action required.'
        },
        {
          name: 'Fraud Detection - Email',
          channel: 'Email',
          variables: ['alertTitle', 'description', 'confidence', 'affectedEntity'],
          preview: 'Subject: Fraud Alert - {{alertTitle}}\n\nA potential fraud event has been detected...'
        }
      ]
    },
    {
      id: 'payment',
      label: 'Payment Confirmation Templates',
      icon: 'CreditCard',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      templates: [
        {
          name: 'Payment Confirmation - SMS',
          channel: 'SMS',
          variables: ['amount', 'currency', 'transactionId', 'timestamp'],
          preview: '✅ Payment Confirmed\n\nAmount: {{currency}} {{amount}}\nTransaction: {{transactionId}}\nTime: {{timestamp}}'
        },
        {
          name: 'Payment Receipt - Email',
          channel: 'Email',
          variables: ['userName', 'amount', 'description', 'receiptUrl'],
          preview: 'Subject: Payment Receipt - {{amount}}\n\nDear {{userName}},\n\nYour payment has been processed...'
        }
      ]
    },
    {
      id: 'milestone',
      label: 'Milestone Alert Templates',
      icon: 'Target',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      templates: [
        {
          name: 'Campaign Milestone - In-App',
          channel: 'In-App',
          variables: ['campaignName', 'milestone', 'currentValue', 'targetValue'],
          preview: '🎯 Milestone Achieved!\n\n{{campaignName}} has reached {{milestone}}\nCurrent: {{currentValue}} / Target: {{targetValue}}'
        },
        {
          name: 'Revenue Threshold - Email',
          channel: 'Email',
          variables: ['threshold', 'actualRevenue', 'percentageIncrease'],
          preview: 'Subject: Revenue Milestone Reached\n\nCongratulations! Your campaign has exceeded the {{threshold}} threshold...'
        }
      ]
    },
    {
      id: 'compliance',
      label: 'Compliance Notification Templates',
      icon: 'FileCheck',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      templates: [
        {
          name: 'Compliance Alert - Email',
          channel: 'Email',
          variables: ['violationType', 'severity', 'entityId', 'actionRequired'],
          preview: 'Subject: Compliance Alert - {{violationType}}\n\nSeverity: {{severity}}\nEntity: {{entityId}}\n\nAction Required: {{actionRequired}}'
        },
        {
          name: 'Policy Violation - SMS',
          channel: 'SMS',
          variables: ['policyName', 'violationCount'],
          preview: '⚠️ Policy Violation Detected\n\nPolicy: {{policyName}}\nViolations: {{violationCount}}\n\nReview required.'
        }
      ]
    }
  ];

  const filteredCategories = templateCategories?.filter(cat => 
    selectedType === 'all' || cat?.id === selectedType
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              icon="Search"
            />
          </div>
          <div className="w-full md:w-64">
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e?.target?.value)}
              options={typeOptions}
            />
          </div>
          <Button iconName="Plus">New Template</Button>
        </div>
      </div>

      {/* Template Categories */}
      {filteredCategories?.map((category) => (
        <div key={category?.id} className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category?.bgColor}`}>
              <Icon name={category?.icon} size={20} className={category?.color} />
            </div>
            <h3 className="text-lg font-heading font-semibold text-foreground">{category?.label}</h3>
          </div>

          <div className="space-y-4">
            {category?.templates?.map((template, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{template?.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                        {template?.channel}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {template?.variables?.length} variables
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" iconName="Edit" />
                    <Button variant="ghost" size="sm" iconName="Copy" />
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-2">Variables:</p>
                  <div className="flex flex-wrap gap-2">
                    {template?.variables?.map((variable) => (
                      <code key={variable} className="px-2 py-1 bg-muted rounded text-xs font-mono text-foreground">
                        {`{{${variable}}}`}
                      </code>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                  <div className="p-3 bg-background border border-border rounded font-mono text-xs text-foreground whitespace-pre-wrap">
                    {template?.preview}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Template Guidelines */}
      <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Template Best Practices</h4>
            <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Use clear, concise language for SMS templates (160 characters max)</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Include severity indicators (🚨, ⚠️, ✅) for quick recognition</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Always include timestamp and reference ID for tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Test templates with sample data before deployment</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertTemplateManager;