-- MCQ A/B Testing tables
CREATE TABLE IF NOT EXISTS public.mcq_ab_test_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES public.election_mcq_questions(id) ON DELETE CASCADE,
  variant_name TEXT NOT NULL DEFAULT 'Variant B',
  variant_type TEXT NOT NULL DEFAULT 'question_text',
  variant_question_text TEXT,
  variant_options JSONB,
  variant_difficulty TEXT,
  variant_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  promoted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mcq_ab_test_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID REFERENCES public.mcq_ab_test_variants(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.election_mcq_questions(id) ON DELETE CASCADE,
  voter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_correct BOOLEAN,
  response_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fraud Prevention Rules table
CREATE TABLE IF NOT EXISTS public.fraud_prevention_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL,
  description TEXT,
  condition_expression TEXT,
  action TEXT,
  threshold_value NUMERIC,
  threshold_unit TEXT,
  severity TEXT DEFAULT 'medium',
  estimated_effectiveness NUMERIC,
  rationale TEXT,
  rejection_reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending_approval',
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Wallets table for Web3 auth
CREATE TABLE IF NOT EXISTS public.user_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  wallet_type TEXT NOT NULL DEFAULT 'metamask',
  chain_id TEXT,
  signature TEXT,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  disconnected_at TIMESTAMPTZ,
  UNIQUE(user_id, wallet_address)
);

-- System failures table (if not exists)
CREATE TABLE IF NOT EXISTS public.system_failures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  failure_type TEXT,
  severity TEXT DEFAULT 'medium',
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Revenue anomalies table (if not exists)
CREATE TABLE IF NOT EXISTS public.revenue_anomalies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anomaly_type TEXT,
  severity TEXT DEFAULT 'medium',
  amount NUMERIC,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fraud alerts table (if not exists)
CREATE TABLE IF NOT EXISTS public.fraud_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT,
  severity TEXT DEFAULT 'medium',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  description TEXT,
  metadata JSONB,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.mcq_ab_test_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcq_ab_test_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_prevention_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_failures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_alerts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mcq_ab_test_variants' AND policyname = 'mcq_ab_variants_all') THEN
    CREATE POLICY mcq_ab_variants_all ON public.mcq_ab_test_variants FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mcq_ab_test_responses' AND policyname = 'mcq_ab_responses_all') THEN
    CREATE POLICY mcq_ab_responses_all ON public.mcq_ab_test_responses FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'fraud_prevention_rules' AND policyname = 'fraud_rules_all') THEN
    CREATE POLICY fraud_rules_all ON public.fraud_prevention_rules FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_wallets' AND policyname = 'user_wallets_own') THEN
    CREATE POLICY user_wallets_own ON public.user_wallets FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'system_failures' AND policyname = 'system_failures_all') THEN
    CREATE POLICY system_failures_all ON public.system_failures FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'revenue_anomalies' AND policyname = 'revenue_anomalies_all') THEN
    CREATE POLICY revenue_anomalies_all ON public.revenue_anomalies FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'fraud_alerts' AND policyname = 'fraud_alerts_all') THEN
    CREATE POLICY fraud_alerts_all ON public.fraud_alerts FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;
