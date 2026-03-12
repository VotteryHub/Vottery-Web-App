import React from 'react';

/**
 * YouTube-style: Available balance, pending (optional), next payment date.
 */
export default function BalanceCard({
  availableBalance,
  nextPaymentDate,
  formatCurrency,
  currency = 'USD',
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-card border border-border rounded-xl p-6">
        <p className="text-sm text-muted-foreground mb-1">Available balance</p>
        <p className="text-2xl font-bold text-foreground">{formatCurrency(availableBalance, currency)}</p>
        <p className="text-xs text-muted-foreground mt-2">Ready to withdraw or use</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-6">
        <p className="text-sm text-muted-foreground mb-1">Next payment date</p>
        <p className="text-xl font-semibold text-foreground">{nextPaymentDate}</p>
        <p className="text-xs text-muted-foreground mt-2">Payments are sent around the 21st–26th</p>
      </div>
    </div>
  );
}
