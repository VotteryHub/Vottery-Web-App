-- Telnyx SMS Provider Integration with Intelligent Failover System
-- Migration: 20260224223000_telnyx_sms_provider_integration.sql

-- ============================================
-- SMS PROVIDER HEALTH MONITORING
-- ============================================

CREATE TABLE IF NOT EXISTS public.sms_provider_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL CHECK (provider IN ('telnyx', 'twilio')),
  status TEXT NOT NULL CHECK (status IN ('healthy', 'degraded', 'offline', 'unknown')),
  error_message TEXT,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sms_provider_health_provider ON public.sms_provider_health(provider);
CREATE INDEX IF NOT EXISTS idx_sms_provider_health_checked_at ON public.sms_provider_health(checked_at DESC);

-- ============================================
-- SMS DELIVERY LOGS
-- ============================================

CREATE TABLE IF NOT EXISTS public.sms_delivery_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL CHECK (provider IN ('telnyx', 'twilio')),
  phone_number TEXT NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT,
  status TEXT NOT NULL CHECK (status IN ('sent', 'delivered', 'failed', 'bounced', 'blocked')),
  external_id TEXT,
  webhook_data JSONB,
  metadata JSONB,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sms_delivery_logs_provider ON public.sms_delivery_logs(provider);
CREATE INDEX IF NOT EXISTS idx_sms_delivery_logs_status ON public.sms_delivery_logs(status);
CREATE INDEX IF NOT EXISTS idx_sms_delivery_logs_sent_at ON public.sms_delivery_logs(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_sms_delivery_logs_external_id ON public.sms_delivery_logs(external_id);
CREATE INDEX IF NOT EXISTS idx_sms_delivery_logs_message_type ON public.sms_delivery_logs(message_type);

-- ============================================
-- SMS FAILOVER EVENTS
-- ============================================

CREATE TABLE IF NOT EXISTS public.sms_failover_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_provider TEXT NOT NULL,
  to_provider TEXT NOT NULL,
  reason TEXT,
  triggered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sms_failover_events_triggered_at ON public.sms_failover_events(triggered_at DESC);

-- ============================================
-- SMS ALERT TEMPLATES
-- ============================================

CREATE TABLE IF NOT EXISTS public.sms_alert_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name TEXT NOT NULL,
  category TEXT NOT NULL,
  message_body TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb,
  priority TEXT DEFAULT 'medium',
  subject TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns if table already exists
DO $$
BEGIN
  -- Add template_name if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'sms_alert_templates' 
    AND column_name = 'template_name'
  ) THEN
    ALTER TABLE public.sms_alert_templates ADD COLUMN template_name TEXT;
  END IF;
  
  -- Add category if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'sms_alert_templates' 
    AND column_name = 'category'
  ) THEN
    ALTER TABLE public.sms_alert_templates ADD COLUMN category TEXT;
  END IF;
  
  -- Ensure message_body exists (primary content column)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'sms_alert_templates' 
    AND column_name = 'message_body'
  ) THEN
    ALTER TABLE public.sms_alert_templates ADD COLUMN message_body TEXT NOT NULL DEFAULT '';
  END IF;
  
  -- Add variables if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'sms_alert_templates' 
    AND column_name = 'variables'
  ) THEN
    ALTER TABLE public.sms_alert_templates ADD COLUMN variables JSONB DEFAULT '[]'::jsonb;
  END IF;
  
  -- Add priority if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'sms_alert_templates' 
    AND column_name = 'priority'
  ) THEN
    ALTER TABLE public.sms_alert_templates ADD COLUMN priority TEXT DEFAULT 'medium';
  END IF;
  
  -- Add subject if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'sms_alert_templates' 
    AND column_name = 'subject'
  ) THEN
    ALTER TABLE public.sms_alert_templates ADD COLUMN subject TEXT;
  END IF;
END $$;

-- Drop existing constraints before adding new ones
DO $$
BEGIN
  -- Drop category constraint if exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_schema = 'public' 
    AND table_name = 'sms_alert_templates' 
    AND constraint_name LIKE '%category%'
  ) THEN
    ALTER TABLE public.sms_alert_templates DROP CONSTRAINT IF EXISTS sms_alert_templates_category_check;
  END IF;
  
  -- Drop priority constraint if exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_schema = 'public' 
    AND table_name = 'sms_alert_templates' 
    AND constraint_name LIKE '%priority%'
  ) THEN
    ALTER TABLE public.sms_alert_templates DROP CONSTRAINT IF EXISTS sms_alert_templates_priority_check;
  END IF;
END $$;

-- Add check constraints
ALTER TABLE public.sms_alert_templates 
  ADD CONSTRAINT sms_alert_templates_category_check 
  CHECK (category IN ('fraud', 'security', 'compliance', 'operational', 'creator', 'gamification'));

ALTER TABLE public.sms_alert_templates 
  ADD CONSTRAINT sms_alert_templates_priority_check 
  CHECK (priority IN ('critical', 'high', 'medium', 'low'));

CREATE INDEX IF NOT EXISTS idx_sms_alert_templates_category ON public.sms_alert_templates(category);
CREATE INDEX IF NOT EXISTS idx_sms_alert_templates_is_active ON public.sms_alert_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_sms_alert_templates_priority ON public.sms_alert_templates(priority);

-- ============================================
-- SMS RATE LIMITS
-- ============================================

CREATE TABLE IF NOT EXISTS public.sms_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL CHECK (provider IN ('telnyx', 'twilio')),
  per_user_hourly_limit INTEGER DEFAULT 10,
  per_provider_hourly_limit INTEGER DEFAULT 1000,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default rate limits
INSERT INTO public.sms_rate_limits (provider, per_user_hourly_limit, per_provider_hourly_limit)
VALUES 
  ('telnyx', 10, 1000),
  ('twilio', 10, 500)
ON CONFLICT DO NOTHING;

-- ============================================
-- SMS QUEUE
-- ============================================

CREATE TABLE IF NOT EXISTS public.sms_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL CHECK (provider IN ('telnyx', 'twilio')),
  phone_number TEXT NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT,
  priority TEXT NOT NULL CHECK (priority IN ('critical', 'high', 'medium', 'low')) DEFAULT 'medium',
  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'failed')) DEFAULT 'pending',
  metadata JSONB,
  processed_at TIMESTAMPTZ,
  error_message TEXT
);

-- Add queued_at column if it doesn't exist (handles existing tables)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'sms_queue' 
    AND column_name = 'queued_at'
  ) THEN
    ALTER TABLE public.sms_queue ADD COLUMN queued_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_sms_queue_status ON public.sms_queue(status);
CREATE INDEX IF NOT EXISTS idx_sms_queue_priority ON public.sms_queue(priority DESC);
CREATE INDEX IF NOT EXISTS idx_sms_queue_queued_at ON public.sms_queue(queued_at);

-- ============================================
-- SMS CONSENT (GDPR/TCPA COMPLIANCE)
-- ============================================

CREATE TABLE IF NOT EXISTS public.sms_consent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL UNIQUE,
  consent_status TEXT NOT NULL CHECK (consent_status IN ('opted_in', 'opted_out', 'pending')) DEFAULT 'pending',
  consent_date TIMESTAMPTZ,
  opt_out_date TIMESTAMPTZ,
  opt_out_reason TEXT,
  consent_source TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sms_consent_phone_number ON public.sms_consent(phone_number);
CREATE INDEX IF NOT EXISTS idx_sms_consent_status ON public.sms_consent(consent_status);

-- ============================================
-- RLS POLICIES
-- ============================================

-- SMS Provider Health (Admin only)
ALTER TABLE public.sms_provider_health ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view SMS provider health" ON public.sms_provider_health;
CREATE POLICY "Admins can view SMS provider health"
  ON public.sms_provider_health
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "System can insert SMS provider health" ON public.sms_provider_health;
CREATE POLICY "System can insert SMS provider health"
  ON public.sms_provider_health
  FOR INSERT
  WITH CHECK (true);

-- SMS Delivery Logs (Admin only)
ALTER TABLE public.sms_delivery_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view SMS delivery logs" ON public.sms_delivery_logs;
CREATE POLICY "Admins can view SMS delivery logs"
  ON public.sms_delivery_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "System can insert SMS delivery logs" ON public.sms_delivery_logs;
CREATE POLICY "System can insert SMS delivery logs"
  ON public.sms_delivery_logs
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "System can update SMS delivery logs" ON public.sms_delivery_logs;
CREATE POLICY "System can update SMS delivery logs"
  ON public.sms_delivery_logs
  FOR UPDATE
  USING (true);

-- SMS Failover Events (Admin only)
ALTER TABLE public.sms_failover_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view SMS failover events" ON public.sms_failover_events;
CREATE POLICY "Admins can view SMS failover events"
  ON public.sms_failover_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "System can insert SMS failover events" ON public.sms_failover_events;
CREATE POLICY "System can insert SMS failover events"
  ON public.sms_failover_events
  FOR INSERT
  WITH CHECK (true);

-- SMS Alert Templates (Admin only)
ALTER TABLE public.sms_alert_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage SMS alert templates" ON public.sms_alert_templates;
CREATE POLICY "Admins can manage SMS alert templates"
  ON public.sms_alert_templates
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- SMS Rate Limits (Admin only)
ALTER TABLE public.sms_rate_limits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage SMS rate limits" ON public.sms_rate_limits;
CREATE POLICY "Admins can manage SMS rate limits"
  ON public.sms_rate_limits
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- SMS Queue (Admin only)
ALTER TABLE public.sms_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view SMS queue" ON public.sms_queue;
CREATE POLICY "Admins can view SMS queue"
  ON public.sms_queue
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "System can manage SMS queue" ON public.sms_queue;
CREATE POLICY "System can manage SMS queue"
  ON public.sms_queue
  FOR ALL
  USING (true);

-- SMS Consent (Users can view their own)
ALTER TABLE public.sms_consent ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their SMS consent" ON public.sms_consent;
CREATE POLICY "Users can view their SMS consent"
  ON public.sms_consent
  FOR SELECT
  USING (
    phone_number IN (
      SELECT phone_number FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update their SMS consent" ON public.sms_consent;
CREATE POLICY "Users can update their SMS consent"
  ON public.sms_consent
  FOR UPDATE
  USING (
    phone_number IN (
      SELECT phone_number FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "System can manage SMS consent" ON public.sms_consent;
CREATE POLICY "System can manage SMS consent"
  ON public.sms_consent
  FOR ALL
  USING (true);

-- ============================================
-- INSERT DEFAULT TEMPLATES
-- ============================================

-- Only insert if templates don't already exist
DO $$
BEGIN
  -- Insert templates one by one with explicit column names to avoid NULL issues
  INSERT INTO public.sms_alert_templates (template_name, category, message_body, variables, priority, subject, is_active)
  SELECT 
    'Fraud Alert - Critical',
    'fraud',
    '🚨 CRITICAL FRAUD ALERT: {{title}}. Score: {{fraudScore}}/100. Action Required: Immediate Investigation. View: {{url}}',
    '["title", "fraudScore", "url"]'::jsonb,
    'critical',
    'Critical Fraud Alert',
    true
  WHERE NOT EXISTS (
    SELECT 1 FROM public.sms_alert_templates
    WHERE template_name = 'Fraud Alert - Critical'
  );

  INSERT INTO public.sms_alert_templates (template_name, category, message_body, variables, priority, subject, is_active)
  SELECT 
    'Security Breach',
    'security',
    '⚠️ SECURITY ALERT: {{eventType}} detected. {{description}}. Secure your account: {{url}}',
    '["eventType", "description", "url"]'::jsonb,
    'critical',
    'Security Alert',
    true
  WHERE NOT EXISTS (
    SELECT 1 FROM public.sms_alert_templates
    WHERE template_name = 'Security Breach'
  );

  INSERT INTO public.sms_alert_templates (template_name, category, message_body, variables, priority, subject, is_active)
  SELECT 
    'Compliance Violation',
    'compliance',
    '📝 COMPLIANCE ALERT: {{category}} violation detected. {{message}}. Review Required: {{url}}',
    '["category", "message", "url"]'::jsonb,
    'high',
    'Compliance Alert',
    true
  WHERE NOT EXISTS (
    SELECT 1 FROM public.sms_alert_templates
    WHERE template_name = 'Compliance Violation'
  );

  INSERT INTO public.sms_alert_templates (template_name, category, message_body, variables, priority, subject, is_active)
  SELECT 
    'System Outage',
    'operational',
    '🔴 SYSTEM OUTAGE: {{systemName}} is experiencing downtime. ETA: {{eta}}. Status: {{url}}',
    '["systemName", "eta", "url"]'::jsonb,
    'critical',
    'System Outage',
    true
  WHERE NOT EXISTS (
    SELECT 1 FROM public.sms_alert_templates
    WHERE template_name = 'System Outage'
  );

  INSERT INTO public.sms_alert_templates (template_name, category, message_body, variables, priority, subject, is_active)
  SELECT 
    'Performance Degradation',
    'operational',
    '🟡 PERFORMANCE ALERT: {{metric}} degraded by {{percentage}}%. Investigating. Monitor: {{url}}',
    '["metric", "percentage", "url"]'::jsonb,
    'high',
    'Performance Alert',
    true
  WHERE NOT EXISTS (
    SELECT 1 FROM public.sms_alert_templates
    WHERE template_name = 'Performance Degradation'
  );

  INSERT INTO public.sms_alert_templates (template_name, category, message_body, variables, priority, subject, is_active)
  SELECT 
    'Creator Earnings Milestone',
    'creator',
    '🎉 Congratulations {{name}}! You''ve reached ${{amount}} in earnings! Keep creating: {{url}}',
    '["name", "amount", "url"]'::jsonb,
    'medium',
    'Earnings Milestone',
    true
  WHERE NOT EXISTS (
    SELECT 1 FROM public.sms_alert_templates
    WHERE template_name = 'Creator Earnings Milestone'
  );

  INSERT INTO public.sms_alert_templates (template_name, category, message_body, variables, priority, subject, is_active)
  SELECT 
    'Partnership Opportunity',
    'creator',
    '🤝 New Partnership: {{brandName}} interested in "{{opportunityTitle}}". Review: {{url}}',
    '["brandName", "opportunityTitle", "url"]'::jsonb,
    'medium',
    'Partnership Opportunity',
    true
  WHERE NOT EXISTS (
    SELECT 1 FROM public.sms_alert_templates
    WHERE template_name = 'Partnership Opportunity'
  );

  INSERT INTO public.sms_alert_templates (template_name, category, message_body, variables, priority, subject, is_active)
  SELECT 
    'Lottery Winner',
    'gamification',
    '🎆 WINNER! You won {{prizeAmount}} in {{electionName}}! Claim: {{url}}',
    '["prizeAmount", "electionName", "url"]'::jsonb,
    'high',
    'Lottery Winner',
    true
  WHERE NOT EXISTS (
    SELECT 1 FROM public.sms_alert_templates
    WHERE template_name = 'Lottery Winner'
  );
END $$;