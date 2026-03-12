import React from 'react';
import Icon from '../../../components/AppIcon';

const ResponseTrackingPanel = ({ communications, onRefresh }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'sent': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'email': return 'Mail';
      case 'sms': return 'MessageSquare';
      case 'in_app': return 'Bell';
      case 'webhook': return 'Webhook';
      default: return 'Send';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Response Tracking</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Real-time stakeholder response monitoring with automated escalation triggers for unacknowledged critical incidents
        </p>
      </div>

      <div className="space-y-3">
        {communications?.map(comm => (
          <div key={comm?.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Icon name={getChannelIcon(comm?.communicationType)} size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {comm?.messageSubject || 'SMS Alert'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    To: {comm?.recipientType?.replace(/_/g, ' ')} • {comm?.recipients?.length || 0} recipients
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(comm?.deliveryStatus)}`}>
                {comm?.deliveryStatus?.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Sent At</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {comm?.sentAt ? new Date(comm?.sentAt)?.toLocaleString() : 'Pending'}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Delivered At</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {comm?.deliveredAt ? new Date(comm?.deliveredAt)?.toLocaleString() : '-'}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Retry Count</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {comm?.retryCount || 0}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Message ID</div>
                <div className="text-xs font-mono text-gray-900 dark:text-white truncate">
                  {comm?.resendMessageId || comm?.twilioMessageSid || '-'}
                </div>
              </div>
            </div>

            {comm?.errorMessage && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 mb-3">
                <div className="flex items-start gap-2">
                  <Icon name="AlertCircle" size={16} className="text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium text-red-700 dark:text-red-400 mb-1">Delivery Error:</div>
                    <div className="text-xs text-red-600 dark:text-red-400">{comm?.errorMessage}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="text-xs text-gray-500 dark:text-gray-400">
              Created: {new Date(comm?.createdAt)?.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResponseTrackingPanel;
