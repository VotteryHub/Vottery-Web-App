import fs from 'node:fs';
import path from 'node:path';

const webRoot = process.cwd();
const mobileRoot = path.resolve(webRoot, '..', 'Vottery-Mobile-App');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function assertContains(haystack, needle, label) {
  if (!haystack.includes(needle)) {
    throw new Error(`Missing ${label}: ${needle}`);
  }
}

function assertMatches(haystack, regex, label) {
  if (!regex.test(haystack)) {
    throw new Error(`Missing ${label}: ${regex}`);
  }
}

const navigationHubRoutes = read(
  path.resolve(webRoot, 'src', 'constants', 'navigationHubRoutes.js')
);
const routeFeatureKeys = read(
  path.resolve(webRoot, 'src', 'config', 'routeFeatureKeys.js')
);
const lotteryPaymentService = read(
  path.resolve(webRoot, 'src', 'services', 'lotteryPaymentService.js')
);
const localeService = read(
  path.resolve(webRoot, 'src', 'services', 'localeService.js')
);
const mobileAppUrls = read(
  path.resolve(mobileRoot, 'lib', 'constants', 'app_urls.dart')
);
const evidenceScript = read(
  path.resolve(webRoot, 'scripts', 'apply-regression-evidence.mjs')
);

// Web route constants (source of truth for canonical paths)
assertMatches(
  navigationHubRoutes,
  /AUTOMATED_PAYMENT_PROCESSING_HUB_ROUTE[\s\S]*\/automated-payment-processing-hub/,
  'web automated payment route constant'
);
assertMatches(
  navigationHubRoutes,
  /STRIPE_PAYMENT_INTEGRATION_HUB_ROUTE[\s\S]*\/stripe-payment-integration-hub/,
  'web stripe payment route constant'
);
assertMatches(
  navigationHubRoutes,
  /INTERNATIONAL_PAYMENT_DISPUTE_RESOLUTION_CENTER_ROUTE[\s\S]*\/international-payment-dispute-resolution-center/,
  'web international dispute route constant'
);
assertMatches(
  navigationHubRoutes,
  /GAMIFICATION_MULTI_LANGUAGE_INTELLIGENCE_CENTER_ROUTE[\s\S]*\/gamification-multi-language-intelligence-center/,
  'web multi-language route constant'
);
assertMatches(
  navigationHubRoutes,
  /LOCALIZATION_TAX_REPORTING_INTELLIGENCE_CENTER_ROUTE[\s\S]*\/localization-tax-reporting-intelligence-center/,
  'web localization route constant'
);

// Web feature key mapping checks for payment/localization rows with feature toggles.
assertContains(
  routeFeatureKeys,
  "'gamification-multi-language-intelligence-center': 'gamified_elections'",
  'web multi-language feature key'
);
assertContains(
  routeFeatureKeys,
  "'stripe-payment-integration-hub': 'stripe_connect_account_linking_interface'",
  'web stripe feature key'
);
assertContains(
  routeFeatureKeys,
  "'international-payment-dispute-resolution-center': 'security_compliance_audit_screen'",
  'web dispute feature key'
);

// Service contract checks
assertContains(
  lotteryPaymentService,
  'export const lotteryPaymentService = gamifiedPaymentService;',
  'lottery payment compatibility export'
);
assertContains(
  localeService,
  ".from('supported_locales')",
  'locale service source table'
);
assertContains(
  localeService,
  ".eq('enabled', true)",
  'locale service enabled filter'
);

// Mobile parity URL constants
assertContains(
  mobileAppUrls,
  'static const String stripePaymentIntegrationHub =',
  'mobile stripe URL constant'
);
assertContains(
  mobileAppUrls,
  'static const String automatedPaymentProcessingHub =',
  'mobile automated payment URL constant'
);
assertContains(
  mobileAppUrls,
  'static const String internationalPaymentDisputeResolution =',
  'mobile dispute URL constant'
);
assertContains(
  mobileAppUrls,
  'static const String localizationTaxReportingIntelligenceCenter =',
  'mobile localization URL constant'
);
assertContains(
  mobileAppUrls,
  'static const String gamificationMultiLanguageIntelligenceCenter =',
  'mobile multi-language URL constant'
);

// Regression evidence map checks
assertContains(
  evidenceScript,
  "const PAYMENT_LOCALE_SPEC = 'cypress:e2e/payment-locale-parity.cy.js';",
  'payment-locale cypress evidence token'
);
assertContains(
  evidenceScript,
  'const paymentLocaleParityIds = new Set([73, 83, 87, 168, 171, 174]);',
  'payment-locale mapped IDs'
);
assertContains(
  evidenceScript,
  "'flutter:test/navigation/payment_locale_contract_test.dart'",
  'payment-locale flutter evidence token'
);

console.log('Payment and localization contract parity checks passed (Web <-> Mobile).');
