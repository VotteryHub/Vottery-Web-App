import React from 'react';
import Icon from '../../../components/AppIcon';

const ThreatIntelligencePanel = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        External Threat Intelligence Integration
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Integration with external threat intelligence feeds for comprehensive fraud prevention
      </p>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="Database" size={24} className="text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Connected Intelligence Feeds</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-medium text-gray-900 dark:text-white">Perplexity Threat Intelligence</span>
            </div>
            <span className="text-sm text-green-600 font-semibold">ACTIVE</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-medium text-gray-900 dark:text-white">OpenAI Pattern Recognition</span>
            </div>
            <span className="text-sm text-green-600 font-semibold">ACTIVE</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-medium text-gray-900 dark:text-white">Claude Behavioral Analysis</span>
            </div>
            <span className="text-sm text-green-600 font-semibold">ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatIntelligencePanel;