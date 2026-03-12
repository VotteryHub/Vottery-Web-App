import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PushNotificationEnginePanel = () => {
  const [notificationTypes] = useState([
    { type: 'Election Updates', sent: 12847, delivered: 12234, opened: 8945, rate: 95.2 },
    { type: 'Voting Reminders', sent: 8934, delivered: 8521, opened: 6234, rate: 95.4 },
    { type: 'Prize Notifications', sent: 2341, delivered: 2298, opened: 2145, rate: 98.2 },
    { type: 'Social Interactions', sent: 15672, delivered: 14893, opened: 9234, rate: 95.0 }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Push Notification Engine
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Automated alerts with delivery confirmation tracking and engagement analytics
          </p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
          <Icon name="Send" size={18} className="mr-2" />
          Send Test Notification
        </Button>
      </div>
      {/* Notification Types */}
      <div className="space-y-4">
        {notificationTypes?.map((notification, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{notification?.type}</h3>
              <span className="text-sm font-semibold text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded">
                {notification?.rate}% Delivery Rate
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Sent</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {notification?.sent?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Delivered</p>
                <p className="text-xl font-bold text-blue-600">
                  {notification?.delivered?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Opened</p>
                <p className="text-xl font-bold text-purple-600">
                  {notification?.opened?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Open Rate</p>
                <p className="text-xl font-bold text-green-600">
                  {((notification?.opened / notification?.delivered) * 100)?.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Notification Templates */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Icon name="FileText" size={24} className="mr-2 text-purple-600" />
          Custom Notification Templates
        </h3>
        <div className="space-y-3">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="font-semibold text-gray-900 dark:text-white mb-2">Election Starting Soon</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              "[Election Name] starts in 1 hour! Cast your vote and win amazing prizes."
            </p>
          </div>
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <p className="font-semibold text-gray-900 dark:text-white mb-2">Prize Winner Alert</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              "Congratulations! You won [Prize Amount] in [Election Name]. Check your wallet now!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PushNotificationEnginePanel;