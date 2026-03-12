import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { lotteryPaymentService } from '../../../services/lotteryPaymentService';

const TransactionMonitoring = ({ data, onRefresh }) => {
  const [timeRange, setTimeRange] = useState('24h');

  const transactionFlows = [
    { time: '14:32:15', type: 'participation_fee', amount: 100, status: 'success', duration: '1.2s' },
    { time: '14:31:48', type: 'prize_payout', amount: 5000, status: 'success', duration: '2.8s' },
    { time: '14:31:22', type: 'participation_fee', amount: 50, status: 'success', duration: '0.9s' },
    { time: '14:30:55', type: 'participation_fee', amount: 25, status: 'failed', duration: '3.1s' },
    { time: '14:30:18', type: 'prize_payout', amount: 2500, status: 'success', duration: '2.3s' }
  ];

  const failureReasons = [
    { reason: 'Insufficient funds', count: 45, percentage: 38.5 },
    { reason: 'Card declined', count: 32, percentage: 27.4 },
    { reason: 'Invalid card', count: 18, percentage: 15.4 },
    { reason: 'Network timeout', count: 12, percentage: 10.3 },
    { reason: 'Other', count: 10, percentage: 8.4 }
  ];

  const getStatusIcon = (status) => {
    return status === 'success' ? 'CheckCircle' : 'XCircle';
  };

  const getStatusColor = (status) => {
    return status === 'success' ? 'green' : 'red';
  };

  return (
    <div className="space-y-6">
      {/* Real-Time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <Icon name="Activity" className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Transactions/min</p>
          <p className="text-2xl font-bold text-gray-900">127</p>
          <p className="text-xs text-green-600 mt-2">+8.3% from last hour</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-green-100">
              <Icon name="TrendingUp" className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Success Rate</p>
          <p className="text-2xl font-bold text-gray-900">98.7%</p>
          <p className="text-xs text-green-600 mt-2">+0.3% improvement</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-red-100">
              <Icon name="AlertCircle" className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Failed Transactions</p>
          <p className="text-2xl font-bold text-gray-900">117</p>
          <p className="text-xs text-red-600 mt-2">-2.1% from yesterday</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <Icon name="Clock" className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Avg Response Time</p>
          <p className="text-2xl font-bold text-gray-900">1.8s</p>
          <p className="text-xs text-green-600 mt-2">-0.2s faster</p>
        </div>
      </div>
      {/* Real-Time Transaction Flow */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Real-Time Transaction Flow</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm text-gray-600">Live</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {transactionFlows?.map((transaction, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <Icon 
                  name={getStatusIcon(transaction?.status)} 
                  className={`w-5 h-5 text-${getStatusColor(transaction?.status)}-600`} 
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {transaction?.type === 'participation_fee' ? 'Participation Fee' : 'Prize Payout'}
                  </p>
                  <p className="text-xs text-gray-600">{transaction?.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-900">
                  {lotteryPaymentService?.formatCurrency(transaction?.amount)}
                </span>
                <span className="text-xs text-gray-600">{transaction?.duration}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${getStatusColor(transaction?.status)}-100 text-${getStatusColor(transaction?.status)}-800`}>
                  {transaction?.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Failure Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Failure Analysis</h2>
        <div className="space-y-3">
          {failureReasons?.map((failure, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{failure?.reason}</span>
                <span className="text-sm text-gray-600">{failure?.count} failures ({failure?.percentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${failure?.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Chargeback Management */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Chargeback Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <Icon name="AlertTriangle" className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">3</p>
            <p className="text-sm text-gray-600">Pending Disputes</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Icon name="CheckCircle" className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">47</p>
            <p className="text-sm text-gray-600">Resolved This Month</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Icon name="TrendingDown" className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">0.08%</p>
            <p className="text-sm text-gray-600">Chargeback Rate</p>
          </div>
        </div>
      </div>
      {/* Financial Reporting */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Reporting</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">Total Revenue (24h)</p>
            <p className="text-3xl font-bold text-gray-900 mb-4">
              {lotteryPaymentService?.formatCurrency(847250)}
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Participation Fees</span>
                <span className="font-semibold text-gray-900">{lotteryPaymentService?.formatCurrency(547250)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Processing Fees</span>
                <span className="font-semibold text-gray-900">{lotteryPaymentService?.formatCurrency(12500)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Net Revenue</span>
                <span className="font-semibold text-green-600">{lotteryPaymentService?.formatCurrency(534750)}</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Total Payouts (24h)</p>
            <p className="text-3xl font-bold text-gray-900 mb-4">
              {lotteryPaymentService?.formatCurrency(425000)}
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Prize Distributions</span>
                <span className="font-semibold text-gray-900">{lotteryPaymentService?.formatCurrency(425000)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Transfer Fees</span>
                <span className="font-semibold text-gray-900">{lotteryPaymentService?.formatCurrency(8500)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Net Payouts</span>
                <span className="font-semibold text-red-600">{lotteryPaymentService?.formatCurrency(416500)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionMonitoring;