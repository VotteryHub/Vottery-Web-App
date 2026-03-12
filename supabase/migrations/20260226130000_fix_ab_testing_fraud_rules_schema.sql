-- Fix MCQ A/B Test Variants table to match service layer column names
CREATE TABLE IF NOT EXISTS public.mcq_ab_test_variants_v2 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id TEXT NOT NULL,
  variant_name TEXT NOT NULL DEFAULT 'Variant B',
  variant_type TEXT NOT NULL DEFAULT 'question_text' CHECK (variant_type IN ('question_text', 'options', 'difficulty', 'image')),
  variant_question_text TEXT,
  variant_options JSONB,
  variant_difficulty TEXT DEFAULT 'medium' CHECK (variant_difficulty IN ('easy', 'medium', 'hard')),
  variant_image_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'winner', 'concluded')),
  promoted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drop old table if it exists and rename v2 to the correct name
DO $$ BEGIN
  -- If old table exists with wrong schema, drop it
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'mcq_ab_test_variants'
    AND column_name = 'variant_label'
    AND table_schema = 'public'
  ) THEN
    DROP TABLE IF EXISTS public.mcq_ab_test_variants CASCADE;
  END IF;
END $$;

-- Rename v2 to final name if it doesn't already exist with correct schema
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'mcq_ab_test_variants'
    AND column_name = 'variant_name'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE IF EXISTS public.mcq_ab_test_variants_v2 RENAME TO mcq_ab_test_variants;
  ELSE
    DROP TABLE IF EXISTS public.mcq_ab_test_variants_v2;
  END IF;
END $$;

-- MCQ A/B Test Responses - fix column names
CREATE TABLE IF NOT EXISTS public.mcq_ab_test_responses_v2 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  variant_id UUID,
  question_id TEXT NOT NULL,
  voter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_correct BOOLEAN DEFAULT FALSE,
  response_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'mcq_ab_test_responses'
    AND column_name = 'variant_label'
    AND table_schema = 'public'
  ) THEN
    DROP TABLE IF EXISTS public.mcq_ab_test_responses CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'mcq_ab_test_responses'
    AND column_name = 'variant_id'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE IF EXISTS public.mcq_ab_test_responses_v2 RENAME TO mcq_ab_test_responses;
  ELSE
    DROP TABLE IF EXISTS public.mcq_ab_test_responses_v2;
  END IF;
END $$;

-- Fix Fraud Prevention Rules table to match service layer column names
CREATE TABLE IF NOT EXISTS public.fraud_prevention_rules_v2 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('rate_limiting', 'ip_blocking', 'auth_requirement', 'transaction_blocking', 'behavioral')),
  description TEXT,
  condition_expression TEXT,
  action TEXT,
  threshold_value NUMERIC,
  threshold_unit TEXT,
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  estimated_effectiveness INTEGER,
  rationale TEXT,
  status TEXT DEFAULT 'pending_approval' CHECK (status IN ('pending_approval', 'approved', 'rejected', 'active')),
  rejection_reason TEXT,
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fraud_prevention_rules'
    AND column_name = 'configuration'
    AND table_schema = 'public'
  ) THEN
    DROP TABLE IF EXISTS public.fraud_prevention_rules CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fraud_prevention_rules'
    AND column_name = 'condition_expression'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE IF EXISTS public.fraud_prevention_rules_v2 RENAME TO fraud_prevention_rules;
  ELSE
    DROP TABLE IF EXISTS public.fraud_prevention_rules_v2;
  END IF;
END $$;

-- Enable RLS on corrected tables
ALTER TABLE IF EXISTS public.mcq_ab_test_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mcq_ab_test_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.fraud_prevention_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mcq_ab_test_variants' AND policyname = 'mcq_ab_variants_all_v2') THEN
    CREATE POLICY mcq_ab_variants_all_v2 ON public.mcq_ab_test_variants FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mcq_ab_test_responses' AND policyname = 'mcq_ab_responses_all_v2') THEN
    CREATE POLICY mcq_ab_responses_all_v2 ON public.mcq_ab_test_responses FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'fraud_prevention_rules' AND policyname = 'fraud_rules_all_v2') THEN
    CREATE POLICY fraud_rules_all_v2 ON public.fraud_prevention_rules FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
