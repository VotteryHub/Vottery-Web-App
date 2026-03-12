-- =====================================================
-- COMPREHENSIVE MISSING FEATURES MIGRATION
-- Created: 2026-01-23 18:20:00
-- Purpose: Add comments system, social sharing, revenue streams, and 3D slot machine data
-- =====================================================

-- 1. COMMENTS SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type TEXT NOT NULL CHECK (content_type IN ('election', 'post')),
    content_id UUID NOT NULL,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    is_edited BOOLEAN DEFAULT false,
    edited_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Comments enabled control for elections
ALTER TABLE public.elections
ADD COLUMN IF NOT EXISTS comments_enabled BOOLEAN DEFAULT true;

-- 2. SOCIAL SHARING TRACKING
-- =====================================================

CREATE TABLE IF NOT EXISTS public.social_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type TEXT NOT NULL CHECK (content_type IN ('election', 'post')),
    content_id UUID NOT NULL,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('whatsapp', 'facebook', 'twitter', 'linkedin', 'telegram', 'general')),
    share_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. SOCIAL EMOJI REACTIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.content_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type TEXT NOT NULL CHECK (content_type IN ('election', 'post', 'comment')),
    content_id UUID NOT NULL,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    reaction_emoji TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(content_type, content_id, user_id, reaction_emoji)
);

-- 4. REVENUE STREAMS MANAGEMENT
-- =====================================================

CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_name TEXT NOT NULL,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('individual', 'organization')),
    price DECIMAL(10, 2) NOT NULL,
    duration TEXT NOT NULL CHECK (duration IN ('pay_as_you_go', 'monthly', '3_months', 'half_yearly', 'annual')),
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE CASCADE,
    subscriber_type TEXT NOT NULL CHECK (subscriber_type IN ('individual', 'organization')),
    start_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    auto_renew BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.platform_revenue_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    revenue_type TEXT NOT NULL CHECK (revenue_type IN ('participation_fee', 'subscription', 'advertising', 'premium_features')),
    processing_fee_percentage DECIMAL(5, 2) DEFAULT 7.00,
    is_enabled BOOLEAN DEFAULT true,
    configuration JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. 3D SLOT MACHINE DATA
-- =====================================================

CREATE TABLE IF NOT EXISTS public.slot_machine_animations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE UNIQUE,
    is_spinning BOOLEAN DEFAULT false,
    spin_start_time TIMESTAMPTZ,
    current_display_numbers TEXT[] DEFAULT ARRAY[]::TEXT[],
    animation_speed INTEGER DEFAULT 100,
    winner_reveal_sequence JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. SUGGESTED CONTENT ALGORITHM
-- =====================================================

CREATE TABLE IF NOT EXISTS public.suggested_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL CHECK (content_type IN ('election', 'friend', 'page', 'group', 'event')),
    content_id UUID NOT NULL,
    relevance_score DECIMAL(5, 2) DEFAULT 0.00,
    reason TEXT,
    is_dismissed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP + INTERVAL '7 days'
);

-- 7. INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_comments_content ON public.comments(content_type, content_id);
CREATE INDEX idx_comments_user ON public.comments(user_id);
CREATE INDEX idx_comments_parent ON public.comments(parent_comment_id);
CREATE INDEX idx_social_shares_content ON public.social_shares(content_type, content_id);
CREATE INDEX idx_social_shares_user ON public.social_shares(user_id);
CREATE INDEX idx_content_reactions_content ON public.content_reactions(content_type, content_id);
CREATE INDEX idx_content_reactions_user ON public.content_reactions(user_id);
CREATE INDEX idx_user_subscriptions_user ON public.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_plan ON public.user_subscriptions(plan_id);
CREATE INDEX idx_slot_machine_election ON public.slot_machine_animations(election_id);
CREATE INDEX idx_suggested_content_user ON public.suggested_content(user_id);
CREATE INDEX idx_suggested_content_type ON public.suggested_content(content_type, content_id);

-- 8. RLS POLICIES
-- =====================================================

-- Comments policies
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all comments"
ON public.comments FOR SELECT
USING (true);

CREATE POLICY "Users can create comments"
ON public.comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
ON public.comments FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
ON public.comments FOR DELETE
USING (auth.uid() = user_id);

-- Social shares policies
ALTER TABLE public.social_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all shares"
ON public.social_shares FOR SELECT
USING (true);

CREATE POLICY "Users can create shares"
ON public.social_shares FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Content reactions policies
ALTER TABLE public.content_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all reactions"
ON public.content_reactions FOR SELECT
USING (true);

CREATE POLICY "Users can create reactions"
ON public.content_reactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reactions"
ON public.content_reactions FOR DELETE
USING (auth.uid() = user_id);

-- Subscription plans policies
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view active plans"
ON public.subscription_plans FOR SELECT
USING (is_active = true);

-- User subscriptions policies
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
ON public.user_subscriptions FOR SELECT
USING (auth.uid() = user_id);

-- Platform revenue config policies
ALTER TABLE public.platform_revenue_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view revenue config"
ON public.platform_revenue_config FOR SELECT
USING (true);

-- Slot machine animations policies
ALTER TABLE public.slot_machine_animations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view slot machine animations"
ON public.slot_machine_animations FOR SELECT
USING (true);

-- Suggested content policies
ALTER TABLE public.suggested_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own suggestions"
ON public.suggested_content FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own suggestions"
ON public.suggested_content FOR UPDATE
USING (auth.uid() = user_id);

-- 9. INSERT DEFAULT DATA
-- =====================================================

-- Default subscription plans
INSERT INTO public.subscription_plans (plan_name, plan_type, price, duration, features, is_active)
VALUES
('Individual Monthly', 'individual', 9.99, 'monthly', '["Create unlimited elections", "Advanced analytics", "Priority support"]'::jsonb, true),
('Individual Annual', 'individual', 99.99, 'annual', '["Create unlimited elections", "Advanced analytics", "Priority support", "20% discount"]'::jsonb, true),
('Organization Monthly', 'organization', 49.99, 'monthly', '["Team collaboration", "Branded elections", "Advanced analytics", "API access", "Dedicated support"]'::jsonb, true),
('Organization Annual', 'organization', 499.99, 'annual', '["Team collaboration", "Branded elections", "Advanced analytics", "API access", "Dedicated support", "20% discount"]'::jsonb, true)
ON CONFLICT DO NOTHING;

-- Default revenue configuration
INSERT INTO public.platform_revenue_config (revenue_type, processing_fee_percentage, is_enabled, configuration)
VALUES
('participation_fee', 7.00, true, '{"description": "Processing fee for election participation", "includes": ["Payment processing", "Pricing regionalization", "Invoicing", "Payment recovery", "Participant support"]}'::jsonb),
('subscription', 0.00, true, '{"description": "Subscription revenue", "includes": ["Platform access", "Premium features"]}'::jsonb),
('advertising', 15.00, true, '{"description": "Advertiser campaign fees", "includes": ["Ad placement", "Analytics", "Campaign management"]}'::jsonb),
('premium_features', 10.00, true, '{"description": "Premium feature fees", "includes": ["Advanced customization", "Priority processing"]}'::jsonb)
ON CONFLICT DO NOTHING;