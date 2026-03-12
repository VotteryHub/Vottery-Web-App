-- Creator prize compliance: red-flag creators with 3+ unpaid_prize flags (for platform blacklist)
-- Payment notification activity types for settlement/payout/payment-failure alerts

-- Add alert_type for fraud/compliance SMS to admin_alert_contacts (if not already present)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'admin_alert_type' AND e.enumlabel = 'fraud_compliance'
  ) THEN
    -- Use check constraint instead of enum if table already has text
    NULL;
  END IF;
END $$;

-- Extend admin_alert_contacts.alert_type to include fraud_compliance (via comment; column is TEXT)
COMMENT ON COLUMN public.admin_alert_contacts.alert_type IS 'One of: ai_failover, ai_degradation, cost_approval, fraud_compliance, all';

-- Add prize_compliance_red_flagged_at to user_profiles for blacklist tracking
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS prize_compliance_red_flagged_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS prize_compliance_red_flag_count INTEGER DEFAULT 0;

COMMENT ON COLUMN public.user_profiles.prize_compliance_red_flagged_at IS 'Set when creator has 3+ unpaid_prize flags; used for platform red-flag/blacklist.';
COMMENT ON COLUMN public.user_profiles.prize_compliance_red_flag_count IS 'Number of unpaid_prize flags (updated by check-creator-prize-compliance Edge).';
