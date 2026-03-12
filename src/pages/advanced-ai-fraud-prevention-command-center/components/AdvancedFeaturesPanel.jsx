import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AdvancedFeaturesPanel = () => {
  const features = [
    {
      title: 'Custom ML Model Training',
      description: 'Train custom machine learning models on your platform-specific fraud patterns',
      icon: 'Brain',
      status: 'available'
    },
    {
      title: 'False Positive Reduction',
      description: 'Advanced algorithms to minimize false positives while maintaining high detection rates',
      icon: 'Target',
      status: 'available'
    },
    {
      title: 'Investigation Tools',
      description: 'Comprehensive investigation dashboard with forensic analysis capabilities',
      icon: 'Search',
      status: 'available'
    },
    {
      title: 'Adaptive Intelligence',
      description: 'Self-improving security protocols that adapt to emerging threats',
      icon: 'Zap',
      status: 'beta'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Advanced Features
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Custom ML model training, false positive reduction algorithms, and integration with external threat intelligence feeds
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features?.map((feature, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <Icon name={feature?.icon} size={32} className="text-purple-600" />
              <span className={`text-xs font-semibold px-2 py-1 rounded ${
                feature?.status === 'available' ?'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
                {feature?.status?.toUpperCase()}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature?.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{feature?.description}</p>
            <Button size="sm" variant="outline" className="w-full">
              Configure
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdvancedFeaturesPanel;