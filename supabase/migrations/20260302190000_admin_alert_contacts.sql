-- Admin Alert Contacts: Phone routing for Telnyx AI alerts (failover, degradation, cost approval)
CREATE TABLE IF NOT EXISTS public.admin_alert_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL,
  alert_type TEXT NOT NULL DEFAULT 'ai_failover', -- ai_failover, ai_degradation, cost_approval, all
  display_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_alert_contacts_alert_type ON public.admin_alert_contacts(alert_type);
CREATE INDEX IF NOT EXISTS idx_admin_alert_contacts_active ON public.admin_alert_contacts(is_active) WHERE is_active = true;

ALTER TABLE public.admin_alert_contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage admin_alert_contacts" ON public.admin_alert_contacts;
CREATE POLICY "Admins can manage admin_alert_contacts" ON public.admin_alert_contacts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

COMMENT ON TABLE public.admin_alert_contacts IS 'Phone numbers for Telnyx AI failover/degradation alerts';
