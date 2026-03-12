import React, { useState } from 'react';
import { BarChart3, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const DeliveryAnalyticsPanel = () => {
  const [analytics] = useState({
    totalDelivered: 12847,
    bounceRate: 1.3,
    openRate: 76.4,
    clickRate: 42.8,
    retrySuccess: 94.5,
    avgDeliveryTime: '2.3s'
  });

  const [recentBounces] = useState([
    { id: 1, email: 'stakeholder@*****.com', reason: 'Mailbox full', retry: 'scheduled', time: '5m ago' },
    { id: 2, email: 'compliance@*****.com', reason: 'Temporary failure', retry: 'in progress', time: '12m ago' },
    { id: 3, email: 'admin@*****.com', reason: 'Invalid address', retry: 'failed', time: '1h ago' }
  ]);

  const [deliveryTrends] = useState([
    { hour: '00:00', delivered: 234, bounced: 3 },
    { hour: '04:00', delivered: 189, bounced: 2 },
    { hour: '08:00', delivered: 567, bounced: 8 },
    { hour: '12:00', delivered: 892, bounced: 12 },
    { hour: '16:00', delivered: 734, bounced: 9 },
    { hour: '20:00', delivered: 456, bounced: 5 }
  ]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Delivery Analytics</h2>
            <p className="text-sm text-gray-600">Comprehensive tracking with automated retry mechanisms</p>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{analytics?.totalDelivered?.toLocaleString()}</div>
          <div className="text-xs text-gray-600">Total Delivered</div>
        </div>

        <div className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-medium text-blue-600">OPEN</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{analytics?.openRate}%</div>
          <div className="text-xs text-gray-600">Open Rate</div>
        </div>

        <div className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-medium text-purple-600">CLICK</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{analytics?.clickRate}%</div>
          <div className="text-xs text-gray-600">Click Rate</div>
        </div>

        <div className="p-4 bg-gradient-to-br from-orange-50 to-white rounded-lg border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <span className="text-xs font-medium text-orange-600">BOUNCE</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{analytics?.bounceRate}%</div>
          <div className="text-xs text-gray-600">Bounce Rate</div>
        </div>

        <div className="p-4 bg-gradient-to-br from-teal-50 to-white rounded-lg border border-teal-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-teal-600" />
            <span className="text-xs font-medium text-teal-600">RETRY</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{analytics?.retrySuccess}%</div>
          <div className="text-xs text-gray-600">Retry Success</div>
        </div>

        <div className="p-4 bg-gradient-to-br from-indigo-50 to-white rounded-lg border border-indigo-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <span className="text-xs font-medium text-indigo-600">AVG</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{analytics?.avgDeliveryTime}</div>
          <div className="text-xs text-gray-600">Delivery Time</div>
        </div>
      </div>

      {/* Bounce Management */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-orange-600" />
          Bounce Management & Retry
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {recentBounces?.map((bounce) => (
            <div
              key={bounce?.id}
              className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
            >
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{bounce?.email}</div>
                <div className="text-xs text-gray-600">
                  {bounce?.reason} • {bounce?.time}
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                bounce?.retry === 'scheduled' ?'bg-blue-100 text-blue-700'
                  : bounce?.retry === 'in progress' ?'bg-yellow-100 text-yellow-700' :'bg-red-100 text-red-700'
              }`}>
                {bounce?.retry?.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Retry Protocol */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-200">
          <div>
            <div className="font-medium text-gray-900">Exponential Backoff Protocol</div>
            <div className="text-xs text-gray-600 mt-1">Automated retry with intelligent scheduling</div>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">ACTIVE</span>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAnalyticsPanel;