CREATE TABLE IF NOT EXISTS public.election_voter_rolls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT DEFAULT '',
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(election_id, email)
);

CREATE INDEX IF NOT EXISTS idx_voter_rolls_election ON public.election_voter_rolls(election_id);
ALTER TABLE public.election_voter_rolls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "voter_rolls_creator_manage" ON public.election_voter_rolls
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.elections WHERE id = election_id AND created_by = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "voter_rolls_voter_check" ON public.election_voter_rolls
  FOR SELECT USING (auth.uid() IS NOT NULL);
