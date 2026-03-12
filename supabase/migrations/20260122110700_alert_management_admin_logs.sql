-- Alert Management & Admin Activity Logs Migration
-- Timestamp: 20260122110700

-- ============================================
-- TYPES
-- ============================================

CREATE TYPE public.alert_severity AS ENUM ('critical', 'high', 'medium', 'low', 'info');
CREATE TYPE public.alert_status AS ENUM ('active', 'acknowledged', 'resolved', 'dismissed');
CREATE TYPE public.alert_category AS ENUM ('fraud_detection', 'policy_violation', 'performance_anomaly', 'security_event', 'system_health');
CREATE TYPE public.notification_channel AS ENUM ('email', 'sms', 'in_app', 'webhook');
CREATE TYPE public.admin_action_type AS ENUM ('user_management', 'election_approval', 'election_rejection', 'content_moderation', 'system_configuration', 'security_event', 'data_export', 'policy_update');

-- ============================================
-- TABLES
-- ============================================

-- Alert Rules Configuration
CREATE TABLE public.alert_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_name TEXT NOT NULL,
    category public.alert_category NOT NULL,
    severity public.alert_severity NOT NULL,
    description TEXT,
    threshold_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    condition_logic JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_enabled BOOLEAN DEFAULT true,
    auto_response_enabled BOOLEAN DEFAULT false,
    auto_response_actions JSONB DEFAULT '[]'::jsonb,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Triggered Alerts
CREATE TABLE public.system_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_rule_id UUID REFERENCES public.alert_rules(id) ON DELETE CASCADE,
    category public.alert_category NOT NULL,
    severity public.alert_severity NOT NULL,
    status public.alert_status DEFAULT 'active'::public.alert_status,
    title TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    affected_entity_type TEXT,
    affected_entity_id UUID,
    detection_method TEXT,
    confidence_score NUMERIC(5,2),
    false_positive BOOLEAN DEFAULT false,
    acknowledged_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    acknowledged_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Notification Rules
CREATE TABLE public.notification_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_rule_id UUID REFERENCES public.alert_rules(id) ON DELETE CASCADE,
    channel public.notification_channel NOT NULL,
    recipient_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    template_config JSONB DEFAULT '{}'::jsonb,
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Admin Activity Logs
CREATE TABLE public.admin_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    action_type public.admin_action_type NOT NULL,
    action_description TEXT NOT NULL,
    affected_entity_type TEXT,
    affected_entity_id UUID,
    before_state JSONB,
    after_state JSONB,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    user_agent TEXT,
    session_id TEXT,
    severity public.alert_severity DEFAULT 'info'::public.alert_severity,
    compliance_relevant BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Alert Effectiveness Tracking
CREATE TABLE public.alert_effectiveness (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_rule_id UUID REFERENCES public.alert_rules(id) ON DELETE CASCADE,
    total_triggered INTEGER DEFAULT 0,
    true_positives INTEGER DEFAULT 0,
    false_positives INTEGER DEFAULT 0,
    average_response_time INTERVAL,
    last_triggered_at TIMESTAMPTZ,
    effectiveness_score NUMERIC(5,2),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_alert_rules_category ON public.alert_rules(category);
CREATE INDEX idx_alert_rules_enabled ON public.alert_rules(is_enabled);
CREATE INDEX idx_system_alerts_status ON public.system_alerts(status);
CREATE INDEX idx_system_alerts_severity ON public.system_alerts(severity);
CREATE INDEX idx_system_alerts_category ON public.system_alerts(category);
CREATE INDEX idx_system_alerts_created_at ON public.system_alerts(created_at DESC);
CREATE INDEX idx_admin_activity_logs_admin_id ON public.admin_activity_logs(admin_id);
CREATE INDEX idx_admin_activity_logs_action_type ON public.admin_activity_logs(action_type);
CREATE INDEX idx_admin_activity_logs_created_at ON public.admin_activity_logs(created_at DESC);
CREATE INDEX idx_admin_activity_logs_compliance ON public.admin_activity_logs(compliance_relevant);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Function to log admin actions automatically
CREATE OR REPLACE FUNCTION public.log_admin_action(
    p_admin_id UUID,
    p_action_type public.admin_action_type,
    p_action_description TEXT,
    p_affected_entity_type TEXT DEFAULT NULL,
    p_affected_entity_id UUID DEFAULT NULL,
    p_before_state JSONB DEFAULT NULL,
    p_after_state JSONB DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'::jsonb,
    p_severity public.alert_severity DEFAULT 'info'::public.alert_severity,
    p_compliance_relevant BOOLEAN DEFAULT false
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO public.admin_activity_logs (
        admin_id,
        action_type,
        action_description,
        affected_entity_type,
        affected_entity_id,
        before_state,
        after_state,
        metadata,
        severity,
        compliance_relevant
    ) VALUES (
        p_admin_id,
        p_action_type,
        p_action_description,
        p_affected_entity_type,
        p_affected_entity_id,
        p_before_state,
        p_after_state,
        p_metadata,
        p_severity,
        p_compliance_relevant
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$;

-- ============================================
-- ENABLE RLS
-- ============================================

ALTER TABLE public.alert_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_effectiveness ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Alert Rules: Admin and moderator access
CREATE POLICY "admins_manage_alert_rules"
ON public.alert_rules
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'moderator')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'moderator')
    )
);

