-- Performance Profiling Results table
CREATE TABLE IF NOT EXISTS public.performance_profiling_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_path TEXT NOT NULL,
  load_time_ms INTEGER,
  memory_mb NUMERIC(10, 2),
  device_type TEXT DEFAULT 'desktop',
  dom_content_loaded_ms INTEGER,
  ttfb_ms INTEGER,
  network_requests INTEGER,
  transfer_size_kb NUMERIC(10, 2),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  session_id TEXT,
  recorded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_perf_profiling_route ON public.performance_profiling_results(route_path);
CREATE INDEX IF NOT EXISTS idx_perf_profiling_recorded_at ON public.performance_profiling_results(recorded_at);
CREATE INDEX IF NOT EXISTS idx_perf_profiling_device ON public.performance_profiling_results(device_type);

ALTER TABLE public.performance_profiling_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "perf_profiling_insert" ON public.performance_profiling_results;
CREATE POLICY "perf_profiling_insert"
  ON public.performance_profiling_results
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "perf_profiling_admin_select" ON public.performance_profiling_results;
CREATE POLICY "perf_profiling_admin_select"
  ON public.performance_profiling_results
  FOR SELECT
  TO authenticated
  USING (true);

-- Ad Slot Metrics table for fill rate tracking
CREATE TABLE IF NOT EXISTS public.ad_slot_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id TEXT NOT NULL,
  filled_by TEXT NOT NULL CHECK (filled_by IN ('internal', 'adsense', 'unfilled')),
  election_id UUID REFERENCES public.elections(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  page_context TEXT DEFAULT 'home_feed',
  session_id TEXT,
  timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ad_slot_metrics_slot_id ON public.ad_slot_metrics(slot_id);
CREATE INDEX IF NOT EXISTS idx_ad_slot_metrics_filled_by ON public.ad_slot_metrics(filled_by);
CREATE INDEX IF NOT EXISTS idx_ad_slot_metrics_timestamp ON public.ad_slot_metrics(timestamp);

ALTER TABLE public.ad_slot_metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ad_slot_metrics_insert" ON public.ad_slot_metrics;
CREATE POLICY "ad_slot_metrics_insert"
  ON public.ad_slot_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "ad_slot_metrics_select" ON public.ad_slot_metrics;
CREATE POLICY "ad_slot_metrics_select"
  ON public.ad_slot_metrics
  FOR SELECT
  TO authenticated
  USING (true);

-- Add last_triggered_at, last_status, failure_count to webhook_config if not exists
ALTER TABLE public.webhook_config
  ADD COLUMN IF NOT EXISTS last_triggered_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS failure_count INTEGER DEFAULT 0;

-- Add attempts and duration_ms to webhook_delivery_logs if not exists
ALTER TABLE public.webhook_delivery_logs
  ADD COLUMN IF NOT EXISTS attempts INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS duration_ms INTEGER;
