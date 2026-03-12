-- Platform Gamification System Migration
-- Comprehensive schema for platform-wide prize distribution with flexible allocation controls

-- =====================================================
-- PLATFORM GAMIFICATION CAMPAIGNS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.platform_gamification_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name TEXT NOT NULL,
  custom_prize_name TEXT DEFAULT 'Vottery Prize',
  prize_pool_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  branding_logo_url TEXT,
  sponsor_name TEXT,
  frequency TEXT CHECK (frequency IN ('weekly', 'monthly', 'quarterly')) DEFAULT 'monthly',
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  drawing_date TIMESTAMPTZ,
  status TEXT CHECK (status IN ('draft', 'active', 'drawing', 'completed', 'disabled')) DEFAULT 'draft',
  is_enabled BOOLEAN DEFAULT true,
  total_winners INTEGER DEFAULT 0,
  prize_tiers JSONB DEFAULT '[]'::jsonb, -- [{"tier": "1M", "amount": 1000000, "count": 3}]
  display_position TEXT DEFAULT 'home_feed',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_campaigns_status ON public.platform_gamification_campaigns(status);
CREATE INDEX idx_campaigns_dates ON public.platform_gamification_campaigns(start_date, end_date);
CREATE INDEX idx_campaigns_enabled ON public.platform_gamification_campaigns(is_enabled);

