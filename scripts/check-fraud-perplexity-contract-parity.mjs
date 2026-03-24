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

const routeConstants = read(
  path.resolve(webRoot, 'src', 'constants', 'navigationHubRoutes.js')
);
const routeFeatureKeys = read(
  path.resolve(webRoot, 'src', 'config', 'routeFeatureKeys.js')
);
const appRoutes = read(
  path.resolve(mobileRoot, 'lib', 'routes', 'app_routes.dart')
);
const routeRegistry = read(
  path.resolve(mobileRoot, 'lib', 'config', 'route_registry.dart')
);
const appUrls = read(
  path.resolve(mobileRoot, 'lib', 'constants', 'app_urls.dart')
);
const evidenceScript = read(
  path.resolve(webRoot, 'scripts', 'apply-regression-evidence.mjs')
);

assertContains(
  routeConstants,
  "export const FRAUD_DETECTION_ALERT_MANAGEMENT_CENTER_ROUTE = '/fraud-detection-alert-management-center';",
  'web fraud detection route constant'
);
assertContains(
  routeConstants,
  "export const ADVANCED_PERPLEXITY_FRAUD_INTELLIGENCE_CENTER_ROUTE = '/advanced-perplexity-fraud-intelligence-center';",
  'web perplexity fraud intelligence route constant'
);
assertContains(
  routeConstants,
  "export const ADVANCED_PERPLEXITY_FRAUD_FORECASTING_CENTER_ROUTE = '/advanced-perplexity-fraud-forecasting-center';",
  'web perplexity fraud forecasting route constant'
);
assertContains(
  routeConstants,
  "export const ADVANCED_ML_THREAT_DETECTION_CENTER_ROUTE = '/advanced-ml-threat-detection-center';",
  'web ml threat route constant'
);
assertContains(
  routeConstants,
  "export const PERPLEXITY_MARKET_RESEARCH_INTELLIGENCE_CENTER_ROUTE = '/perplexity-market-research-intelligence-center';",
  'web perplexity market research route constant'
);
assertContains(
  routeConstants,
  "export const PERPLEXITY_STRATEGIC_PLANNING_CENTER_ROUTE = '/perplexity-strategic-planning-center';",
  'web perplexity planning route constant'
);
assertContains(
  routeConstants,
  "export const PERPLEXITY_CAROUSEL_INTELLIGENCE_DASHBOARD_ROUTE = '/perplexity-carousel-intelligence-dashboard';",
  'web perplexity carousel route constant'
);

assertContains(
  routeFeatureKeys,
  "'fraud-detection-alert-management-center': 'fraud_detection_alert_management_center'",
  'web fraud feature key'
);
assertContains(
  routeFeatureKeys,
  "'advanced-perplexity-fraud-intelligence-center': 'advanced_perplexity_fraud_intelligence_center'",
  'web perplexity intelligence feature key'
);
assertContains(
  routeFeatureKeys,
  "'advanced-perplexity-fraud-forecasting-center': 'advanced_perplexity_fraud_forecasting_center'",
  'web perplexity forecasting feature key'
);
assertContains(
  routeFeatureKeys,
  "'advanced-ml-threat-detection-center': 'fraud_detection_alert_management_center'",
  'web ml threat feature key'
);
assertContains(
  routeFeatureKeys,
  "'perplexity-market-research-intelligence-center': 'advanced_perplexity_fraud_intelligence_center'",
  'web market research feature key'
);
assertContains(
  routeFeatureKeys,
  "'perplexity-strategic-planning-center': 'advanced_perplexity_fraud_forecasting_center'",
  'web strategic planning feature key'
);

assertContains(
  appRoutes,
  'static const String fraudDetectionAlertManagementCenterWebCanonical =',
  'mobile fraud canonical route'
);
assertContains(
  appRoutes,
  'static const String advancedMlThreatDetectionCenterWebCanonical =',
  'mobile ml threat canonical route'
);
assertContains(
  appRoutes,
  'static const String predictiveAnomalyAlertingDeviationMonitoringHubWebCanonical =',
  'mobile anomaly canonical route'
);
assertContains(
  appRoutes,
  'static const String perplexityMarketResearchIntelligenceCenterWebCanonical =',
  'mobile market research canonical route'
);
assertContains(
  appRoutes,
  'static const String perplexityStrategicPlanningCenterWebCanonical =',
  'mobile strategic planning canonical route'
);
assertContains(
  appRoutes,
  'static const String perplexityCarouselIntelligenceDashboardWebCanonical =',
  'mobile carousel canonical route'
);

assertContains(
  routeRegistry,
  'case AppRoutes.fraudDetectionAlertManagementCenterWebCanonical:',
  'mobile registry fraud canonical mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.advancedMlThreatDetectionCenterWebCanonical:',
  'mobile registry ml threat canonical mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.predictiveAnomalyAlertingDeviationMonitoringHubWebCanonical:',
  'mobile registry anomaly canonical mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.perplexityMarketResearchIntelligenceCenterWebCanonical:',
  'mobile registry market research canonical mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.perplexityCarouselIntelligenceDashboardWebCanonical:',
  'mobile registry carousel canonical mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.perplexityStrategicPlanningCenterWebCanonical:',
  'mobile registry strategic planning canonical mapping'
);

assertContains(
  appUrls,
  'static const String fraudDetectionAlertManagementCenter =',
  'mobile app URL fraud constant'
);
assertContains(
  appUrls,
  'static const String advancedPerplexityFraudIntelligenceCenter =',
  'mobile app URL perplexity intelligence constant'
);
assertContains(
  appUrls,
  'static const String advancedPerplexityFraudForecastingCenter =',
  'mobile app URL perplexity forecasting constant'
);
assertContains(
  appUrls,
  'static const String advancedMlThreatDetectionCenter =',
  'mobile app URL ml threat constant'
);
assertContains(
  appUrls,
  'static const String perplexityMarketResearchIntelligenceCenter =',
  'mobile app URL market research constant'
);
assertContains(
  appUrls,
  'static const String perplexityStrategicPlanningCenter =',
  'mobile app URL strategic planning constant'
);
assertContains(
  appUrls,
  'static const String perplexityCarouselIntelligenceDashboard =',
  'mobile app URL carousel constant'
);

assertContains(
  evidenceScript,
  'const fraudDetectionFailoverIds = new Set([146, 147, 152, 197, 199]);',
  'fraud/perplexity mapped IDs'
);
assertContains(
  evidenceScript,
  "'node:scripts/check-fraud-perplexity-contract-parity.mjs'",
  'fraud/perplexity node evidence token'
);
assertContains(
  evidenceScript,
  "'flutter:test/navigation/fraud_perplexity_contract_test.dart'",
  'fraud/perplexity flutter evidence token'
);

console.log('Fraud/perplexity contract parity checks passed (Web <-> Mobile).');
