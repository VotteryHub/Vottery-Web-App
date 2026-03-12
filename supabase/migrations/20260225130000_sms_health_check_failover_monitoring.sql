-- SMS Health Check Suite & Failover Monitoring Migration
-- Migration: 20260225130000_sms_health_check_failover_monitoring.sql

-- ============================================
-- SMS HEALTH CHECK RESULTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.sms_health_check_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL CHECK (provider IN ('telnyx', 'twilio')),
  check_type TEXT NOT NULL CHECK (check_type IN ('hourly', 'failover_validation', 'latency', 'compliance', 'manual')),
  status TEXT NOT NULL CHECK (status IN ('pass', 'fail', 'warning', 'pending')),
  latency_ms INTEGER,
  delivery_rate NUMERIC(5,2),
  error_message TEXT,
  test_message_id TEXT,
  compliance_flags JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sms_health_check_provider ON public.sms_health_check_results(provider);
CREATE INDEX IF NOT EXISTS idx_sms_health_check_status ON public.sms_health_check_results(status);
CREATE INDEX IF NOT EXISTS idx_sms_health_check_checked_at ON public.sms_health_check_results(checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_sms_health_check_type ON public.sms_health_check_results(check_type);

-- ============================================
-- SMS RETRY LOGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.sms_retry_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_message_id UUID REFERENCES public.sms_delivery_logs(id) ON DELETE SET NULL,
  provider TEXT NOT NULL CHECK (provider IN ('telnyx', 'twilio')),
  phone_number TEXT NOT NULL,
  message_type TEXT,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  backoff_delay_ms INTEGER,
  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'exhausted')),
  error_message TEXT,
  carrier TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sms_retry_logs_provider ON public.sms_retry_logs(provider);
CREATE INDEX IF NOT EXISTS idx_sms_retry_logs_status ON public.sms_retry_logs(status);
CREATE INDEX IF NOT EXISTS idx_sms_retry_logs_attempted_at ON public.sms_retry_logs(attempted_at DESC);

-- ============================================
-- SMS PROVIDER PERFORMANCE METRICS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.sms_provider_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL CHECK (provider IN ('telnyx', 'twilio')),
  carrier TEXT,
  region TEXT,
  hour_bucket TIMESTAMPTZ NOT NULL,
  total_sent INTEGER DEFAULT 0,
  total_delivered INTEGER DEFAULT 0,
  total_failed INTEGER DEFAULT 0,
  avg_latency_ms NUMERIC(10,2),
  delivery_rate NUMERIC(5,2),
  cost_per_message NUMERIC(10,6),
  health_score NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sms_provider_perf_provider ON public.sms_provider_performance(provider);
CREATE INDEX IF NOT EXISTS idx_sms_provider_perf_hour ON public.sms_provider_performance(hour_bucket DESC);
CREATE INDEX IF NOT EXISTS idx_sms_provider_perf_carrier ON public.sms_provider_performance(carrier);

-- ============================================
-- SMS FAILOVER EVENTS ENHANCEMENTS
-- ============================================

-- Add resolution_time_ms column to sms_failover_events if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'sms_failover_events'
    AND column_name = 'resolution_time_ms'
  ) THEN
    ALTER TABLE public.sms_failover_events ADD COLUMN resolution_time_ms INTEGER;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'sms_failover_events'
    AND column_name = 'auto_triggered'
  ) THEN
    ALTER TABLE public.sms_failover_events ADD COLUMN auto_triggered BOOLEAN DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'sms_failover_events'
    AND column_name = 'recovery_at'
  ) THEN
    ALTER TABLE public.sms_failover_events ADD COLUMN recovery_at TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'sms_failover_events'
    AND column_name = 'affected_messages'
  ) THEN
    ALTER TABLE public.sms_failover_events ADD COLUMN affected_messages INTEGER DEFAULT 0;
  END IF;
END $$;

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE public.sms_health_check_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_retry_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_provider_performance ENABLE ROW LEVEL SECURITY;

