/**
 * Canonical hub paths — keep in sync with Flutter `AppRoutes.*WebCanonical` where applicable.
 */

/** Same value as Flutter `AppRoutes.notificationCenterHubWebCanonical`. */
export const NOTIFICATION_CENTER_HUB_ROUTE = '/notification-center-hub';

/** Same value as Flutter `AppRoutes.directMessagingScreenWebCanonical`. */
export const DIRECT_MESSAGING_CENTER_ROUTE = '/direct-messaging-center';

/** Same value as Flutter `AppRoutes.friendsManagementHubWebCanonical`. */
export const FRIENDS_MANAGEMENT_HUB_ROUTE = '/friends-management-hub';

/** Same value as Flutter `AppRoutes.settingsAccountDashboardWebCanonical`. */
export const SETTINGS_ACCOUNT_DASHBOARD_ROUTE = '/settings-account-dashboard';

/** Core app entry — Flutter: `AppRoutes.authenticationPortal` / web login flow. */
export const AUTHENTICATION_PORTAL_ROUTE = '/authentication-portal';

/** Primary home feed (Web). Mobile uses in-app routes such as `socialMediaHomeFeed`. */
export const HOME_FEED_DASHBOARD_ROUTE = '/home-feed-dashboard';

/** Flutter: `AppRoutes.electionsDashboardWebCanonical`. */
export const ELECTIONS_DASHBOARD_ROUTE = '/elections-dashboard';

/** Flutter: `AppRoutes.voteInElectionsHubWebCanonical`. */
export const VOTE_IN_ELECTIONS_HUB_ROUTE = '/vote-in-elections-hub';

/** Flutter: `AppRoutes.userProfileHubWebCanonical` / `userProfileHub`. */
export const USER_PROFILE_HUB_ROUTE = '/user-profile-hub';

/** Flutter: `AppRoutes.digitalWalletHubWebCanonical`. */
export const DIGITAL_WALLET_HUB_ROUTE = '/digital-wallet-hub';

/** Flutter: `AppRoutes.socialActivityTimelineWebCanonical`. */
export const SOCIAL_ACTIVITY_TIMELINE_ROUTE = '/social-activity-timeline';

export const CONTENT_REMOVED_APPEAL_ROUTE = '/content-removed-appeal';

export const CENTRALIZED_SUPPORT_TICKETING_SYSTEM_ROUTE =
  '/centralized-support-ticketing-system';

/** Hubs hub — Flutter: `AppRoutes.enhancedHubsHubWebCanonical`. */
export const ENHANCED_HUBS_DISCOVERY_MANAGEMENT_HUB_ROUTE =
  '/enhanced-hubs-discovery-management-hub';

/** Legacy shortcut paths (redirects in router). */
export const FRIEND_REQUESTS_LEGACY_ROUTE = '/friend-requests';
export const HUBS_SHORTCUT_ROUTE = '/hubs';

// --- Extended Web router paths (`Routes.jsx` main table) — single source of truth for strings ---

export const HOME_ROOT_ROUTE = '/';
export const AUTH_CALLBACK_ROUTE = '/auth/callback';
export const ROLE_UPGRADE_ROUTE = '/role-upgrade';
export const SECURE_VOTING_INTERFACE_ROUTE = '/secure-voting-interface';
export const VOTING_CATEGORIES_ROUTE = '/voting-categories';
export const ENHANCED_ELECTION_RESULTS_CENTER_ROUTE = '/enhanced-election-results-center';
export const ELECTION_CREATION_STUDIO_ROUTE = '/election-creation-studio';
export const CREATOR_MONETIZATION_STUDIO_ROUTE = '/creator-monetization-studio';
export const VOTER_ROLLS_MANAGEMENT_ROUTE = '/voter-rolls-management';
export const CREATOR_REPUTATION_ELECTION_MANAGEMENT_SYSTEM_ROUTE =
  '/creator-reputation-election-management-system';
export const CREATOR_SUCCESS_ACADEMY_ROUTE = '/creator-success-academy';
export const PRIZE_DISTRIBUTION_TRACKING_CENTER_ROUTE = '/prize-distribution-tracking-center';
export const VOTE_VERIFICATION_PORTAL_ROUTE = '/vote-verification-portal';
export const BLOCKCHAIN_AUDIT_PORTAL_ROUTE = '/blockchain-audit-portal';
export const VOTTERY_POINTS_VP_UNIVERSAL_CURRENCY_CENTER_ROUTE =
  '/vottery-points-vp-universal-currency-center';
export const VP_REDEMPTION_MARKETPLACE_CHARITY_HUB_ROUTE =
  '/vp-redemption-marketplace-charity-hub';
export const COMPREHENSIVE_GAMIFICATION_ADMIN_CONTROL_CENTER_ROUTE =
  '/comprehensive-gamification-admin-control-center';
export const GAMIFICATION_MULTI_LANGUAGE_INTELLIGENCE_CENTER_ROUTE =
  '/gamification-multi-language-intelligence-center';
export const DYNAMIC_QUEST_MANAGEMENT_DASHBOARD_ROUTE =
  '/dynamic-quest-management-dashboard';
export const OPEN_AI_QUEST_GENERATION_STUDIO_ROUTE = '/open-ai-quest-generation-studio';
export const ADMIN_QUEST_CONFIGURATION_CONTROL_CENTER_ROUTE =
  '/admin-quest-configuration-control-center';
export const AUTOMATED_PAYOUT_CALCULATION_ENGINE_ROUTE =
  '/automated-payout-calculation-engine';
export const COUNTRY_BASED_PAYOUT_PROCESSING_ENGINE_ROUTE =
  '/country-based-payout-processing-engine';
export const ELECTION_PREDICTION_POOLS_INTERFACE_ROUTE =
  '/election-prediction-pools-interface';
export const UNIFIED_GAMIFICATION_DASHBOARD_ROUTE = '/unified-gamification-dashboard';
export const VP_ECONOMY_HEALTH_MONITOR_DASHBOARD_ROUTE =
  '/vp-economy-health-monitor-dashboard';
export const ENHANCED_PERFORMANCE_MONITORING_DASHBOARD_ROUTE =
  '/enhanced-performance-monitoring-dashboard';
export const PREDICTION_ANALYTICS_DASHBOARD_ROUTE = '/prediction-analytics-dashboard';
export const PREDICTION_POOL_NOTIFICATIONS_HUB_ROUTE =
  '/prediction-pool-notifications-hub';
export const QUERY_PERFORMANCE_MONITORING_DASHBOARD_ROUTE =
  '/query-performance-monitoring-dashboard';
export const SUPABASE_ADVISOR_VERIFICATION_DASHBOARD_ROUTE =
  '/supabase-advisor-verification-dashboard';
export const ADMIN_CONTROL_CENTER_ROUTE = '/admin-control-center';
export const CONTENT_MODERATION_CONTROL_CENTER_ROUTE =
  '/content-moderation-control-center';
export const PERSONAL_ANALYTICS_DASHBOARD_ROUTE = '/personal-analytics-dashboard';
export const USER_ANALYTICS_DASHBOARD_ROUTE = '/user-analytics-dashboard';
export const REAL_TIME_ANALYTICS_DASHBOARD_ROUTE = '/real-time-analytics-dashboard';
export const ENHANCED_ANALYTICS_DASHBOARDS_ROUTE = '/enhanced-analytics-dashboards';
export const ELECTION_INSIGHTS_PREDICTIVE_ANALYTICS_ROUTE =
  '/election-insights-predictive-analytics';
export const COLLABORATIVE_VOTING_ROOM_ROUTE = '/collaborative-voting-room';
export const AI_ANALYTICS_HUB_ROUTE = '/ai-analytics-hub';
export const VOTTERY_ADS_STUDIO_ROUTE = '/vottery-ads-studio';
export const PARTICIPATORY_ADS_STUDIO_ROUTE = '/participatory-ads-studio';
export const CAMPAIGN_MANAGEMENT_DASHBOARD_ROUTE = '/campaign-management-dashboard';
export const SPONSORED_ELECTIONS_SCHEMA_CPE_MANAGEMENT_HUB_ROUTE =
  '/sponsored-elections-schema-cpe-management-hub';
export const DYNAMIC_CPE_PRICING_ENGINE_DASHBOARD_ROUTE =
  '/dynamic-cpe-pricing-engine-dashboard';
export const ADVERTISER_ANALYTICS_ROI_DASHBOARD_ROUTE =
  '/advertiser-analytics-roi-dashboard';
export const ENHANCED_REAL_TIME_ADVERTISER_ROI_DASHBOARD_ROUTE =
  '/enhanced-real-time-advertiser-roi-dashboard';
export const AUTOMATED_CAMPAIGN_OPTIMIZATION_DASHBOARD_ROUTE =
  '/automated-campaign-optimization-dashboard';
export const CAMPAIGN_TEMPLATE_GALLERY_ROUTE = '/campaign-template-gallery';
export const BRAND_ADVERTISER_REGISTRATION_PORTAL_ROUTE =
  '/brand-advertiser-registration-portal';
export const REAL_TIME_BRAND_ALERT_BUDGET_MONITORING_CENTER_ROUTE =
  '/real-time-brand-alert-budget-monitoring-center';
export const BRAND_DASHBOARD_SPECIALIZED_KPIS_CENTER_ROUTE =
  '/brand-dashboard-specialized-kpis-center';
export const BRAND_DASHBOARD_SPECIALIZED_KP_IS_CENTER_ALIAS_ROUTE =
  '/brand-dashboard-specialized-kp-is-center';
export const AUTOMATED_PAYMENT_PROCESSING_HUB_ROUTE =
  '/automated-payment-processing-hub';
export const STRIPE_PAYMENT_INTEGRATION_HUB_ROUTE = '/stripe-payment-integration-hub';
export const MULTI_CURRENCY_SETTLEMENT_DASHBOARD_ROUTE =
  '/multi-currency-settlement-dashboard';
export const ENHANCED_MULTI_CURRENCY_SETTLEMENT_DASHBOARD_ROUTE =
  '/enhanced-multi-currency-settlement-dashboard';
export const FINANCIAL_TRACKING_ZONE_ANALYTICS_CENTER_ROUTE =
  '/financial-tracking-zone-analytics-center';
export const COMPLIANCE_DASHBOARD_ROUTE = '/compliance-dashboard';
export const COUNTRY_RESTRICTIONS_ADMIN_ROUTE = '/country-restrictions-admin';
export const PLATFORM_INTEGRATIONS_ADMIN_ROUTE = '/platform-integrations-admin';
export const COMPLIANCE_AUDIT_DASHBOARD_ROUTE = '/compliance-audit-dashboard';
export const REGULATORY_COMPLIANCE_AUTOMATION_HUB_ROUTE =
  '/regulatory-compliance-automation-hub';
export const ADVANCED_MONITORING_HUB_WITH_AUTOMATED_INCIDENT_RESPONSE_ROUTE =
  '/advanced-monitoring-hub-with-automated-incident-response';
export const PRODUCTION_MONITORING_DASHBOARD_ROUTE =
  '/production-monitoring-dashboard';
