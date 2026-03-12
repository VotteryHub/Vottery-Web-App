-- Multi-Authentication Gateway & Global Localization Control Center
-- Migration: 20260123195000_multi_auth_localization_features.sql

-- ============================================
-- MULTI-AUTHENTICATION SYSTEM
-- ============================================

-- Passkey credentials storage
CREATE TABLE IF NOT EXISTS passkey_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  credential_id TEXT NOT NULL UNIQUE,
  public_key TEXT NOT NULL,
  counter BIGINT DEFAULT 0,
  device_type TEXT CHECK (device_type IN ('mobile', 'tablet', 'desktop')),
  transports TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  UNIQUE(user_id, credential_id)
);

-- Authentication logs
CREATE TABLE IF NOT EXISTS authentication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('passkey', 'magic_link', 'oauth', 'email_password', 'otp')),
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'sent', 'expired')),
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_auth_logs_email ON authentication_logs(email);
CREATE INDEX idx_auth_logs_created_at ON authentication_logs(created_at DESC);

-- Add authentication methods to elections table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'elections' AND column_name = 'authentication_methods') THEN
    ALTER TABLE elections ADD COLUMN authentication_methods TEXT[] DEFAULT ARRAY['email_password'];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'elections' AND column_name = 'require_otp') THEN
    ALTER TABLE elections ADD COLUMN require_otp BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- ============================================
-- GLOBAL LOCALIZATION SYSTEM
-- ============================================

-- Translation status tracking
CREATE TABLE IF NOT EXISTS translation_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language_code TEXT NOT NULL UNIQUE,
  language_name TEXT NOT NULL,
  native_name TEXT NOT NULL,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  total_strings INTEGER DEFAULT 0,
  translated_strings INTEGER DEFAULT 0,
  is_rtl BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Translation submissions (crowdsourced translations)
CREATE TABLE IF NOT EXISTS translation_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language_code TEXT NOT NULL,
  namespace TEXT NOT NULL,
  translation_key TEXT NOT NULL,
  translation_value TEXT NOT NULL,
  context TEXT,
  submitted_by UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  review_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_translation_submissions_status ON translation_submissions(status);
CREATE INDEX idx_translation_submissions_language ON translation_submissions(language_code);

-- Live translations
CREATE TABLE IF NOT EXISTS translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language_code TEXT NOT NULL,
  namespace TEXT NOT NULL,
  translation_key TEXT NOT NULL,
  translation_value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(language_code, namespace, translation_key)
);

CREATE INDEX idx_translations_lookup ON translations(language_code, namespace);

-- Cultural settings per country
CREATE TABLE IF NOT EXISTS cultural_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL UNIQUE,
  country_name TEXT NOT NULL,
  default_language TEXT NOT NULL,
  date_format TEXT DEFAULT 'MM/DD/YYYY',
  time_format TEXT DEFAULT '12h' CHECK (time_format IN ('12h', '24h')),
  currency_code TEXT,
  number_format JSONB DEFAULT '{"decimal": ".", "thousands": ","}',
  cultural_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Regional requirements
CREATE TABLE IF NOT EXISTS regional_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL UNIQUE,
  legal_compliance TEXT[] DEFAULT '{}',
  payment_methods TEXT[] DEFAULT '{}',
  data_residency_required BOOLEAN DEFAULT FALSE,
  age_restrictions INTEGER DEFAULT 18,
  cultural_guidelines TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Translation memory for reuse
CREATE TABLE IF NOT EXISTS translation_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_text TEXT NOT NULL,
  target_text TEXT NOT NULL,
  source_language TEXT NOT NULL,
  target_language TEXT NOT NULL,
  context TEXT,
  quality_score DECIMAL(3,2) DEFAULT 1.0 CHECK (quality_score >= 0 AND quality_score <= 1),
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

CREATE INDEX idx_translation_memory_lookup ON translation_memory(source_language, target_language);
CREATE INDEX idx_translation_memory_source_text ON translation_memory USING gin(to_tsvector('english', source_text));

-- Translation validations (quality assurance)
CREATE TABLE IF NOT EXISTS translation_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  translation_id UUID REFERENCES translations(id) ON DELETE CASCADE,
  validator_id UUID REFERENCES auth.users(id),
  quality_score DECIMAL(3,2) CHECK (quality_score >= 0 AND quality_score <= 5),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add preferred language to user_profiles (not user_preferences)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'preferred_language') THEN
    ALTER TABLE user_profiles ADD COLUMN preferred_language TEXT DEFAULT 'en-US';
  END IF;
END $$;

-- ============================================
-- ADVANCED ELECTION CREATOR CONTROLS
-- ============================================

