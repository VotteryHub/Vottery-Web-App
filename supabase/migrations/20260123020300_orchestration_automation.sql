-- Intelligent Orchestration & Automation Layer Migration
-- Timestamp: 20260123020300

-- Automation Workflow Types
CREATE TYPE public.workflow_trigger_type AS ENUM (
  'fraud_detection',
  'financial_threshold',
  'compliance_deadline',
  'incident_escalation',
  'optimization_opportunity'
);

CREATE TYPE public.workflow_status AS ENUM (
  'active',
  'paused',
  'completed',
  'failed',
  'cancelled'
);

CREATE TYPE public.action_status AS ENUM (
  'pending',
  'executing',
  'completed',
  'failed',
  'skipped'
);

-- Orchestration Workflows Table
CREATE TABLE public.orchestration_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_name TEXT NOT NULL,
  workflow_type public.workflow_trigger_type NOT NULL,
  trigger_conditions JSONB NOT NULL DEFAULT '{}'::jsonb,
  automated_actions JSONB NOT NULL DEFAULT '[]'::jsonb,
  status public.workflow_status DEFAULT 'active'::public.workflow_status,
  priority INTEGER DEFAULT 5,
  execution_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  last_executed_at TIMESTAMPTZ,
  next_execution_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Workflow Execution Logs
CREATE TABLE public.workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES public.orchestration_workflows(id) ON DELETE CASCADE,
  trigger_source TEXT NOT NULL,
  trigger_data JSONB DEFAULT '{}'::jsonb,
  status public.action_status DEFAULT 'pending'::public.action_status,
  actions_executed JSONB DEFAULT '[]'::jsonb,
  execution_duration_ms INTEGER,
  error_message TEXT,
  performance_metrics JSONB DEFAULT '{}'::jsonb,
  started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMPTZ
);

-- Compliance Automation Triggers
CREATE TABLE public.compliance_automation_triggers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger_name TEXT NOT NULL,
  jurisdiction TEXT NOT NULL,
  regulatory_authority TEXT NOT NULL,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('financial_threshold', 'deadline_based', 'event_based', 'periodic')),
  threshold_config JSONB DEFAULT '{}'::jsonb,
  submission_template JSONB NOT NULL,
  stakeholder_groups JSONB DEFAULT '[]'::jsonb,
  is_enabled BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  next_trigger_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Incident Communication Logs
CREATE TABLE public.incident_communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES public.incident_response_workflows(id) ON DELETE CASCADE,
  communication_type TEXT NOT NULL CHECK (communication_type IN ('email', 'sms', 'in_app', 'webhook')),
  recipient_type TEXT NOT NULL CHECK (recipient_type IN ('administrator', 'investigator', 'affected_user', 'stakeholder', 'regulatory_authority')),
  recipients JSONB NOT NULL DEFAULT '[]'::jsonb,
  message_subject TEXT,
  message_content TEXT NOT NULL,
  delivery_status TEXT DEFAULT 'pending'::TEXT CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
  resend_message_id TEXT,
  twilio_message_sid TEXT,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Optimization Actions Log
CREATE TABLE public.optimization_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type TEXT NOT NULL CHECK (action_type IN ('budget_reallocation', 'campaign_adjustment', 'fraud_prevention', 'performance_optimization')),
  trigger_source TEXT NOT NULL,
  trigger_data JSONB DEFAULT '{}'::jsonb,
  action_details JSONB NOT NULL,
  before_state JSONB,
  after_state JSONB,
  performance_impact JSONB DEFAULT '{}'::jsonb,
  status public.action_status DEFAULT 'pending'::public.action_status,
  executed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Stakeholder Communication Preferences
CREATE TABLE public.stakeholder_communication_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stakeholder_group_id UUID REFERENCES public.stakeholder_groups(id) ON DELETE CASCADE,
  incident_severity TEXT NOT NULL CHECK (incident_severity IN ('critical', 'high', 'medium', 'low')),
  email_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  in_app_enabled BOOLEAN DEFAULT true,
  webhook_enabled BOOLEAN DEFAULT false,
  notification_delay_minutes INTEGER DEFAULT 0,
  escalation_rules JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX idx_orchestration_workflows_status ON public.orchestration_workflows(status);
CREATE INDEX idx_orchestration_workflows_type ON public.orchestration_workflows(workflow_type);
CREATE INDEX idx_workflow_executions_workflow_id ON public.workflow_executions(workflow_id);
CREATE INDEX idx_workflow_executions_status ON public.workflow_executions(status);
CREATE INDEX idx_compliance_triggers_jurisdiction ON public.compliance_automation_triggers(jurisdiction);
CREATE INDEX idx_incident_communications_incident_id ON public.incident_communications(incident_id);
CREATE INDEX idx_incident_communications_status ON public.incident_communications(delivery_status);
CREATE INDEX idx_optimization_actions_type ON public.optimization_actions(action_type);
CREATE INDEX idx_optimization_actions_status ON public.optimization_actions(status);

-- Enable RLS
ALTER TABLE public.orchestration_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_automation_triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.optimization_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakeholder_communication_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Admin Access)
CREATE POLICY "admin_full_access_orchestration_workflows"
ON public.orchestration_workflows
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
);

CREATE POLICY "admin_full_access_workflow_executions"
ON public.workflow_executions
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
);

CREATE POLICY "admin_full_access_compliance_triggers"
ON public.compliance_automation_triggers
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
);

CREATE POLICY "admin_full_access_incident_communications"
ON public.incident_communications
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
);

CREATE POLICY "admin_full_access_optimization_actions"
ON public.optimization_actions
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
);

CREATE POLICY "admin_full_access_stakeholder_preferences"
ON public.stakeholder_communication_preferences
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
);

-- Mock Data
DO $$
DECLARE
  admin_user_id UUID;
  workflow_id UUID := gen_random_uuid();
  compliance_trigger_id UUID := gen_random_uuid();
  stakeholder_group_id UUID;
