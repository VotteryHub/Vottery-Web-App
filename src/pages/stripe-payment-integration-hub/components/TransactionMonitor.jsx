import React from 'react';
import Icon from '../../../components/AppIcon';
import { stripeService } from '../../../services/stripeService';
import { format } from 'date-fns';

const TransactionMonitor = ({ payoutQueue }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle';
      case 'processing':
        return 'Clock';
      case 'pending':
        return 'AlertCircle';
      case 'rejected':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  const getRedemptionIcon = (type) => {
    switch (type) {
      case 'cash':
        return 'Banknote';
      case 'gift_card':
        return 'Gift';
      case 'bank_transfer':
        return 'Building2';
      default:
        return 'Wallet';
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground">Processing Queue</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon name="Activity" size={16} />
          <span>Real-time monitoring</span>
        </div>
      </div>

      {payoutQueue?.length > 0 ? (
        <div className="space-y-4">
          {payoutQueue?.map((transaction) => (
            <div
              key={transaction?.id}
              className="bg-muted rounded-lg p-4 hover:bg-muted/80 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name={getRedemptionIcon(transaction?.redemptionType)} size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-foreground capitalize">
                        {transaction?.redemptionType?.replace('_', ' ')}
                      </p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction?.status)}`}>
                        <Icon name={getStatusIcon(transaction?.status)} size={12} className="inline mr-1" />
                        {transaction?.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {transaction?.createdAt ? format(new Date(transaction?.createdAt), 'MMM dd, yyyy • hh:mm a') : 'Processing'}
                    </p>
                    {transaction?.paymentDetails?.retailer && (
                      <p className="text-xs text-muted-foreground">
                        Retailer: {transaction?.paymentDetails?.retailer}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">
                    {stripeService?.formatCurrency(transaction?.amount || 0)}
                  </p>
                  {transaction?.processingFee > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Fee: {stripeService?.formatCurrency(transaction?.processingFee)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Inbox" size={32} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No pending transactions</p>
          <p className="text-sm text-muted-foreground mt-1">Your completed transactions will appear here</p>
        </div>
      )}
    </div>
  );
};

export default TransactionMonitor;