-- System Alerts: Admin and moderator access
CREATE POLICY "admins_manage_system_alerts"
ON public.system_alerts
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'moderator')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'moderator')
    )
);

-- Notification Rules: Admin access only
CREATE POLICY "admins_manage_notification_rules"
ON public.notification_rules
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role = 'admin'
    )
);

-- Admin Activity Logs: Admin and moderator read access
CREATE POLICY "admins_view_activity_logs"
ON public.admin_activity_logs
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'moderator')
    )
);

-- Alert Effectiveness: Admin and moderator access
CREATE POLICY "admins_view_alert_effectiveness"
ON public.alert_effectiveness
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'moderator')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'moderator')
    )
);

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER update_alert_rules_updated_at
    BEFORE UPDATE ON public.alert_rules
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_alerts_updated_at
    BEFORE UPDATE ON public.system_alerts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_rules_updated_at
    BEFORE UPDATE ON public.notification_rules
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alert_effectiveness_updated_at
    BEFORE UPDATE ON public.alert_effectiveness
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- MOCK DATA
-- ============================================

DO $$
DECLARE
    admin_user_id UUID;
    rule_fraud_id UUID := gen_random_uuid();
    rule_policy_id UUID := gen_random_uuid();
    rule_performance_id UUID := gen_random_uuid();
