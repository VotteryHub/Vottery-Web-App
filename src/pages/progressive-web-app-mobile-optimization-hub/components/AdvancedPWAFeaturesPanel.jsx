import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AdvancedPWAFeaturesPanel = () => {
  const advancedFeatures = [
    {
      title: 'Custom Notification Templates',
      description: 'Create personalized notification templates with dynamic content and action buttons',
      icon: 'FileText',
      status: 'available'
    },
    {
      title: 'Offline Content Prioritization',
      description: 'Configure which content is cached first for optimal offline experience',
      icon: 'Database',
      status: 'available'
    },
    {
      title: 'Progressive Enhancement Strategies',
      description: 'Implement progressive enhancement for graceful degradation across devices',
      icon: 'Layers',
      status: 'available'
    },
    {
      title: 'Background Sync Protocols',
      description: 'Advanced background synchronization with conflict resolution',
      icon: 'RefreshCw',
      status: 'beta'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Advanced PWA Features
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Custom notification templates, offline content prioritization, and progressive enhancement strategies
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {advancedFeatures?.map((feature, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <Icon name={feature?.icon} size={32} className="text-blue-600" />
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

      {/* Real-time Synchronization */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-4">
          <Icon name="Zap" size={32} className="text-blue-600 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Real-time Synchronization Active
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Seamless mobile experience with native app-like functionality while maintaining full platform capabilities
              and real-time synchronization across all devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedPWAFeaturesPanel;