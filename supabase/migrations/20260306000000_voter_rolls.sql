-- Voter rolls for private/invite-only elections
-- Admins and subscribed users can import/verify voter lists

CREATE TABLE IF NOT EXISTS public.voter_rolls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  invited_at TIMESTAMPTZ DEFAULT now(),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(election_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_voter_rolls_election ON public.voter_rolls(election_id);
CREATE INDEX IF NOT EXISTS idx_voter_rolls_user ON public.voter_rolls(user_id);
CREATE INDEX IF NOT EXISTS idx_voter_rolls_status ON public.voter_rolls(status);

ALTER TABLE public.voter_rolls ENABLE ROW LEVEL SECURITY;

-- Election creators can manage voter rolls for their elections
DROP POLICY IF EXISTS "voter_rolls_creator_manage" ON public.voter_rolls;
CREATE POLICY "voter_rolls_creator_manage" ON public.voter_rolls
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.elections
      WHERE elections.id = voter_rolls.election_id
        AND elections.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.elections
      WHERE elections.id = voter_rolls.election_id
        AND elections.created_by = auth.uid()
    )
  );

-- Admins have full access
DROP POLICY IF EXISTS "voter_rolls_admin_all" ON public.voter_rolls;
CREATE POLICY "voter_rolls_admin_all" ON public.voter_rolls
  FOR ALL USING (public.is_admin());

-- Users can see their own voter roll entries
DROP POLICY IF EXISTS "voter_rolls_select_own" ON public.voter_rolls;
CREATE POLICY "voter_rolls_select_own" ON public.voter_rolls
  FOR SELECT USING (user_id = auth.uid());
