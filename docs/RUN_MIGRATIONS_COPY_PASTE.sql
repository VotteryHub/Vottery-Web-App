-- =============================================================================
-- Vottery Supabase migrations — copy, paste, and run in Supabase Dashboard SQL Editor
-- Run once. Idempotent (safe if some objects already exist).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Admin Alert Contacts (SMS critical fraud/compliance alerts to admins)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_alert_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL,
  alert_type TEXT NOT NULL DEFAULT 'ai_failover',
  display_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_alert_contacts_alert_type ON public.admin_alert_contacts(alert_type);
CREATE INDEX IF NOT EXISTS idx_admin_alert_contacts_active ON public.admin_alert_contacts(is_active) WHERE is_active = true;

ALTER TABLE public.admin_alert_contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage admin_alert_contacts" ON public.admin_alert_contacts;
CREATE POLICY "Admins can manage admin_alert_contacts" ON public.admin_alert_contacts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

COMMENT ON TABLE public.admin_alert_contacts IS 'Phone numbers for Telnyx AI failover/degradation and fraud/compliance alerts';

COMMENT ON COLUMN public.admin_alert_contacts.alert_type IS 'One of: ai_failover, ai_degradation, cost_approval, fraud_compliance, all';

-- -----------------------------------------------------------------------------
-- 2. Creator Prize Compliance Flags (red-flag creators who do not send prizes)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.creator_prize_compliance_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
  flag_type TEXT NOT NULL DEFAULT 'unpaid_prize' CHECK (flag_type IN ('unpaid_prize', 'partial', 'resolved')),
  flagged_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(election_id)
);

COMMENT ON TABLE public.creator_prize_compliance_flags IS 'Tracks creators who have not distributed gamified election prizes; used for platform red-flag/blacklist.';

CREATE INDEX IF NOT EXISTS idx_creator_prize_compliance_user ON public.creator_prize_compliance_flags(user_id);
CREATE INDEX IF NOT EXISTS idx_creator_prize_compliance_election ON public.creator_prize_compliance_flags(election_id);
CREATE INDEX IF NOT EXISTS idx_creator_prize_compliance_flag_type ON public.creator_prize_compliance_flags(flag_type);

ALTER TABLE public.creator_prize_compliance_flags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage creator_prize_compliance_flags" ON public.creator_prize_compliance_flags;
CREATE POLICY "Admins can manage creator_prize_compliance_flags"
  ON public.creator_prize_compliance_flags FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Creators can view own flags" ON public.creator_prize_compliance_flags;
CREATE POLICY "Creators can view own flags"
  ON public.creator_prize_compliance_flags FOR SELECT
  USING (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- 3. User profiles: red-flag columns (set by check-creator-prize-compliance Edge)
-- -----------------------------------------------------------------------------
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS prize_compliance_red_flagged_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS prize_compliance_red_flag_count INTEGER DEFAULT 0;

COMMENT ON COLUMN public.user_profiles.prize_compliance_red_flagged_at IS 'Set when creator has 3+ unpaid_prize flags; used for platform red-flag/blacklist.';
COMMENT ON COLUMN public.user_profiles.prize_compliance_red_flag_count IS 'Number of unpaid_prize flags (updated by check-creator-prize-compliance Edge).';
