import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { PAYOUT_THRESHOLD } from '../constants';

/**
 * YouTube-style: Single "Request payout" when above threshold. Same validation and errors as API.
 */
export default function RequestPayoutForm({
  availableBalance,
  meetsThreshold,
  threshold,
  formatCurrency,
  onRequest,
  requesting,
  error,
  successMessage,
}) {
  const [amount, setAmount] = useState('');
  const numAmount = Number(amount);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!meetsThreshold || numAmount < threshold) return;
    await onRequest(numAmount, { method: 'bank_transfer' });
    if (successMessage) setAmount('');
  };

  const invalidAmount = !Number.isFinite(numAmount) || numAmount <= 0;
  const belowMin = numAmount > 0 && numAmount < threshold;
  const overBalance = numAmount > availableBalance;
  const canSubmit =
    meetsThreshold && numAmount >= threshold && numAmount <= availableBalance && !requesting;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Request payout</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Amount</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min={threshold}
            step="1"
            disabled={!meetsThreshold}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Available: {formatCurrency(availableBalance)} • Minimum: {formatCurrency(threshold)}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        <Button
          type="submit"
          disabled={!canSubmit}
          iconName={requesting ? 'Loader' : 'Send'}
          className="w-full"
        >
          {requesting ? 'Submitting...' : 'Request payout'}
        </Button>

        {!meetsThreshold && (
          <p className="text-sm text-muted-foreground">
            Reach {formatCurrency(threshold)} available balance to request a payout.
          </p>
        )}
      </form>
    </div>
  );
}
