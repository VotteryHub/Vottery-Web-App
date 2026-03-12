-- Online Nominations, Spoiled Ballots, Unlimited Audience
-- Run in Supabase SQL Editor or via migration

-- 1. Unlimited audience (elections table)
ALTER TABLE public.elections ADD COLUMN IF NOT EXISTS unlimited_audience BOOLEAN DEFAULT true;

-- 2. Online nominations table
CREATE TABLE IF NOT EXISTS public.election_nominations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
  nominator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nominee_name TEXT NOT NULL,
  nominee_description TEXT,
  nominee_image_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_nominations_election ON public.election_nominations(election_id);
CREATE INDEX IF NOT EXISTS idx_nominations_status ON public.election_nominations(status);

ALTER TABLE public.election_nominations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nominations_select" ON public.election_nominations FOR SELECT
  USING (true);

CREATE POLICY "nominations_insert" ON public.election_nominations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "nominations_update_creator" ON public.election_nominations FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.elections e WHERE e.id = election_id AND e.created_by = auth.uid())
  );

-- 3. Allow nominations per election (election creator toggle)
ALTER TABLE public.elections ADD COLUMN IF NOT EXISTS allow_nominations BOOLEAN DEFAULT false;

-- 3b. Allow spoiled ballots per election (election creator toggle; when true, voters can spoil and re-vote)
ALTER TABLE public.elections ADD COLUMN IF NOT EXISTS allow_spoiled_ballots BOOLEAN DEFAULT false;

-- 4. Spoiled ballots - extend votes table
ALTER TABLE public.votes ADD COLUMN IF NOT EXISTS is_spoiled BOOLEAN DEFAULT false;
ALTER TABLE public.votes ADD COLUMN IF NOT EXISTS spoiled_reason TEXT;
ALTER TABLE public.votes ADD COLUMN IF NOT EXISTS marked_for_audit BOOLEAN DEFAULT false;

-- 5. Spoiled ballot audit log
CREATE TABLE IF NOT EXISTS public.spoiled_ballot_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vote_id UUID REFERENCES public.votes(id) ON DELETE CASCADE,
  election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action IN ('spoiled', 'refund_as_spoiled', 'marked_audit')),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_spoiled_audit_vote ON public.spoiled_ballot_audit_log(vote_id);
CREATE INDEX IF NOT EXISTS idx_spoiled_audit_election ON public.spoiled_ballot_audit_log(election_id);

ALTER TABLE public.spoiled_ballot_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "spoiled_audit_select" ON public.spoiled_ballot_audit_log FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.elections e WHERE e.id = election_id AND e.created_by = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "spoiled_audit_insert" ON public.spoiled_ballot_audit_log FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
