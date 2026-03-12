import React from 'react';
import Icon from '../../../components/AppIcon';

const MobileOptimizationPanel = () => {
  const deviceMetrics = [
    { device: 'Mobile (iOS)', users: 12847, performance: 92, touchOptimized: true },
    { device: 'Mobile (Android)', users: 18934, performance: 89, touchOptimized: true },
    { device: 'Tablet', users: 3421, performance: 94, touchOptimized: true },
    { device: 'Desktop', users: 8234, performance: 96, touchOptimized: false }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Mobile Optimization Dashboard
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Responsive design testing, touch interaction optimization, and performance metrics across different device types
      </p>

      {/* Device Performance */}
      <div className="space-y-4">
        {deviceMetrics?.map((device, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Icon 
                  name={device?.device?.includes('Mobile') ? 'Smartphone' : device?.device?.includes('Tablet') ? 'Tablet' : 'Monitor'} 
                  size={32} 
                  className="text-blue-600" 
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{device?.device}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {device?.users?.toLocaleString()} active users
                  </p>
                </div>
              </div>
              {device?.touchOptimized && (
                <span className="text-sm font-semibold text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded">
                  Touch Optimized
                </span>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Performance Score</span>
                <span className="font-semibold text-gray-900 dark:text-white">{device?.performance}/100</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                  style={{ width: `${device?.performance}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Optimization Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Icon name="Lightbulb" size={24} className="mr-2 text-yellow-600" />
          Automated Optimization Recommendations
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Icon name="CheckCircle" size={20} className="text-green-600 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Touch targets optimized</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">All interactive elements meet 44x44px minimum size</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Icon name="CheckCircle" size={20} className="text-green-600 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Responsive breakpoints configured</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Mobile-first design with optimized layouts for all screen sizes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileOptimizationPanel;