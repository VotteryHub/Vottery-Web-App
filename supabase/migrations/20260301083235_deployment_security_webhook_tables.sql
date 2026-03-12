-- Migration: deployment_config, security_audit_checklist, webhook_config tables
-- Timestamp: 20260301083235

-- deployment_config table for Production Deployment Hub
CREATE TABLE IF NOT EXISTS public.deployment_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  current_release text NOT NULL DEFAULT '1.0.0',
  release_notes text,
  release_date timestamptz DEFAULT now(),
  deployment_status text DEFAULT 'stable' CHECK (deployment_status IN ('stable', 'deploying', 'rolling_back', 'failed')),
  active_slot text DEFAULT 'blue' CHECK (active_slot IN ('blue', 'green')),
  blue_version text DEFAULT '1.0.0',
  green_version text DEFAULT '1.0.0',
  feature_flags jsonb DEFAULT '{}'::jsonb,
  rollout_percentage integer DEFAULT 100 CHECK (rollout_percentage BETWEEN 0 AND 100),
  last_rollback_version text,
  last_rollback_at timestamptz,
  updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Seed initial deployment config row
INSERT INTO public.deployment_config (current_release, deployment_status, active_slot, feature_flags, rollout_percentage)
SELECT '1.0.0', 'stable', 'blue', '{"platform_gamification": true, "ai_recommendations": true, "advanced_analytics": true}'::jsonb, 100
WHERE NOT EXISTS (SELECT 1 FROM public.deployment_config LIMIT 1);

-- deployment_releases table for release history
CREATE TABLE IF NOT EXISTS public.deployment_releases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version text NOT NULL,
  title text,
  release_notes text,
  status text DEFAULT 'deployed' CHECK (status IN ('deployed', 'rolled_back', 'failed', 'pending')),
  deployed_by uuid REFERENCES auth.users(id),
  deployed_at timestamptz DEFAULT now(),
  rolled_back_at timestamptz,
  rollout_percentage integer DEFAULT 100,
  created_at timestamptz DEFAULT now()
);

-- Seed sample releases
INSERT INTO public.deployment_releases (version, title, status, rollout_percentage)
SELECT '1.0.0', 'Initial Production Release', 'deployed', 100
WHERE NOT EXISTS (SELECT 1 FROM public.deployment_releases WHERE version = '1.0.0');

INSERT INTO public.deployment_releases (version, title, status, rollout_percentage)
SELECT '0.9.5', 'Beta Release - Gamification Features', 'deployed', 100
WHERE NOT EXISTS (SELECT 1 FROM public.deployment_releases WHERE version = '0.9.5');

