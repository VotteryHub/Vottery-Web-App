import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve(
  process.cwd(),
  'docs',
  'certification-20260323',
  'feature-baseline-ledger-1-233.json'
);
const ledger = JSON.parse(fs.readFileSync(file, 'utf8'));
const rows = ledger.rows || [];

/**
 * Applied to every ledger row: Batch-1 control plane + navigation hub hygiene + Web bundle compile.
 * This does NOT imply each feature is functionally tested — baseline AMBER/GREEN rules still apply.
 */
const ORG_WIDE_WEB_EVIDENCE = [
  'node:scripts/run-certification-policy-audit.mjs',
  'npm:check:route-feature-keys',
  'npm:build',
];

/**
 * Static Flutter checks for any row whose availability includes a Mobile App surface.
 */
const FLUTTER_DUAL_PLATFORM_BASELINE = [
  'flutter:test/navigation/batch1_route_allowlist_policy_test.dart',
  'flutter:test/navigation/feature_parity_navigation_test.dart',
  'flutter:test/app_urls_parity_test.dart',
];

/** Flutter navigation / subscription parity (extra beyond dual-platform baseline). */
const mobileVerifiedIds = new Set([75, 76]);

/**
 * Cypress: `hub-parity-signoff.cy.js` — W1–W10 route-resolution smoke (no 404; hub or allowed redirect).
 */
const hubParitySmokeIds = new Set([
  18, 166, 167, 174, 175, 178, 179, 180, 184, 186,
]);

/**
 * Cypress: `certification-policy-regression.cy.js` — internal + participatory Batch-1 kill-switch copy.
 */
const certPolicyCypressIds = new Set([124, 132]);

/**
 * Cypress: `campaign-management-parity.cy.js` — campaign dashboard + sponsored-elections CPE hub.
 */
const CAMPAIGN_SPEC = 'cypress:e2e/campaign-management-parity.cy.js';
const campaignManagementParityIds = new Set([126, 127, 133, 134, 135]);

/**
 * Cypress: `ads-studios-analytics-parity.cy.js` — participatory + vottery ads studio + advertiser ROI.
 */
const ADS_ANALYTICS_SPEC = 'cypress:e2e/ads-studios-analytics-parity.cy.js';
const adsStudiosAnalyticsIds = new Set([124, 128, 129, 130, 131, 132]);

/**
 * Cypress: `template-gallery-api-docs-parity.cy.js` — template gallery + API documentation portal.
 * Ledger 226 (RESTful API Management Center) cited for T2 API docs route in the same spec file.
 */
const TEMPLATE_API_SPEC = 'cypress:e2e/template-gallery-api-docs-parity.cy.js';
const templateGalleryApiDocsIds = new Set([125, 226]);

/**
 * Cypress: `brand-webhook-api-parity.cy.js` — brand registration + REST API center + webhook hub.
 */
const BRAND_WEBHOOK_SPEC = 'cypress:e2e/brand-webhook-api-parity.cy.js';
const brandWebhookApiParityIds = new Set([123, 224, 226]);

/**
 * Cypress: `payment-locale-parity.cy.js` — payment hubs + localization route-resolution smoke.
 */
const PAYMENT_LOCALE_SPEC = 'cypress:e2e/payment-locale-parity.cy.js';
const paymentLocaleParityIds = new Set([73, 83, 87, 168, 171, 174]);
const PAYMENT_LOCALE_SERVICE_BEHAVIOR_EVIDENCE =
  'node:scripts/check-payment-locale-service-behavior.mjs';

/**
 * Cypress: `premium-subscription-wallet-signal.cy.js` — enhanced premium subscription center.
 */
const PREMIUM_WALLET_SPEC = 'cypress:e2e/premium-subscription-wallet-signal.cy.js';
const premiumWalletCypressIds = new Set([76]);

/**
 * Cypress: `route-guard-sanity.cy.js` — admin AI orchestration + monitoring routes load without 404.
 */
const ROUTE_GUARD_SPEC = 'cypress:e2e/route-guard-sanity.cy.js';
const routeGuardSanityIds = new Set([
  136, 137, 138, 139, 140, 143, 145, 150, 153, 154, 156, 157, 158, 159, 160,
  161, 162, 163, 164, 165, 168, 170, 172, 176, 177, 187,
  181, 182, 183, 185, 188, 189, 190, 191, 192, 194, 196, 197, 202, 209, 210,
  211, 212, 213, 214, 215, 216, 217, 220, 225, 227, 228,
  229, 230, 231, 232, 233,
]);

/**
 * Cypress: `ai-route-aliases-parity.cy.js` — Perplexity redirects + ML threat + carousel content alias routes.
 */
const AI_ROUTE_ALIASES_SPEC = 'cypress:e2e/ai-route-aliases-parity.cy.js';
/** Includes 203: spec visits `/continuous-ml-feedback-outcome-learning-center` (ledger title match; same React shell as auto-improving fraud hub in Routes). */
const aiRouteAliasesParityIds = new Set([148, 149, 155, 151, 144, 203]);
const AI_ROUTE_ALIASES_CONTRACT_PARITY_EVIDENCE =
  'node:scripts/check-ai-route-aliases-contract-parity.mjs';

/**
 * Cypress: `route-parity-tranche2.cy.js` — voter discovery, VP/wallet, social/groups, account
 * surfaces, accessibility, age verification, creator hubs, onboarding, premium (see spec `routes`).
 * **74** shares `/digital-wallet-hub` with **72** (prize redemption UI lives in wallet hub).
 * **30–32** share `/vp-redemption-marketplace-charity-hub`.
 * **28–29** share `/vp-economy-health-monitor-dashboard` (VP economy surface).
 */
const ROUTE_PARITY_TRANCHE2_SPEC = 'cypress:e2e/route-parity-tranche2.cy.js';
const routeParityTranche2Ids = new Set([
  20, 23, 25, 26, 28, 29, 30, 31, 32, 37, 39, 40, 41,
  50, 51, 52, 54, 55, 56, 57, 58, 59, 61, 62, 63, 65, 67, 69,
  72, 74, 75, 76, 78, 79, 81, 84, 90, 94,
]);

/**
 * Cypress: `voting-roles-routing.cy.js` — voting mode routes + creator insight routes + external gate.
 */
const VOTING_ROLES_SPEC = 'cypress:e2e/voting-roles-routing.cy.js';
const votingRolesRoutingIds = new Set([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  88, // SSO + auth callback flows in same spec as role smoke
  112, 113, 119, 117, 120,
]);

/**
 * Cypress: `enterprise-sso-route-flow.cy.js` — enterprise SSO integration + auth callback error path.
 */
const ENTERPRISE_SSO_SPEC = 'cypress:e2e/enterprise-sso-route-flow.cy.js';
const enterpriseSsoRouteFlowIds = new Set([88]);
const ENTERPRISE_SSO_CONTRACT_PARITY_EVIDENCE =
  'node:scripts/check-enterprise-sso-contract-parity.mjs';

/**
 * Cypress: `route-parity-stabilization.cy.js` — health, load/perf, WebSocket, cache, Supabase realtime, AI ops.
 */
const ROUTE_PARITY_STABILIZATION_SPEC = 'cypress:e2e/route-parity-stabilization.cy.js';
const routeParityStabilizationIds = new Set([
  189, 193, 195, 206, 208, 204, 205, 199, 198, 201,
]);

/**
 * Cypress: `stripe-payout-workflows.cy.js` — Stripe hub, creator earnings, Connect linking, payouts, settlement.
 */
const STRIPE_PAYOUT_SPEC = 'cypress:e2e/stripe-payout-workflows.cy.js';
const stripePayoutWorkflowIds = new Set([103, 104, 105, 169, 171, 173]);
const STRIPE_PAYOUT_CONTRACT_PARITY_EVIDENCE =
  'node:scripts/check-stripe-payout-contract-parity.mjs';

/**
 * Cypress: `fraud-detection-failover.cy.js` — AI fraud center, Perplexity fraud UI, failover, orchestration.
 */
const FRAUD_FAILOVER_SPEC = 'cypress:e2e/fraud-detection-failover.cy.js';
const fraudDetectionFailoverIds = new Set([146, 147, 152, 197, 199]);
const FRAUD_PERPLEXITY_CONTRACT_PARITY_EVIDENCE =
  'node:scripts/check-fraud-perplexity-contract-parity.mjs';

/**
 * Cypress: `sms-provider-failover.cy.js` — Telnyx, SMS compliance, failover dashboard, SMS analytics.
 */
const SMS_FAILOVER_SPEC = 'cypress:e2e/sms-provider-failover.cy.js';
/** Includes 222: spec visits `/automated-sms-health-check-suite-dashboard`. */
const smsProviderFailoverIds = new Set([218, 219, 221, 222, 223]);
const SMS_ALERT_CONTRACT_PARITY_EVIDENCE =
  'node:scripts/check-sms-alert-contract-parity.mjs';

/**
 * Cypress: `ai-orchestration.cy.js` — unified AI hubs, dependency risk, Gemini fallback path, Claude analytics panel.
 */
const AI_ORCHESTRATION_SPEC = 'cypress:e2e/ai-orchestration.cy.js';
const aiOrchestrationFailoverIds = new Set([196, 197, 198, 199, 200, 201]);
const AI_ORCHESTRATION_CONTRACT_PARITY_EVIDENCE =
  'node:scripts/check-ai-orchestration-contract-parity.mjs';

/**
 * Cypress: `claude-recommendations.cy.js` — Claude feed/overlay/curation/predictive routes (subset of ledger).
 */
const CLAUDE_RECOMMENDATIONS_SPEC = 'cypress:e2e/claude-recommendations.cy.js';
const claudeRecommendationsFlowIds = new Set([24, 141, 142, 201]);
const CLAUDE_RECOMMENDATIONS_CONTRACT_PARITY_EVIDENCE =
  'node:scripts/check-claude-recommendations-contract-parity.mjs';

/**
 * Cypress: `vote-casting.cy.js` — vote-in-elections hub, secure voting, elections dashboard,
 * verification + blockchain audit portals, receipt/XP intercepts (mocked REST).
 */
const VOTE_CASTING_SPEC = 'cypress:e2e/vote-casting.cy.js';
const voteCastingFlowIds = new Set([1, 11, 16, 18, 60, 96]);
const VOTE_CASTING_CONTRACT_PARITY_EVIDENCE =
  'node:scripts/check-vote-casting-contract-parity.mjs';

/**
 * Cypress: `achievement-unlock.cy.js` — gamification/VP/profile/rewards/notification/quest routes
 * with mocked gamification REST payloads.
 */
const ACHIEVEMENT_UNLOCK_SPEC = 'cypress:e2e/achievement-unlock.cy.js';
const achievementUnlockFlowIds = new Set([27, 33, 34, 35, 36, 43, 49, 68, 180]);
const ACHIEVEMENT_UNLOCK_CONTRACT_PARITY_EVIDENCE =
  'node:scripts/check-achievement-unlock-contract-parity.mjs';

/**
 * Cypress: `creator-suite-parity.cy.js` — creator studio/analytics route-resolution smoke.
 * Shared-route mapping notes:
 * - 95 + 100 use `/election-creation-studio` surface.
 * - 110 + 116 use `/real-time-analytics-dashboard` surface.
 */
const CREATOR_SUITE_SPEC = 'cypress:e2e/creator-suite-parity.cy.js';
const creatorSuiteParityIds = new Set([
  95, 97, 98, 99, 100, 101, 102, 106, 107, 108, 109,
  110, 111, 114, 115, 116, 118, 121, 122,
]);
const CREATOR_SUITE_CONTRACT_PARITY_EVIDENCE =
  'node:scripts/check-creator-suite-contract-parity.mjs';

/**
 * Cypress: `user-foundation-parity.cy.js` — feeds/discovery/notifications/onboarding/
 * localization/security/gamification route-resolution smoke.
 * Shared-route notes:
 * - 19 + 21 share home-feed route surface.
 * - 70 + 71 share notifications surface.
 * - 80 + 82 share guided onboarding/tutorial surface.
 * - 83 + 86 + 87 share localization surface.
 * - 89 + 91 + 92 + 93 share auth/session/security surfaces.
 * - 44 + 45 + 47 + 48 share unified gamification leaderboard/influence surface.
 */
const USER_FOUNDATION_SPEC = 'cypress:e2e/user-foundation-parity.cy.js';
const userFoundationParityIds = new Set([
  19, 21, 22, 44, 45, 46, 47, 48, 53, 64, 66, 70, 71, 73, 80, 82, 83, 86, 87, 89, 91, 92, 93,
]);

/**
 * Cypress: `crypto-compliance-parity.cy.js` — route-resolution + compliance copy smoke for
 * crypto admin surfaces. Not a cryptographic proof.
 * Shared-surface notes:
 * - 12/13/14/15 are represented by cryptographic + mixnet route surfaces.
 * - 17 (VVSG Compliance) is represented by visible VVSG/compliance panels.
 */
const CRYPTO_COMPLIANCE_SPEC = 'cypress:e2e/crypto-compliance-parity.cy.js';
const cryptoComplianceParityIds = new Set([12, 13, 14, 15, 17]);

/**
 * Cypress: `user-quality-attributes-parity.cy.js` — seasonal/multi-currency/adaptive-layout
 * route + UX smoke. This is not exhaustive performance/compliance certification.
 * Shared-surface notes:
 * - 38 is evidenced via unified gamification challenge surface.
 * - 77 is evidenced via VP universal currency + multi-currency settlement surfaces.
 * - 85 is evidenced via responsive viewport layout smoke.
 */
const USER_QUALITY_SPEC = 'cypress:e2e/user-quality-attributes-parity.cy.js';
const userQualityAttributeIds = new Set([38, 77, 85]);

/**
 * Cypress: `critical-path-vote-to-payout.cy.js` — condensed vote hub → secure interface →
 * verification portal (no wallet/payout route visits in current spec).
 */
const CRITICAL_PATH_VOTE_SPEC = 'cypress:e2e/critical-path-vote-to-payout.cy.js';
const criticalPathVoteToPayoutIds = new Set([1, 16, 18, 60]);

/**
 * Cypress: `feature-integration-suite.cy.js` — onboarding, home feed, payment orchestration,
 * production monitoring, load/perf center, `/security-compliance-audit-screen`, cross-domain sync (mocked).
 * Omits **184**: hub-parity covers `/security-compliance-automation-center`; this spec does not visit that path.
 */
const FEATURE_INTEGRATION_SPEC = 'cypress:e2e/feature-integration-suite.cy.js';
const featureIntegrationSuiteIds = new Set([42, 78, 96, 175, 187, 193, 207]);
const FEATURE_INTEGRATION_CONTRACT_PARITY_EVIDENCE =
  'node:scripts/check-feature-integration-contract-parity.mjs';

/** Flutter widget tests — Batch-1 ads policy copy parity with Web `BATCH1_*` constants. */
const mobileBatch1AdsPolicyCopyIds = new Set([124]);
/** Flutter route/URL parity for payment + localization surfaces. */
const mobilePaymentLocaleParityIds = new Set([73, 83, 87, 168, 171, 174]);

/** Honest Batch-1 UI disclosure for advanced crypto admin hubs (not a crypto proof). */
const cryptoBatch1DisclosureIds = new Set([12, 13, 14, 15]);
/** Crypto/compliance critical rows that must carry executable crypto checks. */
const cryptoCriticalEvidenceIds = new Set([12, 13, 14, 15, 17]);
const CRYPTO_BATCH1_DISCLOSURE_EVIDENCE =
  'web:src/components/ui/CryptographicBatch1ScopeBanner.jsx; web:src/pages/cryptographic-security-management-center/index.jsx; web:src/pages/vote-anonymity-mixnet-control-hub/index.jsx';
const CRYPTO_PRIMITIVE_CHECK_EVIDENCE =
  'node:scripts/check-cryptographic-primitives.mjs';
const CRYPTO_ROUTE_CONTRACT_CHECK_EVIDENCE =
  'node:scripts/check-crypto-route-contract-parity.mjs';
const VOTE_CRYPTO_CONTRACT_CHECK_EVIDENCE =
  'node:scripts/check-vote-crypto-contract-parity.mjs';
const MOBILE_CRYPTO_TEST_EVIDENCE =
  'flutter:test/services/cryptographic_service_test.dart';

const HUB_SPEC = 'cypress:e2e/hub-parity-signoff.cy.js';
const POLICY_SPEC = 'cypress:e2e/certification-policy-regression.cy.js';

function uniqueJoin(parts) {
  return [...new Set(parts.filter(Boolean))].join('; ');
}

function rowIncludesMobileApp(row) {
  return (row.availability || '').includes('Mobile App');
}

for (const row of rows) {
  row.policyCompliance = 'PASS_POLICY_AUDIT_BASELINE';
  const parts = [...ORG_WIDE_WEB_EVIDENCE];

  if (rowIncludesMobileApp(row)) {
    parts.push(...FLUTTER_DUAL_PLATFORM_BASELINE);
  }

  if (mobileVerifiedIds.has(row.id)) {
    parts.push('flutter:test/navigation/premium_subscription_navigation_test.dart');
  }
  if (hubParitySmokeIds.has(row.id)) {
    parts.push(HUB_SPEC);
  }
  if (certPolicyCypressIds.has(row.id)) {
    parts.push(POLICY_SPEC);
  }
  if (campaignManagementParityIds.has(row.id)) {
    parts.push(CAMPAIGN_SPEC);
  }
  if (adsStudiosAnalyticsIds.has(row.id)) {
    parts.push(ADS_ANALYTICS_SPEC);
  }
  if (templateGalleryApiDocsIds.has(row.id)) {
    parts.push(TEMPLATE_API_SPEC);
  }
  if (brandWebhookApiParityIds.has(row.id)) {
    parts.push(BRAND_WEBHOOK_SPEC);
  }
  if (paymentLocaleParityIds.has(row.id)) {
    parts.push(PAYMENT_LOCALE_SPEC);
  }
  if (paymentLocaleParityIds.has(row.id)) {
    parts.push(PAYMENT_LOCALE_SERVICE_BEHAVIOR_EVIDENCE);
  }
  if (premiumWalletCypressIds.has(row.id)) {
    parts.push(PREMIUM_WALLET_SPEC);
  }
  if (routeGuardSanityIds.has(row.id)) {
    parts.push(ROUTE_GUARD_SPEC);
  }
  if (aiRouteAliasesParityIds.has(row.id)) {
    parts.push(AI_ROUTE_ALIASES_SPEC);
  }
  if (aiRouteAliasesParityIds.has(row.id)) {
    parts.push(AI_ROUTE_ALIASES_CONTRACT_PARITY_EVIDENCE);
  }
  if (aiRouteAliasesParityIds.has(row.id)) {
    parts.push('flutter:test/navigation/ai_route_aliases_contract_test.dart');
  }
  if (routeParityTranche2Ids.has(row.id)) {
    parts.push(ROUTE_PARITY_TRANCHE2_SPEC);
  }
  if (votingRolesRoutingIds.has(row.id)) {
    parts.push(VOTING_ROLES_SPEC);
  }
  if (enterpriseSsoRouteFlowIds.has(row.id)) {
    parts.push(ENTERPRISE_SSO_SPEC);
  }
  if (enterpriseSsoRouteFlowIds.has(row.id)) {
    parts.push(ENTERPRISE_SSO_CONTRACT_PARITY_EVIDENCE);
  }
  if (enterpriseSsoRouteFlowIds.has(row.id)) {
    parts.push('flutter:test/navigation/enterprise_sso_contract_test.dart');
  }
  if (routeParityStabilizationIds.has(row.id)) {
    parts.push(ROUTE_PARITY_STABILIZATION_SPEC);
  }
  if (stripePayoutWorkflowIds.has(row.id)) {
    parts.push(STRIPE_PAYOUT_SPEC);
  }
  if (stripePayoutWorkflowIds.has(row.id)) {
    parts.push(STRIPE_PAYOUT_CONTRACT_PARITY_EVIDENCE);
  }
  if (stripePayoutWorkflowIds.has(row.id)) {
    parts.push('flutter:test/navigation/stripe_payout_contract_test.dart');
  }
  if (fraudDetectionFailoverIds.has(row.id)) {
    parts.push(FRAUD_FAILOVER_SPEC);
  }
  if (fraudDetectionFailoverIds.has(row.id)) {
    parts.push(FRAUD_PERPLEXITY_CONTRACT_PARITY_EVIDENCE);
  }
  if (fraudDetectionFailoverIds.has(row.id)) {
    parts.push('flutter:test/navigation/fraud_perplexity_contract_test.dart');
  }
  if (smsProviderFailoverIds.has(row.id)) {
    parts.push(SMS_FAILOVER_SPEC);
  }
  if (smsProviderFailoverIds.has(row.id)) {
    parts.push(SMS_ALERT_CONTRACT_PARITY_EVIDENCE);
  }
  if (smsProviderFailoverIds.has(row.id)) {
    parts.push('flutter:test/navigation/sms_alerts_contract_test.dart');
  }
  if (aiOrchestrationFailoverIds.has(row.id)) {
    parts.push(AI_ORCHESTRATION_SPEC);
  }
  if (aiOrchestrationFailoverIds.has(row.id)) {
    parts.push(AI_ORCHESTRATION_CONTRACT_PARITY_EVIDENCE);
  }
  if (aiOrchestrationFailoverIds.has(row.id)) {
    parts.push('flutter:test/navigation/ai_orchestration_contract_test.dart');
  }
  if (claudeRecommendationsFlowIds.has(row.id)) {
    parts.push(CLAUDE_RECOMMENDATIONS_SPEC);
  }
  if (claudeRecommendationsFlowIds.has(row.id)) {
    parts.push(CLAUDE_RECOMMENDATIONS_CONTRACT_PARITY_EVIDENCE);
  }
  if (claudeRecommendationsFlowIds.has(row.id)) {
    parts.push(
      'flutter:test/navigation/claude_recommendations_contract_test.dart'
    );
  }
  if (voteCastingFlowIds.has(row.id)) {
    parts.push(VOTE_CASTING_SPEC);
  }
  if (voteCastingFlowIds.has(row.id)) {
    parts.push(VOTE_CASTING_CONTRACT_PARITY_EVIDENCE);
  }
  if (voteCastingFlowIds.has(row.id)) {
    parts.push('flutter:test/navigation/vote_casting_contract_test.dart');
  }
  if (achievementUnlockFlowIds.has(row.id)) {
    parts.push(ACHIEVEMENT_UNLOCK_SPEC);
  }
  if (achievementUnlockFlowIds.has(row.id)) {
    parts.push(ACHIEVEMENT_UNLOCK_CONTRACT_PARITY_EVIDENCE);
  }
  if (achievementUnlockFlowIds.has(row.id)) {
    parts.push(
      'flutter:test/navigation/achievement_unlock_contract_test.dart'
    );
  }
  if (creatorSuiteParityIds.has(row.id)) {
    parts.push(CREATOR_SUITE_SPEC);
  }
  if (creatorSuiteParityIds.has(row.id)) {
    parts.push(CREATOR_SUITE_CONTRACT_PARITY_EVIDENCE);
  }
  if (creatorSuiteParityIds.has(row.id)) {
    parts.push('flutter:test/navigation/creator_suite_contract_test.dart');
  }
  if (userFoundationParityIds.has(row.id)) {
    parts.push(USER_FOUNDATION_SPEC);
  }
  if (cryptoComplianceParityIds.has(row.id)) {
    parts.push(CRYPTO_COMPLIANCE_SPEC);
  }
  if (userQualityAttributeIds.has(row.id)) {
    parts.push(USER_QUALITY_SPEC);
  }
  if (criticalPathVoteToPayoutIds.has(row.id)) {
    parts.push(CRITICAL_PATH_VOTE_SPEC);
  }
  if (featureIntegrationSuiteIds.has(row.id)) {
    parts.push(FEATURE_INTEGRATION_SPEC);
  }
  if (featureIntegrationSuiteIds.has(row.id)) {
    parts.push(FEATURE_INTEGRATION_CONTRACT_PARITY_EVIDENCE);
  }
  if (featureIntegrationSuiteIds.has(row.id)) {
    parts.push('flutter:test/navigation/feature_integration_contract_test.dart');
  }
  if (mobileBatch1AdsPolicyCopyIds.has(row.id)) {
    parts.push('flutter:test/presentation/batch1_ads_policy_copy_test.dart');
  }
  if (mobilePaymentLocaleParityIds.has(row.id)) {
    parts.push('flutter:test/navigation/payment_locale_contract_test.dart');
  }
  if (cryptoCriticalEvidenceIds.has(row.id)) {
    parts.push(CRYPTO_PRIMITIVE_CHECK_EVIDENCE);
    parts.push(CRYPTO_ROUTE_CONTRACT_CHECK_EVIDENCE);
    parts.push(VOTE_CRYPTO_CONTRACT_CHECK_EVIDENCE);
    if (rowIncludesMobileApp(row)) {
      parts.push(MOBILE_CRYPTO_TEST_EVIDENCE);
    }
  }
  if (cryptoBatch1DisclosureIds.has(row.id)) {
    parts.push(CRYPTO_BATCH1_DISCLOSURE_EVIDENCE);
  }

  row.regressionEvidence = uniqueJoin(parts);
}

ledger.methodology =
  'Heuristic baseline map. Every row includes org-wide Web platform checks (policy audit, nav route-feature-key gate, production build) plus Flutter static parity tests when Mobile App is in scope. Additional Cypress specs map to feature IDs for advertiser/developer, routing, fraud/AI/SMS/Stripe ops, admin guard, voting-mode, SSO smoke, vote-casting/achievement/integration smokes (mocked REST where applicable). Per-feature GREEN still requires feature-specific proof beyond this baseline.';
ledger.updatedAt = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(ledger, null, 2));
console.log('Applied baseline regression evidence annotations (org-wide + Cypress domain maps)');
