-- Revenue Split Sandbox Testing System Migration
-- Purpose: Enable isolated testing environment for revenue split scenarios without affecting production data

-- 1. Sandbox Configuration Table
CREATE TABLE IF NOT EXISTS public.revenue_split_sandbox_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sandbox_name TEXT NOT NULL,
  description TEXT,
  creator_percentage NUMERIC(5, 2) NOT NULL CHECK (creator_percentage >= 0 AND creator_percentage <= 100),
  platform_percentage NUMERIC(5, 2) NOT NULL CHECK (platform_percentage >= 0 AND platform_percentage <= 100),
  test_scenario_type TEXT DEFAULT 'morale_booster' CHECK (test_scenario_type IN ('morale_booster', 'strategic_test', 'campaign_preview', 'performance_incentive')),
  target_creator_ids UUID[] DEFAULT ARRAY[]::UUID[],
  test_duration_days INTEGER DEFAULT 7,
  is_active BOOLEAN DEFAULT false,
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_sandbox_percentage_total CHECK (creator_percentage + platform_percentage = 100)
);

-- 2. Sandbox Test Scenarios
CREATE TABLE IF NOT EXISTS public.revenue_split_test_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sandbox_config_id UUID REFERENCES public.revenue_split_sandbox_config(id) ON DELETE CASCADE,
  scenario_name TEXT NOT NULL,
  scenario_description TEXT,
  test_parameters JSONB DEFAULT '{}'::jsonb,
  expected_outcomes JSONB DEFAULT '{}'::jsonb,
  actual_results JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Sandbox Payout Calculations (Test Results)
CREATE TABLE IF NOT EXISTS public.revenue_split_sandbox_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sandbox_config_id UUID REFERENCES public.revenue_split_sandbox_config(id) ON DELETE CASCADE,
  test_scenario_id UUID REFERENCES public.revenue_split_test_scenarios(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  simulated_revenue NUMERIC(12, 2) DEFAULT 0.00,
  creator_earnings NUMERIC(12, 2) DEFAULT 0.00,
  platform_earnings NUMERIC(12, 2) DEFAULT 0.00,
  split_percentage_used NUMERIC(5, 2),
  calculation_metadata JSONB DEFAULT '{}'::jsonb,
  calculated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Sandbox Validation Results
CREATE TABLE IF NOT EXISTS public.revenue_split_sandbox_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sandbox_config_id UUID REFERENCES public.revenue_split_sandbox_config(id) ON DELETE CASCADE,
  validation_type TEXT NOT NULL CHECK (validation_type IN ('percentage_accuracy', 'payout_calculation', 'creator_impact', 'platform_impact', 'comprehensive')),
  validation_status TEXT DEFAULT 'pending' CHECK (validation_status IN ('pending', 'passed', 'failed', 'warning')),
  validation_results JSONB DEFAULT '{}'::jsonb,
  error_messages TEXT[],
  warnings TEXT[],
  validated_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  validated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Sandbox to Production Migration Log
CREATE TABLE IF NOT EXISTS public.revenue_split_sandbox_migrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sandbox_config_id UUID REFERENCES public.revenue_split_sandbox_config(id) ON DELETE SET NULL,
  production_config_id UUID REFERENCES public.revenue_sharing_config(id) ON DELETE SET NULL,
  production_campaign_id UUID REFERENCES public.revenue_sharing_campaigns(id) ON DELETE SET NULL,
  migration_type TEXT NOT NULL CHECK (migration_type IN ('to_global_config', 'to_campaign', 'to_creator_override')),
  migration_status TEXT DEFAULT 'pending' CHECK (migration_status IN ('pending', 'approved', 'deployed', 'rolled_back')),
  approval_required BOOLEAN DEFAULT true,
  approved_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  deployed_at TIMESTAMPTZ,
  rollback_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Indexes
CREATE INDEX idx_sandbox_config_active ON public.revenue_split_sandbox_config(is_active);
CREATE INDEX idx_sandbox_config_created_by ON public.revenue_split_sandbox_config(created_by);
CREATE INDEX idx_test_scenarios_status ON public.revenue_split_test_scenarios(status);
CREATE INDEX idx_test_scenarios_sandbox_id ON public.revenue_split_test_scenarios(sandbox_config_id);
CREATE INDEX idx_sandbox_payouts_creator_id ON public.revenue_split_sandbox_payouts(creator_id);
CREATE INDEX idx_sandbox_validations_status ON public.revenue_split_sandbox_validations(validation_status);
CREATE INDEX idx_sandbox_migrations_status ON public.revenue_split_sandbox_migrations(migration_status);

-- 7. Enable RLS
ALTER TABLE public.revenue_split_sandbox_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_split_test_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_split_sandbox_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_split_sandbox_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_split_sandbox_migrations ENABLE ROW LEVEL SECURITY;

-- 8. RLS Policies (Admin-only access for sandbox testing)
CREATE POLICY "admin_manage_sandbox_config"
ON public.revenue_split_sandbox_config
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
);

CREATE POLICY "admin_manage_test_scenarios"
ON public.revenue_split_test_scenarios
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
);

CREATE POLICY "admin_view_sandbox_payouts"
ON public.revenue_split_sandbox_payouts
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
);

CREATE POLICY "admin_manage_sandbox_validations"
ON public.revenue_split_sandbox_validations
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
);

CREATE POLICY "admin_manage_sandbox_migrations"
ON public.revenue_split_sandbox_migrations
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
);

-- 9. Functions

-- Function to calculate sandbox payout projections
CREATE OR REPLACE FUNCTION public.calculate_sandbox_payouts(
  p_sandbox_config_id UUID,
  p_test_revenue NUMERIC DEFAULT 100000.00
)
RETURNS TABLE (
  creator_id UUID,
  creator_name TEXT,
  simulated_revenue NUMERIC,
  creator_earnings NUMERIC,
  platform_earnings NUMERIC,
  split_percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.id AS creator_id,
    up.name AS creator_name,
    p_test_revenue AS simulated_revenue,
    ROUND(p_test_revenue * (sc.creator_percentage / 100), 2) AS creator_earnings,
    ROUND(p_test_revenue * (sc.platform_percentage / 100), 2) AS platform_earnings,
    sc.creator_percentage AS split_percentage
  FROM public.revenue_split_sandbox_config sc
  CROSS JOIN public.user_profiles up
  WHERE sc.id = p_sandbox_config_id
    AND (sc.target_creator_ids = ARRAY[]::UUID[] OR up.id = ANY(sc.target_creator_ids))
    AND up.role = 'creator'
  LIMIT 100;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate sandbox configuration
CREATE OR REPLACE FUNCTION public.validate_sandbox_config(
  p_sandbox_config_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_config RECORD;
  v_validation_result JSONB;
  v_errors TEXT[] := ARRAY[]::TEXT[];
  v_warnings TEXT[] := ARRAY[]::TEXT[];
BEGIN
  SELECT * INTO v_config
  FROM public.revenue_split_sandbox_config
  WHERE id = p_sandbox_config_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'valid', false,
      'errors', ARRAY['Sandbox configuration not found']
    );
  END IF;

  -- Validate percentage totals
  IF v_config.creator_percentage + v_config.platform_percentage != 100 THEN
    v_errors := array_append(v_errors, 'Creator and platform percentages must total 100%');
  END IF;

  -- Validate percentage ranges
  IF v_config.creator_percentage < 0 OR v_config.creator_percentage > 100 THEN
    v_errors := array_append(v_errors, 'Creator percentage must be between 0 and 100');
  END IF;

  -- Warning for extreme splits
  IF v_config.creator_percentage > 95 THEN
    v_warnings := array_append(v_warnings, 'Creator percentage above 95% may not be sustainable');
  ELSIF v_config.creator_percentage < 50 THEN
    v_warnings := array_append(v_warnings, 'Creator percentage below 50% may impact creator satisfaction');
  END IF;

  v_validation_result := jsonb_build_object(
    'valid', array_length(v_errors, 1) IS NULL,
    'errors', v_errors,
    'warnings', v_warnings,
    'config', row_to_json(v_config)
  );

  RETURN v_validation_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to migrate sandbox config to production
CREATE OR REPLACE FUNCTION public.migrate_sandbox_to_production(
  p_sandbox_config_id UUID,
  p_migration_type TEXT,
  p_approved_by UUID
)
RETURNS UUID AS $$
DECLARE
  v_sandbox_config RECORD;
  v_new_config_id UUID;
  v_new_campaign_id UUID;
  v_migration_id UUID;
BEGIN
  SELECT * INTO v_sandbox_config
  FROM public.revenue_split_sandbox_config
  WHERE id = p_sandbox_config_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Sandbox configuration not found';
  END IF;

  -- Validate before migration
  IF (public.validate_sandbox_config(p_sandbox_config_id)->>'valid')::boolean = false THEN
    RAISE EXCEPTION 'Sandbox configuration failed validation';
  END IF;

  IF p_migration_type = 'to_global_config' THEN
    -- Deactivate current global config
    UPDATE public.revenue_sharing_config
    SET is_active = false, effective_until = CURRENT_TIMESTAMP
    WHERE is_global_default = true AND is_active = true;

    -- Create new global config
    INSERT INTO public.revenue_sharing_config (
      config_name, creator_percentage, platform_percentage,
      is_active, is_global_default, description, created_by
    )
    VALUES (
      v_sandbox_config.sandbox_name,
      v_sandbox_config.creator_percentage,
      v_sandbox_config.platform_percentage,
      true, true,
      'Migrated from sandbox: ' || v_sandbox_config.description,
      p_approved_by
    )
    RETURNING id INTO v_new_config_id;

  ELSIF p_migration_type = 'to_campaign' THEN
    -- Create new campaign
    INSERT INTO public.revenue_sharing_campaigns (
      campaign_name, campaign_description,
      creator_percentage, platform_percentage,
      status, start_date, end_date,
      target_creator_ids, created_by
    )
    VALUES (
      v_sandbox_config.sandbox_name,
      'Migrated from sandbox: ' || v_sandbox_config.description,
      v_sandbox_config.creator_percentage,
      v_sandbox_config.platform_percentage,
      'scheduled',
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP + (v_sandbox_config.test_duration_days || ' days')::INTERVAL,
      v_sandbox_config.target_creator_ids,
      p_approved_by
    )
    RETURNING id INTO v_new_campaign_id;
  END IF;

  -- Log migration
  INSERT INTO public.revenue_split_sandbox_migrations (
    sandbox_config_id, production_config_id, production_campaign_id,
    migration_type, migration_status, approved_by, approved_at, deployed_at
  )
  VALUES (
    p_sandbox_config_id, v_new_config_id, v_new_campaign_id,
    p_migration_type, 'deployed', p_approved_by, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  )
  RETURNING id INTO v_migration_id;

  RETURN v_migration_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Triggers

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_revenue_split_sandbox_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sandbox_config_timestamp
BEFORE UPDATE ON public.revenue_split_sandbox_config
FOR EACH ROW
EXECUTE FUNCTION public.update_revenue_split_sandbox_timestamp();