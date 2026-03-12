import React from 'react';
import { Users, TrendingUp, Clock, Target } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const CustomerLifecyclePanel = ({ metrics }) => {
  const lifecycleStats = [
    {
      label: 'Customer Lifetime Value',
      value: `$${metrics?.customerLifetimeValue || '0.00'}`,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Average revenue per customer'
    },
    {
      label: 'Retention Rate',
      value: `${metrics?.retentionRate || '0.00'}%`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Active vs total customers'
    },
    {
      label: 'Avg Subscription Duration',
      value: `${metrics?.averageSubscriptionDays || 0} days`,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Average customer lifespan'
    },
    {
      label: 'Total Customers',
      value: metrics?.totalCustomers || 0,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'All-time customer count'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Users className="w-6 h-6 text-purple-600" />
        Customer Lifecycle Insights
      </h2>
      <div className="space-y-4">
        {lifecycleStats?.map((stat, index) => {
          const Icon = stat?.icon;
          return (
            <div key={index} className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className={`p-3 rounded-lg ${stat?.bgColor}`}>
                  <Icon className={`w-5 h-5 ${stat?.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{stat?.label}</span>
                    <span className="text-lg font-bold text-gray-900">{stat?.value}</span>
                  </div>
                  <p className="text-xs text-gray-500">{stat?.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Lifecycle Health Score */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">Lifecycle Health Score</span>
          <span className="text-2xl font-bold text-purple-600">
            {Math.round(parseFloat(metrics?.retentionRate || 0))}/100
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${metrics?.retentionRate || 0}%` }}
          ></div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-gray-600">Active: {metrics?.activeCustomers || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            <span className="text-gray-600">Inactive: {(metrics?.totalCustomers || 0) - (metrics?.activeCustomers || 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLifecyclePanel;