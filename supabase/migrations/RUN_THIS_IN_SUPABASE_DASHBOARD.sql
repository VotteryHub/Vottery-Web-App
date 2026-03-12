-- Run this in Supabase Dashboard > SQL Editor
-- Migration: Remove PayPal and Cryptocurrency from payout options (20260302120000)

UPDATE public.payout_settings
SET preferred_method = 'stripe'::public.payout_method
WHERE preferred_method IN ('paypal', 'crypto_wallet');

-- Migration: Add notification_settings for Prediction Pool Notifications Hub (20260302140000)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'user_preferences' AND column_name = 'notification_settings'
  ) THEN
    ALTER TABLE public.user_preferences ADD COLUMN notification_settings JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Migration: admin_alert_contacts for MCQ/Telnyx alerts (20260302190000)
-- If admin_alert_contacts table is missing, run: supabase/migrations/20260302190000_admin_alert_contacts.sql
