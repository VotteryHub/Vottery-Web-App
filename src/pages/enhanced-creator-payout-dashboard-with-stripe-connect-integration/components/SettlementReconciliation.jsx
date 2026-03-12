import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const SettlementReconciliation = ({ userId }) => {
  const [filter, setFilter] = useState('all');

  const settlements = [
    { id: 'SET-001', amount: 245.50, stripeAmount: 245.50, status: 'matched', date: '2026-02-20', description: 'Election earnings - Feb W1', transactionId: 'txn_abc123' },
    { id: 'SET-002', amount: 180.00, stripeAmount: 180.00, status: 'matched', date: '2026-02-15', description: 'Marketplace service fee', transactionId: 'txn_def456' },
    { id: 'SET-003', amount: 320.75, stripeAmount: 315.00, status: 'discrepancy', date: '2026-02-10', description: 'Sponsorship revenue', transactionId: 'txn_ghi789', discrepancy: 5.75 },
    { id: 'SET-004', amount: 95.00, stripeAmount: null, status: 'unmatched', date: '2026-02-05', description: 'Bonus payment', transactionId: null },
    { id: 'SET-005', amount: 450.00, stripeAmount: 450.00, status: 'matched', date: '2026-01-31', description: 'Monthly creator bonus', transactionId: 'txn_jkl012' }
  ];

  const filtered = filter === 'all' ? settlements : settlements?.filter(s => s?.status === filter);
  const matched = settlements?.filter(s => s?.status === 'matched')?.length;
  const unmatched = settlements?.filter(s => s?.status === 'unmatched')?.length;
  const discrepancies = settlements?.filter(s => s?.status === 'discrepancy')?.length;

  const statusConfig = {
    matched: { label: 'Matched', color: 'text-green-600', bg: 'bg-green-100', icon: 'CheckCircle' },
    unmatched: { label: 'Unmatched', color: 'text-red-600', bg: 'bg-red-100', icon: 'XCircle' },
    discrepancy: { label: 'Discrepancy', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: 'AlertTriangle' }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Matched', value: matched, color: 'text-green-600', bg: 'bg-green-50', icon: 'CheckCircle' },
          { label: 'Unmatched', value: unmatched, color: 'text-red-600', bg: 'bg-red-50', icon: 'XCircle' },
          { label: 'Discrepancies', value: discrepancies, color: 'text-yellow-600', bg: 'bg-yellow-50', icon: 'AlertTriangle' }
        ]?.map((item, i) => (
          <div key={i} className={`${item?.bg} rounded-xl p-4 border border-gray-200`}>
            <div className="flex items-center gap-2 mb-1">
              <Icon name={item?.icon} size={16} className={item?.color} />
              <span className="text-xs text-muted-foreground">{item?.label}</span>
            </div>
            <p className={`text-3xl font-bold ${item?.color}`}>{item?.value}</p>
          </div>
        ))}
      </div>
      {/* Reconciliation Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="BarChart2" size={20} className="text-blue-500" />
            Settlement Transactions
          </h3>
          <div className="flex gap-2">
            {['all', 'matched', 'unmatched', 'discrepancy']?.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${
                  filter === f ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-muted-foreground'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Settlement ID</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Description</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Expected</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Stripe Amount</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filtered?.map(s => {
                const sc = statusConfig?.[s?.status];
                return (
                  <tr key={s?.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono text-foreground">{s?.id}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{s?.description}</td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-foreground">${s?.amount?.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-foreground">
                      {s?.stripeAmount != null ? `$${s?.stripeAmount?.toFixed(2)}` : '—'}
                      {s?.discrepancy && <span className="text-red-500 text-xs ml-1">(-${s?.discrepancy})</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1 text-xs font-medium ${sc?.color} ${sc?.bg} px-2 py-1 rounded-full w-fit`}>
                        <Icon name={sc?.icon} size={12} />
                        {sc?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{s?.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SettlementReconciliation;