-- security_audit_checklist table for Security & Compliance Audit Screen
CREATE TABLE IF NOT EXISTS public.security_audit_checklist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_key text UNIQUE NOT NULL,
  category text NOT NULL CHECK (category IN ('encryption', 'authentication', 'gdpr_ccpa', 'penetration_testing', 'data_residency', 'pre_launch')),
  title text NOT NULL,
  description text,
  status text DEFAULT 'pending' CHECK (status IN ('pass', 'fail', 'na', 'pending')),
  notes text,
  last_checked_at timestamptz,
  checked_by uuid REFERENCES auth.users(id),
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Seed default checklist items
INSERT INTO public.security_audit_checklist (item_key, category, title, description, status) VALUES
  ('data_at_rest_encrypted', 'encryption', 'Data at Rest Encrypted', 'All database data encrypted using AES-256', 'pass'),
  ('tls_in_transit', 'encryption', 'TLS in Transit', 'All API communications use TLS 1.2+', 'pass'),
  ('key_rotation', 'encryption', 'Encryption Key Rotation', 'Encryption keys rotated every 90 days', 'pending'),
  ('mfa_enabled', 'authentication', 'MFA Enabled', 'Multi-factor authentication available for all users', 'pass'),
  ('biometric_auth', 'authentication', 'Biometric Auth (Optional)', 'Biometric authentication for supported elections', 'na'),
  ('session_management', 'authentication', 'Session Management', 'Secure session tokens with expiry', 'pass'),
  ('gdpr_data_export', 'gdpr_ccpa', 'GDPR Data Export', 'Users can export their personal data', 'pass'),
  ('gdpr_right_to_delete', 'gdpr_ccpa', 'Right to Delete', 'Users can request account deletion', 'pass'),
  ('ccpa_opt_out', 'gdpr_ccpa', 'CCPA Opt-Out', 'California users can opt out of data sale', 'pass'),
  ('privacy_policy_updated', 'gdpr_ccpa', 'Privacy Policy Updated', 'Privacy policy reflects current data practices', 'pass'),
  ('pentest_completed', 'penetration_testing', 'Penetration Test Completed', 'Last penetration test date and results', 'pending'),
  ('critical_issues_zero', 'penetration_testing', 'Critical Issues: 0', 'No critical vulnerabilities outstanding', 'pending'),
  ('owasp_top10', 'penetration_testing', 'OWASP Top 10 Addressed', 'All OWASP Top 10 vulnerabilities mitigated', 'pass'),
  ('eu_data_residency', 'data_residency', 'EU Data in EU Region', 'European user data stored in EU Supabase region', 'na'),
  ('data_retention_policy', 'data_residency', 'Data Retention Policy', 'Data retention schedule defined and enforced', 'pass'),
  ('security_signoff', 'pre_launch', 'Pre-Launch Security Sign-Off', 'Security team sign-off before major releases', 'pending'),
  ('incident_response_plan', 'pre_launch', 'Incident Response Plan', 'Documented incident response procedures', 'pass')
ON CONFLICT (item_key) DO NOTHING;

-- webhook_config table for D.6 webhook dispatcher
CREATE TABLE IF NOT EXISTS public.webhook_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  events text[] NOT NULL DEFAULT '{}',
  is_active boolean DEFAULT true,
  secret_key text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- webhook_delivery_logs table
CREATE TABLE IF NOT EXISTS public.webhook_delivery_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id uuid REFERENCES public.webhook_config(id) ON DELETE CASCADE,
  event text NOT NULL,
  election_id uuid,
  success boolean DEFAULT false,
  status_code integer,
  error_message text,
  dispatched_at timestamptz DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.deployment_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployment_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_delivery_logs ENABLE ROW LEVEL SECURITY;

-- deployment_config: admin read/write, others read
DROP POLICY IF EXISTS "deployment_config_read" ON public.deployment_config;
CREATE POLICY "deployment_config_read" ON public.deployment_config
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "deployment_config_admin_write" ON public.deployment_config;
CREATE POLICY "deployment_config_admin_write" ON public.deployment_config
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- deployment_releases: admin read/write
DROP POLICY IF EXISTS "deployment_releases_read" ON public.deployment_releases;
CREATE POLICY "deployment_releases_read" ON public.deployment_releases
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "deployment_releases_admin_write" ON public.deployment_releases;
CREATE POLICY "deployment_releases_admin_write" ON public.deployment_releases
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- security_audit_checklist: admin read/write, others read
DROP POLICY IF EXISTS "security_audit_read" ON public.security_audit_checklist;
CREATE POLICY "security_audit_read" ON public.security_audit_checklist
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "security_audit_admin_write" ON public.security_audit_checklist;
CREATE POLICY "security_audit_admin_write" ON public.security_audit_checklist
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- webhook_config: admin only
DROP POLICY IF EXISTS "webhook_config_admin" ON public.webhook_config;
CREATE POLICY "webhook_config_admin" ON public.webhook_config
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- webhook_delivery_logs: admin read
DROP POLICY IF EXISTS "webhook_delivery_logs_read" ON public.webhook_delivery_logs;
CREATE POLICY "webhook_delivery_logs_read" ON public.webhook_delivery_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );
