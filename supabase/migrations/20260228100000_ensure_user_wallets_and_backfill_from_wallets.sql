-- =====================================================
-- Ensure user_wallets exists and backfill from legacy "wallets" if present
-- (so Web + Mobile payout feature work with the same Supabase project)
-- =====================================================

-- 1. Ensure user_wallets exists (idempotent; skip if already created by 20260122044400)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'user_wallets'
  ) THEN
    CREATE TABLE public.user_wallets (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
      available_balance DECIMAL(10,2) DEFAULT 0.00,
      locked_balance DECIMAL(10,2) DEFAULT 0.00,
      total_winnings DECIMAL(10,2) DEFAULT 0.00,
      total_redeemed DECIMAL(10,2) DEFAULT 0.00,
      total_payouts DECIMAL(10,2) DEFAULT 0.00,
      currency TEXT DEFAULT 'USD',
      stripe_customer_id TEXT,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_user_wallets_user_id ON public.user_wallets(user_id);
    ALTER TABLE public.user_wallets ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "users_manage_own_user_wallets"
      ON public.user_wallets FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 2. If legacy "wallets" table exists, backfill user_wallets so Mobile/Web see the same data
DO $$
DECLARE
  col_balance TEXT;
  col_user TEXT;
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'wallets') THEN
    -- Prefer balance_usd; fallback to first numeric column
    SELECT column_name INTO col_balance
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'wallets'
      AND column_name IN ('balance_usd', 'available_balance', 'balance')
    LIMIT 1;
    IF col_balance IS NULL THEN
      SELECT column_name INTO col_balance
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'wallets'
        AND data_type IN ('numeric', 'decimal', 'real', 'double precision')
      LIMIT 1;
    END IF;

    SELECT column_name INTO col_user
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'wallets' AND column_name = 'user_id'
    LIMIT 1;

    IF col_balance IS NOT NULL AND col_user IS NOT NULL THEN
      EXECUTE format(
        'INSERT INTO public.user_wallets (user_id, available_balance, currency) '
        'SELECT w.%I, COALESCE((w.%I)::decimal, 0), ''USD'' '
        'FROM public.wallets w '
        'WHERE NOT EXISTS (SELECT 1 FROM public.user_wallets uw WHERE uw.user_id = w.%I)',
        col_user, col_balance, col_user
      );
    END IF;
  END IF;
EXCEPTION
  WHEN undefined_column OR undefined_table THEN
    NULL; -- Ignore if columns differ or table missing
END $$;
