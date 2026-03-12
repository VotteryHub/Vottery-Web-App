-- Content Distribution Control System Migration
-- Enables admin control over election vs social media content distribution

-- Create enum for content types
CREATE TYPE public.content_category AS ENUM ('election', 'social_media');

-- Create enum for distribution status
CREATE TYPE public.distribution_status AS ENUM ('active', 'paused', 'scheduled');

-- Main content distribution settings table
CREATE TABLE public.content_distribution_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    election_content_percentage INTEGER NOT NULL DEFAULT 50 CHECK (election_content_percentage >= 0 AND election_content_percentage <= 100),
    social_media_percentage INTEGER NOT NULL DEFAULT 50 CHECK (social_media_percentage >= 0 AND social_media_percentage <= 100),
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    algorithm_mode TEXT NOT NULL DEFAULT 'balanced',
    zone_specific_settings JSONB DEFAULT '{}'::jsonb,
    demographic_weights JSONB DEFAULT '{}'::jsonb,
    time_based_schedule JSONB DEFAULT '{}'::jsonb,
    emergency_freeze BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_percentage_sum CHECK (election_content_percentage + social_media_percentage = 100)
);

-- Distribution metrics tracking table
CREATE TABLE public.content_distribution_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    settings_id UUID REFERENCES public.content_distribution_settings(id) ON DELETE CASCADE,
    election_content_served INTEGER DEFAULT 0,
    social_media_content_served INTEGER DEFAULT 0,
    total_impressions INTEGER DEFAULT 0,
    election_engagement_rate NUMERIC(5,2) DEFAULT 0.00,
    social_media_engagement_rate NUMERIC(5,2) DEFAULT 0.00,
    average_session_duration INTEGER DEFAULT 0,
    bounce_rate NUMERIC(5,2) DEFAULT 0.00,
    conversion_rate NUMERIC(5,2) DEFAULT 0.00,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Distribution history/audit trail
CREATE TABLE public.content_distribution_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    settings_id UUID REFERENCES public.content_distribution_settings(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    previous_election_percentage INTEGER,
    new_election_percentage INTEGER,
    previous_social_percentage INTEGER,
    new_social_percentage INTEGER,
    previous_enabled BOOLEAN,
    new_enabled BOOLEAN,
    changed_by UUID REFERENCES public.user_profiles(id),
    reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Algorithm performance tracking
CREATE TABLE public.algorithm_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    algorithm_name TEXT NOT NULL,
    performance_score NUMERIC(5,2) DEFAULT 0.00,
    accuracy_rate NUMERIC(5,2) DEFAULT 0.00,
    user_satisfaction_score NUMERIC(5,2) DEFAULT 0.00,
    ab_test_group TEXT,
    sample_size INTEGER DEFAULT 0,
    recommendations JSONB DEFAULT '[]'::jsonb,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_content_distribution_settings_updated_at ON public.content_distribution_settings(updated_at DESC);
CREATE INDEX idx_content_distribution_metrics_timestamp ON public.content_distribution_metrics(timestamp DESC);
CREATE INDEX idx_content_distribution_metrics_settings_id ON public.content_distribution_metrics(settings_id);
CREATE INDEX idx_content_distribution_history_settings_id ON public.content_distribution_history(settings_id);
CREATE INDEX idx_content_distribution_history_created_at ON public.content_distribution_history(created_at DESC);
CREATE INDEX idx_algorithm_performance_timestamp ON public.algorithm_performance(timestamp DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_content_distribution_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Function to log distribution changes
CREATE OR REPLACE FUNCTION public.log_distribution_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        INSERT INTO public.content_distribution_history (
            settings_id,
            action_type,
            previous_election_percentage,
            new_election_percentage,
            previous_social_percentage,
            new_social_percentage,
            previous_enabled,
            new_enabled,
            changed_by
        ) VALUES (
            NEW.id,
            'update',
            OLD.election_content_percentage,
            NEW.election_content_percentage,
            OLD.social_media_percentage,
            NEW.social_media_percentage,
            OLD.is_enabled,
            NEW.is_enabled,
            NEW.updated_by
        );
    END IF;
    RETURN NEW;
END;
$$;

-- Enable RLS
ALTER TABLE public.content_distribution_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_distribution_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_distribution_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.algorithm_performance ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Admin only access)
CREATE POLICY "admin_full_access_content_distribution_settings"
ON public.content_distribution_settings
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

CREATE POLICY "admin_full_access_content_distribution_metrics"
ON public.content_distribution_metrics
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

CREATE POLICY "admin_view_content_distribution_history"
ON public.content_distribution_history
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() AND up.role = 'admin'
    )
);

CREATE POLICY "admin_view_algorithm_performance"
ON public.algorithm_performance
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() AND up.role = 'admin'
    )
);

-- Create triggers
CREATE TRIGGER update_content_distribution_settings_timestamp
    BEFORE UPDATE ON public.content_distribution_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_content_distribution_timestamp();

CREATE TRIGGER log_content_distribution_changes
    AFTER UPDATE ON public.content_distribution_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.log_distribution_change();

-- Insert initial default settings
DO $$
DECLARE
    admin_user_id UUID;
    settings_id UUID := gen_random_uuid();
BEGIN
    -- Get first admin user
    SELECT id INTO admin_user_id FROM public.user_profiles WHERE role = 'admin' LIMIT 1;
    
    IF admin_user_id IS NOT NULL THEN
        -- Create default distribution settings
        INSERT INTO public.content_distribution_settings (
            id,
            election_content_percentage,
            social_media_percentage,
            is_enabled,
            algorithm_mode,
            zone_specific_settings,
            demographic_weights,
            updated_by
        ) VALUES (
            settings_id,
            50,
            50,
            true,
            'balanced',
            '{
                "zone_1": {"election": 60, "social": 40},
                "zone_2": {"election": 45, "social": 55},
                "zone_3": {"election": 50, "social": 50},
                "zone_4": {"election": 55, "social": 45},
                "zone_5": {"election": 40, "social": 60},
                "zone_6": {"election": 50, "social": 50},
                "zone_7": {"election": 48, "social": 52},
                "zone_8": {"election": 52, "social": 48}
            }'::jsonb,
            '{
                "age_18_24": 1.2,
                "age_25_34": 1.0,
                "age_35_44": 0.9,
                "age_45_plus": 0.8
            }'::jsonb,
            admin_user_id
        );

        -- Create initial metrics
        INSERT INTO public.content_distribution_metrics (
            settings_id,
            election_content_served,
            social_media_content_served,
            total_impressions,
            election_engagement_rate,
            social_media_engagement_rate,
            average_session_duration,
            bounce_rate,
            conversion_rate
        ) VALUES (
            settings_id,
            12847,
            12653,
            25500,
            68.5,
            72.3,
            420,
            32.5,
            15.8
        );

        -- Create algorithm performance data
        INSERT INTO public.algorithm_performance (
            algorithm_name,
            performance_score,
            accuracy_rate,
            user_satisfaction_score,
            ab_test_group,
            sample_size,
            recommendations
        ) VALUES
            ('balanced_distribution_v1', 87.5, 92.3, 4.2, 'control', 5000, '["Increase election content during peak hours", "Optimize social media content for younger demographics"]'::jsonb),
            ('engagement_optimized_v2', 91.2, 94.1, 4.5, 'variant_a', 5000, '["Current settings performing well", "Consider A/B testing new ratios"]'::jsonb),
            ('demographic_weighted_v1', 89.8, 93.5, 4.3, 'variant_b', 5000, '["Strong performance in zone 1-3", "Adjust weights for zone 5-8"]'::jsonb);

        RAISE NOTICE 'Content distribution control system initialized successfully';
    ELSE
        RAISE NOTICE 'No admin user found. Please create admin user first.';
    END IF;
END $$;