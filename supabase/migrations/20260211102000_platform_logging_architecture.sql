-- Platform Logging Architecture Migration
-- Creates comprehensive logging infrastructure for Vottery platform

-- 1. Create log level and category enums
DROP TYPE IF EXISTS public.log_level CASCADE;
CREATE TYPE public.log_level AS ENUM ('debug', 'info', 'warn', 'error', 'critical');

DROP TYPE IF EXISTS public.log_category CASCADE;
CREATE TYPE public.log_category AS ENUM (
  'security',
  'payment',
  'voting',
  'ai_analysis',
  'user_activity',
  'performance',
  'fraud_detection',
  'system',
  'api',
  'database'
);

DROP TYPE IF EXISTS public.log_sensitivity CASCADE;
CREATE TYPE public.log_sensitivity AS ENUM ('public', 'internal', 'confidential', 'restricted');

DROP TYPE IF EXISTS public.log_source CASCADE;
CREATE TYPE public.log_source AS ENUM ('client', 'server', 'ai_service', 'third_party');

-- 2. Create platform_logs table
CREATE TABLE IF NOT EXISTS public.platform_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  log_level public.log_level NOT NULL DEFAULT 'info'::public.log_level,
  log_category public.log_category NOT NULL,
  log_source public.log_source NOT NULL DEFAULT 'client'::public.log_source,
  event_type TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  sensitive_data BOOLEAN DEFAULT FALSE,
  sensitivity_level public.log_sensitivity DEFAULT 'internal'::public.log_sensitivity,
  ip_address TEXT,
  user_agent TEXT,
  request_id TEXT,
  session_id TEXT,
  correlation_id TEXT,
  stack_trace TEXT,
  error_code TEXT,
  service_name TEXT,
  endpoint TEXT,
  duration_ms INTEGER,
  status_code INTEGER,
  ai_service_name TEXT,
  ai_confidence_score DECIMAL(5,4),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  indexed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_platform_logs_user_id ON public.platform_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_logs_log_level ON public.platform_logs(log_level);
CREATE INDEX IF NOT EXISTS idx_platform_logs_log_category ON public.platform_logs(log_category);
CREATE INDEX IF NOT EXISTS idx_platform_logs_log_source ON public.platform_logs(log_source);
CREATE INDEX IF NOT EXISTS idx_platform_logs_event_type ON public.platform_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_platform_logs_created_at ON public.platform_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_platform_logs_sensitivity ON public.platform_logs(sensitivity_level);
CREATE INDEX IF NOT EXISTS idx_platform_logs_correlation_id ON public.platform_logs(correlation_id);
CREATE INDEX IF NOT EXISTS idx_platform_logs_ai_service ON public.platform_logs(ai_service_name) WHERE ai_service_name IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_platform_logs_metadata_gin ON public.platform_logs USING GIN(metadata);

-- 4. Create function to check if user is admin (from auth metadata)
CREATE OR REPLACE FUNCTION public.is_admin_from_auth()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
  SELECT 1 FROM auth.users au
  WHERE au.id = auth.uid() 
  AND (
    (au.raw_user_meta_data->>'role' IN ('admin', 'moderator'))
    OR (au.raw_app_meta_data->>'role' IN ('admin', 'moderator'))
  )
)
$$;

-- 5. Create function to check if user is admin (from user_profiles)
CREATE OR REPLACE FUNCTION public.is_admin_from_profile()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
  SELECT 1 FROM public.user_profiles up
  WHERE up.id = auth.uid() 
  AND up.role IN ('admin', 'moderator')
)
$$;

-- 6. Create combined admin check function
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT public.is_admin_from_auth() OR public.is_admin_from_profile()
$$;

-- 7. Create function for automated log categorization
CREATE OR REPLACE FUNCTION public.categorize_log_sensitivity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Auto-categorize based on log category and content
  IF NEW.log_category IN ('payment', 'fraud_detection') THEN
    NEW.sensitivity_level := 'restricted'::public.log_sensitivity;
    NEW.sensitive_data := TRUE;
  ELSIF NEW.log_category IN ('security', 'ai_analysis') THEN
    NEW.sensitivity_level := 'confidential'::public.log_sensitivity;
    NEW.sensitive_data := TRUE;
  ELSIF NEW.log_category IN ('voting', 'user_activity') THEN
    NEW.sensitivity_level := 'internal'::public.log_sensitivity;
    NEW.sensitive_data := FALSE;
  ELSE
    NEW.sensitivity_level := COALESCE(NEW.sensitivity_level, 'internal'::public.log_sensitivity);
  END IF;

  -- Check for sensitive keywords in message
  IF NEW.message ~* '(password|credit_card|ssn|api_key|secret|token)' THEN
    NEW.sensitivity_level := 'restricted'::public.log_sensitivity;
    NEW.sensitive_data := TRUE;
  END IF;

  RETURN NEW;
