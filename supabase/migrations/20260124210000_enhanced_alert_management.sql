-- Enhanced Alert Management Migration
-- Priority Triage, Auto-Grouping, 1-Click Actions, Compliance Escalation

DO $$
BEGIN
  RAISE NOTICE 'Starting enhanced alert management migration...';
END $$;

-- Add priority scoring and correlation fields to system_alerts
ALTER TABLE system_alerts ADD COLUMN IF NOT EXISTS priority_score INTEGER DEFAULT 0;
ALTER TABLE system_alerts ADD COLUMN IF NOT EXISTS correlation_group_id UUID;
ALTER TABLE system_alerts ADD COLUMN IF NOT EXISTS auto_grouped BOOLEAN DEFAULT false;
ALTER TABLE system_alerts ADD COLUMN IF NOT EXISTS time_window_start TIMESTAMPTZ;
ALTER TABLE system_alerts ADD COLUMN IF NOT EXISTS time_window_end TIMESTAMPTZ;

-- Add SLA tracking to incident_response_workflows
ALTER TABLE incident_response_workflows ADD COLUMN IF NOT EXISTS sla_deadline TIMESTAMPTZ;
ALTER TABLE incident_response_workflows ADD COLUMN IF NOT EXISTS sla_status TEXT DEFAULT 'on_track' CHECK (sla_status IN ('on_track', 'at_risk', 'breached'));
ALTER TABLE incident_response_workflows ADD COLUMN IF NOT EXISTS sla_breach_notified BOOLEAN DEFAULT false;
ALTER TABLE incident_response_workflows ADD COLUMN IF NOT EXISTS escalation_level INTEGER DEFAULT 1 CHECK (escalation_level BETWEEN 1 AND 5);
ALTER TABLE incident_response_workflows ADD COLUMN IF NOT EXISTS escalation_history JSONB DEFAULT '[]'::jsonb;

-- Alert Correlation Groups Table
CREATE TABLE IF NOT EXISTS alert_correlation_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_name TEXT NOT NULL,
  correlation_pattern TEXT NOT NULL,
  affected_entity_type TEXT,
  affected_entity_id UUID,
  detection_method TEXT,
  time_window_minutes INTEGER DEFAULT 15,
  alert_count INTEGER DEFAULT 0,
  severity TEXT CHECK (severity IN ('critical', 'high', 'medium', 'low', 'info')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'dismissed')),
  first_alert_at TIMESTAMPTZ DEFAULT NOW(),
  last_alert_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES user_profiles(id),
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quick Action Templates Table
CREATE TABLE IF NOT EXISTS quick_action_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_name TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('dispute_resolution', 'user_management', 'election_control', 'compliance_action')),
  action_config JSONB NOT NULL,
  icon TEXT,
  color TEXT,
  requires_confirmation BOOLEAN DEFAULT true,
  requires_reason BOOLEAN DEFAULT false,
  audit_trail_enabled BOOLEAN DEFAULT true,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quick Action Execution Log
CREATE TABLE IF NOT EXISTS quick_action_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_template_id UUID REFERENCES quick_action_templates(id),
  alert_id UUID REFERENCES system_alerts(id),
  incident_id UUID REFERENCES incident_response_workflows(id),
  executed_by UUID REFERENCES user_profiles(id) NOT NULL,
  action_type TEXT NOT NULL,
  action_details JSONB NOT NULL,
  execution_reason TEXT,
  execution_status TEXT DEFAULT 'success' CHECK (execution_status IN ('success', 'failed', 'pending')),
  error_message TEXT,
  before_state JSONB,
  after_state JSONB,
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance Escalation Workflows Table
CREATE TABLE IF NOT EXISTS compliance_escalation_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_name TEXT NOT NULL,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('financial_threshold', 'deadline_based', 'event_based', 'periodic')),
  trigger_config JSONB NOT NULL,
  escalation_path JSONB NOT NULL,
  stakeholder_groups UUID[] DEFAULT '{}'::UUID[],
  notification_channels TEXT[] DEFAULT '{email, sms}'::TEXT[],
  sla_hours INTEGER DEFAULT 24,
  auto_escalate BOOLEAN DEFAULT true,
  is_enabled BOOLEAN DEFAULT true,
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance Escalation Executions
CREATE TABLE IF NOT EXISTS compliance_escalation_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES compliance_escalation_workflows(id) NOT NULL,
  incident_id UUID REFERENCES incident_response_workflows(id),
  alert_id UUID REFERENCES system_alerts(id),
  trigger_reason TEXT NOT NULL,
  current_escalation_level INTEGER DEFAULT 1,
  stakeholders_notified JSONB DEFAULT '[]'::jsonb,
  notification_history JSONB DEFAULT '[]'::jsonb,
  sla_deadline TIMESTAMPTZ,
  sla_status TEXT DEFAULT 'on_track' CHECK (sla_status IN ('on_track', 'at_risk', 'breached')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'escalated', 'resolved', 'cancelled')),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SLA Tracking Table
CREATE TABLE IF NOT EXISTS sla_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('alert', 'incident', 'compliance_escalation')),
  entity_id UUID NOT NULL,
  sla_type TEXT NOT NULL,
  sla_deadline TIMESTAMPTZ NOT NULL,
  sla_status TEXT DEFAULT 'on_track' CHECK (sla_status IN ('on_track', 'at_risk', 'breached')),
  warning_threshold_hours INTEGER DEFAULT 4,
  breach_notified BOOLEAN DEFAULT false,
  breach_notification_sent_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  resolution_time_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_system_alerts_priority_score ON system_alerts(priority_score DESC);