-- =====================================================
-- ALLOCATION RULES ENGINE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.gamification_allocation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.platform_gamification_campaigns(id) ON DELETE CASCADE,
  allocation_type TEXT CHECK (allocation_type IN (
    'country', 'continent', 'gender', 'mau', 'dau', 
    'premium_buyers', 'subscribers', 'advertisers', 'creators', 'others'
  )) NOT NULL,
  allocation_criteria JSONB NOT NULL, -- {"country": "US"} or {"continent": "North America"}
  percentage DECIMAL(5,2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  custom_definition TEXT, -- For "others" category - natural language definition
  ai_generated_query TEXT, -- AI-parsed SQL query for custom filtering
  priority_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_allocation_campaign ON public.gamification_allocation_rules(campaign_id);
CREATE INDEX idx_allocation_type ON public.gamification_allocation_rules(allocation_type);

-- =====================================================
-- WINNER SELECTION & TRACKING
-- =====================================================
CREATE TABLE IF NOT EXISTS public.platform_gamification_winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.platform_gamification_campaigns(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  prize_amount DECIMAL(12,2) NOT NULL,
  prize_tier TEXT NOT NULL, -- '1M', '100K', etc.
  allocation_category TEXT NOT NULL, -- Which rule matched this winner
  allocation_criteria JSONB, -- Specific criteria that qualified this user
  rng_seed TEXT, -- Cryptographic seed for verification
  blockchain_proof TEXT, -- Blockchain verification hash
  winner_selected_at TIMESTAMPTZ DEFAULT NOW(),
  notification_sent BOOLEAN DEFAULT false,
  notification_sent_at TIMESTAMPTZ,
  payout_status TEXT CHECK (payout_status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  payout_method TEXT, -- 'stripe', 'wallet', 'manual'
  payout_transaction_id TEXT,
  payout_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_winners_campaign ON public.platform_gamification_winners(campaign_id);
CREATE INDEX idx_winners_user ON public.platform_gamification_winners(user_id);
CREATE INDEX idx_winners_status ON public.platform_gamification_winners(payout_status);
CREATE INDEX idx_winners_date ON public.platform_gamification_winners(winner_selected_at);

-- =====================================================
-- USER ELIGIBILITY TRACKING
-- =====================================================
CREATE TABLE IF NOT EXISTS public.gamification_user_eligibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.platform_gamification_campaigns(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  is_eligible BOOLEAN DEFAULT true,
  eligibility_score DECIMAL(5,2) DEFAULT 100, -- 0-100 score based on activity
  matched_categories TEXT[] DEFAULT '{}', -- Categories user qualifies for
  activity_metrics JSONB DEFAULT '{}'::jsonb, -- MAU/DAU status, engagement stats
  last_calculated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, user_id)
);

CREATE INDEX idx_eligibility_campaign ON public.gamification_user_eligibility(campaign_id);
CREATE INDEX idx_eligibility_user ON public.gamification_user_eligibility(user_id);
CREATE INDEX idx_eligibility_score ON public.gamification_user_eligibility(eligibility_score);

-- =====================================================
-- EXTERNAL API ACCESS MANAGEMENT
-- =====================================================
CREATE TABLE IF NOT EXISTS public.gamification_api_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  api_key TEXT UNIQUE NOT NULL,
  api_secret TEXT NOT NULL,
  organization_name TEXT,
  contact_email TEXT,
  allowed_origins TEXT[] DEFAULT '{}',
  rate_limit_per_hour INTEGER DEFAULT 1000,
  is_active BOOLEAN DEFAULT true,
  permissions JSONB DEFAULT '{"read": true, "write": false, "admin": false}'::jsonb,
  usage_stats JSONB DEFAULT '{"total_requests": 0, "last_request": null}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX idx_api_clients_key ON public.gamification_api_clients(api_key);
CREATE INDEX idx_api_clients_active ON public.gamification_api_clients(is_active);

-- =====================================================
-- API REQUEST LOGS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.gamification_api_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.gamification_api_clients(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  request_payload JSONB,
  response_status INTEGER,
  response_time_ms INTEGER,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_api_logs_client ON public.gamification_api_logs(client_id);
CREATE INDEX idx_api_logs_date ON public.gamification_api_logs(created_at);

-- =====================================================
-- CAMPAIGN ANALYTICS & REPORTING
-- =====================================================
CREATE TABLE IF NOT EXISTS public.gamification_campaign_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.platform_gamification_campaigns(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL,
  total_eligible_users INTEGER DEFAULT 0,
  total_entries INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  allocation_breakdown JSONB DEFAULT '{}'::jsonb, -- Category-wise distribution
  user_demographics JSONB DEFAULT '{}'::jsonb,
  performance_metrics JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, metric_date)
);

CREATE INDEX idx_analytics_campaign ON public.gamification_campaign_analytics(campaign_id);
CREATE INDEX idx_analytics_date ON public.gamification_campaign_analytics(metric_date);

-- =====================================================
-- RLS POLICIES
-- =====================================================
ALTER TABLE public.platform_gamification_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gamification_allocation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_gamification_winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gamification_user_eligibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gamification_api_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gamification_api_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gamification_campaign_analytics ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admin full access to campaigns" ON public.platform_gamification_campaigns
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin full access to allocation rules" ON public.gamification_allocation_rules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin full access to winners" ON public.platform_gamification_winners
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Users can view active campaigns
CREATE POLICY "Users can view active campaigns" ON public.platform_gamification_campaigns
  FOR SELECT USING (status = 'active' AND is_enabled = true);

-- Users can view their own wins
CREATE POLICY "Users can view their wins" ON public.platform_gamification_winners
  FOR SELECT USING (user_id = auth.uid());

-- Users can view their eligibility
CREATE POLICY "Users can view their eligibility" ON public.gamification_user_eligibility
  FOR SELECT USING (user_id = auth.uid());

-- API clients management (admin only)
CREATE POLICY "Admin manage API clients" ON public.gamification_api_clients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Analytics (admin only)
CREATE POLICY "Admin view analytics" ON public.gamification_campaign_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_gamification_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_campaigns_timestamp
  BEFORE UPDATE ON public.platform_gamification_campaigns
  FOR EACH ROW EXECUTE FUNCTION update_gamification_updated_at();

CREATE TRIGGER update_allocation_rules_timestamp
  BEFORE UPDATE ON public.gamification_allocation_rules
  FOR EACH ROW EXECUTE FUNCTION update_gamification_updated_at();

-- Calculate total winners when prize tiers change
CREATE OR REPLACE FUNCTION calculate_total_winners()
RETURNS TRIGGER AS $$
DECLARE
  total INTEGER := 0;
  tier JSONB;
BEGIN
  IF NEW.prize_tiers IS NOT NULL THEN
    FOR tier IN SELECT * FROM jsonb_array_elements(NEW.prize_tiers)
    LOOP
      total := total + (tier->>'count')::INTEGER;
    END LOOP;
    NEW.total_winners := total;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_winners_trigger
  BEFORE INSERT OR UPDATE OF prize_tiers ON public.platform_gamification_campaigns
  FOR EACH ROW EXECUTE FUNCTION calculate_total_winners();

-- Validate allocation percentages don't exceed 100%
CREATE OR REPLACE FUNCTION validate_allocation_percentages()
RETURNS TRIGGER AS $$
DECLARE
  total_percentage DECIMAL(5,2);
BEGIN
  SELECT COALESCE(SUM(percentage), 0) INTO total_percentage
  FROM public.gamification_allocation_rules
  WHERE campaign_id = NEW.campaign_id
  AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID)
  AND is_active = true;
  
  IF (total_percentage + NEW.percentage) > 100 THEN
    RAISE EXCEPTION 'Total allocation percentage cannot exceed 100. Current: %, Attempting to add: %', total_percentage, NEW.percentage;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_allocation_trigger
  BEFORE INSERT OR UPDATE ON public.gamification_allocation_rules
  FOR EACH ROW EXECUTE FUNCTION validate_allocation_percentages();

-- =====================================================
-- SAMPLE DATA FOR TESTING
-- =====================================================
DO $$
BEGIN
  -- Insert sample campaign
  INSERT INTO public.platform_gamification_campaigns (
    campaign_name,
    custom_prize_name,
    prize_pool_amount,
    sponsor_name,
    frequency,
    start_date,
    end_date,
    drawing_date,
    status,
    prize_tiers
  ) VALUES (
    'January 2026 Platform Gamification',
    'Vottery UBI',
    23000000,
    'Vottery Platform',
    'monthly',
    '2026-01-01 00:00:00+00',
    '2026-01-31 23:59:59+00',
    '2026-02-01 12:00:00+00',
    'active',
    '[
      {"tier": "1M", "amount": 1000000, "count": 3},
      {"tier": "100K", "amount": 100000, "count": 200}
    ]'::jsonb
  ) ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Platform Gamification System migration completed successfully';
END $$;