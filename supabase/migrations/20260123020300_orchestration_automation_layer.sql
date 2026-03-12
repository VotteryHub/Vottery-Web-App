-- Orchestration Automation Layer Migration
-- Intelligent orchestration for compliance submissions, incident escalations, and optimization actions
-- Triggered by Perplexity fraud detection and financial thresholds

-- Create orchestration workflows table
CREATE TABLE public.orchestration_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_name TEXT NOT NULL,
    workflow_type TEXT NOT NULL CHECK (workflow_type = ANY (ARRAY['fraud_response'::text, 'compliance_submission'::text, 'incident_escalation'::text, 'financial_optimization'::text, 'stakeholder_notification'::text])),
    trigger_source TEXT NOT NULL CHECK (trigger_source = ANY (ARRAY['perplexity_fraud'::text, 'financial_threshold'::text, 'manual'::text, 'scheduled'::text])),
    trigger_conditions JSONB DEFAULT '{}'::jsonb,
    automation_rules JSONB DEFAULT '[]'::jsonb,
    execution_sequence JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'active'::text CHECK (status = ANY (ARRAY['active'::text, 'paused'::text, 'disabled'::text])),
    priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
    retry_config JSONB DEFAULT '{"max_retries": 3, "backoff_seconds": 60}'::jsonb,
    notification_channels JSONB DEFAULT '[]'::jsonb,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orchestration_workflows_type ON public.orchestration_workflows(workflow_type);
CREATE INDEX idx_orchestration_workflows_trigger_source ON public.orchestration_workflows(trigger_source);
CREATE INDEX idx_orchestration_workflows_status ON public.orchestration_workflows(status);

-- Create workflow execution logs table
CREATE TABLE public.workflow_execution_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES public.orchestration_workflows(id) ON DELETE CASCADE,
    execution_status TEXT DEFAULT 'pending'::text CHECK (execution_status = ANY (ARRAY['pending'::text, 'running'::text, 'completed'::text, 'failed'::text, 'cancelled'::text])),
    trigger_data JSONB DEFAULT '{}'::jsonb,
    execution_steps JSONB DEFAULT '[]'::jsonb,
    actions_executed JSONB DEFAULT '[]'::jsonb,
    notifications_sent JSONB DEFAULT '[]'::jsonb,
    error_details TEXT,
    retry_count INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    execution_duration_ms INTEGER,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_workflow_execution_logs_workflow_id ON public.workflow_execution_logs(workflow_id);
CREATE INDEX idx_workflow_execution_logs_status ON public.workflow_execution_logs(execution_status);
CREATE INDEX idx_workflow_execution_logs_created_at ON public.workflow_execution_logs(created_at DESC);

-- Create stakeholder incident communications table
CREATE TABLE public.stakeholder_incident_communications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID REFERENCES public.incident_response_workflows(id) ON DELETE CASCADE,
    stakeholder_group_id UUID REFERENCES public.stakeholder_groups(id) ON DELETE SET NULL,
    communication_type TEXT NOT NULL CHECK (communication_type = ANY (ARRAY['email'::text, 'sms'::text, 'in_app'::text, 'webhook'::text])),
    recipient_email TEXT,
    recipient_phone TEXT,
    subject TEXT,
    message_content TEXT NOT NULL,
    template_used TEXT,
    delivery_status TEXT DEFAULT 'pending'::text CHECK (delivery_status = ANY (ARRAY['pending'::text, 'sent'::text, 'delivered'::text, 'failed'::text, 'bounced'::text])),
    resend_message_id TEXT,
    twilio_message_sid TEXT,
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    response_tracking JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stakeholder_comms_incident_id ON public.stakeholder_incident_communications(incident_id);
CREATE INDEX idx_stakeholder_comms_group_id ON public.stakeholder_incident_communications(stakeholder_group_id);
CREATE INDEX idx_stakeholder_comms_status ON public.stakeholder_incident_communications(delivery_status);
CREATE INDEX idx_stakeholder_comms_type ON public.stakeholder_incident_communications(communication_type);

-- Create automated compliance submissions table
CREATE TABLE public.automated_compliance_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_execution_id UUID REFERENCES public.workflow_execution_logs(id) ON DELETE SET NULL,
    filing_id UUID REFERENCES public.regulatory_filings(id) ON DELETE SET NULL,
    submission_trigger TEXT NOT NULL CHECK (submission_trigger = ANY (ARRAY['fraud_threshold'::text, 'financial_threshold'::text, 'scheduled'::text, 'manual'::text])),
    jurisdiction TEXT NOT NULL,
    regulatory_authority TEXT NOT NULL,
    submission_type TEXT NOT NULL,
    submission_data JSONB NOT NULL,
    automation_status TEXT DEFAULT 'pending'::text CHECK (automation_status = ANY (ARRAY['pending'::text, 'processing'::text, 'submitted'::text, 'failed'::text, 'cancelled'::text])),
    resend_submission_log_id UUID,
    approval_required BOOLEAN DEFAULT false,
    approved_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ,
    error_details TEXT,
    audit_trail JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_automated_compliance_workflow_id ON public.automated_compliance_submissions(workflow_execution_id);
CREATE INDEX idx_automated_compliance_filing_id ON public.automated_compliance_submissions(filing_id);
CREATE INDEX idx_automated_compliance_status ON public.automated_compliance_submissions(automation_status);
CREATE INDEX idx_automated_compliance_jurisdiction ON public.automated_compliance_submissions(jurisdiction);

-- Create real-time subscription configurations table
CREATE TABLE public.realtime_subscription_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_name TEXT NOT NULL UNIQUE,
    table_name TEXT NOT NULL,
    event_types JSONB DEFAULT '["INSERT", "UPDATE", "DELETE"]'::jsonb,
    filter_conditions JSONB DEFAULT '{}'::jsonb,
    target_channels JSONB DEFAULT '[]'::jsonb,
    transformation_rules JSONB DEFAULT '{}'::jsonb,
    is_enabled BOOLEAN DEFAULT true,
    refresh_interval_seconds INTEGER DEFAULT 15,
    batch_size INTEGER DEFAULT 50,
    priority INTEGER DEFAULT 5,
    error_handling JSONB DEFAULT '{"retry_on_error": true, "max_retries": 3}'::jsonb,
    performance_metrics JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_realtime_configs_table_name ON public.realtime_subscription_configs(table_name);
CREATE INDEX idx_realtime_configs_enabled ON public.realtime_subscription_configs(is_enabled);

-- Create integration health monitoring table
CREATE TABLE public.integration_health_monitoring (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_name TEXT NOT NULL,
    integration_type TEXT NOT NULL CHECK (integration_type = ANY (ARRAY['perplexity'::text, 'resend'::text, 'twilio'::text, 'supabase_realtime'::text, 'stripe'::text])),
    health_status TEXT DEFAULT 'healthy'::text CHECK (health_status = ANY (ARRAY['healthy'::text, 'degraded'::text, 'down'::text, 'maintenance'::text])),
    last_successful_call TIMESTAMPTZ,
    last_failed_call TIMESTAMPTZ,
    success_rate_24h NUMERIC(5,2) DEFAULT 100.00,
    average_response_time_ms INTEGER,
    total_calls_24h INTEGER DEFAULT 0,
    failed_calls_24h INTEGER DEFAULT 0,
    error_details JSONB DEFAULT '[]'::jsonb,
    performance_metrics JSONB DEFAULT '{}'::jsonb,
    alert_threshold_config JSONB DEFAULT '{"error_rate_threshold": 10, "response_time_threshold_ms": 5000}'::jsonb,
    last_health_check TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_integration_health_name ON public.integration_health_monitoring(integration_name);
CREATE INDEX idx_integration_health_type ON public.integration_health_monitoring(integration_type);
CREATE INDEX idx_integration_health_status ON public.integration_health_monitoring(health_status);

-- Enable RLS on all tables
ALTER TABLE public.orchestration_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakeholder_incident_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automated_compliance_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.realtime_subscription_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_health_monitoring ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orchestration_workflows
CREATE POLICY "admin_full_access_orchestration_workflows"
ON public.orchestration_workflows
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

CREATE POLICY "users_view_orchestration_workflows"
ON public.orchestration_workflows
FOR SELECT
TO authenticated
USING (true);

-- RLS Policies for workflow_execution_logs
CREATE POLICY "admin_full_access_workflow_execution_logs"
ON public.workflow_execution_logs
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

CREATE POLICY "users_view_workflow_execution_logs"
ON public.workflow_execution_logs
FOR SELECT
TO authenticated
USING (true);

-- RLS Policies for stakeholder_incident_communications
CREATE POLICY "admin_full_access_stakeholder_comms"
ON public.stakeholder_incident_communications
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

CREATE POLICY "users_view_stakeholder_comms"
ON public.stakeholder_incident_communications
FOR SELECT
TO authenticated
USING (true);

-- RLS Policies for automated_compliance_submissions
CREATE POLICY "admin_full_access_automated_compliance"
ON public.automated_compliance_submissions
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

CREATE POLICY "users_view_automated_compliance"
ON public.automated_compliance_submissions
FOR SELECT
TO authenticated
USING (true);

-- RLS Policies for realtime_subscription_configs
CREATE POLICY "admin_full_access_realtime_configs"
ON public.realtime_subscription_configs
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

CREATE POLICY "users_view_realtime_configs"
ON public.realtime_subscription_configs
FOR SELECT
TO authenticated
USING (true);

-- RLS Policies for integration_health_monitoring
CREATE POLICY "admin_full_access_integration_health"
ON public.integration_health_monitoring
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

CREATE POLICY "users_view_integration_health"
ON public.integration_health_monitoring
FOR SELECT
TO authenticated
USING (true);

-- Insert default orchestration workflows
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    SELECT id INTO admin_user_id FROM public.user_profiles WHERE role = 'admin' LIMIT 1;

    IF admin_user_id IS NOT NULL THEN
        -- Fraud Response Workflow
        INSERT INTO public.orchestration_workflows (workflow_name, workflow_type, trigger_source, trigger_conditions, automation_rules, execution_sequence, priority, notification_channels, created_by)
        VALUES (
            'Perplexity Fraud Auto-Response',
            'fraud_response',
            'perplexity_fraud',
            '{"threat_score_threshold": 75, "threat_level": ["critical", "high"]}'::jsonb,
            '[
                {"action": "freeze_account", "conditions": {"threat_score": ">= 90"}},
                {"action": "block_transactions", "conditions": {"threat_level": "critical"}},
                {"action": "notify_stakeholders", "channels": ["email", "sms"]},
                {"action": "create_incident", "escalation_level": 2}
            ]'::jsonb,
            '[
                {"step": 1, "action": "analyze_threat", "service": "perplexity"},
                {"step": 2, "action": "execute_automated_response", "parallel": true},
                {"step": 3, "action": "send_notifications", "channels": ["email", "sms"]},
                {"step": 4, "action": "log_execution", "audit": true}
            ]'::jsonb,
            10,
            '["email", "sms", "in_app"]'::jsonb,
            admin_user_id
        );

        -- Compliance Submission Workflow
        INSERT INTO public.orchestration_workflows (workflow_name, workflow_type, trigger_source, trigger_conditions, automation_rules, execution_sequence, priority, notification_channels, created_by)
        VALUES (
            'Automated Regulatory Submission',
            'compliance_submission',
            'financial_threshold',
            '{"transaction_volume_threshold": 100000, "jurisdictions": ["US", "EU", "UK"]}'::jsonb,
            '[
                {"action": "generate_compliance_report", "format": "pdf"},
                {"action": "submit_via_resend", "recipients": "regulatory_authorities"},
                {"action": "update_filing_status", "status": "submitted"},
                {"action": "notify_compliance_officer", "channels": ["email"]}
            ]'::jsonb,
            '[
                {"step": 1, "action": "collect_financial_data", "time_range": "24h"},
                {"step": 2, "action": "generate_report", "template": "regulatory_filing"},
                {"step": 3, "action": "submit_via_resend", "edge_function": "send-regulatory-submission"},
                {"step": 4, "action": "track_delivery", "audit": true}
            ]'::jsonb,
            8,
            '["email"]'::jsonb,
            admin_user_id
        );

        -- Financial Optimization Workflow
        INSERT INTO public.orchestration_workflows (workflow_name, workflow_type, trigger_source, trigger_conditions, automation_rules, execution_sequence, priority, notification_channels, created_by)
        VALUES (
            'Financial Threshold Optimization',
            'financial_optimization',
            'financial_threshold',
            '{"roi_threshold": 150, "zone_performance_drop": 20}'::jsonb,
            '[
                {"action": "analyze_zone_performance", "zones": "all"},
                {"action": "generate_optimization_recommendations", "ml_model": "financial_forecasting"},
                {"action": "notify_financial_team", "channels": ["email", "in_app"]},
                {"action": "create_alert", "severity": "medium"}
            ]'::jsonb,
            '[
                {"step": 1, "action": "fetch_financial_metrics", "time_range": "7d"},
                {"step": 2, "action": "run_ml_analysis", "model": "zone_optimization"},
                {"step": 3, "action": "generate_recommendations", "format": "json"},
                {"step": 4, "action": "distribute_notifications", "stakeholders": ["financial_team", "executives"]}
            ]'::jsonb,
            6,
            '["email", "in_app"]'::jsonb,
            admin_user_id
        );
    END IF;
END $$;

-- Insert default real-time subscription configurations
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    SELECT id INTO admin_user_id FROM public.user_profiles WHERE role = 'admin' LIMIT 1;

    IF admin_user_id IS NOT NULL THEN
        -- Team Collaboration Real-Time Subscription
        INSERT INTO public.realtime_subscription_configs (subscription_name, table_name, event_types, filter_conditions, target_channels, refresh_interval_seconds, created_by)
        VALUES (
            'Team Collaboration Live Updates',
            'team_collaboration_activity',
            '["INSERT", "UPDATE"]'::jsonb,
            '{"activity_types": ["comment", "status_change", "goal_update"]}'::jsonb,
            '["team_collaboration_center"]'::jsonb,
            15,
            admin_user_id
        );

        -- Financial Tracking Real-Time Subscription
        INSERT INTO public.realtime_subscription_configs (subscription_name, table_name, event_types, filter_conditions, target_channels, refresh_interval_seconds, created_by)
        VALUES (
            'Financial Tracking Live Metrics',
            'financial_tracking',
            '["INSERT", "UPDATE"]'::jsonb,
            '{"metric_types": ["prize_pool", "advertiser_spending", "roi"]}'::jsonb,
            '["financial_tracking_center", "advertiser_dashboard"]'::jsonb,
            15,
            admin_user_id
        );

        -- Fraud Detection Real-Time Subscription
        INSERT INTO public.realtime_subscription_configs (subscription_name, table_name, event_types, filter_conditions, target_channels, refresh_interval_seconds, created_by)
        VALUES (
            'Fraud Detection Live Alerts',
            'system_alerts',
            '["INSERT", "UPDATE"]'::jsonb,
            '{"category": "fraud_detection", "severity": ["critical", "high"]}'::jsonb,
            '["fraud_detection_center", "admin_dashboard"]'::jsonb,
            10,
            admin_user_id
        );

        -- Incident Response Real-Time Subscription
        INSERT INTO public.realtime_subscription_configs (subscription_name, table_name, event_types, filter_conditions, target_channels, refresh_interval_seconds, created_by)
        VALUES (
            'Incident Response Live Updates',
            'incident_response_workflows',
            '["INSERT", "UPDATE"]'::jsonb,
            '{"status": ["detected", "escalated", "in_progress"]}'::jsonb,
            '["incident_response_portal", "admin_dashboard"]'::jsonb,
            10,
            admin_user_id
        );
    END IF;
END $$;

-- Insert default integration health monitoring entries
INSERT INTO public.integration_health_monitoring (integration_name, integration_type, health_status, performance_metrics)
VALUES
    ('Perplexity Fraud Detection', 'perplexity', 'healthy', '{"model": "sonar-reasoning-pro", "average_analysis_time_ms": 2500}'::jsonb),
    ('Resend Email Service', 'resend', 'healthy', '{"delivery_rate": 99.5, "average_send_time_ms": 800}'::jsonb),
    ('Twilio SMS Service', 'twilio', 'healthy', '{"delivery_rate": 98.2, "average_send_time_ms": 1200}'::jsonb),
    ('Supabase Real-Time', 'supabase_realtime', 'healthy', '{"active_subscriptions": 4, "average_latency_ms": 150}'::jsonb);
