import React from 'react';
import Icon from '../../../components/AppIcon';
import { lotteryPaymentService } from '../../../services/lotteryPaymentService';

const DashboardOverview = ({ data, onRefresh }) => {
  const metrics = [
    {
      label: 'Total Processed',
      value: data?.transactionStats?.totalProcessed?.toLocaleString() || '0',
      change: '+12.5%',
      trend: 'up',
      icon: 'TrendingUp',
      color: 'blue'
    },
    {
      label: 'Success Rate',
      value: `${data?.transactionStats?.successRate || 0}%`,
      change: '+0.3%',
      trend: 'up',
      icon: 'CheckCircle',
      color: 'green'
    },
    {
      label: 'Avg Processing Time',
      value: `${data?.transactionStats?.avgProcessingTime || 0}s`,
      change: '-0.2s',
      trend: 'up',
      icon: 'Clock',
      color: 'purple'
    },
    {
      label: 'Total Revenue',
      value: lotteryPaymentService?.formatCurrency(data?.transactionStats?.totalRevenue || 0),
      change: '+18.2%',
      trend: 'up',
      icon: 'DollarSign',
      color: 'emerald'
    }
  ];

  const payoutMetrics = [
    {
      label: 'Pending Payouts',
      value: data?.pendingPayouts?.length || 0,
      icon: 'Clock',
      color: 'yellow'
    },
    {
      label: 'Total Payout Amount',
      value: lotteryPaymentService?.formatCurrency(data?.payoutStats?.totalAmount || 0),
      icon: 'Trophy',
      color: 'blue'
    },
    {
      label: 'Completed Payouts',
      value: lotteryPaymentService?.formatCurrency(data?.payoutStats?.completedAmount || 0),
      icon: 'CheckCircle',
      color: 'green'
    },
    {
      label: 'Processing',
      value: data?.payoutStats?.processingCount || 0,
      icon: 'Loader2',
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Payment Processing Metrics */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Processing Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics?.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${metric?.color}-100`}>
                  <Icon name={metric?.icon} className={`w-6 h-6 text-${metric?.color}-600`} />
                </div>
                <span className={`text-sm font-medium ${
                  metric?.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric?.change}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{metric?.label}</p>
              <p className="text-2xl font-bold text-gray-900">{metric?.value}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Prize Payout Metrics */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Prize Payout Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {payoutMetrics?.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className={`p-3 rounded-lg bg-${metric?.color}-100 w-fit mb-4`}>
                <Icon name={metric?.icon} className={`w-6 h-6 text-${metric?.color}-600`} />
              </div>
              <p className="text-sm text-gray-600 mb-1">{metric?.label}</p>
              <p className="text-2xl font-bold text-gray-900">{metric?.value}</p>
            </div>
          ))}
        </div>
      </div>
      {/* System Health */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">System Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <Icon name="CheckCircle" className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Stripe Connected</p>
              <p className="font-semibold text-gray-900">Active</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Icon name="Webhook" className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Webhooks</p>
              <p className="font-semibold text-gray-900">{data?.webhooks?.length || 0} Active</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <Icon name="Shield" className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">PCI Compliance</p>
              <p className="font-semibold text-gray-900">Certified</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100">
              <Icon name="Activity" className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">API Status</p>
              <p className="font-semibold text-gray-900">Operational</p>
            </div>
          </div>
        </div>
      </div>
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Payment Activity</h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5]?.map((item) => (
            <div key={item} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Icon name="CreditCard" className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Participation Fee - Election #{1000 + item}</p>
                  <p className="text-sm text-gray-600">2 minutes ago</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{lotteryPaymentService?.formatCurrency(50)}</p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Completed
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;