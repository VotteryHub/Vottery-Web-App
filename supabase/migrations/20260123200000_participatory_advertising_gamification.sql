-- =====================================================
-- PARTICIPATORY ADVERTISING & GAMIFICATION SCHEMA
-- Implements Facebook-style ads mechanism with gamified engagement
-- =====================================================

-- =====================================================
-- 1. GAMIFICATION SYSTEM
-- =====================================================

-- User Gamification Status (XP, Levels, Streaks)
CREATE TABLE IF NOT EXISTS public.user_gamification (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    current_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak_count INTEGER DEFAULT 0,
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    streak_freeze_used BOOLEAN DEFAULT FALSE,
    total_votes INTEGER DEFAULT 0,
    total_sponsored_votes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- XP Audit Log
CREATE TABLE IF NOT EXISTS public.xp_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL, -- 'VOTE_ORGANIC', 'VOTE_SPONSORED', 'DAILY_LOGIN', 'STREAK_BONUS'
    xp_gained INTEGER NOT NULL,
    election_id UUID REFERENCES public.elections(id) ON DELETE SET NULL,
    multiplier DECIMAL(3,1) DEFAULT 1.0,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Badge Definitions
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    requirement_type TEXT NOT NULL, -- 'PREDICTION_CORRECT', 'VOTE_COUNT', 'STREAK', 'SPECIAL'
    requirement_value INTEGER,
    rarity_level TEXT DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Badge Achievements
CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    is_equipped BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, badge_id)
);

-- =====================================================
-- 2. SPONSORED ELECTIONS (PARTICIPATORY ADS)
-- =====================================================

-- Ad Format Types
CREATE TYPE ad_format_type AS ENUM ('MARKET_RESEARCH', 'HYPE_PREDICTION', 'CSR');

-- Sponsored Elections (The Core Ad System)
CREATE TABLE IF NOT EXISTS public.sponsored_elections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE UNIQUE,
    brand_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    ad_format ad_format_type NOT NULL,
    budget_total DECIMAL(12,2) NOT NULL,
    budget_spent DECIMAL(12,2) DEFAULT 0,
    cost_per_vote DECIMAL(8,2) NOT NULL, -- CPE (Cost Per Engagement)
    reward_multiplier DECIMAL(3,1) DEFAULT 2.0, -- XP multiplier for users
    target_audience_tags TEXT[], -- ['crypto', 'gaming', 'fashion']
    total_impressions INTEGER DEFAULT 0,
    total_engagements INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active', -- 'active', 'paused', 'completed', 'budget_exhausted'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auction Bidding System (Facebook-style)
CREATE TABLE IF NOT EXISTS public.ad_auction_bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sponsored_election_id UUID NOT NULL REFERENCES public.sponsored_elections(id) ON DELETE CASCADE,
    bid_amount DECIMAL(8,2) NOT NULL,
    target_cpe DECIMAL(8,2) NOT NULL, -- Target Cost Per Engagement
    bid_strategy TEXT DEFAULT 'lowest_cost', -- 'lowest_cost', 'target_cost', 'cost_cap'
    daily_budget DECIMAL(10,2),
    lifetime_budget DECIMAL(12,2),
    bid_status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Frequency Capping (Prevent Ad Fatigue)
CREATE TABLE IF NOT EXISTS public.ad_frequency_caps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sponsored_election_id UUID NOT NULL REFERENCES public.sponsored_elections(id) ON DELETE CASCADE,
    max_impressions_per_user INTEGER DEFAULT 3,
    time_window_hours INTEGER DEFAULT 24,
    max_engagements_per_user INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Ad Impressions Tracking
CREATE TABLE IF NOT EXISTS public.user_ad_impressions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sponsored_election_id UUID NOT NULL REFERENCES public.sponsored_elections(id) ON DELETE CASCADE,
    impression_count INTEGER DEFAULT 1,
    last_impression_at TIMESTAMPTZ DEFAULT NOW(),
    engaged BOOLEAN DEFAULT FALSE,
    engaged_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversion Pixels (Track Brand Actions)
CREATE TABLE IF NOT EXISTS public.conversion_pixels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sponsored_election_id UUID NOT NULL REFERENCES public.sponsored_elections(id) ON DELETE CASCADE,
    pixel_name TEXT NOT NULL,
    event_type TEXT NOT NULL, -- 'PAGE_VIEW', 'ADD_TO_CART', 'PURCHASE', 'SIGN_UP'
    conversion_value DECIMAL(10,2),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    tracked_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. REVENUE REPORTING TABLES
-- =====================================================

-- Brand Revenue Summary (Materialized View Alternative)
CREATE TABLE IF NOT EXISTS public.brand_revenue_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
    total_spent DECIMAL(12,2) DEFAULT 0,
    total_engagements INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0,
    avg_cpe DECIMAL(8,2) DEFAULT 0,
    roi_score DECIMAL(8,2) DEFAULT 0,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(brand_id, election_id)
);

-- =====================================================
-- 4. INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_user_gamification_user_id ON public.user_gamification(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_log_user_id ON public.xp_log(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_log_timestamp ON public.xp_log(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_sponsored_elections_brand_id ON public.sponsored_elections(brand_id);
CREATE INDEX IF NOT EXISTS idx_sponsored_elections_status ON public.sponsored_elections(status);
CREATE INDEX IF NOT EXISTS idx_user_ad_impressions_user_id ON public.user_ad_impressions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_ad_impressions_sponsored_election_id ON public.user_ad_impressions(sponsored_election_id);

-- =====================================================
-- 5. RLS POLICIES
-- =====================================================

-- User Gamification
ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own gamification" ON public.user_gamification FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view others gamification" ON public.user_gamification FOR SELECT USING (true);
CREATE POLICY "System can update gamification" ON public.user_gamification FOR ALL USING (true);

-- XP Log
ALTER TABLE public.xp_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own xp log" ON public.xp_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert xp log" ON public.xp_log FOR INSERT WITH CHECK (true);

-- Badges
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view badges" ON public.badges FOR SELECT USING (true);

-- User Badges
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all badges" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "Users can update own badges" ON public.user_badges FOR UPDATE USING (auth.uid() = user_id);

-- Sponsored Elections
ALTER TABLE public.sponsored_elections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brands can view own sponsored elections" ON public.sponsored_elections FOR SELECT USING (auth.uid() = brand_id);
CREATE POLICY "Brands can manage own sponsored elections" ON public.sponsored_elections FOR ALL USING (auth.uid() = brand_id);
CREATE POLICY "Users can view active sponsored elections" ON public.sponsored_elections FOR SELECT USING (status = 'active');

-- Ad Auction Bids
ALTER TABLE public.ad_auction_bids ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brands can manage own bids" ON public.ad_auction_bids FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.sponsored_elections se
        WHERE se.id = ad_auction_bids.sponsored_election_id
        AND se.brand_id = auth.uid()
    )
);

-- Ad Frequency Caps
ALTER TABLE public.ad_frequency_caps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brands can manage frequency caps" ON public.ad_frequency_caps FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.sponsored_elections se
        WHERE se.id = ad_frequency_caps.sponsored_election_id
        AND se.brand_id = auth.uid()
    )
);

-- User Ad Impressions
ALTER TABLE public.user_ad_impressions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own impressions" ON public.user_ad_impressions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can track impressions" ON public.user_ad_impressions FOR ALL USING (true);

-- Conversion Pixels
ALTER TABLE public.conversion_pixels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brands can view own conversions" ON public.conversion_pixels FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.sponsored_elections se
        WHERE se.id = conversion_pixels.sponsored_election_id
        AND se.brand_id = auth.uid()
    )
);

-- Brand Revenue Summary
ALTER TABLE public.brand_revenue_summary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brands can view own revenue" ON public.brand_revenue_summary FOR SELECT USING (auth.uid() = brand_id);

-- =====================================================
-- 6. SEED DATA - DEFAULT BADGES
-- =====================================================

INSERT INTO public.badges (name, description, icon_url, requirement_type, requirement_value, rarity_level)
VALUES 
    ('Oracle', 'Correctly predicted 10 election outcomes', 'https://api.dicebear.com/7.x/shapes/svg?seed=oracle', 'PREDICTION_CORRECT', 10, 'rare'),
    ('Film Buff', 'Voted on 50 movie trailer elections', 'https://api.dicebear.com/7.x/shapes/svg?seed=film', 'VOTE_COUNT', 50, 'common'),
    ('Streak Master', 'Maintained 30-day voting streak', 'https://api.dicebear.com/7.x/shapes/svg?seed=streak', 'STREAK', 30, 'epic'),
    ('Market Researcher', 'Participated in 100 brand research elections', 'https://api.dicebear.com/7.x/shapes/svg?seed=research', 'VOTE_COUNT', 100, 'rare'),
    ('Early Adopter', 'First 1000 users on platform', 'https://api.dicebear.com/7.x/shapes/svg?seed=early', 'SPECIAL', 0, 'legendary'),
    ('Engagement Champion', 'Earned 10,000 XP', 'https://api.dicebear.com/7.x/shapes/svg?seed=champion', 'VOTE_COUNT', 500, 'epic')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 7. FUNCTIONS FOR AUTOMATION
-- =====================================================

-- Function: Award XP and Update Gamification
CREATE OR REPLACE FUNCTION public.award_xp(
    p_user_id UUID,
    p_action_type TEXT,
    p_xp_amount INTEGER,
    p_election_id UUID DEFAULT NULL,
    p_multiplier DECIMAL DEFAULT 1.0
)
RETURNS VOID AS $$
DECLARE
    v_total_xp INTEGER;
    v_new_level INTEGER;
BEGIN
    -- Insert XP log
    INSERT INTO public.xp_log (user_id, action_type, xp_gained, election_id, multiplier)
    VALUES (p_user_id, p_action_type, p_xp_amount, p_election_id, p_multiplier);
    
    -- Update user gamification
    UPDATE public.user_gamification
    SET 
        current_xp = current_xp + p_xp_amount,
        total_votes = total_votes + CASE WHEN p_action_type LIKE 'VOTE%' THEN 1 ELSE 0 END,
        total_sponsored_votes = total_sponsored_votes + CASE WHEN p_action_type = 'VOTE_SPONSORED' THEN 1 ELSE 0 END,
        last_activity_at = NOW(),
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    -- Calculate new level (100 XP per level)
    SELECT current_xp, FLOOR(current_xp / 100) + 1
    INTO v_total_xp, v_new_level
    FROM public.user_gamification
    WHERE user_id = p_user_id;
    
    -- Update level if changed
    UPDATE public.user_gamification
    SET level = v_new_level
    WHERE user_id = p_user_id AND level < v_new_level;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Update Sponsored Election Budget
CREATE OR REPLACE FUNCTION public.update_sponsored_budget()
RETURNS TRIGGER AS $$
BEGIN
    -- Update budget spent when vote is cast
    IF NEW.is_sponsored = TRUE THEN
        UPDATE public.sponsored_elections
        SET 
            budget_spent = budget_spent + cost_per_vote,
            total_engagements = total_engagements + 1,
            status = CASE 
                WHEN budget_spent + cost_per_vote >= budget_total THEN 'budget_exhausted'
                ELSE status
            END,
            updated_at = NOW()
        WHERE election_id = NEW.election_id;
        
        -- Update revenue summary
        INSERT INTO public.brand_revenue_summary (brand_id, election_id, total_spent, total_engagements)
        SELECT 
            se.brand_id,
            se.election_id,
            se.cost_per_vote,
            1
        FROM public.sponsored_elections se
        WHERE se.election_id = NEW.election_id
        ON CONFLICT (brand_id, election_id) DO UPDATE
        SET 
            total_spent = brand_revenue_summary.total_spent + EXCLUDED.total_spent,
            total_engagements = brand_revenue_summary.total_engagements + 1,
            last_updated = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Update budget on vote
DROP TRIGGER IF EXISTS trigger_update_sponsored_budget ON public.votes;
CREATE TRIGGER trigger_update_sponsored_budget
AFTER INSERT ON public.votes
FOR EACH ROW
EXECUTE FUNCTION public.update_sponsored_budget();

-- =====================================================
-- 8. ADD is_sponsored FLAG TO VOTES TABLE
-- =====================================================

ALTER TABLE public.votes ADD COLUMN IF NOT EXISTS is_sponsored BOOLEAN DEFAULT FALSE;
CREATE INDEX IF NOT EXISTS idx_votes_is_sponsored ON public.votes(is_sponsored);

-- =====================================================
-- 9. ADD is_sponsored FLAG TO ELECTIONS TABLE
-- =====================================================

ALTER TABLE public.elections ADD COLUMN IF NOT EXISTS is_sponsored BOOLEAN DEFAULT FALSE;
CREATE INDEX IF NOT EXISTS idx_elections_is_sponsored ON public.elections(is_sponsored);

RAISE NOTICE 'Participatory Advertising & Gamification schema created successfully';