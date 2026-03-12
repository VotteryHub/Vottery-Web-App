-- =====================================================
-- GAMIFICATION & SPONSORED ELECTIONS SCHEMA
-- Supports Participatory Advertising Strategy
-- =====================================================

-- =====================================================
-- 1. GAMIFICATION TABLES
-- =====================================================

-- User Gamification Status (Current XP, Level, Streaks)
CREATE TABLE IF NOT EXISTS public.user_gamification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_count INTEGER DEFAULT 0,
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  daily_streak INTEGER DEFAULT 0,
  consecutive_votes_streak INTEGER DEFAULT 0,
  advertiser_engagement_streak INTEGER DEFAULT 0,
  streak_freeze_used BOOLEAN DEFAULT FALSE,
  total_sponsored_votes INTEGER DEFAULT 0,
  total_badges_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- XP Audit Log (Track all XP gains)
CREATE TABLE IF NOT EXISTS public.xp_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'VOTE_AD', 'VOTE_ORGANIC', 'STREAK_BONUS', 'LEVEL_UP'
  xp_gained INTEGER NOT NULL,
  multiplier DECIMAL(3,2) DEFAULT 1.0,
  election_id UUID REFERENCES public.elections(id) ON DELETE SET NULL,
  is_sponsored BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Badge Definitions
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  requirement_type TEXT NOT NULL, -- 'VOTE_COUNT', 'STREAK', 'PREDICTION_ACCURACY', 'REFERRAL'
  requirement_value INTEGER NOT NULL,
  rarity_level TEXT DEFAULT 'COMMON', -- 'COMMON', 'RARE', 'EPIC', 'LEGENDARY'
  category TEXT NOT NULL, -- 'ADVERTISER_ADVOCATE', 'MARKET_RESEARCHER', 'BRAND_AMBASSADOR', 'ORACLE'
  xp_reward INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Badge Achievements
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  is_equipped BOOLEAN DEFAULT FALSE,
  progress_data JSONB DEFAULT '{}'::jsonb,
  UNIQUE(user_id, badge_id)
);

-- =====================================================
-- 2. SPONSORED ELECTIONS SCHEMA
-- =====================================================

-- Sponsored Elections (Ads as Elections)
CREATE TABLE IF NOT EXISTS public.sponsored_elections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE UNIQUE,
  brand_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ad_format_type TEXT NOT NULL, -- 'MARKET_RESEARCH', 'HYPE_PREDICTION', 'CSR'
  budget_total DECIMAL(12,2) NOT NULL,
  budget_spent DECIMAL(12,2) DEFAULT 0,
  cost_per_vote DECIMAL(8,2) NOT NULL,
  reward_multiplier DECIMAL(3,2) DEFAULT 2.0,
  target_audience_tags TEXT[] DEFAULT '{}',
  zone_targeting TEXT[] DEFAULT '{}', -- Purchasing power zones
  total_impressions INTEGER DEFAULT 0,
  total_engagements INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  generated_revenue DECIMAL(12,2) DEFAULT 0,
  status TEXT DEFAULT 'ACTIVE', -- 'ACTIVE', 'PAUSED', 'COMPLETED', 'BUDGET_EXHAUSTED'
  auction_bid_amount DECIMAL(8,2),
  frequency_cap INTEGER DEFAULT 3, -- Max times shown to same user
  conversion_pixel_url TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CPE Pricing Matrix (Zone-specific pricing)
CREATE TABLE IF NOT EXISTS public.cpe_pricing_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_name TEXT NOT NULL UNIQUE,
  zone_code TEXT NOT NULL UNIQUE,
  base_cpe DECIMAL(8,2) NOT NULL,
  premium_multiplier DECIMAL(3,2) DEFAULT 1.0,
  countries TEXT[] DEFAULT '{}',
  purchasing_power_index DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ad Auction Bids (Facebook-style bidding)
CREATE TABLE IF NOT EXISTS public.ad_auction_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsored_election_id UUID NOT NULL REFERENCES public.sponsored_elections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bid_amount DECIMAL(8,2) NOT NULL,
  auction_timestamp TIMESTAMPTZ DEFAULT NOW(),
  won BOOLEAN DEFAULT FALSE,
  impression_delivered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ad Frequency Caps (Prevent ad fatigue)
CREATE TABLE IF NOT EXISTS public.ad_frequency_caps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsored_election_id UUID NOT NULL REFERENCES public.sponsored_elections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  impression_count INTEGER DEFAULT 0,
  last_shown_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(sponsored_election_id, user_id)
);

-- Conversion Pixels (Track post-vote actions)
CREATE TABLE IF NOT EXISTS public.conversion_pixels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsored_election_id UUID NOT NULL REFERENCES public.sponsored_elections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pixel_fired_at TIMESTAMPTZ DEFAULT NOW(),
  conversion_type TEXT, -- 'WEBSITE_VISIT', 'PURCHASE', 'SIGNUP'
  conversion_value DECIMAL(10,2),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_user_gamification_user_id ON public.user_gamification(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_log_user_id ON public.xp_log(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_log_timestamp ON public.xp_log(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_sponsored_elections_brand_id ON public.sponsored_elections(brand_id);
CREATE INDEX IF NOT EXISTS idx_sponsored_elections_status ON public.sponsored_elections(status);
CREATE INDEX IF NOT EXISTS idx_ad_frequency_caps_user_id ON public.ad_frequency_caps(user_id);

-- =====================================================
-- 4. RLS POLICIES
-- =====================================================

-- User Gamification
ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own gamification data"
  ON public.user_gamification FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can update gamification data"
  ON public.user_gamification FOR ALL
  USING (true);

-- XP Log
ALTER TABLE public.xp_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own XP log"
  ON public.xp_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert XP log entries"
  ON public.xp_log FOR INSERT
  WITH CHECK (true);

-- Badges
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view badges"
  ON public.badges FOR SELECT
  USING (true);

-- User Badges
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own badges"
  ON public.user_badges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage user badges"
  ON public.user_badges FOR ALL
  USING (true);

-- Sponsored Elections
ALTER TABLE public.sponsored_elections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Brands can view their own sponsored elections"
  ON public.sponsored_elections FOR SELECT
  USING (auth.uid() = brand_id);

CREATE POLICY "Brands can create sponsored elections"
  ON public.sponsored_elections FOR INSERT
  WITH CHECK (auth.uid() = brand_id);

CREATE POLICY "Brands can update their own sponsored elections"
  ON public.sponsored_elections FOR UPDATE
  USING (auth.uid() = brand_id);

-- CPE Pricing Zones
ALTER TABLE public.cpe_pricing_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view CPE pricing zones"
  ON public.cpe_pricing_zones FOR SELECT
  USING (true);

-- =====================================================
-- 5. SEED DATA
-- =====================================================

-- Insert Default Badges
INSERT INTO public.badges (name, description, icon_url, requirement_type, requirement_value, rarity_level, category, xp_reward)
VALUES
  ('Advertiser Advocate I', 'Vote on 10 sponsored elections', 'https://api.dicebear.com/7.x/shapes/svg?seed=advocate1', 'VOTE_COUNT', 10, 'COMMON', 'ADVERTISER_ADVOCATE', 100),
  ('Advertiser Advocate II', 'Vote on 50 sponsored elections', 'https://api.dicebear.com/7.x/shapes/svg?seed=advocate2', 'VOTE_COUNT', 50, 'RARE', 'ADVERTISER_ADVOCATE', 500),
  ('Advertiser Advocate III', 'Vote on 100 sponsored elections', 'https://api.dicebear.com/7.x/shapes/svg?seed=advocate3', 'VOTE_COUNT', 100, 'EPIC', 'ADVERTISER_ADVOCATE', 1000),
  ('Market Researcher', 'Complete 25 market research elections', 'https://api.dicebear.com/7.x/shapes/svg?seed=researcher', 'VOTE_COUNT', 25, 'RARE', 'MARKET_RESEARCHER', 750),
  ('Brand Ambassador', 'Refer 5 users who vote on sponsored elections', 'https://api.dicebear.com/7.x/shapes/svg?seed=ambassador', 'REFERRAL', 5, 'EPIC', 'BRAND_AMBASSADOR', 2000),
  ('Oracle', 'Correctly predict 10 hype prediction outcomes', 'https://api.dicebear.com/7.x/shapes/svg?seed=oracle', 'PREDICTION_ACCURACY', 10, 'LEGENDARY', 'ORACLE', 5000),
  ('Streak Master', 'Maintain 30-day voting streak', 'https://api.dicebear.com/7.x/shapes/svg?seed=streak', 'STREAK', 30, 'EPIC', 'ADVERTISER_ADVOCATE', 3000)
ON CONFLICT (name) DO NOTHING;

-- Insert CPE Pricing Zones (8 Purchasing Power Zones)
INSERT INTO public.cpe_pricing_zones (zone_name, zone_code, base_cpe, premium_multiplier, countries, purchasing_power_index)
VALUES
  ('Premium Tier 1', 'PT1', 2.50, 1.5, ARRAY['US', 'CA', 'GB', 'AU', 'DE', 'FR'], 95.0),
  ('Premium Tier 2', 'PT2', 1.80, 1.3, ARRAY['JP', 'KR', 'IT', 'ES', 'NL'], 85.0),
  ('Mid Tier 1', 'MT1', 1.20, 1.2, ARRAY['BR', 'MX', 'AR', 'CL', 'PL'], 65.0),
  ('Mid Tier 2', 'MT2', 0.90, 1.1, ARRAY['TR', 'TH', 'MY', 'ZA', 'RO'], 55.0),
  ('Emerging Tier 1', 'ET1', 0.60, 1.0, ARRAY['IN', 'ID', 'PH', 'VN', 'EG'], 45.0),
  ('Emerging Tier 2', 'ET2', 0.40, 0.9, ARRAY['PK', 'BD', 'NG', 'KE', 'UA'], 35.0),
  ('Growth Tier 1', 'GT1', 0.25, 0.8, ARRAY['GH', 'TZ', 'UG', 'ET', 'MM'], 25.0),
  ('Growth Tier 2', 'GT2', 0.15, 0.7, ARRAY['NP', 'KH', 'LA', 'BF', 'ML'], 15.0)
ON CONFLICT (zone_code) DO NOTHING;

-- =====================================================
-- 6. FUNCTIONS & TRIGGERS
-- =====================================================

-- Function: Award XP and update gamification
CREATE OR REPLACE FUNCTION public.award_xp(
  p_user_id UUID,
  p_action_type TEXT,
  p_xp_amount INTEGER,
  p_multiplier DECIMAL DEFAULT 1.0,
  p_election_id UUID DEFAULT NULL,
  p_is_sponsored BOOLEAN DEFAULT FALSE
)
RETURNS VOID AS $$
DECLARE
  v_total_xp INTEGER;
  v_new_level INTEGER;
BEGIN
  -- Calculate total XP with multiplier
  v_total_xp := FLOOR(p_xp_amount * p_multiplier);

  -- Insert XP log entry
  INSERT INTO public.xp_log (user_id, action_type, xp_gained, multiplier, election_id, is_sponsored)
  VALUES (p_user_id, p_action_type, v_total_xp, p_multiplier, p_election_id, p_is_sponsored);

  -- Update user gamification
  INSERT INTO public.user_gamification (user_id, current_xp, last_activity_at)
  VALUES (p_user_id, v_total_xp, NOW())
  ON CONFLICT (user_id) DO UPDATE
  SET 
    current_xp = user_gamification.current_xp + v_total_xp,
    last_activity_at = NOW(),
    total_sponsored_votes = CASE WHEN p_is_sponsored THEN user_gamification.total_sponsored_votes + 1 ELSE user_gamification.total_sponsored_votes END,
    updated_at = NOW();

  -- Calculate new level (100 XP per level)
  SELECT FLOOR(current_xp / 100) + 1 INTO v_new_level
  FROM public.user_gamification
  WHERE user_id = p_user_id;

  -- Update level if changed
  UPDATE public.user_gamification
  SET level = v_new_level
  WHERE user_id = p_user_id AND level < v_new_level;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Update sponsored election revenue
CREATE OR REPLACE FUNCTION public.update_sponsored_election_revenue()
RETURNS TRIGGER AS $$
BEGIN
  -- Update sponsored election metrics when vote is cast
  IF EXISTS (SELECT 1 FROM public.sponsored_elections WHERE election_id = NEW.election_id) THEN
    UPDATE public.sponsored_elections
    SET 
      total_engagements = total_engagements + 1,
      budget_spent = budget_spent + cost_per_vote,
      generated_revenue = generated_revenue + cost_per_vote,
      engagement_rate = CASE 
        WHEN total_impressions > 0 THEN (total_engagements + 1)::DECIMAL / total_impressions * 100
        ELSE 0
      END,
      status = CASE 
        WHEN budget_spent + cost_per_vote >= budget_total THEN 'BUDGET_EXHAUSTED'
        ELSE status
      END,
      updated_at = NOW()
    WHERE election_id = NEW.election_id;

    -- Award XP to user with multiplier
    PERFORM public.award_xp(
      NEW.user_id,
      'VOTE_AD',
      50, -- Base XP for voting
      (SELECT reward_multiplier FROM public.sponsored_elections WHERE election_id = NEW.election_id),
      NEW.election_id,
      TRUE
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Update revenue on vote
DROP TRIGGER IF EXISTS trigger_update_sponsored_revenue ON public.votes;
CREATE TRIGGER trigger_update_sponsored_revenue
  AFTER INSERT ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_sponsored_election_revenue();

-- Function: Check badge eligibility
CREATE OR REPLACE FUNCTION public.check_badge_eligibility(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_badge RECORD;
  v_user_count INTEGER;
BEGIN
  FOR v_badge IN SELECT * FROM public.badges LOOP
    -- Check if user already has badge
    IF NOT EXISTS (SELECT 1 FROM public.user_badges WHERE user_id = p_user_id AND badge_id = v_badge.id) THEN
      -- Check eligibility based on requirement type
      CASE v_badge.requirement_type
        WHEN 'VOTE_COUNT' THEN
          SELECT COUNT(*) INTO v_user_count
          FROM public.xp_log
          WHERE user_id = p_user_id AND is_sponsored = TRUE;
          
          IF v_user_count >= v_badge.requirement_value THEN
            INSERT INTO public.user_badges (user_id, badge_id)
            VALUES (p_user_id, v_badge.id);
            
            -- Award badge XP
            PERFORM public.award_xp(p_user_id, 'BADGE_EARNED', v_badge.xp_reward, 1.0, NULL, FALSE);
          END IF;
        WHEN 'STREAK' THEN
          SELECT streak_count INTO v_user_count
          FROM public.user_gamification
          WHERE user_id = p_user_id;
          
          IF v_user_count >= v_badge.requirement_value THEN
            INSERT INTO public.user_badges (user_id, badge_id)
            VALUES (p_user_id, v_badge.id);
            
            PERFORM public.award_xp(p_user_id, 'BADGE_EARNED', v_badge.xp_reward, 1.0, NULL, FALSE);
          END IF;
      END CASE;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$
BEGIN
  RAISE NOTICE 'Gamification and Sponsored Elections schema created successfully';
END $$;