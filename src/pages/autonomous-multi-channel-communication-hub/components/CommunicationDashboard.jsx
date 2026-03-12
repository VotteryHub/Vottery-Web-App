import React from 'react';
import Icon from '../../../components/AppIcon';

const CommunicationDashboard = ({ analytics }) => {
  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Send" size={20} className="text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Communications</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{analytics?.totalCommunications || 0}</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="CheckCircle" size={20} className="text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Delivery Rate</span>
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{analytics?.deliveryRate || 0}%</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Clock" size={20} className="text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Response Time</span>
          </div>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{analytics?.averageResponseTime || 0}m</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="TrendingUp" size={20} className="text-orange-600 dark:text-orange-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Escalation Rate</span>
          </div>
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{analytics?.escalationMetrics?.escalationRate || 0}%</div>
        </div>
      </div>

      {/* Channel Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="BarChart3" size={20} />
          Multi-Channel Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Mail" size={18} className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">Email (Resend)</span>
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {analytics?.byChannel?.email || 0}
            </div>
            <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${((analytics?.byChannel?.email || 0) / analytics?.totalCommunications) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="MessageSquare" size={18} className="text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-green-900 dark:text-green-300">SMS (Twilio)</span>
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
              {analytics?.byChannel?.sms || 0}
            </div>
            <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${((analytics?.byChannel?.sms || 0) / analytics?.totalCommunications) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Layers" size={18} className="text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-semibold text-purple-900 dark:text-purple-300">Multi-Channel</span>
            </div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {analytics?.byChannel?.multi_channel || 0}
            </div>
            <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${((analytics?.byChannel?.multi_channel || 0) / analytics?.totalCommunications) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Activity" size={20} />
          Real-Time Communication Activity
        </h3>
        <div className="space-y-3">
          {[1, 2, 3]?.map((item) => (
            <div key={item} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Incident notification sent to Security Team
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 minutes ago • Email + SMS</p>
                </div>
              </div>
              <Icon name="CheckCircle" size={18} className="text-green-600" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunicationDashboard;