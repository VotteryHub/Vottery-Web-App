-- AI Service Monitoring and Gemini Fallback System
-- Migration: 20260207215000_ai_dependency_risk_mitigation_system.sql

-- AI Service Monitoring Table
CREATE TABLE IF NOT EXISTS ai_service_monitoring (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL CHECK (service_name IN ('openai', 'anthropic', 'perplexity', 'gemini')),
  response_time INTEGER NOT NULL DEFAULT 0,
  error_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  cost_per_query DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
  efficiency_score INTEGER CHECK (efficiency_score >= 0 AND efficiency_score <= 100),
  performance_status TEXT CHECK (performance_status IN ('healthy', 'degraded', 'critical', 'unknown')),
  monitored_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI Service Case Reports Table
CREATE TABLE IF NOT EXISTS ai_service_case_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL CHECK (service_name IN ('openai', 'anthropic', 'perplexity')),
  report_content TEXT NOT NULL,
  metrics JSONB,
  analysis JSONB,
  status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected')),
  admin_decision TEXT CHECK (admin_decision IN ('approved', 'rejected')),
  admin_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI Service Routing Configuration Table
CREATE TABLE IF NOT EXISTS ai_service_routing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL UNIQUE CHECK (service_name IN ('openai', 'anthropic', 'perplexity')),
  active_provider TEXT NOT NULL CHECK (active_provider IN ('openai', 'anthropic', 'perplexity', 'gemini')),
  fallback_provider TEXT CHECK (fallback_provider IN ('openai', 'anthropic', 'perplexity', 'gemini')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_service_monitoring_service_name ON ai_service_monitoring(service_name);
CREATE INDEX IF NOT EXISTS idx_ai_service_monitoring_monitored_at ON ai_service_monitoring(monitored_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_service_monitoring_performance_status ON ai_service_monitoring(performance_status);

CREATE INDEX IF NOT EXISTS idx_ai_service_case_reports_service_name ON ai_service_case_reports(service_name);
CREATE INDEX IF NOT EXISTS idx_ai_service_case_reports_status ON ai_service_case_reports(status);
CREATE INDEX IF NOT EXISTS idx_ai_service_case_reports_created_at ON ai_service_case_reports(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_service_routing_service_name ON ai_service_routing(service_name);

-- RLS Policies
ALTER TABLE ai_service_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_service_case_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_service_routing ENABLE ROW LEVEL SECURITY;

-- Admin-only access for monitoring data
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ai_service_monitoring' 
    AND policyname = 'Admin can view all monitoring data'
  ) THEN
    CREATE POLICY "Admin can view all monitoring data"
      ON ai_service_monitoring
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles
          WHERE user_profiles.id = auth.uid()
          AND user_profiles.role = 'admin'
        )
      );
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ai_service_monitoring' 
    AND policyname = 'System can insert monitoring data'
  ) THEN
    CREATE POLICY "System can insert monitoring data"
      ON ai_service_monitoring
      FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- Admin-only access for case reports
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ai_service_case_reports' 
    AND policyname = 'Admin can view all case reports'
  ) THEN
    CREATE POLICY "Admin can view all case reports"
      ON ai_service_case_reports
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles
          WHERE user_profiles.id = auth.uid()
          AND user_profiles.role = 'admin'
        )
      );
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ai_service_case_reports' 
    AND policyname = 'System can insert case reports'
  ) THEN
    CREATE POLICY "System can insert case reports"
      ON ai_service_case_reports
      FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ai_service_case_reports' 
    AND policyname = 'Admin can update case reports'
  ) THEN
    CREATE POLICY "Admin can update case reports"
      ON ai_service_case_reports
      FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles
          WHERE user_profiles.id = auth.uid()
          AND user_profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- Admin-only access for routing configuration
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ai_service_routing' 
    AND policyname = 'Admin can view routing config'
  ) THEN
    CREATE POLICY "Admin can view routing config"
      ON ai_service_routing
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles
          WHERE user_profiles.id = auth.uid()
          AND user_profiles.role = 'admin'
        )
      );
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ai_service_routing' 
    AND policyname = 'Admin can manage routing config'
  ) THEN
    CREATE POLICY "Admin can manage routing config"
      ON ai_service_routing
      FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles
          WHERE user_profiles.id = auth.uid()
          AND user_profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ai_service_case_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_ai_service_case_reports_updated_at_trigger'
  ) THEN
    CREATE TRIGGER update_ai_service_case_reports_updated_at_trigger
      BEFORE UPDATE ON ai_service_case_reports
      FOR EACH ROW
      EXECUTE FUNCTION update_ai_service_case_reports_updated_at();
  END IF;
END $$;

-- Insert default routing configuration
INSERT INTO ai_service_routing (service_name, active_provider, fallback_provider)
VALUES 
  ('openai', 'openai', 'gemini'),
  ('anthropic', 'anthropic', 'gemini'),
  ('perplexity', 'perplexity', 'gemini')
ON CONFLICT (service_name) DO NOTHING;

-- Insert initial monitoring data for Gemini
INSERT INTO ai_service_monitoring (service_name, response_time, error_rate, cost_per_query, efficiency_score, performance_status)
VALUES 
  ('gemini', 800, 0.5, 0.0005, 95, 'healthy')
ON CONFLICT DO NOTHING;