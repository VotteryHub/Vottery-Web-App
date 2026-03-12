-- Financial Tracking & Executive Reporting Migration
-- Purpose: Track financial metrics across 8 purchasing power zones with forecasting and automated executive reporting

-- 1. Custom Types
CREATE TYPE public.zone_identifier AS ENUM (
  'zone_1',
  'zone_2',
  'zone_3',
  'zone_4',
  'zone_5',
  'zone_6',
  'zone_7',
  'zone_8'
);

CREATE TYPE public.financial_metric_type AS ENUM (
  'prize_pool',
  'participation_fee',
  'advertiser_spending',
  'roi',
  'revenue',
  'payout'
);

CREATE TYPE public.forecast_confidence AS ENUM (
  'high',
  'medium',
  'low'
);

CREATE TYPE public.executive_report_type AS ENUM (
  'performance_summary',
  'financial_statement',
  'compliance_documentation',
  'stakeholder_update',
  'board_communication'
);

-- 2. Core Tables

-- Financial Tracking by Zone
CREATE TABLE public.financial_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone public.zone_identifier NOT NULL,
  metric_type public.financial_metric_type NOT NULL,
  amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  currency TEXT DEFAULT 'INR',
  time_period TEXT NOT NULL DEFAULT '24h',
  election_id UUID REFERENCES public.elections(id) ON DELETE SET NULL,
  advertiser_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  participant_count INTEGER DEFAULT 0,
  conversion_rate NUMERIC(5, 2) DEFAULT 0.00,
  roi_percentage NUMERIC(5, 2) DEFAULT 0.00,
  metadata JSONB DEFAULT '{}'::jsonb,
  recorded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Financial Forecasting
CREATE TABLE public.financial_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone public.zone_identifier NOT NULL,
  forecast_type public.financial_metric_type NOT NULL,
  current_value NUMERIC(12, 2) NOT NULL,
  predicted_value NUMERIC(12, 2) NOT NULL,
  confidence_level public.forecast_confidence DEFAULT 'medium',
  forecast_period TEXT NOT NULL,
  optimization_recommendations JSONB DEFAULT '[]'::jsonb,
  ml_model_version TEXT,
  accuracy_score NUMERIC(5, 2),
  scenario_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  valid_until TIMESTAMPTZ
);

-- Zone Performance Aggregates
CREATE TABLE public.zone_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone public.zone_identifier NOT NULL,
  total_prize_pools NUMERIC(12, 2) DEFAULT 0.00,
  total_participation_fees NUMERIC(12, 2) DEFAULT 0.00,
  total_advertiser_spending NUMERIC(12, 2) DEFAULT 0.00,
  average_roi NUMERIC(5, 2) DEFAULT 0.00,
  active_elections INTEGER DEFAULT 0,
  total_participants INTEGER DEFAULT 0,
  prize_distribution_rate NUMERIC(5, 2) DEFAULT 0.00,
  conversion_metrics JSONB DEFAULT '{}'::jsonb,
  time_period TEXT NOT NULL DEFAULT '30d',
  last_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Executive Report Generation
CREATE TABLE public.executive_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type public.executive_report_type NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  report_data JSONB NOT NULL,
  generated_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'sent')),
  scheduled_send_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  recipients JSONB DEFAULT '[]'::jsonb,
  delivery_status JSONB DEFAULT '{}'::jsonb,
  file_url TEXT,
  export_format TEXT DEFAULT 'pdf',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Stakeholder Management
CREATE TABLE public.stakeholder_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_name TEXT NOT NULL UNIQUE,
  group_type TEXT NOT NULL CHECK (group_type IN ('board', 'investors', 'regulators', 'executives', 'partners')),
  recipients JSONB NOT NULL DEFAULT '[]'::jsonb,
  communication_preferences JSONB DEFAULT '{}'::jsonb,
  delivery_schedule TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Report Delivery Tracking
CREATE TABLE public.report_delivery_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES public.executive_reports(id) ON DELETE CASCADE,
  stakeholder_group_id UUID REFERENCES public.stakeholder_groups(id) ON DELETE SET NULL,
  recipient_email TEXT NOT NULL,
  delivery_status TEXT DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
  resend_message_id TEXT,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Indexes
CREATE INDEX idx_financial_tracking_zone ON public.financial_tracking(zone);
CREATE INDEX idx_financial_tracking_metric_type ON public.financial_tracking(metric_type);
CREATE INDEX idx_financial_tracking_recorded_at ON public.financial_tracking(recorded_at DESC);
CREATE INDEX idx_financial_tracking_election_id ON public.financial_tracking(election_id);
CREATE INDEX idx_financial_forecasts_zone ON public.financial_forecasts(zone);
CREATE INDEX idx_financial_forecasts_valid_until ON public.financial_forecasts(valid_until);
CREATE INDEX idx_zone_performance_zone ON public.zone_performance_metrics(zone);
CREATE INDEX idx_executive_reports_status ON public.executive_reports(status);
CREATE INDEX idx_executive_reports_scheduled_send ON public.executive_reports(scheduled_send_at);
CREATE INDEX idx_report_delivery_logs_report_id ON public.report_delivery_logs(report_id);
CREATE INDEX idx_report_delivery_logs_delivery_status ON public.report_delivery_logs(delivery_status);

-- 4. Enable RLS
ALTER TABLE public.financial_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zone_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.executive_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakeholder_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_delivery_logs ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies

-- Financial Tracking: Admin only
CREATE POLICY "admin_manage_financial_tracking"
ON public.financial_tracking
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

-- Financial Forecasts: Admin only
CREATE POLICY "admin_manage_financial_forecasts"
ON public.financial_forecasts
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

-- Zone Performance: Admin only
CREATE POLICY "admin_manage_zone_performance"
ON public.zone_performance_metrics
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

-- Executive Reports: Admin only
CREATE POLICY "admin_manage_executive_reports"
ON public.executive_reports
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

-- Stakeholder Groups: Admin only
CREATE POLICY "admin_manage_stakeholder_groups"
ON public.stakeholder_groups
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

-- Report Delivery Logs: Admin only
CREATE POLICY "admin_view_report_delivery_logs"
ON public.report_delivery_logs
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
);

-- 6. Mock Data
DO $$
DECLARE
    admin_user_id UUID;
    election_id_1 UUID;
    election_id_2 UUID;
    report_id UUID := gen_random_uuid();
    stakeholder_group_id UUID := gen_random_uuid();
BEGIN
    -- Get existing admin user
    SELECT id INTO admin_user_id FROM public.user_profiles WHERE role = 'admin' LIMIT 1;
    SELECT id INTO election_id_1 FROM public.elections LIMIT 1 OFFSET 0;
    SELECT id INTO election_id_2 FROM public.elections LIMIT 1 OFFSET 1;

    IF admin_user_id IS NOT NULL THEN
        -- Financial Tracking Data
        INSERT INTO public.financial_tracking (zone, metric_type, amount, time_period, election_id, participant_count, conversion_rate, roi_percentage) VALUES
            ('zone_1', 'prize_pool', 125000.00, '30d', election_id_1, 2500, 8.5, 72.3),
            ('zone_1', 'participation_fee', 75000.00, '30d', election_id_1, 2500, 8.5, 72.3),
            ('zone_1', 'advertiser_spending', 45000.00, '30d', election_id_1, 2500, 8.5, 72.3),
            ('zone_2', 'prize_pool', 108000.00, '30d', election_id_2, 2100, 7.2, 68.1),
            ('zone_2', 'participation_fee', 63000.00, '30d', election_id_2, 2100, 7.2, 68.1),
            ('zone_2', 'advertiser_spending', 38000.00, '30d', election_id_2, 2100, 7.2, 68.1),
            ('zone_3', 'prize_pool', 152000.00, '30d', election_id_1, 3200, 9.8, 85.2),
            ('zone_3', 'participation_fee', 96000.00, '30d', election_id_1, 3200, 9.8, 85.2),
            ('zone_3', 'advertiser_spending', 52000.00, '30d', election_id_1, 3200, 9.8, 85.2),
            ('zone_4', 'prize_pool', 89000.00, '30d', election_id_2, 1800, 6.1, 62.4),
            ('zone_5', 'prize_pool', 115000.00, '30d', election_id_1, 2400, 7.8, 70.5),
            ('zone_6', 'prize_pool', 98000.00, '30d', election_id_2, 2000, 6.9, 65.3),
            ('zone_7', 'prize_pool', 134000.00, '30d', election_id_1, 2800, 8.9, 78.1),
            ('zone_8', 'prize_pool', 92000.00, '30d', election_id_2, 1900, 6.5, 64.2);

        -- Financial Forecasts
        INSERT INTO public.financial_forecasts (zone, forecast_type, current_value, predicted_value, confidence_level, forecast_period, optimization_recommendations) VALUES
            ('zone_1', 'prize_pool', 125000.00, 145000.00, 'high', '30d', '[{"action": "Increase prize pool by 15%", "impact": "Expected 20% participation increase"}]'),
            ('zone_2', 'advertiser_spending', 38000.00, 42000.00, 'medium', '30d', '[{"action": "Target high-engagement demographics", "impact": "Projected 12% ROI improvement"}]'),
            ('zone_3', 'roi', 85.20, 92.50, 'high', '30d', '[{"action": "Optimize fee structure", "impact": "8% ROI increase projected"}]'),
            ('zone_4', 'prize_pool', 89000.00, 105000.00, 'medium', '30d', '[{"action": "Boost marketing in zone 4", "impact": "Expected 18% growth"}]'),
            ('zone_5', 'participation_fee', 69000.00, 78000.00, 'high', '30d', '[{"action": "Introduce tiered pricing", "impact": "13% revenue increase"}]');

        -- Zone Performance Metrics
        INSERT INTO public.zone_performance_metrics (zone, total_prize_pools, total_participation_fees, total_advertiser_spending, average_roi, active_elections, total_participants, prize_distribution_rate, time_period) VALUES
            ('zone_1', 125000.00, 75000.00, 45000.00, 72.30, 8, 2500, 94.5, '30d'),
            ('zone_2', 108000.00, 63000.00, 38000.00, 68.10, 7, 2100, 91.2, '30d'),
            ('zone_3', 152000.00, 96000.00, 52000.00, 85.20, 10, 3200, 96.8, '30d'),
            ('zone_4', 89000.00, 53400.00, 32000.00, 62.40, 5, 1800, 88.7, '30d'),
            ('zone_5', 115000.00, 69000.00, 41000.00, 70.50, 6, 2400, 92.3, '30d'),
            ('zone_6', 98000.00, 58800.00, 35000.00, 65.30, 6, 2000, 89.5, '30d'),
            ('zone_7', 134000.00, 80400.00, 48000.00, 78.10, 9, 2800, 95.1, '30d'),
            ('zone_8', 92000.00, 55200.00, 33000.00, 64.20, 5, 1900, 87.9, '30d');

        -- Stakeholder Groups
        INSERT INTO public.stakeholder_groups (id, group_name, group_type, recipients, communication_preferences, delivery_schedule, created_by) VALUES
            (stakeholder_group_id, 'Board of Directors', 'board', '[{"name": "John Smith", "email": "john.smith@vottery.com", "role": "Chairman"}, {"name": "Sarah Johnson", "email": "sarah.johnson@vottery.com", "role": "Board Member"}]'::jsonb, '{"format": "pdf", "frequency": "monthly"}'::jsonb, 'monthly', admin_user_id),
            (gen_random_uuid(), 'Investors', 'investors', '[{"name": "Michael Chen", "email": "michael.chen@investor.com", "role": "Lead Investor"}, {"name": "Emily Davis", "email": "emily.davis@investor.com", "role": "Partner"}]'::jsonb, '{"format": "pdf", "frequency": "quarterly"}'::jsonb, 'quarterly', admin_user_id),
            (gen_random_uuid(), 'Regulatory Bodies', 'regulators', '[{"name": "Compliance Officer", "email": "compliance@regulator.gov", "role": "Officer"}]'::jsonb, '{"format": "pdf", "frequency": "monthly"}'::jsonb, 'monthly', admin_user_id);

        -- Executive Reports
        INSERT INTO public.executive_reports (id, report_type, title, summary, report_data, generated_by, status, recipients) VALUES
            (report_id, 'performance_summary', 'Q4 2025 Performance Summary', 'Comprehensive overview of platform performance across all 8 purchasing power zones', '{"total_revenue": 1013000, "total_participants": 19700, "average_roi": 70.8, "top_zone": "zone_3", "growth_rate": 15.3}'::jsonb, admin_user_id, 'approved', '[{"email": "john.smith@vottery.com"}, {"email": "sarah.johnson@vottery.com"}]'::jsonb),
            (gen_random_uuid(), 'financial_statement', 'Monthly Financial Statement - December 2025', 'Detailed financial breakdown by zone with forecasting insights', '{"total_prize_pools": 1013000, "total_fees": 607800, "total_ad_spend": 324000, "net_revenue": 283800}'::jsonb, admin_user_id, 'draft', '[]'::jsonb),
            (gen_random_uuid(), 'stakeholder_update', 'Platform Growth Update', 'Key metrics and strategic initiatives for stakeholder review', '{"user_growth": 23.5, "engagement_increase": 18.2, "new_features": 5, "partnerships": 3}'::jsonb, admin_user_id, 'pending_approval', '[{"email": "michael.chen@investor.com"}]'::jsonb);

        -- Report Delivery Logs
        INSERT INTO public.report_delivery_logs (report_id, stakeholder_group_id, recipient_email, delivery_status, sent_at) VALUES
            (report_id, stakeholder_group_id, 'john.smith@vottery.com', 'delivered', NOW() - INTERVAL '2 days'),
            (report_id, stakeholder_group_id, 'sarah.johnson@vottery.com', 'delivered', NOW() - INTERVAL '2 days');

        RAISE NOTICE 'Financial tracking and executive reporting mock data created successfully';
    ELSE
        RAISE NOTICE 'No admin user found. Please run auth migration first.';
    END IF;
END $$;