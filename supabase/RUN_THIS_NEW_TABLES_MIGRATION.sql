-- =============================================================================
-- COPY THIS → Supabase Dashboard → SQL Editor → Paste → Run
-- Creates: election_voter_rolls, blockchain_audit_logs, public_bulletin_board
-- =============================================================================

-- 1. Election Voter Rolls (admin import/verify for private elections)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'election_voter_rolls') THEN
    CREATE TABLE public.election_voter_rolls (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
      email TEXT NOT NULL,
      name TEXT DEFAULT '',
      verified BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT now(),
      UNIQUE(election_id, email)
    );
    CREATE INDEX IF NOT EXISTS idx_voter_rolls_election ON public.election_voter_rolls(election_id);
  END IF;
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'election_voter_rolls') THEN
    ALTER TABLE public.election_voter_rolls ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "voter_rolls_creator_manage" ON public.election_voter_rolls;
    CREATE POLICY "voter_rolls_creator_manage" ON public.election_voter_rolls
      FOR ALL USING (
        EXISTS (SELECT 1 FROM public.elections WHERE id = election_id AND created_by = auth.uid())
        OR public.is_admin()
      );
    DROP POLICY IF EXISTS "voter_rolls_voter_check" ON public.election_voter_rolls;
    CREATE POLICY "voter_rolls_voter_check" ON public.election_voter_rolls
      FOR SELECT USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

-- 2. Blockchain Audit Logs
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'blockchain_audit_logs') THEN
    CREATE TABLE public.blockchain_audit_logs (
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
  END IF;
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'blockchain_audit_logs') THEN
    ALTER TABLE public.blockchain_audit_logs ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "blockchain_audit_public_read" ON public.blockchain_audit_logs;
    CREATE POLICY "blockchain_audit_public_read" ON public.blockchain_audit_logs
      FOR SELECT USING (true);
    DROP POLICY IF EXISTS "blockchain_audit_system_insert" ON public.blockchain_audit_logs;
    CREATE POLICY "blockchain_audit_system_insert" ON public.blockchain_audit_logs
      FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

-- 3. Public Bulletin Board (vote hash verification)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'public_bulletin_board') THEN
    CREATE TABLE public.public_bulletin_board (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      election_id UUID NOT NULL,
      vote_hash TEXT NOT NULL,
      timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
      verification_status TEXT DEFAULT 'published' CHECK (verification_status IN ('published', 'verified', 'challenged')),
      created_at TIMESTAMPTZ DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS idx_bulletin_board_election ON public.public_bulletin_board(election_id);
  END IF;
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'public_bulletin_board') THEN
    ALTER TABLE public.public_bulletin_board ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "bulletin_board_public_read" ON public.public_bulletin_board;
    CREATE POLICY "bulletin_board_public_read" ON public.public_bulletin_board
      FOR SELECT USING (true);
    DROP POLICY IF EXISTS "bulletin_board_system_insert" ON public.public_bulletin_board;
    CREATE POLICY "bulletin_board_system_insert" ON public.public_bulletin_board
      FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;
