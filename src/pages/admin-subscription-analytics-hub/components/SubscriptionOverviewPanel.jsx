import React from 'react';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const SubscriptionOverviewPanel = ({ analytics }) => {
  const stats = [
    {
      label: 'Total Subscriptions',
      value: analytics?.totalSubscriptions || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Active Subscriptions',
      value: analytics?.activeSubscriptions || 0,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Canceled Subscriptions',
      value: analytics?.canceledSubscriptions || 0,
      icon: BarChart3,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      label: 'Total Revenue',
      value: `$${analytics?.totalRevenue || '0.00'}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        Subscription Overview
      </h2>
      <div className="space-y-4">
        {stats?.map((stat, index) => {
          const Icon = stat?.icon;
          return (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${stat?.bgColor}`}>
                  <Icon className={`w-5 h-5 ${stat?.color}`} />
                </div>
                <span className="text-sm font-medium text-gray-700">{stat?.label}</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{stat?.value}</span>
            </div>
          );
        })}
      </div>
      {/* Subscription Health Indicator */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Subscription Health</span>
          <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">
            {analytics?.churnRate < 5 ? 'Excellent' : analytics?.churnRate < 10 ? 'Good' : 'Needs Attention'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(0, 100 - parseFloat(analytics?.churnRate || 0))}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Retention Rate: {(100 - parseFloat(analytics?.churnRate || 0))?.toFixed(2)}%
        </p>
      </div>
    </div>
  );
};

export default SubscriptionOverviewPanel;