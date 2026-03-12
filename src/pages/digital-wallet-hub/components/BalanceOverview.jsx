import React from 'react';
import Icon from '../../../components/AppIcon';
import { walletService } from '../../../services/walletService';

const BalanceOverview = ({ wallet, transactions, redemptions }) => {
  const recentTransactions = transactions?.slice(0, 5) || [];
  const pendingRedemptions = redemptions?.filter(r => r?.status === 'pending' || r?.status === 'processing') || [];

  const stats = [
    {
      label: 'Available Balance',
      value: walletService?.formatCurrency(wallet?.availableBalance || 0, wallet?.currency),
      icon: 'Wallet',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Locked Balance',
      value: walletService?.formatCurrency(wallet?.lockedBalance || 0, wallet?.currency),
      icon: 'Lock',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      label: 'Total Winnings',
      value: walletService?.formatCurrency(wallet?.totalWinnings || 0, wallet?.currency),
      icon: 'TrendingUp',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Total Redeemed',
      value: walletService?.formatCurrency(wallet?.totalRedeemed || 0, wallet?.currency),
      icon: 'ArrowDownCircle',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'winning': return 'TrendingUp';
      case 'redemption': return 'ArrowDownCircle';
      case 'payout': return 'Send';
      case 'refund': return 'RotateCcw';
      default: return 'Receipt';
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'winning': return 'text-green-600';
      case 'redemption': return 'text-orange-600';
      case 'payout': return 'text-blue-600';
      case 'refund': return 'text-purple-600';
      default: return 'text-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats?.map((stat, index) => (
          <div key={index} className="bg-card border border-border rounded-xl p-6 hover:shadow-democratic-lg transition-all duration-250">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat?.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon name={stat?.icon} size={24} className={stat?.color} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{stat?.label}</p>
            <p className="text-2xl font-bold text-foreground">{stat?.value}</p>
          </div>
        ))}
      </div>

      {pendingRedemptions?.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Icon name="Clock" size={20} className="text-orange-600 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900 mb-2">Pending Redemptions</h3>
              <p className="text-sm text-orange-700 mb-3">
                You have {pendingRedemptions?.length} redemption{pendingRedemptions?.length > 1 ? 's' : ''} being processed
              </p>
              <div className="space-y-2">
                {pendingRedemptions?.map((redemption) => (
                  <div key={redemption?.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                    <div>
                      <p className="font-medium text-orange-900">
                        {redemption?.redemptionType?.replace('_', ' ')?.toUpperCase()}
                      </p>
                      <p className="text-xs text-orange-600">
                        {walletService?.formatDate(redemption?.createdAt)}
                      </p>
                    </div>
                    <p className="font-semibold text-orange-900">
                      {walletService?.formatCurrency(redemption?.amount, wallet?.currency)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-bold text-foreground">Recent Transactions</h2>
          <Icon name="Receipt" size={20} className="text-muted-foreground" />
        </div>

        {recentTransactions?.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Inbox" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions?.map((transaction) => (
              <div key={transaction?.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-muted transition-all duration-250">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center`}>
                    <Icon
                      name={getTransactionIcon(transaction?.transactionType)}
                      size={20}
                      className={getTransactionColor(transaction?.transactionType)}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{transaction?.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {walletService?.formatDate(transaction?.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction?.transactionType === 'winning' ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {transaction?.transactionType === 'winning' ? '+' : '-'}
                    {walletService?.formatCurrency(transaction?.amount, wallet?.currency)}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">{transaction?.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BalanceOverview;