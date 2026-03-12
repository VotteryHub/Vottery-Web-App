-- Creator prize compliance: flag creators who have not distributed prizes after election end
-- Used for red-flag/blacklist when creator fails to send prizes to lucky voters

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

CREATE POLICY "Admins can manage creator_prize_compliance_flags"
  ON public.creator_prize_compliance_flags FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Creators can view own flags"
  ON public.creator_prize_compliance_flags FOR SELECT
  USING (user_id = auth.uid());
