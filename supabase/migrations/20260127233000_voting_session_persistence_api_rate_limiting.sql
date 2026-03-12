-- Voting Session Persistence with Blockchain Recovery
CREATE TABLE IF NOT EXISTS public.voting_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
  session_state JSONB NOT NULL DEFAULT '{}',
  current_step INTEGER DEFAULT 1,
  mcq_completed BOOLEAN DEFAULT false,
  media_completed BOOLEAN DEFAULT false,
  selected_option_id UUID,
  ranked_choices JSONB DEFAULT '[]',
  selected_options JSONB DEFAULT '[]',
  vote_scores JSONB DEFAULT '{}',
  blockchain_hash TEXT,
  session_hash TEXT NOT NULL,
  last_updated_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '24 hours'),
  recovered BOOLEAN DEFAULT false,
  recovery_attempts INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_voting_sessions_user_id ON public.voting_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_voting_sessions_election_id ON public.voting_sessions(election_id);
CREATE INDEX IF NOT EXISTS idx_voting_sessions_expires_at ON public.voting_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_voting_sessions_blockchain_hash ON public.voting_sessions(blockchain_hash);

-- API Rate Limiting Tables
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

CREATE TABLE IF NOT EXISTS public.api_rate_limit_violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  violation_type TEXT NOT NULL,
  request_count INTEGER NOT NULL,
  quota_limit INTEGER NOT NULL,
  blocked BOOLEAN DEFAULT false,
  severity TEXT DEFAULT 'medium',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_api_rate_limit_violations_endpoint ON public.api_rate_limit_violations(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_rate_limit_violations_user_id ON public.api_rate_limit_violations(user_id);
CREATE INDEX IF NOT EXISTS idx_api_rate_limit_violations_created_at ON public.api_rate_limit_violations(created_at);

CREATE TABLE IF NOT EXISTS public.api_quota_monitoring (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT now(),
  requests_per_minute INTEGER DEFAULT 0,
  requests_per_hour INTEGER DEFAULT 0,
  requests_per_day INTEGER DEFAULT 0,
  quota_utilization_percent REAL DEFAULT 0,
  throttle_active BOOLEAN DEFAULT false,
  abuse_detected BOOLEAN DEFAULT false,
  predictive_scaling_triggered BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_api_quota_monitoring_endpoint ON public.api_quota_monitoring(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_quota_monitoring_timestamp ON public.api_quota_monitoring(timestamp);

-- RLS Policies for voting_sessions
ALTER TABLE public.voting_sessions ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'voting_sessions' 
    AND policyname = 'Users can view own voting sessions'
  ) THEN
    CREATE POLICY "Users can view own voting sessions"
      ON public.voting_sessions
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'voting_sessions' 
    AND policyname = 'Users can create own voting sessions'
  ) THEN
    CREATE POLICY "Users can create own voting sessions"
      ON public.voting_sessions
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'voting_sessions' 
    AND policyname = 'Users can update own voting sessions'
  ) THEN
    CREATE POLICY "Users can update own voting sessions"
      ON public.voting_sessions
      FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'voting_sessions' 
    AND policyname = 'Users can delete own voting sessions'
  ) THEN
    CREATE POLICY "Users can delete own voting sessions"
      ON public.voting_sessions
      FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- RLS Policies for api_rate_limits
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'api_rate_limits' 
    AND policyname = 'Admins can view all rate limits'
  ) THEN
    CREATE POLICY "Admins can view all rate limits"
      ON public.api_rate_limits
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.user_profiles
          WHERE user_profiles.id = auth.uid()
          AND user_profiles.role IN ('admin', 'moderator')
        )
      );
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'api_rate_limits' 
    AND policyname = 'Admins can manage rate limits'
  ) THEN
    CREATE POLICY "Admins can manage rate limits"
      ON public.api_rate_limits
      FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.user_profiles
          WHERE user_profiles.id = auth.uid()
          AND user_profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- RLS Policies for api_rate_limit_violations
ALTER TABLE public.api_rate_limit_violations ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'api_rate_limit_violations' 
    AND policyname = 'Admins can view all violations'
  ) THEN
    CREATE POLICY "Admins can view all violations"
      ON public.api_rate_limit_violations
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.user_profiles
          WHERE user_profiles.id = auth.uid()
          AND user_profiles.role IN ('admin', 'moderator')
        )
      );
  END IF;
END $$;

-- RLS Policies for api_quota_monitoring
ALTER TABLE public.api_quota_monitoring ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'api_quota_monitoring' 
    AND policyname = 'Admins can view quota monitoring'
  ) THEN
    CREATE POLICY "Admins can view quota monitoring"
      ON public.api_quota_monitoring
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.user_profiles
          WHERE user_profiles.id = auth.uid()
          AND user_profiles.role IN ('admin', 'moderator')
        )
      );
  END IF;
END $$;

-- Function to clean up expired voting sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_voting_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.voting_sessions
  WHERE expires_at < now();
END;
$$;

-- Function to reset API rate limit counters
CREATE OR REPLACE FUNCTION public.reset_api_rate_limit_counters()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Reset minute counters
  UPDATE public.api_rate_limits
  SET current_minute_count = 0,
      last_reset_minute = now()
  WHERE last_reset_minute < (now() - INTERVAL '1 minute');
  
  -- Reset hour counters
  UPDATE public.api_rate_limits
  SET current_hour_count = 0,
      last_reset_hour = now()
  WHERE last_reset_hour < (now() - INTERVAL '1 hour');
  
  -- Reset day counters
  UPDATE public.api_rate_limits
  SET current_day_count = 0,
      last_reset_day = now()
  WHERE last_reset_day < (now() - INTERVAL '1 day');
END;
$$;

-- Insert default API rate limits for common endpoints
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