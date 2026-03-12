import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OfflineFunctionalityPanel = () => {
  const [offlineMetrics] = useState({
    cachedPages: 47,
    cachedAssets: 234,
    syncQueueSize: 12,
    offlineSessions: 1847,
    cacheSize: '45.2 MB'
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Offline Functionality Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Service worker status, cached content, and automatic background synchronization
          </p>
        </div>
        <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
          <Icon name="RefreshCw" size={18} className="mr-2" />
          Clear Cache
        </Button>
      </div>

      {/* Offline Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
          <Icon name="FileText" size={32} className="text-blue-600 mb-3" />
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {offlineMetrics?.cachedPages}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Cached Pages</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
          <Icon name="Image" size={32} className="text-purple-600 mb-3" />
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {offlineMetrics?.cachedAssets}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Cached Assets</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
          <Icon name="Database" size={32} className="text-green-600 mb-3" />
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {offlineMetrics?.cacheSize}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Cache Size</p>
        </div>
      </div>

      {/* Sync Queue */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Icon name="RefreshCw" size={24} className="mr-2 text-blue-600" />
          Background Sync Queue
        </h3>
        <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div>
            <p className="font-semibold text-gray-900 dark:text-white mb-1">
              {offlineMetrics?.syncQueueSize} items pending synchronization
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Will sync automatically when connection is restored
            </p>
          </div>
          <Button size="sm">
            View Queue
          </Button>
        </div>
      </div>

      {/* Offline Sessions */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-4">
          <Icon name="Wifi" size={32} className="text-green-600 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Offline Usage Analytics
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              {offlineMetrics?.offlineSessions?.toLocaleString()} offline sessions recorded in the last 30 days
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Users can browse elections, view results, and prepare votes while offline. All actions sync automatically when online.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineFunctionalityPanel;