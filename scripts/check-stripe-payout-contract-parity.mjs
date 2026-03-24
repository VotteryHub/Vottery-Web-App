import fs from 'node:fs';
import path from 'node:path';

const webRoot = process.cwd();
const mobileRoot = path.resolve(webRoot, '..', 'Vottery-Mobile-App');

const read = (p) => fs.readFileSync(p, 'utf8');
const assertContains = (haystack, needle, label) => {
  if (!haystack.includes(needle)) {
    throw new Error(`Missing ${label}: ${needle}`);
  }
};

const navigationHubRoutes = read(
  path.resolve(webRoot, 'src', 'constants', 'navigationHubRoutes.js')
);
const routeFeatureKeys = read(
  path.resolve(webRoot, 'src', 'config', 'routeFeatureKeys.js')
);
const appRoutes = read(path.resolve(mobileRoot, 'lib', 'routes', 'app_routes.dart'));
const routeRegistry = read(
  path.resolve(mobileRoot, 'lib', 'config', 'route_registry.dart')
);
const appUrls = read(path.resolve(mobileRoot, 'lib', 'constants', 'app_urls.dart'));
const evidenceScript = read(
  path.resolve(webRoot, 'scripts', 'apply-regression-evidence.mjs')
);

assertContains(
  navigationHubRoutes,
  "export const STRIPE_PAYMENT_INTEGRATION_HUB_ROUTE = '/stripe-payment-integration-hub';",
  'web stripe payment integration route constant'
);
assertContains(
  navigationHubRoutes,
  "export const ENHANCED_CREATOR_PAYOUT_DASHBOARD_WITH_STRIPE_CONNECT_INTEGRATION_ROUTE = '/enhanced-creator-payout-dashboard-with-stripe-connect-integration';",
  'web creator payout stripe route constant'
);
assertContains(
  navigationHubRoutes,
  "export const ADMIN_PAYOUT_VERIFICATION_DASHBOARD_ROUTE = '/admin-payout-verification-dashboard';",
  'web admin payout verification route constant'
);
assertContains(
  navigationHubRoutes,
  "export const STRIPE_CONNECT_LINKING_ROUTE = '/stripe-connect-linking';",
  'web stripe connect linking route constant'
);
assertContains(
  navigationHubRoutes,
  "export const UNIFIED_PAYMENT_ORCHESTRATION_HUB_ROUTE = '/unified-payment-orchestration-hub';",
  'web unified payment route constant'
);

assertContains(
  routeFeatureKeys,
  "'stripe-payment-integration-hub': 'stripe_connect_account_linking_interface'",
  'web stripe payment feature key'
);
assertContains(
  routeFeatureKeys,
  "'enhanced-creator-payout-dashboard-with-stripe-connect-integration': 'enhanced_creator_payout_dashboard_stripe_connect'",
  'web creator payout feature key'
);
assertContains(
  routeFeatureKeys,
  "'admin-payout-verification-dashboard': 'security_compliance_audit_screen'",
  'web admin payout verification feature key'
);
assertContains(
  routeFeatureKeys,
  "'stripe-connect-linking': 'stripe_connect_account_linking_interface'",
  'web stripe connect linking feature key'
);
assertContains(
  routeFeatureKeys,
  "'unified-payment-orchestration-hub': 'unified_payment_orchestration_hub'",
  'web unified payment feature key'
);

assertContains(
  appRoutes,
  'static const String unifiedPaymentOrchestrationHubWebCanonical =',
  'mobile unified payment canonical route'
);
assertContains(
  appRoutes,
  'static const String multiCurrencySettlementDashboardWebCanonical =',
  'mobile multi-currency settlement canonical route'
);
assertContains(
  appRoutes,
  'static const String enhancedMultiCurrencySettlementDashboardWebCanonical =',
  'mobile enhanced settlement canonical route'
);

assertContains(
  routeRegistry,
  'case AppRoutes.unifiedPaymentOrchestrationHubWebCanonical:',
  'mobile registry unified payment mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.multiCurrencySettlementDashboardWebCanonical:',
  'mobile registry multi-currency mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.enhancedMultiCurrencySettlementDashboardWebCanonical:',
  'mobile registry enhanced settlement mapping'
);

assertContains(
  appUrls,
  'static const String stripePaymentIntegrationHub =',
  'mobile URL stripe integration constant'
);
assertContains(
  appUrls,
  'static const String automatedPayoutCalculationEngine =',
  'mobile URL payout calculation constant'
);
assertContains(
  appUrls,
  'static const String countryBasedPayoutProcessingEngine =',
  'mobile URL country payout constant'
);
assertContains(
  appUrls,
  'static const String enhancedCreatorPayoutDashboard =',
  'mobile URL enhanced creator payout constant'
);
assertContains(
  appUrls,
  'static const String internationalPaymentDisputeResolution =',
  'mobile URL payment dispute constant'
);

assertContains(
  evidenceScript,
  'const stripePayoutWorkflowIds = new Set([103, 104, 105, 169, 171, 173]);',
  'stripe payout mapped IDs'
);
assertContains(
  evidenceScript,
  "'node:scripts/check-stripe-payout-contract-parity.mjs'",
  'stripe payout node evidence token'
);
assertContains(
  evidenceScript,
  "'flutter:test/navigation/stripe_payout_contract_test.dart'",
  'stripe payout flutter evidence token'
);

console.log('Stripe payout contract parity checks passed (Web <-> Mobile).');
