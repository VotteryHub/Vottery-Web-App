import React from 'react';
import { CreditCard, CheckCircle, XCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const PaymentAnalyticsPanel = ({ paymentAnalytics }) => {
  const successRate = parseFloat(paymentAnalytics?.successRate || 0);
  const totalPayments = paymentAnalytics?.totalPayments || 0;
  const successfulPayments = paymentAnalytics?.successfulPayments || 0;
  const failedPayments = paymentAnalytics?.failedPayments || 0;

  const paymentStats = [
    {
      label: 'Total Payments',
      value: totalPayments,
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Successful',
      value: successfulPayments,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Failed',
      value: failedPayments,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      label: 'Success Rate',
      value: `${successRate}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  // Mock dunning campaign data
  const dunningMetrics = {
    activeRetries: Math.floor(failedPayments * 0.6),
    recoveredPayments: Math.floor(failedPayments * 0.35),
    recoveryRate: failedPayments > 0 ? ((Math.floor(failedPayments * 0.35) / failedPayments) * 100)?.toFixed(1) : 0
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <CreditCard className="w-6 h-6 text-green-600" />
        Payment Analytics
      </h2>
      {/* Payment Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {paymentStats?.map((stat, index) => {
          const Icon = stat?.icon;
          return (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-2 rounded-lg ${stat?.bgColor}`}>
                  <Icon className={`w-4 h-4 ${stat?.color}`} />
                </div>
                <span className="text-xs font-medium text-gray-600">{stat?.label}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat?.value}</div>
            </div>
          );
        })}
      </div>
      {/* Success Rate Visualization */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Transaction Success Rate</span>
          <span className="text-sm font-bold text-gray-900">{successRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              successRate >= 95
                ? 'bg-gradient-to-r from-green-500 to-green-600'
                : successRate >= 85
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :'bg-gradient-to-r from-red-500 to-red-600'
            }`}
            style={{ width: `${successRate}%` }}
          ></div>
        </div>
        <div className="mt-2 flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Excellent: ≥95%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <span>Good: 85-94%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span>Poor: &lt;85%</span>
          </div>
        </div>
      </div>
      {/* Dunning Campaign Performance */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-700">Failed Payment Recovery</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Active Retries</span>
            <span className="font-semibold text-gray-900">{dunningMetrics?.activeRetries}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Recovered Payments</span>
            <span className="font-semibold text-green-600">{dunningMetrics?.recoveredPayments}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Recovery Rate</span>
            <span className="font-semibold text-purple-600">{dunningMetrics?.recoveryRate}%</span>
          </div>
        </div>
        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            style={{ width: `${dunningMetrics?.recoveryRate}%` }}
          ></div>
        </div>
      </div>
      {/* Optimization Recommendations */}
      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-1">Optimization Recommendations</p>
            <ul className="text-xs text-gray-600 space-y-1">
              {successRate < 95 && <li>• Consider implementing additional payment retry logic</li>}
              {failedPayments > 10 && <li>• Review failed payment patterns for common issues</li>}
              <li>• Enable automatic card updater for expired cards</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentAnalyticsPanel;