-- Seed exhaustive platform feature toggles (one toggle per platform feature)
-- Uses feature_key if present, else feature_name. Idempotent.

-- Use category (renamed from feature_category in a prior migration) if present
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'platform_feature_toggles' AND column_name = 'category') THEN
    INSERT INTO public.platform_feature_toggles (feature_name, category, is_enabled)
    SELECT v.feature_name, v.cat, v.is_enabled FROM (VALUES
      ('election_creation', 'core'::text, true),
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
      ('predictive_analytics', 'analytics', true),
      ('participatory_advertising', 'payment', true),
      ('live_results', 'core', true),
      ('vote_change_approval', 'core', true),
      ('abstention_tracking', 'analytics', true),
      ('creator_success_academy', 'core', true),
      ('country_restrictions', 'security', true),
      ('platform_integrations', 'payment', true),
      ('notifications_resend', 'social', true),
      ('notifications_sms', 'social', true),
      ('google_analytics', 'analytics', true),
      ('content_moderation_webhooks', 'ai', true),
      ('vote_verification_portal', 'core', true),
      ('prediction_pools', 'core', true),
      ('multi_language', 'core', true)
    ) AS v(feature_name, cat, is_enabled)
    WHERE NOT EXISTS (SELECT 1 FROM public.platform_feature_toggles p WHERE p.feature_name = v.feature_name);
  ELSE
    INSERT INTO public.platform_feature_toggles (feature_name, feature_category, is_enabled)
    SELECT v.feature_name, v.cat, v.is_enabled FROM (VALUES
      ('election_creation', 'core'::text, true),
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
      ('predictive_analytics', 'analytics', true),
      ('participatory_advertising', 'payment', true),
      ('live_results', 'core', true),
      ('vote_change_approval', 'core', true),
      ('abstention_tracking', 'analytics', true),
      ('creator_success_academy', 'core', true),
      ('country_restrictions', 'security', true),
      ('platform_integrations', 'payment', true),
      ('notifications_resend', 'social', true),
      ('notifications_sms', 'social', true),
      ('google_analytics', 'analytics', true),
      ('content_moderation_webhooks', 'ai', true),
      ('vote_verification_portal', 'core', true),
      ('prediction_pools', 'core', true),
      ('multi_language', 'core', true)
    ) AS v(feature_name, cat, is_enabled)
    WHERE NOT EXISTS (SELECT 1 FROM public.platform_feature_toggles p WHERE p.feature_name = v.feature_name);
  END IF;
END $$;

-- Ensure feature_key is set for new rows (if column exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'platform_feature_toggles' AND column_name = 'feature_key') THEN
    UPDATE public.platform_feature_toggles
    SET feature_key = lower(replace(replace(feature_name, ' ', '_'), '-', '_'))
    WHERE feature_key IS NULL AND feature_name IS NOT NULL;
  END IF;
END $$;
