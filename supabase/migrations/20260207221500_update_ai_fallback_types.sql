-- Ensure base tables exist (in case previous migration wasn't applied)
CREATE TABLE IF NOT EXISTS ai_service_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL CHECK (service_name IN ('openai', 'anthropic', 'perplexity', 'gemini')),
  request_type TEXT,
  response_time INTEGER,
  cost DECIMAL(10, 6),
  accuracy DECIMAL(5, 4),
  status TEXT CHECK (status IN ('success', 'error', 'timeout')),
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS gemini_monitoring_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  monitoring_cycle_id TEXT NOT NULL,
  results JSONB NOT NULL,
  services_monitored TEXT[] NOT NULL,
  issues_detected INTEGER DEFAULT 0,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

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

-- CRITICAL: Add columns to existing tables BEFORE creating views that reference them
-- This ensures columns exist even if tables were created by previous migration

-- Add severity column to case_reports if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ai_service_case_reports' 
    AND column_name = 'severity'
  ) THEN
    ALTER TABLE ai_service_case_reports 
    ADD COLUMN severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical'));
  END IF;
END $$;

-- Add fallback_type to case_reports if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ai_service_case_reports' 
    AND column_name = 'fallback_type'
  ) THEN
    ALTER TABLE ai_service_case_reports 
    ADD COLUMN fallback_type TEXT DEFAULT 'manual' CHECK (fallback_type IN ('automatic', 'manual'));
  END IF;
END $$;

-- Add admin approval columns to case_reports if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ai_service_case_reports' 
    AND column_name = 'admin_approved_by'
  ) THEN
    ALTER TABLE ai_service_case_reports
    ADD COLUMN admin_approved_by UUID REFERENCES auth.users(id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ai_service_case_reports' 
    AND column_name = 'admin_approved_at'
  ) THEN
    ALTER TABLE ai_service_case_reports
    ADD COLUMN admin_approved_at TIMESTAMPTZ;
  END IF;
END $$;

-- Add fallback_type to fallback_config if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ai_service_fallback_config' 
    AND column_name = 'fallback_type'
  ) THEN
    ALTER TABLE ai_service_fallback_config
    ADD COLUMN fallback_type TEXT DEFAULT 'automatic' CHECK (fallback_type IN ('automatic', 'manual'));
  END IF;
END $$;

-- CRITICAL: Ensure case_report column exists before creating views
-- The previous migration may have created the table with 'report_content' instead
DO $$ 
BEGIN
  -- Check if case_report column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ai_service_case_reports' 
    AND column_name = 'case_report'
  ) THEN
    -- Check if report_content exists (from previous migration)
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'ai_service_case_reports' 
      AND column_name = 'report_content'
    ) THEN
      -- Rename report_content to case_report
      ALTER TABLE ai_service_case_reports 
      RENAME COLUMN report_content TO case_report;
      
      -- Change type from TEXT to JSONB if needed
      ALTER TABLE ai_service_case_reports 
      ALTER COLUMN case_report TYPE JSONB USING 
        CASE 
          WHEN case_report::text ~ '^\{.*\}$' OR case_report::text ~ '^\[.*\]$' 
          THEN case_report::jsonb 
          ELSE jsonb_build_object('report', case_report::text)
        END;
    ELSE
      -- Column doesn't exist at all, add it
      ALTER TABLE ai_service_case_reports 
      ADD COLUMN case_report JSONB NOT NULL DEFAULT '{}'::jsonb;
    END IF;
  END IF;
END $$;

-- Ensure analysis_data column exists (required by table definition)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ai_service_case_reports' 
    AND column_name = 'analysis_data'
  ) THEN
    -- Check if 'analysis' column exists (from previous migration)
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'ai_service_case_reports' 
      AND column_name = 'analysis'
    ) THEN
      -- Rename analysis to analysis_data
      ALTER TABLE ai_service_case_reports 
      RENAME COLUMN analysis TO analysis_data;
    ELSE
      -- Add analysis_data column
      ALTER TABLE ai_service_case_reports 
      ADD COLUMN analysis_data JSONB NOT NULL DEFAULT '{}'::jsonb;
    END IF;
  END IF;
