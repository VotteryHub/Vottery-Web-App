import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const MessageComposerPanel = ({ stakeholderGroups, onRefresh }) => {
  const [messageData, setMessageData] = useState({
    recipientGroup: '',
    channel: 'email',
    subject: '',
    content: '',
    severity: 'high'
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Message Composer</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Compose and send incident notifications with template management and automated response workflows
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Recipient Group
          </label>
          <Select
            value={messageData?.recipientGroup}
            onChange={(e) => setMessageData({ ...messageData, recipientGroup: e?.target?.value })}
            className="w-full"
          >
            <option value="">Select stakeholder group</option>
            {stakeholderGroups?.map(group => (
              <option key={group?.id} value={group?.id}>{group?.groupName}</option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Communication Channel
          </label>
          <Select
            value={messageData?.channel}
            onChange={(e) => setMessageData({ ...messageData, channel: e?.target?.value })}
            className="w-full"
          >
            <option value="email">Email (Resend)</option>
            <option value="sms">SMS (Twilio)</option>
            <option value="in_app">In-App Notification</option>
            <option value="webhook">Webhook</option>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Incident Severity
        </label>
        <div className="flex gap-2">
          {['critical', 'high', 'medium', 'low']?.map(severity => (
            <button
              key={severity}
              onClick={() => setMessageData({ ...messageData, severity })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                messageData?.severity === severity
                  ? 'bg-primary text-white' :'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {severity?.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {messageData?.channel === 'email' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Subject
          </label>
          <Input
            type="text"
            value={messageData?.subject}
            onChange={(e) => setMessageData({ ...messageData, subject: e?.target?.value })}
            placeholder="Enter email subject"
            className="w-full"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Message Content
        </label>
        <textarea
          value={messageData?.content}
          onChange={(e) => setMessageData({ ...messageData, content: e?.target?.value })}
          placeholder="Enter your message content..."
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Available Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { name: 'Critical Fraud Alert', icon: 'Shield' },
            { name: 'Compliance Submission', icon: 'FileCheck' },
            { name: 'Incident Escalation', icon: 'AlertTriangle' },
            { name: 'System Maintenance', icon: 'Settings' }
          ]?.map(template => (
            <button
              key={template?.name}
              className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Icon name={template?.icon} size={16} className="text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{template?.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button className="flex items-center gap-2">
          <Icon name="Send" size={16} />
          Send Notification
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Icon name="Save" size={16} />
          Save as Template
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Icon name="Eye" size={16} />
          Preview
        </Button>
      </div>
    </div>
  );
};

export default MessageComposerPanel;
