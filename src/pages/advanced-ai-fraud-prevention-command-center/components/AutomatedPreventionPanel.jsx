import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AutomatedPreventionPanel = () => {
  const preventionActions = [
    { action: 'Account Suspensions', count: 127, automated: 98, manual: 29 },
    { action: 'Vote Invalidations', count: 234, automated: 187, manual: 47 },
    { action: 'IP Blocks', count: 89, automated: 89, manual: 0 },
    { action: 'Payment Holds', count: 43, automated: 31, manual: 12 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Automated Prevention Actions
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Automated response triggers, manual override controls, and comprehensive analytics
          </p>
        </div>
        <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
          <Icon name="Settings" size={18} className="mr-2" />
          Configure Rules
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {preventionActions?.map((item, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{item?.action}</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Actions (24h)</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{item?.count}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Automated</span>
                <span className="text-lg font-semibold text-green-600">{item?.automated}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Manual Override</span>
                <span className="text-lg font-semibold text-blue-600">{item?.manual}</span>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Automation Rate</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {((item?.automated / item?.count) * 100)?.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-4">
          <Icon name="CheckCircle" size={32} className="text-green-600 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Continuous Optimization Active
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              System is continuously learning from prevention actions and adjusting thresholds for optimal fraud detection with minimal false positives.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomatedPreventionPanel;