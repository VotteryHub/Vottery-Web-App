import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RealtimeSubscriptionsPanel = ({ subscriptions, onRefresh }) => {
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const getEventTypeColor = (eventType) => {
    switch (eventType) {
      case 'INSERT':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'UPDATE':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'DELETE':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon name="Radio" className="w-6 h-6 text-blue-500" />
            Real-Time Subscriptions
          </h2>
          <Button onClick={onRefresh} className="flex items-center gap-2">
            <Icon name="RefreshCw" className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Active Subscriptions
            </h3>
            {subscriptions?.filter(s => s?.isEnabled)?.map((subscription) => (
              <div
                key={subscription?.id}
                onClick={() => setSelectedSubscription(subscription)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedSubscription?.id === subscription?.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' :'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {subscription?.subscriptionName}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Table: {subscription?.tableName}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    {subscription?.refreshIntervalSeconds}s
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {subscription?.eventTypes?.map((eventType, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded text-xs font-medium ${getEventTypeColor(eventType)}`}
                    >
                      {eventType}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Icon name="Target" className="w-3 h-3" />
                    <span>Priority: {subscription?.priority}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Layers" className="w-3 h-3" />
                    <span>Batch: {subscription?.batchSize}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {selectedSubscription ? (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Subscription Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Subscription Name
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">
                      {selectedSubscription?.subscriptionName}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Table Name
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white mt-1 font-mono bg-white dark:bg-gray-800 px-3 py-2 rounded">
                      {selectedSubscription?.tableName}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Event Types
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedSubscription?.eventTypes?.map((eventType, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(eventType)}`}
                        >
                          {eventType}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Target Channels
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedSubscription?.targetChannels?.map((channel, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                        >
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        Refresh Interval
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white mt-1">
                        {selectedSubscription?.refreshIntervalSeconds} seconds
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        Batch Size
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white mt-1">
                        {selectedSubscription?.batchSize} records
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Filter Conditions
                    </label>
                    <pre className="text-xs text-gray-900 dark:text-white mt-2 bg-white dark:bg-gray-800 p-3 rounded overflow-x-auto">
                      {JSON.stringify(selectedSubscription?.filterConditions, null, 2)}
                    </pre>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Error Handling
                    </label>
                    <pre className="text-xs text-gray-900 dark:text-white mt-2 bg-white dark:bg-gray-800 p-3 rounded overflow-x-auto">
                      {JSON.stringify(selectedSubscription?.errorHandling, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-12 text-center">
                <Icon name="MousePointerClick" className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Select a subscription to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeSubscriptionsPanel;
