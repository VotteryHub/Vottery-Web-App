-- Identity Verification Orchestration Events
-- Logs which provider (Sumsub / Veriff) handled each verification, and outcome.

CREATE TABLE IF NOT EXISTS public.identity_verification_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  purpose TEXT NOT NULL CHECK (purpose IN (
    'age_gate',
    'payout_kyc',
    'high_stakes_vote',
    'brand_onboarding',
    'fraud_review'
  )),
  election_id UUID NULL REFERENCES public.elections(id) ON DELETE SET NULL,
  primary_provider TEXT NOT NULL,
  fallback_provider TEXT NULL,
  final_provider TEXT NOT NULL,
  success BOOLEAN NOT NULL DEFAULT false,
  confidence_score INTEGER NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_identity_verification_events_user
  ON public.identity_verification_events(user_id);

CREATE INDEX IF NOT EXISTS idx_identity_verification_events_purpose
  ON public.identity_verification_events(purpose);

CREATE INDEX IF NOT EXISTS idx_identity_verification_events_created
  ON public.identity_verification_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_identity_verification_events_final_provider
  ON public.identity_verification_events(final_provider);

ALTER TABLE public.identity_verification_events ENABLE ROW LEVEL SECURITY;

-- Users can see their own verification events (for transparency / audit log).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'identity_verification_events'
      AND policyname = 'Users can view own identity verification events'
  ) THEN
    CREATE POLICY "Users can view own identity verification events"
    ON public.identity_verification_events
    FOR SELECT
    USING (user_id = auth.uid() OR public.is_admin());
  END IF;
END;
$$;

