import React from 'react';
import Icon from '../../../components/AppIcon';

const BehavioralAnalysisPanel = () => {
  const behavioralMetrics = [
    { label: 'Device Fingerprints Analyzed', value: '12,847', icon: 'Smartphone', color: 'blue' },
    { label: 'IP Correlations Detected', value: '234', icon: 'Globe', color: 'purple' },
    { label: 'Velocity Violations', value: '89', icon: 'Zap', color: 'orange' },
    { label: 'Risk Score Threshold Exceeded', value: '43', icon: 'AlertTriangle', color: 'red' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Behavioral Analysis Engine
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        User interaction patterns, device fingerprinting, IP correlation analysis, and velocity checks with risk scoring algorithms
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {behavioralMetrics?.map((metric, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
            <Icon name={metric?.icon} size={32} className={`text-${metric?.color}-600 mb-3`} />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{metric?.value}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{metric?.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Risk Scoring Algorithm</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <span className="text-gray-700 dark:text-gray-300">Multiple accounts from same device</span>
            <span className="font-semibold text-red-600">+45 risk points</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <span className="text-gray-700 dark:text-gray-300">Rapid voting velocity (&gt;10 votes/min)</span>
            <span className="font-semibold text-orange-600">+30 risk points</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <span className="text-gray-700 dark:text-gray-300">VPN/Proxy usage detected</span>
            <span className="font-semibold text-yellow-600">+20 risk points</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BehavioralAnalysisPanel;