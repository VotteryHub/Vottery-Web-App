-- API Request Logs Table
CREATE TABLE IF NOT EXISTS api_request_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  method TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  request_body JSONB,
  response_body JSONB,
  status_code INTEGER,
  error_message TEXT,
  response_time INTEGER,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_api_request_logs_user_id ON api_request_logs(user_id);
CREATE INDEX idx_api_request_logs_endpoint ON api_request_logs(endpoint);
CREATE INDEX idx_api_request_logs_timestamp ON api_request_logs(timestamp DESC);

-- Webhook Endpoints Table
CREATE TABLE IF NOT EXISTS webhook_endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] DEFAULT '{}',
  auth_method TEXT DEFAULT 'none' CHECK (auth_method IN ('none', 'api_key', 'signature', 'oauth')),
  auth_credentials JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  retry_config JSONB DEFAULT '{"maxRetries": 3, "retryDelay": 5000, "exponentialBackoff": true}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_webhook_endpoints_user_id ON webhook_endpoints(user_id);
CREATE INDEX idx_webhook_endpoints_is_active ON webhook_endpoints(is_active);

-- Webhook Deliveries Table
CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID NOT NULL REFERENCES webhook_endpoints(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'delivered', 'failed')),
  status_code INTEGER,
  response_body JSONB,
  error_message TEXT,
  response_time INTEGER,
  attempt_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ
);

CREATE INDEX idx_webhook_deliveries_webhook_id ON webhook_deliveries(webhook_id);
CREATE INDEX idx_webhook_deliveries_status ON webhook_deliveries(status);
CREATE INDEX idx_webhook_deliveries_created_at ON webhook_deliveries(created_at DESC);

-- Participation Fee Transactions Table
CREATE TABLE IF NOT EXISTS participation_fee_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  election_id UUID NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_intent_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_participation_fee_transactions_user_id ON participation_fee_transactions(user_id);
CREATE INDEX idx_participation_fee_transactions_election_id ON participation_fee_transactions(election_id);
CREATE INDEX idx_participation_fee_transactions_status ON participation_fee_transactions(status);

-- Manual Payout Requests Table
CREATE TABLE IF NOT EXISTS manual_payout_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prize_distribution_id UUID NOT NULL REFERENCES prize_distributions(id) ON DELETE CASCADE,
  winner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX idx_manual_payout_requests_winner_id ON manual_payout_requests(winner_id);
CREATE INDEX idx_manual_payout_requests_status ON manual_payout_requests(status);

-- RLS Policies for API Request Logs
ALTER TABLE api_request_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own API logs"
  ON api_request_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert API logs"
  ON api_request_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update API logs"
  ON api_request_logs FOR UPDATE
  USING (true);

-- RLS Policies for Webhook Endpoints
ALTER TABLE webhook_endpoints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own webhooks"
  ON webhook_endpoints FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for Webhook Deliveries
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view deliveries for their webhooks"
  ON webhook_deliveries FOR SELECT
  USING (
    webhook_id IN (
      SELECT id FROM webhook_endpoints WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert webhook deliveries"
  ON webhook_deliveries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update webhook deliveries"
  ON webhook_deliveries FOR UPDATE
  USING (true);

-- RLS Policies for Participation Fee Transactions
ALTER TABLE participation_fee_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own participation fee transactions"
  ON participation_fee_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert participation fee transactions"
  ON participation_fee_transactions FOR INSERT
  WITH CHECK (true);

-- RLS Policies for Manual Payout Requests
ALTER TABLE manual_payout_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Winners can view their own payout requests"
  ON manual_payout_requests FOR SELECT
  USING (auth.uid() = winner_id);

CREATE POLICY "System can insert manual payout requests"
  ON manual_payout_requests FOR INSERT
  WITH CHECK (true);

-- Function to clean old API logs (retention: 30 days)
CREATE OR REPLACE FUNCTION clean_old_api_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM api_request_logs
  WHERE timestamp < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean old webhook deliveries (retention: 90 days)
CREATE OR REPLACE FUNCTION clean_old_webhook_deliveries()
RETURNS void AS $$
BEGIN
  DELETE FROM webhook_deliveries
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;