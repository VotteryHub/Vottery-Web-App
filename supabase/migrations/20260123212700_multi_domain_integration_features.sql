-- Multi-Domain Integration Features Migration
-- Real-Time Brand Alerts, Shaped AI Sync, Creator Earnings, Cross-Domain Threat Correlation, API Performance, Claude AI Fraud Detection

-- Brand Alert Logs Table
CREATE TABLE IF NOT EXISTS brand_alert_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES sponsored_elections(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('budget_threshold', 'performance', 'engagement', 'conversion')),
  threshold INTEGER NOT NULL,
  slack_status TEXT CHECK (slack_status IN ('delivered', 'failed', 'pending')),
  discord_status TEXT CHECK (discord_status IN ('delivered', 'failed', 'pending')),
  alert_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_brand_alert_logs_campaign ON brand_alert_logs(campaign_id);
CREATE INDEX idx_brand_alert_logs_created ON brand_alert_logs(created_at DESC);

-- Brand Alert Configurations Table
CREATE TABLE IF NOT EXISTS brand_alert_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slack_webhook_url TEXT,
  discord_webhook_url TEXT,
  budget_threshold INTEGER DEFAULT 90,
  enable_slack BOOLEAN DEFAULT true,
  enable_discord BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Shaped AI Sync Logs Table
CREATE TABLE IF NOT EXISTS shaped_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  events_processed INTEGER DEFAULT 0,
  duration INTEGER,
  status TEXT CHECK (status IN ('success', 'failed', 'partial')),
  shaped_response JSONB,
  error TEXT,
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_shaped_sync_logs_synced ON shaped_sync_logs(synced_at DESC);

-- Add shaped_synced_at column to votes table if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'votes' AND column_name = 'shaped_synced_at') THEN
    ALTER TABLE votes ADD COLUMN shaped_synced_at TIMESTAMPTZ;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_votes_shaped_synced ON votes(shaped_synced_at) WHERE shaped_synced_at IS NULL;

-- Creator Earnings Transactions Table
CREATE TABLE IF NOT EXISTS creator_earnings_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('payment_received', 'transfer', 'payout', 'refund')),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  stripe_payment_intent_id TEXT,
  stripe_transfer_id TEXT,
  stripe_payout_id TEXT,
  status TEXT CHECK (status IN ('completed', 'processing', 'failed', 'pending')),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_creator_earnings_type ON creator_earnings_transactions(transaction_type);
CREATE INDEX idx_creator_earnings_status ON creator_earnings_transactions(status);
CREATE INDEX idx_creator_earnings_created ON creator_earnings_transactions(created_at DESC);

-- Stripe Webhook Logs Table
CREATE TABLE IF NOT EXISTS stripe_webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  event_id TEXT NOT NULL,
  status TEXT CHECK (status IN ('processed', 'failed', 'pending')),
  data JSONB,
  received_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id)
);

CREATE INDEX idx_stripe_webhook_logs_event_type ON stripe_webhook_logs(event_type);
CREATE INDEX idx_stripe_webhook_logs_received ON stripe_webhook_logs(received_at DESC);

-- Add stripe_payout_id to prize_redemptions if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'prize_redemptions' AND column_name = 'stripe_payout_id') THEN
    ALTER TABLE prize_redemptions ADD COLUMN stripe_payout_id TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'prize_redemptions' AND column_name = 'failure_reason') THEN
    ALTER TABLE prize_redemptions ADD COLUMN failure_reason TEXT;
  END IF;
END $$;

-- Cross-Domain Threat Analyses Table
CREATE TABLE IF NOT EXISTS cross_domain_threat_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  overall_threat_level TEXT CHECK (overall_threat_level IN ('critical', 'high', 'medium', 'low')),
  cross_zone_correlations JSONB,
  emerging_threats JSONB,
  zone_vulnerabilities JSONB,
  compliance_alerts JSONB,
  predictive_forecasting JSONB,
  mitigation_strategies JSONB,
  confidence DECIMAL(3, 2),
  reasoning TEXT,
  analyzed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cross_domain_threat_analyzed ON cross_domain_threat_analyses(analyzed_at DESC);
CREATE INDEX idx_cross_domain_threat_level ON cross_domain_threat_analyses(overall_threat_level);

-- Gamified Fraud Analyses Table
CREATE TABLE IF NOT EXISTS gamified_fraud_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID REFERENCES elections(id) ON DELETE CASCADE,
  fraud_score INTEGER CHECK (fraud_score >= 0 AND fraud_score <= 100),
  risk_level TEXT CHECK (risk_level IN ('critical', 'high', 'medium', 'low')),
  suspicious_clusters JSONB,
  manipulation_indicators JSONB,
  organized_fraud_attempts JSONB,
  bot_activity_score INTEGER CHECK (bot_activity_score >= 0 AND bot_activity_score <= 100),
  account_farming_indicators JSONB,
  sybil_attack_probability INTEGER CHECK (sybil_attack_probability >= 0 AND sybil_attack_probability <= 100),
  recommendations JSONB,
  confidence DECIMAL(3, 2),
  reasoning TEXT,
  analyzed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_gamified_fraud_election ON gamified_fraud_analyses(election_id);
CREATE INDEX idx_gamified_fraud_analyzed ON gamified_fraud_analyses(analyzed_at DESC);
CREATE INDEX idx_gamified_fraud_score ON gamified_fraud_analyses(fraud_score DESC);

-- Add alert_sent_at to sponsored_elections if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sponsored_elections' AND column_name = 'alert_sent_at') THEN
    ALTER TABLE sponsored_elections ADD COLUMN alert_sent_at TIMESTAMPTZ;
  END IF;
END $$;

-- RLS Policies
ALTER TABLE brand_alert_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_alert_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE shaped_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_earnings_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cross_domain_threat_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamified_fraud_analyses ENABLE ROW LEVEL SECURITY;

-- Brand Alert Logs Policies
CREATE POLICY "Users can view their brand alert logs"
  ON brand_alert_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sponsored_elections se
      WHERE se.id = brand_alert_logs.campaign_id
      AND se.brand_id = auth.uid()
    )
  );

CREATE POLICY "System can insert brand alert logs"
  ON brand_alert_logs FOR INSERT
  WITH CHECK (true);

-- Brand Alert Configurations Policies
CREATE POLICY "Users can view their alert configurations"
  ON brand_alert_configurations FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their alert configurations"
  ON brand_alert_configurations FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their alert configurations"
  ON brand_alert_configurations FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Shaped Sync Logs Policies (Admin only)
CREATE POLICY "Admins can view shaped sync logs"
  ON shaped_sync_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "System can insert shaped sync logs"
  ON shaped_sync_logs FOR INSERT
  WITH CHECK (true);

-- Creator Earnings Transactions Policies
CREATE POLICY "Users can view all creator earnings transactions"
  ON creator_earnings_transactions FOR SELECT
  USING (true);

CREATE POLICY "System can insert creator earnings transactions"
  ON creator_earnings_transactions FOR INSERT
  WITH CHECK (true);

-- Stripe Webhook Logs Policies (Admin only)
CREATE POLICY "Admins can view stripe webhook logs"
  ON stripe_webhook_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "System can insert stripe webhook logs"
  ON stripe_webhook_logs FOR INSERT
  WITH CHECK (true);

-- Cross-Domain Threat Analyses Policies (Admin only)
CREATE POLICY "Admins can view cross-domain threat analyses"
  ON cross_domain_threat_analyses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "System can insert cross-domain threat analyses"
  ON cross_domain_threat_analyses FOR INSERT
  WITH CHECK (true);

-- Gamified Fraud Analyses Policies
CREATE POLICY "Election creators can view fraud analyses for their elections"
  ON gamified_fraud_analyses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM elections e
      WHERE e.id = gamified_fraud_analyses.election_id
      AND e.created_by = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "System can insert gamified fraud analyses"
  ON gamified_fraud_analyses FOR INSERT
  WITH CHECK (true);

-- Success notification
DO $$
BEGIN
  RAISE NOTICE 'Multi-domain integration features migration completed successfully';
END $$;