-- Add advanced election controls
DO $$ 
BEGIN
  -- Anonymous voting toggle
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'elections' AND column_name = 'allow_anonymous_voting') THEN
    ALTER TABLE elections ADD COLUMN allow_anonymous_voting BOOLEAN DEFAULT FALSE;
  END IF;
  
  -- Voter approval requirement
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'elections' AND column_name = 'require_voter_approval') THEN
    ALTER TABLE elections ADD COLUMN require_voter_approval BOOLEAN DEFAULT FALSE;
  END IF;
  
  -- Vote editing permissions
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'elections' AND column_name = 'allow_vote_editing') THEN
    ALTER TABLE elections ADD COLUMN allow_vote_editing BOOLEAN DEFAULT FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'elections' AND column_name = 'vote_edit_requires_approval') THEN
    ALTER TABLE elections ADD COLUMN vote_edit_requires_approval BOOLEAN DEFAULT TRUE;
  END IF;
  
  -- Edit restrictions after voting
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'elections' AND column_name = 'first_vote_received_at') THEN
    ALTER TABLE elections ADD COLUMN first_vote_received_at TIMESTAMPTZ;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'elections' AND column_name = 'locked_for_editing') THEN
    ALTER TABLE elections ADD COLUMN locked_for_editing BOOLEAN DEFAULT FALSE;
  END IF;
  
  -- Maximum extension limit (6 months)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'elections' AND column_name = 'original_end_date') THEN
    ALTER TABLE elections ADD COLUMN original_end_date TIMESTAMPTZ;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'elections' AND column_name = 'extension_count') THEN
    ALTER TABLE elections ADD COLUMN extension_count INTEGER DEFAULT 0;
  END IF;
  
  -- Abstention tracking
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'elections' AND column_name = 'track_abstentions') THEN
    ALTER TABLE elections ADD COLUMN track_abstentions BOOLEAN DEFAULT TRUE;
  END IF;
END $$;

-- Voter approval queue
CREATE TABLE IF NOT EXISTS voter_approval_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID REFERENCES elections(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  UNIQUE(election_id, user_id)
);

CREATE INDEX idx_voter_approval_status ON voter_approval_queue(status);
CREATE INDEX idx_voter_approval_election ON voter_approval_queue(election_id);

-- Vote edit requests
CREATE TABLE IF NOT EXISTS vote_edit_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vote_id UUID REFERENCES votes(id) ON DELETE CASCADE,
  election_id UUID REFERENCES elections(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  original_vote JSONB NOT NULL,
  new_vote JSONB NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  UNIQUE(vote_id, requested_at)
);

CREATE INDEX idx_vote_edit_requests_status ON vote_edit_requests(status);
CREATE INDEX idx_vote_edit_requests_election ON vote_edit_requests(election_id);

-- Abstention records
CREATE TABLE IF NOT EXISTS abstentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID REFERENCES elections(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(election_id, user_id)
);

CREATE INDEX idx_abstentions_election ON abstentions(election_id);

-- ============================================
-- MULTIPLE ADMIN ROLES SYSTEM
-- ============================================

-- Admin roles table
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name TEXT NOT NULL UNIQUE CHECK (role_name IN ('super_admin', 'manager', 'admin', 'moderator', 'auditor', 'editor', 'advertiser', 'analyst')),
  role_display_name TEXT NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User role assignments
CREATE TABLE IF NOT EXISTS user_role_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES admin_roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(user_id, role_id)
);

CREATE INDEX idx_user_role_assignments_user ON user_role_assignments(user_id);
CREATE INDEX idx_user_role_assignments_active ON user_role_assignments(is_active);

-- Insert default admin roles
INSERT INTO admin_roles (role_name, role_display_name, description, permissions) VALUES
  ('super_admin', 'Super Admin', 'Full system access with all permissions', '{"all": true}'),
  ('manager', 'Manager', 'Manage users, elections, and platform operations', '{"users": true, "elections": true, "analytics": true, "settings": true}'),
  ('admin', 'Admin', 'Standard administrative access', '{"users": true, "elections": true, "moderation": true}'),
  ('moderator', 'Moderator', 'Content moderation and user management', '{"moderation": true, "users": {"view": true, "suspend": true}}'),
  ('auditor', 'Auditor', 'View-only access to all data and audit logs', '{"view_all": true, "export": true, "audit_logs": true}'),
  ('editor', 'Editor', 'Manage content and translations', '{"content": true, "translations": true, "elections": {"view": true, "edit": true}}'),
  ('advertiser', 'Advertiser', 'Manage advertising campaigns and analytics', '{"campaigns": true, "analytics": {"ads": true}, "billing": true}'),
  ('analyst', 'Analyst', 'Access to analytics and reporting', '{"analytics": true, "reports": true, "export": true}')
ON CONFLICT (role_name) DO NOTHING;

-- ============================================
-- FEATURE/COUNTRY/INTEGRATION TOGGLE CONTROLS
-- ============================================

-- Platform features toggle
CREATE TABLE IF NOT EXISTS platform_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_key TEXT NOT NULL UNIQUE,
  feature_name TEXT NOT NULL,
  feature_category TEXT NOT NULL CHECK (feature_category IN ('authentication', 'voting', 'gamification', 'social', 'payments', 'analytics', 'ai', 'localization', 'security')),
  description TEXT,
  is_enabled BOOLEAN DEFAULT TRUE,
  requires_subscription BOOLEAN DEFAULT FALSE,
  enabled_for_countries TEXT[] DEFAULT '{}',
  disabled_for_countries TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Country access controls
CREATE TABLE IF NOT EXISTS country_access_controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL UNIQUE,
  country_name TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT TRUE,
  blocked_features TEXT[] DEFAULT '{}',
  enabled_features TEXT[] DEFAULT '{}',
  biometric_enabled BOOLEAN DEFAULT TRUE,
  max_election_duration_days INTEGER DEFAULT 180,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Integration controls with cost limits
CREATE TABLE IF NOT EXISTS integration_controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_key TEXT NOT NULL UNIQUE,
  integration_name TEXT NOT NULL,
  integration_type TEXT NOT NULL CHECK (integration_type IN ('payment', 'ai', 'analytics', 'communication', 'storage', 'authentication')),
  is_enabled BOOLEAN DEFAULT TRUE,
  api_key_configured BOOLEAN DEFAULT FALSE,
  weekly_cost_limit DECIMAL(10,2) DEFAULT 0,
  monthly_cost_limit DECIMAL(10,2) DEFAULT 0,
  current_weekly_spend DECIMAL(10,2) DEFAULT 0,
  current_monthly_spend DECIMAL(10,2) DEFAULT 0,
  last_reset_weekly TIMESTAMPTZ DEFAULT NOW(),
  last_reset_monthly TIMESTAMPTZ DEFAULT NOW(),
  alert_threshold_percentage INTEGER DEFAULT 80,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_integration_controls_enabled ON integration_controls(is_enabled);

-- Insert default integrations
INSERT INTO integration_controls (integration_key, integration_name, integration_type, weekly_cost_limit, monthly_cost_limit) VALUES
  ('stripe', 'Stripe', 'payment', 1000.00, 4000.00),
  ('google_adsense', 'Google AdSense', 'analytics', 0, 0),
  ('openai', 'OpenAI', 'ai', 500.00, 2000.00),
  ('anthropic', 'Anthropic Claude', 'ai', 500.00, 2000.00),
  ('perplexity', 'Perplexity AI', 'ai', 300.00, 1200.00),
  ('resend', 'Resend Email', 'communication', 100.00, 400.00),
  ('twilio', 'Twilio SMS', 'communication', 200.00, 800.00),
  ('google_analytics', 'Google Analytics', 'analytics', 0, 0)
ON CONFLICT (integration_key) DO NOTHING;

-- Integration usage logs
CREATE TABLE IF NOT EXISTS integration_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_key TEXT NOT NULL,
  operation TEXT NOT NULL,
  cost DECIMAL(10,2) DEFAULT 0,
  tokens_used INTEGER,
  response_time_ms INTEGER,
  status TEXT CHECK (status IN ('success', 'failed', 'rate_limited')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_integration_usage_logs_key ON integration_usage_logs(integration_key);
CREATE INDEX idx_integration_usage_logs_created_at ON integration_usage_logs(created_at DESC);

-- ============================================
-- RLS POLICIES
-- ============================================

-- Passkey credentials (users can only manage their own)
ALTER TABLE passkey_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own passkey credentials"
  ON passkey_credentials FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own passkey credentials"
  ON passkey_credentials FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own passkey credentials"
  ON passkey_credentials FOR DELETE
  USING (auth.uid() = user_id);

-- Translation submissions (authenticated users can submit)
ALTER TABLE translation_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can submit translations"
  ON translation_submissions FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view own submissions"
  ON translation_submissions FOR SELECT
  USING (auth.uid() = submitted_by OR auth.uid() IN (SELECT user_id FROM user_role_assignments WHERE is_active = TRUE));

-- Translations (public read, admin write)
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view translations"
  ON translations FOR SELECT
  USING (true);

-- Voter approval queue
ALTER TABLE voter_approval_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own approval requests"
  ON voter_approval_queue FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can request voter approval"
  ON voter_approval_queue FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Vote edit requests
ALTER TABLE vote_edit_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own vote edit requests"
  ON vote_edit_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can submit vote edit requests"
  ON vote_edit_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Abstentions
ALTER TABLE abstentions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can record own abstentions"
  ON abstentions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own abstentions"
  ON abstentions FOR SELECT
  USING (auth.uid() = user_id);