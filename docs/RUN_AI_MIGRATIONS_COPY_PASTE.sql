-- =============================================================================
-- VOTTERY AI – SUPABASE MIGRATIONS (COPY, PASTE & RUN)
-- Run this entire file in Supabase Dashboard → SQL Editor → New query.
-- Or run each section between the ==== dividers one at a time in order.
--
-- Covers: SMS optimization history, content_moderation_results, api_rate_limits,
--         recommendation_sync (votes.recommendation_synced_at + recommendation_sync_logs),
--         ai_usage_logs. For full content-moderation (group_posts, group_events, etc.)
--         and full AI risk/fallback tables, run the original .sql files in
--         supabase/migrations/ in timestamp order.
-- =============================================================================

-- ========== 1. SMS OPTIMIZATION & FAILOVER ==========
-- 20260225160000_sms_optimization_failover_tables.sql

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
CREATE INDEX IF NOT EXISTS idx_sms_optimization_history_created_at ON public.sms_optimization_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sms_optimization_history_type ON public.sms_optimization_history(optimization_type);

CREATE TABLE IF NOT EXISTS public.sms_provider_failures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL CHECK (provider IN ('telnyx', 'twilio')),
  error_message TEXT,
  is_provider_error BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sms_provider_failures_provider ON public.sms_provider_failures(provider);
CREATE INDEX IF NOT EXISTS idx_sms_provider_failures_created_at ON public.sms_provider_failures(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sms_provider_failures_provider_error ON public.sms_provider_failures(provider, is_provider_error, created_at DESC);

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

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sms_provider_state' AND column_name = 'active_provider') THEN
    ALTER TABLE public.sms_provider_state ADD COLUMN active_provider TEXT NOT NULL DEFAULT 'telnyx' CHECK (active_provider IN ('telnyx', 'twilio'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sms_provider_state' AND column_name = 'telnyx_status') THEN
    ALTER TABLE public.sms_provider_state ADD COLUMN telnyx_status TEXT DEFAULT 'healthy' CHECK (telnyx_status IN ('healthy', 'degraded', 'unhealthy', 'offline', 'unknown'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sms_provider_state' AND column_name = 'twilio_status') THEN
    ALTER TABLE public.sms_provider_state ADD COLUMN twilio_status TEXT DEFAULT 'healthy' CHECK (twilio_status IN ('healthy', 'degraded', 'unhealthy', 'offline', 'unknown'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sms_provider_state' AND column_name = 'failover_reason') THEN
    ALTER TABLE public.sms_provider_state ADD COLUMN failover_reason TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sms_provider_state' AND column_name = 'last_failover_at') THEN
    ALTER TABLE public.sms_provider_state ADD COLUMN last_failover_at TIMESTAMPTZ;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sms_provider_state' AND column_name = 'last_checked_at') THEN
    ALTER TABLE public.sms_provider_state ADD COLUMN last_checked_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sms_provider_state' AND column_name = 'override_by') THEN
    ALTER TABLE public.sms_provider_state ADD COLUMN override_by UUID REFERENCES auth.users(id);
  END IF;
END $$;

INSERT INTO public.sms_provider_state (active_provider, telnyx_status, twilio_status)
SELECT 'telnyx', 'healthy', 'healthy'
WHERE NOT EXISTS (SELECT 1 FROM public.sms_provider_state);

ALTER TABLE public.sms_optimization_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_provider_failures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_provider_state ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sms_optimization_history' AND policyname = 'Admins can manage optimization history') THEN
    CREATE POLICY "Admins can manage optimization history" ON public.sms_optimization_history FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sms_provider_failures' AND policyname = 'Admins can manage provider failures') THEN
    CREATE POLICY "Admins can manage provider failures" ON public.sms_provider_failures FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sms_provider_state' AND policyname = 'Admins can manage provider state') THEN
    CREATE POLICY "Admins can manage provider state" ON public.sms_provider_state FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sms_provider_failures' AND policyname = 'Service role can manage provider failures') THEN
    CREATE POLICY "Service role can manage provider failures" ON public.sms_provider_failures FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sms_provider_state' AND policyname = 'Service role can manage provider state') THEN
    CREATE POLICY "Service role can manage provider state" ON public.sms_provider_state FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sms_optimization_history' AND policyname = 'Service role can manage optimization history') THEN
    CREATE POLICY "Service role can manage optimization history" ON public.sms_optimization_history FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.cleanup_old_provider_failures()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  DELETE FROM public.sms_provider_failures WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$;


-- ========== 2. CONTENT MODERATION (content_moderation_results + groups) ==========
-- 20260227120000_content_moderation_groups_enhancements.sql

CREATE TABLE IF NOT EXISTS public.content_moderation_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('post', 'comment')),
  content_text TEXT,
  confidence_score DECIMAL(4,3) DEFAULT 0,
  categories TEXT[] DEFAULT ARRAY['safe'],
  primary_category TEXT DEFAULT 'safe',
  reasoning TEXT,
  auto_removed BOOLEAN DEFAULT FALSE,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  moderated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(content_id, content_type)
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'content_moderation_results_reviewed_by_fkey' AND table_name = 'content_moderation_results') THEN
    ALTER TABLE public.content_moderation_results ADD CONSTRAINT content_moderation_results_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.user_profiles(id);
  END IF;
END $$;

ALTER TABLE public.content_moderation_results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view moderation results" ON public.content_moderation_results;
CREATE POLICY "Admins can view moderation results" ON public.content_moderation_results FOR SELECT USING (true);


-- ========== 3. API RATE LIMITS (for ai-proxy) ==========
-- 20260127233000_voting_session_persistence_api_rate_limiting.sql (rate limit part only)

CREATE TABLE IF NOT EXISTS public.api_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  quota_per_minute INTEGER DEFAULT 60,
  quota_per_hour INTEGER DEFAULT 1000,
  quota_per_day INTEGER DEFAULT 10000,
  current_minute_count INTEGER DEFAULT 0,
  current_hour_count INTEGER DEFAULT 0,
  current_day_count INTEGER DEFAULT 0,
  throttle_enabled BOOLEAN DEFAULT false,
  throttle_threshold REAL DEFAULT 0.8,
  abuse_detection_enabled BOOLEAN DEFAULT true,
  abuse_threshold INTEGER DEFAULT 100,
  last_reset_minute TIMESTAMPTZ DEFAULT now(),
  last_reset_hour TIMESTAMPTZ DEFAULT now(),
  last_reset_day TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(endpoint, method)
);
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_endpoint ON public.api_rate_limits(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_throttle_enabled ON public.api_rate_limits(throttle_enabled);

ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'api_rate_limits' AND policyname = 'Admins can view all rate limits') THEN
    CREATE POLICY "Admins can view all rate limits" ON public.api_rate_limits FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role IN ('admin', 'moderator'))
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'api_rate_limits' AND policyname = 'Admins can manage rate limits') THEN
    CREATE POLICY "Admins can manage rate limits" ON public.api_rate_limits FOR ALL USING (
      EXISTS (SELECT 1 FROM public.user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin')
    );
  END IF;
END $$;

INSERT INTO public.api_rate_limits (endpoint, method, quota_per_minute, quota_per_hour, quota_per_day)
VALUES
  ('/api/elections', 'GET', 100, 2000, 20000),
  ('/api/elections', 'POST', 10, 100, 500),
  ('/api/votes', 'GET', 100, 2000, 20000),
  ('/api/votes', 'POST', 20, 200, 1000),
  ('/api/users', 'GET', 100, 2000, 20000),
  ('/api/users', 'POST', 10, 100, 500),
  ('/api/payments', 'POST', 10, 100, 500),
  ('/api/analytics', 'GET', 50, 1000, 10000),
  ('/api/auth/login', 'POST', 5, 20, 100),
  ('/api/auth/register', 'POST', 3, 10, 50)
ON CONFLICT (endpoint, method) DO NOTHING;


-- ========== 4. GEMINI RECOMMENDATION SYNC ==========
-- 20260307120000_gemini_recommendation_sync.sql

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'votes' AND column_name = 'recommendation_synced_at') THEN
    ALTER TABLE votes ADD COLUMN recommendation_synced_at TIMESTAMPTZ;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_votes_recommendation_synced ON votes(recommendation_synced_at) WHERE recommendation_synced_at IS NULL;

CREATE TABLE IF NOT EXISTS recommendation_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  events_processed INTEGER DEFAULT 0,
  duration INTEGER,
  status TEXT CHECK (status IN ('success', 'failed', 'partial')),
  provider TEXT DEFAULT 'gemini',
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_recommendation_sync_logs_created ON recommendation_sync_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recommendation_sync_logs_provider ON recommendation_sync_logs(provider);


-- ========== 5. AI USAGE LOGS (optional – for ai-proxy logging) ==========
-- Run if your project has no ai_usage_logs table yet.

CREATE TABLE IF NOT EXISTS ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  provider TEXT NOT NULL,
  method TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  cost_estimate DECIMAL(10, 6) DEFAULT 0,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user ON ai_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_timestamp ON ai_usage_logs(timestamp DESC);


-- ========== 6. ELECTIONS MODERATION (optional) ==========
-- Only if you use content-moderation-trigger for elections (status = 'rejected', moderation_notes).

-- ALTER TABLE elections ADD COLUMN IF NOT EXISTS moderation_notes TEXT;
-- If status is an enum: ALTER TYPE elections_status_enum ADD VALUE IF NOT EXISTS 'rejected';


-- =============================================================================
-- END OF AI MIGRATIONS
-- =============================================================================
