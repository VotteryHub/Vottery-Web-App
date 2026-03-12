import React from 'react';

/**
 * YouTube-style: List of payments – date, amount, status.
 */
export default function PayoutHistory({ history, formatCurrency, formatDate }) {
  const formatDateDefault = (d) =>
    new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const fmt = formatDate || formatDateDefault;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Payment history</h2>
      {!history?.length ? (
        <p className="text-sm text-muted-foreground py-6">No payments yet.</p>
      ) : (
        <ul className="space-y-3">
          {history.slice(0, 12).map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between py-3 border-b border-border last:border-0"
            >
              <div>
                <p className="font-medium text-foreground">
                  {formatCurrency(item.amount, item.currency)}
                </p>
                <p className="text-xs text-muted-foreground">{fmt(item.createdAt)}</p>
              </div>
              <span
                className={`text-sm font-medium capitalize ${
                  item.status === 'completed'
                    ? 'text-green-600'
                    : item.status === 'failed'
                      ? 'text-red-600'
                      : 'text-amber-600'
                }`}
              >
                {item.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
