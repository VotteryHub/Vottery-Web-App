import React from 'react';

/**
 * YouTube-style: "You're $X away from the payment threshold" / progress bar.
 */
export default function ThresholdProgress({ availableBalance, threshold, amountToThreshold, formatCurrency }) {
  const meetsThreshold = availableBalance >= threshold;
  const progress = Math.min(100, (availableBalance / threshold) * 100);

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Payment threshold</h3>
        <span className="text-sm text-muted-foreground">
          {formatCurrency(threshold)} minimum to get paid
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      {meetsThreshold ? (
        <p className="text-sm text-green-600 font-medium">
          You’ve reached the threshold. You can request a payout.
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          You’re {formatCurrency(amountToThreshold)} away from the payment threshold.
        </p>
      )}
    </div>
  );
}
