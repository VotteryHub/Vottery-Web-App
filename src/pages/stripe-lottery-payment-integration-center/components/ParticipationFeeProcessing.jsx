import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { lotteryPaymentService } from '../../../services/lotteryPaymentService';

const ParticipationFeeProcessing = ({ data, onRefresh }) => {
  const [selectedZone, setSelectedZone] = useState('all');

  const zones = [
    { code: 'PT1', name: 'Premium Tier 1', baseFee: 100, multiplier: 1.0, color: 'purple' },
    { code: 'PT2', name: 'Premium Tier 2', baseFee: 75, multiplier: 0.75, color: 'blue' },
    { code: 'MT1', name: 'Mid Tier 1', baseFee: 50, multiplier: 0.5, color: 'green' },
    { code: 'MT2', name: 'Mid Tier 2', baseFee: 35, multiplier: 0.35, color: 'yellow' },
    { code: 'BT1', name: 'Base Tier 1', baseFee: 25, multiplier: 0.25, color: 'orange' },
    { code: 'BT2', name: 'Base Tier 2', baseFee: 15, multiplier: 0.15, color: 'red' },
    { code: 'GT1', name: 'Growth Tier 1', baseFee: 10, multiplier: 0.1, color: 'pink' },
    { code: 'GT2', name: 'Growth Tier 2', baseFee: 5, multiplier: 0.05, color: 'indigo' }
  ];

  const recentTransactions = [
    { id: 1, election: 'Tech Innovation Poll', zone: 'PT1', amount: 100, status: 'completed', time: '2 min ago' },
    { id: 2, election: 'Community Choice Awards', zone: 'MT1', amount: 50, status: 'completed', time: '5 min ago' },
    { id: 3, election: 'Product Feature Vote', zone: 'BT1', amount: 25, status: 'pending', time: '8 min ago' },
    { id: 4, election: 'Brand Preference Survey', zone: 'GT1', amount: 10, status: 'completed', time: '12 min ago' },
    { id: 5, election: 'Market Research Poll', zone: 'PT2', amount: 75, status: 'failed', time: '15 min ago' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'pending': return 'yellow';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      {/* Zone Pricing Matrix */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Zone-Specific Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {zones?.map((zone) => (
            <div key={zone?.code} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${zone?.color}-100 text-${zone?.color}-800`}>
                  {zone?.code}
                </span>
                <span className="text-sm text-gray-600">{zone?.multiplier}x</span>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-2">{zone?.name}</p>
              <p className="text-2xl font-bold text-gray-900">
                {lotteryPaymentService?.formatCurrency(zone?.baseFee)}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Payment Method Validation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method Validation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-100">
              <Icon name="CreditCard" className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Cards Validated</p>
              <p className="text-xl font-bold text-gray-900">8,542</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-100">
              <Icon name="CheckCircle" className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-xl font-bold text-gray-900">97.8%</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-red-100">
              <Icon name="XCircle" className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Failed Validations</p>
              <p className="text-xl font-bold text-gray-900">188</p>
            </div>
          </div>
        </div>
      </div>
      {/* Instant Confirmation Workflow */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Instant Confirmation Workflow</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold">1</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Payment Intent Creation</p>
              <p className="text-sm text-gray-600">Average: 0.3s</p>
            </div>
            <Icon name="CheckCircle" className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold">2</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Payment Method Validation</p>
              <p className="text-sm text-gray-600">Average: 0.8s</p>
            </div>
            <Icon name="CheckCircle" className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold">3</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Charge Processing</p>
              <p className="text-sm text-gray-600">Average: 1.2s</p>
            </div>
            <Icon name="CheckCircle" className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold">4</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Confirmation & Receipt</p>
              <p className="text-sm text-gray-600">Average: 0.2s</p>
            </div>
            <Icon name="CheckCircle" className="w-5 h-5 text-green-600" />
          </div>
        </div>
      </div>
      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
          <Button onClick={onRefresh} variant="outline" size="sm">
            <Icon name="RefreshCw" className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Election</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Zone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentTransactions?.map((transaction) => (
                <tr key={transaction?.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{transaction?.election}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {transaction?.zone}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {lotteryPaymentService?.formatCurrency(transaction?.amount)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${getStatusColor(transaction?.status)}-100 text-${getStatusColor(transaction?.status)}-800`}>
                      {transaction?.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{transaction?.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ParticipationFeeProcessing;