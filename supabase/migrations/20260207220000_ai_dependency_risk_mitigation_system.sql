-- AI Service Performance Monitoring Tables
CREATE TABLE IF NOT EXISTS ai_service_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL CHECK (service_name IN ('openai', 'anthropic', 'perplexity', 'gemini')),
  request_type TEXT,
  response_time INTEGER, -- milliseconds
  cost DECIMAL(10, 6), -- cost per request
  accuracy DECIMAL(5, 4), -- 0-1 scale
  status TEXT CHECK (status IN ('success', 'error', 'timeout')),
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_service_metrics_service ON ai_service_performance_metrics(service_name);
CREATE INDEX idx_ai_service_metrics_created ON ai_service_performance_metrics(created_at DESC);
CREATE INDEX idx_ai_service_metrics_status ON ai_service_performance_metrics(status);

-- AI Service Case Reports
CREATE TABLE IF NOT EXISTS ai_service_case_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL CHECK (service_name IN ('openai', 'anthropic', 'perplexity')),
  report_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  analysis_data JSONB NOT NULL,
  case_report JSONB NOT NULL,
  gemini_recommendation TEXT,
  requesting_takeover BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected', 'implemented')),
  admin_decision TEXT,
  admin_notes TEXT,
  approved_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_case_reports_service ON ai_service_case_reports(service_name);
CREATE INDEX idx_case_reports_status ON ai_service_case_reports(status);
CREATE INDEX idx_case_reports_severity ON ai_service_case_reports(severity);
CREATE INDEX idx_case_reports_created ON ai_service_case_reports(created_at DESC);

-- AI Service Fallback Configuration
CREATE TABLE IF NOT EXISTS ai_service_fallback_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL UNIQUE CHECK (service_name IN ('openai', 'anthropic', 'perplexity')),
  fallback_provider TEXT NOT NULL CHECK (fallback_provider IN ('gemini', 'openai', 'anthropic', 'perplexity')),
  is_active BOOLEAN DEFAULT FALSE,
  activated_by TEXT,
  activation_reason TEXT,
  case_report_id UUID REFERENCES ai_service_case_reports(id),
  activated_at TIMESTAMPTZ,
  deactivated_at TIMESTAMPTZ,
  performance_metrics JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fallback_config_active ON ai_service_fallback_config(is_active);
CREATE INDEX idx_fallback_config_service ON ai_service_fallback_config(service_name);

-- Gemini Monitoring Logs
CREATE TABLE IF NOT EXISTS gemini_monitoring_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  monitoring_cycle_id TEXT NOT NULL,
  results JSONB NOT NULL,
  services_monitored TEXT[] NOT NULL,
  issues_detected INTEGER DEFAULT 0,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_monitoring_logs_timestamp ON gemini_monitoring_logs(timestamp DESC);
CREATE INDEX idx_monitoring_logs_cycle ON gemini_monitoring_logs(monitoring_cycle_id);

-- Multi-AI Consensus Queue (for case report routing)
CREATE TABLE IF NOT EXISTS multi_ai_consensus_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_type TEXT NOT NULL,
  service_name TEXT,
  case_report_id UUID REFERENCES ai_service_case_reports(id),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  metadata JSONB DEFAULT '{}'::jsonb,
  consensus_result JSONB,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_consensus_queue_status ON multi_ai_consensus_queue(status);
CREATE INDEX idx_consensus_queue_priority ON multi_ai_consensus_queue(priority);
CREATE INDEX idx_consensus_queue_created ON multi_ai_consensus_queue(created_at DESC);

-- Admin Alerts for AI Service Issues
CREATE TABLE IF NOT EXISTS admin_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'acknowledged', 'resolved')),
  acknowledged_by UUID REFERENCES auth.users(id),
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admin_alerts_status ON admin_alerts(status);
CREATE INDEX idx_admin_alerts_severity ON admin_alerts(severity);
CREATE INDEX idx_admin_alerts_created ON admin_alerts(created_at DESC);

-- RLS Policies
ALTER TABLE ai_service_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_service_case_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_service_fallback_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE gemini_monitoring_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE multi_ai_consensus_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_alerts ENABLE ROW LEVEL SECURITY;

-- Admin-only access policies
CREATE POLICY "Admin full access to performance metrics" ON ai_service_performance_metrics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin full access to case reports" ON ai_service_case_reports
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin full access to fallback config" ON ai_service_fallback_config
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin full access to monitoring logs" ON gemini_monitoring_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin full access to consensus queue" ON multi_ai_consensus_queue
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin full access to alerts" ON admin_alerts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Function to update fallback config timestamp
CREATE OR REPLACE FUNCTION update_fallback_config_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_fallback_config_timestamp_trigger
  BEFORE UPDATE ON ai_service_fallback_config
  FOR EACH ROW
  EXECUTE FUNCTION update_fallback_config_timestamp();