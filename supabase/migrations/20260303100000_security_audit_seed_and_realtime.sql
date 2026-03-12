-- 1) Seed security_audit_checklist only if table is empty (idempotent for fresh projects)
INSERT INTO public.security_audit_checklist (item_key, category, title, description, status)
SELECT v.item_key, v.category, v.title, v.description, v.status
FROM (VALUES
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
) AS v(item_key, category, title, description, status)
WHERE EXISTS (SELECT 1 FROM information_schema.tables t WHERE t.table_schema = 'public' AND t.table_name = 'security_audit_checklist')
  AND (SELECT COUNT(*) FROM public.security_audit_checklist) = 0
ON CONFLICT (item_key) DO NOTHING;

-- 2) Enable Realtime for prize_distributions and notifications (Winner Notification Center <100ms)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'prize_distributions') THEN
    NULL;
  ELSIF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'prize_distributions') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.prize_distributions;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'notifications') THEN
    NULL;
  ELSIF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notifications') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
