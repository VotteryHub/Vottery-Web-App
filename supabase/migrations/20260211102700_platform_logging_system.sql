-- Platform Logging System Migration
-- Comprehensive logging architecture for Vottery platform

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
  'authentication',
  'system',
  'api',
  'integration'
);

-- 2. Create platform_logs table
CREATE TABLE IF NOT EXISTS public.platform_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  log_level public.log_level NOT NULL DEFAULT 'info'::public.log_level,
  log_category public.log_category NOT NULL,
  event_type TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  sensitive_data BOOLEAN DEFAULT FALSE,
  ip_address TEXT,
  user_agent TEXT,
  request_id TEXT,
  session_id TEXT,
  source TEXT DEFAULT 'client',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_platform_logs_user_id ON public.platform_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_logs_category ON public.platform_logs(log_category);
CREATE INDEX IF NOT EXISTS idx_platform_logs_level ON public.platform_logs(log_level);
CREATE INDEX IF NOT EXISTS idx_platform_logs_created_at ON public.platform_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_platform_logs_event_type ON public.platform_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_platform_logs_sensitive ON public.platform_logs(sensitive_data);

-- 4. Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_role_assignments ura
    JOIN public.admin_roles ar ON ura.role_id = ar.id
    WHERE ura.user_id = auth.uid()
    AND ar.role_name IN ('super_admin', 'admin', 'moderator', 'auditor')
    AND (ura.expires_at IS NULL OR ura.expires_at > NOW())
  )
$$;

-- 5. Enable RLS
ALTER TABLE public.platform_logs ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies

-- Users can view their own non-sensitive logs
DROP POLICY IF EXISTS "users_view_own_logs" ON public.platform_logs;
CREATE POLICY "users_view_own_logs"
ON public.platform_logs
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() AND sensitive_data = FALSE
);

-- Users can insert their own activity logs
DROP POLICY IF EXISTS "users_insert_own_logs" ON public.platform_logs;
CREATE POLICY "users_insert_own_logs"
ON public.platform_logs
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() AND log_category = 'user_activity'::public.log_category
);

-- Admins can view all logs
DROP POLICY IF EXISTS "admins_view_all_logs" ON public.platform_logs;
CREATE POLICY "admins_view_all_logs"
ON public.platform_logs
FOR SELECT
TO authenticated
USING (public.is_admin_user());

-- Admins can insert any logs
DROP POLICY IF EXISTS "admins_insert_logs" ON public.platform_logs;
CREATE POLICY "admins_insert_logs"
ON public.platform_logs
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin_user());

-- Service role can do everything (for server-side logging)
DROP POLICY IF EXISTS "service_role_full_access" ON public.platform_logs;
CREATE POLICY "service_role_full_access"
ON public.platform_logs
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 7. Create function for automated log cleanup (retention policy)
CREATE OR REPLACE FUNCTION public.cleanup_old_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete sensitive logs older than 90 days
  DELETE FROM public.platform_logs
  WHERE sensitive_data = TRUE
  AND created_at < NOW() - INTERVAL '90 days';
  
  -- Delete standard logs older than 1 year
  DELETE FROM public.platform_logs
  WHERE sensitive_data = FALSE
  AND created_at < NOW() - INTERVAL '1 year';
  
  RAISE NOTICE 'Log cleanup completed';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Log cleanup failed: %', SQLERRM;
END;
$$;

-- 8. Create function to get user log statistics
CREATE OR REPLACE FUNCTION public.get_user_log_stats(target_user_id UUID)
RETURNS TABLE(
  total_logs BIGINT,
  by_category JSONB,
  by_level JSONB,
  recent_activity JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT AS total_logs,
    jsonb_object_agg(
      log_category,
      category_count
    ) AS by_category,
    jsonb_object_agg(
      log_level,
      level_count
    ) AS by_level,
    jsonb_agg(
      jsonb_build_object(
        'event_type', event_type,
        'message', message,
        'created_at', created_at
      )
      ORDER BY created_at DESC
    ) FILTER (WHERE row_num <= 10) AS recent_activity
  FROM (
    SELECT
      pl.log_category,
      pl.log_level,
      pl.event_type,
      pl.message,
      pl.created_at,
      COUNT(*) OVER (PARTITION BY pl.log_category) AS category_count,
      COUNT(*) OVER (PARTITION BY pl.log_level) AS level_count,
      ROW_NUMBER() OVER (ORDER BY pl.created_at DESC) AS row_num
    FROM public.platform_logs pl
    WHERE pl.user_id = target_user_id
    AND pl.sensitive_data = FALSE
  ) subquery
  GROUP BY ();
END;
$$;

-- 9. Create mock data for demonstration
DO $$
DECLARE
  existing_user_id UUID;
  admin_user_id UUID;
BEGIN
  -- Get existing users
  SELECT id INTO existing_user_id FROM public.user_profiles WHERE email LIKE '%user%' LIMIT 1;
  SELECT id INTO admin_user_id FROM public.user_profiles WHERE email LIKE '%admin%' LIMIT 1;
  
  IF existing_user_id IS NOT NULL THEN
    -- Insert sample user activity logs
    INSERT INTO public.platform_logs (user_id, log_level, log_category, event_type, message, metadata, sensitive_data)
    VALUES
      (existing_user_id, 'info'::public.log_level, 'user_activity'::public.log_category, 'page_view', 'User viewed elections dashboard', '{"page": "/elections-dashboard"}'::jsonb, FALSE),
      (existing_user_id, 'info'::public.log_level, 'voting'::public.log_category, 'vote_cast', 'User cast vote in election', '{"election_id": "sample-election"}'::jsonb, FALSE),
      (existing_user_id, 'info'::public.log_level, 'user_activity'::public.log_category, 'profile_update', 'User updated profile settings', '{"fields": ["name", "avatar"]}'::jsonb, FALSE)
    ON CONFLICT (id) DO NOTHING;
  END IF;
  
  IF admin_user_id IS NOT NULL THEN
    -- Insert sample admin logs
    INSERT INTO public.platform_logs (user_id, log_level, log_category, event_type, message, metadata, sensitive_data)
    VALUES
      (admin_user_id, 'info'::public.log_level, 'security'::public.log_category, 'admin_login', 'Admin user logged in', '{"ip": "192.168.1.1"}'::jsonb, TRUE),
      (admin_user_id, 'warn'::public.log_level, 'fraud_detection'::public.log_category, 'suspicious_activity', 'Potential fraud detected', '{"confidence": 0.75}'::jsonb, TRUE)
    ON CONFLICT (id) DO NOTHING;
  END IF;
  
  RAISE NOTICE 'Platform logging system initialized successfully';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Mock data insertion failed: %', SQLERRM;
END $$;