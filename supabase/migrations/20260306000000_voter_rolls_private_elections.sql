-- Voter rolls for private (invite-only) elections
-- Admins/subscribed users import and verify lists for private elections

-- Add 'private' to permission_type enum if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'private' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'permission_type')) THEN
    ALTER TYPE public.permission_type ADD VALUE 'private';
  END IF;
EXCEPTION WHEN undefined_object THEN
  CREATE TYPE public.permission_type AS ENUM ('public', 'private', 'group_only', 'country_specific');
END $$;

CREATE TABLE IF NOT EXISTS public.voter_rolls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  invited_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_voter_rolls_election_user
  ON public.voter_rolls(election_id, user_id) WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_voter_rolls_election ON public.voter_rolls(election_id);
CREATE INDEX IF NOT EXISTS idx_voter_rolls_user ON public.voter_rolls(user_id);
CREATE INDEX IF NOT EXISTS idx_voter_rolls_status ON public.voter_rolls(election_id, status);

ALTER TABLE public.voter_rolls ENABLE ROW LEVEL SECURITY;

-- Election creator can manage voter rolls for their private elections
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

-- Users can read their own voter roll entries (to see if they're invited)
DROP POLICY IF EXISTS "voter_rolls_own_read" ON public.voter_rolls;
CREATE POLICY "voter_rolls_own_read" ON public.voter_rolls
  FOR SELECT USING (user_id = auth.uid());
