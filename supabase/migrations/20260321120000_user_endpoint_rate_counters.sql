-- Per-user / per-endpoint counters for Edge rate limiting (e.g. ai-proxy).
-- Distinct from public.api_rate_limits (endpoint configuration catalog).

CREATE TABLE IF NOT EXISTS public.user_endpoint_rate_counters (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0,
  window_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, endpoint)
);

CREATE INDEX IF NOT EXISTS idx_user_endpoint_rate_counters_window
  ON public.user_endpoint_rate_counters (window_start DESC);

ALTER TABLE public.user_endpoint_rate_counters ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_endpoint_rate_counters'
      AND policyname = 'Users manage own rate counters'
  ) THEN
    CREATE POLICY "Users manage own rate counters"
      ON public.user_endpoint_rate_counters
      FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

COMMENT ON TABLE public.user_endpoint_rate_counters IS 'Rolling window request counts per user and logical endpoint (used by ai-proxy Edge function).';