END $$;

-- Ensure report_type column exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ai_service_case_reports' 
    AND column_name = 'report_type'
  ) THEN
    ALTER TABLE ai_service_case_reports 
    ADD COLUMN report_type TEXT NOT NULL DEFAULT 'efficiency_issue';
  END IF;
END $$;

-- Ensure gemini_recommendation column exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ai_service_case_reports' 
    AND column_name = 'gemini_recommendation'
  ) THEN
    ALTER TABLE ai_service_case_reports 
    ADD COLUMN gemini_recommendation TEXT;
  END IF;
END $$;

-- Ensure requesting_takeover column exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ai_service_case_reports' 
    AND column_name = 'requesting_takeover'
  ) THEN
    ALTER TABLE ai_service_case_reports 
    ADD COLUMN requesting_takeover BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Ensure approved_at column exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ai_service_case_reports' 
    AND column_name = 'approved_at'
  ) THEN
    ALTER TABLE ai_service_case_reports 
    ADD COLUMN approved_at TIMESTAMPTZ;
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_ai_service_metrics_service ON ai_service_performance_metrics(service_name);
CREATE INDEX IF NOT EXISTS idx_ai_service_metrics_created ON ai_service_performance_metrics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_service_metrics_status ON ai_service_performance_metrics(status);
CREATE INDEX IF NOT EXISTS idx_case_reports_service ON ai_service_case_reports(service_name);
CREATE INDEX IF NOT EXISTS idx_case_reports_status ON ai_service_case_reports(status);
CREATE INDEX IF NOT EXISTS idx_case_reports_severity ON ai_service_case_reports(severity);
CREATE INDEX IF NOT EXISTS idx_case_reports_created ON ai_service_case_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_case_reports_fallback_type ON ai_service_case_reports(fallback_type);
CREATE INDEX IF NOT EXISTS idx_fallback_config_active ON ai_service_fallback_config(is_active);
CREATE INDEX IF NOT EXISTS idx_fallback_config_service ON ai_service_fallback_config(service_name);
CREATE INDEX IF NOT EXISTS idx_monitoring_logs_timestamp ON gemini_monitoring_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_monitoring_logs_cycle ON gemini_monitoring_logs(monitoring_cycle_id);
CREATE INDEX IF NOT EXISTS idx_consensus_queue_status ON multi_ai_consensus_queue(status);
CREATE INDEX IF NOT EXISTS idx_consensus_queue_priority ON multi_ai_consensus_queue(priority);
CREATE INDEX IF NOT EXISTS idx_consensus_queue_created ON multi_ai_consensus_queue(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_alerts_status ON admin_alerts(status);
CREATE INDEX IF NOT EXISTS idx_admin_alerts_severity ON admin_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_admin_alerts_created ON admin_alerts(created_at DESC);

-- Enable RLS
ALTER TABLE ai_service_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_service_case_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_service_fallback_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE gemini_monitoring_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE multi_ai_consensus_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_alerts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin full access to performance metrics" ON ai_service_performance_metrics;
DROP POLICY IF EXISTS "Admin full access to case reports" ON ai_service_case_reports;
DROP POLICY IF EXISTS "Admin full access to fallback config" ON ai_service_fallback_config;
DROP POLICY IF EXISTS "Admin full access to monitoring logs" ON gemini_monitoring_logs;
DROP POLICY IF EXISTS "Admin full access to consensus queue" ON multi_ai_consensus_queue;
DROP POLICY IF EXISTS "Admin full access to alerts" ON admin_alerts;

-- Create admin-only access policies
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

-- Drop existing views before recreating them
DROP VIEW IF EXISTS active_automatic_fallbacks;
DROP VIEW IF EXISTS pending_manual_approvals;

-- Create or replace views (NOW all columns are guaranteed to exist)
CREATE VIEW active_automatic_fallbacks AS
SELECT 
  afc.*,
  acr.case_report,
  acr.severity
FROM ai_service_fallback_config afc
LEFT JOIN ai_service_case_reports acr ON afc.case_report_id = acr.id
WHERE afc.is_active = TRUE 
  AND afc.fallback_type = 'automatic'
ORDER BY afc.activated_at DESC;

CREATE VIEW pending_manual_approvals AS
SELECT 
  acr.*,
  acr.case_report->>'detailed_cost_analysis' as cost_analysis,
  acr.case_report->>'permission_request' as permission_request
FROM ai_service_case_reports acr
WHERE acr.status = 'pending_review'
  AND acr.fallback_type = 'manual'
  AND acr.requesting_takeover = TRUE
ORDER BY 
  CASE acr.severity
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 4
  END,
  acr.created_at DESC;

-- Grant access to views
GRANT SELECT ON active_automatic_fallbacks TO authenticated;
GRANT SELECT ON pending_manual_approvals TO authenticated;

-- Create or replace function for automatic fallback activation
CREATE OR REPLACE FUNCTION auto_activate_fallback_on_critical()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.severity = 'critical' AND NEW.fallback_type = 'automatic' THEN
    INSERT INTO ai_service_fallback_config (
      service_name,
      fallback_provider,
      is_active,
      activation_reason,
      case_report_id,
      fallback_type,
      activated_at
    ) VALUES (
      NEW.service_name,
      'gemini',
      TRUE,
      'automatic_critical_failure',
      NEW.id,
      'automatic',
      NOW()
    )
    ON CONFLICT (service_name) 
    DO UPDATE SET
      is_active = TRUE,
      fallback_provider = 'gemini',
      activation_reason = 'automatic_critical_failure',
      case_report_id = NEW.id,
      fallback_type = 'automatic',
      activated_at = NOW();

    INSERT INTO admin_alerts (
      alert_type,
      severity,
      title,
      message,
      metadata
    ) VALUES (
      'automatic_fallback_activated',
      'critical',
      'AUTOMATIC FALLBACK: ' || NEW.service_name || ' → Gemini',
      'Critical service disruption detected. Gemini has automatically taken over ' || NEW.service_name || ' tasks.',
      jsonb_build_object(
        'service_name', NEW.service_name,
        'case_report_id', NEW.id,
        'fallback_type', 'automatic',
        'timestamp', NOW()
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_auto_activate_fallback ON ai_service_case_reports;
CREATE TRIGGER trigger_auto_activate_fallback
  AFTER INSERT ON ai_service_case_reports
  FOR EACH ROW
  EXECUTE FUNCTION auto_activate_fallback_on_critical();

-- Create or replace function for timestamp updates
CREATE OR REPLACE FUNCTION update_fallback_config_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_fallback_config_timestamp_trigger ON ai_service_fallback_config;
CREATE TRIGGER update_fallback_config_timestamp_trigger
  BEFORE UPDATE ON ai_service_fallback_config
  FOR EACH ROW
  EXECUTE FUNCTION update_fallback_config_timestamp();

-- Update existing records to set fallback_type
UPDATE ai_service_fallback_config
SET fallback_type = 'automatic'
WHERE activation_reason IN ('automatic_service_disruption', 'automatic_critical_failure', 'automatic_api_limitation')
  AND fallback_type IS NULL;

UPDATE ai_service_fallback_config
SET fallback_type = 'manual'
WHERE (activation_reason NOT IN ('automatic_service_disruption', 'automatic_critical_failure', 'automatic_api_limitation')
  OR activation_reason IS NULL)
  AND fallback_type IS NULL;

-- Add comments
COMMENT ON COLUMN ai_service_case_reports.fallback_type IS 'Type of fallback: automatic (service disruption/API limits) or manual (cost/efficiency requiring approval)';
COMMENT ON COLUMN ai_service_fallback_config.fallback_type IS 'Type of fallback activation: automatic or manual';
COMMENT ON COLUMN ai_service_case_reports.admin_approved_by IS 'Admin user who approved the manual takeover request';
COMMENT ON COLUMN ai_service_case_reports.admin_approved_at IS 'Timestamp when admin approved the manual takeover request';