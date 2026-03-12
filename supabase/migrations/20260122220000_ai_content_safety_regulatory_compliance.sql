-- AI Content Safety Screening Tables
CREATE TABLE IF NOT EXISTS public.content_screening_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('election_question', 'election_description', 'campaign_content', 'user_post', 'comment')),
  content_text TEXT NOT NULL,
  content_metadata JSONB DEFAULT '{}'::jsonb,
  source_entity_type TEXT,
  source_entity_id UUID,
  submitted_by UUID REFERENCES public.user_profiles(id),
  screening_status TEXT DEFAULT 'pending' CHECK (screening_status IN ('pending', 'approved', 'flagged', 'blocked', 'under_review')),
  ai_analysis_result JSONB,
  policy_violations JSONB DEFAULT '[]'::jsonb,
  risk_score NUMERIC(5,2) DEFAULT 0.00,
  confidence_score NUMERIC(5,2),
  flagged_keywords TEXT[],
  recommended_action TEXT,
  reviewed_by UUID REFERENCES public.user_profiles(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_content_screening_status ON public.content_screening_queue(screening_status);
CREATE INDEX idx_content_screening_risk ON public.content_screening_queue(risk_score DESC);
CREATE INDEX idx_content_screening_created ON public.content_screening_queue(created_at DESC);

-- Content Safety Policies
CREATE TABLE IF NOT EXISTS public.content_safety_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_name TEXT NOT NULL UNIQUE,
  policy_type TEXT NOT NULL CHECK (policy_type IN ('prohibited_content', 'restricted_keywords', 'hate_speech', 'misinformation', 'spam', 'violence', 'adult_content')),
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  detection_rules JSONB NOT NULL DEFAULT '{}'::jsonb,
  auto_action TEXT DEFAULT 'flag' CHECK (auto_action IN ('flag', 'block', 'review', 'allow_with_warning')),
  is_enabled BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ML Model Performance Tracking
CREATE TABLE IF NOT EXISTS public.ml_model_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name TEXT NOT NULL,
  model_version TEXT NOT NULL,
  accuracy_rate NUMERIC(5,2) DEFAULT 0.00,
  precision_rate NUMERIC(5,2) DEFAULT 0.00,
  recall_rate NUMERIC(5,2) DEFAULT 0.00,
  f1_score NUMERIC(5,2) DEFAULT 0.00,
  false_positive_rate NUMERIC(5,2) DEFAULT 0.00,
  false_negative_rate NUMERIC(5,2) DEFAULT 0.00,
  total_predictions INTEGER DEFAULT 0,
  correct_predictions INTEGER DEFAULT 0,
  evaluation_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Incident Response Workflows
CREATE TABLE IF NOT EXISTS public.incident_response_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_type TEXT NOT NULL CHECK (incident_type IN ('fraud_detection', 'coordinated_attack', 'account_compromise', 'payment_fraud', 'policy_violation', 'security_breach')),
  threat_level TEXT DEFAULT 'medium' CHECK (threat_level IN ('critical', 'high', 'medium', 'low')),
  status TEXT DEFAULT 'detected' CHECK (status IN ('detected', 'escalated', 'in_progress', 'resolved', 'dismissed')),
  title TEXT NOT NULL,
  description TEXT,
  threat_intelligence JSONB,
  affected_entities JSONB DEFAULT '[]'::jsonb,
  automated_actions_taken JSONB DEFAULT '[]'::jsonb,
  escalation_level INTEGER DEFAULT 1,
  assigned_to UUID REFERENCES public.user_profiles(id),
  stakeholders_notified JSONB DEFAULT '[]'::jsonb,
  remediation_steps JSONB DEFAULT '[]'::jsonb,
  remediation_status TEXT DEFAULT 'pending',
  evidence_collected JSONB DEFAULT '[]'::jsonb,
  timeline_events JSONB DEFAULT '[]'::jsonb,
  response_effectiveness_score NUMERIC(5,2),
  detected_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  escalated_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_incident_status ON public.incident_response_workflows(status);
CREATE INDEX idx_incident_threat_level ON public.incident_response_workflows(threat_level);
CREATE INDEX idx_incident_detected ON public.incident_response_workflows(detected_at DESC);

-- Advertiser Campaign Metrics
CREATE TABLE IF NOT EXISTS public.advertiser_campaign_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID,
  advertiser_id UUID REFERENCES public.user_profiles(id),
  metric_type TEXT NOT NULL CHECK (metric_type IN ('impressions', 'clicks', 'conversions', 'engagement_rate', 'roi', 'ctr', 'cpc', 'cpm', 'cost_per_conversion')),
  metric_value NUMERIC(12,2) NOT NULL,
  time_period TEXT DEFAULT '1h' CHECK (time_period IN ('1h', '24h', '7d', '30d', 'custom')),
  zone_breakdown JSONB DEFAULT '{}'::jsonb,
  demographic_breakdown JSONB DEFAULT '{}'::jsonb,
  device_breakdown JSONB DEFAULT '{}'::jsonb,
  performance_trend TEXT CHECK (performance_trend IN ('increasing', 'decreasing', 'stable', 'volatile')),
  optimization_recommendations JSONB DEFAULT '[]'::jsonb,
  timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_campaign_metrics_campaign ON public.advertiser_campaign_metrics(campaign_id);
CREATE INDEX idx_campaign_metrics_advertiser ON public.advertiser_campaign_metrics(advertiser_id);
CREATE INDEX idx_campaign_metrics_timestamp ON public.advertiser_campaign_metrics(timestamp DESC);

-- Resend Submission Logs
CREATE TABLE IF NOT EXISTS public.resend_submission_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_type TEXT NOT NULL CHECK (submission_type IN ('regulatory_filing', 'compliance_report', 'audit_trail', 'incident_report', 'performance_report')),
  filing_id UUID,
  jurisdiction TEXT NOT NULL,
  regulatory_authority TEXT NOT NULL,
  recipients JSONB NOT NULL DEFAULT '[]'::jsonb,
  email_subject TEXT NOT NULL,
  email_content TEXT,
  attachment_urls JSONB DEFAULT '[]'::jsonb,
  delivery_status TEXT DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
  resend_message_id TEXT,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  audit_trail JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_resend_logs_status ON public.resend_submission_logs(delivery_status);
CREATE INDEX idx_resend_logs_jurisdiction ON public.resend_submission_logs(jurisdiction);
CREATE INDEX idx_resend_logs_created ON public.resend_submission_logs(created_at DESC);

-- RLS Policies
ALTER TABLE public.content_screening_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_safety_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_model_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_response_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertiser_campaign_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resend_submission_logs ENABLE ROW LEVEL SECURITY;

-- Admin-only access policies
CREATE POLICY "Admin full access to content screening" ON public.content_screening_queue
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admin full access to safety policies" ON public.content_safety_policies
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admin full access to ML performance" ON public.ml_model_performance
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admin full access to incidents" ON public.incident_response_workflows
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Advertisers view own campaign metrics" ON public.advertiser_campaign_metrics
  FOR SELECT USING (advertiser_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role IN ('admin', 'moderator')
  ));

CREATE POLICY "Admin full access to resend logs" ON public.resend_submission_logs
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Insert default content safety policies
INSERT INTO public.content_safety_policies (policy_name, policy_type, severity, detection_rules, auto_action) VALUES
('Hate Speech Detection', 'hate_speech', 'critical', '{"keywords": ["offensive terms"], "patterns": ["discriminatory language"]}', 'block'),
('Misinformation Prevention', 'misinformation', 'high', '{"fact_check_required": true, "source_verification": true}', 'review'),
('Spam Content Filter', 'spam', 'medium', '{"repetitive_content": true, "link_density": 0.3}', 'flag'),
('Violence and Threats', 'violence', 'critical', '{"threat_detection": true, "violence_keywords": true}', 'block'),
('Adult Content Filter', 'adult_content', 'high', '{"explicit_content": true, "age_restricted": true}', 'block');

DO $$
BEGIN
  RAISE NOTICE 'AI content safety, incident response, advertiser metrics, and Resend regulatory compliance tables created successfully';
END $$;