import React from 'react';
import Icon from '../../../components/AppIcon';

const DeliveryTrackingPanel = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Activity" size={20} />
          Real-Time Delivery Tracking
        </h3>

        <div className="space-y-4">
          {[
            {
              id: 1,
              type: 'Email',
              recipient: 'security-team@vottery.com',
              subject: 'Critical Fraud Alert',
              status: 'delivered',
              timestamp: '2 minutes ago',
              channel: 'Resend',
            },
            {
              id: 2,
              type: 'SMS',
              recipient: '+1 (555) 123-4567',
              subject: 'Urgent: Account Activity',
              status: 'sent',
              timestamp: '5 minutes ago',
              channel: 'Twilio',
            },
            {
              id: 3,
              type: 'Multi-Channel',
              recipient: 'Compliance Team (8 members)',
              subject: 'Policy Violation Detected',
              status: 'delivered',
              timestamp: '12 minutes ago',
              channel: 'Resend + Twilio',
            },
            {
              id: 4,
              type: 'Email',
              recipient: 'finance-team@vottery.com',
              subject: 'Payment Dispute Escalation',
              status: 'pending',
              timestamp: '18 minutes ago',
              channel: 'Resend',
            },
          ]?.map((delivery) => (
            <div key={delivery?.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    delivery?.type === 'Email' ?'bg-blue-100 dark:bg-blue-900/20'
                      : delivery?.type === 'SMS' ?'bg-green-100 dark:bg-green-900/20' :'bg-purple-100 dark:bg-purple-900/20'
                  }`}>
                    <Icon
                      name={delivery?.type === 'Email' ? 'Mail' : delivery?.type === 'SMS' ? 'MessageSquare' : 'Layers'}
                      size={20}
                      className={delivery?.type === 'Email' ? 'text-blue-600 dark:text-blue-400' : delivery?.type === 'SMS' ? 'text-green-600 dark:text-green-400' : 'text-purple-600 dark:text-purple-400'}
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{delivery?.subject}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{delivery?.recipient}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    delivery?.status === 'delivered' ?'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                      : delivery?.status === 'sent' ?'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' :'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                  }`}>
                    {delivery?.status?.toUpperCase()}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{delivery?.timestamp}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>Channel: {delivery?.channel}</span>
                <button className="text-primary hover:underline">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Analytics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="BarChart3" size={20} />
          Delivery Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="CheckCircle" size={18} className="text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-green-900 dark:text-green-300">Delivered</span>
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">98.7%</div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Clock" size={18} className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">Avg. Delivery Time</span>
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">1.2s</div>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="TrendingUp" size={18} className="text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-semibold text-purple-900 dark:text-purple-300">Open Rate</span>
            </div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">76.3%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTrackingPanel;