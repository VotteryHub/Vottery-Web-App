-- Topic Preference & Swipe System Migration
-- Supports cold-start recommendations and cross-domain feed ranking

-- Custom types
CREATE TYPE public.swipe_direction AS ENUM ('left', 'right', 'up', 'down');
CREATE TYPE public.content_item_type AS ENUM ('election', 'post', 'ad');
CREATE TYPE public.ranking_algorithm AS ENUM ('collaborative', 'content_based', 'hybrid', 'semantic');

-- Topic categories for preference collection
CREATE TABLE public.topic_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    icon_name TEXT,
    image_url TEXT,
    image_alt TEXT,
    parent_category_id UUID REFERENCES public.topic_categories(id) ON DELETE SET NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- User topic preferences (collected via swipe interface)
CREATE TABLE public.user_topic_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    topic_category_id UUID REFERENCES public.topic_categories(id) ON DELETE CASCADE,
    preference_score NUMERIC DEFAULT 0.00 CHECK (preference_score >= -1.0 AND preference_score <= 1.0),
    swipe_count INTEGER DEFAULT 0,
    positive_swipes INTEGER DEFAULT 0,
    negative_swipes INTEGER DEFAULT 0,
    engagement_depth NUMERIC DEFAULT 0.00,
    last_interaction_at TIMESTAMPTZ,
    temporal_weight NUMERIC DEFAULT 1.0,
    confidence_score NUMERIC DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, topic_category_id)
);

-- Swipe history with comprehensive engagement signals
CREATE TABLE public.swipe_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    topic_category_id UUID REFERENCES public.topic_categories(id) ON DELETE CASCADE,
    swipe_direction public.swipe_direction NOT NULL,
    swipe_velocity NUMERIC DEFAULT 0.00,
    dwell_time_ms INTEGER DEFAULT 0,
    hesitation_count INTEGER DEFAULT 0,
    hover_duration_ms INTEGER DEFAULT 0,
    card_interaction_depth INTEGER DEFAULT 0,
    device_type TEXT,
    session_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Feed ranking configuration
CREATE TABLE public.feed_ranking_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_name TEXT NOT NULL UNIQUE,
    algorithm_type public.ranking_algorithm DEFAULT 'hybrid'::public.ranking_algorithm,
    election_weight NUMERIC DEFAULT 0.4 CHECK (election_weight >= 0 AND election_weight <= 1),
    post_weight NUMERIC DEFAULT 0.4 CHECK (post_weight >= 0 AND post_weight <= 1),
    ad_weight NUMERIC DEFAULT 0.2 CHECK (ad_weight >= 0 AND ad_weight <= 1),
    semantic_matching_enabled BOOLEAN DEFAULT true,
    collaborative_filtering_enabled BOOLEAN DEFAULT true,
    diversity_factor NUMERIC DEFAULT 0.3,
    freshness_decay_hours INTEGER DEFAULT 24,
    personalization_strength NUMERIC DEFAULT 0.7,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Real-time feed rankings (updated via Supabase subscriptions + OpenAI)
CREATE TABLE public.feed_rankings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content_item_id UUID NOT NULL,
    content_item_type public.content_item_type NOT NULL,
    ranking_score NUMERIC DEFAULT 0.00,
    semantic_similarity_score NUMERIC DEFAULT 0.00,
    collaborative_score NUMERIC DEFAULT 0.00,
    engagement_prediction NUMERIC DEFAULT 0.00,
    topic_relevance_scores JSONB DEFAULT '{}'::jsonb,
    ranking_position INTEGER,
    config_id UUID REFERENCES public.feed_ranking_config(id) ON DELETE SET NULL,
    generated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- User engagement signals (for ML training)
CREATE TABLE public.user_engagement_signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content_item_id UUID NOT NULL,
    content_item_type public.content_item_type NOT NULL,
    engagement_type TEXT NOT NULL,
    engagement_value NUMERIC DEFAULT 1.0,
    dwell_time_ms INTEGER DEFAULT 0,
    interaction_depth INTEGER DEFAULT 0,
    session_id TEXT,
    device_type TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Recommendation performance tracking
CREATE TABLE public.recommendation_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    algorithm_type public.ranking_algorithm NOT NULL,
    accuracy_score NUMERIC DEFAULT 0.00,
    precision_score NUMERIC DEFAULT 0.00,
    recall_score NUMERIC DEFAULT 0.00,
    diversity_score NUMERIC DEFAULT 0.00,
    user_satisfaction_score NUMERIC DEFAULT 0.00,
    total_recommendations INTEGER DEFAULT 0,
    engaged_recommendations INTEGER DEFAULT 0,
    evaluation_period TEXT DEFAULT '24h'::text,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_user_topic_preferences_user_id ON public.user_topic_preferences(user_id);
CREATE INDEX idx_user_topic_preferences_topic_id ON public.user_topic_preferences(topic_category_id);
CREATE INDEX idx_swipe_history_user_id ON public.swipe_history(user_id);
CREATE INDEX idx_swipe_history_created_at ON public.swipe_history(created_at DESC);
CREATE INDEX idx_feed_rankings_user_id ON public.feed_rankings(user_id);
CREATE INDEX idx_feed_rankings_content ON public.feed_rankings(content_item_id, content_item_type);
CREATE INDEX idx_feed_rankings_score ON public.feed_rankings(ranking_score DESC);
CREATE INDEX idx_user_engagement_signals_user_id ON public.user_engagement_signals(user_id);
CREATE INDEX idx_user_engagement_signals_content ON public.user_engagement_signals(content_item_id, content_item_type);

-- Enable RLS
ALTER TABLE public.topic_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_topic_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swipe_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_ranking_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_engagement_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_performance ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Topic categories: Public read, admin write
CREATE POLICY "public_can_read_topic_categories"
ON public.topic_categories
FOR SELECT
TO public
USING (true);

CREATE POLICY "admins_manage_topic_categories"
ON public.topic_categories
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() AND up.role = 'admin'::public.user_role
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() AND up.role = 'admin'::public.user_role
    )
);

-- User topic preferences: Users manage their own
CREATE POLICY "users_manage_own_topic_preferences"
ON public.user_topic_preferences
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Swipe history: Users manage their own
CREATE POLICY "users_manage_own_swipe_history"
ON public.swipe_history
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Feed ranking config: Public read, admin write
CREATE POLICY "public_can_read_feed_ranking_config"
ON public.feed_ranking_config
FOR SELECT
TO public
USING (true);

CREATE POLICY "admins_manage_feed_ranking_config"
ON public.feed_ranking_config
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() AND up.role = 'admin'::public.user_role
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() AND up.role = 'admin'::public.user_role
    )
);

-- Feed rankings: Users see their own
CREATE POLICY "users_view_own_feed_rankings"
ON public.feed_rankings
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "system_manages_feed_rankings"
ON public.feed_rankings
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- User engagement signals: Users manage their own
CREATE POLICY "users_manage_own_engagement_signals"
ON public.user_engagement_signals
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Recommendation performance: Users see their own
CREATE POLICY "users_view_own_recommendation_performance"
ON public.recommendation_performance
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Mock data for topic categories
DO $$
DECLARE
    politics_id UUID := gen_random_uuid();
    tech_id UUID := gen_random_uuid();
    sports_id UUID := gen_random_uuid();
    entertainment_id UUID := gen_random_uuid();
    business_id UUID := gen_random_uuid();
    social_id UUID := gen_random_uuid();
    config_id UUID := gen_random_uuid();
BEGIN
    -- Insert topic categories
    INSERT INTO public.topic_categories (id, name, display_name, description, icon_name, image_url, image_alt, display_order) VALUES
        (politics_id, 'politics', 'Politics', 'Political elections, governance, and policy discussions', 'Vote', 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800', 'Political debate and voting imagery', 1),
        (tech_id, 'technology', 'Technology', 'Tech innovations, startups, and digital trends', 'Cpu', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800', 'Modern technology and innovation', 2),
        (sports_id, 'sports', 'Sports', 'Athletic competitions, teams, and sporting events', 'Trophy', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800', 'Sports competition and athletics', 3),
        (entertainment_id, 'entertainment', 'Entertainment', 'Movies, music, celebrities, and pop culture', 'Film', 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800', 'Entertainment and media content', 4),
        (business_id, 'business', 'Business', 'Entrepreneurship, finance, and market trends', 'Briefcase', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800', 'Business and finance imagery', 5),
        (social_id, 'social_issues', 'Social Issues', 'Community topics, social justice, and activism', 'Users', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800', 'Social activism and community', 6);

    -- Insert default feed ranking config
    INSERT INTO public.feed_ranking_config (id, config_name, algorithm_type, election_weight, post_weight, ad_weight, semantic_matching_enabled, is_active) VALUES
        (config_id, 'default_hybrid_ranking', 'hybrid'::public.ranking_algorithm, 0.4, 0.4, 0.2, true, true);

    RAISE NOTICE 'Topic preference and feed ranking system initialized successfully';
END $$;