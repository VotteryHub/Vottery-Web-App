-- Alter platform_feature_toggles table to support new schema
ALTER TABLE public.platform_feature_toggles 
  ADD COLUMN IF NOT EXISTS feature_key TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS requires_subscription BOOLEAN DEFAULT false;

-- Rename feature_category to category for consistency
ALTER TABLE public.platform_feature_toggles 
  RENAME COLUMN feature_category TO category;

-- Update existing rows to have feature_key based on feature_name
UPDATE public.platform_feature_toggles 
SET feature_key = lower(replace(feature_name, ' ', '_'))
WHERE feature_key IS NULL;

-- Add Participatory Advertising feature to platform_feature_toggles
INSERT INTO public.platform_feature_toggles (
    feature_key,
    feature_name,
    description,
    category,
    is_enabled,
    requires_subscription
)
VALUES (
    'participatory_advertising',
    'Participatory Advertising (Gamified Ads)',
    'Facebook-style auction bidding system with gamified sponsored elections, frequency capping, CPE pricing, and brand analytics dashboard',
    'payment',
    true,
    false
)
ON CONFLICT (feature_key) DO UPDATE
SET 
    feature_name = EXCLUDED.feature_name,
    description = EXCLUDED.description,
    category = EXCLUDED.category;

DO $$
BEGIN
  RAISE NOTICE 'Platform feature toggles table updated with new schema';
  RAISE NOTICE 'Participatory Advertising feature toggle added successfully';
END $$;