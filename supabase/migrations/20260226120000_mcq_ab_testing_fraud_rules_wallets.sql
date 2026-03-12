-- MCQ A/B Test Variants
CREATE TABLE IF NOT EXISTS public.mcq_ab_test_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id TEXT NOT NULL,
  test_name TEXT NOT NULL,
  variant_label TEXT NOT NULL CHECK (variant_label IN ('A', 'B')),
  question_text TEXT,
  options JSONB,
  difficulty TEXT DEFAULT 'medium',
  image_url TEXT,
  traffic_percent INTEGER DEFAULT 50,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'concluded', 'paused')),
  winner BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MCQ A/B Test Responses
CREATE TABLE IF NOT EXISTS public.mcq_ab_test_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id TEXT NOT NULL,
  voter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  variant_label TEXT NOT NULL CHECK (variant_label IN ('A', 'B')),
  is_correct BOOLEAN DEFAULT FALSE,
  response_time_ms INTEGER,
  responded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fraud Prevention Rules
CREATE TABLE IF NOT EXISTS public.fraud_prevention_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('rate_limiting', 'ip_blocking', 'auth_requirement', 'behavioral')),
  description TEXT,
  configuration JSONB,
  rationale TEXT,
  expected_effectiveness INTEGER,
  false_positive_risk TEXT DEFAULT 'medium' CHECK (false_positive_risk IN ('low', 'medium', 'high')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  status TEXT DEFAULT 'pending_approval' CHECK (status IN ('pending_approval', 'approved', 'rejected', 'active')),
  generated_by TEXT DEFAULT 'claude_ai',
  admin_notes TEXT,
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Wallets (Web3 Auth)
CREATE TABLE IF NOT EXISTS public.user_wallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  wallet_type TEXT DEFAULT 'metamask' CHECK (wallet_type IN ('metamask', 'walletconnect', 'coinbase', 'other')),
  chain_id TEXT,
  signature TEXT,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  disconnected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, wallet_address)
);

-- MCQ Alert Logs
CREATE TABLE IF NOT EXISTS public.mcq_alert_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('sync_failure', 'accuracy_drop', 'sentiment_spike')),
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  message TEXT NOT NULL,
  threshold_value NUMERIC,
  actual_value NUMERIC,
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ
);

-- RLS Policies
ALTER TABLE public.mcq_ab_test_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcq_ab_test_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_prevention_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcq_alert_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mcq_ab_test_variants' AND policyname = 'mcq_ab_variants_all') THEN
    CREATE POLICY mcq_ab_variants_all ON public.mcq_ab_test_variants FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mcq_ab_test_responses' AND policyname = 'mcq_ab_responses_all') THEN
    CREATE POLICY mcq_ab_responses_all ON public.mcq_ab_test_responses FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'fraud_prevention_rules' AND policyname = 'fraud_rules_all') THEN
    CREATE POLICY fraud_rules_all ON public.fraud_prevention_rules FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_wallets' AND policyname = 'user_wallets_own') THEN
    CREATE POLICY user_wallets_own ON public.user_wallets FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mcq_alert_logs' AND policyname = 'mcq_alert_logs_all') THEN
    CREATE POLICY mcq_alert_logs_all ON public.mcq_alert_logs FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
