import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PWAInstallationPanel = () => {
  const [installMetrics] = useState({
    totalInstalls: 4847,
    androidInstalls: 2934,
    iosInstalls: 1521,
    desktopInstalls: 392,
    installRate: 23.4,
    retentionRate: 78.9
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            PWA Installation Metrics
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track installation metrics, manage app manifest, and monitor PWA adoption rates
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Icon name="Download" size={18} className="mr-2" />
          Export Report
        </Button>
      </div>

      {/* Installation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <Icon name="Smartphone" size={32} className="text-blue-600 mb-3" />
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {installMetrics?.androidInstalls?.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Android Installations</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <Icon name="Smartphone" size={32} className="text-purple-600 mb-3" />
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {installMetrics?.iosInstalls?.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">iOS Installations</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <Icon name="Monitor" size={32} className="text-green-600 mb-3" />
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {installMetrics?.desktopInstalls?.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Desktop Installations</p>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Installation Rate</h3>
          <div className="flex items-end gap-4">
            <div className="text-4xl font-bold text-blue-600">{installMetrics?.installRate}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              of visitors install the PWA
            </div>
          </div>
          <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
              style={{ width: `${installMetrics?.installRate}%` }}
            />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Retention Rate</h3>
          <div className="flex items-end gap-4">
            <div className="text-4xl font-bold text-green-600">{installMetrics?.retentionRate}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              users keep the PWA installed
            </div>
          </div>
          <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-600 to-emerald-600"
              style={{ width: `${installMetrics?.retentionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Manifest Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Icon name="FileCode" size={24} className="mr-2 text-blue-600" />
          App Manifest Configuration
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <span className="text-gray-700 dark:text-gray-300">App Name</span>
            <span className="font-semibold text-gray-900 dark:text-white">Vottery</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <span className="text-gray-700 dark:text-gray-300">Display Mode</span>
            <span className="font-semibold text-gray-900 dark:text-white">Standalone</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <span className="text-gray-700 dark:text-gray-300">Theme Color</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-600 border-2 border-white dark:border-gray-700" />
              <span className="font-semibold text-gray-900 dark:text-white">#2563eb</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallationPanel;