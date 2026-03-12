-- =====================================================
-- ADVANCED MISSING FEATURES MIGRATION
-- Created: 2026-01-23 19:50:00
-- Purpose: Authentication methods, admin roles, election controls, analytics, community hub
-- =====================================================

-- 1. MULTIPLE AUTHENTICATION METHODS
-- =====================================================

-- Extend user_profiles with authentication preferences
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS preferred_auth_methods TEXT[] DEFAULT ARRAY['email_password']::TEXT[],
ADD COLUMN IF NOT EXISTS passkey_credentials JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS magic_link_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS oauth_providers JSONB DEFAULT '[]'::jsonb;

-- Authentication methods per election
ALTER TABLE public.elections
ADD COLUMN IF NOT EXISTS allowed_auth_methods TEXT[] DEFAULT ARRAY['email_password', 'passkey', 'magic_link', 'oauth']::TEXT[],
ADD COLUMN IF NOT EXISTS require_specific_auth BOOLEAN DEFAULT false;

-- 2. ADVANCED ELECTION CREATOR CONTROLS
-- =====================================================

ALTER TABLE public.elections
ADD COLUMN IF NOT EXISTS anonymous_voting_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS voter_approval_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS vote_editing_allowed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS vote_editing_requires_approval BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS edit_locked_after_first_vote BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS max_extension_months INTEGER DEFAULT 6,
ADD COLUMN IF NOT EXISTS first_vote_timestamp TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS abstention_tracking_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS tie_handling_method TEXT DEFAULT 'runoff' CHECK (tie_handling_method IN ('runoff', 'random', 'shared_win')),
ADD COLUMN IF NOT EXISTS otp_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS additional_email_verification BOOLEAN DEFAULT false;

-- Voter approval queue
CREATE TABLE IF NOT EXISTS public.voter_approval_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    requested_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES public.user_profiles(id),
    rejection_reason TEXT,
    UNIQUE(election_id, user_id)
);

-- Vote edit history
CREATE TABLE IF NOT EXISTS public.vote_edit_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vote_id UUID REFERENCES public.votes(id) ON DELETE CASCADE,
    election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    previous_vote_data JSONB NOT NULL,
    new_vote_data JSONB NOT NULL,
    edit_reason TEXT,
    approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    approved_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Abstention tracking
CREATE TABLE IF NOT EXISTS public.vote_abstentions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    abstention_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(election_id, user_id)
);

-- 3. MULTIPLE ADMIN ROLES SYSTEM
-- =====================================================

-- Admin roles enum
DO $$ BEGIN
    CREATE TYPE admin_role_type AS ENUM ('manager', 'auditor', 'editor', 'advertiser', 'analyst', 'moderator');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Admin roles table with granular permissions
CREATE TABLE IF NOT EXISTS public.admin_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name admin_role_type NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- User admin role assignments
CREATE TABLE IF NOT EXISTS public.user_admin_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    role_id UUID REFERENCES public.admin_roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES public.user_profiles(id),
    assigned_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, role_id)
);

-- 4. FEATURE/COUNTRY/INTEGRATION TOGGLE CONTROLS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.platform_feature_toggles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_name TEXT NOT NULL UNIQUE,
    feature_category TEXT NOT NULL CHECK (feature_category IN ('core', 'social', 'analytics', 'payment', 'ai', 'security')),
    is_enabled BOOLEAN DEFAULT true,
    enabled_countries TEXT[] DEFAULT ARRAY[]::TEXT[],
    disabled_countries TEXT[] DEFAULT ARRAY[]::TEXT[],
    configuration JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.country_access_controls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_code TEXT NOT NULL UNIQUE,
    country_name TEXT NOT NULL,
    is_enabled BOOLEAN DEFAULT true,
    restricted_features TEXT[] DEFAULT ARRAY[]::TEXT[],
    biometric_allowed BOOLEAN DEFAULT true,
    notes TEXT,
    updated_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.integration_controls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_name TEXT NOT NULL UNIQUE,
    integration_type TEXT NOT NULL CHECK (integration_type IN ('payment', 'ai', 'analytics', 'communication', 'advertising')),
    is_enabled BOOLEAN DEFAULT true,
    weekly_cost_limit DECIMAL(10, 2) DEFAULT 0.00,
    monthly_cost_limit DECIMAL(10, 2) DEFAULT 0.00,
    current_weekly_spend DECIMAL(10, 2) DEFAULT 0.00,
    current_monthly_spend DECIMAL(10, 2) DEFAULT 0.00,
    api_key_configured BOOLEAN DEFAULT false,
    configuration JSONB DEFAULT '{}'::jsonb,
    last_reset_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. COMPREHENSIVE ANALYTICS METRICS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.analytics_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_type TEXT NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(15, 4) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    time_period TEXT NOT NULL CHECK (time_period IN ('hourly', 'daily', 'weekly', 'monthly')),
    recorded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_metrics_type_period ON public.analytics_metrics(metric_type, time_period, recorded_at);

-- 6. COMMUNITY ELECTIONS HUB
-- =====================================================

CREATE TABLE IF NOT EXISTS public.community_spaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    topic_category TEXT NOT NULL,
    cover_image TEXT,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    member_count INTEGER DEFAULT 0,
    election_count INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT true,
    moderation_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.community_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID REFERENCES public.community_spaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(community_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.community_elections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID REFERENCES public.community_spaces(id) ON DELETE CASCADE,
    election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(community_id, election_id)
);

-- 7. INDEXES
-- =====================================================

CREATE INDEX idx_voter_approval_election ON public.voter_approval_queue(election_id, status);
CREATE INDEX idx_voter_approval_user ON public.voter_approval_queue(user_id);
CREATE INDEX idx_vote_edit_history_vote ON public.vote_edit_history(vote_id);
CREATE INDEX idx_vote_edit_history_election ON public.vote_edit_history(election_id);
CREATE INDEX idx_vote_abstentions_election ON public.vote_abstentions(election_id);
CREATE INDEX idx_user_admin_roles_user ON public.user_admin_roles(user_id);
CREATE INDEX idx_user_admin_roles_role ON public.user_admin_roles(role_id);
CREATE INDEX idx_community_members_community ON public.community_members(community_id);
CREATE INDEX idx_community_members_user ON public.community_members(user_id);
CREATE INDEX idx_community_elections_community ON public.community_elections(community_id);

-- 8. RLS POLICIES
-- =====================================================

-- Voter approval queue
ALTER TABLE public.voter_approval_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own approval requests"
ON public.voter_approval_queue FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create approval requests"
ON public.voter_approval_queue FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Vote edit history
ALTER TABLE public.vote_edit_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own edit history"
ON public.vote_edit_history FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create edit requests"
ON public.vote_edit_history FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Vote abstentions
ALTER TABLE public.vote_abstentions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own abstentions"
ON public.vote_abstentions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create abstentions"
ON public.vote_abstentions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admin roles
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view admin roles"
ON public.admin_roles FOR SELECT
USING (true);

-- User admin roles
ALTER TABLE public.user_admin_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own admin roles"
ON public.user_admin_roles FOR SELECT
USING (auth.uid() = user_id);

-- Platform feature toggles
ALTER TABLE public.platform_feature_toggles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view feature toggles"
ON public.platform_feature_toggles FOR SELECT
USING (true);

-- Country access controls
ALTER TABLE public.country_access_controls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view country controls"
ON public.country_access_controls FOR SELECT
USING (true);

-- Integration controls
ALTER TABLE public.integration_controls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view integration controls"
ON public.integration_controls FOR SELECT
USING (true);

-- Analytics metrics
ALTER TABLE public.analytics_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view analytics metrics"
ON public.analytics_metrics FOR SELECT
USING (true);

-- Community spaces
ALTER TABLE public.community_spaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view public communities"
ON public.community_spaces FOR SELECT
USING (is_public = true OR auth.uid() = created_by);

CREATE POLICY "Users can create communities"
ON public.community_spaces FOR INSERT
WITH CHECK (auth.uid() = created_by);

-- Community members
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view community members"
ON public.community_members FOR SELECT
USING (true);

CREATE POLICY "Users can join communities"
ON public.community_members FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Community elections
ALTER TABLE public.community_elections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view community elections"
ON public.community_elections FOR SELECT
USING (true);

-- 9. INSERT DEFAULT DATA
-- =====================================================

-- Default admin roles with permissions
INSERT INTO public.admin_roles (role_name, display_name, description, permissions)
VALUES
('manager', 'Manager', 'Full system access with all permissions', '{"users": ["view", "create", "edit", "delete"], "elections": ["view", "create", "edit", "delete", "approve"], "revenue": ["view", "edit"], "settings": ["view", "edit"], "analytics": ["view", "export"], "moderation": ["view", "action"]}'::jsonb),
('auditor', 'Auditor', 'Read-only access with audit tools', '{"users": ["view"], "elections": ["view", "audit"], "revenue": ["view"], "settings": ["view"], "analytics": ["view", "export"], "moderation": ["view"]}'::jsonb),
('editor', 'Editor', 'Content management permissions', '{"users": ["view"], "elections": ["view", "edit"], "revenue": ["view"], "settings": ["view"], "analytics": ["view"], "moderation": ["view", "action"]}'::jsonb),
('advertiser', 'Advertiser', 'Campaign and advertising controls', '{"users": ["view"], "elections": ["view"], "revenue": ["view"], "settings": ["view"], "analytics": ["view"], "campaigns": ["view", "create", "edit", "delete"]}'::jsonb),
('analyst', 'Analyst', 'Analytics and reporting access', '{"users": ["view"], "elections": ["view"], "revenue": ["view"], "settings": ["view"], "analytics": ["view", "export", "advanced"]}'::jsonb),
('moderator', 'Moderator', 'Content moderation permissions', '{"users": ["view"], "elections": ["view"], "revenue": ["view"], "settings": ["view"], "analytics": ["view"], "moderation": ["view", "action"]}'::jsonb)
ON CONFLICT (role_name) DO NOTHING;

-- Default integration controls
INSERT INTO public.integration_controls (integration_name, integration_type, is_enabled, weekly_cost_limit, monthly_cost_limit, api_key_configured)
VALUES
('Stripe', 'payment', true, 10000.00, 40000.00, true),
('OpenAI', 'ai', true, 500.00, 2000.00, true),
('Claude', 'ai', true, 500.00, 2000.00, true),
('Perplexity', 'ai', true, 300.00, 1200.00, true),
('Google Analytics', 'analytics', true, 0.00, 0.00, true),
('Resend', 'communication', true, 200.00, 800.00, true),
('Twilio', 'communication', true, 300.00, 1200.00, false),
('Google AdSense', 'advertising', true, 0.00, 0.00, true)
ON CONFLICT (integration_name) DO NOTHING;

-- Default feature toggles
INSERT INTO public.platform_feature_toggles (feature_name, feature_category, is_enabled)
VALUES
('election_creation', 'core', true),
('gamified_elections', 'core', true),
('social_sharing', 'social', true),
('comments_system', 'social', true),
('emoji_reactions', 'social', true),
('direct_messaging', 'social', true),
('ai_content_moderation', 'ai', true),
('ai_fraud_detection', 'ai', true),
('biometric_voting', 'security', true),
('blockchain_verification', 'security', true),
('stripe_payments', 'payment', true),
('wallet_system', 'payment', true),
('advanced_analytics', 'analytics', true),
('predictive_analytics', 'analytics', true)
ON CONFLICT (feature_name) DO NOTHING;

-- Sample country access controls (top 20 countries)
INSERT INTO public.country_access_controls (country_code, country_name, is_enabled, biometric_allowed)
VALUES
('US', 'United States', true, true),
('CA', 'Canada', true, true),
('GB', 'United Kingdom', true, true),
('AU', 'Australia', true, true),
('DE', 'Germany', true, false),
('FR', 'France', true, false),
('IT', 'Italy', true, false),
('ES', 'Spain', true, false),
('NL', 'Netherlands', true, false),
('SE', 'Sweden', true, false),
('IN', 'India', true, true),
('CN', 'China', true, true),
('JP', 'Japan', true, true),
('KR', 'South Korea', true, true),
('BR', 'Brazil', true, true),
('MX', 'Mexico', true, true),
('AR', 'Argentina', true, true),
('ZA', 'South Africa', true, true),
('NG', 'Nigeria', true, true),
('EG', 'Egypt', true, true)
ON CONFLICT (country_code) DO NOTHING;