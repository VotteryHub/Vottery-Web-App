-- SMS Health Check Results Table
CREATE TABLE IF NOT EXISTS public.sms_health_check_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL CHECK (provider IN ('telnyx', 'twilio')),
  test_type TEXT NOT NULL DEFAULT 'hourly_check',
  status TEXT NOT NULL CHECK (status IN ('pass', 'fail', 'degraded')),
  latency_ms INTEGER,
  delivery_success BOOLEAN DEFAULT false,
  error_message TEXT,
  test_phone_number TEXT,
  message_sid TEXT,
  failover_triggered BOOLEAN DEFAULT false,
  compliance_check JSONB DEFAULT '{}',
  performance_metrics JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient querying
CREATE INDEX IF NOT EXISTS idx_sms_health_check_provider ON public.sms_health_check_results(provider);
CREATE INDEX IF NOT EXISTS idx_sms_health_check_created_at ON public.sms_health_check_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sms_health_check_status ON public.sms_health_check_results(status);

-- Enable RLS
ALTER TABLE public.sms_health_check_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'sms_health_check_results' AND policyname = 'Admins can manage health check results'
  ) THEN
    CREATE POLICY "Admins can manage health check results"
      ON public.sms_health_check_results
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- SMS Retry Log Table
CREATE TABLE IF NOT EXISTS public.sms_retry_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  original_message_id TEXT,
  provider TEXT NOT NULL,
  recipient_phone TEXT,
  attempt_number INTEGER DEFAULT 1,
  backoff_delay_ms INTEGER,
  status TEXT NOT NULL CHECK (status IN ('pending', 'success', 'failed', 'max_retries_exceeded')),
  error_code TEXT,
  error_message TEXT,
  carrier TEXT,
  region TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sms_retry_log_provider ON public.sms_retry_log(provider);
CREATE INDEX IF NOT EXISTS idx_sms_retry_log_created_at ON public.sms_retry_log(created_at DESC);

ALTER TABLE public.sms_retry_log ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'sms_retry_log' AND policyname = 'Admins can manage retry log'
  ) THEN
    CREATE POLICY "Admins can manage retry log"
      ON public.sms_retry_log
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;
