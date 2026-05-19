-- Migration: 20260515112639_add_identity_verification_settings.sql

-- Add verification settings to elections table
ALTER TABLE public.elections
ADD COLUMN IF NOT EXISTS require_identity_verification BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS identity_verification_methods TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS require_age_verification BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS age_verification_methods TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS waterfall_age_verification BOOLEAN DEFAULT false;

-- Add global verification toggles to platform_feature_toggles
INSERT INTO public.platform_feature_toggles (feature_name, feature_category, is_enabled, configuration)
VALUES 
    ('identity_verification_global', 'security', true, '{"markup_percentage": 20}'::jsonb),
    ('age_verification_global', 'security', true, '{}'::jsonb)
ON CONFLICT (feature_name) DO UPDATE 
SET 
    feature_category = EXCLUDED.feature_category,
    configuration = COALESCE(public.platform_feature_toggles.configuration, '{}'::jsonb) || EXCLUDED.configuration;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_elections_require_identity ON public.elections(require_identity_verification);
CREATE INDEX IF NOT EXISTS idx_elections_require_age ON public.elections(require_age_verification);
