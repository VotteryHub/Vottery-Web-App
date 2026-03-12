-- AUTHENTICATION SECURITY ENHANCEMENTS
-- Password policy, account lockout, and security logging

-- ============================================================================
-- CREATE SECURITY TABLES
-- ============================================================================

-- Login attempts tracking
CREATE TABLE IF NOT EXISTS public.login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  failure_reason TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_login_attempts_email ON public.login_attempts(email);
CREATE INDEX idx_login_attempts_timestamp ON public.login_attempts(timestamp);

-- Account lockouts
CREATE TABLE IF NOT EXISTS public.account_lockouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  locked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  locked_until TIMESTAMPTZ NOT NULL,
  reason TEXT NOT NULL,
  unlock_token TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_account_lockouts_user_id ON public.account_lockouts(user_id);
CREATE INDEX idx_account_lockouts_email ON public.account_lockouts(email);

-- Security logs
CREATE TABLE IF NOT EXISTS public.security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  details JSONB,
  severity TEXT NOT NULL DEFAULT 'info', -- info, warning, critical
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_security_logs_event_type ON public.security_logs(event_type);
CREATE INDEX idx_security_logs_user_id ON public.security_logs(user_id);
CREATE INDEX idx_security_logs_timestamp ON public.security_logs(timestamp);
CREATE INDEX idx_security_logs_severity ON public.security_logs(severity);

-- MFA secrets (for admin accounts)
CREATE TABLE IF NOT EXISTS public.mfa_secrets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  secret TEXT NOT NULL,
  backup_codes TEXT[],
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

CREATE INDEX idx_mfa_secrets_user_id ON public.mfa_secrets(user_id);

