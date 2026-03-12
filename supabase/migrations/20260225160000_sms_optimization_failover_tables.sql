-- SMS Optimization History & Provider Failures Tables
-- Migration: 20260225160000_sms_optimization_failover_tables.sql

-- ============================================
-- SMS OPTIMIZATION HISTORY
-- ============================================

CREATE TABLE IF NOT EXISTS public.sms_optimization_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_content TEXT NOT NULL,
  optimized_content TEXT,
  original_length INTEGER,
  optimized_length INTEGER,
  optimization_type TEXT DEFAULT 'openai',
  parameters JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sms_optimization_history_created_at 
  ON public.sms_optimization_history(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_sms_optimization_history_type 
  ON public.sms_optimization_history(optimization_type);

-- ============================================
-- SMS PROVIDER FAILURES (for failover threshold tracking)
-- ============================================

CREATE TABLE IF NOT EXISTS public.sms_provider_failures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL CHECK (provider IN ('telnyx', 'twilio')),
  error_message TEXT,
  is_provider_error BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sms_provider_failures_provider 
  ON public.sms_provider_failures(provider);

CREATE INDEX IF NOT EXISTS idx_sms_provider_failures_created_at 
  ON public.sms_provider_failures(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_sms_provider_failures_provider_error 
  ON public.sms_provider_failures(provider, is_provider_error, created_at DESC);

-- ============================================
-- SMS PROVIDER STATE (ensure table exists with correct schema)
-- ============================================

CREATE TABLE IF NOT EXISTS public.sms_provider_state (
  id SERIAL PRIMARY KEY,
  active_provider TEXT NOT NULL DEFAULT 'telnyx' CHECK (active_provider IN ('telnyx', 'twilio')),
  telnyx_status TEXT DEFAULT 'healthy' CHECK (telnyx_status IN ('healthy', 'degraded', 'unhealthy', 'offline', 'unknown')),
  twilio_status TEXT DEFAULT 'healthy' CHECK (twilio_status IN ('healthy', 'degraded', 'unhealthy', 'offline', 'unknown')),
  failover_reason TEXT,
  last_failover_at TIMESTAMPTZ,
  last_checked_at TIMESTAMPTZ DEFAULT NOW(),
  override_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns if table already existed without them
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'sms_provider_state'
    AND column_name = 'active_provider'
  ) THEN
    ALTER TABLE public.sms_provider_state
      ADD COLUMN active_provider TEXT NOT NULL DEFAULT 'telnyx'
        CHECK (active_provider IN ('telnyx', 'twilio'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'sms_provider_state'
    AND column_name = 'telnyx_status'
  ) THEN
    ALTER TABLE public.sms_provider_state
      ADD COLUMN telnyx_status TEXT DEFAULT 'healthy'
        CHECK (telnyx_status IN ('healthy', 'degraded', 'unhealthy', 'offline', 'unknown'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'sms_provider_state'
    AND column_name = 'twilio_status'
  ) THEN
    ALTER TABLE public.sms_provider_state
      ADD COLUMN twilio_status TEXT DEFAULT 'healthy'
        CHECK (twilio_status IN ('healthy', 'degraded', 'unhealthy', 'offline', 'unknown'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'sms_provider_state'
    AND column_name = 'failover_reason'
  ) THEN
    ALTER TABLE public.sms_provider_state
      ADD COLUMN failover_reason TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'sms_provider_state'
    AND column_name = 'last_failover_at'
  ) THEN
    ALTER TABLE public.sms_provider_state
      ADD COLUMN last_failover_at TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'sms_provider_state'
    AND column_name = 'last_checked_at'
  ) THEN
    ALTER TABLE public.sms_provider_state
      ADD COLUMN last_checked_at TIMESTAMPTZ DEFAULT NOW();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'sms_provider_state'
    AND column_name = 'override_by'
  ) THEN
    ALTER TABLE public.sms_provider_state
      ADD COLUMN override_by UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- Insert default state if not exists
INSERT INTO public.sms_provider_state (active_provider, telnyx_status, twilio_status)
SELECT 'telnyx', 'healthy', 'healthy'
WHERE NOT EXISTS (SELECT 1 FROM public.sms_provider_state);

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE public.sms_optimization_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_provider_failures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_provider_state ENABLE ROW LEVEL SECURITY;

-- Optimization history: admins can read/write
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'sms_optimization_history' 
    AND policyname = 'Admins can manage optimization history'
  ) THEN
    CREATE POLICY "Admins can manage optimization history"
      ON public.sms_optimization_history
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Provider failures: admins can read/write
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'sms_provider_failures' 
    AND policyname = 'Admins can manage provider failures'
  ) THEN
    CREATE POLICY "Admins can manage provider failures"
      ON public.sms_provider_failures
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Provider state: admins can read/write
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'sms_provider_state' 
    AND policyname = 'Admins can manage provider state'
  ) THEN
    CREATE POLICY "Admins can manage provider state"
      ON public.sms_provider_state
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Service role bypass for edge functions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'sms_provider_failures' 
    AND policyname = 'Service role can manage provider failures'
  ) THEN
    CREATE POLICY "Service role can manage provider failures"
      ON public.sms_provider_failures
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'sms_provider_state' 
    AND policyname = 'Service role can manage provider state'
  ) THEN
    CREATE POLICY "Service role can manage provider state"
      ON public.sms_provider_state
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'sms_optimization_history' 
    AND policyname = 'Service role can manage optimization history'
  ) THEN
    CREATE POLICY "Service role can manage optimization history"
      ON public.sms_optimization_history
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- ============================================
-- AUTO-CLEANUP: Remove old failure records (keep 24h window)
-- ============================================

CREATE OR REPLACE FUNCTION public.cleanup_old_provider_failures()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.sms_provider_failures
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$;
