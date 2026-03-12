import React from 'react';

/**
 * YouTube-style: Single payment method (e.g. bank account). Link to settings if not set.
 */
export default function PaymentMethodCard({ settings, onManage }) {
  const method = settings?.preferredMethod || 'bank_transfer';
  const hasBank = method === 'bank_transfer' && settings?.bankDetails?.accountName;
  const hasStripe = method === 'stripe' && settings?.stripeAccountId;
  const isSet = hasBank || hasStripe;

  const label =
    method === 'bank_transfer'
      ? 'Bank account'
      : method === 'stripe'
        ? 'Stripe Connect'
        : 'Payment method';

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Payment method</p>
          <p className="font-medium text-foreground mt-1">
            {isSet ? label : 'Not set'}
            {isSet && method === 'bank_transfer' && settings?.bankDetails?.accountName && (
              <span className="text-muted-foreground font-normal ml-1">
                •••• {String(settings.bankDetails.accountNumber || '').slice(-4)}
              </span>
            )}
          </p>
        </div>
        {onManage && (
          <button
            type="button"
            onClick={onManage}
            className="text-sm font-medium text-primary hover:underline"
          >
            {isSet ? 'Manage' : 'Add payment method'}
          </button>
        )}
      </div>
    </div>
  );
}
