-- Webhook Configurations Table
CREATE TABLE IF NOT EXISTS webhook_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_url TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('vote.cast', 'draw.completed', 'winner.announced', 'payment.succeeded', 'payment.failed')),
  secret_key TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhook Delivery Logs Table
CREATE TABLE IF NOT EXISTS webhook_delivery_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID REFERENCES webhook_configurations(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status_code INTEGER,
  status TEXT CHECK (status IN ('delivered', 'failed', 'pending')),
  response_body TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Participation Fee Transactions Table
CREATE TABLE IF NOT EXISTS participation_fee_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID REFERENCES elections(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  zone_code TEXT,
  processing_fee DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_webhook_configs_event_type ON webhook_configurations(event_type);
CREATE INDEX idx_webhook_configs_active ON webhook_configurations(is_active);
CREATE INDEX idx_webhook_logs_webhook_id ON webhook_delivery_logs(webhook_id);
CREATE INDEX idx_webhook_logs_status ON webhook_delivery_logs(status);
CREATE INDEX idx_participation_fees_election ON participation_fee_transactions(election_id);
CREATE INDEX idx_participation_fees_user ON participation_fee_transactions(user_id);
CREATE INDEX idx_participation_fees_status ON participation_fee_transactions(status);

-- RLS Policies
ALTER TABLE webhook_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_delivery_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE participation_fee_transactions ENABLE ROW LEVEL SECURITY;

-- Admin-only access for webhook configurations
CREATE POLICY "Admins can manage webhooks" ON webhook_configurations
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Admin-only access for webhook logs
CREATE POLICY "Admins can view webhook logs" ON webhook_delivery_logs
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Users can view their own participation fee transactions
CREATE POLICY "Users can view own participation fees" ON participation_fee_transactions
  FOR SELECT
  USING (user_id = auth.uid());

-- Admins can view all participation fee transactions
CREATE POLICY "Admins can view all participation fees" ON participation_fee_transactions
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_webhook_configs_updated_at
  BEFORE UPDATE ON webhook_configurations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_participation_fees_updated_at
  BEFORE UPDATE ON participation_fee_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DO $$
BEGIN
  RAISE NOTICE 'Gamified API & Webhook System schema created successfully';
END $$;