-- Revenue Sharing Configuration System Migration
-- Purpose: Enable dynamic creator/platform revenue split configuration with campaign management and historical tracking

-- 1. Custom Types
CREATE TYPE public.revenue_sharing_campaign_status AS ENUM (
  'scheduled',
  'active',
  'completed',
  'cancelled'
);

CREATE TYPE public.revenue_sharing_change_reason AS ENUM (
  'morale_booster',
  'strategic_adjustment',
  'campaign_launch',
  'performance_incentive',
  'market_conditions',
  'manual_override'
);

-- 2. Core Tables

-- Global Revenue Sharing Configuration
CREATE TABLE IF NOT EXISTS public.revenue_sharing_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_name TEXT NOT NULL DEFAULT 'Default Split',
  creator_percentage NUMERIC(5, 2) NOT NULL DEFAULT 70.00 CHECK (creator_percentage >= 0 AND creator_percentage <= 100),
  platform_percentage NUMERIC(5, 2) NOT NULL DEFAULT 30.00 CHECK (platform_percentage >= 0 AND platform_percentage <= 100),
  is_active BOOLEAN DEFAULT false,
  is_global_default BOOLEAN DEFAULT false,
  description TEXT,
  change_reason public.revenue_sharing_change_reason,
  effective_from TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  effective_until TIMESTAMPTZ,
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_percentage_total CHECK (creator_percentage + platform_percentage = 100)
);

-- Revenue Sharing Campaigns (Time-bound special splits)
CREATE TABLE IF NOT EXISTS public.revenue_sharing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name TEXT NOT NULL,
  campaign_description TEXT,
  creator_percentage NUMERIC(5, 2) NOT NULL CHECK (creator_percentage >= 0 AND creator_percentage <= 100),
  platform_percentage NUMERIC(5, 2) NOT NULL CHECK (platform_percentage >= 0 AND platform_percentage <= 100),
  status public.revenue_sharing_campaign_status DEFAULT 'scheduled',
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  target_creator_ids UUID[] DEFAULT ARRAY[]::UUID[],
  target_zones public.zone_identifier[] DEFAULT ARRAY[]::public.zone_identifier[],
  campaign_objectives JSONB DEFAULT '{}'::jsonb,
  performance_metrics JSONB DEFAULT '{}'::jsonb,
  auto_expire BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 1,
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_campaign_dates CHECK (end_date > start_date),
  CONSTRAINT valid_campaign_percentage_total CHECK (creator_percentage + platform_percentage = 100)
);

-- Per-Creator Custom Revenue Splits
CREATE TABLE IF NOT EXISTS public.creator_revenue_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  creator_percentage NUMERIC(5, 2) NOT NULL CHECK (creator_percentage >= 0 AND creator_percentage <= 100),
  platform_percentage NUMERIC(5, 2) NOT NULL CHECK (platform_percentage >= 0 AND platform_percentage <= 100),
  override_reason TEXT,
  negotiated_terms TEXT,
  creator_tier TEXT,
  is_active BOOLEAN DEFAULT true,
  effective_from TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  effective_until TIMESTAMPTZ,
  approved_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_override_percentage_total CHECK (creator_percentage + platform_percentage = 100),
  CONSTRAINT unique_active_creator_override UNIQUE (creator_id, is_active)
);

-- Revenue Sharing Change History (Audit Trail)
CREATE TABLE IF NOT EXISTS public.revenue_sharing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID REFERENCES public.revenue_sharing_config(id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES public.revenue_sharing_campaigns(id) ON DELETE SET NULL,
  creator_override_id UUID REFERENCES public.creator_revenue_overrides(id) ON DELETE SET NULL,
  change_type TEXT NOT NULL CHECK (change_type IN ('global_config', 'campaign', 'creator_override')),
  previous_creator_percentage NUMERIC(5, 2),
  new_creator_percentage NUMERIC(5, 2) NOT NULL,
  previous_platform_percentage NUMERIC(5, 2),
  new_platform_percentage NUMERIC(5, 2) NOT NULL,
  change_reason public.revenue_sharing_change_reason,
  change_description TEXT,
  affected_creators_count INTEGER DEFAULT 0,
  estimated_revenue_impact NUMERIC(12, 2),
  changed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  changed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Revenue Impact Projections
CREATE TABLE IF NOT EXISTS public.revenue_split_projections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID REFERENCES public.revenue_sharing_config(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.revenue_sharing_campaigns(id) ON DELETE CASCADE,
  projection_period TEXT NOT NULL,
  projected_creator_earnings NUMERIC(12, 2) DEFAULT 0.00,
  projected_platform_revenue NUMERIC(12, 2) DEFAULT 0.00,
  projected_total_revenue NUMERIC(12, 2) DEFAULT 0.00,
  creator_satisfaction_score NUMERIC(5, 2),
  retention_rate_estimate NUMERIC(5, 2),
  confidence_level TEXT DEFAULT 'medium' CHECK (confidence_level IN ('low', 'medium', 'high')),
  calculation_methodology TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Indexes
CREATE INDEX idx_revenue_sharing_config_active ON public.revenue_sharing_config(is_active);
CREATE INDEX idx_revenue_sharing_config_global_default ON public.revenue_sharing_config(is_global_default);
CREATE INDEX idx_revenue_sharing_config_effective_dates ON public.revenue_sharing_config(effective_from, effective_until);
CREATE INDEX idx_revenue_sharing_campaigns_status ON public.revenue_sharing_campaigns(status);
CREATE INDEX idx_revenue_sharing_campaigns_dates ON public.revenue_sharing_campaigns(start_date, end_date);
CREATE INDEX idx_creator_revenue_overrides_creator_id ON public.creator_revenue_overrides(creator_id);
CREATE INDEX idx_creator_revenue_overrides_active ON public.creator_revenue_overrides(is_active);
CREATE INDEX idx_revenue_sharing_history_changed_at ON public.revenue_sharing_history(changed_at DESC);
CREATE INDEX idx_revenue_sharing_history_change_type ON public.revenue_sharing_history(change_type);

-- 4. Enable RLS
ALTER TABLE public.revenue_sharing_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_sharing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_revenue_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_sharing_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_split_projections ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies

-- Revenue Sharing Config: Admin manage, creators view their applicable config
CREATE POLICY "admin_manage_revenue_sharing_config"
ON public.revenue_sharing_config
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

CREATE POLICY "creators_view_active_revenue_config"
ON public.revenue_sharing_config
FOR SELECT
TO authenticated
USING (is_active = true);

-- Revenue Sharing Campaigns: Admin manage, creators view applicable campaigns
CREATE POLICY "admin_manage_revenue_campaigns"
ON public.revenue_sharing_campaigns
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

CREATE POLICY "creators_view_applicable_campaigns"
ON public.revenue_sharing_campaigns
FOR SELECT
TO authenticated
USING (
  status = 'active' AND
  (target_creator_ids = ARRAY[]::UUID[] OR auth.uid() = ANY(target_creator_ids))
);

-- Creator Revenue Overrides: Admin manage, creators view their own
CREATE POLICY "admin_manage_creator_overrides"
ON public.creator_revenue_overrides
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

CREATE POLICY "creators_view_own_override"
ON public.creator_revenue_overrides
FOR SELECT
TO authenticated
USING (creator_id = auth.uid());

-- Revenue Sharing History: Admin only
CREATE POLICY "admin_view_revenue_history"
ON public.revenue_sharing_history
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
);

-- Revenue Split Projections: Admin only
CREATE POLICY "admin_manage_revenue_projections"
ON public.revenue_split_projections
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

-- 6. Functions

-- Function to get active revenue split for a creator
CREATE OR REPLACE FUNCTION public.get_active_revenue_split(p_creator_id UUID)
RETURNS TABLE (
  creator_percentage NUMERIC,
  platform_percentage NUMERIC,
  split_source TEXT,
  config_name TEXT
) AS $$
BEGIN
  -- Priority 1: Check for active per-creator override
  RETURN QUERY
  SELECT 
    cro.creator_percentage,
    cro.platform_percentage,
    'creator_override'::TEXT as split_source,
    COALESCE(cro.override_reason, 'Custom Agreement')::TEXT as config_name
  FROM public.creator_revenue_overrides cro
  WHERE cro.creator_id = p_creator_id
    AND cro.is_active = true
    AND (cro.effective_until IS NULL OR cro.effective_until > CURRENT_TIMESTAMP)
  LIMIT 1;
  
  IF FOUND THEN
    RETURN;
  END IF;
  
  -- Priority 2: Check for active campaign applicable to creator
  RETURN QUERY
  SELECT 
    rsc.creator_percentage,
    rsc.platform_percentage,
    'campaign'::TEXT as split_source,
    rsc.campaign_name::TEXT as config_name
  FROM public.revenue_sharing_campaigns rsc
  WHERE rsc.status = 'active'
    AND CURRENT_TIMESTAMP BETWEEN rsc.start_date AND rsc.end_date
    AND (rsc.target_creator_ids = ARRAY[]::UUID[] OR p_creator_id = ANY(rsc.target_creator_ids))
  ORDER BY rsc.priority DESC
  LIMIT 1;
  
  IF FOUND THEN
    RETURN;
  END IF;
  
  -- Priority 3: Use global default configuration
  RETURN QUERY
  SELECT 
    rsc.creator_percentage,
    rsc.platform_percentage,
    'global_default'::TEXT as split_source,
    rsc.config_name::TEXT as config_name
  FROM public.revenue_sharing_config rsc
  WHERE rsc.is_global_default = true
    AND rsc.is_active = true
  LIMIT 1;
  
  -- Fallback: Return hardcoded 70/30 if no config exists
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT 
      70.00::NUMERIC as creator_percentage,
      30.00::NUMERIC as platform_percentage,
      'fallback_default'::TEXT as split_source,
      'System Default (70/30)'::TEXT as config_name;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically expire campaigns
CREATE OR REPLACE FUNCTION public.auto_expire_revenue_campaigns()
RETURNS void AS $$
BEGIN
  UPDATE public.revenue_sharing_campaigns
  SET 
    status = 'completed',
    updated_at = CURRENT_TIMESTAMP
  WHERE status = 'active'
    AND end_date < CURRENT_TIMESTAMP
    AND auto_expire = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to activate scheduled campaigns
CREATE OR REPLACE FUNCTION public.activate_scheduled_campaigns()
RETURNS void AS $$
BEGIN
  UPDATE public.revenue_sharing_campaigns
  SET 
    status = 'active',
    updated_at = CURRENT_TIMESTAMP
  WHERE status = 'scheduled'
    AND start_date <= CURRENT_TIMESTAMP
    AND end_date > CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to log revenue sharing changes
CREATE OR REPLACE FUNCTION public.log_revenue_sharing_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO public.revenue_sharing_history (
      config_id,
      change_type,
      previous_creator_percentage,
      new_creator_percentage,
      previous_platform_percentage,
      new_platform_percentage,
      change_reason,
      changed_by,
      changed_at
    ) VALUES (
      NEW.id,
      'global_config',
      OLD.creator_percentage,
      NEW.creator_percentage,
      OLD.platform_percentage,
      NEW.platform_percentage,
      NEW.change_reason,
      NEW.created_by,
      CURRENT_TIMESTAMP
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER revenue_config_change_trigger
AFTER UPDATE ON public.revenue_sharing_config
FOR EACH ROW
EXECUTE FUNCTION public.log_revenue_sharing_change();

-- 7. Mock Data

-- Insert default global revenue sharing configuration
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.revenue_sharing_config WHERE is_global_default = true) THEN
    INSERT INTO public.revenue_sharing_config (
      config_name,
      creator_percentage,
      platform_percentage,
      is_active,
      is_global_default,
      description,
      change_reason
    ) VALUES (
      'Default Platform Split',
      70.00,
      30.00,
      true,
      true,
      'Standard creator/platform revenue sharing ratio',
      'strategic_adjustment'
    );
  END IF;
END $$;

-- Insert sample morale booster campaign
INSERT INTO public.revenue_sharing_campaigns (
  campaign_name,
  campaign_description,
  creator_percentage,
  platform_percentage,
  status,
  start_date,
  end_date,
  campaign_objectives,
  auto_expire
) VALUES (
  'Creator Appreciation Month',
  'Special 90/10 split to boost creator morale and retention',
  90.00,
  10.00,
  'scheduled',
  CURRENT_TIMESTAMP + INTERVAL '7 days',
  CURRENT_TIMESTAMP + INTERVAL '37 days',
  '{"goal": "Increase creator satisfaction", "target_retention": "95%", "expected_impact": "High"}'::jsonb,
  true
) ON CONFLICT DO NOTHING;

-- Insert sample historical change
INSERT INTO public.revenue_sharing_history (
  change_type,
  previous_creator_percentage,
  new_creator_percentage,
  previous_platform_percentage,
  new_platform_percentage,
  change_reason,
  change_description,
  affected_creators_count,
  changed_at
) VALUES (
  'global_config',
  65.00,
  70.00,
  35.00,
  30.00,
  'morale_booster',
  'Increased creator share to improve platform competitiveness',
  1247,
  CURRENT_TIMESTAMP - INTERVAL '30 days'
) ON CONFLICT DO NOTHING;

COMMENT ON TABLE public.revenue_sharing_config IS 'Global revenue sharing configuration with creator/platform split percentages';
COMMENT ON TABLE public.revenue_sharing_campaigns IS 'Time-bound revenue sharing campaigns with custom splits for morale boosters and strategic initiatives';
COMMENT ON TABLE public.creator_revenue_overrides IS 'Per-creator custom revenue splits for negotiated agreements and tier-based incentives';
COMMENT ON TABLE public.revenue_sharing_history IS 'Comprehensive audit trail of all revenue split changes with impact analysis';
COMMENT ON FUNCTION public.get_active_revenue_split IS 'Returns the currently active revenue split for a creator based on priority: override > campaign > global default';