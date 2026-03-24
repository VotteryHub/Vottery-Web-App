/**
 * Batch 1 launch control policy.
 * This enforces a fast, revenue-first launch posture while allowing admin toggles.
 */

export const BATCH1_FORCE_DISABLED_FEATURE_KEYS = new Set([
  // Internal ads system disabled for Batch 1.
  'participatory_advertising',
  'campaign_management_dashboard',
  'campaign_optimization_dashboard',
  'campaign_template_gallery',
  'advertiser_analytics_roi',
  'enhanced_real_time_advertiser_roi_dashboard',
  'sponsored_elections_schema_cpe_management_hub',
  'dynamic_ad_rendering_fill_rate_analytics_hub',
  'ad_slot_manager_inventory_control_center',
  'dual_advertising_system_analytics_dashboard',
  // High-cost or non-core surfaces.
  'advanced_perplexity_fraud_intelligence_center',
  'advanced_perplexity_fraud_forecasting_center',
  'content_distribution_control_center',
  'enterprise_white_label',
  'enterprise_sso',
]);

export const BATCH1_DEFAULT_DISABLED_IF_MISSING = new Set([
  'advanced_perplexity_fraud_intelligence_center',
  'advanced_perplexity_fraud_forecasting_center',
  'unified_incident_response_orchestration_center',
  'real_time_performance_testing_suite',
  'content_distribution_control_center',
  'enterprise_white_label',
  'enterprise_sso',
  // Keep internal ads disabled unless explicitly re-enabled in future batches.
  'participatory_advertising',
]);

export const BATCH1_DEFAULT_ENABLED_IF_MISSING = new Set([
  'vote_in_elections_hub',
  'secure_voting_interface',
  'voting_categories',
  'notification_center_hub',
  'settings_account_dashboard',
  'user_profile_hub',
  'digital_wallet_hub',
  'stripe_connect_account_linking_interface',
  'user_subscription_dashboard',
  'interactive_onboarding_wizard',
  'multi_authentication_gateway',
]);

export const AI_ROUTING_POLICY = {
  primary: 'gemini',
  secondary: 'anthropic_haiku',
  highest_stakes: 'anthropic_opus',
  removedProviders: ['openai', 'perplexity', 'shaped_ai'],
};

export const NOTIFICATION_COST_POLICY = {
  smsMaxCharacters: 160,
  smsEncoding: 'GSM-7',
  pushFirstAckWindowHours: 24,
  whatsappBeforeSms: true,
  nonUrgentChannels: ['push', 'email'],
  smsReservedFor: ['otp_fallback', 'critical_security', 'time_sensitive_admin'],
};
