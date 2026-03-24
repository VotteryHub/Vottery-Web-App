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
  "export const ELECTION_CREATION_STUDIO_ROUTE = '/election-creation-studio';",
  'web election creation route constant'
);
assertContains(
  navigationHubRoutes,
  "export const CREATOR_MONETIZATION_STUDIO_ROUTE = '/creator-monetization-studio';",
  'web creator monetization route constant'
);
assertContains(
  navigationHubRoutes,
  "export const CREATOR_SUCCESS_ACADEMY_ROUTE = '/creator-success-academy';",
  'web creator success route constant'
);
assertContains(
  navigationHubRoutes,
  "export const CREATOR_REVENUE_FORECASTING_DASHBOARD_ROUTE = '/creator-revenue-forecasting-dashboard';",
  'web creator revenue forecasting route constant'
);
assertContains(
  navigationHubRoutes,
  "export const REAL_TIME_ANALYTICS_DASHBOARD_ROUTE = '/real-time-analytics-dashboard';",
  'web real-time analytics route constant'
);
assertContains(
  navigationHubRoutes,
  "export const CREATOR_MARKETPLACE_SCREEN_ROUTE = '/creator-marketplace-screen';",
  'web creator marketplace route constant'
);

assertContains(
  routeFeatureKeys,
  "'creator-monetization-studio': 'creator_monetization_studio'",
  'web creator monetization feature key'
);
assertContains(
  routeFeatureKeys,
  "'creator-success-academy': 'creator_success_academy'",
  'web creator success feature key'
);
assertContains(
  routeFeatureKeys,
  "'election-creation-studio': 'election_creation'",
  'web election creation feature key'
);

assertContains(
  appRoutes,
  'static const String electionCreationStudioWebCanonical =',
  'mobile election creation canonical route'
);
assertContains(
  appRoutes,
  'static const String creatorMonetizationStudioWebCanonical =',
  'mobile creator monetization canonical route'
);
assertContains(
  appRoutes,
  'static const String creatorSuccessAcademyWebCanonical =',
  'mobile creator success canonical route'
);
assertContains(
  appRoutes,
  'static const String creatorRevenueForecastingDashboardWebCanonical =',
  'mobile creator revenue canonical route'
);
assertContains(
  appRoutes,
  'static const String realTimeAnalyticsDashboardWeb =',
  'mobile real-time analytics web route'
);

assertContains(
  routeRegistry,
  'case AppRoutes.electionCreationStudioWebCanonical:',
  'mobile registry election creation mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.creatorMonetizationStudioWebCanonical:',
  'mobile registry creator monetization mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.creatorSuccessAcademyWebCanonical:',
  'mobile registry creator success mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.creatorRevenueForecastingDashboardWebCanonical:',
  'mobile registry creator revenue mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.realTimeAnalyticsDashboardWeb:',
  'mobile registry real-time analytics mapping'
);

assertContains(
  appUrls,
  'static const String electionCreationStudio =',
  'mobile URL election creation constant'
);
assertContains(
  appUrls,
  'static const String creatorMonetizationStudio =',
  'mobile URL creator monetization constant'
);
assertContains(
  appUrls,
  'static const String creatorSuccessAcademy =',
  'mobile URL creator success constant'
);
assertContains(
  appUrls,
  'static const String creatorRevenueForecastingDashboard =',
  'mobile URL creator revenue constant'
);
assertContains(
  appUrls,
  'static const String realTimeAnalyticsDashboard =',
  'mobile URL real-time analytics constant'
);
assertContains(
  appUrls,
  'static const String creatorMarketplaceScreen =',
  'mobile URL creator marketplace constant'
);

assertContains(
  evidenceScript,
  'const creatorSuiteParityIds = new Set([',
  'creator suite mapped IDs'
);
assertContains(
  evidenceScript,
  "'node:scripts/check-creator-suite-contract-parity.mjs'",
  'creator suite node evidence token'
);
assertContains(
  evidenceScript,
  "'flutter:test/navigation/creator_suite_contract_test.dart'",
  'creator suite flutter evidence token'
);

console.log('Creator suite contract parity checks passed (Web <-> Mobile).');
