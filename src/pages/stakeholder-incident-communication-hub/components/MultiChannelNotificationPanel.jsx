import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';



const MultiChannelNotificationPanel = ({ stakeholderGroups, onRefresh }) => {
  const [sending, setSending] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState(['email']);

  const channels = [
    { id: 'email', label: 'Email (Resend)', icon: 'Mail', description: 'Send via Resend email service' },
    { id: 'sms', label: 'SMS (Twilio)', icon: 'MessageSquare', description: 'Send via Twilio SMS' },
    { id: 'in_app', label: 'In-App', icon: 'Bell', description: 'Push to activity feed' },
    { id: 'webhook', label: 'Webhook', icon: 'Webhook', description: 'External system notification' }
  ];

  const toggleChannel = (channelId) => {
    setSelectedChannels(prev =>
      prev?.includes(channelId)
        ? prev?.filter(c => c !== channelId)
        : [...prev, channelId]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Multi-Channel Notification Management</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Configure and send incident notifications across multiple channels with automated delivery tracking and retry mechanisms
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Select Communication Channels</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {channels?.map(channel => (
            <button
              key={channel?.id}
              onClick={() => toggleChannel(channel?.id)}
              className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all ${
                selectedChannels?.includes(channel?.id)
                  ? 'border-primary bg-primary/5' :'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                selectedChannels?.includes(channel?.id)
                  ? 'bg-primary text-white' :'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                <Icon name={channel?.icon} size={20} />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">{channel?.label}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{channel?.description}</div>
              </div>
              {selectedChannels?.includes(channel?.id) && (
                <Icon name="CheckCircle2" size={20} className="text-primary ml-auto" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Stakeholder Groups</h3>
        <div className="space-y-2">
          {stakeholderGroups?.map(group => (
            <div key={group?.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="Users" size={18} className="text-gray-600 dark:text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{group?.groupName}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {group?.groupType?.toUpperCase()} • {group?.recipients?.length || 0} recipients
                  </div>
                </div>
              </div>
              <Button size="sm" className="flex items-center gap-1">
                <Icon name="Send" size={14} />
                Send
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <div className="font-medium text-blue-900 dark:text-blue-300 mb-1">Delivery Tracking</div>
            <div className="text-sm text-blue-700 dark:text-blue-400">
              All communications are tracked with delivery confirmation, retry mechanisms for failed deliveries, and automated escalation for unacknowledged critical incidents.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiChannelNotificationPanel;
