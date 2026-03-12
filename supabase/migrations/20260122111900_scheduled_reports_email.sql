-- Scheduled Reports & Email Integration Migration
-- Purpose: Enable automated compliance reports, analytics exports, and ROI breakdowns via email

-- 1. Custom Types
CREATE TYPE public.report_type AS ENUM (
  'compliance_audit',
  'security_events',
  'content_moderation',
  'user_management',
  'analytics_export',
  'roi_breakdown',
  'campaign_performance',
  'fraud_detection_summary'
);

CREATE TYPE public.report_frequency AS ENUM (
  'daily',
  'weekly',
  'monthly',
  'quarterly',
  'on_demand'
);

CREATE TYPE public.report_status AS ENUM (
  'scheduled',
  'generating',
  'completed',
  'failed',
  'cancelled'
);

CREATE TYPE public.email_delivery_status AS ENUM (
  'pending',
  'sent',
  'failed',
  'bounced'
);

-- 2. Core Tables

-- Email Templates for Reports
CREATE TABLE public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name TEXT NOT NULL UNIQUE,
  report_type public.report_type NOT NULL,
  subject_template TEXT NOT NULL,
  body_template TEXT NOT NULL,
  variables JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Report Schedules Configuration
CREATE TABLE public.report_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_name TEXT NOT NULL,
  report_type public.report_type NOT NULL,
  frequency public.report_frequency NOT NULL,
  recipients JSONB NOT NULL DEFAULT '[]'::jsonb,
  filters JSONB DEFAULT '{}'::jsonb,
  format TEXT DEFAULT 'json',
  is_enabled BOOLEAN DEFAULT true,
  next_run_at TIMESTAMPTZ,
  last_run_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Scheduled Reports Execution Log
CREATE TABLE public.scheduled_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID REFERENCES public.report_schedules(id) ON DELETE CASCADE,
  report_type public.report_type NOT NULL,
  status public.report_status DEFAULT 'scheduled',
  data JSONB,
  file_url TEXT,
  error_message TEXT,
  generated_at TIMESTAMPTZ,
  email_delivery_status public.email_delivery_status DEFAULT 'pending',
  email_sent_at TIMESTAMPTZ,
  email_error TEXT,
  recipients JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Indexes
CREATE INDEX idx_email_templates_report_type ON public.email_templates(report_type);
CREATE INDEX idx_report_schedules_next_run ON public.report_schedules(next_run_at) WHERE is_enabled = true;
CREATE INDEX idx_report_schedules_created_by ON public.report_schedules(created_by);
CREATE INDEX idx_scheduled_reports_schedule_id ON public.scheduled_reports(schedule_id);
CREATE INDEX idx_scheduled_reports_status ON public.scheduled_reports(status);
CREATE INDEX idx_scheduled_reports_created_at ON public.scheduled_reports(created_at DESC);

-- 4. Functions

-- Update next_run_at based on frequency
CREATE OR REPLACE FUNCTION public.calculate_next_run()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.frequency = 'daily' THEN
    NEW.next_run_at := CURRENT_TIMESTAMP + INTERVAL '1 day';
  ELSIF NEW.frequency = 'weekly' THEN
    NEW.next_run_at := CURRENT_TIMESTAMP + INTERVAL '7 days';
  ELSIF NEW.frequency = 'monthly' THEN
    NEW.next_run_at := CURRENT_TIMESTAMP + INTERVAL '1 month';
  ELSIF NEW.frequency = 'quarterly' THEN
    NEW.next_run_at := CURRENT_TIMESTAMP + INTERVAL '3 months';
  ELSE
    NEW.next_run_at := NULL;
  END IF;
  RETURN NEW;
END;
$$;

-- 5. Enable RLS
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_reports ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies

-- Email Templates: Admin only
CREATE POLICY "admin_manage_email_templates"
ON public.email_templates
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
);

-- Report Schedules: Admin and creator
CREATE POLICY "admin_manage_all_report_schedules"
ON public.report_schedules
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
);

CREATE POLICY "users_view_own_report_schedules"
ON public.report_schedules
FOR SELECT
TO authenticated
USING (created_by = auth.uid());

-- Scheduled Reports: Admin and schedule creator
CREATE POLICY "admin_view_all_scheduled_reports"
ON public.scheduled_reports
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
);

CREATE POLICY "users_view_own_scheduled_reports"
ON public.scheduled_reports
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.report_schedules rs
    WHERE rs.id = schedule_id AND rs.created_by = auth.uid()
  )
);

-- 7. Triggers
CREATE TRIGGER set_next_run_on_insert
  BEFORE INSERT ON public.report_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_next_run();

CREATE TRIGGER set_next_run_on_update
  BEFORE UPDATE OF frequency ON public.report_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_next_run();

-- 8. Mock Data
DO $$
DECLARE
  admin_id UUID;
  compliance_template_id UUID := gen_random_uuid();
  analytics_template_id UUID := gen_random_uuid();
  roi_template_id UUID := gen_random_uuid();
  compliance_schedule_id UUID := gen_random_uuid();
  analytics_schedule_id UUID := gen_random_uuid();
BEGIN
  -- Get admin user
  SELECT id INTO admin_id FROM public.user_profiles WHERE role = 'admin' LIMIT 1;

  IF admin_id IS NOT NULL THEN
    -- Email Templates
    INSERT INTO public.email_templates (id, template_name, report_type, subject_template, body_template, variables) VALUES
      (compliance_template_id, 'Compliance Audit Report', 'compliance_audit', 
       'Compliance Audit Report - {{date}}', 
       '<h1>Compliance Audit Report</h1><p>Period: {{startDate}} to {{endDate}}</p><p>Total Activities: {{totalActivities}}</p><p>Compliance-Relevant: {{complianceCount}}</p><p>Please review the attached report for detailed information.</p>',
       '{"date": "string", "startDate": "string", "endDate": "string", "totalActivities": "number", "complianceCount": "number"}'::jsonb),
      (analytics_template_id, 'Analytics Export', 'analytics_export',
       'Platform Analytics Export - {{date}}',
       '<h1>Platform Analytics Export</h1><p>Export Date: {{date}}</p><p>Total Users: {{totalUsers}}</p><p>Active Elections: {{activeElections}}</p><p>Total Votes: {{totalVotes}}</p>',
       '{"date": "string", "totalUsers": "number", "activeElections": "number", "totalVotes": "number"}'::jsonb),
      (roi_template_id, 'ROI Breakdown Report', 'roi_breakdown',
       'Campaign ROI Breakdown - {{date}}',
       '<h1>Campaign ROI Breakdown</h1><p>Report Period: {{period}}</p><p>Total Spend: ${{totalSpend}}</p><p>Total Revenue: ${{totalRevenue}}</p><p>ROI: {{roi}}%</p>',
       '{"date": "string", "period": "string", "totalSpend": "number", "totalRevenue": "number", "roi": "number"}'::jsonb);

    -- Report Schedules
    INSERT INTO public.report_schedules (id, schedule_name, report_type, frequency, recipients, filters, format, created_by, next_run_at) VALUES
      (compliance_schedule_id, 'Weekly Compliance Report', 'compliance_audit', 'weekly',
       '[{"email": "compliance@example.com", "name": "Compliance Team"}]'::jsonb,
       '{"complianceRelevant": true, "timeRange": "week"}'::jsonb,
       'json', admin_id, CURRENT_TIMESTAMP + INTERVAL '7 days'),
      (analytics_schedule_id, 'Monthly Analytics Export', 'analytics_export', 'monthly',
       '[{"email": "analytics@example.com", "name": "Analytics Team"}, {"email": "ceo@example.com", "name": "CEO"}]'::jsonb,
       '{"timeRange": "month"}'::jsonb,
       'csv', admin_id, CURRENT_TIMESTAMP + INTERVAL '1 month'),
      (gen_random_uuid(), 'Quarterly ROI Report', 'roi_breakdown', 'quarterly',
       '[{"email": "finance@example.com", "name": "Finance Team"}]'::jsonb,
       '{"includeAllCampaigns": true}'::jsonb,
       'json', admin_id, CURRENT_TIMESTAMP + INTERVAL '3 months');

    -- Sample Scheduled Reports (execution history)
    INSERT INTO public.scheduled_reports (schedule_id, report_type, status, data, email_delivery_status, generated_at, email_sent_at, recipients) VALUES
      (compliance_schedule_id, 'compliance_audit', 'completed',
       '{"totalActivities": 247, "complianceCount": 89, "period": "2026-01-15 to 2026-01-22"}'::jsonb,
       'sent', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '2 days',
       '[{"email": "compliance@example.com", "name": "Compliance Team"}]'::jsonb),
      (analytics_schedule_id, 'analytics_export', 'completed',
       '{"totalUsers": 12847, "activeElections": 34, "totalVotes": 89234}'::jsonb,
       'sent', CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '5 days',
       '[{"email": "analytics@example.com", "name": "Analytics Team"}]'::jsonb),
      (compliance_schedule_id, 'compliance_audit', 'scheduled',
       NULL, 'pending', NULL, NULL,
       '[{"email": "compliance@example.com", "name": "Compliance Team"}]'::jsonb);

    RAISE NOTICE 'Scheduled reports and email templates created successfully';
  ELSE
    RAISE NOTICE 'No admin user found. Run auth migration first.';
  END IF;
END $$;