END;
$$;

-- 8. Create trigger for automated categorization
DROP TRIGGER IF EXISTS trigger_categorize_log_sensitivity ON public.platform_logs;
CREATE TRIGGER trigger_categorize_log_sensitivity
  BEFORE INSERT ON public.platform_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.categorize_log_sensitivity();

-- 9. Enable RLS
ALTER TABLE public.platform_logs ENABLE ROW LEVEL SECURITY;

-- 10. Create RLS policies

-- Admins can view all logs
DROP POLICY IF EXISTS "admins_view_all_logs" ON public.platform_logs;
CREATE POLICY "admins_view_all_logs"
ON public.platform_logs
FOR SELECT
TO authenticated
USING (public.is_platform_admin());

-- Admins can insert logs
DROP POLICY IF EXISTS "admins_insert_logs" ON public.platform_logs;
CREATE POLICY "admins_insert_logs"
ON public.platform_logs
FOR INSERT
TO authenticated
WITH CHECK (public.is_platform_admin());

-- Users can view their own non-sensitive logs
DROP POLICY IF EXISTS "users_view_own_logs" ON public.platform_logs;
CREATE POLICY "users_view_own_logs"
ON public.platform_logs
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() 
  AND sensitive_data = FALSE
  AND sensitivity_level IN ('public'::public.log_sensitivity, 'internal'::public.log_sensitivity)
);

-- Authenticated users can insert their own logs
DROP POLICY IF EXISTS "users_insert_own_logs" ON public.platform_logs;
CREATE POLICY "users_insert_own_logs"
ON public.platform_logs
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Anonymous users can insert logs (for client-side logging before auth)
DROP POLICY IF EXISTS "anonymous_insert_logs" ON public.platform_logs;
CREATE POLICY "anonymous_insert_logs"
ON public.platform_logs
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL AND log_source = 'client'::public.log_source);

-- 11. Create log retention cleanup function
CREATE OR REPLACE FUNCTION public.cleanup_old_logs()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete logs older than retention period based on sensitivity
  DELETE FROM public.platform_logs
  WHERE 
    (sensitivity_level = 'restricted'::public.log_sensitivity AND created_at < NOW() - INTERVAL '90 days')
    OR (sensitivity_level = 'confidential'::public.log_sensitivity AND created_at < NOW() - INTERVAL '180 days')
    OR (sensitivity_level = 'internal'::public.log_sensitivity AND created_at < NOW() - INTERVAL '1 year')
    OR (sensitivity_level = 'public'::public.log_sensitivity AND created_at < NOW() - INTERVAL '2 years');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RAISE NOTICE 'Cleaned up % old log records', deleted_count;
  RETURN deleted_count;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Log cleanup failed: %', SQLERRM;
    RETURN 0;
END;
$$;

-- 12. Create function to get log statistics
CREATE OR REPLACE FUNCTION public.get_log_statistics(
  start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '24 hours',
  end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE(
  total_logs BIGINT,
  by_level JSONB,
  by_category JSONB,
  by_source JSONB,
  by_sensitivity JSONB,
  error_rate DECIMAL,
  avg_duration_ms DECIMAL
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT AS total_logs,
    jsonb_object_agg(log_level, level_count) AS by_level,
    jsonb_object_agg(log_category, category_count) AS by_category,
    jsonb_object_agg(log_source, source_count) AS by_source,
    jsonb_object_agg(sensitivity_level, sensitivity_count) AS by_sensitivity,
    ROUND(
      (COUNT(*) FILTER (WHERE log_level IN ('error'::public.log_level, 'critical'::public.log_level))::DECIMAL / NULLIF(COUNT(*), 0)) * 100,
      2
    ) AS error_rate,
    ROUND(AVG(duration_ms)::DECIMAL, 2) AS avg_duration_ms
  FROM (
    SELECT
      log_level,
      log_category,
      log_source,
      sensitivity_level,
      duration_ms,
      COUNT(*) OVER (PARTITION BY log_level) AS level_count,
      COUNT(*) OVER (PARTITION BY log_category) AS category_count,
      COUNT(*) OVER (PARTITION BY log_source) AS source_count,
      COUNT(*) OVER (PARTITION BY sensitivity_level) AS sensitivity_count
    FROM public.platform_logs
    WHERE created_at BETWEEN start_date AND end_date
  ) stats
  GROUP BY log_level, log_category, log_source, sensitivity_level
  LIMIT 1;
END;
$$;

-- 13. Create mock data for testing
DO $$
DECLARE
  existing_user_id UUID;
  admin_user_id UUID;
BEGIN
  -- Get existing users
  SELECT id INTO existing_user_id FROM public.user_profiles WHERE role = 'user' LIMIT 1;
  SELECT id INTO admin_user_id FROM public.user_profiles WHERE role IN ('admin', 'moderator') LIMIT 1;

  IF existing_user_id IS NOT NULL THEN
    -- Insert sample logs
    INSERT INTO public.platform_logs (
      user_id, log_level, log_category, log_source, event_type, message, metadata, ip_address, service_name
    ) VALUES
      (existing_user_id, 'info'::public.log_level, 'user_activity'::public.log_category, 'client'::public.log_source, 'page_view', 'User viewed elections dashboard', '{"page": "/elections-dashboard", "duration": 1500}'::jsonb, '192.168.1.100', 'vottery-web'),
      (existing_user_id, 'info'::public.log_level, 'voting'::public.log_category, 'client'::public.log_source, 'vote_cast', 'User cast vote in election', '{"election_id": "abc123", "option": "Option A"}'::jsonb, '192.168.1.100', 'vottery-web'),
      (existing_user_id, 'warn'::public.log_level, 'performance'::public.log_category, 'client'::public.log_source, 'slow_query', 'Database query exceeded threshold', '{"query": "SELECT * FROM elections", "duration_ms": 3500}'::jsonb, '192.168.1.100', 'vottery-api'),
      (NULL, 'error'::public.log_level, 'system'::public.log_category, 'server'::public.log_source, 'api_error', 'Failed to fetch user profile', '{"error": "Network timeout", "endpoint": "/api/profile"}'::jsonb, '10.0.0.1', 'vottery-api'),
      (admin_user_id, 'critical'::public.log_level, 'security'::public.log_category, 'ai_service'::public.log_source, 'fraud_detected', 'Suspicious voting pattern detected', '{"pattern": "multiple_votes", "confidence": 0.95}'::jsonb, '192.168.1.200', 'fraud-detection-ai'),
      (existing_user_id, 'info'::public.log_level, 'payment'::public.log_category, 'third_party'::public.log_source, 'payment_processed', 'VP purchase completed', '{"amount": 1000, "currency": "USD", "transaction_id": "txn_123"}'::jsonb, '192.168.1.100', 'stripe'),
      (admin_user_id, 'info'::public.log_level, 'ai_analysis'::public.log_category, 'ai_service'::public.log_source, 'content_moderation', 'Content analyzed for policy violations', '{"content_id": "post_456", "violations": [], "safe": true}'::jsonb, '10.0.0.5', 'claude-moderation')
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE 'Sample platform logs created successfully';
  ELSE
    RAISE NOTICE 'No users found. Run auth migration first.';
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Mock data insertion failed: %', SQLERRM;
END $$;

-- 14. Add helpful comments
COMMENT ON TABLE public.platform_logs IS 'Comprehensive platform logging table for all system events, user activities, and AI operations';
COMMENT ON COLUMN public.platform_logs.sensitivity_level IS 'Auto-categorized sensitivity level based on content and category';
COMMENT ON COLUMN public.platform_logs.correlation_id IS 'Used to correlate related logs across services';
COMMENT ON FUNCTION public.is_platform_admin() IS 'Checks if current user has admin privileges from auth metadata or user_profiles';
COMMENT ON FUNCTION public.cleanup_old_logs() IS 'Automated cleanup function for log retention policy (90 days for restricted, 180 days for confidential, 1 year for internal, 2 years for public)';