-- ============================================================================
-- PASSWORD VALIDATION FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION validate_password(password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Minimum 12 characters
  IF LENGTH(password) < 12 THEN
    RAISE EXCEPTION 'Password must be at least 12 characters long';
  END IF;

  -- Must contain uppercase letter
  IF password !~ '[A-Z]' THEN
    RAISE EXCEPTION 'Password must contain at least one uppercase letter';
  END IF;

  -- Must contain lowercase letter
  IF password !~ '[a-z]' THEN
    RAISE EXCEPTION 'Password must contain at least one lowercase letter';
  END IF;

  -- Must contain number
  IF password !~ '[0-9]' THEN
    RAISE EXCEPTION 'Password must contain at least one number';
  END IF;

  -- Must contain special character
  IF password !~ '[!@#$%^&*(),.?":{}|<>]' THEN
    RAISE EXCEPTION 'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)';
  END IF;

  -- Check against common passwords (basic list)
  IF LOWER(password) IN (
    'password123!', 'admin123!', 'welcome123!',
    'qwerty123!', '123456789!', 'password1!'
  ) THEN
    RAISE EXCEPTION 'Password is too common. Please choose a stronger password';
  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- CHECK ACCOUNT LOCKOUT FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION check_account_lockout(p_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_lockout RECORD;
BEGIN
  -- Check for active lockout
  SELECT * INTO v_lockout
  FROM account_lockouts
  WHERE email = p_email
  AND is_active = TRUE
  AND locked_until > NOW()
  ORDER BY locked_at DESC
  LIMIT 1;

  IF FOUND THEN
    RAISE EXCEPTION 'Account is locked until %. Please try again later or contact support.', v_lockout.locked_until
      USING ERRCODE = 'P0001';
  END IF;

  -- Deactivate expired lockouts
  UPDATE account_lockouts
  SET is_active = FALSE
  WHERE email = p_email
  AND is_active = TRUE
  AND locked_until <= NOW();

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- RECORD LOGIN ATTEMPT FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION record_login_attempt(
  p_email TEXT,
  p_success BOOLEAN,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_failure_reason TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_failed_attempts INTEGER;
  v_user_id UUID;
BEGIN
  -- Record the attempt
  INSERT INTO login_attempts (
    email,
    ip_address,
    user_agent,
    success,
    failure_reason,
    timestamp
  ) VALUES (
    p_email,
    p_ip_address,
    p_user_agent,
    p_success,
    p_failure_reason,
    NOW()
  );

  -- If login failed, check for lockout condition
  IF NOT p_success THEN
    -- Count failed attempts in last 15 minutes
    SELECT COUNT(*) INTO v_failed_attempts
    FROM login_attempts
    WHERE email = p_email
    AND success = FALSE
    AND timestamp > NOW() - INTERVAL '15 minutes';

    -- Lock account after 5 failed attempts
    IF v_failed_attempts >= 5 THEN
      -- Get user ID if exists
      SELECT id INTO v_user_id
      FROM auth.users
      WHERE email = p_email;

      -- Create lockout
      INSERT INTO account_lockouts (
        user_id,
        email,
        locked_at,
        locked_until,
        reason,
        is_active
      ) VALUES (
        v_user_id,
        p_email,
        NOW(),
        NOW() + INTERVAL '30 minutes',
        'Too many failed login attempts',
        TRUE
      );

      -- Log security event
      INSERT INTO security_logs (
        event_type,
        user_id,
        ip_address,
        user_agent,
        details,
        severity
      ) VALUES (
        'account_locked',
        v_user_id,
        p_ip_address,
        p_user_agent,
        jsonb_build_object(
          'email', p_email,
          'failed_attempts', v_failed_attempts,
          'locked_until', NOW() + INTERVAL '30 minutes'
        ),
        'warning'
      );

      RAISE EXCEPTION 'Account locked due to too many failed login attempts. Please try again in 30 minutes.'
        USING ERRCODE = 'P0001';
    END IF;
  ELSE
    -- Successful login: clear failed attempts and log
    DELETE FROM login_attempts
    WHERE email = p_email
    AND success = FALSE
    AND timestamp > NOW() - INTERVAL '1 hour';

    -- Get user ID
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = p_email;

    -- Log successful login
    INSERT INTO security_logs (
      event_type,
      user_id,
      ip_address,
      user_agent,
      details,
      severity
    ) VALUES (
      'login_success',
      v_user_id,
      p_ip_address,
      p_user_agent,
      jsonb_build_object('email', p_email),
      'info'
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- LOG SECURITY EVENT FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION log_security_event(
  p_event_type TEXT,
  p_user_id UUID DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_details JSONB DEFAULT NULL,
  p_severity TEXT DEFAULT 'info'
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO security_logs (
    event_type,
    user_id,
    ip_address,
    user_agent,
    details,
    severity,
    timestamp
  ) VALUES (
    p_event_type,
    p_user_id,
    p_ip_address,
    p_user_agent,
    p_details,
    p_severity,
    NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- ENABLE RLS ON SECURITY TABLES
-- ============================================================================

ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_lockouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mfa_secrets ENABLE ROW LEVEL SECURITY;

-- Only admins can view security tables
CREATE POLICY "security_tables_admin_only" ON public.login_attempts
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "account_lockouts_admin_only" ON public.account_lockouts
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "security_logs_admin_only" ON public.security_logs
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Users can only view their own MFA secrets
CREATE POLICY "mfa_secrets_own_read" ON public.mfa_secrets
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "mfa_secrets_own_write" ON public.mfa_secrets
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

GRANT EXECUTE ON FUNCTION validate_password(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION check_account_lockout(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION record_login_attempt(TEXT, BOOLEAN, TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION log_security_event(TEXT, UUID, TEXT, TEXT, JSONB, TEXT) TO authenticated;

-- ============================================================================
-- CLEANUP OLD LOGS (RETENTION POLICY)
-- ============================================================================

CREATE OR REPLACE FUNCTION cleanup_old_security_logs()
RETURNS VOID AS $$
BEGIN
  -- Delete login attempts older than 90 days
  DELETE FROM login_attempts
  WHERE timestamp < NOW() - INTERVAL '90 days';

  -- Delete inactive lockouts older than 30 days
  DELETE FROM account_lockouts
  WHERE is_active = FALSE
  AND locked_at < NOW() - INTERVAL '30 days';

  -- Delete info-level security logs older than 90 days
  DELETE FROM security_logs
  WHERE severity = 'info'
  AND timestamp < NOW() - INTERVAL '90 days';

  -- Keep warning/critical logs for 1 year
  DELETE FROM security_logs
  WHERE severity IN ('warning', 'critical')
  AND timestamp < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- AUDIT LOG
-- ============================================================================

INSERT INTO admin_logs (action, details, performed_by, timestamp)
VALUES (
  'security_hardening',
  'Authentication security enhancements: password policy, account lockout, security logging',
  'system',
  NOW()
);