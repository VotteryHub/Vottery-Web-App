/**
 * SHARED_CONSTANTS.js
 * Dual-Platform Shared Constants for Vottery Web (React) and Mobile (Flutter)
 * 
 * CRITICAL: Any changes to these constants MUST be synchronized in BOTH:
 *   - Web: src/constants/SHARED_CONSTANTS.js
 *   - Mobile: vottery_M/lib/constants/shared_constants.dart
 */

// ============================================================
// SUPABASE TABLE NAMES
// ============================================================
export const TABLES = {
  // Core
  USER_PROFILES: 'user_profiles',
  ELECTIONS: 'elections',
  VOTES: 'votes',
  POSTS: 'posts',

  // Gamification
  PLATFORM_GAMIFICATION_CAMPAIGNS: 'platform_gamification_campaigns',
  PLATFORM_GAMIFICATION_WINNERS: 'platform_gamification_winners',
  GAMIFICATION_QUESTS: 'gamification_quests',
  GAMIFICATION_ACHIEVEMENTS: 'gamification_achievements',
  GAMIFICATION_LEADERBOARD: 'gamification_leaderboard',

  // Payments & Wallet
  WALLET_TRANSACTIONS: 'wallet_transactions',
  PAYOUT_SETTINGS: 'payout_settings',
  SUBSCRIPTIONS: 'subscriptions',
  PAYMENT_TRANSACTIONS: 'payment_transactions',

  // Advertising
  SPONSORED_ELECTIONS: 'sponsored_elections',
  ADVERTISER_CAMPAIGNS: 'advertiser_campaigns',
  AD_SLOT_ALLOCATIONS: 'ad_slot_allocations',

  // Analytics
  FEATURE_ANALYTICS: 'feature_analytics',
  AB_TESTS: 'ab_tests',
  AB_ASSIGNMENTS: 'ab_assignments',

  // Security & Audit
  CRYPTOGRAPHIC_AUDIT_LOGS: 'cryptographic_audit_logs',
  ADMIN_LOGS: 'admin_logs',
  SECURITY_AUDIT_CHECKLIST: 'security_audit_checklist',

  // Deployment
  DEPLOYMENT_CONFIG: 'deployment_config',
  DEPLOYMENT_RELEASES: 'deployment_releases',

  // Webhooks
  WEBHOOK_CONFIG: 'webhook_config',
  WEBHOOK_DELIVERY_LOGS: 'webhook_delivery_logs',

  // Social
  FRIENDS: 'friends',
  DIRECT_MESSAGES: 'direct_messages',
  GROUPS: 'groups',
  NOTIFICATIONS: 'notifications',

  // Sync
  SYNC_METADATA: 'sync_metadata',
};

// ============================================================
// EDGE FUNCTION / API PATHS
// ============================================================
export const API_PATHS = {
  // Lottery REST API (Edge Functions)
  TICKETS_VERIFY: '/functions/v1/tickets-verify',
  DRAWS_INITIATE: '/functions/v1/draws-initiate',
  AUDIT_LOGS: '/functions/v1/audit-logs',
  WEBHOOK_DISPATCHER: '/functions/v1/webhook-dispatcher',

  // Other Edge Functions
  AI_PROXY: '/functions/v1/ai-proxy',
  STRIPE_WEBHOOK: '/functions/v1/stripe-webhook-verified',
  STRIPE_SUBSCRIPTION_WEBHOOK: '/functions/v1/stripe-subscription-webhook',
  CREATE_SUBSCRIPTION_CHECKOUT: '/functions/v1/create-subscription-checkout',
  VALIDATE_CAPTCHA: '/functions/v1/validate-captcha',
  SEND_SMS_ALERT: '/functions/v1/send-sms-alert',
  SEND_MULTI_CHANNEL_NOTIFICATION: '/functions/v1/send-multi-channel-notification',
  CONTENT_MODERATION_TRIGGER: '/functions/v1/content-moderation-trigger',
  SUPABASE_ADVISOR_VALIDATION: '/functions/v1/supabase-advisor-validation-cron',
};

// ============================================================
// ROUTE PATHS (sync with Mobile: lib/framework/shared_constants.dart)
// ============================================================
export const ROUTE_PATHS = {
  CONTENT_REMOVED_APPEAL: '/content-removed-appeal',
  CONTENT_MODERATION_CONTROL_CENTER: '/content-moderation-control-center',
  USER_FEEDBACK_PORTAL: '/user-feedback-portal-with-feature-request-system',
  FEATURE_IMPLEMENTATION_TRACKING: '/feature-implementation-tracking-engagement-analytics-center',
  COMMUNITY_ENGAGEMENT_DASHBOARD: '/community-engagement-dashboard',
  ENHANCED_INCIDENT_RESPONSE_ANALYTICS: '/enhanced-incident-response-analytics',
  PRODUCTION_MONITORING: '/production-monitoring-dashboard',
  ADVANCED_MONITORING_HUB: '/advanced-monitoring-hub-with-automated-incident-response',
};

/** 1 ad per N organic items in feed (platform standard; sync with Mobile SharedConstants.organicItemsPerAd) */
export const AD_ORGANIC_RATIO = {
  ORGANIC_ITEMS_PER_AD: 7,
};

// ============================================================
// WEBHOOK EVENTS
// ============================================================
export const WEBHOOK_EVENTS = {
  DRAW_COMPLETED: 'draw_completed',
  VOTE_CAST: 'vote_cast',
};

// ============================================================
// PAYMENT NOTIFICATION TYPES (for push/activity_feed)
// ============================================================
export const PAYMENT_NOTIFICATION_TYPES = {
  SETTLEMENT_PROCESSING: 'settlement_processing',
  PAYOUT_DELAYED: 'payout_delayed',
  PAYMENT_METHOD_FAILED: 'payment_method_failed',
  PAYOUT_COMPLETED: 'payout_completed',
};

// ============================================================
// PAYMENT THRESHOLDS
// ============================================================
// Payout threshold must match src/features/payouts/constants.js (PAYOUT_THRESHOLD)
const PAYOUT_THRESHOLD_SYNC = 100;
export const PAYMENT_CONSTANTS = {
  PAYOUT_THRESHOLD: PAYOUT_THRESHOLD_SYNC,  // Minimum payout amount in USD (sync with payouts feature)
  MAX_PAYOUT_SINGLE: 10000,       // Maximum single payout in USD
  PLATFORM_FEE_PERCENT: 15,       // Platform fee percentage
  CREATOR_REVENUE_SHARE: 70,      // Creator revenue share percentage
  ADSENSE_REVENUE_SHARE: 15,      // AdSense revenue share percentage
};

// ============================================================
// GAMIFICATION CONSTANTS
// ============================================================
export const GAMIFICATION_CONSTANTS = {
  VP_PER_VOTE: 10,
  VP_PER_CORRECT_PREDICTION: 50,
  VP_PER_ELECTION_CREATED: 100,
  DAILY_VOTE_BONUS: 5,
  STREAK_MULTIPLIER: 1.5,
};

// ============================================================
// AD SLOT CONSTANTS
// ============================================================
export const AD_SLOT_CONSTANTS = {
  INTERNAL_AD_SYSTEM: 'internal_participatory',
  ADSENSE_SYSTEM: 'google_adsense',
  WATERFALL_ORDER: ['internal_participatory', 'google_adsense'],
};

// ============================================================
// USER ROLES
// ============================================================
export const USER_ROLES = {
  VOTER: 'voter',
  CREATOR: 'creator',
  ADVERTISER: 'advertiser',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
};

// ============================================================
// ELECTION STATUS
// ============================================================
export const ELECTION_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  ACTIVE: 'active',
  CLOSED: 'closed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// ============================================================
// ERROR MESSAGES (synchronized Web + Mobile)
// ============================================================
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized: Please log in to continue',
  FORBIDDEN: 'Forbidden: You do not have permission to perform this action',
  VOTE_ALREADY_CAST: 'You have already voted in this election',
  ELECTION_CLOSED: 'This election is no longer accepting votes',
  PAYOUT_BELOW_THRESHOLD: `Minimum payout amount is $${PAYOUT_THRESHOLD_SYNC}.`,
  NETWORK_ERROR: 'Network error: Please check your connection and try again',
};

export default {
  TABLES,
  API_PATHS,
  ROUTE_PATHS,
  WEBHOOK_EVENTS,
  PAYMENT_CONSTANTS,
  GAMIFICATION_CONSTANTS,
  AD_SLOT_CONSTANTS,
  USER_ROLES,
  ELECTION_STATUS,
  ERROR_MESSAGES,
};
