-- Seed domain-level platform feature toggles for strategic launch control.
-- Each toggle controls a major domain from the Comprehensive Feature Audit.
-- Idempotent: only inserts when feature_name does not exist.
-- Categories allowed: core, social, analytics, payment, ai, security

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'platform_feature_toggles' AND column_name = 'category') THEN
    INSERT INTO public.platform_feature_toggles (feature_name, category, is_enabled)
    SELECT v.feature_name, v.cat, v.is_enabled FROM (VALUES
      -- General users
      ('onboarding_wizard', 'core'::text, false),
      ('search_discovery_hub', 'core', false),
      ('accessibility_localization', 'core', true),
      ('user_feedback_portal', 'social', false),
      ('collaborative_voting_room', 'core', false),
      ('location_based_voting', 'core', false),
      ('external_voter_gate', 'core', false),
      ('plus_minus_voting', 'core', false),
      ('mcq_pre_voting_interface', 'core', false),
      ('groups_communities', 'social', false),
      ('moments_jolts_content', 'social', false),
      ('push_notifications', 'social', false),
      ('real_time_winner_notifications', 'social', false),
      -- Creator
      ('creator_monetization_studio', 'payment', false),
      ('creator_earnings_command_center', 'payment', false),
      ('creator_analytics_growth', 'analytics', false),
      ('moments_jolts_studio', 'core', false),
      ('carousel_premium_management', 'core', false),
      ('creator_compliance_verification', 'security', false),
      ('creator_community_hub', 'social', false),
      ('ai_creator_tools', 'ai', false),
      ('mcq_creation_live_injection', 'core', false),
      ('presentation_audience_qa', 'core', false),
      -- Advertiser
      ('participatory_ads_studio', 'payment', false),
      ('campaign_management_dashboard', 'payment', false),
      ('advertiser_analytics_roi', 'analytics', false),
      ('ad_slot_manager', 'payment', false),
      ('brand_advertiser_registration', 'payment', false),
      -- Admin – content & fraud
      ('content_moderation_center', 'ai', true),
      ('fraud_detection_dashboards', 'ai', true),
      ('incident_response_center', 'security', false),
      ('payout_automation', 'payment', true),
      ('compliance_regulatory', 'security', false),
      ('performance_monitoring', 'analytics', false),
      ('ai_orchestration', 'ai', false),
      ('realtime_infrastructure', 'core', false),
      ('webhook_api_management', 'core', false),
      ('alert_management', 'ai', false),
      ('sms_management_admin', 'social', false),
      ('executive_reporting', 'analytics', false),
      ('bulk_management', 'core', false),
      ('admin_platform_logs', 'analytics', false),
      -- Enterprise
      ('enterprise_white_label', 'core', false),
      ('enterprise_sso', 'security', false),
      -- New / recent
      ('feature_implementation_notifications', 'social', false),
      ('creator_prize_compliance', 'security', false)
    ) AS v(feature_name, cat, is_enabled)
    WHERE NOT EXISTS (SELECT 1 FROM public.platform_feature_toggles p WHERE p.feature_name = v.feature_name);
  ELSE
    INSERT INTO public.platform_feature_toggles (feature_name, feature_category, is_enabled)
    SELECT v.feature_name, v.cat, v.is_enabled FROM (VALUES
      ('onboarding_wizard', 'core'::text, false),
      ('search_discovery_hub', 'core', false),
      ('accessibility_localization', 'core', true),
      ('user_feedback_portal', 'social', false),
      ('collaborative_voting_room', 'core', false),
      ('location_based_voting', 'core', false),
      ('external_voter_gate', 'core', false),
      ('plus_minus_voting', 'core', false),
      ('mcq_pre_voting_interface', 'core', false),
      ('groups_communities', 'social', false),
      ('moments_jolts_content', 'social', false),
      ('push_notifications', 'social', false),
      ('real_time_winner_notifications', 'social', false),
      ('creator_monetization_studio', 'payment', false),
      ('creator_earnings_command_center', 'payment', false),
      ('creator_analytics_growth', 'analytics', false),
      ('moments_jolts_studio', 'core', false),
      ('carousel_premium_management', 'core', false),
      ('creator_compliance_verification', 'security', false),
      ('creator_community_hub', 'social', false),
      ('ai_creator_tools', 'ai', false),
      ('mcq_creation_live_injection', 'core', false),
      ('presentation_audience_qa', 'core', false),
      ('participatory_ads_studio', 'payment', false),
      ('campaign_management_dashboard', 'payment', false),
      ('advertiser_analytics_roi', 'analytics', false),
      ('ad_slot_manager', 'payment', false),
      ('brand_advertiser_registration', 'payment', false),
      ('content_moderation_center', 'ai', true),
      ('fraud_detection_dashboards', 'ai', true),
      ('incident_response_center', 'security', false),
      ('payout_automation', 'payment', true),
      ('compliance_regulatory', 'security', false),
      ('performance_monitoring', 'analytics', false),
      ('ai_orchestration', 'ai', false),
      ('realtime_infrastructure', 'core', false),
      ('webhook_api_management', 'core', false),
      ('alert_management', 'ai', false),
      ('sms_management_admin', 'social', false),
      ('executive_reporting', 'analytics', false),
      ('bulk_management', 'core', false),
      ('admin_platform_logs', 'analytics', false),
      ('enterprise_white_label', 'core', false),
      ('enterprise_sso', 'security', false),
      ('feature_implementation_notifications', 'social', false),
      ('creator_prize_compliance', 'security', false)
    ) AS v(feature_name, cat, is_enabled)
    WHERE NOT EXISTS (SELECT 1 FROM public.platform_feature_toggles p WHERE p.feature_name = v.feature_name);
  END IF;
END $$;

-- Set feature_key for new rows (if column exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'platform_feature_toggles' AND column_name = 'feature_key') THEN
    UPDATE public.platform_feature_toggles
    SET feature_key = lower(replace(replace(feature_name, ' ', '_'), '-', '_'))
    WHERE feature_key IS NULL AND feature_name IS NOT NULL;
  END IF;
END $$;