BEGIN
    -- Get existing admin user
    SELECT id INTO admin_user_id 
    FROM public.user_profiles 
    WHERE role = 'admin' 
    LIMIT 1;

    IF admin_user_id IS NOT NULL THEN
        -- Insert Alert Rules
        INSERT INTO public.alert_rules (id, rule_name, category, severity, description, threshold_config, condition_logic, is_enabled, created_by) VALUES
            (rule_fraud_id, 'Suspicious Voting Pattern Detection', 'fraud_detection', 'critical', 'Detects unusual voting patterns that may indicate fraud or manipulation', 
             '{"max_votes_per_hour": 100, "duplicate_ip_threshold": 5, "velocity_threshold": 50}'::jsonb,
             '{"conditions": ["votes_per_hour > threshold", "duplicate_ips > threshold"], "operator": "OR"}'::jsonb,
             true, admin_user_id),
            (rule_policy_id, 'Content Policy Violation', 'policy_violation', 'high', 'Flags content that violates platform policies including hate speech and misinformation',
             '{"confidence_threshold": 0.85, "auto_remove_threshold": 0.95}'::jsonb,
             '{"conditions": ["ai_confidence > threshold", "manual_reports > 3"], "operator": "OR"}'::jsonb,
             true, admin_user_id),
            (rule_performance_id, 'API Response Time Anomaly', 'performance_anomaly', 'medium', 'Monitors API response times for performance degradation',
             '{"response_time_ms": 2000, "error_rate_percent": 5}'::jsonb,
             '{"conditions": ["avg_response_time > threshold", "error_rate > threshold"], "operator": "OR"}'::jsonb,
             true, admin_user_id);

        -- Insert System Alerts
        INSERT INTO public.system_alerts (alert_rule_id, category, severity, status, title, description, metadata, affected_entity_type, detection_method, confidence_score) VALUES
            (rule_fraud_id, 'fraud_detection', 'critical', 'active', 'Multiple votes from same IP detected', 'User account showing suspicious voting behavior with 15 votes from single IP address in 10 minutes',
             '{"user_id": "user_123", "ip_address": "192.168.1.100", "vote_count": 15, "time_window": "10 minutes"}'::jsonb,
             'user', 'ai', 0.92),
            (rule_policy_id, 'policy_violation', 'high', 'acknowledged', 'Potential misinformation in election content', 'AI system flagged election description containing unverified claims about voting outcomes',
             '{"election_id": "election_456", "violation_type": "misinformation", "flagged_text": "Results have been predetermined..."}'::jsonb,
             'election', 'ai', 0.87),
            (rule_performance_id, 'performance_anomaly', 'medium', 'resolved', 'API response time spike detected', 'Vote submission endpoint experiencing elevated response times averaging 3.2 seconds',
             '{"endpoint": "/api/votes", "avg_response_time": 3200, "affected_users": 45}'::jsonb,
             'system', 'automated', 0.95);

        -- Insert Notification Rules
        INSERT INTO public.notification_rules (alert_rule_id, channel, recipient_config, template_config, is_enabled) VALUES
            (rule_fraud_id, 'email', '{"recipients": ["security@vottery.com", "admin@vottery.com"]}'::jsonb, '{"subject": "CRITICAL: Fraud Detection Alert", "priority": "high"}'::jsonb, true),
            (rule_fraud_id, 'in_app', '{"roles": ["admin", "moderator"]}'::jsonb, '{"notification_type": "alert", "sound": true}'::jsonb, true),
            (rule_policy_id, 'email', '{"recipients": ["moderation@vottery.com"]}'::jsonb, '{"subject": "Content Policy Violation Detected", "priority": "medium"}'::jsonb, true),
            (rule_performance_id, 'webhook', '{"url": "https://monitoring.vottery.com/alerts"}'::jsonb, '{"format": "json", "include_metadata": true}'::jsonb, true);

        -- Insert Admin Activity Logs
        INSERT INTO public.admin_activity_logs (admin_id, action_type, action_description, affected_entity_type, affected_entity_id, before_state, after_state, metadata, severity, compliance_relevant) VALUES
            (admin_user_id, 'election_approval', 'Approved election "Best Pizza Topping 2026" for public voting', 'election', gen_random_uuid(),
             '{"status": "pending_review"}'::jsonb, '{"status": "active"}'::jsonb,
             '{"review_duration_minutes": 15, "compliance_checks_passed": true}'::jsonb, 'info', true),
            (admin_user_id, 'content_moderation', 'Removed post containing policy violations', 'post', gen_random_uuid(),
             '{"status": "published", "content": "Flagged content..."}'::jsonb, '{"status": "removed", "reason": "hate_speech"}'::jsonb,
             '{"violation_type": "hate_speech", "ai_confidence": 0.94}'::jsonb, 'high', true),
            (admin_user_id, 'system_configuration', 'Updated fraud detection threshold settings', 'system', NULL,
             '{"max_votes_per_hour": 50}'::jsonb, '{"max_votes_per_hour": 100}'::jsonb,
             '{"reason": "Reducing false positives during peak hours"}'::jsonb, 'medium', false),
            (admin_user_id, 'user_management', 'Suspended user account for repeated policy violations', 'user', gen_random_uuid(),
             '{"status": "active", "violations": 2}'::jsonb, '{"status": "suspended", "violations": 3}'::jsonb,
             '{"suspension_duration_days": 7, "violation_types": ["spam", "harassment"]}'::jsonb, 'high', true);

        -- Insert Alert Effectiveness
        INSERT INTO public.alert_effectiveness (alert_rule_id, total_triggered, true_positives, false_positives, average_response_time, effectiveness_score) VALUES
            (rule_fraud_id, 45, 42, 3, INTERVAL '12 minutes', 93.33),
            (rule_policy_id, 128, 115, 13, INTERVAL '25 minutes', 89.84),
            (rule_performance_id, 67, 64, 3, INTERVAL '8 minutes', 95.52);

        RAISE NOTICE 'Alert management and admin activity log mock data created successfully';
    ELSE
        RAISE NOTICE 'No admin user found. Please run auth migration first.';
    END IF;
END $$;