BEGIN
  -- Get existing admin user
  SELECT id INTO admin_user_id FROM public.user_profiles WHERE role = 'admin' LIMIT 1;
  SELECT id INTO stakeholder_group_id FROM public.stakeholder_groups LIMIT 1;

  IF admin_user_id IS NOT NULL THEN
    -- Create orchestration workflows
    INSERT INTO public.orchestration_workflows (id, workflow_name, workflow_type, trigger_conditions, automated_actions, status, priority, created_by)
    VALUES
      (workflow_id, 'Critical Fraud Response Automation', 'fraud_detection', 
       '{"threatScore": {"min": 75}, "severity": ["critical", "high"]}'::jsonb,
       '[{"action": "freeze_account", "priority": 1}, {"action": "notify_administrators", "priority": 2}, {"action": "create_incident_report", "priority": 3}]'::jsonb,
       'active', 10, admin_user_id),
      (gen_random_uuid(), 'Financial Threshold Compliance', 'financial_threshold',
       '{"amount": {"min": 100000}, "jurisdiction": "US"}'::jsonb,
       '[{"action": "generate_compliance_report", "priority": 1}, {"action": "submit_to_regulators", "priority": 2}]'::jsonb,
       'active', 8, admin_user_id),
      (gen_random_uuid(), 'Budget Optimization Engine', 'optimization_opportunity',
       '{"roi": {"max": 1.5}, "campaignStatus": "active"}'::jsonb,
       '[{"action": "analyze_performance", "priority": 1}, {"action": "reallocate_budget", "priority": 2}, {"action": "notify_advertisers", "priority": 3}]'::jsonb,
       'active', 5, admin_user_id);

    -- Create workflow executions
    INSERT INTO public.workflow_executions (workflow_id, trigger_source, trigger_data, status, actions_executed, execution_duration_ms, started_at, completed_at)
    VALUES
      (workflow_id, 'perplexity_fraud_detection', '{"threatScore": 85, "userId": "user-123", "incidentType": "coordinated_attack"}'::jsonb,
       'completed', '[{"action": "freeze_account", "status": "completed", "timestamp": "2026-01-23T02:00:00Z"}, {"action": "notify_administrators", "status": "completed", "timestamp": "2026-01-23T02:00:05Z"}]'::jsonb,
       5234, CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '2 hours' + INTERVAL '5 seconds'),
      (workflow_id, 'perplexity_fraud_detection', '{"threatScore": 92, "userId": "user-456", "incidentType": "payment_fraud"}'::jsonb,
       'completed', '[{"action": "freeze_account", "status": "completed"}, {"action": "notify_administrators", "status": "completed"}, {"action": "create_incident_report", "status": "completed"}]'::jsonb,
       7891, CURRENT_TIMESTAMP - INTERVAL '1 hour', CURRENT_TIMESTAMP - INTERVAL '1 hour' + INTERVAL '8 seconds');

    -- Create compliance automation triggers
    INSERT INTO public.compliance_automation_triggers (id, trigger_name, jurisdiction, regulatory_authority, trigger_type, threshold_config, submission_template, stakeholder_groups, is_enabled)
    VALUES
      (compliance_trigger_id, 'US Financial Reporting Threshold', 'United States', 'FinCEN', 'financial_threshold',
       '{"amount": 100000, "currency": "USD", "period": "daily"}'::jsonb,
       '{"reportType": "SAR", "fields": ["transaction_amount", "user_details", "suspicious_activity"]}'::jsonb,
       '["regulators", "executives"]'::jsonb, true),
      (gen_random_uuid(), 'EU GDPR Compliance Check', 'European Union', 'Data Protection Authority', 'periodic',
       '{"frequency": "monthly"}'::jsonb,
       '{"reportType": "GDPR_Compliance", "fields": ["data_processing_activities", "user_consents", "data_breaches"]}'::jsonb,
       '["board", "regulators"]'::jsonb, true);

    -- Create optimization actions
    INSERT INTO public.optimization_actions (action_type, trigger_source, trigger_data, action_details, before_state, after_state, performance_impact, status, executed_by, executed_at)
    VALUES
      ('budget_reallocation', 'ai_recommendation_engine', '{"campaignId": "camp-123", "currentROI": 1.2}'::jsonb,
       '{"action": "reallocate_budget", "fromZone": "zone_3", "toZone": "zone_5", "amount": 5000}'::jsonb,
       '{"zone_3_budget": 20000, "zone_5_budget": 15000}'::jsonb,
       '{"zone_3_budget": 15000, "zone_5_budget": 20000}'::jsonb,
       '{"roiImprovement": 0.3, "conversionIncrease": 15}'::jsonb,
       'completed', admin_user_id, CURRENT_TIMESTAMP - INTERVAL '3 hours'),
      ('fraud_prevention', 'perplexity_threat_intelligence', '{"threatLevel": "high", "affectedUsers": 12}'::jsonb,
       '{"action": "implement_rate_limiting", "targetEndpoint": "/api/votes", "limit": 10}'::jsonb,
       '{"rateLimit": null}'::jsonb,
       '{"rateLimit": {"requests": 10, "window": "1m"}}'::jsonb,
       '{"attacksMitigated": 45, "falsePositives": 2}'::jsonb,
       'completed', admin_user_id, CURRENT_TIMESTAMP - INTERVAL '1 hour');

    -- Create stakeholder communication preferences
    IF stakeholder_group_id IS NOT NULL THEN
      INSERT INTO public.stakeholder_communication_preferences (stakeholder_group_id, incident_severity, email_enabled, sms_enabled, in_app_enabled, notification_delay_minutes, escalation_rules)
      VALUES
        (stakeholder_group_id, 'critical', true, true, true, 0, '{"escalateAfterMinutes": 5, "escalateTo": "executives"}'::jsonb),
        (stakeholder_group_id, 'high', true, false, true, 5, '{"escalateAfterMinutes": 15, "escalateTo": "board"}'::jsonb),
        (stakeholder_group_id, 'medium', true, false, true, 15, '{"escalateAfterMinutes": 60}'::jsonb);
    END IF;

    RAISE NOTICE 'Orchestration automation data created successfully';
  ELSE
    RAISE NOTICE 'No admin user found. Run auth migration first.';
  END IF;
END $$;
