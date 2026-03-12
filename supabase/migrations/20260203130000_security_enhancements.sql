-- Security enhancements migration
-- VP double-spending atomic protection, vote immutability, webhook idempotency, security monitoring

-- Atomic VP spending function with row-level locking
CREATE OR REPLACE FUNCTION public.spend_vp_atomic(
  p_user_id UUID,
  p_amount INTEGER,
  p_item_type TEXT,
  p_item_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  -- Lock user row and get current balance
  SELECT vp_balance INTO current_balance
  FROM public.user_profiles 
  WHERE id = p_user_id 
  FOR UPDATE;
  
  -- Check sufficient balance
  IF current_balance IS NULL THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;
  
  IF current_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient VP balance: % required, % available', 
      p_amount, current_balance;
  END IF;
  
  -- Deduct VP atomically
  UPDATE public.user_profiles 
  SET vp_balance = vp_balance - p_amount,
      updated_at = NOW()
  WHERE id = p_user_id;
  
  -- Record transaction
  INSERT INTO public.user_vp_transactions (
    user_id, amount, transaction_type, source_type, source_id, created_at
  ) VALUES (
    p_user_id, -p_amount, 'spend', p_item_type, p_item_id, NOW()
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Vote immutability trigger
CREATE OR REPLACE FUNCTION public.prevent_vote_updates()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Votes cannot be modified after submission. Vote ID: %', OLD.id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS immutable_votes ON public.votes;
CREATE TRIGGER immutable_votes
  BEFORE UPDATE ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_vote_updates();

-- Remove any existing UPDATE policies on votes
DROP POLICY IF EXISTS "Users can update own votes" ON public.votes;

-- Ensure only INSERT and SELECT policies exist
DROP POLICY IF EXISTS "Users cast votes only" ON public.votes;
CREATE POLICY "Users cast votes only" ON public.votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users view own votes" ON public.votes;
CREATE POLICY "Users view own votes" ON public.votes
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS(
      SELECT 1 FROM public.elections 
      WHERE id = votes.election_id AND created_by = auth.uid()
    )
  );

-- Webhook idempotency table
CREATE TABLE IF NOT EXISTS public.webhook_idempotency (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key TEXT UNIQUE NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  webhook_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_idempotency_key 
  ON public.webhook_idempotency(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_webhook_idempotency_expires 
  ON public.webhook_idempotency(expires_at);

-- Cleanup expired webhook idempotency records
CREATE OR REPLACE FUNCTION public.cleanup_webhook_idempotency()
RETURNS void AS $$
BEGIN
  DELETE FROM public.webhook_idempotency
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Security events table for monitoring
CREATE TABLE IF NOT EXISTS public.security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium',
  ip_address TEXT,
  user_id UUID REFERENCES auth.users(id),
  country TEXT,
  region TEXT,
  endpoint TEXT,
  request_data JSONB,
  reason TEXT,
  blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_security_events_type 
  ON public.security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_created 
  ON public.security_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_severity 
  ON public.security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_ip 
  ON public.security_events(ip_address);

-- RLS policies for security events (admin only)
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view security events" ON public.security_events
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can insert security events" ON public.security_events
  FOR INSERT WITH CHECK (true);

-- CORS violation tracking
CREATE TABLE IF NOT EXISTS public.cors_violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origin TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  blocked BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cors_violations_created 
  ON public.cors_violations(created_at DESC);

ALTER TABLE public.cors_violations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view CORS violations" ON public.cors_violations
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Rate limit violations tracking
CREATE TABLE IF NOT EXISTS public.rate_limit_violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  ip_address TEXT,
  limit_exceeded INTEGER,
  window_seconds INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_violations_created 
  ON public.rate_limit_violations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rate_limit_violations_identifier 
  ON public.rate_limit_violations(identifier);

ALTER TABLE public.rate_limit_violations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view rate limit violations" ON public.rate_limit_violations
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- SQL injection attempt detection
CREATE TABLE IF NOT EXISTS public.sql_injection_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL,
  query_params JSONB,
  suspicious_pattern TEXT,
  ip_address TEXT,
  user_id UUID REFERENCES auth.users(id),
  blocked BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sql_injection_attempts_created 
  ON public.sql_injection_attempts(created_at DESC);

ALTER TABLE public.sql_injection_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view SQL injection attempts" ON public.sql_injection_attempts
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );