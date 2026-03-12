/**
 * Vottery Ads Studio – shared constants (Web + Mobile parity).
 * Sync with Flutter: lib/constants/vottery_ads_constants.dart
 */

export const VOTTERY_ADS_ROUTE = '/vottery-ads-studio';
export const CAMPAIGN_MANAGEMENT_ROUTE = '/campaign-management-dashboard';
export const ADVERTISER_ANALYTICS_ROUTE = '/advertiser-analytics-roi-dashboard';

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
