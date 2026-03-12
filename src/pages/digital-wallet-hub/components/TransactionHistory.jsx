import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { walletService } from '../../../services/walletService';

const TransactionHistory = ({ transactions, onRefresh }) => {
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions?.filter((transaction) => {
    const matchesType = filterType === 'all' || transaction?.transactionType === filterType;
    const matchesStatus = filterStatus === 'all' || transaction?.status === filterStatus;
    const matchesSearch = !searchTerm || 
      transaction?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      transaction?.referenceId?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    
    return matchesType && matchesStatus && matchesSearch;
  });

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'winning': return 'TrendingUp';
      case 'redemption': return 'ArrowDownCircle';
      case 'payout': return 'Send';
      case 'refund': return 'RotateCcw';
      case 'fee': return 'DollarSign';
      default: return 'Receipt';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-foreground bg-muted';
    }
  };

  const downloadReceipt = (transaction) => {
    const receiptData = `
VOTTERY TRANSACTION RECEIPT
========================================
Transaction ID: ${transaction?.id}
Reference: ${transaction?.referenceId || 'N/A'}
Type: ${transaction?.transactionType?.toUpperCase()}
Amount: ${walletService?.formatCurrency(transaction?.amount)}
Status: ${transaction?.status?.toUpperCase()}
Date: ${walletService?.formatDate(transaction?.createdAt)}
Description: ${transaction?.description}
========================================
    `;

    const blob = new Blob([receiptData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${transaction?.referenceId || transaction?.id}.txt`;
    link?.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground">Transaction History</h2>
        <Button
          variant="outline"
          size="sm"
          iconName="RefreshCw"
          onClick={onRefresh}
        >
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Search</label>
          <div className="relative">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Type</label>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e?.target?.value)}
            className="w-full"
          >
            <option value="all">All Types</option>
            <option value="winning">Winnings</option>
            <option value="redemption">Redemptions</option>
            <option value="payout">Payouts</option>
            <option value="refund">Refunds</option>
            <option value="fee">Fees</option>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e?.target?.value)}
            className="w-full"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </div>
      </div>

      {filteredTransactions?.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Inbox" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No transactions found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTransactions?.map((transaction) => (
            <div key={transaction?.id} className="border border-border rounded-lg p-4 hover:shadow-democratic-md transition-all duration-250">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <Icon
                      name={getTransactionIcon(transaction?.transactionType)}
                      size={20}
                      className="text-primary"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-foreground">{transaction?.description}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction?.status)}`}>
                        {transaction?.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {walletService?.formatDate(transaction?.createdAt)}
                    </p>
                    {transaction?.referenceId && (
                      <p className="text-xs text-muted-foreground font-mono">
                        Ref: {transaction?.referenceId}
                      </p>
                    )}
                    {transaction?.elections && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Election: {transaction?.elections?.title}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-xl font-bold mb-2 ${
                    transaction?.transactionType === 'winning' ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {transaction?.transactionType === 'winning' ? '+' : '-'}
                    {walletService?.formatCurrency(transaction?.amount)}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Download"
                    onClick={() => downloadReceipt(transaction)}
                  >
                    Receipt
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;