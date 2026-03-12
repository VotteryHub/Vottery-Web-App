import React from 'react';
import Icon from '../../../components/AppIcon';

const CommunicationDashboardPanel = ({ statistics, recentCommunications, onRefresh }) => {
  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'email': return 'Mail';
      case 'sms': return 'MessageSquare';
      case 'in_app': return 'Bell';
      case 'webhook': return 'Webhook';
      default: return 'Send';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'sent': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Communication Overview</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Real-time monitoring of incident communications across all channels with delivery status and engagement metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Communications by Channel</h3>
          <div className="space-y-2">
            {statistics?.byChannel && Object.entries(statistics?.byChannel)?.map(([channel, count]) => (
              <div key={channel} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name={getChannelIcon(channel)} size={16} className="text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{channel?.toUpperCase()}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Communications by Recipient Type</h3>
          <div className="space-y-2">
            {statistics?.byRecipientType && Object.entries(statistics?.byRecipientType)?.map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">{type?.replace(/_/g, ' ')?.toUpperCase()}</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Communications</h3>
        <div className="space-y-2">
          {recentCommunications?.slice(0, 10)?.map(comm => (
            <div key={comm?.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name={getChannelIcon(comm?.communicationType)} size={18} className="text-gray-600 dark:text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {comm?.messageSubject || 'SMS Alert'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    To: {comm?.recipientType?.replace(/_/g, ' ')} • {new Date(comm?.createdAt)?.toLocaleString()}
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(comm?.deliveryStatus)}`}>
                {comm?.deliveryStatus?.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunicationDashboardPanel;
