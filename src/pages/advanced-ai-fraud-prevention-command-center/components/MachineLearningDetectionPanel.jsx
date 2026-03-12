import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MachineLearningDetectionPanel = () => {
  const [detectionMetrics, setDetectionMetrics] = useState({
    voteManipulation: { detected: 127, confidence: 92.4, trend: 'up' },
    accountFarming: { detected: 43, confidence: 88.7, trend: 'down' },
    coordinatedBehavior: { detected: 18, confidence: 95.2, trend: 'stable' },
    paymentFraud: { detected: 9, confidence: 91.8, trend: 'down' }
  });

  const detectionTypes = [
    {
      id: 'vote-manipulation',
      title: 'Vote Manipulation',
      description: 'Coordinated voting patterns and ballot stuffing',
      icon: 'Vote',
      color: 'red',
      metrics: detectionMetrics?.voteManipulation
    },
    {
      id: 'account-farming',
      title: 'Account Farming',
      description: 'Mass account creation and automated registration',
      icon: 'Users',
      color: 'orange',
      metrics: detectionMetrics?.accountFarming
    },
    {
      id: 'coordinated-behavior',
      title: 'Coordinated Inauthentic Behavior',
      description: 'Organized campaigns and bot networks',
      icon: 'Network',
      color: 'purple',
      metrics: detectionMetrics?.coordinatedBehavior
    },
    {
      id: 'payment-fraud',
      title: 'Payment Fraud',
      description: 'Fraudulent transactions and chargebacks',
      icon: 'CreditCard',
      color: 'blue',
      metrics: detectionMetrics?.paymentFraud
    }
  ];

  const getTrendIcon = (trend) => {
    if (trend === 'up') return { icon: 'TrendingUp', color: 'text-red-600' };
    if (trend === 'down') return { icon: 'TrendingDown', color: 'text-green-600' };
    return { icon: 'Minus', color: 'text-gray-600' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Machine Learning Detection Engine
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Advanced pattern recognition with confidence scoring and automated response triggers
          </p>
        </div>
        <Button className="bg-gradient-to-r from-red-600 to-orange-600">
          <Icon name="Download" size={18} className="mr-2" />
          Export Report
        </Button>
      </div>

      {/* Detection Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {detectionTypes?.map((type) => {
          const trendInfo = getTrendIcon(type?.metrics?.trend);
          return (
            <div
              key={type?.id}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-${type?.color}-100 dark:bg-${type?.color}-900/30 flex items-center justify-center`}>
                  <Icon name={type?.icon} size={24} className={`text-${type?.color}-600`} />
                </div>
                <div className="flex items-center gap-2">
                  <Icon name={trendInfo?.icon} size={20} className={trendInfo?.color} />
                  <span className={`text-sm font-medium ${trendInfo?.color}`}>
                    {type?.metrics?.trend?.toUpperCase()}
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {type?.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {type?.description}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Detected (24h)</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {type?.metrics?.detected}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Confidence</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {type?.metrics?.confidence}%
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button size="sm" variant="outline" className="w-full">
                  View Details
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Automated Response Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Icon name="Zap" size={24} className="mr-2 text-yellow-600" />
          Automated Response Triggers
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Auto-block on Critical Confidence</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Automatically block accounts with ≥95% fraud confidence</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Alert Admin on High Risk</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Send immediate alerts for fraud scores ≥70%</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineLearningDetectionPanel;