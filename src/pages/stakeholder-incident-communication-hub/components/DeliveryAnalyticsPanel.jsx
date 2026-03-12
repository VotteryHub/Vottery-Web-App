import React from 'react';
import Icon from '../../../components/AppIcon';

const DeliveryAnalyticsPanel = ({ statistics }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Delivery Analytics</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Comprehensive communication analytics with delivery confirmation tracking and retry mechanism performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Icon name="CheckCircle2" size={24} />
            <span className="text-2xl font-bold">{statistics?.deliveryRate || 0}%</span>
          </div>
          <div className="text-sm opacity-90">Delivery Success Rate</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Clock" size={24} />
            <span className="text-2xl font-bold">{statistics?.averageResponseTime || 0}s</span>
          </div>
          <div className="text-sm opacity-90">Avg Response Time</div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Icon name="XCircle" size={24} />
            <span className="text-2xl font-bold">{statistics?.failedCommunications || 0}</span>
          </div>
          <div className="text-sm opacity-90">Failed Deliveries</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Channel Performance</h3>
          <div className="space-y-3">
            {statistics?.byChannel && Object.entries(statistics?.byChannel)?.map(([channel, count]) => (
              <div key={channel}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{channel?.toUpperCase()}</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{count}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${(count / statistics?.totalCommunications) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recipient Type Distribution</h3>
          <div className="space-y-3">
            {statistics?.byRecipientType && Object.entries(statistics?.byRecipientType)?.map(([type, count]) => (
              <div key={type}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{type?.replace(/_/g, ' ')?.toUpperCase()}</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{count}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(count / statistics?.totalCommunications) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAnalyticsPanel;
