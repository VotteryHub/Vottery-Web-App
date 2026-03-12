import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { lotteryPaymentService } from '../../../services/lotteryPaymentService';

const PrizePayoutAutomation = ({ data, onRefresh }) => {
  const [processingPayout, setProcessingPayout] = useState(null);

  const handleProcessPayout = async (distributionId) => {
    setProcessingPayout(distributionId);
    try {
      await lotteryPaymentService?.processPrizePayout(distributionId);
      onRefresh();
    } catch (error) {
      console.error('Failed to process payout:', error);
    } finally {
      setProcessingPayout(null);
    }
  };

  const pendingPayouts = data?.pendingPayouts || [];

  return (
    <div className="space-y-6">
      {/* Payout Queue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-yellow-100">
              <Icon name="Clock" className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Pending Payouts</p>
          <p className="text-2xl font-bold text-gray-900">{pendingPayouts?.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <Icon name="DollarSign" className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Queue Value</p>
          <p className="text-2xl font-bold text-gray-900">
            {lotteryPaymentService?.formatCurrency(data?.payoutStats?.pendingAmount || 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-green-100">
              <Icon name="CheckCircle" className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Completed Today</p>
          <p className="text-2xl font-bold text-gray-900">47</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <Icon name="Zap" className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Avg Processing Time</p>
          <p className="text-2xl font-bold text-gray-900">3.2s</p>
        </div>
      </div>
      {/* Automated Transfer Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Automated Transfer Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Auto-process on draw completion</p>
                <p className="text-sm text-gray-600">Automatically initiate payouts when lottery ends</p>
              </div>
              <div className="flex items-center">
                <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Batch processing</p>
                <p className="text-sm text-gray-600">Process multiple payouts simultaneously</p>
              </div>
              <div className="flex items-center">
                <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Email notifications</p>
                <p className="text-sm text-gray-600">Notify winners when payout is initiated</p>
              </div>
              <div className="flex items-center">
                <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Tax compliance calculations</p>
                <p className="text-sm text-gray-600">Automatically calculate tax withholdings</p>
              </div>
              <div className="flex items-center">
                <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Multi-Currency Support */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Multi-Currency Support</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { currency: 'INR', symbol: '₹', rate: 1.0, volume: 2847500 },
            { currency: 'USD', symbol: '$', rate: 0.012, volume: 34170 },
            { currency: 'EUR', symbol: '€', rate: 0.011, volume: 31322 }
          ]?.map((curr) => (
            <div key={curr?.currency} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold">{curr?.symbol}</span>
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  {curr?.currency}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Exchange Rate</p>
              <p className="text-lg font-semibold text-gray-900 mb-3">{curr?.rate}</p>
              <p className="text-sm text-gray-600 mb-1">Total Volume</p>
              <p className="text-lg font-semibold text-gray-900">
                {curr?.symbol}{curr?.volume?.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Payout Queue */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Payout Queue</h2>
          <Button onClick={onRefresh} variant="outline" size="sm">
            <Icon name="RefreshCw" className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
        <div className="space-y-3">
          {pendingPayouts?.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="CheckCircle" className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <p className="text-gray-600">No pending payouts</p>
            </div>
          ) : (
            pendingPayouts?.slice(0, 10)?.map((payout) => (
              <div key={payout?.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-100">
                    <Icon name="Trophy" className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{payout?.elections?.title || 'Unknown Election'}</p>
                    <p className="text-sm text-gray-600">
                      Winner: {payout?.userProfiles?.name || 'Unknown'} • Tier: {payout?.prizeTier || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {lotteryPaymentService?.formatCurrency(payout?.prizeAmount || 0)}
                    </p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </div>
                  <Button
                    onClick={() => handleProcessPayout(payout?.id)}
                    disabled={processingPayout === payout?.id}
                    size="sm"
                  >
                    {processingPayout === payout?.id ? (
                      <Icon name="Loader2" className="w-4 h-4 animate-spin" />
                    ) : (
                      'Process'
                    )}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PrizePayoutAutomation;