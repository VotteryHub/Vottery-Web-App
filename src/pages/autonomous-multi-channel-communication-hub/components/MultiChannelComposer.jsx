import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { multiChannelCommunicationService } from '../../../services/multiChannelCommunicationService';

const MultiChannelComposer = ({ stakeholderGroups, onSend }) => {
  const [formData, setFormData] = useState({
    incidentId: '',
    subject: '',
    message: '',
    channels: ['email'],
    severity: 'medium',
    escalationLevel: 'standard',
    selectedGroups: [],
  });
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  const handleSend = async () => {
    setSending(true);
    setResult(null);
    try {
      const recipients = stakeholderGroups
        ?.filter(group => formData?.selectedGroups?.includes(group?.id))
        ?.flatMap(group => group?.members || []);

      const { data, error } = await multiChannelCommunicationService?.sendMultiChannelNotification({
        incidentId: formData?.incidentId || 'manual-notification',
        recipients,
        subject: formData?.subject,
        message: formData?.message,
        channels: formData?.channels,
        severity: formData?.severity,
        escalationLevel: formData?.escalationLevel,
      });

      if (error) throw error;
      setResult({ success: true, data });
      onSend?.();
    } catch (error) {
      setResult({ success: false, error: error?.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Mail" size={20} />
          Multi-Channel Message Composer
        </h3>

        <div className="space-y-4">
          {/* Channel Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Communication Channels
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const channels = formData?.channels?.includes('email')
                    ? formData?.channels?.filter(c => c !== 'email')
                    : [...formData?.channels, 'email'];
                  setFormData({ ...formData, channels });
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  formData?.channels?.includes('email')
                    ? 'bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400' :'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Icon name="Mail" size={18} />
                Email (Resend)
              </button>
              <button
                onClick={() => {
                  const channels = formData?.channels?.includes('sms')
                    ? formData?.channels?.filter(c => c !== 'sms')
                    : [...formData?.channels, 'sms'];
                  setFormData({ ...formData, channels });
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  formData?.channels?.includes('sms')
                    ? 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400' :'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Icon name="MessageSquare" size={18} />
                SMS (Twilio)
              </button>
            </div>
          </div>

          {/* Severity & Escalation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Severity Level
              </label>
              <select
                value={formData?.severity}
                onChange={(e) => setFormData({ ...formData, severity: e?.target?.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Escalation Level
              </label>
              <select
                value={formData?.escalationLevel}
                onChange={(e) => setFormData({ ...formData, escalationLevel: e?.target?.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="standard">Standard</option>
                <option value="priority">Priority</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Subject
            </label>
            <input
              type="text"
              value={formData?.subject}
              onChange={(e) => setFormData({ ...formData, subject: e?.target?.value })}
              placeholder="Enter notification subject"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Message Content
            </label>
            <textarea
              value={formData?.message}
              onChange={(e) => setFormData({ ...formData, message: e?.target?.value })}
              placeholder="Enter your message..."
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Stakeholder Groups */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Recipient Groups
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {stakeholderGroups?.map((group) => (
                <button
                  key={group?.id}
                  onClick={() => {
                    const selected = formData?.selectedGroups?.includes(group?.id)
                      ? formData?.selectedGroups?.filter(id => id !== group?.id)
                      : [...formData?.selectedGroups, group?.id];
                    setFormData({ ...formData, selectedGroups: selected });
                  }}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    formData?.selectedGroups?.includes(group?.id)
                      ? 'bg-primary/10 border-primary text-primary' :'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="text-sm font-semibold">{group?.groupName}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{group?.groupType}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={sending || !formData?.subject || !formData?.message || formData?.selectedGroups?.length === 0}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-400 transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
          >
            {sending ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Sending...
              </>
            ) : (
              <>
                <Icon name="Send" size={20} />
                Send Multi-Channel Notification
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className={`rounded-lg p-6 border-2 ${
          result?.success
            ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' :'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <Icon
              name={result?.success ? 'CheckCircle' : 'XCircle'}
              size={24}
              className={result?.success ? 'text-green-600' : 'text-red-600'}
            />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {result?.success ? 'Notification Sent Successfully' : 'Sending Failed'}
            </h4>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {result?.success
              ? 'Multi-channel notification has been delivered to all selected stakeholders.'
              : `Error: ${result?.error}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default MultiChannelComposer;