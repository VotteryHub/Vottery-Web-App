import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ComplianceAutomationPanel = ({ triggers, onRefresh }) => {
  const getTriggerTypeIcon = (type) => {
    switch (type) {
      case 'financial_threshold': return 'DollarSign';
      case 'deadline_based': return 'Calendar';
      case 'event_based': return 'Bell';
      case 'periodic': return 'Clock';
      default: return 'FileCheck';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Automated Compliance Submissions</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Regulatory submission triggers based on financial thresholds, fraud detection alerts, and compliance deadlines
          </p>
        </div>
        <Button onClick={onRefresh} className="flex items-center gap-2">
          <Icon name="Plus" size={16} />
          Create Trigger
        </Button>
      </div>

      <div className="grid gap-4">
        {triggers?.map(trigger => (
          <div key={trigger?.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Icon name={getTriggerTypeIcon(trigger?.triggerType)} size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{trigger?.triggerName}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {trigger?.jurisdiction} - {trigger?.regulatoryAuthority}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                trigger?.isEnabled ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'
              }`}>
                {trigger?.isEnabled ? 'ENABLED' : 'DISABLED'}
              </span>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3">
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Threshold Configuration:</div>
              <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
                {JSON.stringify(trigger?.thresholdConfig, null, 2)}
              </pre>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Last Triggered</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {trigger?.lastTriggeredAt ? new Date(trigger?.lastTriggeredAt)?.toLocaleString() : 'Never'}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Next Trigger</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {trigger?.nextTriggerAt ? new Date(trigger?.nextTriggerAt)?.toLocaleString() : 'On demand'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" className="flex items-center gap-1">
                <Icon name="Send" size={14} />
                Submit Now
              </Button>
              <Button size="sm" variant="outline" className="flex items-center gap-1">
                <Icon name="Settings" size={14} />
                Configure
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplianceAutomationPanel;