CREATE INDEX IF NOT EXISTS idx_system_alerts_correlation_group ON system_alerts(correlation_group_id);
CREATE INDEX IF NOT EXISTS idx_system_alerts_time_window ON system_alerts(time_window_start, time_window_end);
CREATE INDEX IF NOT EXISTS idx_alert_correlation_groups_status ON alert_correlation_groups(status);
CREATE INDEX IF NOT EXISTS idx_alert_correlation_groups_entity ON alert_correlation_groups(affected_entity_type, affected_entity_id);
CREATE INDEX IF NOT EXISTS idx_quick_action_executions_alert ON quick_action_executions(alert_id);
CREATE INDEX IF NOT EXISTS idx_quick_action_executions_incident ON quick_action_executions(incident_id);
CREATE INDEX IF NOT EXISTS idx_compliance_escalation_executions_status ON compliance_escalation_executions(status);
CREATE INDEX IF NOT EXISTS idx_compliance_escalation_executions_sla ON compliance_escalation_executions(sla_status);
CREATE INDEX IF NOT EXISTS idx_sla_tracking_entity ON sla_tracking(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_sla_tracking_status ON sla_tracking(sla_status);

-- Insert default quick action templates
INSERT INTO quick_action_templates (action_name, action_type, action_config, icon, color, requires_confirmation, requires_reason) VALUES
('Mark as False Positive', 'dispute_resolution', '{"action": "mark_false_positive", "update_effectiveness": true}'::jsonb, 'XCircle', 'red', true, true),
('Suspend User Account', 'user_management', '{"action": "suspend_user", "duration_hours": 24}'::jsonb, 'UserX', 'orange', true, true),
('Pause Election', 'election_control', '{"action": "pause_election", "notify_participants": true}'::jsonb, 'Pause', 'yellow', true, true),
('Escalate to Compliance', 'compliance_action', '{"action": "escalate_compliance", "notify_stakeholders": true}'::jsonb, 'AlertTriangle', 'purple', true, false),
('Resolve Alert', 'dispute_resolution', '{"action": "resolve_alert", "close_related": false}'::jsonb, 'CheckCircle', 'green', false, true),
('Block IP Address', 'user_management', '{"action": "block_ip", "duration_hours": 48}'::jsonb, 'Shield', 'red', true, true),
('Refund Transaction', 'dispute_resolution', '{"action": "refund_transaction", "notify_user": true}'::jsonb, 'DollarSign', 'blue', true, true),
('Assign to Team', 'dispute_resolution', '{"action": "assign_team", "team": "security"}'::jsonb, 'Users', 'indigo', false, false)
ON CONFLICT DO NOTHING;

-- Insert default compliance escalation workflows
INSERT INTO compliance_escalation_workflows (workflow_name, trigger_type, trigger_config, escalation_path, notification_channels, sla_hours) VALUES
('Financial Threshold Breach', 'financial_threshold', '{"threshold_amount": 10000, "currency": "USD", "time_window_hours": 24}'::jsonb, '[{"level": 1, "stakeholders": ["compliance_officer"], "delay_minutes": 0}, {"level": 2, "stakeholders": ["executive_team"], "delay_minutes": 60}]'::jsonb, '{email, sms}'::TEXT[], 4),
('Regulatory Deadline Alert', 'deadline_based', '{"days_before_deadline": 7}'::jsonb, '[{"level": 1, "stakeholders": ["compliance_officer"], "delay_minutes": 0}, {"level": 2, "stakeholders": ["board"], "delay_minutes": 1440}]'::jsonb, '{email}'::TEXT[], 48),
('Critical Fraud Detection', 'event_based', '{"event_type": "fraud_detection", "severity": "critical"}'::jsonb, '[{"level": 1, "stakeholders": ["security_team", "compliance_officer"], "delay_minutes": 0}, {"level": 2, "stakeholders": ["executive_team"], "delay_minutes": 30}]'::jsonb, '{email, sms, in_app}'::TEXT[], 2),
('Monthly Compliance Report', 'periodic', '{"frequency": "monthly", "day_of_month": 1}'::jsonb, '[{"level": 1, "stakeholders": ["regulators", "board"], "delay_minutes": 0}]'::jsonb, '{email}'::TEXT[], 168)
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE alert_correlation_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_action_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_action_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_escalation_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_escalation_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sla_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Admin-only access)
CREATE POLICY "Admin full access to alert_correlation_groups" ON alert_correlation_groups FOR ALL USING (true);
CREATE POLICY "Admin full access to quick_action_templates" ON quick_action_templates FOR ALL USING (true);
CREATE POLICY "Admin full access to quick_action_executions" ON quick_action_executions FOR ALL USING (true);
CREATE POLICY "Admin full access to compliance_escalation_workflows" ON compliance_escalation_workflows FOR ALL USING (true);
CREATE POLICY "Admin full access to compliance_escalation_executions" ON compliance_escalation_executions FOR ALL USING (true);
CREATE POLICY "Admin full access to sla_tracking" ON sla_tracking FOR ALL USING (true);

DO $$
BEGIN
  RAISE NOTICE 'Enhanced alert management migration completed successfully!';
END $$;