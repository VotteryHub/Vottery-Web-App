/**
 * Payout feature constants – Source of Truth for Web and Mobile.
 * YouTube-style: threshold, monthly cycle, single payment method.
 */

export const PAYOUT_THRESHOLD = 100; // Minimum balance (in default currency) to request payout
export const DEFAULT_CURRENCY = 'USD';
export const PAYOUT_CYCLE_DAY_START = 1; // Earnings finalized at start of month
export const PAYOUT_CYCLE_DAY_SEND = 21; // Payment sent between 21st–26th

/** User-facing error messages – must match on Web and Mobile */
export const PAYOUT_ERRORS = {
  INVALID_AMOUNT: 'Please enter a valid amount.',
  INSUFFICIENT_BALANCE: 'Insufficient balance.',
  BELOW_THRESHOLD: `Minimum payout amount is $${PAYOUT_THRESHOLD}.`,
  NOT_AUTHENTICATED: 'You must be signed in to request a payout.',
  REQUEST_FAILED: 'Unable to process payout. Please try again.',
  PAYMENT_METHOD_REQUIRED: 'Add a payment method in settings to receive payouts.',
};

export const PAYOUT_SUCCESS = {
  REQUEST_SUBMITTED: 'Payout request submitted. You’ll be paid by the next payment date.',
};

export const PAYOUT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
};
