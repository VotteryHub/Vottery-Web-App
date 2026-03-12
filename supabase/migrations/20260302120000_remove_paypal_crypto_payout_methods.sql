-- Migration: Remove PayPal and Cryptocurrency from payout options
-- Normalize existing users with paypal/crypto_wallet to stripe

UPDATE public.payout_settings
SET preferred_method = 'stripe'::public.payout_method
WHERE preferred_method IN ('paypal', 'crypto_wallet');

-- Note: The payout_method enum still contains paypal and crypto_wallet for backward compatibility
-- with historical records. New UI no longer offers these options.
