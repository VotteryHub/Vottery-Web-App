import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { stakeholderCommunicationService } from '../../../services/stakeholderCommunicationService';

const StakeholderNotificationsPanel = ({ selectedIncident }) => {
  const [stakeholderGroups, setStakeholderGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadStakeholderGroups();
    if (selectedIncident) {
      loadNotificationHistory();
    }
  }, [selectedIncident]);

  const loadStakeholderGroups = async () => {
    const { data } = await stakeholderCommunicationService?.getStakeholderGroups();
    setStakeholderGroups(data || []);
  };

  const loadNotificationHistory = async () => {
    const { data } = await stakeholderCommunicationService?.getIncidentCommunications(selectedIncident?.id);
    setNotificationHistory(data || []);
  };

  const sendNotifications = async () => {
    if (!selectedIncident || selectedGroups?.length === 0) return;

    setSending(true);
    try {
      for (const groupId of selectedGroups) {
        const group = stakeholderGroups?.find(g => g?.id === groupId);
        await stakeholderCommunicationService?.sendIncidentCommunication({
          incidentId: selectedIncident?.id,
          communicationType: 'email',
          recipientType: group?.groupName,
          recipients: group?.members,
          messageSubject: `Incident Alert: ${selectedIncident?.title}`,
          messageContent: `Incident detected: ${selectedIncident?.description}`,
          metadata: { severity: selectedIncident?.severity }
        });
      }
      loadNotificationHistory();
    } catch (error) {
      console.error('Error sending notifications:', error);
    } finally {
      setSending(false);
    }
  };

  const channels = [
    { id: 'email', name: 'Email', icon: 'Mail', enabled: true },
    { id: 'sms', name: 'SMS', icon: 'MessageSquare', enabled: true },
    { id: 'slack', name: 'Slack', icon: 'MessageCircle', enabled: true },
    { id: 'pagerduty', name: 'PagerDuty', icon: 'Bell', enabled: false }
  ];

  return (
    <div className="space-y-6">
      {/* Multi-Channel Notification Composer */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Send" size={20} />
          Multi-Channel Notification Composer
        </h3>

        {/* Channel Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Notification Channels
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {channels?.map((channel) => (
              <button
                key={channel?.id}
                disabled={!channel?.enabled}
                className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                  channel?.enabled
                    ? 'border-primary bg-primary/10 text-primary' :'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Icon name={channel?.icon} size={16} />
                <span className="text-sm font-medium">{channel?.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stakeholder Groups */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Stakeholder Groups
          </label>
          <div className="space-y-2">
            {stakeholderGroups?.map((group) => (
              <label
                key={group?.id}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedGroups?.includes(group?.id)}
                  onChange={(e) => {
                    if (e?.target?.checked) {
                      setSelectedGroups([...selectedGroups, group?.id]);
                    } else {
                      setSelectedGroups(selectedGroups?.filter(id => id !== group?.id));
                    }
                  }}
                  className="w-4 h-4 text-primary"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{group?.groupName}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{group?.memberCount} members</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={sendNotifications}
          disabled={sending || !selectedIncident || selectedGroups?.length === 0}
          className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
        >
          <Icon name="Send" size={16} />
          {sending ? 'Sending Notifications...' : 'Send Notifications'}
        </button>
      </div>

      {/* Notification History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Clock" size={20} />
          Notification History
        </h3>
        <div className="space-y-3">
          {notificationHistory?.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
              No notifications sent yet
            </p>
          ) : (
            notificationHistory?.map((notification) => (
              <div
                key={notification?.id}
                className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon
                      name={
                        notification?.communicationType === 'email' ? 'Mail' :
                        notification?.communicationType === 'sms' ? 'MessageSquare' : 'MessageCircle'
                      }
                      size={16}
                      className="text-gray-600 dark:text-gray-400"
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {notification?.recipientType}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {notification?.messageSubject}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {new Date(notification?.createdAt)?.toLocaleString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  notification?.deliveryStatus === 'sent' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                  notification?.deliveryStatus === 'failed'? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                }`}>
                  {notification?.deliveryStatus}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Automated Routing */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="GitBranch" size={20} />
          Automated Stakeholder Routing
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Critical incidents → Executive team</span>
            <Icon name="Check" size={16} className="text-green-500" />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Fraud alerts → Security team</span>
            <Icon name="Check" size={16} className="text-green-500" />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Revenue anomalies → Finance team</span>
            <Icon name="Check" size={16} className="text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakeholderNotificationsPanel;