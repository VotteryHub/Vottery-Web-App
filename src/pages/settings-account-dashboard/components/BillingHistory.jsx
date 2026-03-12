import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { settingsService } from '../../../services/settingsService';

const BillingHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [walletInfo, setWalletInfo] = useState(null);

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    try {
      setLoading(true);
      const [walletResult, transactionsResult] = await Promise.all([
        settingsService?.getWalletInfo(),
        settingsService?.getTransactionHistory(20)
      ]);

      if (walletResult?.data) setWalletInfo(walletResult?.data);
      if (transactionsResult?.data) setTransactions(transactionsResult?.data);
    } catch (err) {
      console.error('Failed to load billing data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type) => {
    const iconMap = {
      winning: 'TrendingUp',
      redemption: 'CreditCard',
      payout: 'ArrowUpRight',
      refund: 'RotateCcw',
      fee: 'Minus'
    };
    return iconMap?.[type] || 'DollarSign';
  };

  const getTransactionColor = (type) => {
    const colorMap = {
      winning: 'text-green-500',
      redemption: 'text-blue-500',
      payout: 'text-purple-500',
      refund: 'text-orange-500',
      fee: 'text-red-500'
    };
    return colorMap?.[type] || 'text-gray-500';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
          Billing History
        </h3>
        <p className="text-sm text-muted-foreground">
          View your transaction history and wallet information
        </p>
      </div>
      {walletInfo && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-lg p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Wallet" size={20} />
              <span className="text-sm opacity-90">Available Balance</span>
            </div>
            <p className="text-2xl font-bold">
              {walletInfo?.currency} {parseFloat(walletInfo?.availableBalance || 0)?.toFixed(2)}
            </p>
          </div>

          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="TrendingUp" size={20} className="text-green-500" />
              <span className="text-sm text-muted-foreground">Total Winnings</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {walletInfo?.currency} {parseFloat(walletInfo?.totalWinnings || 0)?.toFixed(2)}
            </p>
          </div>

          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="ArrowUpRight" size={20} className="text-blue-500" />
              <span className="text-sm text-muted-foreground">Total Payouts</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {walletInfo?.currency} {parseFloat(walletInfo?.totalPayouts || 0)?.toFixed(2)}
            </p>
          </div>
        </div>
      )}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-foreground">Transaction History</h4>
          <Button variant="outline" size="sm" iconName="Download">
            Export CSV
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : transactions?.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <Icon name="Receipt" size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions?.map((transaction) => (
              <div
                key={transaction?.id}
                className="flex items-center justify-between p-4 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Icon
                      name={getTransactionIcon(transaction?.transactionType)}
                      size={20}
                      className={getTransactionColor(transaction?.transactionType)}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {transaction?.description || transaction?.transactionType}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction?.createdAt)?.toLocaleDateString()} •{' '}
                      {new Date(transaction?.createdAt)?.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      transaction?.transactionType === 'winning' ?'text-green-500'
                        : transaction?.transactionType === 'fee' ?'text-red-500' :'text-foreground'
                    }`}
                  >
                    {transaction?.transactionType === 'winning' ? '+' : '-'}
                    {walletInfo?.currency} {parseFloat(transaction?.amount || 0)?.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">{transaction?.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="font-semibold text-foreground mb-3">Payment Methods</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <Icon name="CreditCard" size={20} className="text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Stripe Account</p>
                <p className="text-xs text-muted-foreground">Connected</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingHistory;