-- Health check results - admin read
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'sms_health_check_results'
    AND policyname = 'admin_read_health_checks'
  ) THEN
    CREATE POLICY admin_read_health_checks ON public.sms_health_check_results
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'sms_health_check_results'
    AND policyname = 'service_insert_health_checks'
  ) THEN
    CREATE POLICY service_insert_health_checks ON public.sms_health_check_results
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Retry logs policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'sms_retry_logs'
    AND policyname = 'admin_read_retry_logs'
  ) THEN
    CREATE POLICY admin_read_retry_logs ON public.sms_retry_logs
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'sms_retry_logs'
    AND policyname = 'service_insert_retry_logs'
  ) THEN
    CREATE POLICY service_insert_retry_logs ON public.sms_retry_logs
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Provider performance policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'sms_provider_performance'
    AND policyname = 'admin_read_provider_perf'
  ) THEN
    CREATE POLICY admin_read_provider_perf ON public.sms_provider_performance
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'sms_provider_performance'
    AND policyname = 'service_insert_provider_perf'
  ) THEN
    CREATE POLICY service_insert_provider_perf ON public.sms_provider_performance
      FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'sms_provider_performance'
    AND policyname = 'service_update_provider_perf'
  ) THEN
    CREATE POLICY service_update_provider_perf ON public.sms_provider_performance
      FOR UPDATE USING (true);
  END IF;
END $$;

-- ============================================
-- SEED MOCK PERFORMANCE DATA
-- ============================================

INSERT INTO public.sms_provider_performance (provider, carrier, region, hour_bucket, total_sent, total_delivered, total_failed, avg_latency_ms, delivery_rate, cost_per_message, health_score)
SELECT
  provider,
  carrier,
  region,
  NOW() - (n || ' hours')::INTERVAL AS hour_bucket,
  total_sent,
  total_delivered,
  total_failed,
  avg_latency_ms,
  ROUND((total_delivered::NUMERIC / NULLIF(total_sent, 0)) * 100, 2) AS delivery_rate,
  cost_per_message,
  health_score
FROM (
  VALUES
    ('telnyx', 'AT&T', 'us-east', 1, 245, 238, 7, 312.5, 0.0045, 97.2),
    ('telnyx', 'Verizon', 'us-west', 2, 189, 185, 4, 298.3, 0.0045, 97.9),
    ('telnyx', 'T-Mobile', 'us-central', 3, 312, 301, 11, 325.7, 0.0045, 96.5),
    ('twilio', 'AT&T', 'us-east', 1, 198, 191, 7, 445.2, 0.0075, 96.5),
    ('twilio', 'Verizon', 'us-west', 2, 167, 162, 5, 412.8, 0.0075, 97.0),
    ('twilio', 'T-Mobile', 'us-central', 3, 278, 268, 10, 467.3, 0.0075, 96.4)
) AS t(provider, carrier, region, n, total_sent, total_delivered, total_failed, avg_latency_ms, cost_per_message, health_score)
WHERE NOT EXISTS (
  SELECT 1 FROM public.sms_provider_performance
  WHERE provider = t.provider AND carrier = t.carrier
  LIMIT 1
);

-- Seed health check results
INSERT INTO public.sms_health_check_results (provider, check_type, status, latency_ms, delivery_rate, checked_at)
SELECT provider, check_type, status, latency_ms, delivery_rate, NOW() - (n || ' hours')::INTERVAL
FROM (
  VALUES
    ('telnyx', 'hourly', 'pass', 312, 97.2, 1),
    ('telnyx', 'hourly', 'pass', 298, 97.8, 2),
    ('telnyx', 'latency', 'pass', 285, 98.1, 3),
    ('twilio', 'hourly', 'pass', 445, 96.5, 1),
    ('twilio', 'hourly', 'warning', 512, 94.2, 2),
    ('twilio', 'failover_validation', 'pass', 398, 96.8, 3)
) AS t(provider, check_type, status, latency_ms, delivery_rate, n)
WHERE NOT EXISTS (
  SELECT 1 FROM public.sms_health_check_results LIMIT 1
);
