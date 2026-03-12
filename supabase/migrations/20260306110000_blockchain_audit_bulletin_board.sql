CREATE TABLE IF NOT EXISTS public.blockchain_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  election_id UUID,
  hash TEXT NOT NULL,
  previous_hash TEXT NOT NULL DEFAULT '0x0000000000000000000000000000000000000000000000000000000000000000',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blockchain_audit_election ON public.blockchain_audit_logs(election_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_audit_hash ON public.blockchain_audit_logs(hash);
ALTER TABLE public.blockchain_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "blockchain_audit_public_read" ON public.blockchain_audit_logs
  FOR SELECT USING (true);

CREATE POLICY "blockchain_audit_system_insert" ON public.blockchain_audit_logs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE TABLE IF NOT EXISTS public.public_bulletin_board (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID NOT NULL,
  vote_hash TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  verification_status TEXT DEFAULT 'published' CHECK (verification_status IN ('published', 'verified', 'challenged')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bulletin_board_election ON public.public_bulletin_board(election_id);
ALTER TABLE public.public_bulletin_board ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bulletin_board_public_read" ON public.public_bulletin_board
  FOR SELECT USING (true);

CREATE POLICY "bulletin_board_system_insert" ON public.public_bulletin_board
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
