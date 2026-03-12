-- Country-Specific Revenue Sharing Enhancement
-- Purpose: Enable flexible country-level revenue split configuration for creators
-- Example: USA 70/30, India 60/40, Nigeria 75/25, etc.

-- 1. Country Revenue Split Configuration Table
CREATE TABLE IF NOT EXISTS public.country_revenue_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL UNIQUE, -- ISO 3166-1 alpha-2 (US, IN, NG, etc.)
  country_name TEXT NOT NULL,
  creator_percentage NUMERIC(5, 2) NOT NULL DEFAULT 70.00 CHECK (creator_percentage >= 0 AND creator_percentage <= 100),
  platform_percentage NUMERIC(5, 2) NOT NULL DEFAULT 30.00 CHECK (platform_percentage >= 0 AND platform_percentage <= 100),
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 1, -- Higher priority overrides lower (for conflict resolution)
  zone public.zone_identifier, -- Optional: Link to existing zone system
  description TEXT,
  effective_from TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  effective_until TIMESTAMPTZ,
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_country_percentage_total CHECK (creator_percentage + platform_percentage = 100)
);

-- 2. Country Revenue Split History (Audit Trail)
CREATE TABLE IF NOT EXISTS public.country_revenue_split_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_split_id UUID REFERENCES public.country_revenue_splits(id) ON DELETE SET NULL,
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  previous_creator_percentage NUMERIC(5, 2),
  new_creator_percentage NUMERIC(5, 2) NOT NULL,
  previous_platform_percentage NUMERIC(5, 2),
  new_platform_percentage NUMERIC(5, 2) NOT NULL,
  change_reason TEXT,
  change_description TEXT,
  affected_creators_count INTEGER DEFAULT 0,
  estimated_revenue_impact NUMERIC(12, 2),
  changed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  changed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 3. Country-Specific Analytics
CREATE TABLE IF NOT EXISTS public.country_revenue_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  total_revenue NUMERIC(12, 2) DEFAULT 0.00,
  creator_earnings NUMERIC(12, 2) DEFAULT 0.00,
  platform_earnings NUMERIC(12, 2) DEFAULT 0.00,
  active_creators_count INTEGER DEFAULT 0,
  total_transactions INTEGER DEFAULT 0,
  average_split_percentage NUMERIC(5, 2),
  calculated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_country_period UNIQUE (country_code, period_start, period_end)
);

-- 4. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_country_revenue_splits_country_code ON public.country_revenue_splits(country_code);
CREATE INDEX IF NOT EXISTS idx_country_revenue_splits_active ON public.country_revenue_splits(is_active);
CREATE INDEX IF NOT EXISTS idx_country_revenue_splits_zone ON public.country_revenue_splits(zone);
CREATE INDEX IF NOT EXISTS idx_country_revenue_splits_effective_dates ON public.country_revenue_splits(effective_from, effective_until);
CREATE INDEX IF NOT EXISTS idx_country_revenue_split_history_country_code ON public.country_revenue_split_history(country_code);
CREATE INDEX IF NOT EXISTS idx_country_revenue_split_history_changed_at ON public.country_revenue_split_history(changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_country_revenue_analytics_country_code ON public.country_revenue_analytics(country_code);
CREATE INDEX IF NOT EXISTS idx_country_revenue_analytics_period ON public.country_revenue_analytics(period_start, period_end);

-- 5. Enable RLS
ALTER TABLE public.country_revenue_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.country_revenue_split_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.country_revenue_analytics ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies

-- Country Revenue Splits: Admin full access, creators view active splits
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'country_revenue_splits' 
    AND policyname = 'admin_manage_country_revenue_splits'
  ) THEN
    CREATE POLICY "admin_manage_country_revenue_splits"
    ON public.country_revenue_splits
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = auth.uid() AND role = 'admin'
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = auth.uid() AND role = 'admin'
      )
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'country_revenue_splits' 
    AND policyname = 'creators_view_active_country_splits'
  ) THEN
    CREATE POLICY "creators_view_active_country_splits"
    ON public.country_revenue_splits
    FOR SELECT
    TO authenticated
    USING (is_active = true);
  END IF;
END $$;

-- Country Revenue Split History: Admin view all
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'country_revenue_split_history' 
    AND policyname = 'admin_view_country_split_history'
  ) THEN
    CREATE POLICY "admin_view_country_split_history"
    ON public.country_revenue_split_history
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = auth.uid() AND role = 'admin'
      )
    );
  END IF;
END $$;

-- Country Revenue Analytics: Admin view all
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'country_revenue_analytics' 
    AND policyname = 'admin_view_country_analytics'
  ) THEN
    CREATE POLICY "admin_view_country_analytics"
    ON public.country_revenue_analytics
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = auth.uid() AND role = 'admin'
      )
    );
  END IF;
END $$;

-- 7. Functions

-- Function to get active revenue split for a country
CREATE OR REPLACE FUNCTION public.get_country_revenue_split(p_country_code TEXT)
RETURNS TABLE (
  id UUID,
  country_code TEXT,
  country_name TEXT,
  creator_percentage NUMERIC,
  platform_percentage NUMERIC,
  zone public.zone_identifier
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    crs.id,
    crs.country_code,
    crs.country_name,
    crs.creator_percentage,
    crs.platform_percentage,
    crs.zone
  FROM public.country_revenue_splits crs
  WHERE crs.country_code = p_country_code
    AND crs.is_active = true
    AND (crs.effective_from IS NULL OR crs.effective_from <= CURRENT_TIMESTAMP)
    AND (crs.effective_until IS NULL OR crs.effective_until > CURRENT_TIMESTAMP)
  ORDER BY crs.priority DESC, crs.created_at DESC
  LIMIT 1;
END;
$$;

-- Function to calculate revenue split with country override
CREATE OR REPLACE FUNCTION public.calculate_revenue_split_with_country(
  p_creator_id UUID,
  p_total_amount NUMERIC,
  p_country_code TEXT DEFAULT NULL
)
RETURNS TABLE (
  creator_amount NUMERIC,
  platform_amount NUMERIC,
  creator_percentage NUMERIC,
  platform_percentage NUMERIC,
  split_source TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_creator_pct NUMERIC := 70.00;
  v_platform_pct NUMERIC := 30.00;
  v_split_source TEXT := 'global_default';
  v_country_code TEXT;
BEGIN
  -- Use provided country code
  v_country_code := p_country_code;

  -- Priority 1: Check for per-creator override
  SELECT 
    cro.creator_percentage,
    cro.platform_percentage,
    'creator_override'
  INTO v_creator_pct, v_platform_pct, v_split_source
  FROM public.creator_revenue_overrides cro
  WHERE cro.creator_id = p_creator_id
    AND cro.is_active = true
    AND (cro.effective_from IS NULL OR cro.effective_from <= CURRENT_TIMESTAMP)
    AND (cro.effective_until IS NULL OR cro.effective_until > CURRENT_TIMESTAMP)
  ORDER BY cro.created_at DESC
  LIMIT 1;

  -- Priority 2: Check for active campaign
  IF v_split_source = 'global_default' THEN
    SELECT 
      rsc.creator_percentage,
      rsc.platform_percentage,
      'campaign'
    INTO v_creator_pct, v_platform_pct, v_split_source
    FROM public.revenue_sharing_campaigns rsc
    WHERE rsc.status = 'active'
      AND CURRENT_TIMESTAMP BETWEEN rsc.start_date AND rsc.end_date
      AND (rsc.target_creator_ids = ARRAY[]::UUID[] OR p_creator_id = ANY(rsc.target_creator_ids))
    ORDER BY rsc.priority DESC, rsc.created_at DESC
    LIMIT 1;
  END IF;

  -- Priority 3: Check for country-specific split
  IF v_split_source = 'global_default' AND v_country_code IS NOT NULL THEN
    SELECT 
      crs.creator_percentage,
      crs.platform_percentage,
      'country_specific'
    INTO v_creator_pct, v_platform_pct, v_split_source
    FROM public.country_revenue_splits crs
    WHERE crs.country_code = v_country_code
      AND crs.is_active = true
      AND (crs.effective_from IS NULL OR crs.effective_from <= CURRENT_TIMESTAMP)
      AND (crs.effective_until IS NULL OR crs.effective_until > CURRENT_TIMESTAMP)
    ORDER BY crs.priority DESC, crs.created_at DESC
    LIMIT 1;
  END IF;

  -- Priority 4: Use global default
  IF v_split_source = 'global_default' THEN
    SELECT 
      rsc.creator_percentage,
      rsc.platform_percentage,
      'global_config'
    INTO v_creator_pct, v_platform_pct, v_split_source
    FROM public.revenue_sharing_config rsc
    WHERE rsc.is_active = true
      AND rsc.is_global_default = true
    ORDER BY rsc.created_at DESC
    LIMIT 1;
  END IF;

  -- Calculate amounts
  RETURN QUERY
  SELECT 
    ROUND((p_total_amount * v_creator_pct) / 100, 2) AS creator_amount,
    ROUND((p_total_amount * v_platform_pct) / 100, 2) AS platform_amount,
    v_creator_pct AS creator_percentage,
    v_platform_pct AS platform_percentage,
    v_split_source AS split_source;
END;
$$;

-- Function to log country split changes
CREATE OR REPLACE FUNCTION public.log_country_revenue_split_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO public.country_revenue_split_history (
      country_split_id,
      country_code,
      country_name,
      previous_creator_percentage,
      new_creator_percentage,
      previous_platform_percentage,
      new_platform_percentage,
      change_reason,
      changed_by
    ) VALUES (
      NEW.id,
      NEW.country_code,
      NEW.country_name,
      OLD.creator_percentage,
      NEW.creator_percentage,
      OLD.platform_percentage,
      NEW.platform_percentage,
      'Configuration updated',
      NEW.updated_by
    );
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.country_revenue_split_history (
      country_split_id,
      country_code,
      country_name,
      previous_creator_percentage,
      new_creator_percentage,
      previous_platform_percentage,
      new_platform_percentage,
      change_reason,
      changed_by
    ) VALUES (
      NEW.id,
      NEW.country_code,
      NEW.country_name,
      NULL,
      NEW.creator_percentage,
      NULL,
      NEW.platform_percentage,
      'Initial configuration',
      NEW.created_by
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- 8. Triggers
DROP TRIGGER IF EXISTS trigger_log_country_revenue_split_change ON public.country_revenue_splits;
CREATE TRIGGER trigger_log_country_revenue_split_change
AFTER INSERT OR UPDATE ON public.country_revenue_splits
FOR EACH ROW
EXECUTE FUNCTION public.log_country_revenue_split_change();

-- Trigger to update updated_at timestamp
DROP TRIGGER IF EXISTS trigger_update_country_revenue_splits_timestamp ON public.country_revenue_splits;
CREATE TRIGGER trigger_update_country_revenue_splits_timestamp
BEFORE UPDATE ON public.country_revenue_splits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 9. Seed Data with Example Countries
INSERT INTO public.country_revenue_splits (country_code, country_name, creator_percentage, platform_percentage, zone, description, is_active)
VALUES 
  ('US', 'United States', 70.00, 30.00, 'zone_1', 'Default split for USA creators', true),
  ('IN', 'India', 60.00, 40.00, 'zone_2', 'Default split for India creators', true),
  ('NG', 'Nigeria', 75.00, 25.00, 'zone_4', 'Default split for Nigeria creators', true),
  ('GB', 'United Kingdom', 70.00, 30.00, 'zone_1', 'Default split for UK creators', true),
  ('CA', 'Canada', 70.00, 30.00, 'zone_1', 'Default split for Canada creators', true),
  ('AU', 'Australia', 70.00, 30.00, 'zone_7', 'Default split for Australia creators', true),
  ('BR', 'Brazil', 65.00, 35.00, 'zone_5', 'Default split for Brazil creators', true),
  ('MX', 'Mexico', 65.00, 35.00, 'zone_5', 'Default split for Mexico creators', true),
  ('DE', 'Germany', 70.00, 30.00, 'zone_1', 'Default split for Germany creators', true),
  ('FR', 'France', 70.00, 30.00, 'zone_1', 'Default split for France creators', true),
  ('JP', 'Japan', 68.00, 32.00, 'zone_6', 'Default split for Japan creators', true),
  ('CN', 'China', 68.00, 32.00, 'zone_8', 'Default split for China creators', true),
  ('ZA', 'South Africa', 72.00, 28.00, 'zone_4', 'Default split for South Africa creators', true),
  ('KE', 'Kenya', 75.00, 25.00, 'zone_4', 'Default split for Kenya creators', true),
  ('EG', 'Egypt', 70.00, 30.00, 'zone_6', 'Default split for Egypt creators', true)
ON CONFLICT (country_code) DO NOTHING;

-- 10. Comments
COMMENT ON TABLE public.country_revenue_splits IS 'Country-specific revenue sharing configuration allowing flexible splits per country (e.g., USA 70/30, India 60/40, Nigeria 75/25)';
COMMENT ON TABLE public.country_revenue_split_history IS 'Audit trail for all changes to country-specific revenue splits';
COMMENT ON TABLE public.country_revenue_analytics IS 'Analytics data for revenue performance by country';
COMMENT ON FUNCTION public.get_country_revenue_split IS 'Retrieves active revenue split configuration for a specific country';
COMMENT ON FUNCTION public.calculate_revenue_split_with_country IS 'Calculates revenue split with priority: creator override > campaign > country-specific > global default';