export const DATADOG_APM_PERFORMANCE_INTELLIGENCE_CENTER_ROUTE =
  '/datadog-apm-performance-intelligence-center';
export const ENHANCED_INCIDENT_RESPONSE_ANALYTICS_ROUTE =
  '/enhanced-incident-response-analytics';
export const INCIDENT_RESPONSE_ANALYTICS_REDIRECT_ROUTE =
  '/incident-response-analytics';
export const USER_FEEDBACK_PORTAL_WITH_FEATURE_REQUEST_SYSTEM_ROUTE =
  '/user-feedback-portal-with-feature-request-system';
export const USER_FEEDBACK_PORTAL_REDIRECT_ROUTE = '/user-feedback-portal';
export const FEATURE_IMPLEMENTATION_TRACKING_ENGAGEMENT_ANALYTICS_CENTER_ROUTE =
  '/feature-implementation-tracking-engagement-analytics-center';
export const LIVE_PLATFORM_MONITORING_DASHBOARD_ROUTE =
  '/live-platform-monitoring-dashboard';
/** Flutter: `AppRoutes.securityMonitoringDashboardWebCanonical`. Web resolves to live platform hub. */
export const SECURITY_MONITORING_DASHBOARD_ROUTE =
  '/security-monitoring-dashboard';
export const ADVANCED_PLATFORM_MONITORING_EVENT_TRACKING_HUB_ROUTE =
  '/advanced-platform-monitoring-event-tracking-hub';

// Routes.jsx extended table (see scripts/gen-route-constants.mjs)
export const PLATFORM_GAMIFICATION_CORE_ENGINE_ROUTE = '/platform-gamification-core-engine';
export const GAMIFICATION_CAMPAIGN_MANAGEMENT_CENTER_ROUTE = '/gamification-campaign-management-center';
export const GAMIFICATION_REWARDS_MANAGEMENT_CENTER_ROUTE = '/gamification-rewards-management-center';
export const SECURITY_COMPLIANCE_AUTOMATION_CENTER_ROUTE = '/security-compliance-automation-center';
export const AD_SLOT_MANAGER_INVENTORY_CONTROL_CENTER_ROUTE = '/ad-slot-manager-inventory-control-center';
export const AD_NETWORK_STATUS_AND_SPLIT_DASHBOARD_ROUTE = '/ad-network-status-and-split-dashboard';
export const DYNAMIC_AD_RENDERING_FILL_RATE_ANALYTICS_HUB_ROUTE = '/dynamic-ad-rendering-fill-rate-analytics-hub';
export const GAMIFICATION_PROGRESSION_ACHIEVEMENT_HUB_ROUTE = '/gamification-progression-achievement-hub';
export const PREMIUM_3D_SLOT_MACHINE_INTEGRATION_HUB_ROUTE = '/premium-3d-slot-machine-integration-hub';
export const AD_SENSE_REVENUE_ANALYTICS_DASHBOARD_ROUTE = '/ad-sense-revenue-analytics-dashboard';
export const VOTTERY_ADS_ADMIN_CONFIG_ROUTE = '/vottery-ads-admin-config';
export const USER_SECURITY_CENTER_ROUTE = '/user-security-center';
export const FRAUD_DETECTION_ALERT_MANAGEMENT_CENTER_ROUTE = '/fraud-detection-alert-management-center';
export const CUSTOM_ALERT_RULES_ENGINE_ROUTE = '/custom-alert-rules-engine';
export const ADVANCED_CUSTOM_ALERT_RULES_ENGINE_ROUTE = '/advanced-custom-alert-rules-engine';
export const UNIFIED_ALERT_MANAGEMENT_CENTER_ROUTE = '/unified-alert-management-center';
export const AUTOMATED_INCIDENT_RESPONSE_PORTAL_ROUTE = '/automated-incident-response-portal';
export const UNIFIED_INCIDENT_RESPONSE_ORCHESTRATION_CENTER_ROUTE = '/unified-incident-response-orchestration-center';
export const UNIFIED_INCIDENT_RESPONSE_COMMAND_CENTER_ROUTE = '/unified-incident-response-command-center';
export const ADVANCED_PERPLEXITY_FRAUD_INTELLIGENCE_CENTER_ROUTE = '/advanced-perplexity-fraud-intelligence-center';
export const ADVANCED_PERPLEXITY_FRAUD_FORECASTING_CENTER_ROUTE = '/advanced-perplexity-fraud-forecasting-center';
export const ENHANCED_PREDICTIVE_THREAT_INTELLIGENCE_CENTER_ROUTE = '/enhanced-predictive-threat-intelligence-center';
export const AUTO_IMPROVING_FRAUD_DETECTION_INTELLIGENCE_CENTER_ROUTE = '/auto-improving-fraud-detection-intelligence-center';
export const AI_SENTIMENT_STRATEGY_ANALYTICS_ROUTE = '/ai-sentiment-strategy-analytics';
export const AI_CONTENT_SAFETY_SCREENING_CENTER_ROUTE = '/ai-content-safety-screening-center';
export const CLAUDE_AI_DISPUTE_MODERATION_CENTER_ROUTE = '/claude-ai-dispute-moderation-center';
export const ML_MODEL_TRAINING_INTERFACE_ROUTE = '/ml-model-training-interface';
export const UNIFIED_AI_ORCHESTRATION_COMMAND_CENTER_ROUTE = '/unified-ai-orchestration-command-center';
export const UNIFIED_AI_DECISION_ORCHESTRATION_COMMAND_CENTER_ROUTE = '/unified-ai-decision-orchestration-command-center';
export const AI_POWERED_REVENUE_FORECASTING_INTELLIGENCE_CENTER_ROUTE = '/ai-powered-revenue-forecasting-intelligence-center';
export const SHAPED_AI_SYNC_DOCKER_AUTOMATION_HUB_ROUTE = '/shaped-ai-sync-docker-automation-hub';
export const ANTHROPIC_CONTENT_INTELLIGENCE_CENTER_ROUTE = '/anthropic-content-intelligence-center';
export const ANTHROPIC_ADVANCED_CONTENT_ANALYSIS_CENTER_ROUTE = '/anthropic-advanced-content-analysis-center';
export const ANTHROPIC_CLAUDE_REVENUE_RISK_INTELLIGENCE_CENTER_ROUTE = '/anthropic-claude-revenue-risk-intelligence-center';
export const CLAUDE_ANALYTICS_DASHBOARD_FOR_CAMPAIGN_INTELLIGENCE_ROUTE = '/claude-analytics-dashboard-for-campaign-intelligence';
export const CLAUDE_PREDICTIVE_ANALYTICS_DASHBOARD_ROUTE = '/claude-predictive-analytics-dashboard';
export const CLAUDE_AI_FEED_INTELLIGENCE_CENTER_ROUTE = '/claude-ai-feed-intelligence-center';
export const CLAUDE_AI_CONTENT_CURATION_INTELLIGENCE_CENTER_ROUTE = '/claude-ai-content-curation-intelligence-center';
export const CLAUDE_MODEL_COMPARISON_CENTER_ROUTE = '/claude-model-comparison-center';
export const CLAUDE_CONTENT_OPTIMIZATION_ENGINE_ROUTE = '/claude-content-optimization-engine';
export const PERPLEXITY_MARKET_RESEARCH_INTELLIGENCE_CENTER_ROUTE = '/perplexity-market-research-intelligence-center';
export const FRAUD_PREVENTION_DASHBOARD_WITH_PERPLEXITY_THREAT_ANALYSIS_ROUTE = '/fraud-prevention-dashboard-with-perplexity-threat-analysis';
export const PLATFORM_TESTING_OPTIMIZATION_COMMAND_CENTER_ROUTE = '/platform-testing-optimization-command-center';
export const STRIPE_LOTTERY_PAYMENT_INTEGRATION_CENTER_ROUTE = '/stripe-lottery-payment-integration-center';
export const REAL_TIME_WINNER_NOTIFICATION_PRIZE_VERIFICATION_CENTER_ROUTE = '/real-time-winner-notification-prize-verification-center';
export const PROGRESSIVE_WEB_APP_MOBILE_OPTIMIZATION_HUB_ROUTE = '/progressive-web-app-mobile-optimization-hub';
export const ERROR_RECOVERY_DASHBOARD_ROUTE = '/error-recovery-dashboard';
export const CREATOR_EARNINGS_COMMAND_CENTER_ROUTE = '/creator-earnings-command-center';
export const ADVANCED_PERPLEXITY_60_90_DAY_THREAT_FORECASTING_CENTER_ROUTE = '/advanced-perplexity-60-90-day-threat-forecasting-center';
export const PERPLEXITY_STRATEGIC_PLANNING_CENTER_ROUTE = '/perplexity-strategic-planning-center';
export const PERPLEXITY_CAROUSEL_INTELLIGENCE_DASHBOARD_ROUTE = '/perplexity-carousel-intelligence-dashboard';
export const AUTOMATIC_AI_FAILOVER_ENGINE_CONTROL_CENTER_ROUTE = '/automatic-ai-failover-engine-control-center';
export const AI_PERFORMANCE_ORCHESTRATION_DASHBOARD_ROUTE = '/ai-performance-orchestration-dashboard';
export const AI_POWERED_PERFORMANCE_ADVISOR_HUB_ROUTE = '/ai-powered-performance-advisor-hub';
export const ADVANCED_AI_FRAUD_PREVENTION_COMMAND_CENTER_ROUTE = '/advanced-ai-fraud-prevention-command-center';
export const AUTOMATED_SECURITY_TESTING_FRAMEWORK_ROUTE = '/automated-security-testing-framework';
export const ANTHROPIC_SECURITY_REASONING_INTEGRATION_HUB_ROUTE = '/anthropic-security-reasoning-integration-hub';
export const SECURITY_VULNERABILITY_REMEDIATION_CONTROL_CENTER_ROUTE = '/security-vulnerability-remediation-control-center';
export const ADVANCED_ML_THREAT_DETECTION_CENTER_ROUTE = '/advanced-ml-threat-detection-center';
export const CONTINUOUS_ML_FEEDBACK_OUTCOME_LEARNING_CENTER_ROUTE = '/continuous-ml-feedback-outcome-learning-center';
export const OPEN_AI_CAROUSEL_CONTENT_INTELLIGENCE_CENTER_ROUTE = '/open-ai-carousel-content-intelligence-center';
export const CONTEXT_AWARE_CLAUDE_RECOMMENDATIONS_OVERLAY_ROUTE = '/context-aware-claude-recommendations-overlay';
export const RESEND_EMAIL_AUTOMATION_ORCHESTRATION_CENTER_ROUTE = '/resend-email-automation-orchestration-center';
export const AUTONOMOUS_CLAUDE_AGENT_ORCHESTRATION_HUB_ROUTE = '/autonomous-claude-agent-orchestration-hub';
export const ENHANCED_REAL_TIME_BEHAVIORAL_HEATMAPS_CENTER_ROUTE = '/enhanced-real-time-behavioral-heatmaps-center';
export const GEMINI_COST_EFFICIENCY_ANALYZER_CASE_REPORT_GENERATOR_ROUTE = '/gemini-cost-efficiency-analyzer-case-report-generator';
export const AUTONOMOUS_MULTI_CHANNEL_COMMUNICATION_HUB_ROUTE = '/autonomous-multi-channel-communication-hub';
export const TELNYX_SMS_PROVIDER_MANAGEMENT_CENTER_ROUTE = '/telnyx-sms-provider-management-center';
export const SMS_WEBHOOK_DELIVERY_ANALYTICS_HUB_ROUTE = '/sms-webhook-delivery-analytics-hub';
export const CROSS_DOMAIN_INTELLIGENCE_ANALYTICS_HUB_ROUTE = '/cross-domain-intelligence-analytics-hub';
export const INTELLIGENT_ORCHESTRATION_CONTROL_CENTER_ROUTE = '/intelligent-orchestration-control-center';
export const ENHANCED_REAL_TIME_SUPABASE_INTEGRATION_HUB_ROUTE = '/enhanced-real-time-supabase-integration-hub';
export const SUPABASE_REAL_TIME_FEED_RANKING_ENGINE_ROUTE = '/supabase-real-time-feed-ranking-engine';
export const CONTENT_DISTRIBUTION_CONTROL_CENTER_ROUTE = '/content-distribution-control-center';
export const ADVANCED_SEARCH_DISCOVERY_INTELLIGENCE_HUB_ROUTE = '/advanced-search-discovery-intelligence-hub';
export const INTERACTIVE_TOPIC_PREFERENCE_COLLECTION_HUB_ROUTE = '/interactive-topic-preference-collection-hub';
export const ACCESSIBILITY_ANALYTICS_PREFERENCES_CENTER_ROUTE = '/accessibility-analytics-preferences-center';
export const ENHANCED_RESEND_EMAIL_AUTOMATION_HUB_ROUTE = '/enhanced-resend-email-automation-hub';
export const STAKEHOLDER_INCIDENT_COMMUNICATION_HUB_ROUTE = '/stakeholder-incident-communication-hub';
export const SMS_EMERGENCY_ALERTS_HUB_ROUTE = '/sms-emergency-alerts-hub';
export const TEAM_COLLABORATION_CENTER_ROUTE = '/team-collaboration-center';
export const UNIFIED_ADMIN_ACTIVITY_LOG_ROUTE = '/unified-admin-activity-log';
export const ADMIN_PLATFORM_LOGS_CENTER_ROUTE = '/admin-platform-logs-center';
export const ENTERPRISE_OPERATIONS_CENTER_ROUTE = '/enterprise-operations-center';
export const WHITE_LABEL_ELECTION_PLATFORM_ROUTE = '/white-label-election-platform';
export const ENTERPRISE_SSO_INTEGRATION_HUB_ROUTE = '/enterprise-sso-integration-hub';
export const BULK_ELECTION_CREATION_HUB_ROUTE = '/bulk-election-creation-hub';
export const ENTERPRISE_ANALYTICS_HUB_ROUTE = '/enterprise-analytics-hub';
export const ENTERPRISE_API_ACCESS_CENTER_ROUTE = '/enterprise-api-access-center';
export const CUSTOM_BRANDING_OPTIONS_CENTER_ROUTE = '/custom-branding-options-center';
export const SLA_BACKED_INFRASTRUCTURE_CENTER_ROUTE = '/sla-backed-infrastructure-center';
export const ENTERPRISE_COMPLIANCE_REPORTS_CENTER_ROUTE = '/enterprise-compliance-reports-center';
export const VOLUME_PRICING_LICENSING_CENTER_ROUTE = '/volume-pricing-licensing-center';
export const DEDICATED_ACCOUNT_MANAGER_CENTER_ROUTE = '/dedicated-account-manager-center';
export const WHATSAPP_NOTIFICATIONS_CENTER_ROUTE = '/whatsapp-notifications-center';
export const BULK_MANAGEMENT_SCREEN_ROUTE = '/bulk-management-screen';
export const MOBILE_ADMIN_DASHBOARD_ROUTE = '/mobile-admin-dashboard';
export const DESIGN_SYSTEM_FOUNDATION_ROUTE = '/design-system-foundation';
export const THREE_D_GAMIFIED_ELECTION_EXPERIENCE_CENTER_ROUTE =
  '/3d-gamified-election-experience-center';
export const ENHANCED_ADMIN_REVENUE_ANALYTICS_HUB_ROUTE = '/enhanced-admin-revenue-analytics-hub';
export const UNIFIED_BUSINESS_INTELLIGENCE_HUB_ROUTE = '/unified-business-intelligence-hub';
export const ADVANCED_ANALYTICS_AND_PREDICTIVE_FORECASTING_CENTER_ROUTE = '/advanced-analytics-and-predictive-forecasting-center';
export const COMPREHENSIVE_SOCIAL_ENGAGEMENT_SUITE_ROUTE = '/comprehensive-social-engagement-suite';
export const MULTI_AUTHENTICATION_GATEWAY_ROUTE = '/multi-authentication-gateway';
export const GLOBAL_LOCALIZATION_CONTROL_CENTER_ROUTE = '/global-localization-control-center';
export const GLOBAL_LANGUAGE_SETTINGS_HUB_ROUTE = '/global-language-settings-hub';
export const ADVANCED_ADMIN_ROLE_MANAGEMENT_SYSTEM_ROUTE = '/advanced-admin-role-management-system';
export const ELECTION_COMPLIANCE_AUDIT_DASHBOARD_ROUTE = '/election-compliance-audit-dashboard';
export const PUBLIC_BULLETIN_BOARD_AUDIT_TRAIL_CENTER_ROUTE = '/public-bulletin-board-audit-trail-center';
export const COMMUNITY_ELECTIONS_HUB_ROUTE = '/community-elections-hub';
export const TOPIC_BASED_COMMUNITY_ELECTIONS_HUB_ROUTE = '/topic-based-community-elections-hub';
export const ENHANCED_GOOGLE_ANALYTICS_INTEGRATION_CENTER_ROUTE = '/enhanced-google-analytics-integration-center';
export const API_RATE_LIMITING_DASHBOARD_ROUTE = '/api-rate-limiting-dashboard';
export const INTERNATIONAL_PAYMENT_DISPUTE_RESOLUTION_CENTER_ROUTE = '/international-payment-dispute-resolution-center';
export const CREATOR_BRAND_PARTNERSHIP_PORTAL_ROUTE = '/creator-brand-partnership-portal';
export const SMART_PUSH_NOTIFICATIONS_OPTIMIZATION_CENTER_ROUTE = '/smart-push-notifications-optimization-center';
export const ENHANCED_CREATOR_PAYOUT_DASHBOARD_WITH_STRIPE_CONNECT_INTEGRATION_ROUTE = '/enhanced-creator-payout-dashboard-with-stripe-connect-integration';
export const ADMIN_PAYOUT_VERIFICATION_DASHBOARD_ROUTE = '/admin-payout-verification-dashboard';
export const STRIPE_CONNECT_LINKING_ROUTE = '/stripe-connect-linking';
export const LOCATION_BASED_VOTING_ROUTE = '/location-based-voting';
export const PLUS_MINUS_VOTING_INTERFACE_ROUTE = '/plus-minus-voting-interface';
export const ZONE_SPECIFIC_THREAT_HEATMAPS_DASHBOARD_ROUTE = '/zone-specific-threat-heatmaps-dashboard';
export const CREATOR_GROWTH_ANALYTICS_DASHBOARD_ROUTE = '/creator-growth-analytics-dashboard';
export const CREATOR_CHURN_PREDICTION_INTELLIGENCE_CENTER_ROUTE = '/creator-churn-prediction-intelligence-center';
export const CREATOR_MARKETPLACE_SCREEN_ROUTE = '/creator-marketplace-screen';
export const UNIFIED_REVENUE_INTELLIGENCE_DASHBOARD_ROUTE = '/unified-revenue-intelligence-dashboard';
export const ENHANCED_MCQ_CREATION_STUDIO_ROUTE = '/enhanced-mcq-creation-studio';
export const ENHANCED_MCQ_PRE_VOTING_INTERFACE_ROUTE = '/enhanced-mcq-pre-voting-interface';
export const LIVE_QUESTION_INJECTION_MANAGEMENT_CENTER_ROUTE = '/live-question-injection-management-center';
export const LIVEQUESTIONINJECTIONCONTROLCENTER_ROUTE = '/liveQuestionInjectionControlCenter';
export const ENHANCED_MCQ_IMAGE_INTERFACE_ROUTE = '/enhanced-mcq-image-interface';
export const MCQ_ANALYTICS_INTELLIGENCE_DASHBOARD_ROUTE = '/mcq-analytics-intelligence-dashboard';
export const REAL_TIME_MCQ_SYNC_MONITOR_DASHBOARD_ROUTE = '/real-time-mcq-sync-monitor-dashboard';
export const MCQ_ALERT_AUTOMATION_CONFIGURATION_CENTER_ROUTE = '/mcq-alert-automation-configuration-center';
export const MCQ_A_B_TESTING_ANALYTICS_DASHBOARD_ROUTE = '/mcq-a-b-testing-analytics-dashboard';
export const REAL_TIME_THREAT_CORRELATION_DASHBOARD_ROUTE = '/real-time-threat-correlation-dashboard';
export const REAL_TIME_THREAT_CORRELATION_INTELLIGENCE_HUB_ROUTE = '/real-time-threat-correlation-intelligence-hub';
export const VOTER_EDUCATION_HUB_ROUTE = '/voter-education-hub';
export const FEATURE_PERFORMANCE_DASHBOARD_ROUTE = '/feature-performance-dashboard';
export const PRODUCTION_LOAD_TESTING_SUITE_ROUTE = '/production-load-testing-suite';
export const COMPREHENSIVE_HEALTH_MONITORING_DASHBOARD_ROUTE = '/comprehensive-health-monitoring-dashboard';
export const LOAD_TESTING_PERFORMANCE_ANALYTICS_CENTER_ROUTE = '/load-testing-performance-analytics-center';
export const PERFORMANCE_OPTIMIZATION_ENGINE_DASHBOARD_ROUTE = '/performance-optimization-engine-dashboard';
export const REAL_TIME_WEB_SOCKET_MONITORING_COMMAND_CENTER_ROUTE = '/real-time-web-socket-monitoring-command-center';
export const AUTOMATED_DATA_CACHE_MANAGEMENT_HUB_ROUTE = '/automated-data-cache-management-hub';
export const ADVANCED_SUPABASE_REAL_TIME_COORDINATION_HUB_ROUTE = '/advanced-supabase-real-time-coordination-hub';
export const ENHANCED_REAL_TIME_WEB_SOCKET_COORDINATION_HUB_ROUTE = '/enhanced-real-time-web-socket-coordination-hub';
export const ELECTION_INTEGRITY_MONITORING_HUB_ROUTE = '/election-integrity-monitoring-hub';
export const AGE_VERIFICATION_DIGITAL_IDENTITY_CENTER_ROUTE = '/age-verification-digital-identity-center';
export const PRESENTATION_BUILDER_AUDIENCE_Q_A_HUB_ROUTE = '/presentation-builder-audience-q-a-hub';
export const PREDICTIVE_CREATOR_INSIGHTS_DASHBOARD_ROUTE = '/predictive-creator-insights-dashboard';
export const CREATOR_REVENUE_FORECASTING_DASHBOARD_ROUTE = '/creator-revenue-forecasting-dashboard';
export const CONTENT_QUALITY_SCORING_CLAUDE_ROUTE = '/content-quality-scoring-claude';
export const ENHANCED_HOME_FEED_DASHBOARD_ROUTE = '/enhanced-home-feed-dashboard';
export const APP_PERFORMANCE_DASHBOARD_ROUTE = '/app-performance-dashboard';
export const REAL_TIME_REVENUE_OPTIMIZATION_ENGINE_ROUTE = '/real-time-revenue-optimization-engine';
export const CLAUDE_DECISION_REASONING_HUB_ROUTE = '/claude-decision-reasoning-hub';
export const MULTI_REGION_FAILOVER_ORCHESTRATION_ROUTE = '/multi-region-failover-orchestration';
export const PERFORMANCE_REGRESSION_DETECTION_ROUTE = '/performance-regression-detection';
export const ADMIN_AUTOMATION_CONTROL_PANEL_ROUTE = '/admin-automation-control-panel';
export const ANALYTICS_EXPORT_REPORTING_HUB_ROUTE = '/analytics-export-reporting-hub';
export const RES_TFUL_API_MANAGEMENT_CENTER_ROUTE = '/res-tful-api-management-center';
export const WEBHOOK_INTEGRATION_HUB_ROUTE = '/webhook-integration-hub';
export const ADVANCED_WEBHOOK_ORCHESTRATION_HUB_ROUTE = '/advanced-webhook-orchestration-hub';
export const EXECUTIVE_REPORTING_COMPLIANCE_AUTOMATION_HUB_ROUTE = '/executive-reporting-compliance-automation-hub';
export const AUTOMATED_EXECUTIVE_REPORTING_CLAUDE_INTELLIGENCE_HUB_ROUTE = '/automated-executive-reporting-claude-intelligence-hub';
export const API_DOCUMENTATION_PORTAL_ROUTE = '/api-documentation-portal';
export const CRYPTOGRAPHIC_SECURITY_MANAGEMENT_CENTER_ROUTE = '/cryptographic-security-management-center';
export const VOTE_ANONYMITY_MIXNET_CONTROL_HUB_ROUTE = '/vote-anonymity-mixnet-control-hub';
export const STRIPE_SUBSCRIPTION_MANAGEMENT_CENTER_ROUTE = '/stripe-subscription-management-center';
export const USER_SUBSCRIPTION_DASHBOARD_ROUTE = '/user-subscription-dashboard';
export const ADMIN_SUBSCRIPTION_ANALYTICS_HUB_ROUTE = '/admin-subscription-analytics-hub';
export const STATUS_ROUTE = '/status';
export const PUBLIC_STATUS_PAGE_ROUTE = '/public-status-page';
export const MOBILE_OPERATIONS_COMMAND_CONSOLE_ROUTE = '/mobile-operations-command-console';
export const PREDICTIVE_INCIDENT_PREVENTION_24H_ROUTE = '/predictive-incident-prevention-24h';
export const ENHANCED_PREMIUM_SUBSCRIPTION_CENTER_ROUTE = '/enhanced-premium-subscription-center';
export const REAL_TIME_PERFORMANCE_TESTING_SUITE_ROUTE = '/real-time-performance-testing-suite';
export const AI_GUIDED_INTERACTIVE_TUTORIAL_SYSTEM_ROUTE = '/ai-guided-interactive-tutorial-system';
export const COMMUNITY_ENGAGEMENT_DASHBOARD_ROUTE = '/community-engagement-dashboard';
export const CREATOR_COMMUNITY_HUB_ROUTE = '/creator-community-hub';
export const MOMENTS_CREATION_STUDIO_ROUTE = '/moments-creation-studio';
export const JOLTS_VIDEO_STUDIO_ROUTE = '/jolts';
export const REAL_TIME_NOTIFICATIONS_HUB_WITH_PUSH_INTEGRATION_ROUTE = '/real-time-notifications-hub-with-push-integration';
export const GUIDED_ONBOARDING_TOURS_INTERACTIVE_TUTORIAL_SYSTEM_ROUTE = '/guided-onboarding-tours-interactive-tutorial-system';
export const CROSS_DOMAIN_DATA_SYNC_HUB_ROUTE = '/cross-domain-data-sync-hub';
export const COMPREHENSIVE_FEATURE_ANALYTICS_DASHBOARD_ROUTE = '/comprehensive-feature-analytics-dashboard';
export const PRODUCTION_DEPLOYMENT_HUB_ROUTE = '/production-deployment-hub';
export const SECURITY_COMPLIANCE_AUDIT_SCREEN_ROUTE = '/security-compliance-audit-screen';
export const UNIFIED_PAYMENT_ORCHESTRATION_HUB_ROUTE = '/unified-payment-orchestration-hub';
export const COST_ANALYTICS_ROI_DASHBOARD_ROUTE = '/cost-analytics-roi-dashboard';

// Admin/revenue routes previously registered only in a duplicate Routes.jsx block (now consolidated).
export const ENHANCED_DYNAMIC_REVENUE_SHARING_CONFIGURATION_CENTER_ROUTE =
  '/enhanced-dynamic-revenue-sharing-configuration-center';
export const REVENUE_FRAUD_DETECTION_ANOMALY_PREVENTION_CENTER_ROUTE =
  '/revenue-fraud-detection-anomaly-prevention-center';
export const PREDICTIVE_ANOMALY_ALERTING_DEVIATION_MONITORING_HUB_ROUTE =
  '/predictive-anomaly-alerting-deviation-monitoring-hub';
export const DUAL_ADVERTISING_SYSTEM_ANALYTICS_DASHBOARD_ROUTE =
  '/dual-advertising-system-analytics-dashboard';
export const AI_DEPENDENCY_RISK_MITIGATION_COMMAND_CENTER_ROUTE =
  '/ai-dependency-risk-mitigation-command-center';
export const GEMINI_FALLBACK_ORCHESTRATION_HUB_ROUTE = '/gemini-fallback-orchestration-hub';
export const COUNTRY_REVENUE_SHARE_MANAGEMENT_CENTER_ROUTE =
  '/country-revenue-share-management-center';
export const ENHANCED_AUTOMATED_PAYOUT_CALCULATION_ENGINE_WITH_COUNTRY_BASED_PROCESSING_ROUTE =
  '/enhanced-automated-payout-calculation-engine-with-country-based-processing';
export const CREATOR_COUNTRY_VERIFICATION_INTERFACE_ROUTE =
  '/creator-country-verification-interface';
export const REGIONAL_REVENUE_ANALYTICS_DASHBOARD_ROUTE =
  '/regional-revenue-analytics-dashboard';
export const LOCALIZATION_TAX_REPORTING_INTELLIGENCE_CENTER_ROUTE =
  '/localization-tax-reporting-intelligence-center';
export const CLAUDE_CREATOR_SUCCESS_AGENT_ROUTE = '/claude-creator-success-agent';
export const OPEN_AI_SMS_OPTIMIZATION_STUDIO_ROUTE = '/open-ai-sms-optimization-studio';
export const STRIPE_CONNECT_ACCOUNT_LINKING_INTERFACE_ROUTE =
  '/stripe-connect-account-linking-interface';

export const DYNAMIC_REVENUE_SHARING_CONFIGURATION_CENTER_ROUTE =
  '/dynamic-revenue-sharing-configuration-center';
export const REVENUE_SPLIT_ANALYTICS_IMPACT_DASHBOARD_ROUTE =
  '/revenue-split-analytics-impact-dashboard';
export const REVENUE_SPLIT_TESTING_SANDBOX_ENVIRONMENT_ROUTE =
  '/revenue-split-testing-sandbox-environment';
export const THREE_D_FEED_PERFORMANCE_ANALYTICS_DASHBOARD_ROUTE =
  '/3d-feed-performance-analytics-dashboard';
export const LIVE_STREAMING_REAL_TIME_BROADCAST_CENTER_ROUTE =
  '/live-streaming-real-time-broadcast-center';
export const GOOGLE_ANALYTICS_SECURITY_EVENTS_INTEGRATION_HUB_ROUTE =
  '/google-analytics-security-events-integration-hub';
export const PREMIUM_2D_CAROUSEL_COMPONENT_LIBRARY_HUB_ROUTE =
  '/premium-2d-carousel-component-library-hub';
export const CAROUSEL_PERFORMANCE_ANALYTICS_HUB_ROUTE =
  '/carousel-performance-analytics-hub';
export const CAROUSEL_AB_TESTING_DASHBOARD_ROUTE =
  '/carousel-ab-testing-dashboard';
export const ADVANCED_CAROUSEL_ROI_ANALYTICS_DASHBOARD_ROUTE =
  '/advanced-carousel-roi-analytics-dashboard';
export const CAROUSEL_FEED_ORCHESTRATION_ENGINE_ROUTE =
  '/carousel-feed-orchestration-engine';
export const CREATOR_CAROUSEL_OPTIMIZATION_STUDIO_ROUTE =
  '/creator-carousel-optimization-studio';
export const ADVANCED_CAROUSEL_FRAUD_DETECTION_PREVENTION_CENTER_ROUTE =
  '/advanced-carousel-fraud-detection-prevention-center';
export const REAL_TIME_CAROUSEL_MONITORING_HUB_ROUTE =
  '/real-time-carousel-monitoring-hub';
export const CAROUSEL_HEALTH_SCALING_DASHBOARD_ROUTE =
  '/carousel-health-scaling-dashboard';

// --- NEW ADMIN DASHBOARD MODULES ---
export const ADMIN_AI_CONTENT_MODERATION_ROUTE = '/admin/ai-content-moderation';
export const ADMIN_FRAUD_DETECTION_CENTER_ROUTE = '/admin/fraud-detection-center';
export const ADMIN_NOTIFICATION_INTELLIGENCE_ROUTE = '/admin/notification-intelligence';
export const ADMIN_REVENUE_INTELLIGENCE_ROUTE = '/admin-revenue-intelligence';
export const ADMIN_SLACK_INCIDENTS_ROUTE = '/admin-slack-incidents';
export const ADMIN_SOCIAL_ACTIVITY_ANALYTICS_ROUTE = '/admin/social-activity-analytics';
export const ADMIN_SOCIAL_ENGAGEMENT_ANALYTICS_ROUTE = '/admin/social-engagement-analytics';
export const ADMIN_SOCIAL_TIMELINE_ANALYTICS_ROUTE = '/admin/social-timeline-analytics';
export const ADMIN_ACCESSIBILITY_ANALYTICS_ROUTE = '/admin/accessibility-analytics';
export const ADMIN_ELECTION_MODERATION_HUB_ROUTE = '/admin/election-moderation-hub';
export const INTERACTIVE_ONBOARDING_WIZARD_ROUTE = '/interactive-onboarding-wizard';
export const ADMIN_HEALTH_CHECK_ROUTE = '/admin/health-check';
export const ALGORITHM_COMMAND_CENTER_ROUTE = '/admin/algorithm-command-center';

