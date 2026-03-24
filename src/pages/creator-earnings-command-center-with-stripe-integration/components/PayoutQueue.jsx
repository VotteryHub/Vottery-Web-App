import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Icon from '../../../components/AppIcon';

import { stripeService } from '../../../services/stripeService';

const PayoutQueue = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayouts();
  }, []);

  const loadPayouts = async () => {
    try {
      setLoading(true);
      const result = await stripeService?.getPayoutQueue();
      if (result?.data) {
        setPayouts(result?.data);
      }
    } catch (error) {
      console.error('Error loading payouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' };
      case 'processing':
        return { icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-50' };
      case 'pending':
        return { icon: AlertCircle, color: 'text-orange-600', bgColor: 'bg-orange-50' };
      case 'failed':
        return { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50' };
      default:
        return { icon: Clock, color: 'text-gray-600', bgColor: 'bg-gray-50' };
    }
  };

  const getStatusLabel = (status) => {
    return status?.charAt(0)?.toUpperCase() + status?.slice(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon icon={Clock} className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center gap-3">
            <Icon icon={Clock} className="w-6 h-6 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {payouts?.filter(p => p?.status === 'pending')?.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <Icon icon={AlertCircle} className="w-6 h-6 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-gray-900">
                {payouts?.filter(p => p?.status === 'processing')?.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <Icon icon={CheckCircle} className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {payouts?.filter(p => p?.status === 'completed')?.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payout List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Payout Queue</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {payouts?.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Icon icon={Clock} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No pending payouts</p>
            </div>
          ) : (
            payouts?.map((payout, index) => {
              const statusConfig = getStatusIcon(payout?.status);
              return (
                <div key={index} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-2 rounded-lg ${statusConfig?.bgColor}`}>
                        <Icon icon={statusConfig?.icon} className={`w-5 h-5 ${statusConfig?.color}`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-medium text-gray-900">
                            {payout?.redemptionType === 'cash' ? 'Cash Payout' :
                             payout?.redemptionType === 'gift_card' ? 'Gift Card' :
                             payout?.redemptionType === 'bank_transfer' ? 'Bank Transfer' :
                             'Payout request'}
                          </p>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig?.bgColor} ${statusConfig?.color}`}>
                            {getStatusLabel(payout?.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Requested: {new Date(payout?.createdAt)?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ${parseFloat(payout?.finalAmount || 0)?.toFixed(2)}
                      </p>
                      {payout?.processingFee > 0 && (
                        <p className="text-sm text-gray-500">
                          Fee: ${parseFloat(payout?.processingFee)?.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default PayoutQueue;
