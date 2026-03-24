/**
 * Vottery Ads Studio – shared constants (Web + Mobile parity).
 * Sync with Flutter: lib/constants/vottery_ads_constants.dart
 */

/** Public path; Flutter: `VotteryAdsConstants.votteryAdsStudioWebRoute` (same value). In-app Navigator uses `/votteryAdsStudio`. */
export const VOTTERY_ADS_ROUTE = '/vottery-ads-studio';
/** Sponsored-election wizard (multi-step). Pair with [VOTTERY_ADS_ROUTE] for unified campaign/ad-group ads. */
export const PARTICIPATORY_ADS_STUDIO_ROUTE = '/participatory-ads-studio';
/** React Router path — matches Flutter `campaignManagementDashboardWebCanonical` / `VotteryAdsConstants.campaignManagementRoute`. */
export const CAMPAIGN_MANAGEMENT_ROUTE = '/campaign-management-dashboard';
/** Web alias: same Campaign Management hub (CPE / schema). Matches Flutter `sponsoredElectionsSchemaCpeHubRoute`. */
export const SPONSORED_ELECTIONS_SCHEMA_CPE_HUB_ROUTE = '/sponsored-elections-schema-cpe-management-hub';
/** Dedicated dynamic CPE engine (zone matrix + Supabase). Matches Flutter `dynamicCpePricingEngineDashboardWebCanonical`. */
export const DYNAMIC_CPE_PRICING_ENGINE_ROUTE = '/dynamic-cpe-pricing-engine-dashboard';
/** React Router — matches Flutter `campaignTemplateGalleryWebCanonical` / `VotteryAdsConstants.campaignTemplateGalleryRoute`. */
export const CAMPAIGN_TEMPLATE_GALLERY_ROUTE = '/campaign-template-gallery';
/** React Router path — matches Flutter `advertiserAnalyticsDashboardWebCanonical` / `VotteryAdsConstants.advertiserAnalyticsRoute`. */
export const ADVERTISER_ANALYTICS_ROUTE = '/advertiser-analytics-roi-dashboard';
/** Developer API portal — matches Flutter `apiDocumentationPortalWebCanonical`. */
export const API_DOCUMENTATION_PORTAL_ROUTE = '/api-documentation-portal';
/** Brand advertiser onboarding — matches Flutter `brandAdvertiserRegistrationPortalWebCanonical`. */
export const BRAND_ADVERTISER_REGISTRATION_PORTAL_ROUTE =
  '/brand-advertiser-registration-portal';
/** REST API admin center — matches Flutter `resTfulApiManagementHubWebCanonical`. */
export const RESTFUL_API_MANAGEMENT_CENTER_ROUTE = '/res-tful-api-management-center';
/** Webhook configuration hub — matches Flutter `webhookIntegrationHubWebCanonical`. */
export const WEBHOOK_INTEGRATION_HUB_ROUTE = '/webhook-integration-hub';

export const CAMPAIGN_OBJECTIVES = {
  REACH: 'reach',
  TRAFFIC: 'traffic',
  APP_INSTALLS: 'app_installs',
  CONVERSIONS: 'conversions',
};

export const AD_TYPES = {
  DISPLAY: 'display',
  VIDEO: 'video',
  PARTICIPATORY: 'participatory',
  SPARK: 'spark',
};

export const PRICING_MODELS = {
  CPM: 'cpm',
  CPC: 'cpc',
  OCPM: 'ocpm',
  CPV: 'cpv',
};

export const PLACEMENT_STYLES = {
  TIKTOK_STYLE: 'tiktok_style',
  FACEBOOK_STYLE: 'facebook_style',
  PREMIUM: 'premium',
};

/** Purchasing-power zones 1–8 (same labels Web + Mobile) */
export const ZONES = [
  { value: 1, label: 'Zone 1 - US', description: 'High purchasing power' },
  { value: 2, label: 'Zone 2 - Europe', description: 'High purchasing power' },
  { value: 3, label: 'Zone 3 - Canada', description: 'High purchasing power' },
  { value: 4, label: 'Zone 4 - Australia/NZ', description: 'High purchasing power' },
  { value: 5, label: 'Zone 5 - Developed Asia', description: 'Medium-high' },
  { value: 6, label: 'Zone 6 - Latin America', description: 'Medium' },
  { value: 7, label: 'Zone 7 - Emerging Asia', description: 'Medium-low' },
  { value: 8, label: 'Zone 8 - Africa', description: 'Lower purchasing power' },
];

/** Placement slot keys – TikTok-style (immersive) */
export const PLACEMENT_SLOTS_TIKTOK = [
  'top_view',
  'feed_post',
  'moments',
  'jolts',
];

/** Placement slot keys – Facebook-style (Sponsored label) */
export const PLACEMENT_SLOTS_FACEBOOK = [
  'creators_marketplace',
  'recommended_groups',
  'trending_topics',
  'recommended_elections',
  'elections_voting_ui',
  'elections_verification_ui',
  'elections_audit_ui',
  'top_earners',
  'accuracy_champions',
  'right_column', // web only
];

export const PLACEMENT_SLOT_LABELS = {
  top_view: 'TopView',
  feed_post: 'Feed/Post',
  moments: 'Moments',
  jolts: 'Jolts',
  creators_marketplace: 'Creators Services/Marketplace',
  recommended_groups: 'Recommended Groups',
  trending_topics: 'Trending Topics',
  recommended_elections: 'Recommended Elections',
  elections_voting_ui: 'Elections Voting Screen',
  elections_verification_ui: 'Elections Verification Screen',
  elections_audit_ui: 'Elections Audit Screen',
  top_earners: 'Top Earners',
  accuracy_champions: 'Accuracy Champions',
  right_column: 'Right Column (Web)',
};

export const AD_EVENT_TYPES = {
  IMPRESSION: 'IMPRESSION',
  VIEW_2S: 'VIEW_2S',
  VIEW_6S: 'VIEW_6S',
  COMPLETE: 'COMPLETE',
  CLICK: 'CLICK',
  HIDE: 'HIDE',
  REPORT: 'REPORT',
};

/** Budget minimums (cents) – overridable from vottery_ads_admin_config */
export const DEFAULT_MIN_DAILY_BUDGET_CENTS = 500;   // $5
export const DEFAULT_MIN_CAMPAIGN_BUDGET_CENTS = 10000; // $100

/** Pricing benchmarks (display only; actual from admin/zone) */
export const PRICING_BENCHMARKS = {
  CPM_MIN: 3.20,
  CPM_MAX: 10.0,
  CPC_MIN: 0.10,
  CPC_MAX: 1.0,
  PREMIUM_SLOT_DAY_MIN: 40000,
  PREMIUM_SLOT_DAY_MAX: 160000,
};

// Batch-1 internal ads — user-facing copy (keep identical on Mobile: vottery_ads_constants.dart).
export const BATCH1_INTERNAL_ADS_DISABLED_TITLE = 'Internal Ads Disabled for Batch 1';
export const BATCH1_INTERNAL_ADS_DISABLED_BODY =
  'Vottery internal ads are intentionally disabled in Batch 1. Use external ad network integrations from the admin integrations panel.';
export const BATCH1_PARTICIPATORY_ADS_DISABLED_TITLE = 'Participatory Ads Disabled for Batch 1';
export const BATCH1_PARTICIPATORY_ADS_DISABLED_BODY =
  'Participatory/gamified internal ads are disabled in Batch 1. Continue with external ad network partners only.';

// Batch-1 hard guard: internal ad studios must stay disabled.
export const INTERNAL_ADS_BATCH1_DISABLED = true;
export const EXTERNAL_AD_NETWORK_INTEGRATIONS = ['Google AdSense'];
